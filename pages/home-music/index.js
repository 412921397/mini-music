// pages/home-music/index.js
import { rankingStore, rankingMap, playerStore } from "../../store/index"

import { getBanners, getSongMenu } from "../../service/api_music"
import queryRect from "../../utils/query-rect"
import throttle from "../../utils/throttle"

/** 节流计算banner容器的高度,trailing:true保证最后一次也会调用一次 */
const throttleQueryRect = throttle(queryRect, 1000, { trailing: true })

Page({

    /**
     * 页面的初始数据
     */
    data: {
      swiperHeight: 0,
      banners: [],
      recommendSongs: [],
      hotSongMenu: [],
      recommendSongMenu: [],
      rankings: { 0: {}, 2: {}, 3: {} },

      currentSong: {},
      isPlaying: false,
      playAnimState: "paused"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      /** 获取banner */
      this.getPageData();
      /** 请求store */
      rankingStore.dispatch("getRankingDataAction")

      /** 从store获取共享的数据 */
      this.setupPlayerStoreListener()
      
    },

    /** 请求 */
    getPageData() {
       /** 获取banner */
      getBanners().then(res => {
        /** setData设置在data数据上是同步的
         * 通过最新的数据对wxml进行渲染，渲染的过程是异步的
         */
        this.setData({ banners: res.banners })
      })
      /** 全部 */
      getSongMenu().then(res => {
        this.setData({ hotSongMenu: res.playlists })
      })
      /** 全部 */
      getSongMenu("华语").then(res => {
        this.setData({ recommendSongMenu: res.playlists })
      })
    },
    setupPlayerStoreListener() {
      /** 排行榜监听 */
      rankingStore.onState("hotRanking", (res) => {
        if(!res.tracks) return
        const recommendSongs = res.tracks.slice(0, 6)
        this.setData({ recommendSongs })
      })
      rankingStore.onState("newRanking", this.getRankingHandler(0))
      rankingStore.onState("originRanking", this.getRankingHandler(2))
      rankingStore.onState("upRanking", this.getRankingHandler(3))
      /** 播放器监听 */
      playerStore.onStates(["currentSong", "isPlaying"], ({currentSong, isPlaying}) => {
        if (currentSong) this.setData({ currentSong })
        if (isPlaying !== undefined) {
          this.setData({ 
            isPlaying, 
            playAnimState: isPlaying ? "running": "paused" 
          })
        }
      })
    },
    getRankingHandler(idx) {
      return (res) => {
        if(Object.keys(res).length === 0) return
        const name = res.name
        const coverImgUrl = res.coverImgUrl
        const playCount = res.playCount
        const songList = res.tracks.slice(0, 3)
        const rankingObj = { name, coverImgUrl, playCount, songList }
        const newRankings = { ...this.data.rankings, [idx]: rankingObj }
        this.setData({ rankings: newRankings })
        // console.log(this.data.rankings)
      }
    },
    // ==================================  事件处理    ================================
    /** 跳转 */
    handleSearchClick() {
      wx.navigateTo({
        url: '/pages/detail-search/index',
      })
    },
    /**  */
    handleSwiperImageLoaded() {
      /** 获取图片容器的高度 */
      throttleQueryRect(".swiper-image").then(res => {
        const rect = res[0]
        if(rect) this.setData({ swiperHeight: rect.height })
      })
    },
    /** 更多跳转 */
    handleMoreClick() {
      this.navigateToDetailSongsPage("hotRanking")
    },
    /** 巅峰榜歌单跳转 */
    handleRankingItemClick(event) {
      const idx = event.currentTarget.dataset.idx
      const rankingName = rankingMap[idx]
      this.navigateToDetailSongsPage(rankingName)
    },
    /** 封装的跳转 */
    navigateToDetailSongsPage(rankingName) {
      wx.navigateTo({
        url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
      })
    },
    /** 推荐歌曲传递歌单 */
    handleSongItemClick(event) {
      const index = event.currentTarget.dataset.index
      playerStore.setState("playListSongs", this.data.recommendSongs)
      playerStore.setState("playListIndex", index)
    },
    /** 底部导航栏播放 */
    handlePlayBtnClick() {
      playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
    },
    /** 点击底部导航栏跳转 */
    handlePlayBarClick() {
      wx.navigateTo({
        url: `/pages/music-player/index?id=${this.data.currentSong.id}`
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