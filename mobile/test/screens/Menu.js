import BaseScreen from './BaseScreen.js';

/** Side menu and bottom/top navigation shared by all screens. */
class Menu {
    get openMenuButton() { return BaseScreen.byId('open menu'); }
    get cartBadge() { return BaseScreen.byId('cart badge'); }

    menuItem(name) { return BaseScreen.byId(`menu item ${name}`); }

    async openMenu() {
        await this.openMenuButton.waitForDisplayed();
        await this.openMenuButton.click();
    }

    /** Opens a menu entry by its label, e.g. "log in", "log out", "catalog". */
    async goTo(item) {
        await this.openMenu();
        await this.menuItem(item).waitForDisplayed();
        await this.menuItem(item).click();
    }

    async openCart() {
        await this.cartBadge.click();
    }

    /** Number shown on the cart badge; 0 when the badge has no counter. */
    async getCartCount() {
        const counter = this.cartBadge.$('android=new UiSelector().className("android.widget.TextView")');
        if (!(await counter.isExisting())) return 0;
        return Number(await counter.getText()) || 0;
    }
}

export default new Menu();
