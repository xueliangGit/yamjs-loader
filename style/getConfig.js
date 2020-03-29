/*
 * @Author: xuxueliang
 * @Date: 2020-03-29 19:38:11
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-29 20:00:54
 */
const { map } = require('../utils')

module.exports = function (str) {
  let styleConfig = {}
  if (~str[0].indexOf('[config]')) {
    // 获取配置信息
    try {
      let getConf = findStyleConfig(str, 1)
      styleConfig = getConf.config || {}
      // str.splice(0, getConf.index)
      for (var i = 0; i <= getConf.index; i++) {
        str[i] = '/**/ \\n'
      }
    } catch (e) {
      console.error(e)
    }
  }
  return { str, styleConfig }
}
function findStyleConfig (arr, index, str = []) {
  if (~arr[index].indexOf('}')) {
    return {
      index,
      config: Object.assign.apply(null, map(str, v => {
        var vp = v.split(':')
        return {
          [vp[0]]: vp[1]
        }
      }))
    }
  } else {
    str.push(arr[index].replace(/ /g, '').replace(/;/g, ''))
    return findStyleConfig(arr, index + 1, str)
  }
}