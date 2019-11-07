<template>
  <transition
    name="slide"
    appear
  >
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
    ></music-list>
  </transition>
</template>

<script>
// 引入map语法
import { mapGetters } from 'vuex'
// 引入音乐列表组件
import MusicList from '@/components/music-list/Music-list.vue'
// 引入发送请求的方法
import { getRecommendDisc } from '@/api/recommend'
// 引入config
import { ERR_OK } from '@/api/config'
// 引入格式化数据的方法
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
export default {
  data() {
    return {
      filterSongs: [],
      songs: []
    }
  },
  computed: {
    ...mapGetters(['recommend']),
    title() {
      return this.recommend.dissname
    },
    bgImage() {
      return this.recommend.imgurl
    }
  },
  created() {
    this._getRecommendDisc()
  },
  methods: {
    // 获取推荐列表数据
    async _getRecommendDisc() {
      if (!this.recommend.dissid) {
        this.$router.push('/recommend')
        return
      }
      let res = await getRecommendDisc(this.recommend.dissid)
      let { code, cdlist } = res
      if (code === ERR_OK) {
        let songList = cdlist[0].songlist
        let songs = await processSongsUrl(this._normalRecommendDisc(songList))
        this.filterSongs = songs
      }
    },
    // 格式化数据
    _normalRecommendDisc(list) {
      let ret = []
      list.forEach(v => {
        if (isValidMusic(v)) {
          ret.push(createSong(v))
        }
      })
      return ret
    }
  },
  watch: {
    filterSongs(songs) {
      let arr = []
      for (let i = 0; i < songs.length - 1; i++) {
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
@import '~@/common/stylus/variable.styl';

.slide-enter-active, .slide-leave-active {
  transition: all 0.4s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
