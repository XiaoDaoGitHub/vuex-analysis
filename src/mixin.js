export default function (Vue) {
  const version = Number(Vue.version.split('.')[0])
  // Vue1.x的版本和2.x的版本安装有一点不同
  if (version >= 2) {
    Vue.mixin({ beforeCreate: vuexInit })
  } else {
    // override init and inject vuex init procedure
    // for 1.x backwards compatibility.
    const _init = Vue.prototype._init
    Vue.prototype._init = function (options = {}) {
      options.init = options.init
        ? [vuexInit].concat(options.init)
        : vuexInit
      _init.call(this, options)
    }
  }

  /**
   * Vuex init hook, injected into each instances init hooks list.
   */

  function vuexInit () {
    // this 执行vue实例，$options是new Vue传入的
    const options = this.$options
    // store injection
    // 我们会把store作为option传入
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    // 没有store的话到当前实例的父级去查找，这样每一个子实例也都有了store属性
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
  }
}
