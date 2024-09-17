import qs from "qs"
import {
  TMDBMediaSearchRecord,
  TMDBMovieSearchRecord,
  TMDBMultiSearchQueryParams,
} from "@/types/tmdb/tmdbSearch"

export const fetchMixedMediaRecords = async (userQuery: string) => {
  const queryParams: TMDBMultiSearchQueryParams = {
    query: userQuery,
    include_adult: false,
    language: "en-US",
    page: 1,
  }
  const query = qs.stringify(queryParams)
  const url = `https://api.themoviedb.org/3/search/multi?${query}`
  console.log(`url: ${url}`)
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
    },
  }
  let searchResults: TMDBMediaSearchRecord[] = []
  try {
    const response = await fetch(url, options).then((res) => res.json())
    console.log(`response: ${response}`)
    searchResults = response.results.map((results: TMDBMediaSearchRecord) => {
      return ["movie", "tv"].includes(results.media_type as string)
        ? results
        : null
    })
  } catch (error) {
    console.log(`error: ${error}`)
  }
  return searchResults
}

export const fetchMovies = async (userQuery: string) => {
  const queryParams: TMDBMultiSearchQueryParams = {
    query: userQuery,
    include_adult: false,
    language: "en-US",
    page: 1,
  }
  const query = qs.stringify(queryParams)
  const url = `https://api.themoviedb.org/3/search/movie?${query}`
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_BEARER_TOKEN}`,
    },
  }

  let searchResults: TMDBMovieSearchRecord[] = []
  try {
    const response = await fetch(url, options).then((res) => res.json())
    console.log(`response: ${response}`)
    searchResults = response.results.map(
      (results: TMDBMovieSearchRecord) => results
    )
  } catch (error) {
    console.log(`error: ${error}`)
  }
  return searchResults
}
