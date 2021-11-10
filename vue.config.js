// 动态修改主题
const ThemeColorReplacer = require('webpack-theme-color-replacer');
const {getThemeColors, generateModifyVars} = require('./src/utils/theme/themeUtil');
const resolveCss = () => {};

// 生产环境下将资源压缩成gzip格式
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const productionGzipExtensions = ['js', 'css'];
const isProd = process.env.NODE_ENV === 'production';

const assetsCDN = {
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        nprogress: 'NProgress',
        lodash:'_',
    },
    css: [],
    js: [],
};

module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
    outputDir: 'dist',
    assetsDir: 'assets',
    indexPath: 'index.html',
    // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
    productionSourceMap: false,
    // 是一个函数，会接收一个基于 webpack-chain的 ChainableConfig 实例
    chainWebpack: (config) => {},
    configureWebpack: (config) => {
        // 添加切换主题插件
        config.plugins.push(
            new ThemeColorReplacer({
                fileName: 'css/theme-colors-[contenthash:8].css',
                matchColors: getThemeColors(), // 自定义颜色
                injectCss: true, // 将css 注入到js中
                // resolveCss, // 对结果css 进行处理  fun
            })
        );

        // 生产环境下将资源压缩成gzip格式
        if (isProd) {
            config.plugins.push(
                new CompressionWebpackPlugin({
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8,
                })
            );
        }

        // if prod, add externals
        // if (isProd) {
        //     config.externals = assetsCDN.externals;
        // }
    },
    css: {
        loaderOptions: {
            // 这里的选项会传递给 less-loader
            less: {
                lessOptions: {
                    strictMath: false,
                    // less 地址
                    // additionalData: `@env: ${process.env.NODE_ENV};`,
                    // 变量配置
                    modifyVars: generateModifyVars(),
                    javascriptEnabled: true,
                },
            },
            // 这里的选项会传递给 postcss-loader
            // postcss: {},
        },
    },
};
