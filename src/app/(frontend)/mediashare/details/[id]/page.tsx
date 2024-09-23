import { fetchTVProviders } from "@/app/api/motn"
import MediaDetails from "@/components/Medias/MediaDetails"
import { unstable_cache } from "next/cache"
import { lazy, Suspense } from "react"

interface Args {
  params: {
    id: string
  }
  searchParams: {
    media_type: string
  }
}

const TVProviders = lazy(
  () => import("@/components/Medias/TVProviders/TVProviders")
)

export default async function page({ params, searchParams }: Args) {
  const showData = unstable_cache(
    async () => {
      const data = await fetchTVProviders(
        Number(params.id),
        searchParams.media_type as "movie" | "tv"
      )
      return data
    },
    ["tvProviders", params.id],
    { revalidate: 60 * 24 * 7 }
  )

  const tvData = await showData()

  return (
    <>
      <div className="">
        <Suspense fallback={<div>Loading...</div>}>
          <MediaDetails
            mediaID={Number(params.id)}
            mediaType={searchParams.media_type as "movie" | "tv"}
          />
        </Suspense>
        {tvData && (
          <div className="w-full rounded-md bg-slate-800 py-4 px-2 relative mx-auto ">
            <div className="max-w-3xl bg-slate-800 py-4 px-2 relative mx-auto">
              <Suspense fallback={<div>Loading...</div>}>
                <div className="max-w-4xl">
                  <TVProviders show={tvData} />
                </div>
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
