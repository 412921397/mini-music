import qlRequest from "./index"

/** 歌曲信息 */
export function getSongDetail(ids) {
  return qlRequest.get("/song/detail", {
    ids
  })
}
/** 获取歌词 */
export function getSongLyric(id) {
  return qlRequest.get("/lyric", {
    id
  })
}
