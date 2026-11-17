import BaseScreen from './BaseScreen.js';
import { scrollToId } from '../helpers/gestures.js';

class ProductScreen extends BaseScreen {
    constructor() {
        super('~product screen');
    }

    get title() { return BaseScreen.byId('container header'); }
    get price() { return BaseScreen.byId('product price'); }
    get plusButton() { return BaseScreen.byId('counter plus button'); }
    get minusButton() { return BaseScreen.byId('counter minus button'); }
    get amount() { return BaseScreen.byId('counter amount'); }

    async getTitle() {
        const text = this.title.$('android=new UiSelector().className("android.widget.TextView")');
        return (await text.isExisting()) ? text.getText() : this.title.getText();
    }

    async getPrice() {
        await this.price.waitForDisplayed();
        return this.price.getText();
    }

    async setQuantity(quantity) {
        const plus = await scrollToId('counter plus button');
        for (let i = 1; i < quantity; i += 1) {
            await plus.click();
        }
    }

    async addToCart() {
        const button = await scrollToId('Add To Cart button');
        await button.click();
    }
}

export default new ProductScreen();
