export interface TMDBSearchRecord {
  id: number
  adult: boolean
  popularity: number
}

export interface TMDBMediaSearchRecord extends TMDBSearchRecord {
  backdrop_path?: string
  original_language: string
  overview?: string
  poster_path?: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  media_type: TMDBMediaType
}

export interface TMDBMovieSearchRecord extends TMDBMediaSearchRecord {
  title: string
  original_title: string
  release_date: string
  video: boolean
}

export interface TMDBTvShowSearchRecord extends TMDBMediaSearchRecord {
  name: string
  original_name: string
  first_air_date: string
  origin_country: string[]
}

export interface TMDBPersonSearchRecord extends TMDBSearchRecord {
  gender: number
  known_for_department: string
  name: string
  original_name: string
  profile_path: string
  known_for: TMDBSearchRecord[]
}

export interface TMDBSearchResponse {
  page: number
  results: TMDBSearchRecord[]
  total_pages: number
  total_results: number
}

export interface TMDBMultiSearchQueryParams {
  query: string
  include_adult: boolean
  language: string
  page: number
}

type TMDBGenreIds = {
  id: number
}

export type TMDBMediaType = "movie" | "tv" | "person" | unknown

export interface TMDBMovieDetails {}
