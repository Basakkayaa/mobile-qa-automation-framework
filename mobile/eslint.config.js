import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
                ...globals.mocha,
                browser: 'readonly',
                driver: 'readonly',
                $: 'readonly',
                $$: 'readonly',
                expect: 'readonly',
            },
        },
        rules: {
            indent: ['error', 4],
            'no-await-in-loop': 'off',
        },
    },
    { ignores: ['node_modules/', 'allure-results/', 'allure-report/', 'artifacts/', 'apps/'] },
];
