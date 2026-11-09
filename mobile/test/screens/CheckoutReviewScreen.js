import BaseScreen from './BaseScreen.js';
import { scrollToId } from '../helpers/gestures.js';

class CheckoutReviewScreen extends BaseScreen {
    constructor() {
        super('~checkout review order screen');
    }

    async placeOrder() {
        await this.waitForIsShown();
        const button = await scrollToId('Place Order button');
        await button.click();
    }
}

class CheckoutCompleteScreen extends BaseScreen {
    constructor() {
        super('~checkout complete screen');
    }

    get continueShoppingButton() { return BaseScreen.byId('Continue Shopping button'); }
}

export const checkoutReviewScreen = new CheckoutReviewScreen();
export const checkoutCompleteScreen = new CheckoutCompleteScreen();
