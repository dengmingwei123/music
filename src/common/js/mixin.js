import { mapGetters, mapMutations, mapActions } from 'vuex'
// 引入模式的配置文件
import { playMode } from '@/common/js/config'
// 引入打乱数组的函数
import { shuffle } from '@/common/js/util'
// 创建音乐对象
import Song from '@/common/js/song'
export const playListMixin = {
  mounted() {
    this.handlerPlaylist(this.playlist)
  },
  activated() {
    this.handlerPlaylist(this.playlist)
  },
  computed: {
    ...mapGetters(['playlist'])
  },
  methods: {
    handlerPlaylist(playlist) {
      throw new Error('component must implement handlerPlaylist method')
    }
  },
  watch: {
    playlist(newVal) {
      this.handlerPlaylist(newVal)
    }
  }
}

export const playerMixin = {
  computed: {
    ...mapGetters([
      'playlist',
      'fullScreen',
      'currentSong',
      'playing',
      'currentIndex',
      'mode',
      'sequenceList',
      'myLoveSongList'
    ]),
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
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
    ...mapActions(['deleteSong', 'deleteAllSong', 'saveMyLoveSongList']),
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
    }
  }
}

export const searchMixin = {
  computed: {
    ...mapGetters(['searchHistory'])
  },
  methods: {
    ...mapActions(['delSearchHistory', 'saveSearchHistory']),
    // 获取搜索框的值
    getSearchText(searchText) {
      this.searchText = searchText
    },
    // 保存历史记录
    saveSearch() {
      if (this.$refs.topTip) {
        this.$refs.topTip.show()
        setTimeout(() => {
          this.$refs.topTip.hide()
        }, 1000)
      }
      this.saveSearchHistory(this.searchText)
    },
    // 删除历史记录
    deleteSearchHistory(history) {
      this.delSearchHistory(history)
    },
    // 选中的热门标签或历史记录
    selectHot(hotText) {
      this.$refs.searchBox.setSearchText(hotText)
    }
  }
}

export const songMixin = {
  computed: {
    ...mapGetters(['playHistory'])
  },
  methods: {
    ...mapActions(['insertSong']),
    showPlayList() {
      this.isShow = true
    },
    showHistory() {
      this.isShow = false
    },
    // 选中的歌曲
    getPlaySongs(song, index) {
      if (index === 0 && this.$refs.topTip) {
        return
      }
      this.insertSong({ song: new Song(song), isFull: this.isFull })
      if (this.$refs.topTip) {
        this.$refs.topTip.show()
        setTimeout(() => {
          this.$refs.topTip.hide()
        }, 1000)
      }
    }
  }
}
