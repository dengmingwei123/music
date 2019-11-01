import Vue from 'vue'
import Router from 'vue-router'

// 引入推荐页面
import Recommend from '@/components/recommend/Recommend.vue'
// 引入歌手页面
import Singer from '@/components/singer/Singer.vue'
// 引入音乐列表页面
import SingerDetail from '@/components/singer-detail/Singer-detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    { path: '/recommend', component: Recommend },
    {
      path: '/singer',
      component: Singer,
      children: [{ path: ':id', component: SingerDetail }]
    }
  ]
})
