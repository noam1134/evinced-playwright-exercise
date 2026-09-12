const { setCredentials } = require('@evinced/js-playwright-sdk');

module.exports = async function globalSetup() {
  const { EVINCED_SERVICE_ID, EVINCED_API_KEY } = process.env;
  if (!EVINCED_SERVICE_ID || !EVINCED_API_KEY) {
    throw new Error(
      'Missing EVINCED_SERVICE_ID or EVINCED_API_KEY. Copy .env.example to .env and fill it in.'
    );
  }
  try {
    await setCredentials({ serviceId: EVINCED_SERVICE_ID, secret: EVINCED_API_KEY });
  } catch (err) {
    throw new Error(`Evinced SDK authorization failed: ${err.message}`);
  }
};
