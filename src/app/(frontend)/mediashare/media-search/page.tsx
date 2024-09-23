import MediaSearch from "@/components/Search/MediaSearch"

interface MediaSearchProps {
  q: string
}
export default function page({
  searchParams,
}: {
  searchParams: MediaSearchProps
}) {
  return (
    <div className="container h-full">
      <MediaSearch searchQuery={searchParams.q} />
    </div>
  )
}
