<template>
  <div
    class="music-list"
    ref="musicList"
  >
    <!-- 背景 -->
    <div
      class="music-back"
      @click="$router.back()"
    >
      <i class='icon-back'></i>
    </div>
    <div
      class="title"
      ref="title"
    >{{ title }}</div>
    <div
      class="bg-image"
      :style="bgStyle"
      ref="bgImage"
    >
      <!-- 随机播放按钮 -->
      <div
        class="play-wrapper"
        ref="playWrapper"
        v-show="songs.length>0"
      >
        <div
          class="play"
          @click="randomPlay"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 背景蒙层 -->
      <div
        class="filter"
        ref="filter"
      ></div>
    </div>
    <!-- 蒙层 -->
    <div
      class="bg-layer"
      ref='bgLayer'
    ></div>
    <!-- 歌曲列表 -->
    <scroll
      :data="songs"
      class="scroll"
      ref='scroll'
      :probeType="probeType"
      :listenScroll="listenScroll"
      :scrollEvents="scrollEvents"
      @getScroll="scroll"
    >
      <song-list
        :songs="
      songs"
        @getPlaySongs='playSong'
      >
      </song-list>

      <!-- 加载 -->
      <loading v-if="!songs.length"></loading>
    </scroll>
  </div>
</template>

<script>
// 引入歌曲列表组件
import SongList from '@/base/song-list/Song-list.vue'
// 引入滚动列表组件
import Scroll from '@/base/scroll/Scroll.vue'
// 引入加载组件
import Loading from '@/base/loading/Loading.vue'
// 引入dom方法
import { prefixStyle } from '@/common/js/dom'
// 引入map方法
import { mapActions } from 'vuex'
// 引入mixin方法
import { playListMixin } from '@/common/js/mixin'
const transform = prefixStyle('transform')
const backdrop = prefixStyle('backdrop-filter')
// console.log(backdorp)
export default {
  mixins: [playListMixin],
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      scrollEvents: ['scroll'],
      scrollY: 0
    }
  },
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted() {
    this._setListTop()
  },
  methods: {
    handlerPlaylist(playlist) {
      let bottom = playlist.length > 0 ? 60 : 0
      let height = this.$refs.musicList.clientHeight - this.bgImageHeight - bottom
      this.$refs.scroll.$el.style.height = height + 'px'
      this.$refs.scroll.refresh()
    },
    // 随机播放全部
    randomPlay() {
      this.randomPlaySum({ list: this.songs })
    },
    // 设置列表的top值,设置列表可视区域的高度
    _setListTop() {
      if (this.$refs.scroll && this.$refs.bgImage && this.$refs.musicList) {
        // 背景图片的高
        this.bgImageHeight = this.$refs.bgImage.clientHeight
        // 获取整个容器的高
        let height = this.$refs.musicList.clientHeight - this.bgImageHeight
        // 设置音乐列表的可视区域高度
        this.$refs.scroll.$el.style.height = height + 'px'
        // 设置音乐列表的top值
        this.$refs.scroll.$el.style.top = this.bgImageHeight + 'px'
        this.maxScroll = -this.bgImageHeight + this.$refs.title.clientHeight
      }
    },
    // 实时获取滚动的距离
    scroll(pos) {
      this.scrollY = pos.y
    },
    // 获取播放的音乐
    playSong(song, index) {
      this.selectPlay({ list: this.songs, index })
    },
    ...mapActions([
      'selectPlay',
      'randomPlaySum'
    ])
  },
  watch: {
    scrollY(newValue) {
      let transLateY = Math.max(this.maxScroll, newValue)
      let zIndex = 0
      let scale = 1
      let blur = 0
      // 倍率
      let parcent = Math.abs(newValue / this.bgImageHeight)
      // 判断是否滚动到顶部
      if (this.maxScroll >= newValue) {
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height = this.$refs.title.clientHeight + 'px'
        this.$refs.playWrapper.style.display = 'none'
      } else {
        zIndex = 0
        this.$refs.bgImage.style.paddingTop = '70%'
        this.$refs.bgImage.style.height = 0
        this.$refs.playWrapper.style.display = 'block'
      }

      // 判断是否往下拉
      if (newValue > 0) {
        zIndex = 10
        scale += parcent
      } else {
        blur = Math.min(20 * parcent, 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`

      this.$refs.bgLayer.style[transform] = `translate3d(0,${transLateY}px,0)`
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';
@import '~@/common/stylus/mixin.styl';

.music-list {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: $color-background;

  .music-back {
    position: absolute;
    left: 6px;
    top: 0;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      color: $color-theme;
      font-size: $font-size-large-x;
    }
  }

  .title {
    position: absolute;
    width: 80%;
    left: 10%;
    text-align: center;
    font-size: $font-size-large;
    line-height: 40px;
    z-index: 40;
    no-wrap();
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    // 播放按钮
    .play-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 10;

      .play {
        width: 26%;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        padding: 8px 0px;
        border-radius: 20px;

        .icon-play {
          vertical-align: middle;
          font-size: $font-size-medium;
        }

        .text {
          vertical-align: middle;
          font-size: $font-size-medium;
          no-warp();
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  // 蒙层
  .bg-layer {
    position: relative;
    height: 100%;
    background-color: $color-background;
  }

  .scroll {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow: visible;
    background-color: $color-background;
  }
}
</style>
