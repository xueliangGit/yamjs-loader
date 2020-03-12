/*
 * @Author: xuxueliang
 * @Date: 2020-03-07 15:28:08
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-03-11 12:00:03
 */
var IS_TEST = !!process.env.YAMJS_LOADER_TEST
var fs = require('fs')
var path = require('path')

exports.lib = function (file) {
  return path.resolve(__dirname, '../', file)
}

exports.dep = function (dep) {
  if (IS_TEST) {
    return dep
  } else if (fs.existsSync(path.resolve(__dirname, '../node_modules', dep))) {
    // npm 2 or npm linked
    return 'yamjs-loader/node_modules/' + dep
  } else {
    // npm 3
    return dep
  }
}
