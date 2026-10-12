// Bundles the production build (dist/) into one self-contained HTML page that
// can be published as a claude.ai Artifact or opened directly from disk.
// Usage: npm run build:artifact  →  dist-artifact/fair-football.html
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const html = readFileSync(join(dist, 'index.html'), 'utf8');

const scriptSrc = html.match(/<script type="module"[^>]*src="\.?\/?([^"]+)"/)?.[1];
const cssHref = html.match(/<link rel="stylesheet"[^>]*href="\.?\/?(assets\/[^"]+\.css)"/)?.[1];
if (!scriptSrc || !cssHref) throw new Error('Run `vite build` first: dist/index.html has no bundled script or stylesheet.');

const js = readFileSync(join(dist, scriptSrc), 'utf8').replace(/<\/script/gi, '<\\/script');
const css = readFileSync(join(dist, cssHref), 'utf8').replace(/<\/style/gi, '<\\/style');
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/)?.[0] ?? '';

// The Artifact publisher wraps the page in its own doctype/head/body skeleton,
// so the page starts with its <title> and <style>.
const page = `<title>Fair Football Team Generator</title>
<meta name="description" content="Keep a shared player list and generate fair, balanced football teams from player rankings.">
${fonts}
<style>${css}</style>
<div id="root"></div>
<script type="module">${js}</script>
`;

const outDir = join(root, 'dist-artifact');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'fair-football.html'), page);
// The same page as a complete document, for opening directly from disk or emailing.
// Opened this way there is no shared database, so the list is kept in that browser.
const head = page.slice(0, page.indexOf('<div id="root">'));
const standalone = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#0f3d2e">
${head}</head>
<body>
<div id="root"></div>
<script type="module">${js}</script>
</body>
</html>
`;
writeFileSync(join(outDir, 'fair-football-standalone.html'), standalone);
console.log(`Wrote dist-artifact/fair-football.html and dist-artifact/fair-football-standalone.html (${(page.length / 1024).toFixed(0)} KB)`);
