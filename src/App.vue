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

<style lang="stylus">
@import '~@/common/stylus/variable.styl';

.cube-dialog {
  .cube-popup-container {
    .cube-popup-content {
      .cube-dialog-main {
        border-radius: 10px;
        background-color: $color-highlight-background;

        .cube-dialog-confirm {
          .cube-dialog-title {
            font-size: 18px;
            color: $color-text-l;
          }

          .cube-dialog-btns {
            .cube-dialog-btn {
              background-color: $color-highlight-background;
            }
          }
        }
      }
    }
  }
}
</style>
