import { expect, type Locator, type Page } from '@playwright/test';

export class InstallationProgressPage {
    readonly page: Page;
    readonly progressText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.progressText = page.getByText('Installing packages');
    }

    async expectProgress() {
        await expect(this.progressText).toBeVisible({ timeout: 8 * 60 * 1000 });
    }

}
