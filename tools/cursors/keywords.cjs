'use strict';

/**
 * CSS cursor keyword -> DSC cursor token (ported from Pilot 100).
 *
 * Shared by the PostCSS plugin (which rewrites `cursor: <keyword>` in every
 * stylesheet the build sees) and by build.mjs (which defines each token as an
 * SVG cursor in src/styles/cursor.css). Keywords that are not listed here — auto,
 * none, inherit and friends — are left untouched.
 */
const KEYWORD_TOKENS = {
  default: '--dsc-cursor',
  pointer: '--dsc-cursor-pointer',
  text: '--dsc-cursor-text',
  'vertical-text': '--dsc-cursor-vertical-text',
  'not-allowed': '--dsc-cursor-not-allowed',
  'no-drop': '--dsc-cursor-not-allowed',
  help: '--dsc-cursor-help',
  progress: '--dsc-cursor-progress',
  wait: '--dsc-cursor-wait',
  crosshair: '--dsc-cursor-crosshair',
  cell: '--dsc-cursor-cell',
  move: '--dsc-cursor-move',
  'all-scroll': '--dsc-cursor-move',
  grab: '--dsc-cursor-grab',
  '-webkit-grab': '--dsc-cursor-grab',
  grabbing: '--dsc-cursor-grabbing',
  '-webkit-grabbing': '--dsc-cursor-grabbing',
  'col-resize': '--dsc-cursor-col-resize',
  'row-resize': '--dsc-cursor-row-resize',
  'ew-resize': '--dsc-cursor-ew-resize',
  'e-resize': '--dsc-cursor-ew-resize',
  'w-resize': '--dsc-cursor-ew-resize',
  'ns-resize': '--dsc-cursor-ns-resize',
  'n-resize': '--dsc-cursor-ns-resize',
  's-resize': '--dsc-cursor-ns-resize',
  'nesw-resize': '--dsc-cursor-nesw-resize',
  'ne-resize': '--dsc-cursor-nesw-resize',
  'sw-resize': '--dsc-cursor-nesw-resize',
  'nwse-resize': '--dsc-cursor-nwse-resize',
  'nw-resize': '--dsc-cursor-nwse-resize',
  'se-resize': '--dsc-cursor-nwse-resize',
  'zoom-in': '--dsc-cursor-zoom-in',
  '-webkit-zoom-in': '--dsc-cursor-zoom-in',
  'zoom-out': '--dsc-cursor-zoom-out',
  '-webkit-zoom-out': '--dsc-cursor-zoom-out',
  copy: '--dsc-cursor-copy',
  alias: '--dsc-cursor-alias',
  'context-menu': '--dsc-cursor-context-menu',
};

/**
 * `var(--token, keyword)` for a plain cursor keyword, or null when the value
 * is already custom (url(), var()) or not a keyword we replace.
 */
function tokenFor(value) {
  const keyword = String(value).trim().toLowerCase();
  const token = KEYWORD_TOKENS[keyword];
  return token ? `var(${token}, ${keyword})` : null;
}

module.exports = { KEYWORD_TOKENS, tokenFor };
