'use strict';

const { tokenFor } = require('./keywords.cjs');

/**
 * Rewrites `cursor: pointer` (and every other keyword in keywords.cjs) to
 * `cursor: var(--dsc-cursor-pointer, pointer)` in every stylesheet the
 * Astro/Vite build processes: global CSS and every component <style> block.
 * The tokens are defined in src/styles/cursor.css; the keyword fallback keeps the
 * native cursor wherever a token is missing.
 *
 * Every rule that sets the pointer also gets an `:active` twin using
 * --dsc-cursor-pointer-press, so holding the button on anything clickable
 * shows the tap rays. The twin is scoped to the rule's own selectors, so a
 * press only restyles the pressed element — no document-wide recalc.
 *
 * Registered in postcss.config.cjs (Vite picks it up for every stylesheet).
 * Ported from Pilot 100's cursor plugin.
 */
function dscCursors() {
  return {
    postcssPlugin: 'dsc-cursors',
    // OnceExit so every other plugin has already emitted its rules.
    OnceExit(root) {
      const pointerDecls = [];
      root.walkDecls(/^cursor$/i, (decl) => {
        const value = decl.value.trim().toLowerCase();
        if (CONTEXTUAL.has(value)) {
          // `auto` means "let the UA pick": the I-beam on text fields, the
          // arrow elsewhere.
          if (insideForcedColors(decl)) return;
          const token = targetsTextField(decl.parent) ? '--dsc-cursor-text' : '--dsc-cursor';
          decl.value = `var(${token}, auto)`;
          return;
        }
        const next = tokenFor(value);
        if (!next) return;
        decl.value = next;
        if (value === 'pointer') pointerDecls.push(decl);
      });
      pointerDecls.forEach(addPressTwin);
    },
  };
}

const CONTEXTUAL = new Set(['auto', 'initial']);
const PSEUDO_ELEMENT = /(::[\w-]+(\([^)]*\))?|:(before|after|first-line|first-letter))$/i;

/** `.card { cursor: pointer }` -> also `.card:active { cursor: <press> }`. */
function addPressTwin(decl) {
  const rule = decl.parent;
  if (!rule || rule.type !== 'rule' || insideKeyframes(rule)) return;
  const selectors = rule.selectors.map(withActive).filter(Boolean);
  if (!selectors.length) return;
  const twin = rule.clone({ selectors });
  twin.removeAll();
  twin.append({ prop: 'cursor', value: 'var(--dsc-cursor-pointer-press, pointer)', important: decl.important });
  rule.after(twin);
}

/** Adds :active to a selector, before any trailing pseudo-element. */
function withActive(selector) {
  const s = selector.trim();
  if (!s || /:active\b/i.test(s) || /::ng-deep$/i.test(s)) return null;
  const pseudo = s.match(PSEUDO_ELEMENT);
  return pseudo ? `${s.slice(0, pseudo.index)}:active${pseudo[0]}` : `${s}:active`;
}

function insideKeyframes(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return true;
  }
  return false;
}

/** The forced-colors fallback in src/styles/cursor.css must keep the real `auto`. */
function insideForcedColors(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'media' && /forced-colors/i.test(parent.params)) return true;
  }
  return false;
}

/** True when every selector of the rule ends on an input or textarea. */
function targetsTextField(rule) {
  if (!rule || typeof rule.selector !== 'string') return false;
  return rule.selector.split(',').every((selector) => {
    const last = selector.trim().split(/[\s>+~]+/).pop() ?? '';
    return /^(input|textarea)\b/i.test(last);
  });
}

dscCursors.postcss = true;

module.exports = dscCursors;
