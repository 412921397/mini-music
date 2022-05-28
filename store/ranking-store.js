import { HYEventStore } from "hy-event-store"

import { getRankings } from "../service/api_music"
/** 匹配获取的榜单 */
const rankingMap = { 3779629: "newRanking", 3778678: "hotRanking", 2884035: "originRanking", 19723756: "upRanking" }

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 0: 新歌
    hotRanking: {}, // 1: 热门
    originRanking: {}, // 2: 原创
    upRanking: {} // 3: 飙升
  },
  actions: {
    /** ctx:上下文 */
    getRankingDataAction(ctx) {
      /** 3779629: 新歌榜 3778678: 热门榜 2884035: 原创榜 19723756: 飙升榜 */
      const arrIndex = [3779629, 3778678 , 2884035, 19723756]
      for(const index of arrIndex) {
        getRankings(index).then(res => {
          const rankingName = rankingMap[index]
          ctx[rankingName] = res.playlist
        })
      }
      
    }
  }
})

export {
  rankingStore,
  rankingMap
}
