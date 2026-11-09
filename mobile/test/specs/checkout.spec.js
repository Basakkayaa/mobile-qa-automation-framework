import Menu from '../screens/Menu.js';
import CatalogScreen from '../screens/CatalogScreen.js';
import ProductScreen from '../screens/ProductScreen.js';
import CartScreen from '../screens/CartScreen.js';
import LoginScreen from '../screens/LoginScreen.js';
import CheckoutAddressScreen from '../screens/CheckoutAddressScreen.js';
import CheckoutPaymentScreen from '../screens/CheckoutPaymentScreen.js';
import { checkoutReviewScreen, checkoutCompleteScreen } from '../screens/CheckoutReviewScreen.js';
import { restartApp } from '../helpers/app.js';
import { USERS, ADDRESS, CARD } from '../data/testData.js';

/** Puts one product in the cart and starts checkout as a logged-in user. */
async function startCheckout() {
    await restartApp();
    await CatalogScreen.openProduct(0);
    await ProductScreen.waitForIsShown();
    await ProductScreen.addToCart();
    await Menu.openCart();
    await CartScreen.proceedToCheckout();
    // Checkout requires a session, so the app asks a logged-out user to log in first.
    await LoginScreen.login(USERS.standard);
    await CheckoutAddressScreen.waitForIsShown();
}

describe('Checkout and payment', () => {
    beforeEach(startCheckout);

    it('TC-CHK-01 completes an order end to end @smoke @regression', async () => {
        await CheckoutAddressScreen.fillAddress(ADDRESS);
        await CheckoutAddressScreen.continueToPayment();

        await CheckoutPaymentScreen.fillPayment(CARD);
        await CheckoutPaymentScreen.reviewOrder();

        await checkoutReviewScreen.placeOrder();
        await checkoutCompleteScreen.waitForIsShown();

        // After the order the cart must be empty again.
        await expect(await Menu.getCartCount()).toBe(0);
    });

    it('TC-CHK-02 requires the mandatory shipping fields @regression', async () => {
        await CheckoutAddressScreen.fillAddress({ fullName: '', address1: '', city: '', zipCode: '', country: '' });
        await CheckoutAddressScreen.continueToPayment();

        for (const field of ['fullName', 'address1', 'city', 'zipCode', 'country']) {
            await expect(await CheckoutAddressScreen.isErrorShown(field)).toBe(true);
        }
        await expect(await CheckoutPaymentScreen.isShown()).toBe(false);
    });

    it('TC-CHK-03 does not show errors for optional shipping fields @regression', async () => {
        await CheckoutAddressScreen.fillAddress({ ...ADDRESS, address2: '', state: '' });
        await CheckoutAddressScreen.continueToPayment();
        await CheckoutPaymentScreen.waitForIsShown();
    });

    it('TC-PAY-01 requires all mandatory card fields @regression', async () => {
        await CheckoutAddressScreen.fillAddress(ADDRESS);
        await CheckoutAddressScreen.continueToPayment();

        await CheckoutPaymentScreen.fillPayment({ fullName: '', cardNumber: '', expirationDate: '', securityCode: '' });
        await CheckoutPaymentScreen.reviewOrder();

        for (const field of ['fullName', 'cardNumber', 'expirationDate', 'securityCode']) {
            await expect(await CheckoutPaymentScreen.isErrorShown(field)).toBe(true);
        }
        await expect(await checkoutReviewScreen.isShown()).toBe(false);
    });

    it('TC-PAY-02 rejects an incomplete card number @regression', async () => {
        await CheckoutAddressScreen.fillAddress(ADDRESS);
        await CheckoutAddressScreen.continueToPayment();

        await CheckoutPaymentScreen.fillPayment({ ...CARD, cardNumber: '4111' });
        await CheckoutPaymentScreen.reviewOrder();

        await expect(await CheckoutPaymentScreen.isErrorShown('cardNumber')).toBe(true);
    });
});
