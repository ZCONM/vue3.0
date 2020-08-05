import { Loading, Message } from 'element-ui'
import Vue from 'vue'
import axios from 'axios'
const env = require('../../config/prod.env')
var qs = require('querystring')

let Versions = process.env.NODE_ENV === 'development' ? '/api' : ''
// 请求超时
axios.defaults.timeout = 8000
// let loadinginstace;
// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    // loadinginstace = Loading.service({ fullscreen: true });
    return config
  },
  error => {
    // loadinginstace.close();
    Message.error({
      message: '请求超时'
    })
    return Promise.reject(error)
  }
)
// 添加响应拦截器
axios.interceptors.response.use(
  response => {
    // loadinginstace.close();
    if (!(response.data.IsSuccess || response.data.Code === 200)) {
      let data = JSON.parse(response.config.data || '{}')
      if (data.off_loading) {
      } else {
        Message.error({
          message: response.data.MessageContent
        })
      }
    }
    return response
  },
  error => {
    // loadinginstace.close();
    Message.error({
      message: '请求失败'
    })
    return Promise.reject(error)
  }
)

export default (type, url, data = {}, devUrl) => {
  const qsData = qs.stringify(data)
  const opt = {
    method: 'get',
    url: /^http/.test(url) ? url : Versions + url
  }

  return new Promise((resolve, reject) => {
    switch (type) {
      case 'GET':
        if (data && Object.keys(data).length > 0) {
          Object.assign(opt, {
            url: `${url}?${qsData}`,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
            }
          })
        }
        break
      case 'POST':
        Object.assign(opt, {
          method: 'post',
          data: Object.assign(data, {})
        })
        break
      case 'formData':
        const send = Object.assign(data, {})

        let formdata = new FormData()

        for (const [key, val] of Object.entries(send)) {
          formdata.append(key, val)
        }
        Object.assign(opt, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          method: 'post',
          data: formdata
        })
        break
    }
    axios(opt)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.error(err)
      })
  })
}
