"use client"
import {
  TMDBMediaSearchRecord,
  TMDBMovieSearchRecord,
  TMDBSearchResponse,
  TMDBTvShowSearchRecord,
} from "@/types/tmdb/tmdbSearch"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { fetchMixedMediaRecords } from "@/app/api/tmdb"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import MovieCard from "../Medias/MovieCard"

type TabSelection = "mixed" | "movies" | "shows"
export interface MediaSearchDisplayProps extends TMDBMediaSearchRecord {
  displayTitle: string
}
export default function MediaSearch() {
  const [searchResults, setSearchResults] = useState<MediaSearchDisplayProps[]>(
    []
  )
  const [filteredResults, setFilteredResults] =
    useState<MediaSearchDisplayProps[]>(searchResults)
  const [isLoading, setIsLoading] = useState(false)
  const [tabSelection, setTabSelection] = useState<TabSelection>("mixed")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

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

  function handleSearch(e: React.FormEvent): void {
    e.preventDefault()
    const searchTerm = searchInputRef.current?.value || ""
    if (!searchTerm.trim()) return
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
        onSubmit={handleSearch}
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
