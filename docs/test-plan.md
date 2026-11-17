# Test Plan — My Demo App (Android) and Booking API

| Item | Detail |
| --- | --- |
| Author | Başak Kaya — QA Engineer |
| Applications under test | Sauce Labs **My Demo App** (React Native, Android) · **Restful-Booker** REST API |
| Test levels | System / end-to-end (mobile UI), API integration |
| Approach | Risk-based, automated regression on every push |

## 1. Objective

Verify that a user can find a product, manage the cart and complete a purchase,
and that the booking API honours its contract, authorisation rules and error handling.
The suites run automatically in CI so every change gets fast feedback.

## 2. Scope

**In scope**

| Area | What is verified |
| --- | --- |
| Login | Valid login, required-field validation, locked user, unknown user, logout |
| Catalog | Product list, sorting by name and price, product details |
| Cart | Add to cart, quantities, total price, remove item, cart badge |
| Checkout & payment | End-to-end order, mandatory shipping and card fields, invalid card number |
| Booking API | Health check, token auth, create/read/search/update/patch/delete, 403/404 paths, JSON schema |

**Out of scope**

- iOS execution (the framework is platform-agnostic, only the Android capability is configured)
- Performance, load and security penetration testing
- Real payment processing — the demo app does not charge cards; only client-side validation is tested
- Visual/pixel comparison

## 3. Risk-based priorities

| Risk | Impact | Coverage |
| --- | --- | --- |
| User cannot complete a purchase | High | TC-CHK-01 end-to-end checkout (smoke) |
| Invalid payment data accepted | High | TC-PAY-01, TC-PAY-02 |
| Wrong totals in cart | High | TC-CART-02 |
| Users locked out or wrongly let in | High | TC-LOGIN-01…05 |
| Data changed without authorisation (API) | High | TC-API-09 |
| API response contract changes | Medium | TC-API-04 schema validation, daily scheduled run |
| Wrong sorting / product details | Medium | TC-CAT-02…06 |

## 4. Test design techniques

- **Equivalence partitioning** — valid, empty and unknown credentials; complete vs. incomplete card numbers.
- **Negative testing** — every mandatory field left empty, missing auth token, unknown ids.
- **State transitions** — logged out → login required at checkout → logged in → order complete → cart reset.
- **Contract testing** — JSON schema validation of the API response.

## 5. Environment

| Component | Version |
| --- | --- |
| Android emulator | API 30, Google APIs, x86_64 (GitHub Actions) |
| Appium / UiAutomator2 driver | 2.19 / 4.2.9 |
| WebdriverIO / Mocha | 9.x |
| Java / Rest Assured / JUnit | 17 / 5.5 / 5.11 |

## 6. Entry and exit criteria

**Entry:** the app build installs and launches on the emulator; the API health check returns 201.

**Exit:** all smoke tests pass; no open high-impact defect; the Allure report is published as a CI artifact.

## 7. Suites and execution

| Suite | Content | When |
| --- | --- | --- |
| Smoke (`@smoke`) | Critical path: login, catalog, add to cart, checkout, API auth and CRUD | Every push |
| Regression (`@regression`) | All mobile scenarios | Every push to `main`, on demand |
| API | All API tests | Every push and daily at 06:00 UTC |

## 8. Defect management

Failures are triaged from the Allure report. Each failed mobile test stores a screenshot,
the screen's XML source and the Appium log, so a defect can be reproduced without access to the device.
A defect report contains: title, environment, steps, expected vs. actual result, severity and evidence.

## 9. Deliverables

- Automated suites in this repository
- [Test case list](test-cases.md)
- Allure reports from each CI run
