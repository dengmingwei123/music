import { playMode } from '@/common/js/config'
import { loadSearch, loadPlayHistory, loadMyLoveSongList } from '@/common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  currentPlayIndex: 0,
  recommend: {},
  rank: {},
  searchHistory: loadSearch(),
  playHistory: loadPlayHistory(),
  myLoveSongList: loadMyLoveSongList()
}

export default state
