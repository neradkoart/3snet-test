import type { Page as PlaywrightPage } from '@playwright/test';
import { step } from 'allure-js-commons';
import type { EventsWidgetPageSelectors } from './EventsWidgetPageSelectors';

const EVENTS_WIDGET_PATH = '/eventswidget';

export class EventsWidgetPageSteps {
  constructor(
    private readonly page: PlaywrightPage,
    private readonly selectors: EventsWidgetPageSelectors,
  ) {}

  async goto(): Promise<void> {
    await step('Open constructor page', async () => {
      await this.page.goto(EVENTS_WIDGET_PATH);
    });
  }

  async waitUntilIsLoaded(): Promise<void> {
    await step('Wait for preview to load and appear', async () => {
      await this.selectors.preview.waitFor({ state: 'visible' });
    });
  }

  async openThematicDropdown(): Promise<void> {
    await step('Open "Select topic" dropdown', async () => {
      await this.selectors.buttonSelectThematic.click();
      await this.selectors.thematicDropdownPopup.waitFor({ state: 'visible' });
    });
  }

  async closeThematicDropdown(): Promise<void> {
    await step('Close "Select topic" dropdown', async () => {
      await this.selectors.buttonSelectThematic.click();
      await this.selectors.thematicDropdownPopup.waitFor({ state: 'hidden' });
    });
  }
  
  async closeCountriesDropdown(): Promise<void> {
    await step('Close "Select countries" dropdown', async () => {
      await this.selectors.buttonSelectCountries.click();
      await this.selectors.countiresDropdownPopup.waitFor({ state: 'hidden' });
    });
  }

  async openCountriesDropdown(): Promise<void> {
    await step('Open "Select countries" dropdown', async () => {
      await this.selectors.buttonSelectCountries.click();
      await this.selectors.countiresDropdownPopup.waitFor({ state: 'visible' });
    });
  }

  async selectCountryOption(text: string): Promise<void> {
    await step(`Select country: ${text}`, async () => {
      const option = this.selectors.countiresDropdownOptions.filter({ hasText: text });
      await option.scrollIntoViewIfNeeded();
      await option.click();
    });
  }

  async selectThematicOption(text: string): Promise<void> {
    await step(`Select topic: ${text}`, async () => {
      const option = this.selectors.thematicDropdownOptions.filter({ hasText: text });
      await option.scrollIntoViewIfNeeded();
      await option.click();
    });
  }

  async clickGeneratePreview(): Promise<void> {
    await step('Click "Generate preview"', async () => {
      await this.selectors.generatePreviewButton.click();
    });
  }

  async clickCopyIframeCodeButton(): Promise<void> {
    await step('Click "Copy iframe code"', async () => {
      await this.selectors.copyIframeCodeButton.click();
    });
  }

  async clickCheckboxFullWidth(): Promise<void> {
    await step('Click "full container width" checkbox', async () => {
      await this.selectors.checkboxFullWidth.click();
    });
  }

  async clickCheckboxAutoHeight(): Promise<void> {
    await step('Click "full block height" checkbox', async () => {
      await this.selectors.checkboxAutoHeight.click();
    });
  }

  async clickColorThemeCheckbox(color: string): Promise<void> {
    await step(`Select color theme: "${color}"`, async () => {
      await this.selectors.colorThemeCheckbox(color).click();
    });
  }
}
