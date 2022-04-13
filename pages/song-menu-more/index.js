// pages/song-menu-more/index.js
import { getSongMenu } from "../../service/api_music"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    songMenuMore: [],
    more: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const id = options.id
    this.setData({ id })
    this.getPageData(id)
  },
  /** 数据相应 */
  getPageData(id) {
    if(!this.data.more) return
    /** 展示加载动画 */
    wx.showNavigationBarLoading()
    let songMenu = +id === 1 ? "华语" : ""
    let limit = 1000
    let offset = 0
    /** 全部 */
    getSongMenu(songMenu, limit, offset).then(res => {
      let newData = this.data.songMenuMore
      if(offset === 0) {
        newData = res.playlists
      } else {
        newData = newData.concat(res.playlists)
      }
      this.setData({ songMenuMore: res.playlists, more: res.more })
      /** 关闭动画 */
      wx.hideNavigationBarLoading()
      if(offset === 0) wx.stopPullDownRefresh()
    })
  },
  /** 事件处理 */
  handleMenuItemClick(event) {
    const item = event.currentTarget.dataset.item
    wx.navigateTo({
      url: `/pages/detail-songs/index?id=${item.id}&type=menu`
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