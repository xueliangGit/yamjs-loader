/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 10:51:25
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-09-10 20:22:53
 */
// let isReadey = false
let path = require('path')
let { isDev } = require('../utils/conf')
module.exports = function (context, jsPath) {
  if (!isDev) return context
  // if (isReadey) {
  //   return context
  // }
  // isReadey = true
  let hotPath = path.resolve(__dirname, './hot.reload.js') // path.relative(jsPath, path.join(__dirname, './hot.reload.js'))

  let AppnameArray = context.match(/export default\s+[^ ]*/)
  let Appname = null
  if (AppnameArray) {
    Appname = AppnameArray[0].split('default')[1]
    Appname = Appname.split(';')[0]
    Appname = Appname.split('\n')[0]
  }
  if (Appname) {

    context += `
    \n/* yamjs hot reload */\n
    if (module.hot) {
      // 实现YAMJS热更新
      var hotAPI = require('${ hotPath}')
      hotAPI.install(Yam,${Appname})
      module.hot.accept();
    }
    `
  }
  return context
}
