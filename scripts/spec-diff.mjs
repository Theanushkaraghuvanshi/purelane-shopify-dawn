/**
 * Pixel / computed-style gate: HTML file vs live Dawn homepage.
 * Usage:
 *   node scripts/spec-diff.mjs
 * Needs playwright-core and a local browser channel (msedge or chrome).
 * Storefront password is read from STOREFRONT_PASSWORD (never commit it).
 */
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const HTML = process.env.HTML_SPEC || 'C:\\Users\\hp\\Downloads\\purelane-homepage.html';
const LIVE = process.env.STORE_URL || 'https://purelane-joazssp6.myshopify.com/';
const PASS = process.env.STOREFRONT_PASSWORD || '';
const OUT = path.join('docs', 'SPEC_DIFF.md');

const CHECKS = [
  { name: 's1 mint gradient', sel: '.s1', prop: 'backgroundImage', want: /251,\s*255,\s*251|fbfffb/i },
  { name: 'wl-a soft-light', sel: '.wl-a', prop: 'mixBlendMode', want: /^soft-light$/i },
  { name: 'hero white veil', sel: '.hero', pseudo: '::before', prop: 'backgroundImage', want: /255,\s*255,\s*255/ },
  { name: 'primary teal', sel: '.btn-primary', prop: 'backgroundImage', want: /0,\s*112,\s*106|#00706a/i },
  { name: 'h1 dark ink', sel: '.hero h1, .hero .d1', prop: 'color', want: /23,\s*16,\s*43|#17102b/i },
  { name: 'ticker white glass', sel: '.ticker', prop: 'backgroundColor', want: /255,\s*255,\s*255/ },
];

let chromium;
try {
  ({ chromium } = await import('playwright-core'));
} catch {
  fs.writeFileSync(
    OUT,
    '# Spec diff\n\nInstall `playwright-core` and rerun `node scripts/spec-diff.mjs`.\n'
  );
  console.log('playwright-core missing; wrote stub', OUT);
  process.exit(0);
}

async function unlock(page) {
  if (!PASS) return;
  await page.goto(LIVE + 'password', { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (await page.locator('input[type="password"]').count()) {
    await page.locator('input[type="password"]').first().fill(PASS);
    const btn = page.locator('button[type="submit"], input[type="submit"]');
    if (await btn.count()) await btn.first().click();
    else await page.keyboard.press('Enter');
    await page.waitForTimeout(600);
  }
  await page.goto(LIVE, { waitUntil: 'networkidle', timeout: 60000 });
}

async function sample(page) {
  return page.evaluate((checks) => {
    const out = {};
    for (const c of checks) {
      const el = document.querySelector(c.sel);
      if (!el) {
        out[c.name] = { missing: true };
        continue;
      }
      const s = c.pseudo ? getComputedStyle(el, c.pseudo) : getComputedStyle(el);
      out[c.name] = { value: s[c.prop] || s.backgroundImage || s.backgroundColor };
    }
    out._s1Display = getComputedStyle(document.querySelector('.s1') || document.body).display;
    out._hasShop = !!document.querySelector('#shop');
    out._hasCombos = !!document.querySelector('#combos');
    out._hasBundles = !!document.querySelector('#bundles');
    out._hasReviews = !!document.querySelector('#reviews');
    return out;
  }, CHECKS);
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || 'msedge', headless: true });
const lines = ['# Spec diff — HTML Version 2 vs live Dawn', '', `Generated: ${new Date().toISOString()}`, ''];
const fails = [];

try {
  for (const [w, h] of [
    [1440, 900],
    [375, 812],
  ]) {
    const htmlPage = await browser.newPage({ viewport: { width: w, height: h } });
    const livePage = await browser.newPage({ viewport: { width: w, height: h } });
    await htmlPage.goto(pathToFileURL(HTML).href, { waitUntil: 'load' });
    await unlock(livePage);
    await htmlPage.waitForTimeout(400);
    await livePage.waitForTimeout(800);
    const html = await sample(htmlPage);
    const live = await sample(livePage);
    lines.push(`## ${w}×${h}`, '');
    lines.push('| Check | HTML | Live | Pass |');
    lines.push('|---|---|---|---|');
    for (const c of CHECKS) {
      const hv = html[c.name]?.value || html[c.name]?.missing && 'missing';
      const lv = live[c.name]?.value || live[c.name]?.missing && 'missing';
      const pass = typeof lv === 'string' && c.want.test(lv);
      if (!pass) fails.push(`${w}: ${c.name}`);
      lines.push(`| ${c.name} | \`${String(hv).slice(0, 80)}\` | \`${String(lv).slice(0, 80)}\` | ${pass ? 'yes' : 'NO'} |`);
    }
    lines.push(`| s1 display | ${html._s1Display} | ${live._s1Display} | ${live._s1Display !== 'none' ? 'yes' : 'NO'} |`);
    if (live._s1Display === 'none') fails.push(`${w}: s1 display none`);
    lines.push(`| sections | reviews/shop/combos/bundles | ${live._hasReviews}/${live._hasShop}/${live._hasCombos}/${live._hasBundles} | ${live._hasReviews && live._hasShop && live._hasCombos && live._hasBundles ? 'yes' : 'NO'} |`);
    lines.push('');
    await htmlPage.close();
    await livePage.close();
  }
} finally {
  await browser.close();
}

lines.push('## Result', '', fails.length ? fails.map((f) => `- ${f}`).join('\n') : 'All listed checks passed.', '');
fs.writeFileSync(OUT, lines.join('\n'));
console.log(lines.join('\n'));
if (fails.length) process.exit(2);
