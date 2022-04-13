import qlRequest from "./index"
/**
 * 写死type：2  ios
 */
export function getBanners() {
  return qlRequest.get("/banner", {
    type: 2
  })
}
/**
 * 
 * @param {number} idx 获取热门
 */
export function getRankings(idx) {
  return qlRequest.get("/top/list", {
    idx
  })
}

/** 热门，推荐，飙升 */
export function getSongMenu(cat="全部", limit=6, offset=0) {
  return qlRequest.get("/top/playlist", {
    cat,
    limit,
    offset
  })
}

/** 歌单 */
export function getSongMenuMore(id) {
  return qlRequest.get("/playlist/hot", {
    id
  })
}

/** 歌单详情 */
export function getSongMenuDetail(id) {
  return qlRequest.get("/playlist/detail/dynamic", {
    id
  })
}
