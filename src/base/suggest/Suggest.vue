<template>
  <scroll
    class="suggest"
    ref='suggest'
    :data="songs"
    :isOnPullingUp='isOnPullingUp'
    @onPullingUp='onPullingUp'
  >
    <ul class='suggest-list'>
      <li
        class="suggest-item"
        v-for="song in songs"
        :key="song.id"
        @click="selectItem(song)"
      >
        <div class="icon">
          <i :class='getIconCls(song)'></i>
        </div>
        <div class="name">
          <p class='text'>{{ getText(song) }}</p>
        </div>
      </li>
    </ul>
    <loading v-show="!songs.length>0"></loading>
  </scroll>
</template>

<script>
// 引入滚动组件
import Scroll from '@/base/scroll/Scroll.vue'
// 引入获取数据的方法
import { getSearchResult } from '@/api/search'
// 处理数据的方法
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
import { ERR_OK } from '@/api/config'
// 引入loading组件
import Loading from '@/base/loading/Loading.vue'
// 引入更改歌手格式的方法
import Singer from '@/common/js/singer'
// 引入vuex的map语法
import { mapMutations, mapActions } from 'vuex'
// 引入no-result组件
import NoResult from '@/base/no-result/No-result.vue'

const TYPE_SINGER = 'singer'
export default {
  data() {
    return {
      isOnPullingUp: true,
      page: 1,
      perpage: 20,
      songs: []
    }
  },
  methods: {
    // 获取搜索的数据
    async _getSearchResult() {
      // 每次请求的时候,需要重置page
      this.page = 1
      // 需要滚动到顶部
      this.$refs.suggest.scrollTo(0, 0)
      let res = await getSearchResult(this.searchText, this.page, this.showSinger, this.perpage)
      let { code, data } = res
      if (code === ERR_OK) {
        this.songs = await this._genResult(data)
      }
    },
    // 上拉加载
    async onPullingUp() {
      this.page++
      let res = await getSearchResult(this.searchText, this.page, this.showSinger, this.perpage)
      let { code, data } = res
      if (code === ERR_OK) {
        let songs = await this._genResult(data)
        // 是否有获取到数据
        if (songs.length > 0) {
          // 合并数据
          this.songs = this.songs.concat(songs)
          // 结束加载
          this.$refs.suggest.forceUpdate()
        } else {
          // 结束加载
          this.$refs.suggest.forceUpdate()
        }
      }
    },
    async _genResult(data) {
      let ret = []
      // 查询的是否是歌手
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
      }
      let res = await processSongsUrl(this._normalSearchSong(data.song.list))
      // 清除不能播放的音乐
      let arr = []
      res.forEach(song => {
        if (song.url) {
          arr.push(song)
        }
      })
      ret = ret.concat(arr)
      return ret
    },
    // 格式化处理获取的数据
    _normalSearchSong(data) {
      let ret = []
      data.forEach(song => {
        if (isValidMusic(song)) {
          ret.push(createSong(song))
        }
      })
      return ret
    },
    // 获取IconCls的名字
    getIconCls(song) {
      if (song.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    // 获取搜索显示内容
    getText(song) {
      if (song.type === TYPE_SINGER) {
        return song.singername
      } else {
        return `${song.name}-${song.singer}`
      }
    },
    // 选中的项
    selectItem(song) {
      // 判断点击的是否是歌手
      if (song.type === TYPE_SINGER) {
        // 更改格式
        let singer = new Singer(song.singermid, song.singername)
        this.setSinger(singer)
        this.$router.push(`/search/${singer.id}`)
      } else {
        // 如果是歌曲的话,添加到当前播放列表
        this.insertSong({ song, isFull: this.isFull })
      }
      // 派发事件数据
      this.$emit('select')
    },
    // 重新获取容器高度
    refresh() {
      this.$refs.suggest.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertSong'])
  },
  props: {
    searchText: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    isFull: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    searchText(searchText) {
      this._getSearchResult()
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/common/stylus/variable.styl';

.suggest {
  position: relative;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      padding-bottom: 20px;
      color: $color-text-d;

      .icon {
        width: 30px;
        align-items: center;

        .icon-music {
          font-size: $font-size-medium;
        }
      }

      .name {
        .text {
          font-size: $font-size-medium;
        }
      }
    }
  }

  .message {
    text-align: center;
    color: $color-text-d;
    font-size: $font-size-medium;
  }

  .no-result-wrapper {
    position: absolute;
    top: 168px;
    width: 100%;
  }
}
</style>
