import Link from "next/link"
import { Button } from "../ui/button"

// Extended offer interface with display properties
export interface OfferDisplayData {
  n: string
  code: string
  treatmentCode: string
  score: number
  desc: string
  attributes: Array<{
    n: string
    v: string | number | boolean | null
    t: string | null
  }>
  // Display properties extracted from attributes or defaults
  title?: string
  description?: string
  AbsoluteBannerURL?: string
  cta?: string
  AbsoluteLandingPageURL?: string
}

interface OfferProps {
  offer: OfferDisplayData
}

const Offer = ({ offer }: OfferProps) => {
  // Helper function to get attribute value by name
  const getAttributeValue = (attributeName: string, defaultValue = ""): string => {
    const attribute = offer.attributes.find(attr => attr.n.toLowerCase() === attributeName.toLowerCase())
    return attribute && attribute.v !== null ? String(attribute.v) : defaultValue
  }

  // Extract display properties from attributes with fallbacks
  const title = offer.title || getAttributeValue("offer_title") || offer.n || ""
  const description =
    offer.description ||
    getAttributeValue("offer_copy") ||
    getAttributeValue("offer_description") ||
    offer.desc ||
    "Great offer just for you!"
  const image =
    offer.AbsoluteBannerURL ||
    getAttributeValue("AbsoluteBannerURL") ||
    getAttributeValue("offer_image") ||
    "/placeholder-offer.jpg"
  const cta = offer.cta || getAttributeValue("offer_cta") || "Learn More"
  const ctaLink =
    offer.AbsoluteLandingPageURL ||
    getAttributeValue("AbsoluteLandingPageURL") ||
    getAttributeValue("offer_link") ||
    "#"

  return (
    <div
      className="relative rounded-2xl overflow-hidden bg-center bg-no-repeat bg-cover flex items-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4),rgba(0,0,0,0.6)),url('${image}')`,
      }}>
      <div className="relative z-10 p-6 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg md:text-xl mb-8 text-slate-200 leading-relaxed">{description}</p>
        <Link href={ctaLink}>
          <Button size="lg" className="bg-primary px-6 py-2 cursor-pointer">
            {cta}
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default Offer
