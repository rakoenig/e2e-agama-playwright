import { expect, type Locator, type Page } from '@playwright/test';

export class ConfirmInstallationPage {
    readonly page: Page;
    readonly confirmButton: Locator;
    readonly cancelButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.confirmButton = page.getByRole('button', { name: 'Continue' });
        this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    }

    async confirm() {
        await this.confirmButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

}
