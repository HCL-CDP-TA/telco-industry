import { getOffers, setConfig } from "@/lib/InteractSpot"
import { useEffect, useState, useMemo, useRef } from "react"
import Offer, { type OfferDisplayData } from "./Offer"
import { useSiteContext } from "@/lib/SiteContext"
import { useTranslations } from "next-intl"

// Custom audience config interface with string types for this component
interface CustomAudienceConfig {
  audId: string
  audLevel: string
}

// Props interface for the Offers component
interface OffersProps {
  interactionPoint: string // e.g., "home-loans", "car-loans"
  pageNamespace: string // e.g., "home-loans", "car-loans" for translations
  refreshTrigger?: number // Optional prop to trigger offer refresh
  className?: string // Optional styling
}

// Function to create default offer from language file
const createDefaultOffers = (t: (key: string) => string): OfferDisplayData[] => [
  {
    n: "Default Offer",
    code: "DEFAULT_OFFER",
    treatmentCode: "DEFAULT_OFFER",
    score: 100,
    desc: t("defaultOffer.description"),
    attributes: [
      { n: "offer_title", v: t("defaultOffer.title"), t: "string" },
      { n: "offer_copy", v: t("defaultOffer.copy"), t: "string" },
      { n: "AbsoluteBannerURL", v: t("defaultOffer.image"), t: "string" },
      { n: "offer_cta", v: t("defaultOffer.cta"), t: "string" },
      { n: "AbsoluteLandingPageURL", v: t("defaultOffer.link"), t: "string" },
    ],
  },
]

// Function to get the current logged-in user ID
const getCurrentUser = (brandKey: string): string => {
  if (typeof window === "undefined") return ""

  try {
    const customerData = JSON.parse(localStorage.getItem(`${brandKey}_customer_data`) || "{}")
    return customerData?.loginData?.id || ""
  } catch (error) {
    console.log("Error getting current user:", error)
    return ""
  }
}

const Offers = ({ interactionPoint, pageNamespace, refreshTrigger, className }: OffersProps) => {
  const { brand } = useSiteContext()
  const t = useTranslations(pageNamespace)
  const [offer, setOffer] = useState<OfferDisplayData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const hasInitiallyLoaded = useRef(false)
  const isConfigInitialized = useRef(false)

  // Create default offers from language file - memoized to prevent recreating on every render
  const defaultOffers = useMemo(() => createDefaultOffers(t), [t])

  useEffect(() => {
    const fetchOffers = async (): Promise<void> => {
      // Only show loading spinner on initial load, use refresh indicator for subsequent loads
      if (!hasInitiallyLoaded.current) {
        setIsLoading(true)
      } else {
        setIsRefreshing(true)
      }

      const confObj = {
        serverUrl: process.env.NEXT_PUBLIC_INTERACT_ENDPOINT || "",
        icName: "Banking Web Site", // interactive channel name
        audId: "", // audience id.  3 is what we will use as default to represent an unknown/anonymous user
        audLevel: "", // audience level. This is default value/
        contactEvent: "contact",
        acceptEvent: "accept",
        sessVars: "UACIWaitForSegmentation,true,string",
        debug: true,
        prevAudIdVar: "",
        customerAudLvl: "Customer", // Audience name for customer audience level
        customerAud: "CustomerID", // Audience key for customer audience level
        customerAudType: "numeric", // Audience key type
        visitorAudLvl: "Visitor", // Audience Level for unauthenticated visitors
        visitorAud: "VisitorID",
        visitorAudType: "string",
        visitorAudID: "VisitorID,0,string", // Predefined visitor ID used to start session for a first time visitor
        visitorAltIDVar: "AlternateID", // Visitor profile variable used to pass first time visitor ID (e.g. cookie) on session start.
        // Offer content attributes
        imageAttribute: "AbsoluteBannerURL",
        titleAttribute: "offer_title",
        copyAttribute: "offer_copy",
        ctaAttribute: "offer_cta",
        linkAttribute: "AbsoluteLandingPageURL",
        offerTemplateURL: "",
        timeout: 5,
        interactSpot: [],
        sessionCookie: "",
        modalOffers: false,
      }

      const getAudience = (userName?: string): CustomAudienceConfig => {
        console.log("Get audience for user:", userName)
        const urlParams = new URLSearchParams(window.location.search)
        if (userName) {
          return {
            audId: confObj.customerAud + "," + userName.toString() + "," + confObj.customerAudType,
            audLevel: confObj.customerAudLvl,
          }
        } else if (urlParams.has("utm_email")) {
          const id = urlParams.get("utm_email")
          return { audId: "VisitorID," + (id || "0") + ",string", audLevel: "Visitor" }
        } else if (urlParams.has("id")) {
          const id = urlParams.get("id")
          return {
            audId: confObj.customerAud + "," + (id || "0").toString() + "," + confObj.customerAudType,
            audLevel: confObj.customerAudLvl,
          }
        } else {
          let currAudId = sessionStorage.getItem("audId")
          if (currAudId === null) {
            return { audId: "VisitorID,0,string", audLevel: "Visitor" }
          } else {
            currAudId = currAudId.replaceAll("|", ",")
            let lvl = confObj.visitorAudLvl
            if (currAudId.includes(confObj.customerAud)) {
              lvl = confObj.customerAudLvl
            }
            return { audId: currAudId, audLevel: lvl }
          }
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderOffers = (spotId: string, response: any): void => {
        let firstApiOffer: OfferDisplayData | null = null

        // Check for API errors or no offers available
        if (!response) {
          console.warn("No response received from Interact API, falling back to default offer")
          setOffer(defaultOffers[0])
          return
        }

        if (response.batchStatusCode > 0) {
          if (response.batchStatusCode === 2) {
            console.log("No offers available from Interact API, using default offer")
          } else {
            console.warn(
              "Interact API returned error status:",
              response.batchStatusCode,
              "- falling back to default offer",
            )
          }
          setOffer(defaultOffers[0])
          return
        }

        // Handle both batch responses and individual responses
        if (response.responses?.length) {
          // This is a batch response - iterate through responses
          response.responses.forEach((responseItem: unknown) => {
            const resp = responseItem as {
              offerLists?: { offers?: unknown[] }[]
              offerList?: { offers?: unknown[] }[] // Add support for singular form
            }

            // Check offerLists (plural) first
            if (resp.offerLists?.length && resp.offerLists.length > 0) {
              const offers = resp.offerLists[0]?.offers || []
              if (offers.length > 0) {
                const rawOffer = offers[0] as OfferDisplayData
                firstApiOffer = {
                  ...rawOffer,
                  code: Array.isArray(rawOffer.code) ? rawOffer.code[0] : rawOffer.code,
                }
              }
            }
            // Check offerList (singular) as fallback
            else if (resp.offerList?.length && resp.offerList.length > 0) {
              const offers = resp.offerList[0]?.offers || []
              if (offers.length > 0) {
                const rawOffer = offers[0] as OfferDisplayData
                firstApiOffer = {
                  ...rawOffer,
                  code: Array.isArray(rawOffer.code) ? rawOffer.code[0] : rawOffer.code,
                }
              }
            }
          })
        } else if (response.offerLists?.length > 0) {
          // This is an individual response (already selected from batch)
          const offers = response.offerLists[0]?.offers || []
          if (offers.length > 0) {
            const rawOffer = offers[0] as OfferDisplayData
            firstApiOffer = {
              ...rawOffer,
              code: Array.isArray(rawOffer.code) ? rawOffer.code[0] : rawOffer.code,
            }
          }
        } else if (response.offerList?.length > 0) {
          // This is an individual response with offerList (singular)
          const offers = response.offerList[0]?.offers || []
          if (offers.length > 0) {
            const rawOffer = offers[0] as OfferDisplayData
            firstApiOffer = {
              ...rawOffer,
              code: Array.isArray(rawOffer.code) ? rawOffer.code[0] : rawOffer.code,
            }
          }
        }

        // Use first API offer if available, otherwise use first default offer
        setOffer(firstApiOffer || defaultOffers[0])
      }

      // Error callback function to handle API failures
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const renderOffersError = (error: any): void => {
        console.log("Interact API error, falling back to default offer:", error)
        setOffer(defaultOffers[0])
      }

      const getPageOffers = async (pageName: string, userName = "", eventVars = ""): Promise<void> => {
        return new Promise((resolve, reject) => {
          // Don't set sessionCookie - let InteractSpot.js handle session management
          // The checkSession() function will create the proper session ID format
          confObj.sessionCookie = ""

          const aud = getAudience(userName)
          // console.log("Audience config:", aud, "for userName:", userName)
          const spot = {
            interactionPoint: "ipMortgage",
            event: "page_view",
            maxNumOffers: 1,
            eventVars,
            renderFunction: (spotId: string, response: unknown) => {
              renderOffers(spotId, response)
              resolve() // Resolve the promise when offers are rendered
            },
            errorCallback: (error: unknown) => {
              renderOffersError(error)
              reject(error) // Reject the promise on error
            },
            offerTemplateURL: "",
            interactSpot: ["spot1"],
          }

          // Use original string audLevel values for session establishment
          // Session establishment requires "Customer" or "Visitor" string values
          const apiAud = {
            ...aud,
            // Keep original string values: "Customer" or "Visitor"
          }

          // Only initialize configuration once to prevent session resets
          if (!isConfigInitialized.current) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setConfig(confObj as any)
            isConfigInitialized.current = true
          }
          // console.log("API audience config:", { audId: apiAud.audId, audLevel: apiAud.audLevel })
          // console.log("confObj.sessionCookie before postEventAndGetOffers:", confObj.sessionCookie)

          try {
            getOffers(
              pageName, // Use the interaction point name
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              apiAud as any,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              spot as any,
            )
          } catch (error) {
            reject(error)
          }
        })
      }

      try {
        const userName = getCurrentUser(brand.key) // Get current logged-in user ID
        // Set a timeout for the entire operation
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("API timeout")), 10000) // 10 second timeout
        })

        const offerPromise = getPageOffers(interactionPoint, userName)

        // Race between the API call and timeout
        await Promise.race([offerPromise, timeoutPromise])
      } catch (error) {
        console.log("Error fetching offers:", error)
        // Set default offer on error
        setOffer(defaultOffers[0])
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
        hasInitiallyLoaded.current = true
      }
    }

    fetchOffers()
  }, [refreshTrigger, brand.key, defaultOffers, interactionPoint]) // Removed 'offer' to prevent infinite loop

  return (
    <div className={className}>
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading offer...</p>
        </div>
      ) : offer ? (
        <div className={`w-full transition-opacity duration-300 ${isRefreshing ? "opacity-75" : "opacity-100"}`}>
          <Offer offer={offer} />
        </div>
      ) : (
        <div>
          <p className="text-lg text-gray-600">No offers available at this time.</p>
        </div>
      )}
    </div>
  )
}

export default Offers
