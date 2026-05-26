/** 对齐房小团 ``pages/ershou/aggregation-rank`` 静态资源 */
export const IMG = {
  headerBg:
    "https://imgcdn.huanjutang.com/internal/image/20241105/46ae31710923493a104d7dfe54395db9.png",
  tabDefault:
    "https://imgcdn.huanjutang.com/internal/image/20241105/8ba7ce664af7b11d9589872c191e0f6d.png",
  tabActive:
    "https://imgcdn.huanjutang.com/internal/image/20241105/aadabb5114391f6e85ff839d7685763c.png",
  areaArrow:
    "https://imgcdn.huanjutang.com/internal/image/20241105/7a19678e2b470ec1c5b0bdec2ec1c633.png",
  areaPickerClose:
    "https://imgcdn.huanjutang.com/internal/image/20240829/17118fdf3ad25db5a78e6139ef193529.png",
  navArrow:
    "https://imgcdn.huanjutang.com/internal/image/20241105/6153a0a94569a347b426bc799e849ea3.png",
  nameArrow:
    "https://imgcdn.huanjutang.com/internal/image/20250325/cvh4nqkmdeeohr0agpjg.png",
  rankOne:
    "https://imgcdn.huanjutang.com/internal/image/20241105/0045119bcd22cca6df2e61d9fda21dab.png",
  rankTwo:
    "https://imgcdn.huanjutang.com/internal/image/20241105/15c9be123e3f4ac3f7fd84d8230fad4d.png",
  rankThree:
    "https://imgcdn.huanjutang.com/internal/image/20241105/ba12083817031ba2a3f35cf93febf71f.png",
  download:
    "https://imgcdn.huanjutang.com/image/2024/06/24/a08aff690c5627c521745ee24cf18bfc.png",
  priceMap:
    "https://imgcdn.huanjutang.com/image/2024/06/24/d5de340db9bcc2cadeebc7d947bab075.png",
  timelineShare:
    "https://imgcdn.huanjutang.com/internal/image/20240814/0f148326190365f031b7ee6e83bdf3e6.png",
  loading:
    "https://imgcdn.huanjutang.com/file/2021/07/17/15d9c2b93e2150167895a6f328c30ec1.png",
  slogan: "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png",
} as const

export const RANK_BADGES = [IMG.rankOne, IMG.rankTwo, IMG.rankThree] as const

export const PRIMARY_TABS = [
  { id: "apartment", name: "小区榜单" },
  { id: "biz_circle", name: "商圈榜单" },
  { id: "area", name: "区域榜单" },
] as const

export const LIST_TIPS = "* 默认统计维度为近90天"

/** 吸顶背景切换阈值，对齐原站 ``uni.upx2px(100)`` */
export const STICKY_SCROLL_RPX = 100
