export interface StatusResponse {
  success: boolean
  status_code: number
  status_message: string
}

export interface TMDBMediaDetailsParams {
  mediaID: number
  language: string
  mediaType: "movie" | "tv"
}
