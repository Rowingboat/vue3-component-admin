const client = require('webpack-theme-color-replacer/client');
const { generateAntColors, primaryColor, getThemeToggleColors, generateColors } = require('./themeConfig');
const { getThemeVariables } = require('ant-design-vue/dist/theme');
const { resolve } = require('path');

/**
 * @description 主题初始化配置
 * @param {*} color : ;
 * @param {*} $theme
 * @returns
 */
function getThemeColors(color) {
  console.log([...getThemeToggleColors(color),...generateColors(color)]);
    return [...getThemeToggleColors(color),...generateColors(color)];
}

/**
 * @description 修改主题颜色
 * @param {*} newColor
 * @param {*} $theme
 * @returns
 */
function changeThemeColor(newColor, $theme) {
  console.log(newColor);
    let promise = client.changer.changeColor({ newColors: getThemeColors(newColor, $theme) });
    return promise;
}

/**
 * @description less 全局变量
 * @param {*} dark : ;
 * @returns
 */
function generateModifyVars(dark = false) {
    const palettes = generateAntColors(primaryColor);
    const primary = palettes[5];

    // 设置色系
    const primaryColorObj = {};
    for (let index = 0; index < 10; index++) {
        primaryColorObj[`primary-${index + 1}`] = palettes[index];
    }

    // 获取主题变量
    const modifyVars = getThemeVariables({ dark });

    return {
        ...modifyVars,
        // 用于全局导入，以避免单独导入每个样式文件
        // 避免重复引用
        hack: `${modifyVars.hack} @import (reference) "${resolve('src/design/config.less')}";`,
        'primary-color': primary,
        ...primaryColorObj,
        'info-color': primary,
        'processing-color': primary,
        'success-color': '#55D187', //  Success color
        'error-color': '#ED6F6F', //  False color
        'warning-color': '#EFBD47', //   Warning color
        // 'border-color-base': '#EEEEEE',
        'font-size-base': '14px', //  Main font size
        'border-radius-base': '2px', //  Component/float fillet
        'link-color': primary, //   Link color
        'app-content-background': '#fafafa', //   Link color
    };
}

module.exports = {
    getThemeColors,
    generateModifyVars,
    changeThemeColor,
};
