/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 10:51:25
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-12 20:06:10
 */
// let isReadey = false
let path = require('path')
const isDev = process.env.NODE_ENV !== 'production'
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
  }
  if (Appname) {

    context += `
    \n/* yamjs hot reload */\n
    if (module.hot) {
      // 实现YAMJS热更新
      var hotAPI = require('${ hotPath }')
      hotAPI.install(Yam,${Appname })
      module.hot.accept();
    }
    `
  }
  return context
}
