import BaseScreen from './BaseScreen.js';

class CatalogScreen extends BaseScreen {
    constructor() {
        super('~products screen');
    }

    get sortButton() { return BaseScreen.byId('sort button'); }
    get productTitles() { return $$('~store item text'); }
    get productPrices() { return $$('~store item price'); }

    /** Sort options: nameAsc, nameDesc, priceAsc, priceDesc. */
    async sortBy(option) {
        await this.sortButton.click();
        await BaseScreen.byId(option).waitForDisplayed();
        await BaseScreen.byId(option).click();
    }

    /** Titles of the products currently visible on screen (top of the list). */
    async getVisibleTitles() {
        await this.waitForIsShown();
        await $('~store item text').waitForDisplayed();
        return this.productTitles.map((el) => el.getText());
    }

    async getVisiblePrices() {
        await $('~store item price').waitForDisplayed();
        return this.productPrices.map((el) => el.getText());
    }

    async openProduct(index = 0) {
        await this.waitForIsShown();
        const items = await this.productTitles;
        await items[index].click();
    }

    async openProductByName(name) {
        await this.waitForIsShown();
        await BaseScreen.byText(name).click();
    }
}

export default new CatalogScreen();
