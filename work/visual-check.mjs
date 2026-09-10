import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const outDir = new URL('./screenshots/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const viewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 844 },
];

const report = [];

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const messages = [];
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
  });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: new URL(`${viewport.name}.png`, outDir).pathname, fullPage: true });

  const metrics = await page.evaluate(() => ({
    title: document.title,
    width: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    ctaCount: Array.from(document.querySelectorAll('button, a')).filter((node) =>
      /微信|WeChat|咨询|诊断/.test(node.textContent || '')
    ).length,
    hasWechat: document.body.textContent.includes('微信咨询'),
    hasModels: ['豆包', 'Kimi', 'DeepSeek'].every((word) => document.body.textContent.includes(word)),
    hasForbiddenModels: /WhatsApp|LINE|ChatGPT|Google/.test(document.body.textContent),
  }));

  if (metrics.scrollWidth > metrics.width + 2) {
    report.push(`${viewport.name}: horizontal overflow ${metrics.scrollWidth} > ${metrics.width}`);
  }
  if (!metrics.hasWechat || metrics.ctaCount < 4) report.push(`${viewport.name}: WeChat CTA coverage is weak`);
  if (!metrics.hasModels) report.push(`${viewport.name}: required model names missing`);
  if (metrics.hasForbiddenModels) report.push(`${viewport.name}: forbidden overseas terms found`);

  await page.getByRole('button', { name: /微信获取诊断|微信开始咨询|添加微信/ }).first().click();
  await page.getByRole('dialog', { name: /微信咨询/ }).waitFor({ state: 'visible' });
  await page.screenshot({ path: new URL(`${viewport.name}-modal.png`, outDir).pathname });
  await page.getByRole('button', { name: '关闭微信咨询弹窗' }).click();

  const faqButton = page.getByRole('button', { name: /能不能保证第一名/ });
  await faqButton.click();
  const expanded = await faqButton.getAttribute('aria-expanded');
  if (expanded !== 'true') report.push(`${viewport.name}: FAQ did not expand`);

  if (messages.length) report.push(`${viewport.name}: console messages: ${messages.join(' | ')}`);
  await page.close();
}

await browser.close();

if (report.length) {
  console.error(report.join('\n'));
  process.exit(1);
}

console.log('visual-check passed');
