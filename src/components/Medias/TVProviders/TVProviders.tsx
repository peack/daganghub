"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Show,
  StreamingOption,
  StreamingOptionType,
} from "streaming-availability"
import Image from "next/image"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface TVProvidersProps {
  show: Show
}

export enum Country {
  GB = "gb",
  FR = "fr",
  KR = "kr",
  CA = "ca",
}

const myCountries: Country[] = [Country.GB, Country.FR, Country.KR, Country.CA]

export default function TVProviders({ show }: TVProvidersProps) {
  const [streamingCountry, setStreamingCountry] = useState<Country>(Country.GB)
  const [streamingOptions, setStreamingOptions] = useState<StreamingOption[]>(
    show?.streamingOptions[streamingCountry] ?? []
  )
  const [filteredProviders, setFilteredProviders] = useState<StreamingOption[]>(
    show?.streamingOptions[streamingCountry] ?? []
  )
  const [streamingOptionTypeSelection, setStreamingOptionTypeSelection] =
    useState<StreamingOption["type"] | "all">("all")

  const streamingOptionsTypes = Array.from(
    new Set(streamingOptions?.map((streamingOption) => streamingOption?.type))
  )

  useEffect(() => {
    if (
      show?.streamingOptions[streamingCountry] === undefined ||
      show?.streamingOptions[streamingCountry]?.length < 1
    ) {
      console.log("No providers available for this country")
      setFilteredProviders([])
      setStreamingOptions([])
      return
    }
    if ((streamingOptionTypeSelection as string) === "all") {
      setFilteredProviders(show?.streamingOptions[streamingCountry])
    } else {
      setFilteredProviders(
        show?.streamingOptions[streamingCountry].filter(
          (streamingOption) =>
            (streamingOption?.type as string) ===
            (streamingOptionTypeSelection as string)
        ) ?? []
      )
    }
    setStreamingOptions(show?.streamingOptions[streamingCountry])
  }, [streamingOptionTypeSelection, streamingCountry, show])

  const StreamingPServiceIcon = ({
    service,
  }: {
    service: StreamingOption["service"]
  }) => {
    const url = service?.imageSet.darkThemeImage ?? ""
    return (
      <>
        <Image
          src={url}
          alt={service?.name}
          width={80}
          height={80}
          style={{ objectFit: "contain" }}
        />
      </>
    )
  }

  const FilterTabs = () => {
    return (
      <Tabs
        className="flex w-full"
        defaultValue={"all"}
        value={streamingOptionTypeSelection}
        onValueChange={(value) => {
          setStreamingOptionTypeSelection(value as StreamingOptionType)
        }}
      >
        <TabsList>
          <TabsTrigger key={"all"} value={"all"}>
            All
          </TabsTrigger>
          {streamingOptionsTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    )
  }

  const CountrySelector = () => {
    return (
      <>
        <Select
          onValueChange={(value) => {
            setStreamingOptionTypeSelection("all")
            setStreamingCountry(value as Country)
          }}
        >
          <SelectTrigger className="w-[150px] bg-slate-800 rounded-xl">
            <SelectValue placeholder={streamingCountry} />
          </SelectTrigger>
          <SelectContent>
            {myCountries.map((country) => {
              return <SelectItem value={country}>{country}</SelectItem>
            })}
          </SelectContent>
        </Select>
      </>
    )
  }
  const FilterBox = () => {
    return (
      <>
        <div className="flex w-full justify-between">
          <FilterTabs />
          <CountrySelector />
        </div>
      </>
    )
  }

  return (
    <div className="max-w-full  bg-slate-400 rounded-xl px-4 py-2">
      <FilterBox />
      {streamingOptions.length < 1 ? (
        <div>No providers found for {streamingCountry}</div>
      ) : (
        <>
          <div className="flex-col align-start">
            <div className="flex flex-wrap px-4 space-x-2">
              {filteredProviders &&
                filteredProviders?.length > 0 &&
                filteredProviders?.map((streamingOption, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-[95px] h-[95px] gap-x-2 align-center"
                    >
                      <div className="flex-col flex w-full h-full ">
                        <div className="flex-shrink-0  flex items-center flex-grow w-[80px] h-[80px] justify-center ">
                          <Link href={streamingOption.link}>
                            <StreamingPServiceIcon
                              service={streamingOption.service}
                            />
                          </Link>
                        </div>

                        {streamingOption.price && (
                          <div className="mt-auto h-[24px]">
                            {`${streamingOption.price.amount}  ${streamingOption.price.currency}`}{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
