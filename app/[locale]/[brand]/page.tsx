"use client"
import { useTranslations } from "next-intl"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

interface Deal {
  title: string
  description: string
  imageUrl: string
  link: string
  badge: string
}

interface PromotionalBanner {
  title: string
  subtitle: string
  description: string
  price: string
  originalPrice: string
  cta: string
  imageUrl: string
  link: string
}

interface UspSection {
  tagline: string
  usps: string[]
}

export default function HomePage() {
  const { brand, locale } = useSiteContext()
  const tHome = useTranslations("home")
  const { isCDPTrackingEnabled } = useCDPTracking()

  usePageMeta(tHome("meta.title"), tHome("meta.description"))

  // Get promotional banner, USPs, and deals from translations
  const promotionalBanner: PromotionalBanner = tHome.raw("promotionalBanner") as PromotionalBanner
  const uspSection: UspSection = tHome.raw("uspSection") as UspSection
  const deals: Deal[] = tHome.raw("currentDeals.deals") as Deal[]

  return (
    <main>
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={tHome("cdp.pageEventName")}
          pageProperties={{ brand: brand.label, locale: locale.code }}
        />
      )}

      {/* Promotional Banner - Replaces Hero */}
      <section className="py-12 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href={`/${locale.code}/${brand.key}${promotionalBanner.link}`}>
            <Card className="overflow-hidden hover:shadow-xl hover:brand-shadow transition-all duration-300 cursor-pointer group border-2 hover:brand-border-accent">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 p-8">
                  <div className="space-y-4">
                    <Badge className="brand-bg-primary text-white text-sm px-3 py-1">{promotionalBanner.title}</Badge>
                    <h1 className="text-3xl lg:text-5xl font-bold tracking-tight text-foreground group-hover:brand-text-primary transition-colors">
                      {promotionalBanner.subtitle}
                    </h1>
                    <p className="text-lg text-muted-foreground">{promotionalBanner.description}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold brand-text-primary">{promotionalBanner.price}</span>
                      <span className="text-xl text-muted-foreground line-through">
                        {promotionalBanner.originalPrice}
                      </span>
                    </div>
                    <Button className="brand-bg-primary hover:brand-bg-secondary text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                      {promotionalBanner.cta}
                    </Button>
                  </div>
                </div>
                <div className="lg:w-1/3 relative h-64 lg:h-auto">
                  <Image
                    src={promotionalBanner.imageUrl}
                    alt={promotionalBanner.subtitle}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="lg:text-4xl md:text-3xl font-bold brand-text-primary mb-6">{uspSection.tagline}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {uspSection.usps.map((usp, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center text-center p-4 rounded-lg bg-background/50 hover:bg-background transition-colors duration-300">
                  <span className="text-sm font-medium text-muted-foreground">{usp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Current Deals & Discounts Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {tHome("currentDeals.title")}
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">{tHome("currentDeals.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {deals.map((deal, index) => (
              <Link key={index} href={`/${locale.code}/${brand.key}${deal.link}`} className="group">
                <Card className="overflow-hidden hover:shadow-lg hover:brand-shadow transition-all duration-300 cursor-pointer border-2 hover:brand-border-accent h-full">
                  <div className="relative h-48">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="brand-bg-primary text-white shadow-lg">{deal.badge}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:brand-text-primary transition-colors">
                      {deal.title}
                    </CardTitle>
                    <CardDescription className="text-base">{deal.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full group-hover:brand-bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                      {tHome("currentDeals.learnMore")}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
