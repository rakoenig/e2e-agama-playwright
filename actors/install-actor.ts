import { expect, type Page } from '@playwright/test';
import { MainPage } from '../pages/main-page';
import { ConfirmInstallationPage } from '../pages/confirm-installation-page';
import { InstallationProgressPage } from '../pages/installing-page';
import { CongratulationsPage } from '../pages/installation-finished-page';

export class InstallActor {
    readonly page: Page;
    readonly mainPage: MainPage;
    readonly confirmInstallationPage: ConfirmInstallationPage;
    readonly installationProgressPage: InstallationProgressPage;
    readonly congratulationsPage: CongratulationsPage;

    constructor(page: Page,
        mainPage: MainPage,
        confirmInstallationPage: ConfirmInstallationPage,
        installationProgressPage: InstallationProgressPage,
        congratulationsPage: CongratulationsPage) {
        this.page = page;
        this.mainPage = mainPage;
        this.confirmInstallationPage = confirmInstallationPage;
        this.installationProgressPage = installationProgressPage;
        this.congratulationsPage = congratulationsPage;
    }

    async handleInstallation() {
        await this.mainPage.install();
        await this.confirmInstallationPage.confirm();
        await this.installationProgressPage.expectProgress();
        await this.congratulationsPage.expectCongratulations();
    }
}
