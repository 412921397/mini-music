// pages/music-player/index.js
import { audioContext, playerStore } from "../../store/index"

const playModeNames = ["order", "repeat", "random"]

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,

    currentSong: {},
    durationTime: 0, // 歌曲总时长
    lyricInfos: [],

    currentTime: 0, // 当前播放进度
    currentLyricIndex: 0,
    currentLyricText: "",

    isPlaying: false,
    playingName: "pause",

    playModeIndex: 0,
    playModeName: "order",

    isMusicLyric: true,
    currentPage: 0,
    contentHeight: 0,
    sliderValue: 0,
    isSliderChanging: false,
    lyricScrollTop: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /** 获取传入的id */
    const id = options.id
    // console.log(id)
    this.setData({ id })
    /** 获取歌曲信息 */
    this.setupPlayerStoreListener()
    /** 动态计算内容高度 :屏幕高度 - 状态栏高度 - 导航高度  */
    const globalData = getApp().globaldata
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio = globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight, isMusicLyric: deviceRadio >= 2  })
  },
  // ========================   数据监听   ======================== 
  setupPlayerStoreListener() {
    /** 监听currentSong/durationTime/lyricInfos */
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })
    /** 监听currentTime/currentLyricIndex/currentLyricText  */
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })
    /** 监听播放模式相关的数据 */
    playerStore.onStates(["playModeIndex", "isPlaying"], ({ playModeIndex, isPlaying }) => {
      if(playModeIndex !== undefined) {
        this.setData({ playModeIndex, playModeName: playModeNames[playModeIndex] })
      }
      if(isPlaying !== undefined) {
        this.setData({ isPlaying, playingName: isPlaying ? "pause" : "resume" })
      }
    })
  },
  // ========================   事件处理   ======================== 
  /** 导航返回 */
  handleBackBtnClick() {
    wx.navigateBack()
  },
  /** 切换歌曲歌词 */
  handleSwiperChange(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },
  /** 手指切换进度条 */
  handleSliderChanging(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime })
  },
  /** 指定当前进度条的位置 */
  handleSliderChange(event) {
    /** 获取slider变化的值 */
    const value = event.detail.value
    /** 计算需要播放的currentTIme */
    const currentTime = this.data.durationTime * value / 100
    /** 设置context播放currentTime位置的音乐 */
    // audioContext.pause() // 先暂停音乐
    audioContext.seek(currentTime / 1000) // 播放跳转的时间段歌曲
    /** 记录最新的sliderValue, 并且需要讲isSliderChaning设置回false */
    this.setData({ sliderValue: value, isSliderChanging: false })
  },
  /** 歌曲模式 */
  handleModeBtnClick() {
    // 计算最新的playModeIndex
    let playModeIndex = this.data.playModeIndex + 1
    if (playModeIndex === 3) playModeIndex = 0

    // 设置playerStore中的playModeIndex
    playerStore.setState("playModeIndex", playModeIndex)
  },
  /** 播放暂停 */
  handlePlayBtnClick() {
    playerStore.dispatch("changeMusicPlayStatusAction", !this.data.isPlaying)
  },
  handlePrevBtnClick() {
    playerStore.dispatch("changeNewMusicAction", false)
  },
  handleNextBtnClick() {
    playerStore.dispatch("changeNewMusicAction")
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