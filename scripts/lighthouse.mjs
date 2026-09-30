import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
const server = spawn(process.execPath, ['scripts/start-preview.mjs'], { env: { ...process.env, PORT: '3101' }, stdio: 'ignore' });
let browser;
try {
for (let i = 0; i < 60; i++) { try { if ((await fetch('http://127.0.0.1:3101')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 250)); }
browser = await launch({ chromeFlags: ['--headless', '--no-sandbox'], chromePath: process.env.CHROME_PATH });
  fs.mkdirSync('artifacts', { recursive: true });
  const project = JSON.parse(fs.readFileSync('data/projects.json', 'utf8')).find(project => project.visible);
  const routes = process.argv.includes('--home-only') ? ['/'] : ['/', '/contact', ...(project ? [`/projects/${project.slug}`] : ['/projects'])];
  for (const path of routes) {
    const response = await fetch(`http://127.0.0.1:3101${path}`);
    if (!response.ok) throw new Error(`Cannot audit ${path}: HTTP ${response.status}`);
    const report = await lighthouse(`http://127.0.0.1:3101${path}`, { port: browser.port, output: 'html', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'], logLevel: 'error' });
    if (report.lhr.runtimeError) throw new Error(report.lhr.runtimeError.message);
    const name = path === '/' ? 'home' : path.replace(/^\//, '').replaceAll('/', '-');
    fs.writeFileSync(`artifacts/lighthouse-${name}.html`, report.report);
    const result = { route: path, scores: Object.fromEntries(Object.entries(report.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])), lcp: report.lhr.audits['largest-contentful-paint'].displayValue, cls: report.lhr.audits['cumulative-layout-shift'].displayValue, tbt: report.lhr.audits['total-blocking-time'].displayValue };
    console.log(JSON.stringify(result));
    fs.writeFileSync(`artifacts/lighthouse-${name}.json`, JSON.stringify(result, null, 2));
  }
} finally { await browser?.kill(); server.kill(); }
