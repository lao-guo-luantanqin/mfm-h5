/** 对齐房小团 ``pages/auction/auction-rank`` 静态资源与 Tab 配置 */
export const IMG = {
  tabActiveDefault:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcaoqo4f4k9j9jv0g.png",
  tabActiveBrandNumber:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcatem3h6lcsbfmsg.png",
  tabActiveBrandPrice:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcaoqo4f4k9j9jv10.png",
  tabActivePremium:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcatem3h6lcsbfmt0.png",
  tabActiveArea:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcatem3h6lcsbfms0.png",
  tabActivePlate:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkcatem3h6lcsbfmrg.png",
  headerFloorPrice:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hkh85em3h6lcsbfsv0.png",
  headerBrandNumber:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hksltem3h6lcsbgeng.png",
  headerBrandPrice:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hksloqo4f4k9j9kme0.png",
  headerPremium:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hksloqo4f4k9j9kmeg.png",
  headerArea:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hksltem3h6lcsbgen0.png",
  headerPlate:
    "https://imgcdn.huanjutang.com/internal/image/20250701/d1hksloqo4f4k9j9kmf0.png",
  areaArrow:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g7dcjq74stccdlfd0.png",
  rankBgDefault:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaq0.png",
  rankBgOne:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaap0.png",
  rankBgTwo:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaqg.png",
  rankBgSpecial:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsmdeeklvfe9us0.png",
  download:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaog.png",
  share:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaapg.png",
  timelineShare:
    "https://imgcdn.huanjutang.com/internal/image/20250422/d03g3jsjq74stccdlaapg.png",
  slogan: "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png",
} as const

export const PRIMARY_TABS = [
  {
    id: 1,
    name: "成交价",
    image: IMG.tabActiveDefault,
    headerBg: IMG.headerFloorPrice,
    tips: "根据土拍成交楼面价高低，进行榜单的排序",
  },
  {
    id: 2,
    name: "品牌成交量",
    image: IMG.tabActiveBrandNumber,
    headerBg: IMG.headerBrandNumber,
    tips: "统计品牌成交的地块数量",
  },
  {
    id: 3,
    name: "品牌成交额",
    image: IMG.tabActiveBrandPrice,
    headerBg: IMG.headerBrandPrice,
    tips: "品牌成交的总金额排行",
  },
  {
    id: 4,
    name: "溢价率榜",
    image: IMG.tabActivePremium,
    headerBg: IMG.headerPremium,
    tips: "成交地块中溢价率的排行",
  },
  {
    id: 5,
    name: "区域成交榜",
    image: IMG.tabActiveArea,
    headerBg: IMG.headerArea,
    tips: "区域成交地块数的排行",
  },
  {
    id: 6,
    name: "板块成交榜",
    image: IMG.tabActivePlate,
    headerBg: IMG.headerPlate,
    tips: "板块成交地块数的排行",
  },
] as const

export const RANK_BG_BY_NUM: Record<number, string> = {
  1: IMG.rankBgOne,
  2: IMG.rankBgTwo,
}

export const STICKY_SCROLL_RPX = 100
