import Menu from '../screens/Menu.js';
import CatalogScreen from '../screens/CatalogScreen.js';
import ProductScreen from '../screens/ProductScreen.js';
import CartScreen from '../screens/CartScreen.js';
import { restartApp, parsePrice } from '../helpers/app.js';

describe('Shopping cart', () => {
    beforeEach(async () => {
        await restartApp();
        await CatalogScreen.openProduct(0);
        await ProductScreen.waitForIsShown();
    });

    it('TC-CART-01 adds a product and updates the cart badge @smoke @regression', async () => {
        await ProductScreen.addToCart();
        await expect(await Menu.getCartCount()).toBe(1);
    });

    it('TC-CART-02 adds several units and calculates the total price @regression', async () => {
        const unitPrice = parsePrice(await ProductScreen.getPrice());
        await ProductScreen.setQuantity(3);
        await ProductScreen.addToCart();
        await expect(await Menu.getCartCount()).toBe(3);

        await Menu.openCart();
        await CartScreen.waitForIsShown();
        await expect(await CartScreen.getTotalItems()).toBe(3);
        const total = parsePrice(await CartScreen.getTotalPrice());
        await expect(total).toBeCloseTo(unitPrice * 3, 2);
    });

    it('TC-CART-03 removes a product and shows an empty cart @regression', async () => {
        await ProductScreen.addToCart();
        await Menu.openCart();
        await CartScreen.removeFirstItem();

        await CartScreen.emptyCartMessage.waitForDisplayed();
        await expect(await Menu.getCartCount()).toBe(0);
    });
});
