// components/video-item-play/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    result: {
      type: Array,
      value: []
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
    handleVideo(event) {
      const id = event.currentTarget.dataset.item.id;
      /** 跳转页面 */
      wx.navigateTo({
        url: `/pages/detail-video/index?id=${id}`,
      })
    }
  }
})
