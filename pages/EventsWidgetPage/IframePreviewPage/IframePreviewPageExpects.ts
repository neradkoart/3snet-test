import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';
import type { IframePreviewPageSelectors } from './IframePreviewPageSelectors';
import { hexToRgb } from '../../../helpers/css';

export class IframePreviewPageExpects {
  constructor(private readonly selectors: IframePreviewPageSelectors) {}

  async checkEventTypesArePresentInTable(texts: string[]): Promise<void> {
    for (const text of texts) {
      await step(`Check that event type "${text}" is present`, async () => {
        await expect.soft(this.selectors.eventTypes.filter({ hasText: `#${text}` }).first()).toBeVisible();
      });
    }
  }

  async checkEventTypesAreNotPresentInTable(texts: string[]): Promise<void> {
    for (const text of texts) {
      await step(`Check that event type "${text}" is not present`, async () => {
        await expect.soft(this.selectors.eventTypes.filter({ hasText: `#${text}` }).first()).not.toBeVisible();
      });
    }
  }

  async checkColorThemeIsSet(color: string): Promise<void> {
    await step(`Check that checkbox "${color}" background color is set`, async () => {
      const expectedRgb = /^#?[\da-fA-F]{6}$/.test(color.trim()) ? hexToRgb(color) : color;
      await expect.soft(this.selectors.eventActivityNames.first()).toHaveCSS('background-color', expectedRgb);
    });
  }

}
