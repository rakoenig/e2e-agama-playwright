import { test, expect } from '@playwright/test';
import { IndexActor } from "../actors/index-actor";
import { StoragePage } from '../pages/storage-page';
import { MainPage } from '../pages/main-page';
import { ProductSelectionOpensusePage } from '../pages/product-selection-opensuse-page';
import { EncryptionPasswordPopup } from '../pages/encryption-password-popup';
import { UsersPage } from '../pages/users-page';
import { DefineUserPage } from '../pages/define-user-page';
import { ConfigureRootPasswordPage } from '../pages/configure-root-password-page';
import { ConfirmInstallationPage } from '../pages/confirm-installation-page';
import { InstallationProgressPage } from '../pages/installing-page';
import { CongratulationsPage } from '../pages/installation-finished-page';
import { InstallActor } from '../actors/install-actor';

const minute = 60 * 1000;
test.describe('The main page', () => {
    test.beforeEach(async ({ page }) => {
        const productSelectionOpensusePage = new ProductSelectionOpensusePage(page);
        const mainPage = new MainPage(page);
        const indexActor = new IndexActor(page, mainPage, productSelectionOpensusePage);
        indexActor.goto();
        indexActor.handleProductSelectionIfAny();
    });

    test('Full-disk encryption', async ({ page }) => {
        const mainPage = new MainPage(page);
        await test.step("Set for Full-disk encryption", async () => {
            await mainPage.accessStorage();

            const storagePage = new StoragePage(page);
            await storagePage.useEncryption();

            const passwordPopup = new EncryptionPasswordPopup(page);
            await passwordPopup.fillPassword('nots3cr3t');
            await passwordPopup.fillPasswordConfirmation('nots3cr3t');
            await passwordPopup.accept();

            await storagePage.validateEncryptionIsUsed();
            await storagePage.back();

            await mainPage.accessUsers();

            const usersPage = new UsersPage(page);
            await usersPage.expectNoUserDefined();
            await usersPage.defineUser();
            const defineUserPage = new DefineUserPage(page);
            await defineUserPage.fillUserFullName('Bernhard M. Wiedemann');
            await defineUserPage.fillUserName('bernhard');
            await defineUserPage.fillAndConfirmPassword('nots3cr3t');
            await defineUserPage.confirm();
            await usersPage.expectRootPasswordNotSet();
            await usersPage.configureRootPassword();
            const configureRootPasswordPage = new ConfigureRootPasswordPage(page);
            await configureRootPasswordPage.fillAndConfirmPassword('nots3cr3t');
            await configureRootPasswordPage.confirm();
            await usersPage.back();
        });

        //Installation
        await test.step("Run installation", async () => {
            const confirmInstallationPage = new ConfirmInstallationPage(page);
            const installationProgressPage = new InstallationProgressPage(page);
            const congratulationsPage = new CongratulationsPage(page);
            test.setTimeout(30 * minute);
            await expect(page.getByText("Installation will take")).toBeVisible({ timeout: 2 * minute });
            const installActor = new InstallActor(page, mainPage, confirmInstallationPage, installationProgressPage, congratulationsPage);
            installActor.handleInstallation();
        })
    })
})
