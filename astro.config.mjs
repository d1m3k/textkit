import { defineConfig } from 'astro/config';

// Example deployment: GitHub Pages project site at https://d1m3k.github.io/textkit/
// When the production domain is chosen, `site` and `base` are the only two lines that change.
// Default build format ('directory') gives clean folder URLs: /textkit/tool/json-formatter/
export default defineConfig({
  site: 'https://d1m3k.github.io',
  base: '/textkit',
  trailingSlash: 'ignore',
});
