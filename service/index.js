const BASE_URL = "http://123.207.32.32:9001"

/** 已经部署好的登录api */
const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class QLRequest {
  constructor(baseURL) {
    this.baseURL = baseURL
  }
 request(url, method, params, header = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method: method,
      header: header,
      data: params,
      success: function(res) {
        resolve(res.data)
      },
      fail: reject
    })
  })
 }

 get(url, params, header) {
  return this.request(url, "GET", params, header)
 }

 post(url, data, header) {
  return this.request(url, "POST", data, header)
 }
}

const qlRequest = new QLRequest(BASE_URL)

const qlLoginRequest = new QLRequest(LOGIN_BASE_URL)

export default qlRequest
export { qlLoginRequest }