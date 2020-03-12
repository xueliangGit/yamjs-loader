/*
 * @Author: xuxueliang
 * @Date: 2020-03-10 18:53:00
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-10 19:25:07
 */
let laoderPath = 'yamjs/dist/loader/yam.esm.js'
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
