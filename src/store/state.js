import { playMode } from '@/common/js/config'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: 0,
  currentPlayIndex: 0,
  recommend: {},
  rank: {}
}

export default state