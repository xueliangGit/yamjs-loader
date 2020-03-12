/*
 * @Author: xuxueliang
 * @Date: 2020-03-07 15:33:45
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 13:04:31
 */
var loaderUtils = require('loader-utils')

module.exports = function (content, map, meta) {
  let query = loaderUtils.getOptions(this)
  let styleStr = content.split('exports.push([module.id, "')
  try {
    styleStr[1] = getStyleStr(query.id, styleStr[1])
  } catch (e) {
    console.log(e)
  }
  return styleStr.join('exports.push([module.id,"')
}
function getStyleStr (_id, style) {
  if (!style) return ''
  if (!Array.isArray(style)) {
    style = [style]
  }
  return style.map(v => _getStrByStyle(_id, v)).join('')
}
function getDomStyleFlag (_id, attr) {
  return attr ? _id : '[' + _id + ']'
}

function _getStrByStyle (_id, style) {
  if (style) {
    // 处理map
    var strMap = (typeof style === 'string' ? style : style[1]).split('sourceMappingURL=')
    var str = strMap[0].split('\\n')
    let styleConfig = {}
    if (~str[0].indexOf('[config]')) {
      // 获取配置信息
      try {
        let getConf = findStyleConfig(str, 1)
        styleConfig = getConf.config || {}
        str.splice(0, getConf.index + 1)
        for (var i = 0; i <= getConf.index; i++) {
          str[i] = '// \\n'
        }
      } catch (e) {
        console.error(e)
      }
    }
    strMap[0] = map(str, function (v, i) {
      if (~v.indexOf('{')) {
        if (~v.indexOf('[root]')) {
          return v.replace('[root]', getDomStyleFlag(_id + '-root')) // }
        }
        return styleConfig.scope ? getIdStyle(v.replace(' {', '').replace('{', ''), getDomStyleFlag(_id)) + '{' : v
      }
      return v
    }).join('\\n')
    return strMap.join('sourceMappingURL=')
  }
  return ''
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
function forEach (array, v = () => { }, get = false) {
  let getArr = []
  // eslint-disable-next-line no-cond-assign
  let l = array.length
  for (var i = 0; i < l; i++) {
    let runResult = v(array[i], i)
    get && getArr.push(runResult)
    if (typeof runResult === 'boolean' && !runResult && !get) {
      return get ? getArr : null
    }
  }
  return get ? getArr : null
}
function map (array, v = () => { }) {
  return forEach(array, v, true)
}
