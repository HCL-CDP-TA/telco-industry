"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/AddToCartButton"
import { Smartphone, Wifi, Globe, Zap, Check, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { formatPriceData } from "@/lib/priceFormatting"

export default function MobilePlansPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const t = useTranslations()

  const pageData = t.raw("pages.mobilePlans")

  usePageMeta(`${pageData.meta.title} - ${brand.label}`, pageData.meta.description)

  interface MobilePlan {
    id: string
    name: string
    price: string
    originalPrice?: string
    data: string
    minutes: string
    texts: string
    features: string[]
    restrictions?: string[]
    network: string
    isPopular?: boolean
    isUnlimited?: boolean
    discount?: string
  }

  const plans: MobilePlan[] = [
    {
      id: "essential",
      name: "Essential",
      price: "$35",
      originalPrice: "$45",
      data: "15GB",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "Nationwide 4G/5G coverage",
        "Mobile hotspot (5GB)",
        "HD video streaming",
        "International texting to 200+ countries",
        "Visual voicemail",
      ],
      network: "5G Nationwide",
      discount: "Save $10/month for 12 months",
    },
    {
      id: "unlimited",
      name: "Unlimited",
      price: "$45",
      originalPrice: "$55",
      data: "Unlimited",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "Unlimited premium data",
        "Mobile hotspot (15GB)",
        "4K UHD video streaming",
        "International roaming (Canada/Mexico)",
        "Spam protection",
        "Cloud storage (50GB)",
      ],
      network: "5G Ultra Wideband",
      isPopular: true,
      isUnlimited: true,
      discount: "Save $10/month for 12 months",
    },
    {
      id: "unlimited-max",
      name: "Unlimited Max",
      price: "$55",
      originalPrice: "$65",
      data: "Unlimited",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "Unlimited premium data (no throttling)",
        "Mobile hotspot (50GB)",
        "4K UHD video streaming",
        "International roaming (worldwide)",
        "Premium network access",
        "Cloud storage (200GB)",
        "Apple One or Google One included",
        "Device protection",
        "Premium customer support",
      ],
      network: "5G Ultra Wideband+",
      isUnlimited: true,
      discount: "Save $10/month for 12 months",
    },
    {
      id: "business",
      name: "Business Unlimited",
      price: "$50",
      data: "Unlimited",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "Unlimited business data",
        "Mobile hotspot (25GB)",
        "Business-grade security",
        "Priority network access",
        "International calling (25 countries)",
        "Mobile device management",
        "24/7 business support",
      ],
      restrictions: ["Requires business account", "Minimum 2-line requirement"],
      network: "5G Business Priority",
      isUnlimited: true,
    },
    {
      id: "prepaid-basic",
      name: "Prepaid Basic",
      price: "$25",
      data: "5GB",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "No contract required",
        "Nationwide coverage",
        "Mobile hotspot (no limit on 5GB)",
        "Auto-refill available",
        "International texting (select countries)",
      ],
      restrictions: ["Data speeds reduced after 5GB", "No international roaming"],
      network: "4G LTE",
    },
    {
      id: "family-plan",
      name: "Family Plan (4 lines)",
      price: "$140",
      originalPrice: "$180",
      data: "Unlimited",
      minutes: "Unlimited",
      texts: "Unlimited",
      features: [
        "Unlimited data for all lines",
        "Family safety features",
        "Parental controls",
        "Shared mobile hotspot (100GB)",
        "International roaming included",
        "Multi-device protection",
        "Family cloud storage (1TB)",
      ],
      network: "5G Ultra Wideband",
      isUnlimited: true,
      discount: "Save $40/month vs individual plans",
    },
  ]

  const addOns = [
    { name: "International Calling", price: "$15/month", description: "Unlimited calling to 60+ countries" },
    { name: "Premium Streaming", price: "$10/month", description: "Netflix, Hulu, Disney+ included" },
    { name: "Extra Hotspot Data", price: "$20/month", description: "Additional 50GB mobile hotspot" },
    { name: "Device Protection", price: "$12/month", description: "Insurance and technical support" },
    { name: "Cloud Storage Plus", price: "$8/month", description: "1TB cloud storage upgrade" },
  ]

  return (
    <main className="min-h-screen bg-background">
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={pageData.meta.title}
          pageProperties={{ brand: brand.label, locale: locale.code, category: "mobile-plans" }}
        />
      )}

      {/* Hero Section */}
      <section className="relative brand-gradient py-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl brand-glow">
              {pageData.hero.title}
            </h1>
            <p className="mt-4 text-xl text-white/90 max-w-3xl mx-auto">{pageData.hero.subtitle}</p>
            <div className="mt-6 flex items-center justify-center gap-4">
              {pageData.hero.badges.map((badge: string, index: number) => (
                <div key={index} className="bg-white/20 backdrop-blur rounded-lg px-4 py-2">
                  <span className="text-white font-semibold">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map(plan => (
              <Card
                key={plan.id}
                className={`relative hover:shadow-lg transition-shadow duration-300 ${
                  plan.isPopular ? "ring-2 ring-primary" : ""
                }`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {formatPriceData({ price: plan.price }, locale.code, brand.key).price}
                    </div>
                    <div className="text-sm text-muted-foreground">per month</div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">
                        was {formatPriceData({ price: plan.originalPrice }, locale.code, brand.key).price}
                      </div>
                    )}
                    {plan.discount && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {plan.discount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Core Features */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Data</span>
                      <span className="flex items-center gap-1">
                        {plan.isUnlimited && <Zap className="h-4 w-4 text-primary" />}
                        <strong>{plan.data}</strong>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Talk</span>
                      <strong>{plan.minutes}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Text</span>
                      <strong>{plan.texts}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network</span>
                      <span className="flex items-center gap-1">
                        <Wifi className="h-4 w-4 text-primary" />
                        <strong>{plan.network}</strong>
                      </span>
                    </div>
                  </div>

                  <hr />

                  {/* Plan Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      Included Features
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Restrictions */}
                  {plan.restrictions && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <X className="h-4 w-4 text-orange-500" />
                        Restrictions
                      </h4>
                      <ul className="space-y-2">
                        {plan.restrictions.map((restriction, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <X className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <AddToCartButton
                    item={{
                      id: plan.id,
                      type: "plan",
                      name: plan.name,
                      price: plan.price,
                      originalPrice: plan.originalPrice,
                      priceValue: parseInt(plan.price.replace(/[$€,]/g, "")),
                      data: plan.data,
                      minutes: plan.minutes,
                      texts: plan.texts,
                      features: plan.features,
                      isNew: false,
                      isBestSeller: plan.isPopular || false,
                      pageUrl: `/mobile-plans`,
                    }}
                    className="w-full">
                    Choose {plan.name}
                  </AddToCartButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Enhance Your Plan</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Add premium features to customize your mobile experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{addon.name}</CardTitle>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {formatPriceData({ price: addon.price }, locale.code, brand.key).price}
                      </div>
                    </div>
                  </div>
                  <CardDescription>{addon.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Choose {brand.label} Mobile?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">5G Network</h3>
              <p className="text-muted-foreground text-sm">Ultra-fast 5G speeds with nationwide coverage</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Roaming</h3>
              <p className="text-muted-foreground text-sm">Stay connected worldwide with international plans</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Contracts</h3>
              <p className="text-muted-foreground text-sm">Flexible plans with no long-term commitments</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Premium customer service whenever you need help</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
