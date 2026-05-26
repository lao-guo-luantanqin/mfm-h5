import { apiGet } from "@/utils/request"
import type { ProjectRankData, ProjectRankTabKey } from "@/types/project-rank"

export function fetchProjectRank(query?: {
  page?: number
  size?: number
  tab?: ProjectRankTabKey | string
  district?: string
  plate?: string
}) {
  return apiGet<ProjectRankData>("/data/project-rank", {
    page: query?.page ?? 1,
    size: query?.size ?? 30,
    tab: query?.tab ?? "popularity",
    district: query?.district,
    plate: query?.plate,
  })
}
