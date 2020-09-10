/*
 * @Author: xuxueliang
 * @Date: 2020-03-10 18:53:00
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-09-10 20:23:47
 */
let { isDev } = require('../utils/conf')
let laoderPath = isDev ? 'yamjs/dist/loader/yam.esm.js' : 'yamjs/dist/loader/yam.esm.min.js'
module.exports = function editModulePath (context) {
  let match1 = context.match(/from\s+'yamjs'/g)
  let match2 = context.match(/from\s+"yamjs"/g)
  match1 && match1.forEach(function (v) {
    context = context.replace(v, v.replace('yamjs', laoderPath))
  })
  match2 && match2.forEach(function (v) {
    context = context.replace(v, v.replace('yamjs', laoderPath))
  })
  return context
}
