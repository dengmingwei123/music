import * as types from './mutation-types'
// 引入播放状态
import { playMode } from '@/common/js/config'
// 引入工具方法,进行随机洗牌
import { shuffle } from '@/common/js/util'
// 引入处理本地数据的函数
import { saveSearch, delSearch, delSearchList, savePlayHistory, saveMyLove } from '@/common/js/cache'

function findex(list, song) {
  return list.findIndex(v => {
    return song.id === v.id
  })
}

// 选中的音乐
export const selectPlay = function ({ commit, state }, { list, index }) {
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

// 随机播放全部
export const randomPlaySum = function ({ commit, state }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = shuffle(list)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 添加播放歌曲
export const insertSong = function ({ commit, state }, { song, isFull }) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 如果正在播放音乐和当前播放音乐一样,则只需要打开全屏即可
  if (currentSong) {
    if (currentSong.id === song.id) {
      commit(types.SET_FULL_SCREEN, true)
      return
    }
  }
  // 判断播放列表中是否有当前要添加的歌曲
  let playIndex = findex(playlist, song)
  // 因为是插入歌曲,所以索引+1
  currentIndex++
  // 插入到这首歌到当前索引位置
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (playIndex > -1) {
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > playIndex) {
      playlist.splice(playIndex, 1)
      currentIndex--
    } else {
      playlist.splice(playIndex + 1, 1)
    }
  }

  // 获取sequenceList中当前播放音乐的索引,在它的后面插入歌曲
  let currentSongIndex = findex(sequenceList, currentSong) + 1
  // 获取添加歌曲是否在sequenceList中
  let sequenceIndex = findex(sequenceList, song)

  sequenceList.splice(currentSongIndex, 0, song)
  // 如果已经包含这首歌
  if (sequenceIndex > -1) {
    if (currentSongIndex > sequenceIndex) {
      sequenceList.splice(sequenceIndex, 1)
    } else {
      sequenceList.splice(sequenceIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, isFull)
}

// 保存搜索历史记录
export function saveSearchHistory({ commit }, searchText) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(searchText))
}

// 删除搜索历史记录
export function delSearchHistory({ commit }, history) {
  commit(types.SET_SEARCH_HISTORY, delSearch(history))
}

// 删除全部搜索历史记录
export function delSearchHistoryList({ commit }) {
  commit(types.SET_SEARCH_HISTORY, delSearchList())
}

// 删除单首歌曲
export function deleteSong({ commit, state }, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 获取当前要删除的音乐在列表中的索引
  let playIndex = findex(playlist, song)
  playlist.splice(playIndex, 1)
  let sequenceIndex = findex(sequenceList, song)
  sequenceList.splice(sequenceIndex, 1)

  // 如果要删除的歌曲在当前播放音乐的前面 或者 已经删除最后一首歌了,则需要currentIndex--
  if (playIndex < currentIndex || currentIndex >= playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  // 如果播放列表中没有音乐了,则需要停止
  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

// 删除所有的歌曲
export function deleteAllSong({ commit }) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)
}

// 保存播放音乐记录
export function savePlaySongHistory({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlayHistory(song))
}

// 保存到我喜欢的音乐列表中
export function saveMyLoveSongList({ commit }, song) {
  commit(types.SET_MY_LOVE_SONG_LIST, saveMyLove(song))
}
