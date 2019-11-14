<template>
  <div
    class='switches'
    v-if="switches.length>0"
  >
    <div class='play-btn'>
      <span
        class='text'
        @click='showPlayList'
        :class='{current:isShow}'
      >{{ switches[0].name }}</span>
    </div>
    <div class='history-btn'>
      <span
        class='text'
        @click='showHistory'
        :class='{current:!isShow}'
      >{{ switches[1].name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    switches: {
      type: Array,
      default() {
        return []
      }
    },
    isShow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    showPlayList() {
      this.$emit('showPlayList')
    },
    showHistory() {
      this.$emit('showHistory')
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable.styl';

.switches {
  display: flex;
  height: 30px;
  font-size: $font-size-medium;
  color: $color-text-d;

  .play-btn {
    height: 30px;
    flex: 1;
    text-align: right;

    .text {
      line-height: 30px;
      padding: 8px 32px;
      border: 1px solid $color-highlight-background;
      border-right: none;
      border-radius: 5px 0 0 5px;

      &.current {
        background-color: $color-highlight-background;
        color: #fff;
      }
    }
  }

  .history-btn {
    height: 30px;
    flex: 1;
    text-align: left;

    .text {
      line-height: 30px;
      padding: 8px 32px;
      border: 1px solid $color-highlight-background;
      border-radius: 0 5px 5px 0;

      &.current {
        background-color: $color-highlight-background;
        color: #fff;
      }
    }
  }
}
</style>
