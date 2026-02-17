import type { Page as PlaywrightPage } from '@playwright/test';
import { BasePage } from '../../base/BasePage';
import { IframePreviewPageSelectors } from './IframePreviewPageSelectors';
import { IframePreviewPageSteps } from './IframePreviewPageSteps';
import { IframePreviewPageExpects } from './IframePreviewPageExpects';

const IFRAME_PREVIEW_SELECTOR = 'iframe[id="3snet-frame"]';

export class IframePreviewPage extends BasePage {
  readonly selectors: IframePreviewPageSelectors;
  readonly steps: IframePreviewPageSteps;
  readonly expects: IframePreviewPageExpects;

  constructor(page: PlaywrightPage) {
    super(page);
    this.selectors = new IframePreviewPageSelectors(page.frameLocator(IFRAME_PREVIEW_SELECTOR));
    this.steps = new IframePreviewPageSteps(this.selectors);
    this.expects = new IframePreviewPageExpects(this.selectors);
  }

  async waitUntilIsLoaded(): Promise<void> {
    return this.steps.waitUntilIsLoaded();
  }
}
