/*
 * @Author: xuxueliang
 * @Date: 2020-03-29 19:45:15
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-29 19:45:29
 */
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
module.exports = { map, forEach }