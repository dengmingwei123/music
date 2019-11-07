<template>
  <div class='rank-detail'>
    <music-list
      :title="title"
      :bgImage='bgImage'
      :songs="songs"
    ></music-list>
  </div>
</template>

<script>
import { getMusicList } from '@/api/rank'
import { ERR_OK } from '@/api/config'
// 引入音乐列表组件
import MusicList from '@/components/music-list/Music-list.vue'
// 引入map语法
import { mapGetters } from 'vuex'
// 引入格式化数据方法
import { createSong, isValidMusic, processSongsUrl } from '@/common/js/song'
export default {
  data() {
    return {
      filterSongs: [],
      songs: []
    }
  },
  computed: {
    ...mapGetters(['rank']),
    bgImage() {
      return this.rank.picUrl
    },
    title() {
      return this.rank.topTitle
    }
  },
  created() {
    this._getMusicList()
  },
  methods: {
    // 获取排行音乐列表
    async _getMusicList() {
      if (!this.rank.id) {
        this.$router.push('/rank')
        return
      }
      let res = await getMusicList(this.rank.id)
      let { code, songlist } = res
      if (code === ERR_OK) {
        let songs = await processSongsUrl(this._normalMusicList(songlist))
        this.filterSongs = songs
      }
    },
    // 格式化数据
    _normalMusicList(list) {
      let ret = []
      list.forEach(song => {
        if (isValidMusic(song.data)) {
          ret.push(createSong(song.data))
        }
      })
      return ret
    }
  },
  watch: {
    // 处理不能播放的音乐
    filterSongs(songs) {
      // 创建一个新数组存储
      let arr = []
      for (let i = 0; i < songs.length - 1; i++) {
        if (songs[i].url) {
          arr.push(songs[i])
        }
      }
      this.songs = songs
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
.rank-detail {
}
</style>
