/*
 * @Author: xuxueliang
 * @Date: 2020-03-10 15:46:17
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 11:52:57
 */
const styleFix = [`.styl`, `.stylus`, `.scss`, `.sass`, `.less`]
module.exports = function getAllStylePath (content) {
  let array = []
  styleFix.forEach(v => {
    array.push(...getStylePath(content, v + `'`), ...getStylePath(content, v + `"`))
  })
  return array
}

function getStylePath (content, suffix = '.stylus\'') {
  if (~content.indexOf(suffix)) {
    let stylusPathArr = content.split(suffix)
    let pathsArr = [getTab(stylusPathArr[0], -1, suffix)]
    for (var i = 1; i < stylusPathArr.length - 1; i++) {
      // 从 前获取
      // let afterFlag = getTab(stylusPathArr[i], 1)
      // 从后获取
      pathsArr.push(getTab(stylusPathArr[i], -1, suffix))
    }
    return pathsArr
  }
  return []
}

function getTab (str, direct, suffix) {
  var i = direct > 0 ? 0 : str.length - 1
  for (; direct > 0 ? i < str.length : i >= 0; i += direct) {
    if (str[i] === "'" || str[i] === '"') {
      return {
        flag: str[i],
        text: (direct < 0 ? str.substring(i + 1) : str.substring(0, i - 1)) + suffix.substring(0, suffix.length - 1),
        suffix: suffix.substring(1, suffix.length - 1),
        i: direct
      }
    }
  }
  return {}
}
