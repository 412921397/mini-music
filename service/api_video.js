import qlRequest from "./index"

export function getTopMV(offset, limit = 10) {
  return qlRequest.get("/top/mv", {
    offset,
    limit
  })
}
/**
 * 请求MV的播放地址
 * @param {number} id MV的id
 */
export function getMVURL(id) {
  return qlRequest.get("/mv/url", {
    id
  })
}

/**
 * 请求MV的详情
 * @param {number} mvid MV的id
 */
export function getMVDetail(mvid) {
  return qlRequest.get("/mv/detail", {
    mvid
  })
}
/**
 * 
 * @param {number} id 
 */
export function getRelatedVideo(id) {
  return qlRequest.get("/related/allvideo", {
    id
  })
}
/** 相关视频mvs */
export function getSimi(mvid) {
  return qlRequest.get("/simi/mv", {
    mvid
  })
}
