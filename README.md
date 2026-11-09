# Mobile & API Test Automation Framework

[![Mobile E2E tests (Android)](https://github.com/{{REPO}}/actions/workflows/mobile-tests.yml/badge.svg)](https://github.com/{{REPO}}/actions/workflows/mobile-tests.yml)
[![API tests (Rest Assured)](https://github.com/{{REPO}}/actions/workflows/api-tests.yml/badge.svg)](https://github.com/{{REPO}}/actions/workflows/api-tests.yml)

End-to-end test automation for a shopping app on Android and a REST API, running on every push in GitHub Actions.

| Layer | Application under test | Stack |
| --- | --- | --- |
| Mobile UI | [Sauce Labs My Demo App](https://github.com/saucelabs/my-demo-app-rn) (React Native) | WebdriverIO 9 · Appium 2 · UiAutomator2 · Mocha · JavaScript |
| API | [Restful-Booker](https://restful-booker.herokuapp.com/apidoc/index.html) | Java 17 · Rest Assured · JUnit 5 · JSON Schema · Maven |
| Reporting & CI | — | Allure · GitHub Actions (Android emulator) |

**31 automated test cases** — 20 mobile and 11 API — covering login, catalog, cart, checkout and payment validation, and the full booking lifecycle. See the [test plan](docs/test-plan.md) and the [test case list](docs/test-cases.md).

## Highlights

- **Page Object Model** — each screen is a class; tests read like user flows and locators live in one place.
- **Stable locators** — accessibility ids and Android `UiScrollable`, no XPath or screen coordinates.
- **No fixed sleeps** — every step waits for the screen or element it needs.
- **Isolated tests** — the app is restarted before each test; API tests create and delete their own data.
- **Payment validation** — mandatory card fields, incomplete card numbers and the full order flow.
- **API contract testing** — JSON schema validation plus positive, negative and authorisation cases.
- **Debuggable CI** — a failed mobile test saves a screenshot, the screen's XML source and the Appium log.
- **Tagged suites** — `@smoke` for the critical path, `@regression` for everything.

## Project structure

```
.
├── mobile/                        # WebdriverIO + Appium
│   ├── wdio.conf.js               # shared config: runner, reporters, failure artifacts
│   ├── wdio.android.conf.js       # Android capabilities
│   └── test/
│       ├── screens/               # Page Objects (BaseScreen, Login, Catalog, Product, Cart, Checkout…)
│       ├── helpers/               # app lifecycle, native dialogs, scrolling
│       ├── data/                  # test users, address and card data
│       └── specs/                 # login, catalog, cart, checkout
├── api/                           # Rest Assured + JUnit 5
│   └── src/test/
│       ├── java/.../tests/        # AuthTests, BookingTests
│       ├── java/.../utils/        # request specs, auth token, test data factory
│       └── resources/schemas/     # JSON schemas
├── docs/                          # test plan and test cases
└── .github/workflows/             # CI pipelines
```

## Running locally

### Mobile

Requirements: Node.js 22, Java 17, Android SDK with an emulator running.

```bash
cd mobile
npm ci
npx appium driver install uiautomator2@4.2.9
# download the APK from https://github.com/saucelabs/my-demo-app-rn/releases into mobile/apps/my-demo-app.apk
npm test                 # all tests
npm run test:smoke       # critical path only
npm run report           # open the Allure report
```

Appium is started and stopped automatically by the WebdriverIO Appium service.

### API

Requirements: Java 17 and Maven.

```bash
cd api
mvn test
mvn test -Dgroups=smoke  # smoke only
```

## Continuous integration

| Workflow | Trigger | What it does |
| --- | --- | --- |
| Mobile E2E tests | push, pull request, manual (choose suite) | Boots an Android 11 emulator, installs the latest app build, runs the suite, publishes the Allure report and failure artifacts |
| API tests | push, pull request, daily at 06:00 UTC | Runs the API suite and publishes the Allure report |

Reports are attached to each run under **Actions → run → Artifacts**.

## Author

**Başak Kaya** — QA Engineer · [LinkedIn](https://www.linkedin.com/in/basakkayaaa/)
