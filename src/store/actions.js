import * as types from './mutation-types'
// 引入播放状态
import { playMode } from '@/common/js/config'
// 引入工具方法,进行随机洗牌
import { shuffle } from '@/common/js/util'

function findex(list, song) {
  return list.findIndex(v => {
    return song.id === v.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    index = findex(randomList, list[index])
    commit(types.SET_PLAYLIST, randomList)
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlaySum = function({ commit, state }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
