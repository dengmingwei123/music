<template>
  <transition
    name="add-list"
    appear
  >
    <div
      class="add-song"
      v-show="showFlag"
      @click.stop
    >
      <!-- 标题 -->
      <div class="add-title">
        <div class="icon"></div>
        <div class="text">添加歌曲到列表</div>
        <div
          class="icon"
          @click="hide"
        >
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <search-box
          ref="searchBox"
          @getSearchText="getSearchText"
        ></search-box>
      </div>

      <!-- 分类列表 -->
      <div
        class="shortcut"
        v-show="!searchText"
      >
        <!-- 分类按钮 -->
        <switches
          :switches="switches"
          @showPlayList="showPlayList"
          @showHistory="showHistory"
          :isShow="isShow"
        ></switches>
        <div class="add-list-wrapper">
          <scroll
            :data="playHistory"
            class="play-history-wrapper"
            ref="playHistoryWrapper"
            v-show="isShow"
          >
            <song-list
              :songs="playHistory"
              @getPlaySongs="getPlaySongs"
            ></song-list>
          </scroll>

          <scroll
            class="search-list-wrapper"
            ref="searchListWrapper"
            :data="searchHistory"
            v-show="!isShow"
          >
            <search-list
              :searchs="searchHistory"
              @selectHistory="selectHot"
              @deleteSearchHistory="deleteSearchHistory"
            ></search-list>
          </scroll>
        </div>
      </div>

      <!-- 搜索结果 -->
      <div
        class="search-result"
        ref="searchResult"
        v-show="searchText"
      >
        <suggest
          :searchText="searchText"
          :showSinger="showSinger"
          :isFull="false"
          ref="suggest"
          @select="saveSearch"
        ></suggest>
      </div>

      <!-- 提示组件 -->
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span>一首歌已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
// 引入搜索组件
import SearchBox from '@/base/search-box/Search-box'
// 引入搜索历史列表
import SearchList from '@/base/search-list/Search-list'
// 引入开关组件
import Switches from '@/base/switches/Switches'
// 引入搜索结果组件
import Suggest from '@/base/suggest/Suggest'
// 引入mixin
import { searchMixin, songMixin } from '@/common/js/mixin'
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll'
// 引入歌曲列表组件
import SongList from '@/base/song-list/Song-list'
// 引入提示框组件
import TopTip from '@/base/top-tip/Top-Tip'
export default {
  mixins: [searchMixin, songMixin],
  data() {
    return {
      showFlag: false,
      searchText: '',
      showSinger: false,
      isShow: true,
      isFull: false,
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ]
    }
  },
  methods: {
    // 显示添加列表
    show() {
      this.showFlag = true
      setTimeout(() => {
        if (this.isShow) {
          this.$refs.playHistoryWrapper.refresh()
        } else {
          this.$refs.searchListWrapper.refresh()
        }
      }, 20)
    },
    // 隐藏添加列表
    hide() {
      this.showFlag = false
    }
  },
  watch: {
    isShow(newVal) {
      setTimeout(() => {
        if (this.isShow) {
          this.$refs.playHistoryWrapper.refresh()
        } else {
          this.$refs.searchListWrapper.refresh()
        }
      }, 20)
    }
  },
  components: {
    SearchBox,
    SearchList,
    Switches,
    Suggest,
    Scroll,
    SongList,
    TopTip
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.add-list-enter-active, .add-list-leave-active {
  transition: all 0.4s;
}

.add-list-enter, .add-list-leave-to {
  transform: translate3d(100%, 0, 0);
}

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: $color-background;
  z-index: 200;

  .add-title {
    display: flex;
    height: 44px;

    .text {
      flex: 1;
      line-height: 44px;
      text-align: center;
      font-size: $font-size-large;
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

  .search-box-wrapper {
    padding: 20px;
  }

  .shortcut {
    .add-list-wrapper {
      position: absolute;
      top: 160px;
      bottom: 0;
      width: 100%;

      .search-list-wrapper {
        padding: 20px 30px 0 30px;
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .tip-title {
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: $font-size-medium;

    .icon-ok {
      color: $color-theme;
    }
  }
}
</style>
