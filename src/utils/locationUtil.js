const QQMapWx = require('./qqmap-wx-jssdk')
const secretKey = 'gbMZdPIrHewUYaA3awUClJ4mebegcYpU'
const instance = new QQMapWx({
  key: 'RSFBZ-K5H3P-QK7DF-LSXWV-2U45K-TZF7H'
})

const request = (method, options) => {
  options = options || {}
  const opts = {
    sig: secretKey
  }
  return new Promise(ps => {
    options = {
      ...opts,
      success: res => {
        const { status, result } = res
        if (status != 0) {
          console.log(res)
          ps(false)
          return
        }
        ps(result)
      },
      fail: error => {
        ps(false)
        console.error(error)
      },
      ...options
    }
    instance[method](
      {
        ...options
      }
    )
  })
}
/**
 * 经纬度转换成地址
 * @param {string} latitude 经度
 * @param {string} longitude 纬度
 */
const reverseGeocoder = async (latitude, longitude) => {
  const opts = {
    location: {
      latitude,
      longitude
    }
  }
  const ret = await request('reverseGeocoder', opts)
  return ret
}
/**
 * 获取城市列表
 */
const getCityList = async () => {
  const method = 'getCityList'
  const ret = await request(method)
  return ret
}
const setCity = (name) => {
  wx.setStorageSync('city', name)
}
const getCity = () => {
  return wx.getStorageSync('city')
}
/**
 * 检查是否授权获取位置信息
 */
const checkLocationAuth = () => {
  return new Promise(ps => {
    wx.getSetting({
      success: res => {
        const hasAuth = res.authSetting['scope.userLocation']
        ps(hasAuth && true)
      }, fail: (error) => {
        ps(false)
        console.error(error)
      }
    })
  })
}
export const setLocationStorage = local => {
  wx.setStorageSync('local', local)
}
export const getLocationStorage = () => {
  return wx.getStorageSync('local')
}
export { reverseGeocoder, getCityList, setCity, getCity, checkLocationAuth }
