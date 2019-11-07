<template>
  <div
    class="player"
    v-show="playlist.length>0"
  >
    <transition
      name='normal'
      @enter='enter'
      @after-enter='afterEnter'
      @leave='leaveEnter'
      @after-leave='afterLeave'
    >
      <!-- 全屏显示播放器 -->
      <div
        class="normal-player"
        v-show="fullScreen"
      >
        <!-- 背景 -->
        <div class="background">
          <img
            class="background-pic"
            :src="currentSong.image"
          >
        </div>
        <!-- 顶部 -->
        <div class="top">
          <!-- 缩小按钮 -->
          <div
            class="back"
            @click="shrink"
          >
            <i class="icon-back"></i>
          </div>
          <!-- 标题 -->
          <h1 class="title">{{ currentSong.name }}</h1>
          <h2 class="singer">{{ currentSong.singer }}</h2>
        </div>
        <!-- 中间 -->
        <div
          class="middle"
          ref='middle'
          @touchstart='middleTouchStart'
          @touchmove='middleTouchMove'
          @touchend='middleTouchEnd'
        >
          <!-- cd -->
          <div
            class="middle-l"
            ref='middleL'
          >
            <!-- 图 -->
            <div
              class="cd-wrapper"
              ref="cdWrapper"
            >
              <div class="cd">
                <img
                  :src="currentSong.image"
                  class="image"
                  :class="isplay"
                >
              </div>
            </div>
            <!-- 歌词 -->
            <div
              class="playing-lyric-wrapper"
              v-if="currentLyric"
            >
              <div class="playing-lyric">{{currentLyricTxt}}</div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll
            class="middle-r"
            ref="lyricList"
            :data='currentLyric && currentLyric.lines'
          >
            <div class="lyric-wrapper">
              <div v-if='currentLyric'>
                <p
                  class='text'
                  ref="lyricLine"
                  v-for="(line,index) in currentLyric.lines"
                  :key="index"
                  :class="{'current':index === currentLineNum}"
                >{{ line.txt }}</p>
              </div>
              <div class="pure-music">
                <p></p>
              </div>
            </div>
          </scroll>
        </div>
        <!-- 底部 -->
        <div class="bottom">
          <div class="dot-wrapper">
            <span
              class="dot"
              :class="{'active':currentDot==='cd'}"
            ></span>
            <span
              class="dot"
              :class="{'active':currentDot==='lyric'}"
            ></span>
          </div>
          <div class="progress-wrapper">
            <span class='time time-l'>{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :percent='percent'
                @getProgressBarChange="getProgressBarChange"
              ></progress-bar>
            </div>
            <span class="time time-r">{{ formatTime(currentSong.duration) }}</span>
          </div>
          <!-- 状态按钮 -->
          <div class="operators">
            <!-- 播放状态 -->
            <div
              class="icon i-left"
              @click="changeMode"
            >
              <i :class='iconMode'></i>
            </div>
            <!-- 上一首 -->
            <div
              class="icon i-left"
              :class="disableCls"
            >
              <i
                class="icon-prev"
                @click="prevSong"
              ></i>
            </div>
            <!-- 开始播放-停止播放 -->
            <div
              class="icon i-center"
              :class="disableCls"
            >
              <i
                :class="playIcon"
                ref="playBtn"
                @click="player"
              ></i>
            </div>
            <!-- 下一首 -->
            <div
              class="icon i-right"
              :class="disableCls"
            >
              <i
                class="icon-next"
                @click="nextSong"
              ></i>
            </div>
            <!-- 加入收藏 -->
            <div class="icon i-right">
              <i
                class="icon-not-favorite"
                @click="collectList"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name='mini'>
      <!-- 缩小的播放器 -->
      <div
        class="mini-player"
        v-show="!fullScreen"
      >
        <div
          class="icon"
          @click="magnify"
        >
          <img
            :src="currentSong.image"
            class="mini-image"
            :class="isplay"
          >
        </div>
        <div
          class="text"
          @click='magnify'
        >
          <p class="title">{{ currentSong.name }}</p>
          <p class="name">{{ currentSong.singer }}</p>
        </div>
        <div class="control">
          <progress-circle
            :radius="30"
            :percent='percent'
          >
            <i
              :class="miniIcon"
              @click="player"
              class="mini-playBtn"
            ></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="playFlag"
      @error='error'
      @timeupdate='timeUpdate'
      @ended="playEnd"
    ></audio>
  </div>
</template>

<script>
// 引入vuex的map语法
import { mapGetters, mapMutations } from 'vuex'
// 引入动画组件
import animations from 'create-keyframe-animation'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
// 引入进度条组件
import ProgressBar from '@/base/progress-bar/Progress-bar'
// 引入圆形进度条组件
import ProgressCircle from '@/base/progress-circle/Progress-circle'
// 引入模式的配置文件
import { playMode } from '@/common/js/config'
// 引入打乱数组的函数
import { shuffle } from '@/common/js/util'
// 引入处理兼容函数
import { prefixStyle } from '@/common/js/dom'
// 引入处理歌词的方法
import Lyric from 'lyric-parser'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data() {
    return {
      playSongFlag: false,
      currentTime: 0,
      collect: false,
      currentLyric: null,
      currentLineNum: 0,
      currentDot: 'cd',
      touch: {}
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList'
    ]),
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    miniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    isplay() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.playSongFlag ? '' : 'disable'
    },
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    currentLyricTxt() {
      return this.currentLyric.lines[this.currentLineNum].txt
    }
  },
  methods: {
    ...mapMutations({
      isFullScreen: 'SET_FULL_SCREEN',
      setPlayIng: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setCurrentPlayIndex: 'SET_CURRENTPLAY_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setSequenceList: 'SET_SEQUENCE_LIST',
      setPlayList: 'SET_PLAYLIST'
    }),
    // 进入页面起使动画
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale()

      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1,1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }

      // 创建动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      // 开启动画
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    // 结束动画
    afterEnter(el, done) {
      // 结束动画
      animations.unregisterAnimation('move')
      // 清除动画
      this.$refs.cdWrapper.style.animation = ''
    },
    // 离开页面动画
    leaveEnter(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const { x, y, scale } = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      const timer = setTimeout(done, 400)
      this.$refs.cdWrapper.addEventListener('transitionend', () => {
        clearTimeout(timer)
        done()
      })
    },
    // 结束动画
    afterLeave(el, done) {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    // 获取大cd到小cd的距离和缩放
    _getPosAndScale() {
      // 目标宽
      const targetWidth = 40
      // 目标左边偏移距离
      const paddingLeft = 40
      // 目标底部偏移距离
      const paddingBottom = 30
      // 起使高度
      const paddingTop = 80
      // 起使宽度
      const width = window.innerWidth * 0.8
      // 缩放进度
      const scale = targetWidth / width
      // 目标x轴
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 目标y轴
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x, y, scale
      }
    },
    // 缩小播放器
    shrink() {
      this.isFullScreen(false)
    },
    // 全屏显示播放器
    magnify() {
      this.isFullScreen(true)
    },
    // 加入收藏列表
    collectList() {
      let arr = []
      // 判断是否创建了收藏数组
      if (localStorage.getItem('collectList')) {
        let jsonString = localStorage.getItem('collectList')
        arr = JSON.parse(jsonString)
        // 判断是否在收藏列表中
        if (arr.find(v => v.id === this.currentSong.id)) {
          // 清除当前这个
          arr = arr.filter(v => {
            return v.id !== this.currentSong.id
          })
          this.collect = false
        } else {
          arr.push(this.currentSong)
          this.collect = true
        }
      } else {
        arr.push(this.currentSong)
        this.collect = true
      }
      localStorage.setItem('collectList', JSON.stringify(arr))
    },
    // 播放音乐
    player() {
      this.playing ? this.setPlayIng(false) : this.setPlayIng(true)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 播放结束
    playEnd() {
      // 是否单曲循环
      if (this.mode === playMode.loop) {
        this.loop()
      } else {
        this.nextSong()
      }
    },
    // 单曲循环
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // 播放下一首
    nextSong() {
      if (!this.playSongFlag) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      if (index < this.playlist.length - 1) {
        index = this.currentIndex + 1
      } else {
        index = 0
      }
      this.setCurrentIndex(index)
      this.playSongFlag = false
    },
    // 播放上一首
    prevSong() {
      if (!this.playSongFlag) {
        return
      }
      if (this.playlist.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      if (index <= 0) {
        index = this.playlist.length - 1
      } else {
        index = this.currentIndex - 1
      }
      this.setCurrentIndex(index)
      this.playSongFlag = false
    },
    // 控制上一首下一首的节流阀
    playFlag() {
      this.playSongFlag = true
    },
    // 歌曲加载失败
    error() {
      this.playSongFlag = true
    },
    // 获取当前播放进度
    timeUpdate(e) {
      this.currentTime = e.target.currentTime
    },
    // 改变时间格式
    formatTime(time) {
      time = Math.floor(time)
      let minute = Math.floor(time / 60)
      let second = Math.floor(time % 60)
      second = second >= 10 ? second : `0${second}`
      return `${minute}:${second}`
    },
    // 获取改变后的进度
    getProgressBarChange(percent) {
      // 当前播放时间
      let currentTime = percent * this.currentSong.duration
      // 设置播放时间
      this.$refs.audio.currentTime = currentTime
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000)
      }
      // 判断下,如果是暂停状态,那么就开始播放
      if (!this.playing) {
        this.setPlayIng(true)
      }
    },
    // 改变播放状态
    changeMode() {
      let mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      // 是否随机播放
      if (this.mode === playMode.random) {
        // 打乱列表
        list = shuffle(this.sequenceList)
      } else {
        // 单曲和顺序播放
        list = this.sequenceList
      }
      this.currentSongIndex(list)
      this.setPlayList(list)
    },
    // 找到当前播放歌曲的索引
    currentSongIndex(list) {
      let index = list.findIndex(v => {
        return this.currentSong === v
      })
      this.setCurrentIndex(index)
    },
    // 获取歌词
    async _getLyric() {
      let lyric = await this.currentSong.getLyric()
      try {
        this.currentLyric = new Lyric(lyric, this.handlerLyric)
        if (this.playing) {
          this.currentLyric.play()
        }
      } catch (err) {
        this.currentLyric = null
        this.currentLineNum = 0
      }
    },
    handlerLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum
      // 如果滚动到第八行
      if (lineNum > 8) {
        // 滚动到第八行的时候,就需要网上滚动
        let lyricEl = this.$refs.lyricLine[lineNum - 8]
        this.$refs.lyricList.scrollToElement(lyricEl, 1000)
      } else {
        // 否则,滚动到最顶部
        this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
    },
    // 手指触屏开始
    middleTouchStart(e) {
      let time = 0
      // 是否触屏开始
      this.touch.touchStart = true
      // 保存开始X轴坐标
      this.touch.startX = e.touches[0].pageX
      // 保存开始Y轴坐标
      this.touch.startY = e.touches[0].pageY
      // 删除动画效果
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
    },
    // 手指触屏移动时
    middleTouchMove(e) {
      let touch = e.touches[0]
      let left
      let offsetWidth
      // 获取移动时和开始的坐标差值
      this.touch.diffX = touch.pageX - this.touch.startX
      this.touch.diffY = touch.pageY - this.touch.startY
      // 如果是上下滚动,则不用进行下面的操作
      if (Math.abs(this.touch.diffY) > Math.abs(this.touch.diffX)) {
        return
      }
      left = this.currentDot === 'cd' ? 0 : -window.innerWidth
      offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + this.touch.diffX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
    },
    // 手指离开屏幕
    middleTouchEnd(e) {
      if (Math.abs(this.touch.diffY) > Math.abs(this.touch.diffX)) {
        return
      }
      let offsetWidth
      let percent
      let time = 300
      // 判断当前是否是在cd页面
      if (this.currentDot === 'cd') {
        // 判断拖动距离是否超过百分之30
        if (this.touch.percent > 0.2) {
          offsetWidth = -window.innerWidth
          percent = 0
          this.currentDot = 'lyric'
        } else {
          offsetWidth = 0
        }
      } else {
        // 如果是在歌词页
        if (1 - this.touch.percent > 0.2) {
          offsetWidth = 0
          percent = 1
          this.currentDot = 'cd'
        } else {
          offsetWidth = -window.innerWidth
        }
      }
      // 添加动画效果
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = percent
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
    }
  },
  watch: {
    currentSong(newVal, oldVal) {
      if (newVal.id === oldVal.id) {
        return
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      setTimeout(() => {
        this.setPlayIng(true)
        this.$refs.audio.play()
        this._getLyric()
      }, 1000)
    },
    playing(newPlaying) {
      this.$nextTick(() => {
        // 获取播放器
        let audio = this.$refs.audio
        newPlaying ? audio.play() : audio.pause()
      })
    }
  },
  components: {
    Scroll,
    ProgressBar,
    ProgressCircle
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.player {
  .normal-player {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 150;
    background-color: $color-background;

    // 背景图片
    .background {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      .background-pic {
        width: 100%;
        height: 100%;
      }
    }

    // 顶部
    .top {
      position: relative;
      width: 100%;
      height: 60px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        padding: 9px;
        transform: rotate(-90deg);

        .icon-back {
          color: $color-theme;
          font-size: $font-size-large-x;
        }
      }

      // 标题
      .title {
        left: 15%;
        width: 70%;
        margin: 0 auto;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-size: $font-size-large;
        no-wrap();
      }

      // 歌手名
      .singer {
        line-height: 20px;
        font-size: $font-size-medium;
        text-align: center;
      }
    }

    // 中间
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;

      // cd
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        // cd图
        // 11111111111111111111111111111111111111111111111111111111
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          box-sizing: border-box;

          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);

              &.play {
                animation: rotate 20s linear infinite;
              }

              &.pause {
                animation-play-state: paused;
              }
            }
          }
        }

        // 11111111111111111111111111111111111111111111111111111111
        .playing-lyric-wrapper {
          width: 80%;
          margin: 50px auto 0 auto;
          text-align: center;
          overflow: hidden;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      // 歌词
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            font-size: $font-size-medium;
            color: $color-text-l;

            &.current {
              color: $color-text;
            }
          }

          .pure-music {
            // padding-top: 50%;
            // line-height: 32px;
            // color: $color-text-l;
            // font-size: $font-size-medium;
          }
        }
      }
    }

    // 底部
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      // 小圆点
      .dot-wrapper {
        width: 100%;
        text-align: center;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background-color: $color-text-ll;
          }
        }
      }

      // 播放进度条
      .progress-wrapper {
        width: 80%;
        margin: 0 auto;
        padding: 10px 0;
        display: flex;

        .time {
          width: 30px;
          height: 30px;
          line-height: 30px;
          font-size: $font-size-small;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      // 播放状态栏
      .operators {
        display: flex;
        height: 50px;

        .icon {
          flex: 1;
          height: 50px;
          font-size: 30px;
          line-height: 50px;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-right {
          text-align: left;
        }

        .i-center {
          font-size: 40px;
          text-align: center;
          padding: 0 20px;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 60px;
    z-index: 180;
    display: flex;
    align-items: center;
    background-color: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      padding: 0 10px 0 20px;
      border-radius: 50%;

      .mini-image {
        width: 100%;
        height: 100%;
        border-radius: 50%;

        &.play {
          animation: rotate 20s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      no-wrap();

      .title {
        margin-bottom: 6px;
        font-size: $font-size-medium;
      }

      .name {
        font-size: $font-size-small;
        color: $color-text-l;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      font-size: 30px;
      color: $color-theme-d;

      .mini-playBtn {
        position: absolute;
        top: 0;
        left: 0;
      }
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
