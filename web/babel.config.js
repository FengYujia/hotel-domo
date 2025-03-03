module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset',
        '@babel/preset-react',  // 支持 JSX 语法
    ],
    plugins: [
        [
            'import',
            {
                libraryName: 'ant-design-vue',
                libraryDirectory: 'es',
                style: 'css' // 如果你想定制主题，改为 'true'
            }
        ]
    ]
};
