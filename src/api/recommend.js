import { PARAMS } from './config'
import axios from 'axios'

export function getRecommend() {
  let url = '/api/getRecommend'
  let data = Object.assign({}, PARAMS, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
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

export function getDiscList() {
  let url = '/api/getDiscList'
  let data = Object.assign({}, PARAMS, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random()
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

export function getRecommendDisc(id) {
  let url = '/api/getRecommendDisc'
  let data = Object.assign({}, PARAMS, {
    disstid: id,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
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
