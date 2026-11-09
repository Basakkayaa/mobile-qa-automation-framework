/**
 * Shared WebdriverIO configuration.
 * Platform-specific files (wdio.android.conf.js) extend this one and only add capabilities.
 */
import fs from 'node:fs';
import path from 'node:path';

const ARTIFACTS_DIR = path.resolve('./artifacts');

export const config = {
    runner: 'local',
    specs: ['./test/specs/**/*.spec.js'],
    maxInstances: 1,

    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 20000,
    connectionRetryTimeout: 180000,
    connectionRetryCount: 2,

    services: [
        ['appium', {
            command: './node_modules/.bin/appium',
            args: { relaxedSecurity: true, log: './artifacts/appium.log' },
        }],
    ],

    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 240000,
        // Re-run a failing test once: emulators on shared CI runners are occasionally slow.
        retries: process.env.CI ? 1 : 0,
    },

    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: false,
        }],
    ],

    onPrepare() {
        fs.rmSync(ARTIFACTS_DIR, { recursive: true, force: true });
        fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
    },

    /**
     * On failure, attach a screenshot and the screen's XML source to the Allure report
     * and also save them to ./artifacts, so a failed CI run can be debugged without a device.
     */
    async afterTest(test, _context, { passed }) {
        if (passed) return;
        const name = `${test.parent} - ${test.title}`.replace(/[^a-z0-9-]+/gi, '_').slice(0, 120);
        await browser.saveScreenshot(path.join(ARTIFACTS_DIR, `${name}.png`));
        const source = await driver.getPageSource();
        fs.writeFileSync(path.join(ARTIFACTS_DIR, `${name}.xml`), source);
        // A compact list of what was on screen, readable straight from the CI log.
        const onScreen = [...source.matchAll(/(?:content-desc|text)="([^"]+)"/g)].map((m) => m[1]);
        console.log(`[on screen at failure] ${[...new Set(onScreen)].join(' | ')}`);
    },
};
