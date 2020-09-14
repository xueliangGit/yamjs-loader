/*
 * @Author: xuxueliang
 * @Date: 2020-03-07 15:33:45
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-09-14 12:45:24
 */
const loaderUtils = require('loader-utils')
const getConfig = require('./getConfig')
const { map } = require('../utils')
module.exports = function (content, map, meta) {
  let query = loaderUtils.getOptions(this)
  let styleStr = content.split('exports.push([module.id, "')
  try {
    styleStr[1] = getStyleStr(query.id, styleStr[1], query)
  } catch (e) {
    console.log(e)
  }
  return styleStr.join('exports.push([module.id,"')
}
function getStyleStr (_id, style, query) {
  if (!style) return ''
  if (!Array.isArray(style)) {
    style = [style]
  }
  return style.map(v => _getStrByStyle(_id, v, query)).join('')
}
function getDomStyleFlag (_id, attr) {
  return attr ? _id : '[' + _id + ']'
}

function _getStrByStyle (_id, style, query) {
  if (style) {
    // 处理map
    var strMap = (typeof style === 'string' ? style : style[1]).split('sourceMappingURL=')
    var str = strMap[0].split('\\n')
    let styleConfig = {}
    const config_ = getConfig(str)
    str = config_.str
    styleConfig = Object.assign({}, config_.styleConfig || {}, query || {})
    strMap[0] = map(str, function (v, i) {
      if (~v.indexOf('{')) {
        if (~v.indexOf('[root]')) {
          return v.replace('[root]', getDomStyleFlag(_id + '-root')) // }
        }
        return styleConfig.scoped ? getIdStyle(v.replace(' {', '').replace('{', ''), getDomStyleFlag(_id)) + '{' : v
      }
      return v
    }).join('\\n')
    return strMap.join('sourceMappingURL=')
  }
  return ''
}

function getIdStyle (str, id) {
  if (~str.indexOf('keyframes') ||
    ~str.indexOf('%') ||
    ~str.indexOf(':root') ||
    (str.indexOf('.') === -1 && (~str.indexOf('from') || ~str.indexOf('to')))) {
    return str
  }
  if (~str.indexOf(':')) {
    let strArr = str.split(':')
    strArr[0] = strArr[0] + id
    return strArr.join(':')
  }
  return str + id
}
