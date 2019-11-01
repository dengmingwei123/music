<template>
  <div class="header">
    <div class="title">
      <h1>我的音乐</h1>
    </div>
    <div class="user">
      <i class="icon-mine"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.header {
  position: relative;
  height: 44px;
  color: $color-theme;

  .title {
    position: relative;
    text-align: center;
    line-height: 44px;
    font-size: $font-size-large;

    &::before {
      content: '';
      border-radius: 44px;
      position: absolute;
      width: 32px;
      height: 30px;
      top: 6px;
      left: 50%;
      transform: translateX(-75px);
      background: url('./logo.png');
      background-size: 100% 100%;
    }
  }

  .user {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 11px 10px 11px;

    .icon-mine {
      font-size: $font-size-large-x;
    }
  }
}
</style>
