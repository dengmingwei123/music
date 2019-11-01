<template>
  <div class='tab'>
    <router-link
      to='recommend'
      tag="div"
      class="tab-item"
    ><span class="tab-text">推荐</span></router-link>
    <router-link
      to='singer'
      tag="div"
      class="tab-item"
    ><span class="tab-text">歌手</span></router-link>
    <router-link
      to='rank'
      tag="div"
      class="tab-item"
    ><span class="tab-text">排行</span></router-link>
    <router-link
      to='search'
      tag="div"
      class="tab-item"
    ><span class="tab-text">搜索</span></router-link>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.tab {
  display: flex;
  height: 44px;

  .tab-item {
    flex: 1;
    text-align: center;
    line-height: 44px;

    .tab-text {
      font-size: $font-size-medium;
      color: $color-text-l;
      padding-bottom: 5px;
    }

    &.router-link-active {
      .tab-text {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
