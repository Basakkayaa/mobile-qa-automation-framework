import BaseScreen from './BaseScreen.js';
import { scrollToId } from '../helpers/gestures.js';

class CartScreen extends BaseScreen {
    constructor() {
        super('~cart screen');
    }

    get emptyCartMessage() { return BaseScreen.byText('No Items'); }
    get goShoppingButton() { return BaseScreen.byId('Go Shopping button'); }
    get removeButtons() { return $$('~remove item'); }
    get totalNumber() { return BaseScreen.byId('total number'); }
    get totalPrice() { return BaseScreen.byId('total price'); }

    async removeFirstItem() {
        await this.waitForIsShown();
        const buttons = await this.removeButtons;
        await buttons[0].click();
    }

    async getTotalItems() {
        const element = await scrollToId('total number');
        return Number((await element.getText()).replace(/\D/g, ''));
    }

    async getTotalPrice() {
        const element = await scrollToId('total price');
        return element.getText();
    }

    async proceedToCheckout() {
        const button = await scrollToId('Proceed To Checkout button');
        await button.click();
    }
}

export default new CartScreen();
