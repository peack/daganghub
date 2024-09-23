import * as streamingAvailability from "streaming-availability"

export const fetchTVProvidersWClient = async (
  id: string | number,
  media_type: "movie" | "tv"
) => {
  const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPID_API_KEY
  const client = new streamingAvailability.Client(
    new streamingAvailability.Configuration({
      apiKey: RAPID_API_KEY,
    })
  )
  const data = await client.showsApi.getShow({
    id: `${media_type}/${id}`,
  })
  return data
}

export const fetchTVProviders = async (
  id: string | number,
  mediaType: "movie" | "tv",
  outputLanguage = "en"
) => {
  const url = `https://streaming-availability.p.rapidapi.com/shows/${mediaType}/${id}?series_granularity=show&output_language=${outputLanguage}`
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.NEXT_PUBLIC_RAPID_API_KEY}`,
      "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
    },
  }
  let showResults: streamingAvailability.Show | null = null
  try {
    const response = await fetch(url, {
      ...options,
      cache: "force-cache",
    }).then((res) => res.json())
    showResults = response
  } catch (error) {
    console.error(error)
  }
  return showResults
}
