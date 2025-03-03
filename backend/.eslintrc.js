module.exports = {
    parser: 'babel-eslint',
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: 'semistandard',
    parserOptions: {
        ecmaVersion: 8
    },
    rules: {
        'no-return-await': 'off',
        'camelcase': 2,
        'no-console': 'off',
        "no-tabs": 0,
        indent: [
            'error',
            4,
            {
                SwitchCase: 1
            }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        quotes: [
            1,
            'single'
        ],
        semi: [
            1,
            'always'
        ],
        'no-console': 1,
        'space-before-function-paren': 0,
        'no-multiple-empty-lines': [
            'off'
        ]
    },
    globals: {
        $: true,
        __BROWSER__: true,
        __DEV__: true,
        __SIT__: true,
        __UAT__: true,
        __PROD__: true,
        __DEBUG_UAT__: true,
        __DEBUG_PROD__: true,
        __VPC__: true,
        describe: true,
        it: true,
        BMap: true
    }
};
