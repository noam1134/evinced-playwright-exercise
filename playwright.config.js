require('dotenv').config({ quiet: true });
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  globalSetup: require.resolve('./global.setup.js'),
  timeout: 120_000,
  workers: 1,
  retries: 0,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['./node_modules/@evinced/js-playwright-sdk/dist/reporter/evincedReporter.js'],
  ],
  use: {
    baseURL: 'https://a11y-audits.com',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
