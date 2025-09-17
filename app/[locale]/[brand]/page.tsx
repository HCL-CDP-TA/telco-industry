"use client"
import { useTranslations } from "next-intl"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import Hero from "@/components/Hero"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Smartphone, Phone, Wifi, Package } from "lucide-react"

interface ProductItem {
  name: string
  description: string
  price: string
  savings?: string
}

interface ProductCategory {
  title: string
  description: string
  items: ProductItem[]
}

export default function HomePage() {
  const { brand, locale } = useSiteContext()
  const tHome = useTranslations("home")
  const { isCDPTrackingEnabled } = useCDPTracking()
  const router = useRouter()

  usePageMeta(tHome("meta.title"), tHome("meta.description"))

  // Navigation function for product category buttons
  const navigateToCategory = (categoryKey: string) => {
    const categoryRoutes: Record<string, string> = {
      mobilePhones: "mobile-phones",
      mobilePlans: "mobile-plans",
      broadband: "broadband",
      bundles: "bundles",
    }

    const route = categoryRoutes[categoryKey]
    if (route) {
      router.push(`/${locale.code}/${brand.key}/${route}`)
    }
  }

  // Get product categories from translations
  const getProductCategories = (): Record<string, ProductCategory> => {
    try {
      return {
        mobilePhones: tHome.raw("productCategories.mobilePhones") as ProductCategory,
        mobilePlans: tHome.raw("productCategories.mobilePlans") as ProductCategory,
        broadband: tHome.raw("productCategories.broadband") as ProductCategory,
        bundles: tHome.raw("productCategories.bundles") as ProductCategory,
      }
    } catch {
      return {}
    }
  }

  const productCategories = getProductCategories()

  // Get appropriate icon for each category
  const getCategoryIcon = (categoryKey: string) => {
    const iconMap = {
      mobilePhones: Smartphone,
      mobilePlans: Phone,
      broadband: Wifi,
      bundles: Package,
    }
    return iconMap[categoryKey as keyof typeof iconMap] || Package
  }

  return (
    <main>
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={tHome("cdp.pageEventName")}
          pageProperties={{ brand: brand.label, locale: locale.code }}
        />
      )}

      {/* Hero Section */}
      <Hero
        title={tHome("hero.title")}
        subTitle={tHome("hero.subtitle")}
        cta={tHome("hero.cta")}
        imageUrl="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2340&auto=format&fit=crop"
      />

      {/* Product Categories Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Our Products & Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Discover our complete range of mobile and broadband solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(productCategories).map(([key, category]) => {
              const IconComponent = getCategoryIcon(key)
              return (
                <Card
                  key={key}
                  className="hover:shadow-lg hover:brand-shadow transition-all duration-300 group border-2 hover:brand-border-accent">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg brand-bg-primary/10 flex items-center justify-center group-hover:brand-bg-primary transition-colors duration-300">
                        <IconComponent className="h-5 w-5 brand-text-primary group-hover:text-white transition-colors duration-300" />
                      </div>
                      <CardTitle className="text-lg group-hover:brand-text-primary transition-colors">
                        {category.title}
                      </CardTitle>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.items?.slice(0, 2).map((item, index) => (
                      <div
                        key={index}
                        className="border-l-4 brand-border-accent pl-4 hover:bg-primary/5 transition-colors rounded-r-md py-2">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold brand-text-primary text-lg">{item.price}</span>
                          {item.savings && (
                            <Badge variant="secondary" className="text-xs brand-bg-accent text-white">
                              {item.savings}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      className="w-full mt-4 cursor-pointer brand-bg-primary hover:brand-bg-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
                      onClick={() => navigateToCategory(key)}>
                      View All {category.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}
