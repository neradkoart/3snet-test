import type { Page as PlaywrightPage } from '@playwright/test';
import { Page } from '../base/BasePage';
import { EventsWidgetPageSelectors } from './EventsWidgetPageSelectors';
import { EventsWidgetPageSteps } from './EventsWidgetPageSteps';
import { EventsWidgetPageExpects } from './EventsWidgetPageExpects';

export class EventsWidgetPage extends Page {
  readonly selectors: EventsWidgetPageSelectors;
  readonly steps: EventsWidgetPageSteps;
  readonly expects: EventsWidgetPageExpects;

  constructor(page: PlaywrightPage) {
    super(page);
    this.selectors = new EventsWidgetPageSelectors(page);
    this.steps = new EventsWidgetPageSteps(page, this.selectors);
    this.expects = new EventsWidgetPageExpects(this.selectors);
  }

  async waitUntilIsLoaded(): Promise<void> {
    return this.steps.waitUntilIsLoaded();
  }
}
