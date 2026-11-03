/**
 * Canonical host: 301 the bare domain to www so search engines index one
 * origin (matches the canonical tag and `site` in astro.config.mjs).
 * Short links (e.g. /call) 302 to their target on any host, so the target
 * can change later without browsers caching it.
 * Every other request passes straight through.
 */

const APEX = 'devstudiocraft.com';
const CANONICAL = 'www.devstudiocraft.com';

const SHORT_LINKS = {
  '/call': 'https://cal.com/devstudiocraft',
};

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  const target = SHORT_LINKS[url.pathname.replace(/\/+$/, '')];
  if (target) return Response.redirect(target, 302);
  if (url.hostname === APEX) {
    url.hostname = CANONICAL;
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
