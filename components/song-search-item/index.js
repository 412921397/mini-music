// components/song-video-item/index.js
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
    handleDetails(event) {
       /** 当前具体信息 */
       const item = event.currentTarget.dataset.item
       wx.navigateTo({
         url: `/pages/detail-songs/index?id=${item.id}&type=menu`
       })
    }
  }
})
