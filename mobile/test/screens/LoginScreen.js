import BaseScreen from './BaseScreen.js';

class LoginScreen extends BaseScreen {
    constructor() {
        super('~login screen');
    }

    get usernameInput() { return BaseScreen.byId('Username input field'); }
    get passwordInput() { return BaseScreen.byId('Password input field'); }
    get loginButton() { return BaseScreen.byId('Login button'); }
    get usernameError() { return BaseScreen.byId('Username-error-message'); }
    get passwordError() { return BaseScreen.byId('Password-error-message'); }
    get genericError() { return BaseScreen.byId('generic-error-message'); }

    async login({ username, password }) {
        await this.waitForIsShown();
        await BaseScreen.fill(this.usernameInput, username);
        await BaseScreen.fill(this.passwordInput, password);
        await BaseScreen.hideKeyboard();
        await this.loginButton.click();
    }

    /** Error texts are rendered inside the error containers. */
    static async readError(container) {
        await container.waitForDisplayed();
        const text = container.$('android=new UiSelector().className("android.widget.TextView")');
        return (await text.isExisting()) ? text.getText() : container.getText();
    }

    getUsernameError() { return LoginScreen.readError(this.usernameError); }
    getPasswordError() { return LoginScreen.readError(this.passwordError); }
    getGenericError() { return LoginScreen.readError(this.genericError); }
}

export default new LoginScreen();
