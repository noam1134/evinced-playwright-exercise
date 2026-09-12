const base = require('@playwright/test');
const { EvincedSDK } = require('@evinced/js-playwright-sdk');

const test = base.test.extend({
  evMode: ['continuous', { option: true }],

  evinced: [
    async ({ page, evMode }, use) => {
      const sdk = new EvincedSDK(page);
      if (evMode === 'continuous') await sdk.evStart();
      await use(sdk);
      if (evMode === 'continuous') await sdk.evStop();
    },
    { auto: true },
  ],
});

module.exports = { test, expect: base.expect };
