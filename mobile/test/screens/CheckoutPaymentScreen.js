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
        return scrollToId(`${FIELDS[field]}-error-message`).then(() => true, () => false);
    }
}

export default new CheckoutPaymentScreen();
