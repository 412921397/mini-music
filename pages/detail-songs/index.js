// pages/detail-songs/index.js
import { rankingStore, playerStore } from "../../store/index"
import { getSongMenuDetail } from "../../service/api_music"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: "",
    ranking: "",
    songInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const type = options.type
    this.setData({ type })
    if(type === "menu") {
      const id = options.id
      getSongMenuDetail(id).then(res => {
        this.setData({ songInfo: res.playlist })
      })
    } else if(type === "rank") {
      console.log(options)
      const ranking = options.ranking
      this.setData({ ranking })
      /** 获取数据 */
      rankingStore.onState(ranking, this.getRankingDataHanlder)
    }
  },
  /** 跳转当前歌单，以及播放点击的歌曲 */
  handleSongItemClick(event) {
    const index = event.currentTarget.dataset.index
    playerStore.setState("playListSongs", this.data.songInfo.tracks)
    playerStore.setState("playListIndex", index)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if(this.data.ranking) {
      rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
    }
  },
  /** 获取歌曲菜单 */
  getRankingDataHanlder(res) {
    this.setData({ songInfo: res })
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