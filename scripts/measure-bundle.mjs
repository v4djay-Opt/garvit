import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
const rows = [];
const projects = JSON.parse(fs.readFileSync('data/projects.json', 'utf8')).filter(project => project.visible);
const frameworkFiles = new Set(JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8')).rootMainFiles);
for (const route of ['index', 'contact', 'about', 'projects', ...projects.map(project => `projects/${project.slug}`)]) {
  const filename = `.next/server/app/${route}.html`;
  if (!fs.existsSync(filename)) throw new Error(`Missing built page: ${filename}. Run npm run build first.`);
  const html = fs.readFileSync(filename, 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].filter(match => !/noModule|nomodule/.test(match[1])).map(match => /src="([^"?]+)/.exec(match[1])?.[1]).filter(Boolean);
  const files = [...new Set(scripts)].filter(file => file.startsWith('/_next/'));
  const gzipBytes = files.reduce((sum, file) => sum + gzipSync(fs.readFileSync('.next/' + decodeURIComponent(file.slice(7)))).length, 0);
  const frameworkBytes = files.filter(file => frameworkFiles.has(decodeURIComponent(file.slice(7)))).reduce((sum, file) => sum + gzipSync(fs.readFileSync('.next/' + decodeURIComponent(file.slice(7)))).length, 0);
  rows.push({ route: route === 'index' ? '/' : '/' + route, gzipKiB: Number((gzipBytes / 1024).toFixed(1)), frameworkKiB: Number((frameworkBytes / 1024).toFixed(1)), applicationKiB: Number(((gzipBytes - frameworkBytes) / 1024).toFixed(1)), targetKiB: 120, withinTarget: gzipBytes < 120 * 1024 });
}
console.log(JSON.stringify(rows, null, 2));
if (process.argv.includes('--enforce') && rows.some(row => !row.withinTarget)) process.exitCode = 1;
