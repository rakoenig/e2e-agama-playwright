import { expect, type Locator, type Page } from '@playwright/test';

export class CongratulationsPage {
    readonly page: Page;
    readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.heading = page.getByRole("heading", { name: 'Congratulations!' });
    }

    async expectCongratulations() {
        while (true) {
            try {
                await this.heading.waitFor({ timeout: 30 * 1000 });
                break;
            }
            catch (error) {
                // do not ignore other errors
                if (error.constructor.name !== 'TimeoutError') throw (error);
            }
        }
    }

}
