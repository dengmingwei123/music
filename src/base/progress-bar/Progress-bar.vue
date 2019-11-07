<template>
  <div
    class="progress-bar"
    ref='progressBar'
    @click="progressClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref='progress'
      ></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent='progressTouchMove'
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入处理兼容函数
import { prefixStyle } from '@/common/js/dom'
// 小球的宽度
const progressBtnWidth = 16
// 处理transform
const transform = prefixStyle('transform')
export default {
  data() {
    return {
      touch: {}
    }
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 点击进度条,改变进度
    progressClick(e) {
      // 获取当前点击的元素的offsetX的值
      this.touch.moveX = e.offsetX
      this.playProgress()
    },
    // 手指触屏开始
    progressTouchStart(e) {
      // 是否触屏
      this.touch.isTouch = true
      // 获取手指触屏的时候的X轴距离
      this.touch.startX = e.touches[0].clientX
      // 获取当前的进度
      this.touch.left = this.$refs.progress.clientWidth
    },
    // 手指触屏移动时
    progressTouchMove(e) {
      if (!this.touch.isTouch) {
        return
      }
      // 获取手指移动的时候的X轴距离
      this.touch.moveX = e.touches[0].pageX
      // 获取差
      let diff = this.touch.moveX - this.touch.startX
      // 最大和最小移动距离
      let moveX = this.touch.left + diff
      // 最大最小移动距离
      this.touch.moveX = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, moveX))
      this.progressBar(this.touch.moveX)
    },
    // 手指抬起时
    progressTouchEnd(e) {
      this.touch.isTouch = false
      if (this.touch.moveX) {
        this.playProgress()
      }
    },
    // 改变播放时间
    playProgress() {
      let percent = this.touch.moveX / (this.$refs.progressBar.clientWidth - progressBtnWidth)
      this.$emit('getProgressBarChange', percent)
    },
    // 进度条移动
    progressBar(moveX) {
      // 设置进度条宽
      this.$refs.progress.style.width = moveX + 'px'
      // 设置小球位移距离
      this.$refs.progressBtn.style[transform] = `translate3d(${moveX}px,0,0)`
    }
  },
  watch: {
    percent(newValue) {
      // 判断是否在触屏
      if (newValue >= 0 && !this.touch.isTouch) {
        // 获取整个进度条的宽
        let barWidth = this.$refs.progressBar.clientWidth
        // 最大移动的距离
        let maxMoveX = barWidth - progressBtnWidth
        // 移动的距离
        let moveX = maxMoveX * newValue
        this.progressBar(moveX)
      }
    }
  }
}
</script>

<style lang="stylus">
@import '~@/common/stylus/variable.styl';

.progress-bar {
  position: relative;
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;

  .bar-inner {
    width: 100%;
    height: 4px;
    background-color: $color-background-d;

    .progress {
      width: 0;
      height: 4px;
      background-color: $color-theme;
    }

    .progress-btn-wrapper {
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      top: 0;
      width: 30px;
      height: 30px;

      .progress-btn {
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid #fff;
        border-radius: 50%;
        background-color: $color-theme;
      }
    }
  }
}
</style>
