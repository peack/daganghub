"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Season } from "@/types/tmdb/tmdbSeries"
import Image from "next/image"

interface SeasonContainerProps {
  seasons: Season[]
}

export default function SeasonContainer({ seasons }: SeasonContainerProps) {
  const baseUrl = `https://image.tmdb.org/t/p/original`

  return (
    <div className="container bg-slate-600 rounded-lg pt-4">
      <div className="flex justify-start text-xl pb-2">
        {seasons.length} {seasons.length === 1 ? " Season" : " Seasons"}
      </div>
      <Carousel className=" h-[180px] w-full">
        <CarouselContent>
          {seasons.map((season) => (
            <CarouselItem key={season.id} className="basis-1/4">
              <Image
                src={`${baseUrl}${season.poster_path}`}
                width={113}
                height={150}
                alt="placeholder"
                className="rounded-lg h-[150px] w-[113px]"
                priority={false}
              />
              <div className="flex">{season.name}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
