import { HYEventStore } from "hy-event-store"
import { getSongDetail, getSongLyric } from "../service/api_player"
import { parseLyric } from "../utils/parse-lyric"

// const audioContext = wx.createInnerAudioContext()  // 只能在小程序中播放，不支持后台播放
const audioContext = wx.getBackgroundAudioManager() /** 可以后台播放 */

const playerStore = new HYEventStore({
  state: {
    isFirstPlay: true, /** 是否第一次播放状态 */
    isStoping: false, /** 当前歌曲的播放状态默认是暂停 */

    id: 0,
    currentSong: {}, /** 当前歌曲信息 */
    durationTime: 0, /** 当前歌曲总时长 */
    lyricInfos: [], /** 歌词 */

    currentTime: 0, /** 当前歌曲已经播放的时长 */
    currentLyricIndex: 0, /** 当前歌词的索引值 */
    currentLyricText: "", /** 当前索引值对应的歌词 */

    isPlaying: false, /** 是否是播放状态 */

    playModeIndex: 0, // 0: 循环播放 1: 单曲循环 2: 随机播放
    playListSongs: [], /** 歌曲列表 */
    playListIndex: 0  /** 当前歌曲列表的歌曲所在的索引 */
  },
  actions: {
    playMusicWithSongIdAction(ctx, { id, isRefresh = false }) {
      /** 播放当前歌曲，点击下一首或上一曲都i会从头开始播放 */
      if(ctx.id == id && !isRefresh) {
        this.dispatch("changeMusicPlayStatusAction", true)
        return
      }
      ctx.id = id

      // 0.修改播放的状态
      ctx.isPlaying = true
      /** 点击其它歌曲清空正在播放歌曲的所有信息 */
      ctx.currentSong = {}
      ctx.durationTime = 0
      ctx.lyricInfos = []
      ctx.currentTime = 0
      ctx.currentLyricIndex = 0
      ctx.currentLyricText = ""

      // 1.根据id请求数据
      // 请求歌曲详情
      getSongDetail(id).then(res => {
        ctx.currentSong = res.songs[0]
        ctx.durationTime = res.songs[0].dt
      })
      // 请求歌词数据
      getSongLyric(id).then(res => {
        const lyricString = res.lrc.lyric
        const lyrics = parseLyric(lyricString)
        ctx.lyricInfos = lyrics
      })
      // 2.播放对应id的歌曲
      audioContext.stop()
      audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
      audioContext.title = id /** 后台具体播放的歌曲 */
      audioContext.autoplay = true
      // 监听audioContext一些事件
      if(ctx.isFirstPlay) {
        this.dispatch("setupAudioContextListenerAction")
        ctx.isFirstPlay = false
      }
    },
    setupAudioContextListenerAction(ctx) {
      // 1.监听歌曲可以播放
      audioContext.onCanplay(() => {
        audioContext.play()
      })
  
      // 2.监听时间改变
      audioContext.onTimeUpdate(() => {
        // 1.获取当前时间
        const currentTime = audioContext.currentTime * 1000
  
        // 2.根据当前时间修改currentTime
        ctx.currentTime = currentTime
        
  
        // 3.根据当前时间去查找播放的歌词
        if (!ctx.lyricInfos.length) return
        let i = 0
        for (; i < ctx.lyricInfos.length; i++) {
          const lyricInfo = ctx.lyricInfos[i]
          if (currentTime < lyricInfo.time) {
            break
          }
        }
        // 设置当前歌词的索引和内容
        const currentIndex = i - 1
        if (ctx.currentLyricIndex !== currentIndex) {
          const currentLyricInfo = ctx.lyricInfos[currentIndex]
          ctx.currentLyricIndex = currentIndex
          ctx.currentLyricText = currentLyricInfo.text
        }
        // 监听歌曲播放完成
        audioContext.onEnded(() => {
          this.dispatch("changeNewMusicAction")
        })
        /** 监听音乐暂停，播放，停止 */
        // 播放状态
        audioContext.onPlay(() => {
          ctx.isPlaying = true
        })
        // 暂停状态
        audioContext.onPause(() => {
          ctx.isPlaying = false
        })
        // 停止
        audioContext.onStop(() => {
          ctx.isPlaying = false
          ctx.isStoping = true
        })
      })
    },
    changeMusicPlayStatusAction(ctx, isPlaying = true) {
      ctx.isPlaying = isPlaying
      /** 后台播放显示的歌曲名字 */
      if(ctx.isPlaying && ctx.isStoping) {
        /** 背景播放关闭❌再进来播放从已经停止的时间接着播放 */
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.title = currentSong.name
        audioContext.startTime = ctx.currentTime / 1000
        ctx.isStoping = false
      }
      ctx.isPlaying ? audioContext.play() : audioContext.pause()
    },
    changeNewMusicAction(ctx, isNext = true) {
      // 获取当前索引
      let index = ctx.playListIndex
      // 根据不同的播放模式, 获取下一首歌的索引
      switch(ctx.playModeIndex) {
        case 0: // 顺序播放
          index = isNext ? index + 1 : index - 1
          if(index === -1) index = ctx.playListSongs.length - 1
          if(index === ctx.playListSongs.length) index === 0
          break
        case 1: // 单曲循环
          break
        case 2: // 随即播放
          index = Math.floor(Math.random() * ctx.playListSongs.length)
          break
      }
      console.log(index)
      /** 获取歌曲 */
      let currentSong = ctx.playListSongs[index]
      if(!currentSong) {
        currentSong = ctx.currentSong
      } else {
        /** 记录最新的歌曲索引值 */
        ctx.playListIndex = index
      }

      /** 播放歌曲 */
      this.dispatch("playMusicWithSongIdAction", { id: currentSong.id, isRefresh: true })
    }
  },
})

export {
  audioContext,
  playerStore
}