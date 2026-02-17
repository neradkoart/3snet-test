import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';
import type { EventsWidgetPageSelectors } from './EventsWidgetPageSelectors';

export class EventsWidgetPageExpects {
  constructor(private readonly selectors: EventsWidgetPageSelectors) {}

  async checkThematicOptions(texts: string[]): Promise<void> {
    await step('Check that topic list in dropdown', async () => {
      await expect.soft(this.selectors.thematicDropdownOptions.locator('span')).toHaveText(texts);
    });
  }

  async checkCountriesDropdownOptions(texts: string[]): Promise<void> {
    await step('Check that country list in dropdown', async () => {
      await expect.soft(this.selectors.countiresDropdownOptions.locator('span')).toHaveText(texts);
    });
  }

  async checkPreviewIframeSize(width: string, height: string): Promise<void> {
    await step(`Check that iframe in #preview is visible and has size ${width}x${height} px`, async () => {
      const iframe = this.selectors.previewIframe;
      await expect(iframe).toBeVisible();
      
      const style = await this.selectors.iframePreviewContainer.getAttribute('style');
      const match = style?.match(/width: (\d+(?:px|%)); height: (\d+(?:px|%))/);
      const { width, height } = match ? { width: match[1], height: match[2] } : { width: '0px', height: '0px' };

      expect(width).toBe(width);
      expect(height).toBe(height);
    });
  }

  async checkCheckboxFullWidthIsChecked(): Promise<void> {
    await step('Check that "Full width" checkbox is selected', async () => {
      await expect(this.selectors.checkboxFullWidth.locator('input')).toBeChecked();
    });
  }

  async checkCheckboxAutoHeightIsChecked(): Promise<void> {
    await step('Check that "Auto height" checkbox is selected', async () => {
      await expect(this.selectors.checkboxAutoHeight.locator('input')).toBeChecked();
    });
  }

  async checkCheckboxFullWidthIsUnchecked(): Promise<void> {
    await step('Check that "Full width" checkbox is not selected', async () => {
      await expect(this.selectors.checkboxFullWidth.locator('input')).not.toBeChecked();
    });
  }

  async checkCheckboxAutoHeightIsUnchecked(): Promise<void> {
    await step('Check that "Auto height" checkbox is not selected', async () => {
      await expect(this.selectors.checkboxAutoHeight.locator('input')).not.toBeChecked();
    });
  }
}