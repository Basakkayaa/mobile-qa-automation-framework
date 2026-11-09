/**
 * Test data for the My Demo App.
 * The users are the demo accounts published by Sauce Labs for this app; no real data is used.
 */
export const USERS = {
    standard: { username: 'bob@example.com', password: '10203040' },
    locked: { username: 'alice@example.com', password: '10203040' },
    unknown: { username: 'nobody@example.com', password: '10203040' },
};

export const MESSAGES = {
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    lockedOut: 'Sorry, this user has been locked out.',
    noMatch: 'Provided credentials do not match any user in this service.',
    loggedOut: 'You are successfully logged out.',
};

export const ADDRESS = {
    fullName: 'Basak Kaya',
    address1: 'Test Street 1',
    address2: 'Apt 2',
    city: 'Istanbul',
    state: 'Istanbul',
    zipCode: '34000',
    country: 'Turkey',
};

/** Dummy card number used only against the demo app. */
export const CARD = {
    fullName: 'Basak Kaya',
    cardNumber: '4111111111111111',
    expirationDate: '1230',
    securityCode: '123',
};
