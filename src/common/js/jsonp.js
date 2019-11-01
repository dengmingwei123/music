import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url += url.indexOf('?') === -1 ? '?' + params(data) : params(data)
  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 将参数拼接
function params(data) {
  if (data.constructor !== Object) {
    return
  }
  let arr = []
  for (let key in data) {
    arr.push(`${key}=${data[key]}`)
  }
  let result = arr.join('&')
  return result
}
