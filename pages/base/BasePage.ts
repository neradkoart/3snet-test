import type { Page as PlaywrightPage } from '@playwright/test';
import { expect } from '@playwright/test';
import { step } from 'allure-js-commons';

export abstract class BasePage {
  constructor(protected readonly page: PlaywrightPage) {}

  abstract waitUntilIsLoaded(): Promise<void>;

  async checkTextIsPresentInClipboard(text: string): Promise<void> {
    await step('Check that text is present in clipboard', async () => {
      await expect(this.page.evaluate(() => navigator.clipboard.readText())).resolves.toContain(text);
    });
  }
}
