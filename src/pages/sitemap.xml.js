// Static sitemap — the site has a handful of pages, so a hand-kept list beats
// adding @astrojs/sitemap as a dependency. Add new pages here.
const PAGES = ['/', '/work/', '/impressum/', '/privacy/', '/terms/'];

export function GET({ site }) {
  const urls = PAGES.map((p) => `  <url><loc>${new URL(p, site).toString()}</loc></url>`).join('\n');
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
