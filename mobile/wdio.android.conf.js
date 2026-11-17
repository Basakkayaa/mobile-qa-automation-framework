import path from 'node:path';
import { config as baseConfig } from './wdio.conf.js';

export const APP_PACKAGE = 'com.saucelabs.mydemoapp.rn';

export const config = {
    ...baseConfig,
    capabilities: [{
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'Android Emulator',
        'appium:app': path.resolve(process.env.APP_PATH || './apps/my-demo-app.apk'),
        'appium:appPackage': APP_PACKAGE,
        'appium:appWaitActivity': '*',
        'appium:autoGrantPermissions': true,
        'appium:newCommandTimeout': 240,
        'appium:uiautomator2ServerInstallTimeout': 120000,
        'appium:adbExecTimeout': 120000,
        'appium:androidInstallTimeout': 180000,
    }],
};
