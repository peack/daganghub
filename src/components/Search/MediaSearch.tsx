"use client"
import {
  TMDBMediaSearchRecord,
  TMDBMovieSearchRecord,
  TMDBTvShowSearchRecord,
} from "@/types/tmdb/tmdbSearch"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchMixedMediaRecords } from "@/app/api/tmdb"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import MovieCard from "../Medias/MovieCard"
import { useRouter } from "next/navigation"

type TabSelection = "mixed" | "movies" | "shows"

interface MediaSearchProps {
  searchQuery?: string
}
export interface MediaSearchDisplayProps extends TMDBMediaSearchRecord {
  displayTitle: string
}
export default function MediaSearch({ searchQuery }: MediaSearchProps) {
  const [searchResults, setSearchResults] = useState<MediaSearchDisplayProps[]>(
    []
  )
  const [filteredResults, setFilteredResults] =
    useState<MediaSearchDisplayProps[]>(searchResults)
  const [isLoading, setIsLoading] = useState(false)
  const [tabSelection, setTabSelection] = useState<TabSelection>("mixed")
  const searchInputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    switch (tabSelection) {
      case "movies":
        setFilteredResults(
          searchResults?.filter(
            (result) => (result?.media_type as string) === "movie"
          ) ?? []
        )
        break
      case "shows":
        setFilteredResults(
          searchResults?.filter(
            (result) => (result?.media_type as string) === "tv"
          ) ?? []
        )
        break
      default:
        setFilteredResults(searchResults)
    }
  }, [searchResults, tabSelection])

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery)
    }
  }, [searchQuery])

  function handleSearch(searchTerm: string): void {
    setIsLoading(true)
    fetchMixedMediaRecords(searchTerm).then((results) => {
      const formattedResults: MediaSearchDisplayProps[] = results
        .map((record) => {
          if ((record?.media_type as string) === "movie") {
            let movieRecord = record as TMDBMovieSearchRecord
            return {
              ...record,
              displayTitle: movieRecord.title,
            }
          } else if ((record?.media_type as string) === "tv") {
            let showRecord = record as TMDBTvShowSearchRecord
            return {
              ...record,
              displayTitle: showRecord.name,
            }
          } else {
            return null
          }
        })
        .filter((result) => result !== null) as MediaSearchDisplayProps[]
      return setSearchResults(formattedResults)
    })
    setIsLoading(false)
  }

  function handleSearchAction(e: React.FormEvent, query?: string): void {
    e.preventDefault()
    const searchTerm = searchInputRef.current?.value || ""
    if (!searchTerm.trim()) return
    router.push(`/mediashare/media-search?q=${query ?? searchTerm}`)
  }

  const SearchTabs = () => {
    return (
      <Tabs
        className="flex w-[100px]"
        defaultValue={"mixed"}
        value={tabSelection}
        onValueChange={(value) => {
          setTabSelection(value as TabSelection)
        }}
      >
        <TabsList>
          <TabsTrigger value="mixed">Mixed</TabsTrigger>
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="shows">Shows</TabsTrigger>
        </TabsList>
      </Tabs>
    )
  }

  const SearchBar = () => {
    return (
      <form
        onSubmit={handleSearchAction}
        className="flex w-full max-w-3xl items-center space-x-2"
      >
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Search content..."
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            "Searching..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" /> Search
            </>
          )}
        </Button>
      </form>
    )
  }

  return (
    <>
      <div className="max-w-4xl gap-2">
        <div className="flex-col">
          <div className="flex-wrap-reverse py-2 justify-end">
            <SearchTabs />
          </div>
          <div className="flex py-2">
            <SearchBar />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 align-middle">
          {searchResults.length > 0 &&
            filteredResults.map((result) => (
              <MovieCard searchRecord={result} />
            ))}
        </div>
      </div>
    </>
  )
}
