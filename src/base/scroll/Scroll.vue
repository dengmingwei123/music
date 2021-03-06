<template>
  <cube-scroll
    ref="scroll"
    :options="options"
    :scrollEvents="scrollEvents"
    class="scroll-list-wrap"
    @pulling-up="onPullingUp"
    @pulling-down="onPullingDown"
    @scroll="scroll"
  >
    <slot></slot>
  </cube-scroll>
</template>

<script>
export default {
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    scrollEvents: {
      type: Array,
      default() {
        return []
      }
    },
    isOnPullingUp: {
      type: Boolean,
      default: false
    },
    isOnPullingDown: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: {
        observeDOM: true,
        click: this.click,
        probeType: this.probeType,
        scrollbar: false,
        pullUpLoad: this.isOnPullingUp,
        pullDownRefresh: this.isOnPullingDown
      }
    }
  },
  methods: {
    // 重新计算高度
    refresh() {
      this.$refs.scroll && this.$refs.scroll.refresh()
    },
    // 获取实时坐标
    scroll(pos) {
      // 判断是否要实时获取滚动的坐标
      if (this.listenScroll) {
        this.$emit('getScroll', pos)
      }
    },
    // 滚动到指定的元素
    scrollToElement(element, time) {
      this.$refs.scroll && this.$refs.scroll.scrollToElement(element, time)
    },
    // 滚动到指定的区域
    scrollTo(x, y, time) {
      this.$refs.scroll && this.$refs.scroll.scrollTo(x, y, time)
    },
    // 上拉加载
    onPullingUp() {
      // 出发父组件的方法
      this.$emit('onPullingUp')
    },
    // 下拉刷新
    onPullingDown() {
      this.$emit('onPullingDown')
    },
    // 结束下拉刷新,上拉加载
    forceUpdate() {
      this.$refs.scroll && this.$refs.scroll.forceUpdate()
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh()
      }, this.$refs.scroll.refreshDelay)
    }
  }
}
</script>

<style lang="stylus">
.scroll-list-wrap {
}
</style>
