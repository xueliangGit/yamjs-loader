/*
 * @Author: xuxueliang
 * @Date: 2020-03-10 15:44:52
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-10 15:45:24
 */
module.exports = function getComponentConfig (content) {
  let k = 0
  let h = 0
  let z = 0
  let code = ''
  let isDo = false
  let leng = content.length
  for (var i = 0; i < leng; i++) {
    switch (content[i]) {
      case '{':
        ++h
        break
      case '}':
        --h
        break
      case '(':
        ++k
        break
      case ')':
        --k
        break
      case '[':
        ++z
        break
      case ']':
        --z
        break
    }
    if (k >= 1 && h >= 1) {
      isDo = true
      if (content[i] === ',' && z === 0) {
        code += ';'
      } else {
        code += content[i]
      }
    }
    if (k === 0 && h === 0 && z === 0 && isDo === true) {
      code = code.substring(1)
      break
    }
  }

  return Object.assign.apply(null, code.split(';').map(v => {
    let vArr = v.replace(/ /g, '').replace(/\n/g, '').split(':')
    if (~vArr[1].indexOf('require')) {
      vArr[1] = vArr[1].replace(/require/g, '((v)=>v)')
      // eslint-disable-next-line no-eval
      vArr[1] = eval(vArr[1])
    }
    return {
      [vArr[0]]: vArr[1]
    }
  }))
}
