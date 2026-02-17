import { step } from 'allure-js-commons';
import type { IframePreviewPageSelectors } from './IframePreviewPageSelectors';

export class IframePreviewPageSteps {
  constructor(
    private readonly selectors: IframePreviewPageSelectors,
  ) {}

  async waitUntilIsLoaded(): Promise<void> {
    await step('Wait for iframe to load and appear', async () => {
      await this.selectors.table.waitFor({ state: 'visible' });
    });
  }

}
