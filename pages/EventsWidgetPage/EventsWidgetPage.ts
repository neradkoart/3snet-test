import type { Page as PlaywrightPage } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { EventsWidgetPageSelectors } from './EventsWidgetPageSelectors';
import { EventsWidgetPageSteps } from './EventsWidgetPageSteps';
import { EventsWidgetPageExpects } from './EventsWidgetPageExpects';
import { step } from 'allure-js-commons';
import { IframePreviewPage } from './IframePreviewPage';

enum ColorThemeNames {
  TURQUOISE = 'turquoise',
  PURPLE = 'purple',
  BLUE = 'blue',
  GREEN = 'green',
}

export class EventsWidgetPage extends BasePage {
  readonly selectors: EventsWidgetPageSelectors;
  readonly steps: EventsWidgetPageSteps;
  readonly expects: EventsWidgetPageExpects;
  readonly iframePreviewPage: IframePreviewPage;
  readonly colorThemeNames = ColorThemeNames;

  constructor(page: PlaywrightPage) {
    super(page);
    this.selectors = new EventsWidgetPageSelectors(page);
    this.steps = new EventsWidgetPageSteps(page, this.selectors);
    this.expects = new EventsWidgetPageExpects(this.selectors);
    this.iframePreviewPage = new IframePreviewPage(page);
  }

  async waitUntilIsLoaded(): Promise<void> {
    return this.steps.waitUntilIsLoaded();
  }


  async getIframeCode(): Promise<string | null> {
    return step('Get iframe code', async () => {
      return await this.selectors.iframeCode.textContent();
    });
  }

  async getColorThemeCheckbox(color: string): Promise<string> {
    return step('Get color theme checkbox', async () => {
      const value = await this.selectors.colorThemeCheckbox(color).locator('.theme-round').getAttribute('style');
      const backgroundColor = value?.split('background-color:')[1].split(';')[0].trim();
      if (backgroundColor === undefined) {
        throw new Error(`Background color not found for theme checkbox: ${color}`);
      }
      return backgroundColor;
    });
  }

}
