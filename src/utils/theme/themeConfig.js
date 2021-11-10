const { generate } = require('@ant-design/colors');
// 色系里第五个
const primaryColor = '#0960bd';

// 获取antd 色系
function generateAntColors(color, theme = 'default') {
    return generate(color, {
        theme,
    });
}

// 获取主题模式切换色系
function getThemeToggleColors(color) {
    //主色系
    const tc = color || primaryColor;
    const colors = generateAntColors(tc);
    const primary = colors[5];
    //辅助色系，因为 antd 目前没针对夜间模式设计，所以增加辅助色系以保证夜间模式的正常切换
    const modeColors = generateAntColors(primary);

    return [...colors, ...modeColors];
}

function dropPrefix(colorStr) {
    return colorStr.replace('#', '');
}

function toNum3(colorStr) {
    colorStr = dropPrefix(colorStr);
    if (colorStr.length === 3) {
        colorStr = colorStr[0] + colorStr[0] + colorStr[1] + colorStr[1] + colorStr[2] + colorStr[2];
    }
    var r = parseInt(colorStr.slice(0, 2), 16);
    var g = parseInt(colorStr.slice(2, 4), 16);
    var b = parseInt(colorStr.slice(4, 6), 16);
    return [r, g, b];
}

function pad2(num) {
    var t = num.toString(16);
    if (t.length === 1) t = '0' + t;
    return t;
}

function mix(color1, color2, weight, alpha1, alpha2) {
    color1 = dropPrefix(color1);
    color2 = dropPrefix(color2);
    if (weight === void 0) weight = 0.5;
    if (alpha1 === void 0) alpha1 = 1;
    if (alpha2 === void 0) alpha2 = 1;
    var w = 2 * weight - 1;
    var alphaDelta = alpha1 - alpha2;
    var w1 = ((w * alphaDelta === -1 ? w : (w + alphaDelta) / (1 + w * alphaDelta)) + 1) / 2;
    var w2 = 1 - w1;
    var rgb1 = toNum3(color1);
    var rgb2 = toNum3(color2);
    var r = Math.round(w1 * rgb1[0] + w2 * rgb2[0]);
    var g = Math.round(w1 * rgb1[1] + w2 * rgb2[1]);
    var b = Math.round(w1 * rgb1[2] + w2 * rgb2[2]);
    return '#' + pad2(r) + pad2(g) + pad2(b);
}

function mixLighten(colorStr, weight) {
    return mix('fff', colorStr, weight);
}

function mixDarken(colorStr, weight) {
    return mix('000', colorStr, weight);
}

const tinycolor = require('tinycolor2');
function generateColors(color = primaryColor) {
    const arr = new Array(19).fill(0);
    const lightens = arr.map((_t, i) => {
        return mixLighten(color, i / 5);
    });

    const darkens = arr.map((_t, i) => {
        return mixDarken(color, i / 5);
    });

    const alphaColors = arr.map((_t, i) => {
        return tinycolor(color)
            .setAlpha(i / 20)
            .toRgbString();
    });

    const shortAlphaColors = alphaColors.map((item) => item.replace(/\s/g, '').replace(/0\./g, '.'));

    const tinycolorLightens = arr
        .map((_t, i) => {
            return tinycolor(color)
                .lighten(i * 5)
                .toHexString();
        })
        .filter((item) => item !== '#ffffff');

    const tinycolorDarkens = arr
        .map((_t, i) => {
            return tinycolor(color)
                .darken(i * 5)
                .toHexString();
        })
        .filter((item) => item !== '#000000');

    return [
        ...lightens,
        ...darkens,
        ...alphaColors,
        ...shortAlphaColors,
        ...tinycolorDarkens,
        ...tinycolorLightens,
    ].filter((item) => !item.includes('-'));
}

module.exports = {
    generateAntColors,
    getThemeToggleColors,
    generateColors,
};
