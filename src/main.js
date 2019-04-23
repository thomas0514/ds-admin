import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css
import _ from "lodash"
import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import VueQuillEditor from 'vue-quill-editor'
import Viewer from 'v-viewer' // 图片查看器

/* 全局公共组件 */
import toolbar from './components/toolbar'


// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'viewerjs/dist/viewer.css'

Vue.use(VueQuillEditor)

Vue.use(toolbar)


Vue.use(ElementUI, {
  locale
})

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    scalable: false,
  }
})
Vue.prototype._ = _
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
