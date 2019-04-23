import toolbar from './toolbar'

toolbar.install = function (Vue) {
  Vue.component(toolbar.name, toolbar)
}

export default toolbar
