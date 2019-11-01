import { PARAMS, OPTIONS } from './config'
import jsonp from '@/common/js/jsonp'

export function getSingerList() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?'

  let data = Object.assign({}, PARAMS, {
    format: 'jsonp',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, OPTIONS)
}

export function getSingerDetail(singerId) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

  let data = Object.assign({}, PARAMS, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })

  return jsonp(url, data, OPTIONS)
}
