import { TMDBGenre } from "@/types/tmdb/tmdbMovies"
import { Badge } from "../ui/badge"

interface MediaTagProps {
  mediaGenre: TMDBGenre
}
export default function MediaTag({ mediaGenre }: MediaTagProps) {
  return <Badge variant="media">{mediaGenre.name}</Badge>
}
