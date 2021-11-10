module.exports = {
  purge: {
    enabled: false, //是否删除未使用的样式  生产环境删除
    content:[
      './public/index.html',
      './src/**/*.{vue,js,jsx}',
    ]
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
