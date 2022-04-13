// pages/detail-video/index.js
import { getMVURL, getMVDetail, getSimi } from "../../service/api_video.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvURLInfo: {},
    mvDetail: {},
    relatedVideos: [],
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    // 2.获取页面的数据
    this.getPageData(id)
  },

  /** 请求函数 */
  getPageData(id) {
    /** 请求播放地址 */
    getMVURL(id).then(res => {
      this.setData({ mvURLInfo: res.data })
    })
   /** 2.请求视频信息 */
    getMVDetail(id).then(res => {
      // console.log(res, "視頻信息")
      this.setData({ mvDetail: res.data })
    })
    /** 3.请求相关视频 */
    getSimi(id).then(res => {
      // console.log(res.mvs, "相关视频")
      this.setData({ relatedVideos: res.mvs })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})