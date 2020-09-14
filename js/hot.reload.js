/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 15:27:21
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-09-14 12:44:31
 */
var Yam = null
let appsInstalled = (window.appsInstalled || (window.appsInstalled = {}))
let comps = {}
function addApp (app) {
  (appsInstalled[app._tagName] || (appsInstalled[app._tagName] = {}))[app._eid] = app
}
function delApp (app) {
  if (appsInstalled[app._tagName][app._eid]) {
    delete appsInstalled[app._tagName][app._eid]
  }
}
function updateApp (name) {
  let allApps = appsInstalled[name]
  if (allApps) {
    let keys = Object.keys(allApps)
    keys.forEach((v, i) => {
      allApps[v].$forceUpdate({ isLast: keys.length - 1 === i })
    })
  }
}
function yamHotReload () {
  return {
    name: 'hot-reload-load',
    install: function (target) {
      (target.addLifeCycleCall || target.addGlobalLife)('$beforeCreate', function () {
        addApp(this)
      })
    }
  }
}
function isUpdate (a, b) {
  let isJs
  let isHtml
  let isStyle
  let keys = Object.getOwnPropertyNames(b)
  if (a.constructor._oriStyle.toString() !== b.constructor._oriStyle.toString()) {
    isStyle = true
  }
  for (let i = 0, item; item = keys[i]; i++) {
    if (!a[item]) {
      isJs = true
      return { isJs }
    }
    if (a[item].toString() !== b[item].toString()) {
      if (item === 'render') {
        isHtml = true
      } else {
        isJs = true
        return { isJs }
      }
    }
  }
  return { isJs, isHtml, isStyle }
}
function rerednerToElm (context, ClassFn) {
  let newCopm = new ClassFn()
  let elm = context.elm
  newCopm.$slotSymbol = context.$slotSymbol
  let newElm = elm.cloneNode(true)
  newElm.innerHtml = ''
  newElm._runfn_ = elm._runfn_
  newCopm.renderAt(newElm)
  elm.parentElement.replaceChild(newElm, elm)
}
function yamHotReloadUpdate () {
  return {
    name: 'hot-reload-update',
    install: function (target) {
      target.addPrototype('$forceUpdate', function ({ isLast }) {
        let newComClass = comps[this._tagName]
        try {
          console.log(this instanceof newComClass)
          if (this instanceof newComClass || this._editCalss instanceof newComClass) {
            // this.update()
          } else {
            let { isHtml, isJs, isStyle } = isUpdate(this.__proto__, newComClass.prototype)
            if (isHtml) {
              this.__proto__.render = newComClass.prototype.render
              this.update()
            } else if (isJs) {
              if (this.$closestParentSymbol) {
                this.$closestParentSymbol.update()
              } else {
                // console.log('从新渲染')
                rerednerToElm(this, newComClass)
              }
            } else if (isStyle) {
              // 更新isStyle
              if (isLast) {
                this.__proto__.constructor._oriStyle = newComClass.prototype.constructor._oriStyle
              }
              this._style = (Yam._gSS ? Yam._gSS(this._cid, newComClass.prototype.constructor._oriStyle) : newComClass.prototype.constructor._oriStyle).toString() // getStyleStr(this._cid, style) 使用了loader 后不需要这个了
              this.initStyle()
            }
          }
        } catch (e) {
          console.log(e)
        }
      })
    }
  }
}
function yamHotReloadDestroy () {
  return {
    name: 'hot-reload-destory',
    install: function (target) {
      (target.addLifeCycleCall || target.addGlobalLife)('$beforeDestroy', function () {
        delApp(this)
      })
    }
  }
}
exports.install = function (yam, app) {
  if (!Yam) {
    Yam = yam.__esModule ? yam.default : yam
    Yam.use(yamHotReload())
    Yam.use(yamHotReloadDestroy())
    Yam.use(yamHotReloadUpdate())
  }
  comps[app._tagName] = app
  updateApp(app._tagName)
}
