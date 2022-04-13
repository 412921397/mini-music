// components/song-menu-area/index.js
const app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: "默认歌单"
    },
    menuNum: {
      type: Number,
      value: 0
    },
    songMenu: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /** 全局屏幕宽度 */
    screenWith: app.globaldata.screenWith,
    id: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMenuItemClick(event) {
      /** 当前具体信息 */
      const item = event.currentTarget.dataset.item
      this.setData({ id: item.id })
      wx.navigateTo({
        url: `/pages/detail-songs/index?id=${item.id}&type=menu`
      })
    },
    handleMore(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/song-menu-more/index?id=${item}`
      })
    }
  }
})
