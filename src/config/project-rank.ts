/** 对齐房小团 ``pages/project-list/project-rank`` 静态资源 */
export const IMG = {
  headerBg: "https://imgcdn.huanjutang.com/image/2023/03/07/b2df9447bbc3bfa8fd6b8c5abd0022a0.png",
  areaArrow: "https://imgcdn.huanjutang.com/image/2023/03/07/14ea315ca4ecf9dd290c61cb0c7c5907.png",
  tabActiveBadge: "https://imgcdn.huanjutang.com/image/2023/03/17/8e8c9d9723219c26eab1c47224dc7735.png",
  rankDefault: "https://imgcdn.huanjutang.com/assets/img/20233171048518081.png",
  rankOne: "https://imgcdn.huanjutang.com/image/2024/06/24/ea0e7032b6fb2024bbd3ea2b49c6f679.png",
  rankTwo: "https://imgcdn.huanjutang.com/image/2024/06/24/e0f11992f895baeec5b51cfc8ae1ded2.png",
  rankThree: "https://imgcdn.huanjutang.com/image/2024/06/24/519ac710d629598fa4829280b438f8be.png",
  hotRankBg: "https://imgcdn.huanjutang.com/assets/img/2019117104077887.png",
  hotRankRedBg: "https://imgcdn.huanjutang.com/assets/img/2019117104078081.png",
  eye: "https://imgcdn.huanjutang.com/image/2020/07/30/eeeb5fd458afa8e1f5369378c98da933.png",
  attention: "https://imgcdn.huanjutang.com/image/2022/01/12/bb5bc493bfa2e2e442c57ef920814cd9.png",
  historyArrow: "https://imgcdn.huanjutang.com/image/2023/05/17/942f7a94d65c90d02ca6ba047547b4d5.png",
  loading: "https://imgcdn.huanjutang.com/file/2021/07/17/15d9c2b93e2150167895a6f328c30ec1.png",
  slogan: "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png",
} as const

export const PAGE_SIZE = 30

export const RANK_BADGES = [IMG.rankOne, IMG.rankTwo, IMG.rankThree, IMG.rankDefault] as const

export const TAB_ITEMS = [
  { key: "popularity", label: "人气榜" },
  { key: "hotSearch", label: "热搜榜" },
  { key: "follow", label: "关注榜" },
  { key: "sell", label: "网签销量榜" },
  { key: "chat", label: "热聊榜" },
  { key: "luxury", label: "豪宅榜" },
] as const
