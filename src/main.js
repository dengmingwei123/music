import Vue from 'vue'
import App from './App'
// 路由
import router from './router'
// vuex
import store from './store'

// 引入基础样式
import '@/common/stylus/index.styl'

// 引入cube-ui
import Cube from 'cube-ui'

// 引入vue-awesonme-swiper
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

// 引入vue-lazyload
import VueLazyLoad from 'vue-lazyload'

// 使用cube-ui
Vue.use(Cube)
// 使用vue-awesome-swiper
Vue.use(VueAwesomeSwiper /* { default global options } */)
// 使用vue-lazyload
Vue.use(VueLazyLoad, {
  loading: require('@/common/image/logo.png')
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
