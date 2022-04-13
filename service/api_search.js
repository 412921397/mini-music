import qlRequest from "./index"

/** 搜索页面热门 */
export function getSearchHot() {
  return qlRequest.get("/search/hot")
}
/** 搜索的关键词页面 */
export function getSearchSuggest(keywords) {
  return qlRequest.get("/search/suggest", {
    keywords,
    type: "mobile"
  })
}
/** 搜索  */
export function getSearchResult(keywords) {
  return qlRequest.get("/search", {
    keywords
  })
}
