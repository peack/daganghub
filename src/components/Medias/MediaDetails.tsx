"use client"
import { fetchMediaDetails } from "@/app/api/tmdb"
import { TMDBMovieDetailResponse } from "@/types/tmdb/tmdbMovies"
import { TMDBSeriesDetailResponse } from "@/types/tmdb/tmdbSeries"
import { useEffect, useState } from "react"
import Image from "next/image"
import MediaTag from "./MediaTag"
import SeasonContainer from "./Shows/SeasonContainer"
import { TMDBMediaDetailsParams } from "@/types/tmdb/tmdb"
interface MediaDetailsProps {
  mediaID: number
  mediaType: "movie" | "tv"
}

export default function MediaDetails({
  mediaID,
  mediaType,
}: MediaDetailsProps) {
  const [media, setMedia] = useState<
    TMDBMovieDetailResponse | TMDBSeriesDetailResponse | null
  >(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSeries = async () => {
      setIsLoading(true)
      let fetchMovieDetailsProps: TMDBMediaDetailsParams = {
        mediaID: mediaID ?? 0,
        language: "en",
        mediaType: mediaType as "movie" | "tv",
      }
      if (mediaType === "tv") {
        fetchMediaDetails<TMDBSeriesDetailResponse>(
          fetchMovieDetailsProps
        ).then((seriesDetails) => {
          setMedia(seriesDetails)
          mediaTile = seriesDetails?.name ?? seriesDetails?.original_name ?? ""
        })
      } else if (mediaType === "movie") {
        fetchMediaDetails<TMDBMovieDetailResponse>(fetchMovieDetailsProps).then(
          (movieDetails) => {
            setMedia(movieDetails)
            mediaTile =
              movieDetails?.title ?? movieDetails?.original_title ?? ""
          }
        )
      } else {
        setMedia(null)
      }
      setIsLoading(false)
    }
    fetchSeries()
  }, [mediaID])

  const SeriesExtras = () => {
    const series = media as TMDBSeriesDetailResponse
    return (
      <div className="flex flex-row">
        <SeasonContainer seasons={series.seasons} />
      </div>
    )
  }

  let mediaTile: string =
    (media as TMDBSeriesDetailResponse)?.original_name ??
    (media as TMDBMovieDetailResponse)?.title ??
    ""

  return (
    <div className=" bg-slate-800">
      {isLoading && <div>Loading...</div>}
      {media && !isLoading && (
        <>
          {media.backdrop_path && (
            <div className="relative w-full  min-h-[50dvh] sm:m-h-[55dvh] lg:min-h-[65dvh] m-0 flex flex-col justify-end">
              <Image
                src={`https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                fill={true}
                alt={mediaTile}
                objectFit="cover"
                className="z-0"
              />
              <div className="relative bottom-0 right-0 flex flex-row-reverse w-full gap-1 z-20 pb-1 pr-1 ">
                {media.genres.map((genre) => (
                  <MediaTag key={genre.id} mediaGenre={genre} />
                ))}
              </div>
            </div>
          )}
          <div className="max-w-3xl rounded-md bg-slate-800 py-4 px-2 relative mx-auto">
            <div className="flex">
              <div className="flex-col w-[200px] h-[300px] flex-shrink-0">
                <Image
                  src={`https://image.tmdb.org/t/p/original${media.poster_path}`}
                  width={188}
                  height={250}
                  alt={mediaTile}
                  className="rounded-lg w-[188px] h-[250px]"
                />
              </div>
              <div className="flex-col space-y-2">
                <div className="text-3xl">{mediaTile}</div>
                <div className="">{media.overview}</div>
              </div>
            </div>
            {mediaType === "tv" && <SeriesExtras />}
          </div>
        </>
      )}
    </div>
  )
}
