/**
 * Canonical host: 301 the bare domain to www so search engines index one
 * origin (matches the canonical tag and `site` in astro.config.mjs).
 * Every other host (www, *.pages.dev previews) passes straight through.
 */

const APEX = 'devstudiocraft.com';
const CANONICAL = 'www.devstudiocraft.com';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === APEX) {
    url.hostname = CANONICAL;
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
