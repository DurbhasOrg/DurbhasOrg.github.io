import { chromium } from 'playwright';

const rawBase = process.argv[2] || 'http://localhost:8000';
const base = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
const url = (path) => new URL(path, base).href;
const browser = await chromium.launch({ headless: true });

async function newPage() { const context = await browser.newContext(); return { context, page: await context.newPage() }; }
async function chooseAndOpen(subject) {
  const session = await newPage();
  await session.page.goto(url('index.html'), { waitUntil: 'networkidle' });
  await session.page.selectOption('#subject-filter', subject);
  await session.page.locator('.tutor-card a').first().click();
  await session.page.waitForSelector('#slot-groups');
  return session;
}

try {
  // Scenario 1: Math demand and a tutor view, then leave.
  let session = await chooseAndOpen('Math');
  await session.context.close();

  // Scenario 2: Science demand, tutor view, valid slot, and booking entry, then leave.
  session = await chooseAndOpen('Science');
  await session.page.locator('[data-slot]:not(:disabled)').first().click();
  await session.page.click('#continue-booking');
  await session.context.close();

  // Scenario 3: English demand through successful synthetic booking.
  session = await chooseAndOpen('English');
  await session.page.locator('[data-slot]:not(:disabled)').first().click();
  await session.page.click('#continue-booking');
  await session.page.selectOption('#booking-subject', 'English');
  await session.page.fill('#parent-name', 'Synthetic Parent');
  await session.page.fill('#parent-email', 'synthetic-parent@example.test');
  await session.page.fill('#student-name', 'Test Student');
  await session.page.selectOption('#student-grade', 'Elementary');
  await session.page.click('#booking-form button[type="submit"]');
  await session.page.waitForSelector('#confirmation:not([hidden])');
  await session.context.close();
  console.log(`Synthetic traffic completed against ${base}`);
} finally {
  await browser.close();
}
