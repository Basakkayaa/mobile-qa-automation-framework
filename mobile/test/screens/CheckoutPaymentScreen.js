import BaseScreen from './BaseScreen.js';
import { scrollToId } from '../helpers/gestures.js';

const FIELDS = {
    fullName: 'Full Name*',
    cardNumber: 'Card Number*',
    expirationDate: 'Expiration Date*',
    securityCode: 'Security Code*',
};

class CheckoutPaymentScreen extends BaseScreen {
    constructor() {
        super('~checkout payment screen');
    }

    async fillPayment(card) {
        await this.waitForIsShown();
        for (const [key, label] of Object.entries(FIELDS)) {
            if (card[key] === undefined) continue;
            const field = await scrollToId(`${label} input field`);
            await BaseScreen.fill(field, card[key]);
        }
        await BaseScreen.hideKeyboard();
    }

    async reviewOrder() {
        const button = await scrollToId('Review Order button');
        await button.click();
    }

    async isErrorShown(field) {
        const element = BaseScreen.byId(`${FIELDS[field]}-error-message`);
        return element.waitForDisplayed({ timeout: 5000 }).then(() => true, () => false);
    }
}

export default new CheckoutPaymentScreen();
