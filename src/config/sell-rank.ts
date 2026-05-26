/** 对齐房小团 ``pages/data/sell-rank`` 静态资源 */
export const IMG = {
  headerBg: "https://imgcdn.huanjutang.com/internal/image/20250429/d084q3cmdeeklvflg0ug.png",
  tabCount: "https://imgcdn.huanjutang.com/internal/image/20250429/d084q3cjq74stcckraj0.png",
  tabArea: "https://imgcdn.huanjutang.com/internal/image/20250429/d084q3cjq74stcckrajg.png",
  tabAmount: "https://imgcdn.huanjutang.com/internal/image/20250429/d084q3cjq74stcckrak0.png",
  areaArrow: "https://imgcdn.huanjutang.com/internal/image/20250429/d084rq4mdeeklvflgda0.png",
  share: "https://imgcdn.huanjutang.com/internal/image/20241127/bed12102b8947e3e0f8efc2ee0d1fab4.png",
  empty: "https://imgcdn.huanjutang.com/internal/image/20240625/e23d52bffc000f7bead3346ee899b598.png",
  download: "https://imgcdn.huanjutang.com/image/2024/06/24/a08aff690c5627c521745ee24cf18bfc.png",
  slogan: "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png",
  tipIcon: "https://imgcdn.huanjutang.com/image/2024/06/24/d5485ea76c12b0fa41ee92f55b75f94d.png",
  rankDefault: "https://imgcdn.huanjutang.com/internal/image/20250219/cuqor4uthvuj961c1sig",
  rankOne: "https://imgcdn.huanjutang.com/image/2024/06/24/ea0e7032b6fb2024bbd3ea2b49c6f679.png",
  rankTwo: "https://imgcdn.huanjutang.com/internal/image/20250219/cuqor4uthvuj961c1sj0",
  rankThree: "https://imgcdn.huanjutang.com/image/2024/06/24/519ac710d629598fa4829280b438f8be.png",
  waterRemark: "https://imgcdn.huanjutang.com/internal/image/20240830/401307f6e37c3c5566c841bd7aa10844.png",
  waterBg: "https://imgcdn.huanjutang.com/internal/image/20240830/bd1b0376c6c874d67d749b9d11c1cbfc.png",
  periodArrow: "https://imgcdn.huanjutang.com/internal/image/20240830/33e06b7889b7b323234d6ccea6f478a0.png",
  navPrev: "https://imgcdn.huanjutang.com/image/2024/04/07/3cd3d1ace9517594f7dc8821a21f0b8d.png",
  navPrevDisabled: "https://imgcdn.huanjutang.com/image/2024/04/07/1eded950eb385bdd19c1fccedc325d34.png",
  navNext: "https://imgcdn.huanjutang.com/image/2024/04/07/dedb1eb902c65af13bd2eb121274aade.png",
  navNextDisabled: "https://imgcdn.huanjutang.com/image/2024/04/07/d4ac61581d8c137058eb3814a1baca30.png",
} as const

export const METRIC_ITEMS = [
  { key: "count", label: "网签套数", tabBg: IMG.tabCount, headerClass: "header1", bodyClass: "body5" },
  { key: "area", label: "网签面积", tabBg: IMG.tabArea, headerClass: "header3", bodyClass: "body3" },
  { key: "amount", label: "网签总额", tabBg: IMG.tabAmount, headerClass: "header4", bodyClass: "body4" },
] as const

export const PERIOD_ITEMS = [
  { key: "month", label: "月度数据" },
  { key: "week", label: "周度数据" },
  { key: "day", label: "日度数据" },
] as const
