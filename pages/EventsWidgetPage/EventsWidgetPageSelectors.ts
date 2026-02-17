import type { Page as PlaywrightPage } from '@playwright/test';

export class EventsWidgetPageSelectors {
  constructor(private readonly page: PlaywrightPage) {}

  get preview() {
    return this.page.locator('.constructor__preview');
  }

  get buttonSelectThematic() {
    return this.page.locator('[data-select="Выбрать тематику"]');
  }

  get thematicDropdownPopup() {
    return this.page.locator('[data-select="Выбрать тематику"] .checkselect-popup');
  }

  get thematicDropdownOptions() {
    return this.page.locator('[data-select="Выбрать тематику"] .checkselect-popup label.custom-checkbox');
  }

  get buttonSelectCountries() {
    return this.page.locator('[data-select="Все страны"]');
  }

  get countiresDropdownPopup() {
    return this.page.locator('[data-select="Все страны"] .checkselect-popup');
  }

  get countiresDropdownOptions() {
    return this.page.locator('[data-select="Все страны"] .checkselect-popup label.custom-checkbox');
  }

  // TODO: defenitely replace this w/a with more stable selector with data-testid
  get checkboxFullWidth() {
    return this.page.locator('label:has(input[name="full-width"])');
  }

  // TODO: defenitely replace this w/a with more stable selector with data-testid
  get checkboxAutoHeight() {
    return this.page.locator('label:has(input[name="auto-height"])');
  }

  get generatePreviewButton() {
    return this.preview.getByText('Сгенерировать превью');
  }

  get previewIframe() {
    return this.page.locator('iframe[id="3snet-frame"]');
  }

  get iframePreviewContainer() {
    return this.page.locator('div[id="preview"]');
  }

  get copyIframeCodeButton() {
    return this.page.locator('button[id="code-copy-button"]');
  }

  get iframeCode() {
    return this.page.locator('textarea[id="code"]');
  }

  colorThemeCheckbox(color: string) {
    return this.page.locator(`label:has(input[value="${color}"])`);
  }
}
