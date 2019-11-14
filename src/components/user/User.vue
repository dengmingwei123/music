<template>
  <transition name='slide'>
    <div class='user'>
      <div class="user-header">
        <div
          class="icon"
          @click='$router.back()'
        >
          <i class='icon-back'></i>
        </div>
        <div class="title">用户中心</div>
        <div class="icon"></div>
      </div>

      <!-- 开关容器 -->
      <div class="switches-wrapper">
        <switches
          :switches='switches'
          :isShow='isShow'
          @showPlayList='showPlayList'
          @showHistory='showHistory'
        ></switches>
      </div>

      <!-- 随机播放按钮 -->
      <div
        class="play-btn"
        @click='randomPlay'
      >
        <i class='icon-play'></i>
        <span class='text'>随机播放全部</span>
      </div>

      <div
        class="user-list-wrapper"
        ref='userListWrapper'
      >
        <!-- 我喜欢的 -->
        <scroll
          :data='myLoveSongList'
          class='my-Love-wrapper'
          ref='myLoveSongWrapper'
          v-show='isShow'
        >
          <song-list
            :songs='myLoveSongList'
            @getPlaySongs='getPlaySongs'
          ></song-list>
        </scroll>

        <!-- 最近听的 -->
        <scroll
          :data='playHistory'
          class='play-history-wrapper'
          ref='playHistoryWrapper'
          v-show='!isShow'
        >
          <song-list
            :songs='playHistory'
            @getPlaySongs='getPlaySongs'
          ></song-list>
        </scroll>
      </div>
    </div>
  </transition>
</template>

<script>
// 引入开关组件
import Switches from '@/base/switches/Switches'
// 引入mixin
import { songMixin, playListMixin } from '@/common/js/mixin'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
// 引入歌曲组件
import SongList from '@/base/song-list/Song-list'
// 引入map语法
import { mapGetters, mapActions } from 'vuex'
// 引入song方法,创建歌曲对象
import Song from '@/common/js/song'
export default {
  mixins: [songMixin, playListMixin],
  data() {
    return {
      isShow: true,
      isFull: true,
      switches: [{
        name: '我喜欢的'
      }, {
        name: '最近听的'
      }]
    }
  },
  computed: {
    ...mapGetters(['myLoveSongList'])
  },
  watch: {
    isShow(newVal) {
      setTimeout(() => {
        if (this.isShow) {
          this.$refs.myLoveSongWrapper.refresh()
        } else {
          this.$refs.playHistoryWrapper.refresh()
        }
      }, 20)
    }
  },
  methods: {
    ...mapActions(['randomPlaySum']),
    handlerPlaylist(playList) {
      let bottom = playList.length > 0 ? '60px' : ''
      this.$refs.userListWrapper.style.bottom = bottom
      this.$refs.myLoveSongWrapper.refresh()
      this.$refs.playHistoryWrapper.refresh()
    },
    // 随机播放全部
    randomPlay() {
      let list = []
      if (this.isShow) {
        this.myLoveSongList.forEach(song => {
          list.push(new Song(song))
        })
        this.randomPlaySum({ list })
      } else {
        this.playHistory.forEach(song => {
          list.push(new Song(song))
        })
        this.randomPlaySum({ list })
      }
    }
  },
  components: {
    Switches,
    Scroll,
    SongList
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.slide-enter-active, .slide-leave-active {
  transition: all 0.4s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}

.user {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: $color-background;

  .user-header {
    display: flex;
    align-items: center;

    .title {
      flex: 1;
      text-align: center;
      font-size: $font-size-large;
      color: $color-text-l;
    }

    .icon {
      width: 44px;
      height: 44px;
      font-size: 20px;
      line-height: 44px;
      text-align: center;
      padding-right: 8px;
      color: $color-theme;
    }
  }

  .switches-wrapper {
    margin: 10px 0 30px 0;
  }

  .play-btn {
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-d;
    border-radius: 20px;
    color: $color-text-l;

    .icon-play {
      display: inline-block;
      vertical-align: hidden;
      font-size: $font-size-small;
    }

    .text {
      display: inline-block;
      vertical-align: hidden;
      font-size: $font-size-small;
    }
  }

  .user-list-wrapper {
    position: absolute;
    top: 168px;
    bottom: 0;
  }
}
</style>
