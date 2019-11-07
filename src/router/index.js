import Vue from 'vue'
import Router from 'vue-router'

// 引入推荐页面
import Recommend from '@/components/recommend/Recommend.vue'
// 引入推荐音乐列表页面
import RecommendDetail from '@/components/recommend-detail/Recommend-detail.vue'

// 引入歌手页面
import Singer from '@/components/singer/Singer.vue'
// 引入歌手音乐列表页面
import SingerDetail from '@/components/singer-detail/Singer-detail.vue'

// 引入排行页面
import Rank from '@/components/rank/Rank.vue'
// 引入排行音乐列表页面
import RankDetail from '@/components/rank-detail/Rank-detail.vue'

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', redirect: '/recommend' },
    {
      path: '/recommend',
      component: Recommend,
      children: [{ path: ':id', component: RecommendDetail }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{ path: ':id', component: SingerDetail }]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{ path: ':id', component: RankDetail }]
    }
  ]
})
