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

/** Reads the message of a native Android dialog. */
export async function getNativeDialogMessage() {
    const message = $('android=new UiSelector().resourceId("android:id/message")');
    await message.waitForDisplayed();
    return message.getText();
}

/** Converts a price label such as "$29.99" to a number. */
export function parsePrice(label) {
    return Number(label.replace(/[^0-9.]/g, ''));
}
