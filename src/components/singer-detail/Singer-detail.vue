<template>
  <transition
    name='slide'
    appear
  >
    <music-list
      :songs="songs"
      :title="title"
      :bgImage="bgImage"
    ></music-list>
  </transition>
</template>

<script>
import { getSingerDetail } from '@/api/singer'
import { ERR_OK } from '@/api/config'
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
// 引入音乐列表组件
import MusicList from '@/components/music-list/Music-list.vue'
// 引入vuex的map语法
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      filterSongs: [],
      songs: []
    }
  },
  computed: {
    ...mapGetters([
      'singer'
    ]),
    title() {
      return this.singer.name
    },
    bgImage() {
      return this.singer.picUrl
    }
  },
  created() {
    this._getSingerDetail()
  },
  methods: {
    // 获取当前歌手的数据
    async _getSingerDetail() {
      // 如果在当前页面刷新时,回退到之前页面
      if (!this.singer.id) {
        this.$router.back()
        return
      }
      let res = await getSingerDetail(this.singer.id)
      let { code, data: { list } } = res
      if (code === ERR_OK) {
        this.filterSongs = await processSongsUrl(this._normalSingerDetail(list))
      }
    },
    // 格式化数据
    _normalSingerDetail(list) {
      let ret = []
      list.forEach(v => {
        if (isValidMusic(v.musicData)) {
          ret.push(createSong(v.musicData))
        }
      })
      return ret
    }
  },
  watch: {
    // 处理不能播放的音乐
    filterSongs(songs) {
      // 创建新数组
      let arr = []
      for (let i = 0; i < songs.length; i++) {
        if (songs[i].url) {
          arr.push(songs[i])
        }
      }
      this.songs = arr
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
