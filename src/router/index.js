import Vue from 'vue'
import Router from 'vue-router'

// 引入用户页面
const User = () => import('@/components/user/User.vue')

// 引入搜索页面
const Search = () => import('@/components/search/Search.vue')
// 引入排行音乐列表页面
const RankDetail = () => import('@/components/rank-detail/Rank-detail.vue')

// 引入排行页面
const Rank = () => import('@/components/rank/Rank.vue')
// 引入歌手音乐列表页面
const SingerDetail = () => import('@/components/singer-detail/Singer-detail.vue')

// 引入歌手页面
const Singer = () => import('@/components/singer/Singer.vue')

// 引入推荐音乐列表页面
const RecommendDetail = () => import('@/components/recommend-detail/Recommend-detail.vue')

// 引入推荐页面
const Recommend = () => import('@/components/recommend/Recommend.vue')

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
    },
    {
      path: '/search',
      component: Search,
      children: [{ path: ':id', component: SingerDetail }]
    },
    { path: '/user', component: User }
  ]
})
