const SEARCH_KEY = 'searchHistoryList'
const SEARCH_MAX_LENGTH = 15

const PLAY_HISTORY_KEY = 'playHistoryList'
const PLAY_HOSTORY_LENGTH = 200

const MY_LOVE_KEY = 'myLoveSongList'
const MY_LOVE_LENGTH = 200

// 格式化数组
function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  // 如果index=0,那么就表示当前添加的内容本来就在第一个,什么都不做,直接返回
  if (index === 0) {
    return arr
  }
  // 如果index>0,则表示数组中有,并且不是第一个,则需要删除,然后添加到最前面
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  // 判断是否有限制长度
  if (maxLen && arr.length > maxLen) {
    // 删除最后一个
    arr.pop()
  }
  return arr
}

// 获取本地数据函数
function getLocalStorage(key) {
  let arr = JSON.parse(localStorage.getItem(key))
  if (!arr) {
    arr = []
  }
  return arr
}

// 保存搜索记录
export function saveSearch(searchText) {
  // 获取是否有本地存储,没有则是空数组
  let searchHistoryList = getLocalStorage(SEARCH_KEY)
  // 调用函数
  let arr = insertArray(
    searchHistoryList,
    searchText,
    v => {
      return v === searchText.trim()
    },
    SEARCH_MAX_LENGTH
  )
  // 设置给本地缓存
  localStorage.setItem(SEARCH_KEY, JSON.stringify(arr))
  return arr
}

export function loadSearch() {
  return getLocalStorage(SEARCH_KEY)
}

export function delSearch(history) {
  // 获取本地存储数据
  let searchHistoryList = getLocalStorage(SEARCH_KEY)
  // 找到当前要删除的数据的索引
  let index = searchHistoryList.findIndex(v => {
    return v === history
  })
  // 删除数据
  searchHistoryList.splice(index, 1)
  // 重新设置本地数据
  localStorage.setItem(SEARCH_KEY, JSON.stringify(searchHistoryList))
  return searchHistoryList
}

export function delSearchList() {
  localStorage.setItem(SEARCH_KEY, JSON.stringify([]))
  return []
}

// 保存播放音乐记录
export function savePlayHistory(song) {
  let playHistoryList = getLocalStorage(PLAY_HISTORY_KEY)
  // 判断当前要添加的音乐在数组中是否存在
  let index = playHistoryList.findIndex(v => {
    return v.id === song.id
  })
  // 如果存在,则需要删除
  if (index > -1) {
    playHistoryList.splice(index, 1)
  }
  // 再添加到数组前面
  playHistoryList.unshift(song)
  // 判断是否超出长度,如果是,删除最后一个
  if (playHistoryList.length > PLAY_HOSTORY_LENGTH) {
    playHistoryList.pop()
  }
  // 重新设置到本地缓存
  localStorage.setItem(PLAY_HISTORY_KEY, JSON.stringify(playHistoryList))
  // 将新的数组返回给vuex
  return playHistoryList
}

// 加载播放记录
export function loadPlayHistory() {
  return getLocalStorage(PLAY_HISTORY_KEY)
}

// 保存我喜欢的音乐列表中
export function saveMyLove(song) {
  let myLoveSongList = getLocalStorage(MY_LOVE_KEY)
  // 判断数组中有没有这首歌,如果有,则删除,没有则添加
  let index = myLoveSongList.findIndex(v => {
    return v.id === song.id
  })
  if (index > -1) {
    myLoveSongList.splice(index, 1)
  } else {
    myLoveSongList.unshift(song)
  }
  // 如果超出限定,则删除最后的
  if (myLoveSongList.length > MY_LOVE_LENGTH) {
    myLoveSongList.pop()
  }
  // 设置给本地缓存
  localStorage.setItem(MY_LOVE_KEY, JSON.stringify(myLoveSongList))
  return myLoveSongList
}

// 加载我喜欢的音乐列表
export function loadMyLoveSongList() {
  return getLocalStorage(MY_LOVE_KEY)
}
