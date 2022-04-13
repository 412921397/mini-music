/** 动态计算拿到banner容器的真实高度 */
export default function(selector) {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec(resolve)
  })
}