"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent, useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Battery, Zap } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState, useMemo, useEffect } from "react"
import { formatPriceData } from "@/lib/priceFormatting"
import Link from "next/link"

interface Phone {
  id: string
  name: string
  brand: string
  price: string
  originalPrice?: string
  imageUrl: string
  features: string[]
  storage: string[]
  colors: Array<string | { name: string; swatch: string }>
  rating: number
  isNew?: boolean
  isBestSeller?: boolean
  priceValue: number
}

interface WhyChooseFeature {
  title: string
  description: string
}

export default function MobilePhonesPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const { track } = useCdp()
  const t = useTranslations()

  const pageData = t.raw("pages.mobilePhones")

  // State for filtering and sorting
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sortOption, setSortOption] = useState<string>("popular")

  // Add price values to phones for sorting
  const phonesWithPriceValues = useMemo(() => {
    return pageData.products.map((phone: Phone) => ({
      ...phone,
      priceValue: parseInt(phone.price.replace(/[€$,]/g, "")),
    }))
  }, [pageData.products])

  // Extract unique brands from phones and ensure type safety
  const brands = Array.from(new Set(pageData.products.map((phone: Phone) => phone.brand))) as string[]

  useEffect(() => {
    track({ identifier: "MobilePhone_Acquire", properties: { brand: brand.label, locale: locale.code } })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Filter and sort phones
  const filteredAndSortedPhones = useMemo(() => {
    let filtered = phonesWithPriceValues

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter((phone: Phone) => phone.brand === selectedBrand)
    }

    // Sort phones
    switch (sortOption) {
      case "priceLowHigh":
        return filtered.sort((a: Phone, b: Phone) => a.priceValue - b.priceValue)
      case "priceHighLow":
        return filtered.sort((a: Phone, b: Phone) => b.priceValue - a.priceValue)
      case "rating":
        return filtered.sort((a: Phone, b: Phone) => b.rating - a.rating)
      case "popular":
      default:
        return filtered.sort((a: Phone, b: Phone) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
    }
  }, [phonesWithPriceValues, selectedBrand, sortOption])

  // Helper function to create URL slug from brand and product name
  const createProductSlug = (brandName: string, name: string) => {
    return `${brandName}-${name}`
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }

  usePageMeta(pageData.meta.title, pageData.meta.description)

  return (
    <main className="min-h-screen">
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={t("pages.mobilePhones.cdp.pageEventName")}
          pageProperties={{ brand: brand.label, locale: locale.code }}
        />
      )}

      {/* Hero Section */}
      <section className="py-8 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              {pageData.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{pageData.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-4 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedBrand === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBrand("all")}
                className={selectedBrand === "all" ? "brand-bg-primary text-white" : ""}>
                {pageData.filters.allBrands}
              </Button>
              {brands.map(brandName => (
                <Button
                  key={brandName}
                  variant={selectedBrand === brandName ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBrand(brandName)}
                  className={selectedBrand === brandName ? "brand-bg-primary text-white" : ""}>
                  {brandName}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortOption === "priceLowHigh" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOption("priceLowHigh")}
                className={sortOption === "priceLowHigh" ? "brand-bg-primary text-white" : ""}>
                {pageData.filters.sortOptions.priceLowHigh}
              </Button>
              <Button
                variant={sortOption === "popular" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOption("popular")}
                className={sortOption === "popular" ? "brand-bg-primary text-white" : ""}>
                {pageData.filters.sortOptions.mostPopular}
              </Button>
              <Button
                variant={sortOption === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortOption("rating")}
                className={sortOption === "rating" ? "brand-bg-primary text-white" : ""}>
                {pageData.labels.rating}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedPhones.map((phone: Phone) => (
              <Card
                key={phone.id}
                className="hover:shadow-lg hover:brand-shadow transition-all duration-300 group flex flex-col">
                <Link
                  href={`/${locale.code}/${brand.key}/mobile-phones/${createProductSlug(phone.brand, phone.name)}`}
                  className="flex-1">
                  <div className="relative overflow-hidden">
                    <Image
                      src={`${phone.imageUrl}&w=400`}
                      alt={phone.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {phone.isNew && (
                        <Badge className="brand-bg-accent text-white shadow-lg">{pageData.badges.new}</Badge>
                      )}
                      {phone.isBestSeller && (
                        <Badge className="brand-bg-secondary text-white shadow-lg">{pageData.badges.bestSeller}</Badge>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Link>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{phone.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{phone.brand}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold brand-gradient-text">
                        {formatPriceData(phone, locale.code, brand.key).price}
                      </div>
                      {phone.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatPriceData({ price: phone.originalPrice }, locale.code, brand.key).price}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 flex-1 flex flex-col">
                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Zap className="h-4 w-4 brand-text-primary" />
                      {pageData.labels.keyFeatures}
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {phone.features.slice(0, 3).map((feature: string, index: number) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full brand-bg-primary"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Available Options */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-1">{pageData.labels.storage}</h4>
                      <p className="text-muted-foreground">{phone.storage.join(", ")}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{pageData.labels.colors}</h4>
                      <p className="text-muted-foreground">
                        {phone.colors
                          .slice(0, 3)
                          .map(color => (typeof color === "string" ? color : color.name))
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.floor(phone.rating) ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-muted-foreground">({phone.rating})</span>
                  </div>

                  {/* Action Buttons - Push to bottom */}
                  <div className="flex gap-2 pt-4 mt-auto">
                    <Link
                      href={`/${locale.code}/${brand.key}/mobile-phones/${createProductSlug(phone.brand, phone.name)}`}
                      className="flex-1">
                      <Button variant="outline" className="w-full">
                        {pageData.labels.viewDetails}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {pageData.whyChoose.title.replace("{brand}", brand.label)}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData.whyChoose.features.map((feature: WhyChooseFeature, index: number) => (
              <div key={index} className="text-center group">
                <div className="mx-auto w-12 h-12 brand-bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:brand-bg-primary group-hover:brand-shadow transition-all duration-300">
                  {index === 0 && (
                    <Smartphone className="h-6 w-6 brand-text-primary group-hover:text-white transition-colors" />
                  )}
                  {index === 1 && (
                    <Battery className="h-6 w-6 brand-text-primary group-hover:text-white transition-colors" />
                  )}
                  {index === 2 && (
                    <Zap className="h-6 w-6 brand-text-primary group-hover:text-white transition-colors" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2 brand-text-primary">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
