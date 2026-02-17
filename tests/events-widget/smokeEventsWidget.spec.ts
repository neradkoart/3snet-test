import { test } from '@playwright/test';
import { step } from 'allure-js-commons';
import { EventsWidgetPage } from '../../pages';

const EXPECTED_TOPIC_OPTIONS = [
  'Выбрать все',
  'Affiliate',
  'Blockchain',
  'Development',
  'Igaming',
  'Internet Marketing',
  'SEO',
  'Финтех',
];

// Took some countries for test whilst the real dropdown is empty ('Все страны' is the only option)
const _EXPECTED_COUNTRIES_OPTIONS = [
  'Выбрать все',
  'США',
  'Россия',
  'Канада',
  'Франция',
  'Германия',
  'Италия',
  'Испания',
  'Португалия',
];

test('Smoke test for events widget', async ({ page }) => {
  const eventsWidgetPage = new EventsWidgetPage(page);

  await step('Go to events calendar constructor page', async () => {
    await eventsWidgetPage.steps.goto();
    await step('Page is open, "full container width" and "full block height" checkboxes are not selected', async () => {
      await eventsWidgetPage.steps.waitUntilIsLoaded();

      await eventsWidgetPage.expects.checkCheckboxFullWidthIsUnchecked();
      await eventsWidgetPage.expects.checkCheckboxAutoHeightIsUnchecked();
    });
  });

  await step('Generate preview for all topics and all countries', async () => {
    await eventsWidgetPage.steps.openThematicDropdown();
    await eventsWidgetPage.expects.checkThematicOptions(EXPECTED_TOPIC_OPTIONS);

    await eventsWidgetPage.steps.selectThematicOption(EXPECTED_TOPIC_OPTIONS[0]);
    await eventsWidgetPage.steps.closeThematicDropdown();

    // TODO: uncomment when the dropdown will be filled
    // await eventsWidgetPage.steps.openCountriesDropdown();
    // await eventsWidgetPage.expects.checkCountriesDropdownOptions(EXPECTED_COUNTRIES_OPTIONS);

    // await eventsWidgetPage.steps.selectCountryOption(EXPECTED_COUNTRIES_OPTIONS[0]);
    // await eventsWidgetPage.steps.closeCountriesDropdown();

    await eventsWidgetPage.steps.clickGeneratePreview();
    await step('Preview loaded, verify all event types are present in table, iframe size 230x240px', async () => {
      await eventsWidgetPage.iframePreviewPage.steps.waitUntilIsLoaded();

      await eventsWidgetPage.expects.checkPreviewIframeSize('230', '240');
      await eventsWidgetPage.iframePreviewPage.expects.checkEventTypesArePresentInTable(
        EXPECTED_TOPIC_OPTIONS.slice(1),
      );
      const color = await eventsWidgetPage.getColorThemeCheckbox(eventsWidgetPage.colorThemeNames.TURQUOISE);
      await eventsWidgetPage.iframePreviewPage.expects.checkColorThemeIsSet(color);
    });
  });

  await step('Copy iframe code and verify text is present in clipboard', async () => {
    const iframeCode = await eventsWidgetPage.getIframeCode();
    if (!iframeCode) {
      throw new Error('There is no iframe code in textarea');
    };

    await eventsWidgetPage.steps.clickCopyIframeCodeButton();
    await eventsWidgetPage.checkTextIsPresentInClipboard(iframeCode);
  });

  await step('Generate new preview at full container width and height with one topic', async () => {
    await eventsWidgetPage.steps.clickCheckboxFullWidth();
    await eventsWidgetPage.steps.clickCheckboxAutoHeight();

    await eventsWidgetPage.steps.openThematicDropdown();
    await eventsWidgetPage.steps.selectThematicOption(EXPECTED_TOPIC_OPTIONS[0]);
    await eventsWidgetPage.steps.selectThematicOption(EXPECTED_TOPIC_OPTIONS[3]);
    await eventsWidgetPage.steps.closeThematicDropdown();

    await eventsWidgetPage.steps.clickColorThemeCheckbox(eventsWidgetPage.colorThemeNames.GREEN);

    await eventsWidgetPage.steps.clickGeneratePreview();
    await eventsWidgetPage.iframePreviewPage.steps.waitUntilIsLoaded();

    await eventsWidgetPage.iframePreviewPage.expects.checkEventTypesArePresentInTable([
      EXPECTED_TOPIC_OPTIONS[3],
    ]);
    await eventsWidgetPage.iframePreviewPage.expects.checkEventTypesAreNotPresentInTable([
      ...EXPECTED_TOPIC_OPTIONS.slice(1, 3),
      ...EXPECTED_TOPIC_OPTIONS.slice(4),
    ]);
    await eventsWidgetPage.expects.checkPreviewIframeSize('100%', '100%');
    const color = await eventsWidgetPage.getColorThemeCheckbox(eventsWidgetPage.colorThemeNames.GREEN);
    await eventsWidgetPage.iframePreviewPage.expects.checkColorThemeIsSet(color);
  });
});