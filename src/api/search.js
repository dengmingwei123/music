import jsonp from '@/common/js/jsonp'
import { PARAMS, OPTIONS } from './config'
import axios from 'axios'

const debug = process.env.NODE_ENV !== 'production'

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, PARAMS, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'jsonp'
  })

  return jsonp(url, data, OPTIONS)
}

export function getSearchResult(searchText, page, zhida, perpage) {
  const url = debug ? '/api/getSearchResult' : 'http://www.dengmingwei.com/music/api/getSearchResult'
  const data = Object.assign({}, PARAMS, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    w: searchText, // 搜索的内容
    zhidaqu: 1,
    catZhida: zhida ? 1 : 0, // 是否需要显示歌手
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage, // 一页多少条
    n: perpage, // 一页多少条
    p: page, // 请求第几页
    remoteplace: 'txt.mqq.all'
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}
