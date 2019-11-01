<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
// 引入头部组件
import MHeader from '@/components/m-header/Header'
// 引入导航组件
import Tab from '@/components/tab/Tab'
// 引入播放器组件
import Player from '@/components/player/Player'
export default {
  components: {
    MHeader,
    Tab,
    Player
  }
}
</script>

<style>
</style>
