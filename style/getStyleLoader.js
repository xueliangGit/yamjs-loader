/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 11:07:34
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 12:35:05
 */
let path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
let loaderInline1 = !isDev ? 'mini-css-extract-plugin/dist/loader.js!' : `style-loader?${ JSON.stringify({ sourceMap: !!isDev }) }!`
var styleCompilerPath = path.resolve(__dirname, './index.js?')
let loaderInline3 = `css-loader?${ JSON.stringify({ sourceMap: !!isDev }) }!postcss-loader?${ JSON.stringify({ sourceMap: !!isDev }) }!`
let suffixConfig = {
  'scss': 'scss',
  'sass': 'scss',
  'stylus': 'stylus',
  'styl': 'stylus',
  'less': 'less'
}
function preStyleLoader (suffix) {
  return suffix === 'css' ? '' : (suffixConfig[suffix] + `-loader?${ JSON.stringify({ sourceMap: !!isDev }) }!`)
}
function getYamStyleCompilerPath (id) {
  return id ? styleCompilerPath + JSON.stringify({
    id: id
  }) + '!' : ''
}
module.exports = function getStyleLoader (option = {}) {
  let { suffix, isExtra = true, id } = option
  return (isExtra ? loaderInline1 : '') + getYamStyleCompilerPath(id) + loaderInline3 + preStyleLoader(suffix)
}
