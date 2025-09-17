"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Camera, Battery, Zap } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState, useMemo } from "react"

interface Phone {
  id: string
  name: string
  brand: string
  price: string
  originalPrice?: string
  features: string[]
  storage: string[]
  colors: string[]
  rating: number
  isNew?: boolean
  isBestSeller?: boolean
  priceValue: number
}

interface WhyChooseFeature {
  title: string
  description: string
}

interface SelectedOptions {
  [phoneId: string]: {
    storage: string
    color: string
  }
}

export default function MobilePhonesPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const t = useTranslations()

  const pageData = t.raw("pages.mobilePhones")

  // State for filtering and sorting
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [sortOption, setSortOption] = useState<string>("popular")
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({})

  // Add price values to phones for sorting
  const phonesWithPriceValues = useMemo(() => {
    return pageData.products.map((phone: Phone) => ({
      ...phone,
      priceValue: parseInt(phone.price.replace(/[€$,]/g, "")),
    }))
  }, [pageData.products])

  // Extract unique brands from phones and ensure type safety
  const brands = Array.from(new Set(pageData.products.map((phone: Phone) => phone.brand))) as string[]

  // Filter and sort phones
  const filteredAndSortedPhones = useMemo(() => {
    let filtered = phonesWithPriceValues

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter(phone => phone.brand === selectedBrand)
    }

    // Sort phones
    switch (sortOption) {
      case "priceLowHigh":
        return filtered.sort((a, b) => a.priceValue - b.priceValue)
      case "priceHighLow":
        return filtered.sort((a, b) => b.priceValue - a.priceValue)
      case "rating":
        return filtered.sort((a, b) => b.rating - a.rating)
      case "popular":
      default:
        return filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
    }
  }, [phonesWithPriceValues, selectedBrand, sortOption])

  // Selection handlers
  const handleStorageSelect = (phoneId: string, storage: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [phoneId]: {
        ...prev[phoneId],
        storage,
        color: prev[phoneId]?.color || "",
      },
    }))
  }

  const handleColorSelect = (phoneId: string, color: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [phoneId]: {
        ...prev[phoneId],
        color,
        storage: prev[phoneId]?.storage || "",
      },
    }))
  }

  const getSelectedStorage = (phoneId: string) => {
    return selectedOptions[phoneId]?.storage || ""
  }

  const getSelectedColor = (phoneId: string) => {
    return selectedOptions[phoneId]?.color || ""
  }

  // Color swatch mapping
  const getColorSwatch = (colorName: string) => {
    const swatches: Record<string, string> = {
      black: "#000000",
      white: "#ffffff",
      silver: "#c0c0c0",
      gold: "#ffd700",
      blue: "#0070f3",
      green: "#00d084",
      purple: "#7c3aed",
      red: "#dc2626",
      pink: "#ec4899",
      gray: "#6b7280",
      grey: "#6b7280",
      "space gray": "#4b5563",
      midnight: "#1f2937",
      starlight: "#f8fafc",
      "sierra blue": "#6366f1",
      "alpine green": "#059669",
      graphite: "#374151",
      "natural titanium": "#C5B8A5",
      "blue titanium": "#5A6B7C",
      "white titanium": "#F5F5F5",
      "black titanium": "#2C2C2C",
      "phantom black": "#1A1A1A",
      cream: "#F5F2E8",
      violet: "#8B5A9F",
      obsidian: "#2F2F2F",
      snow: "#FFFFFF",
      bay: "#7FB5D3",
      hazel: "#D2B48C",
      porcelain: "#F8F8FF",
      yellow: "#FFC107",
      // Italian colors
      nero: "#000000",
      bianco: "#ffffff",
      argento: "#c0c0c0",
      oro: "#ffd700",
      blu: "#0070f3",
      verde: "#00d084",
      viola: "#8B5A9F",
      rosso: "#dc2626",
      rosa: "#ec4899",
      grigio: "#6b7280",
      "titanio naturale": "#C5B8A5",
      "titanio blu": "#5A6B7C",
      "titanio bianco": "#F5F5F5",
      "titanio nero": "#2C2C2C",
      "nero phantom": "#1A1A1A",
      crema: "#F5F2E8",
      ossidiana: "#2F2F2F",
      neve: "#FFFFFF",
      baia: "#7FB5D3",
      nocciola: "#D2B48C",
      porcellana: "#F8F8FF",
      giallo: "#FFC107",
      "titanio grigio": "#8B8B8B",
      "titanio giallo": "#D4AF37",
    }
    return swatches[colorName.toLowerCase()] || "#ccc"
  }

  usePageMeta({
    title: pageData.meta.title,
    description: pageData.meta.description,
  })

  return (
    <main className="min-h-screen">
      {isCDPTrackingEnabled && <CdpPageEvent eventName="mobile-phones-page-viewed" />}

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
              {pageData.hero.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">{pageData.hero.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {pageData.hero.badges.map((badge: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
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
                Rating
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
                <div className="relative overflow-hidden">
                  <Image
                    src={`https://images.unsplash.com/photo-${
                      phone.id === "iphone-17-pro"
                        ? "1592750475338-74b7b21085ab"
                        : phone.id === "iphone-17"
                        ? "1511707171634-5f897ff02aa9"
                        : phone.id === "iphone-17-pro-max"
                        ? "1574944985070-8f3ebc6b79d2"
                        : phone.id === "samsung-galaxy-s25"
                        ? "1610945265064-0e34e5519bbf"
                        : phone.id === "samsung-galaxy-s25-plus"
                        ? "1567581935884-3349723552ca"
                        : phone.id === "samsung-galaxy-s25-ultra"
                        ? "1605236453806-6ff36851218e"
                        : phone.id === "google-pixel-10"
                        ? "1605236453806-6ff36851218e"
                        : phone.id === "google-pixel-10-pro"
                        ? "1574944985070-8f3ebc6b79d2"
                        : phone.id === "google-pixel-10-fold"
                        ? "1511707171634-5f897ff02aa9"
                        : "1592750475338-74b7b21085ab"
                    }?q=80&w=400`}
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

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{phone.name}</CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">{phone.brand}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold brand-gradient-text">{phone.price}</div>
                      {phone.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">{phone.originalPrice}</div>
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

                  {/* Storage Options */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{pageData.labels.storage}</h4>
                    <div className="flex flex-wrap gap-1">
                      {phone.storage.map((storage: string, index: number) => (
                        <Button
                          key={index}
                          variant={getSelectedStorage(phone.id) === storage ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStorageSelect(phone.id, storage)}
                          className={`text-xs ${
                            getSelectedStorage(phone.id) === storage ? "brand-bg-primary text-white" : ""
                          }`}>
                          {storage}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2">{pageData.labels.colors}</h4>
                    <div className="flex flex-wrap gap-2">
                      {phone.colors.slice(0, 3).map((color: string, index: number) => {
                        const isSelected = getSelectedColor(phone.id) === color
                        const swatchColor = getColorSwatch(color)

                        return (
                          <button
                            key={index}
                            onClick={() => handleColorSelect(phone.id, color)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all duration-200 min-w-[120px] ${
                              isSelected
                                ? "border-primary bg-primary/10 text-primary font-medium shadow-md"
                                : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                            }`}>
                            <div
                              className={`w-6 h-6 rounded-full border-2 shadow-sm ${
                                isSelected ? "border-primary" : "border-gray-300"
                              }`}
                              style={{ backgroundColor: swatchColor }}
                            />
                            <span className="flex-1 text-left">{color}</span>
                          </button>
                        )
                      })}
                      {phone.colors.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          {pageData.labels.moreColors.replace("{count}", (phone.colors.length - 3).toString())}
                        </Badge>
                      )}
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
                    <Button className="flex-1 brand-bg-primary hover:brand-bg-secondary transition-colors shadow-lg">
                      <Smartphone className="h-4 w-4 mr-2" />
                      {pageData.labels.buyNow}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="brand-border-accent hover:brand-bg-accent hover:text-white transition-colors">
                      <Camera className="h-4 w-4" />
                    </Button>
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
