/**
 * Gesture helpers built on Android UiScrollable, so tests can reach elements
 * below the fold without hard-coded swipe coordinates.
 */

/** Scrolls the first scrollable container until an element with this accessibility id is visible. */
export async function scrollToId(accessibilityId) {
    const element = $(
        'android=new UiScrollable(new UiSelector().scrollable(true))'
        + `.scrollIntoView(new UiSelector().description("${accessibilityId}"))`,
    );
    await element.waitForDisplayed();
    return element;
}

/** Scrolls until an element with this exact text is visible. */
export async function scrollToText(text) {
    const element = $(
        'android=new UiScrollable(new UiSelector().scrollable(true))'
        + `.scrollIntoView(new UiSelector().text("${text}"))`,
    );
    await element.waitForDisplayed();
    return element;
}
