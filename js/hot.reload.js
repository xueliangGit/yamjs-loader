/*
 * @Author: xuxueliang
 * @Date: 2020-03-11 15:27:21
 * @LastEditors: xuxueliang
 * @LastEditTime: 2020-09-10 20:04:45
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
    Object.keys(allApps).forEach(v => {
      allApps[v].$forceUpdate()
    })
    // console.log('[ ', name, ' ] 组件更新成功')
  }
}
function yamHotReload () {
  return {
    name: 'hot-reload-load',
    install: function (target) {
      target.addLifeCycleCall('$beforeCreate', function () {
        addApp(this)
      })
    }
  }
}
function yamHotReloadUpdate () {
  return {
    name: 'hot-reload-update',
    install: function (target) {
      target.addPrototype('$forceUpdate', function () {
        try {
          if (this instanceof comps[this._tagName] || this._editCalss instanceof comps[this._tagName]) {
            // this.update()
          } else {
            let newCopm = new comps[this._tagName]()
            let newElm = document.createDocumentFragment()
            newElm.getAttribute = (v) => {
              return this.elm.getAttribute(v)
            }
            newElm.innerHTML = ''
            newElm.isInited = false
            newElm._parentElement = this.elm._parentElement
            newElm._parentNode = this.elm._parentNode
            newCopm.$closestParentSymbol = this.$closestParentSymbol
            newCopm.renderAt(newElm, this.props)
            this.elm.innerHTML = ''
            this.elm.appendChild(newElm)
            this.elm.$ComponentSymbol = newCopm
            newCopm.elm = this.elm
            newCopm.$closestParentSymbol && newCopm.$closestParentSymbol.ChildComponentsManage.add(newCopm)
            newCopm.mutation = this.mutation
            this._is_hot_update = true
            this.__beforeDisconnectedCallback()
            this.__disconnectedCallback()
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
