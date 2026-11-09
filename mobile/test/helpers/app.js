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

/** Taps the positive button of a native Android dialog (e.g. "LOG OUT", "OK"). */
export async function acceptNativeDialog() {
    const button = $('android=new UiSelector().resourceId("android:id/button1")');
    await button.waitForDisplayed();
    await button.click();
}

/**
 * Reads the message of a native Android dialog.
 * Waits for non-empty text: when one dialog replaces another, the old one is briefly still on screen.
 */
export async function getNativeDialogMessage(expected) {
    const message = $('android=new UiSelector().resourceId("android:id/message")');
    let text = '';
    await browser.waitUntil(async () => {
        text = (await message.isExisting()) ? await message.getText() : '';
        return expected ? text === expected : text !== '';
    }, { timeout: 10000, interval: 300 }).catch(() => {});
    return text;
}

/** Converts a price label such as "$29.99" to a number. */
export function parsePrice(label) {
    return Number(label.replace(/[^0-9.]/g, ''));
}
