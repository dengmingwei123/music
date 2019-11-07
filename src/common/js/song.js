import { getLyric, getSongsUrl } from '@/api/song'
import { ERR_OK } from '@/api/config'
import { Base64 } from 'js-base64'

export default class Song {
  constructor({ id, mid, name, albumname, duration, singer, image, url }) {
    this.id = id
    this.mid = mid
    this.name = name
    this.albumname = albumname
    this.filename = `C400${this.mid}.m4a`
    this.duration = duration
    this.singer = singer
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject(new Error('no lyric'))
        }
      })
    })
  }
}

// 格式化成想要的数据
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    name: musicData.songname,
    albumname: musicData.albumname,
    duration: musicData.interval,
    singer: filterSinger(musicData.singer),
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: musicData.url
  })
}

// 过滤歌手名
function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach(v => {
    ret.push(v.name)
  })
  return ret.join('/')
}

// 过滤有效的数据
export function isValidMusic(musicData) {
  return (
    musicData.songid && musicData.albummid && musicData.pay.payalbumprice === 0
  )
}

// 获取歌曲的url地址
export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return getSongsUrl(songs).then(res => {
    if (res.code === ERR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo
      midUrlInfo.forEach((info, index) => {
        if (info.purl === '') {
          return
        }
        let song = songs[index]
        song.url = `http://dl.stream.qqmusic.qq.com/${info.purl}`
      })
    }
    return songs
  })
}
