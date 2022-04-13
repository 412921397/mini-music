import { qlLoginRequest } from "./index"

export function getLoginCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 1000,
      success: res => {
        const code = res.code
        resolve(code)
      },
      fail: err => {
        reject(err)
      }
    })
  })
}
/** 登录获得code的唯一标识 */
export function codeToToken(code) {
  return qlLoginRequest.post("/login", { code })
}
/** 检测token是否过期 */
export function checkToken(token) {
  return qlLoginRequest.post("/auth", {}, {
    token
  })
}

export function checkSession() {
  return new Promise((resolve) => {
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}
