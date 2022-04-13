// app.js
import { getLoginCode, codeToToken, checkToken, checkSession } from "./service/api_login"
import { TOKEN_KEY } from "./constants/token-const"

App({
  /** 全局参数 */
  globaldata: {
    /** 屏幕宽度 */
    screenWith: 0,
    /** 屏幕高度 */
    screenHeight: 0,
    /** 顶部导航栏状态的高度 */
    statusBarHeight: 0,
    /** 真实导航栏的高度 */
    navBarHeight: 44,
    deviceRadio: 0
  },
  async onLaunch() {
    /** 全局获取当前设备的真实宽高 */
    const info = wx.getSystemInfoSync()
    this.globaldata.screenWith = info.screenWidth
    this.globaldata.screenHeight = info.screenHeight
    this.globaldata.statusBarHeight = info.statusBarHeight

    const deviceRadio = info.screenHeight / info.screenWidth
    this.globaldata.deviceRadio = deviceRadio

    /** 用户默认进行登录 */
    const token = wx.getStorageSync(TOKEN_KEY)
    /** token有没有过期 */
    // const checkResult = await checkToken(token)
    // console.log(checkResult)
    /** 判断session是否过期 */
    const isSessionExpire = await checkSession()

    // if(!token || checkResult.errorCode || !isSessionExpire) {
    //   this.loginAction()
    // }
  },
  async loginAction() {
    /** 获取code */
    const code = await getLoginCode()
    /** 将code发送给服务器 */
    const result = await codeToToken(code)
    const token = result.token
    wx.setStorageSync(TOKEN_KEY, token) 
  }
})
