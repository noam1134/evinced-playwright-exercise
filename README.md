# Evinced Playwright exercise

Playwright JS tests against https://a11y-audits.com/ with the Evinced accessibility SDK.
Two tests, one shared fixture, one aggregated HTML report with screenshots, one CI workflow.

## Prerequisites

- Node 18+ (developed on Node 26)
- Access token for Evinced's JFrog npm registry
- Evinced service ID and API key

## Setup

```bash
cp .env.example .env        # then fill in the three values
set -a; source .env; set +a # export them for npm
npm install
npx playwright install chromium
```

`.npmrc` points the `@evinced` scope at JFrog and reads the token from `JFROG_TOKEN`.
`playwright.config.js` loads `.env` and `global.setup.js` authenticates the SDK once per run.

## Run

```bash
npm test               # headless
npm run test:headed    # watch it
npm run report         # Playwright's own report (failures, traces)
open evincedReports/aggregatedReport.html   # Evinced report with screenshots
```

## How the SDK is wired

`tests/fixtures/evinced.js` extends Playwright's `test` with:

- `evMode` option: `continuous` (default), `single`, or `off`
- `evinced` auto fixture: creates `new EvincedSDK(page)` per test

| mode | what happens | used by |
|------|--------------|---------|
| `continuous` | `evStart()` before the test, `evStop()` after; engine records every DOM state | `tests/consultation.spec.js` |
| `single` | fixture hands the SDK to the test; test calls `evAnalyze()` when the page is in the state it wants scanned | `tests/home.spec.js` |
| `off` | nothing | tests that should not be scanned |

Specs import `test` and `expect` from the fixture instead of `@playwright/test`. Switch mode with
`test.use({ evMode: 'single' })` at file or `describe` level, or globally under `use` in
`playwright.config.js`.

## Scaling to every test

1. Every spec imports from `tests/fixtures/evinced.js`. Nothing else changes; continuous mode is the default.
2. `evConfig.yaml` holds engine and report settings for the whole project.
3. `.github/workflows/a11y.yml` runs the suite on push and pull request, with credentials from
   repository secrets, and uploads both report folders as artifacts.

## Layout

```
.npmrc                     @evinced scope -> JFrog, token from env
.env.example               names of the three secrets
playwright.config.js       dotenv, globalSetup, reporters, baseURL
global.setup.js            setCredentials() once per run
evConfig.yaml              screenshots on, aggregated HTML report
tests/fixtures/evinced.js  shared test with evMode option
tests/home.spec.js         simple navigation, single mode
tests/consultation.spec.js booking modal with validations, continuous mode
.github/workflows/a11y.yml CI
```
