// pages/detail-search/index.js
import { getSearchHot, getSearchSuggest, getSearchResult } from "../../service/api_search"
import debounce from "../../utils/debounce"
import stringToNodes from "../../utils/string2nodes"

const debounceGetSearchSuggest = debounce(getSearchSuggest, 300)
const globalData = getApp().globaldata

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotKeywords: [],
    suggestSongs: [],
    suggestSongsNodes: [],
    resultSongs: [],
    resultSonsMenu: [],
    resultMvs: [],
    searchValue: "",
    active: 0,
    statusBarHeight: globalData.statusBarHeight,
    scrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 获取页面的数据 */
    this.getPageData()
    // console.log(this.data.statusBarHeight, "sss")
  },
  getPageData() {
    getSearchHot().then(res => {
      this.setData({ hotKeywords: res.result.hots })
    })
  },
  handleSearchChange(event) {
    /** 获取输入的关键字 */
    const searchValue = event.detail
    /** 保存关键字 */
    this.setData({ searchValue })
    /** 判断关键字为空字符串的处理逻辑 */
    if(!searchValue.length) {
      this.setData({ 
        suggestSongs: [],
        resultSongs: [],
        resultSonsMenu: [],
        resultMvs: [],
        active: 0
      })
      /** 输入框为空的时候不请求api */
      debounceGetSearchSuggest.cancel()
      return
    }
    /** 根据关键字搜索 */
    debounceGetSearchSuggest(searchValue).then(res => {
      /** 获取建议的关键字歌曲 */
      const suggestSongs = res.result.allMatch
      this.setData({ suggestSongs })
      if(!suggestSongs) return
      /** 转成nodes节点 */
      const suggestKeywords = suggestSongs.map(item => item.keyword)
      const suggestSongsNodes = []
      for(const keyword of suggestKeywords) {
        const nodes = stringToNodes(keyword, searchValue)
        suggestSongsNodes.push(nodes)
      }
      this.setData({ suggestSongsNodes })
    })
  },
  /** 搜索歌曲歌手 */
  handleSearchAction() {
    const searchValue = this.data.searchValue
    let type
    this.data.active === 0 ? type = 1: this.data.active === 1 ? type = 1000 : type = 1004
    getSearchResult(searchValue, type).then(res => {
      this.setData({ 
        resultSongs: res.result.songs ? res.result.songs : [],
        resultSonsMenu:  res.result.playlists ? res.result.playlists : [],
        resultMvs: res.result.mvs ? res.result.mvs : []
      })
    })
  },
  /** */
  handleKeywordItemClick(event) {
    /** 获取点击的关键字 */
    const keyword = event.currentTarget.dataset.keyword
    /** 将关键字设置到searchValue */
    this.setData({ searchValue: keyword })
    /** 发送请求 */
    this.handleSearchAction()
  },
  handleDetails(event) {
    // console.log(event)
    this.setData({ active: event.detail.index })
    /** 发送请求 */
    this.handleSearchAction()
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