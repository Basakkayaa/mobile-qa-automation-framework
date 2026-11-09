import { APP_PACKAGE } from '../../wdio.android.conf.js';

/**
 * Restarts the app with its data cleared, so every test starts logged out with an empty cart.
 * A plain restart is not enough: the app persists the session and the cart on the device.
 */
export async function restartApp() {
    await driver.terminateApp(APP_PACKAGE);
    await driver.execute('mobile: clearApp', { appId: APP_PACKAGE });
    await driver.activateApp(APP_PACKAGE);
}

/**
 * Taps the positive button of a dialog (e.g. "LOG OUT", "OK").
 * Standard Android dialogs expose android:id/button1; the app's custom alerts only expose the label.
 */
export async function acceptNativeDialog(label = 'OK') {
    const systemButton = $('android=new UiSelector().resourceId("android:id/button1")');
    const labelledButton = $(`android=new UiSelector().textMatches("(?i)${label}")`);
    await browser.waitUntil(
        async () => (await systemButton.isExisting()) || (await labelledButton.isExisting()),
        { timeout: 10000, interval: 300, timeoutMsg: `No dialog button found (label "${label}")` },
    );
    const button = (await systemButton.isExisting()) ? systemButton : labelledButton;
    await button.click();
}

/** Waits for a dialog message with the given text and returns it ('' if it never appears). */
export async function getDialogMessage(expected) {
    const message = $(`android=new UiSelector().text("${expected}")`);
    return message.waitForDisplayed({ timeout: 10000 }).then(() => message.getText(), () => '');
}

/** Converts a price label such as "$29.99" to a number. */
export function parsePrice(label) {
    return Number(label.replace(/[^0-9.]/g, ''));
}
