import BaseScreen from './BaseScreen.js';
import { scrollToId } from '../helpers/gestures.js';

/** Fields are identified by their label; the app suffixes required fields with "*". */
const FIELDS = {
    fullName: 'Full Name*',
    address1: 'Address Line 1*',
    address2: 'Address Line 2',
    city: 'City*',
    state: 'State/Region',
    zipCode: 'Zip Code*',
    country: 'Country*',
};

class CheckoutAddressScreen extends BaseScreen {
    constructor() {
        super('~checkout address screen');
    }

    static input(label) { return BaseScreen.byId(`${label} input field`); }
    static error(label) { return BaseScreen.byId(`${label}-error-message`); }

    async fillAddress(address) {
        await this.waitForIsShown();
        for (const [key, label] of Object.entries(FIELDS)) {
            if (address[key] === undefined) continue;
            const field = await scrollToId(`${label} input field`);
            await BaseScreen.fill(field, address[key]);
        }
        await BaseScreen.hideKeyboard();
    }

    async continueToPayment() {
        const button = await scrollToId('To Payment button');
        await button.click();
    }

    /** Scrolls to the field's error message, because errors at the top leave the viewport. */
    async isErrorShown(field) {
        return scrollToId(`${FIELDS[field]}-error-message`).then(() => true, () => false);
    }
}

export default new CheckoutAddressScreen();
