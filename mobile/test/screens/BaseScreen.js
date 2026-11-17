/**
 * Base class for every screen object.
 * Each screen passes the accessibility id of an element that proves the screen is open,
 * so tests can wait for the screen instead of using fixed sleeps.
 */
export default class BaseScreen {
    constructor(screenSelector) {
        this.screenSelector = screenSelector;
    }

    /** Shorthand for an accessibility id selector (content-desc on Android). */
    static byId(id) {
        return $(`~${id}`);
    }

    /** Selector for an element whose visible text matches exactly. */
    static byText(text) {
        return $(`android=new UiSelector().text("${text}")`);
    }

    async waitForIsShown(isShown = true) {
        await $(this.screenSelector).waitForDisplayed({ reverse: !isShown });
    }

    async isShown() {
        return $(this.screenSelector).isDisplayed();
    }

    /** Clears an input field and types a value; an empty value only clears the field. */
    static async fill(element, value) {
        await element.waitForDisplayed();
        await element.clearValue();
        if (value) await element.setValue(value);
    }

    /** Hides the soft keyboard if it is covering the screen. */
    static async hideKeyboard() {
        if (await driver.isKeyboardShown()) await driver.hideKeyboard();
    }
}
