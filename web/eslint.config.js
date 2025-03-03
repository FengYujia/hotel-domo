// eslint.config.js
const pluginVue = require('eslint-plugin-vue');

module.exports = [
    {
        ignores: ['node_modules/**/*'],
    },

    // add more generic rulesets here, such as:
    // js.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    // ...pluginVue.configs['flat/vue2-recommended'], // Use this if you are using Vue.js 2.x.
    {
        files: ['**/*.js', '**/*.vue'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'vue/html-indent': ['error', 'tab'],  // enforce tabs in template
            'vue/multi-word-component-names': 0,
            'vue/singleline-html-element-content-newline': 'off',
            'vue/multiline-html-element-content-newline': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/no-v-model-argument': 'off',
            'vue/html-closing-bracket-newline': 'off',
            'vue/html-indent': 'off',
            'multiline': 'off',
            'vue/first-attribute-linebreak': 'off',
            'no-return-await': 'off',
            'camelcase': 'error',
            'no-console': 'off',
            'no-tabs': 'off', // 确保不禁用制表符
            // indent: [
            //     'error',
            //     'tab', // 将缩进设置为使用制表符
            //     {
            //         SwitchCase: 1,
            //     },
            // ],
            'linebreak-style': ['error', 'unix'],
            quotes: ['warn', 'single'],
            semi: ['warn', 'always'],
            'space-before-function-paren': 'off',
            'no-multiple-empty-lines': 'off',
        },
    }
];