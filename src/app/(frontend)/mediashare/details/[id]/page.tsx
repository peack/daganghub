import MediaDetails from "@/components/Medias/MediaDetails"

interface Args {
  params: {
    id: string
  }
  searchParams: {
    media_type: string
  }
}

export default function page({ params, searchParams }: Args) {
  return (
    <>
      <MediaDetails
        mediaID={Number(params.id)}
        mediaType={searchParams.media_type as "movie" | "tv"}
      />
    </>
  )
}
