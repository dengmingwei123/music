<template>
  <div
    class="player"
    v-show="playlist.length>0"
  >
    <transition
      enter-active-class="animated fadeInUp"
      leave-active-class="animated fadeOutDown"
      appear
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
        <div class="middle">
          <!-- cd -->
          <div class="middle-l">
            <!-- 图 -->
            <div class="cd-wrapper">
              <div class="cd">
                <img
                  :src="currentSong.image"
                  class="image"
                >
              </div>
            </div>
            <!-- 歌词 -->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric"></div>
            </div>
          </div>
          <!-- 歌词 -->
          <scroll class="middle-r">
            <div class="lyric-wrapper">
              <div>
                <p class='text'></p>
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
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div class="progress-wrapper">
            <span class='item time-l'></span>
            <div class="progress-bar-wrapper"></div>
            <span class="time time-r"></span>
          </div>
          <!-- 状态按钮 -->
          <div class="operators">
            <!-- 播放状态 -->
            <div class="icon i-left">
              <i class='icon-sequence'></i>
            </div>
            <!-- 上一首 -->
            <div class="icon i-left">
              <i class="icon-prev"></i>
            </div>
            <!-- 开始播放-停止播放 -->
            <div class="icon i-center">
              <i class="icon-play"></i>
            </div>
            <!-- 下一首 -->
            <div class="icon i-right">
              <i class="icon-next"></i>
            </div>
            <!-- 加入收藏 -->
            <div class="icon i-right">
              <i class="icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition
      enter-active-class="animated fadeInUp"
      leave-active-class='animated fadeOutDown'
      appear
    >
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
          >
        </div>
        <div
          class="text"
          @click='magnify'
        >
          <p class="title">病态</p>
          <p class="name">薛之谦</p>
        </div>
        <div class="control">
          <i class="icon-play"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
// 引入vuex的map语法
import { mapGetters, mapMutations } from 'vuex'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
export default {
  computed: {
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong'
    ])
  },
  methods: {
    ...mapMutations({
      isFullScreen: 'SET_FULL_SCREEN'
    }),
    // 缩小播放器
    shrink() {
      this.isFullScreen(false)
    },
    // 全屏显示播放器
    magnify() {
      this.isFullScreen(true)
    }
  },
  watch: {
    currentSong(newVal) {
      console.log(newVal)
    }
  },
  components: {
    Scroll
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
          top: 5%;
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
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
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
        }
      }

      // 播放进度条
      .progress-wrapper {
        width: 100%;
        height: 50px;
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
    }
  }
}
</style>
