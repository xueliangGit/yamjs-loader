/*
 * @Author: xuxueliang
 * @Date: 2019-12-16 11:21:45
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-12 20:05:53
 */
// var loaderUtils = require('loader-utils')
var getComponentConfig = require('./utils/getComponentConfig')
var getAllStylePath = require('./utils/getAllStylePath')
var editModulePath = require('./js/editModulePath')
var hotUpdateJs = require('./js/hot.update')
var getStyleLoader = require('./style/getStyleLoader')
module.exports = function (content, map, meta) {
  if (~content.indexOf('didiByYamjsLoader')) return content
  let id = ''
  let isExtra = true
  // 先检测是否是yamjs app
  if (~content.indexOf(`from 'yamjs'`) && ~content.indexOf('@Component')) {
    let config = getComponentConfig(content.split('@Component')[1])
    config.tagName = config.tagName.replace(/'/g, '')
    id = 'com-' + config.tagName
    if (config.shadow === 'true') {
      isExtra = false
    }
    content = hotUpdateJs(content, this.resourcePath)
  }
  content = editModulePath(content)
  let stylePaths = getAllStylePath(content)
  let isDo = []
  stylePaths.forEach(v => {
    if (v && !~isDo.indexOf(v.text)) {
      content = content.replace(new RegExp(v.text), getStyleLoader({ isExtra, id, suffix: v.suffix }) + v.text)
      isDo.push(v.text)
    }
  })
  content += `
  /* didiByYamjsLoader */
  `
  return content
}
