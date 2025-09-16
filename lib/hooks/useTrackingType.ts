import { useSiteContext } from "@/lib/SiteContext"
import { useState, useEffect } from "react"

export type TrackingType = "cdp" | "discover"

/**
 * Custom hook to manage mutually exclusive tracking type (CDP or Discover) for the current brand.
 * Defaults to 'cdp' if not set.
 */
export const useTrackingType = () => {
  const { brand } = useSiteContext()
  const key = `${brand.key}_trackingType`

  const [trackingType, setTrackingType] = useState<TrackingType>("cdp")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // SSR guard for localStorage
    if (typeof window === "undefined") {
      setTrackingType("cdp")
      setIsLoading(false)
      return
    }

    const value = localStorage.getItem(key)
    if (value === "cdp" || value === "discover") {
      setTrackingType(value)
    } else {
      setTrackingType("cdp")
    }
    setIsLoading(false)
  }, [key])

  const setType = (type: TrackingType) => {
    setTrackingType(type)
    if (typeof window !== "undefined") {
      localStorage.setItem(key, type)
      // Force page reload to properly initialize the new tracking system
      window.location.reload()
    }
  }

  return {
    trackingType,
    setTrackingType: setType,
    isLoading,
  }
}
