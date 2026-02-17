import type { FrameLocator } from '@playwright/test';

export class IframePreviewPageSelectors {
  constructor(private readonly iframe: FrameLocator) {}

  get table() {
    return this.iframe.locator('.events_wrap_table');
  }

  get eventTypes() {
    return this.iframe.locator('.event-type');
  }

  get eventActivityNames() {
    return this.iframe.locator('.event-activity-name');
  }
}
