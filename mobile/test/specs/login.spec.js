import Menu from '../screens/Menu.js';
import LoginScreen from '../screens/LoginScreen.js';
import CatalogScreen from '../screens/CatalogScreen.js';
import { restartApp, acceptNativeDialog, getNativeDialogMessage } from '../helpers/app.js';
import { USERS, MESSAGES } from '../data/testData.js';

describe('Login', () => {
    beforeEach(async () => {
        await restartApp();
        await Menu.goTo('log in');
        await LoginScreen.waitForIsShown();
    });

    it('TC-LOGIN-01 logs in with valid credentials @smoke @regression', async () => {
        await LoginScreen.login(USERS.standard);
        await CatalogScreen.waitForIsShown();
    });

    it('TC-LOGIN-02 shows an error when the username is empty @regression', async () => {
        await LoginScreen.login({ username: '', password: USERS.standard.password });
        await expect(await LoginScreen.getUsernameError()).toBe(MESSAGES.usernameRequired);
    });

    it('TC-LOGIN-03 shows an error when the password is empty @regression', async () => {
        await LoginScreen.login({ username: USERS.standard.username, password: '' });
        await expect(await LoginScreen.getPasswordError()).toBe(MESSAGES.passwordRequired);
    });

    it('TC-LOGIN-04 blocks a locked-out user @regression', async () => {
        await LoginScreen.login(USERS.locked);
        await expect(await LoginScreen.getGenericError()).toBe(MESSAGES.lockedOut);
    });

    it('TC-LOGIN-05 rejects unknown credentials @regression', async () => {
        await LoginScreen.login(USERS.unknown);
        await expect(await LoginScreen.getGenericError()).toBe(MESSAGES.noMatch);
    });

    it('TC-LOGIN-06 logs out and confirms the logout @smoke @regression', async () => {
        await LoginScreen.login(USERS.standard);
        await CatalogScreen.waitForIsShown();

        await Menu.goTo('log out');
        await acceptNativeDialog();
        await expect(await getNativeDialogMessage(MESSAGES.loggedOut)).toBe(MESSAGES.loggedOut);
        await acceptNativeDialog();
        await LoginScreen.waitForIsShown();
    });
});
