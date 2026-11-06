import { TOOLS, absolute } from '../config/site';

const paths = [
  '/',
  '/tools/',
  ...TOOLS.map((t) => `/tool/${t.slug}/`),
  '/guides/',
  '/guides/valid-json-checklist/',
  '/guides/strong-passwords-explained/',
  '/about/',
  '/privacy/',
  '/disclaimer/',
  '/contact/',
];

export function GET() {
  const urls = paths
    .map((p) => `  <url><loc>${absolute(p)}</loc></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
