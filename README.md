# 3snet-test

Playwright autotests (TypeScript) for the 3Snet events calendar widget.

## Architecture and project structure

The project uses **composition for page objects**: each screen or logical “page” is split into **Selectors**, **Steps**, and **Expects**, and the main page class composes them. Tests then call e.g. `page.steps.goto()`, `page.expects.checkPreviewIframeSize(...)`, and `page.selectors.previewIframe`, which keeps responsibilities clear and makes reuse easier.

### Directory layout

| Path | Purpose |
|------|--------|
| **`pages/`** | Page Object layer. One subfolder per app “page” or feature. |
| `pages/base/BasePage.ts` | Abstract base for all pages: holds the Playwright `page`, defines `waitUntilIsLoaded()`, and shared helpers (e.g. clipboard check). |
| `pages/EventsWidgetPage/` | Page Object for the Events Calendar Constructor (main form). Composes `EventsWidgetPageSelectors`, `EventsWidgetPageSteps`, `EventsWidgetPageExpects`, and embeds `IframePreviewPage` for the preview iframe. |
| `pages/EventsWidgetPage/EventsWidgetPageSelectors.ts` | Locators only (dropdowns, buttons, iframe, checkboxes, etc.). No actions or assertions. |
| `pages/EventsWidgetPage/EventsWidgetPageSteps.ts` | User actions: open/close dropdowns, select options, click “Generate preview”, copy code, etc. Uses Selectors and wraps steps in Allure where needed. |
| `pages/EventsWidgetPage/EventsWidgetPageExpects.ts` | Assertions: topic/country lists, iframe size, checkbox state, etc. Uses Selectors and Allure steps. |
| `pages/EventsWidgetPage/IframePreviewPage/` | Page Object for the **preview iframe** content (events table, theme). Same composition: `IframePreviewPageSelectors`, `IframePreviewPageSteps`, `IframePreviewPageExpects`, plus main `IframePreviewPage` that composes them and is created with a `FrameLocator`. |
| `pages/index.ts` | Re-exports the public page classes (e.g. `EventsWidgetPage`) so tests import from `../pages`. |
| **`tests/`** | Playwright spec files. Grouped by feature (e.g. `events-widget/`). |
| **`config/`** | Environment configuration (e.g. `Environments.ts`: dev/prod hosts). |
| **`helpers/`** | Shared utilities (e.g. `url.ts` for base URL from env, `css.ts` if needed). |
| **Root** | `playwright.config.ts`, `eslint.config.mjs`, `.env_template`, `setupAndRunTest.sh`. |

### Composition in use

- **EventsWidgetPage** is built in the constructor from `EventsWidgetPageSelectors`, `EventsWidgetPageSteps`, and `EventsWidgetPageExpects`; it also creates **IframePreviewPage** for the preview iframe.
- **IframePreviewPage** is built from `IframePreviewPageSelectors` (backed by a `FrameLocator`), `IframePreviewPageSteps`, and `IframePreviewPageExpects`.
- Tests receive a single page instance and use:
  - `eventsWidgetPage.steps.goto()`, `eventsWidgetPage.steps.openThematicDropdown()`, etc.
  - `eventsWidgetPage.expects.checkThematicOptions(...)`, `eventsWidgetPage.expects.checkPreviewIframeSize(...)`, etc.
  - `eventsWidgetPage.selectors.previewIframe`, `eventsWidgetPage.iframePreviewPage.expects.checkEventTypesArePresentInTable(...)`, etc.

So: **selectors** own locators, **steps** own actions, **expects** own assertions; the main page class composes them and exposes `selectors`, `steps`, and `expects` (and nested pages where needed).

### Locators: prefer `data-testid`

Locators in the **Selectors** classes should be migrated to **`data-testid`** (or `data-test-id`) as soon as possible. Prefer `page.getByTestId('...')` over CSS classes, text, or role when the app can expose test IDs. That keeps tests stable when copy or layout changes and makes the intent of each selector explicit. Add the corresponding attributes on the app side and switch selectors in the page objects gradually.

## What the tests cover

The suite targets the **Events Calendar Constructor** page (`/eventswidget`). It checks the following behaviour and functionality:

- **Page load and initial state**  
  The constructor page loads and the preview block appears. The “full container width” and “full block height” checkboxes are unchecked by default.

- **Topic dropdown**  
  The “Select topic” dropdown opens and shows the expected options (e.g. “Select all”, Affiliate, Blockchain, Development, Igaming, Internet Marketing, SEO, Финтех). The test selects “Select all” and closes the dropdown.

- **Preview generation (fixed size)**  
  After generating the preview with all topics, the test checks that:
  - The preview iframe is visible and has the expected size (e.g. 230×240 px).
  - The events table inside the iframe lists all expected event types.
  - The chosen color theme (e.g. turquoise) is applied (background color of the theme control).

- **Copy iframe code and clipboard**  
  The iframe embed code is read from the textarea, the “Copy iframe code” action is performed, and the clipboard content is verified to contain that code (requires clipboard permissions).

- **Preview with full width/height and one topic**  
  The test selects “full container width” and “full block height”, chooses a single topic (e.g. Igaming) and a color theme (e.g. green), then generates a new preview. It checks that:
  - The iframe size is 100%×100% as configured.
  - Only the selected event type appears in the table; the others are absent.
  - The selected theme color is applied in the preview.

## Run the tests (no extra setup)

**One command** — from the project root after cloning:

```bash
chmod +x setupAndRunTest.sh
./setupAndRunTest.sh
```

The script installs dependencies, Playwright browsers, creates `.env` from `.env_template` if missing, and runs the tests.

**Or run steps manually:**

```bash
npm install
npx playwright install
```

If you don’t have a `.env` file yet, copy the template so the app base URL is set (e.g. for `ENVIRONMENT=dev`):

```bash
cp .env_template .env
```

Then run: `npm test`.

This runs the full Playwright suite with the default config (e.g. Chromium, base URL from `.env`). No other configuration is required for a basic run.

### Other commands

- `npm run test:headed` — run with a visible browser  
- `npm run test:ui` — run in Playwright UI mode  
- `npm run test:debug` — run in debug mode  
- `npm run report` — open the last HTML report  
- `npm run lint` — run ESLint

### Run tests in GitHub Actions

The same tests can be run in **GitHub Actions** via the workflow **Run Tests** (`.github/workflows/run-tests.yml`).

1. Open the repo on GitHub → **Actions** tab.
2. In the left sidebar, select **Run Tests**.
3. Click **Run workflow**, choose the branch and options:
   - **Environment** — 3SNET environment (e.g. `DEV`). Used to set `ENVIRONMENT` and the app base URL.
   - **Custom test** (optional) — path to a single spec file, e.g. `tests/events-widget/smokeEventsWidget.spec.ts`. Leave empty to run the full suite.
4. Click **Run workflow** and open the created run to see the logs.

After the run, you can download **allure-report** and **playwright-report** from the run’s **Artifacts** section.

---

## Issues found

### 1. “Финтех” events missing in preview when all topics are selected

**Reproduction steps (based on the smoke test):**

1. Open the Events Calendar Constructor page (`/eventswidget`).
2. Wait for the page to load (preview block visible).
3. Open the “Select topic” dropdown.
4. Verify the list contains: “Выбрать все”, Affiliate, Blockchain, Development, Igaming, Internet Marketing, SEO, Финтех.
5. Select “Выбрать все” (Select all).
6. Close the dropdown (e.g. click outside or Esc).
7. Click “Сгенерировать превью” (Generate preview).
8. Wait for the preview iframe to load and check the events table.

**Expected:** The preview table shows event types for all selected topics, including **Финтех**.

**Actual:** The preview table contains no events with the Финтех topic. Other topics (e.g. Affiliate, Igaming) appear; Финтех is missing.

---

### 2. Countries dropdown empty; “All countries” yields empty preview

**Reproduction steps:**

1. Open the Events Calendar Constructor page (`/eventswidget`).
2. Wait for the page to load.
3. Open the “Select countries” dropdown (Шаг 2 — Выберите страны).

**Expected:** Dropdown lists multiple countries (e.g. “Выбрать все”, США, Россия, Канада, etc.) so the user can filter by country.

**Actual:** The dropdown has only one option: **“Все страны”** (All countries). There is no real list of countries to choose from.

**If you then:**

4. Select “Все страны” (All countries).  
5. Click “Сгенерировать превью” (Generate preview).  
6. Wait for the preview iframe to load.

**Expected:** Preview shows events (for the selected topics), possibly from all countries.

**Actual:** The preview shows an **empty event list** (no events in the table). So with the current single option “Все страны”, the generated preview is empty.

*(The test currently skips the countries dropdown step until the dropdown is populated; see TODO in `smokeEventsWidget.spec.ts`.)*
