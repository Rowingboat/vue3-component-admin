const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);

// 生产环境去除consloe.log
const plugins = [];
if (IS_PROD) {
    plugins.push('transform-remove-console');
}

module.exports = {
    presets: ['@vue/cli-plugin-babel/preset'],
    plugins: [
        ...plugins,
        [
            'import',
            {
                libraryName: 'ant-design-vue',
                // 选择子目录 例如 es 表示 ant-design-vue/es/component
                // lib 表示 ant-design-vue/lib/component
                libraryDirectory: 'es',
                style: true, // or 'css'
                // 默认不使用该选项，即不导入样式 , 注意 ant-design-vue 使用 js 文件引入样式
                // true 表示 import  'ant-design-vue/es/component/style'
                // 'css' 表示 import 'ant-design-vue/es/component/style/css'
            },
        ],
    ],
};
