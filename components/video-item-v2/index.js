// components/video-item-v2/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleVideoInfo(event) {
      const item = event.currentTarget.dataset.item
      wx.navigateTo({
        url: `/pages/detail-video/index?id=${item.id}`
      })
    }
  }
})
