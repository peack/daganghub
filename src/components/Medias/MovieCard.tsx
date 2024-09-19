import React from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import { MediaSearchDisplayProps } from "../Search/MediaSearch"
import Link from "next/link"
import qs from "qs"

interface MovieCardProps {
  searchRecord: MediaSearchDisplayProps
}

export default function MovieCard({ searchRecord }: MovieCardProps) {
  const imgSrc = searchRecord?.poster_path
    ? `https://image.tmdb.org/t/p/original${searchRecord?.poster_path}`
    : ""

  const linkUrl = `/mediashare/details/${searchRecord?.id}?${qs.stringify({
    media_type: `${searchRecord?.media_type}`,
  })}`

  return (
    <Card key={searchRecord?.id} className="max-w-[200px]">
      <CardHeader>
        <Link href={linkUrl}>
          <Image
            src={imgSrc}
            alt={`${searchRecord?.displayTitle}`}
            width={185}
            height={278}
            className="rounded-lg"
          />
        </Link>
      </CardHeader>
      <CardFooter className="max-w[185px]">
        <p>{searchRecord?.displayTitle}</p>
      </CardFooter>
    </Card>
  )
}
