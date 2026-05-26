/** 对齐房小团 ``pages/ershou/ranking`` 静态资源 */
export const IMG = {
  headerBg: "https://imgcdn.huanjutang.com/internal/image/20240830/d690b3fe2564b7d0991f1601edfe1410.png",
  qrcodeBox: "https://imgcdn.huanjutang.com/internal/image/20240627/28516a7c1f4c1f2bad3358911da82631.png",
  tabApartment: "https://imgcdn.huanjutang.com/internal/image/20240830/401307f6e37c3c5566c841bd7aa10844.png",
  tabBizCircle: "https://imgcdn.huanjutang.com/internal/image/20240830/bd1b0376c6c874d67d749b9d11c1cbfc.png",
  tabArea: "https://imgcdn.huanjutang.com/internal/image/20240830/33e06b7889b7b323234d6ccea6f478a0.png",
  areaArrow: "https://imgcdn.huanjutang.com/internal/image/20250402/cvme4n899ojq9aib41u0.png",
  rankDefault: "https://imgcdn.huanjutang.com/image/2024/06/24/e16e8126dd0dd3d9592ec4e14f0c35eb.png",
  rankOne: "https://imgcdn.huanjutang.com/image/2024/06/24/ea0e7032b6fb2024bbd3ea2b49c6f679.png",
  rankTwo: "https://imgcdn.huanjutang.com/image/2024/06/24/e0f11992f895baeec5b51cfc8ae1ded2.png",
  rankThree: "https://imgcdn.huanjutang.com/image/2024/06/24/519ac710d629598fa4829280b438f8be.png",
  headerTipIcon: "https://imgcdn.huanjutang.com/image/2024/06/24/d5485ea76c12b0fa41ee92f55b75f94d.png",
  nameArrow: "https://imgcdn.huanjutang.com/internal/image/20250325/cvh4nqkmdeeohr0agpjg.png",
  transArrow: "https://imgcdn.huanjutang.com/internal/image/20250325/cvh55ekmdeeohr0ahmrg.png",
  empty: "https://imgcdn.huanjutang.com/internal/image/20240625/e23d52bffc000f7bead3346ee899b598.png",
  loading: "https://imgcdn.huanjutang.com/file/2021/07/17/15d9c2b93e2150167895a6f328c30ec1.png",
  download: "https://imgcdn.huanjutang.com/internal/image/20240814/0f148326190365f031b7ee6e83bdf3e6.png",
  priceMap: "https://imgcdn.huanjutang.com/image/2024/06/24/d5de340db9bcc2cadeebc7d947bab075.png",
  downloadLegacy: "https://imgcdn.huanjutang.com/image/2024/06/24/a08aff690c5627c521745ee24cf18bfc.png",
  slogan: "https://imgcdn.huanjutang.com/assets/img/2021721110258081.png",
} as const

export const PAGE_SIZE = 20

export const TAB_BG: Record<string, string> = {
  apartment: IMG.tabApartment,
  biz_circle: IMG.tabBizCircle,
  area: IMG.tabArea,
}

export const RANK_BADGES = [IMG.rankOne, IMG.rankTwo, IMG.rankThree, IMG.rankDefault] as const
