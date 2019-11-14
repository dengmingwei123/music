var express = require('express')
var compression = require('compression')
var config = require('./config/index')
var axios = require('axios')
const bodyParser = require('body-parser')

var port = process.env.PORT || config.build.port

var app = express()

var apiRoutes = express.Router()

// 获取轮播图
apiRoutes.get('/getRecommend', function (req, res) {
  const url =
    'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://y.qq.com',
        host: 'y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(err => {
      console.log(err)
    })
})

// 获取推荐歌单列表
apiRoutes.get('/getDiscList', function (req, res) {
  const url =
    'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://y.qq.com',
        host: 'y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(err => {
      console.log(err)
    })
})

// 获取歌曲
apiRoutes.get('/lyric', function (req, res) {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      let ret = response.data
      if (typeof ret === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = ret.match(reg)
        if (matches) {
          ret = JSON.parse(matches[1])
        }
      }
      res.json(ret)
    })
    .catch(err => {
      console.log(err)
    })
})

// 获取歌曲播放url地址
apiRoutes.post('/getPurlUrl', bodyParser.json(), function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

  axios
    .post(url, req.body, {
      headers: {
        referer: 'https://y.qq.com',
        origin: 'https://y/qq.com',
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(err => {
      console.log(err)
    })
})

// 获取推荐歌单详情页面
apiRoutes.get('/getRecommendDisc', function (req, res) {
  const url =
    'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      let ret = response.data
      if (typeof ret === 'string') {
        const reg = /^\w+\(({.+})\)$/
        const matches = ret.match(reg)
        if (matches) {
          JSON.parse(matches[1])
        }
      }
      res.json(ret)
    })
    .catch(err => {
      console.log(err)
    })
})

// 获取查询结果
apiRoutes.get('/getSearchResult', function (req, res) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  axios
    .get(url, {
      headers: {
        referer: 'https://c.y.qq.com/',
        host: 'c.y.qq.com'
      },
      params: req.query
    })
    .then(response => {
      res.json(response.data)
    })
    .catch(err => {
      console.log(err)
    })
})

app.use('/api', apiRoutes)

app.use(compression())

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
