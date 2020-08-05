import { Loading, Message } from 'element-ui'
import Vue from 'vue'
import axios from 'axios'
const env = require('../../config/prod.env')
var qs = require('querystring')
async function configGet () {
  console.log('GetMopsConfig', env)
  let url = process.env.NODE_ENV === 'development' ? '/api' : JSON.parse(env.Version)
  await axios.get(url + '/Config/GetMopsConfig').then(res => {
    console.log('GetMopsConfig', res)
    if (res.status === 200) {
      window.AdminConfig = JSON.parse(res.data)
    }
  })
}
configGet()

let Versions = process.env.NODE_ENV === 'development' ? '/api' : (AdminConfig || {}).Versions
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
      if (data.no_message || response.config.url.indexOf('/ParkingCoupon/GetElecouponGive') > -1 || response.config.url.indexOf('/MerchantFavore/CheckBuyRecord') > -1) {
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

const getCookie = name => {
  let arr

  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  arr = document.cookie.match(reg)
  const reg3D = /%3D/
  if (arr) {
    if (reg3D.test(arr[2])) {
      return decodeURIComponent(arr[2])
    }
    return arr[2]
  } else {
    return null
  }
}

let userInfo = {}
Object.defineProperty(userInfo, 'token', {
  get: function () {
    return qs.parse(getCookie('thirdparty.user') || {}).token
  }
})
let currentInfo = {}
Object.defineProperty(currentInfo, 'currentParkingCode', {
  get: function () {
    return qs.parse(getCookie('currentParkingLot') || {}).currentParkingCode
  }
})

console.log(currentInfo, 777)

// 获取  全局请求信息
// console.log(userInfo,currentInfo,);
//  get、post

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
          data: Object.assign(data, {
            ParkingCode: currentInfo.currentParkingCode,
            Token: userInfo.token
          })
        })
        break

      case 'LPOST':
        Object.assign(opt, {
          method: 'post',
          data: data
        })
        break

      case 'xPOST':
        // console.log({ParkingCode:currentInfo.currentParkingCode,Token:userInfo.token});
        Object.assign(opt, {
          method: 'post',
          data: Object.assign(data, {
            ParkingCode: currentInfo.currentParkingCode,
            Token: userInfo.token
          })
        })
        break
      case 'formData':
        const send = Object.assign(data, {
          ParkingCode: currentInfo.currentParkingCode,
          Token: userInfo.token
        })

        let formdata = new FormData()

        for (const [key, val] of Object.entries(send)) {
          formdata.append(key, val)
        }
        Object.assign(opt, {
          headers: {
            'Content-Type': 'multipart/form-data' // 之前说的以表单传数据的格式来传递fromdata
          },
          method: 'post',
          data: formdata
        })
        break

      case 'POSTNew':
        const qsDataNew = JSON.stringify(Object.assign(data, {
          ParkingCode: currentInfo.currentParkingCode,
          Token: userInfo.token
        }))
        Object.assign(opt, {
          url: `${devUrl || Versions}/HotelDiscount/HotelDiscountInterfaceStr`,
          method: 'post',
          data: {
            JsonModel: qsDataNew,
            ServiceName: url,
            no_message: data.no_message
          }
        })
        break

      case 'POSTPrint':
        Object.assign(opt, {
          url: 'http://logv1.mops.fujica.com.cn/api/log/write',
          method: 'post'
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
