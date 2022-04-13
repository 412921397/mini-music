// pages/home-video/index.js
import { getTopMV } from "../../service/api_video"

Page({

    /**
     * 页面的初始数据
     */
    data: {
      topMVs: [],
      hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad (options) {
      await this.getTopMVData(0)
    },
    /** 公共请求 */
    async getTopMVData(offset) {
      /** 判断是否可以请求 */
      if(!this.data.hasMore) return
      /** 展示加载动画 */
      wx.showNavigationBarLoading()
      /** 真正的请求数据 */
      const res = await getTopMV(offset)
      let newData = this.data.topMVs
      if(offset === 0) {
        newData = res.data
      } else {
        newData = newData.concat(res.data)
      }
      /** 设置数据 */
      this.setData({ topMVs: newData })
      this.setData({ hasMore: res.hasMore })
      /** 关闭动画 */
      wx.hideNavigationBarLoading()
      if(offset === 0) wx.stopPullDownRefresh()
    },
    /** 点击视频跳转的路径*/
    handleVideoItemClick(event) {
      // console.log(event)
      const id = event.currentTarget.dataset.item.id;
      // console.log(id)
      /** 跳转页面 */
      wx.navigateTo({
        url: `/pages/detail-video/index?id=${id}`,
      })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
      await this.getTopMVData(0)
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    async onReachBottom() {
      await this.getTopMVData(this.data.topMVs.length)
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})