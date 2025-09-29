"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import AddToCartButton from "@/components/AddToCartButton"
import { Smartphone, Wifi, Package, Users, Calculator, Check, Star, Gift } from "lucide-react"
import { formatPriceData } from "@/lib/priceFormatting"

interface Bundle {
  id: string
  name: string
  description: string
  mobile: {
    plan: string
    data: string
    price: string
  }
  broadband: {
    speed: string
    price: string
  }
  totalPrice: string
  originalPrice: string
  savings: string
  features: string[]
  idealFor: string[]
  contract: string
  isPopular?: boolean
  freeExtras?: string[]
}

export default function BundlesPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()

  usePageMeta(
    "Bundle Deals - " + brand.label,
    "Save money with our mobile and broadband bundle packages. Get the best value for your family and business.",
  )

  const bundles: Bundle[] = [
    {
      id: "essential-bundle",
      name: "Essential Bundle",
      description: "Perfect starter package for small households",
      mobile: {
        plan: "Unlimited Essential",
        data: "Unlimited",
        price: "$35",
      },
      broadband: {
        speed: "200 Mbps",
        price: "$65",
      },
      totalPrice: "$95",
      originalPrice: "$100",
      savings: "$5",
      features: [
        "Unlimited mobile data",
        "200 Mbps fiber broadband",
        "Wi-Fi 6 router included",
        "24/7 customer support",
        "Professional installation",
        "Single monthly bill",
      ],
      idealFor: [
        "1-2 person households",
        "Basic streaming needs",
        "Social media and browsing",
        "Video calls",
        "Light mobile usage",
      ],
      contract: "12-month contract",
      freeExtras: ["Setup assistance", "Basic security suite"],
    },
    {
      id: "family-bundle",
      name: "Family Bundle",
      description: "Complete solution for busy families",
      mobile: {
        plan: "2x Unlimited Max + 2x Essential",
        data: "Unlimited",
        price: "$140",
      },
      broadband: {
        speed: "500 Mbps",
        price: "$85",
      },
      totalPrice: "$215",
      originalPrice: "$225",
      savings: "$10",
      features: [
        "4 mobile lines included",
        "500 Mbps ultrafast broadband",
        "Premium Wi-Fi 6E router",
        "Parental controls",
        "Family safety features",
        "Shared data allowances",
        "Priority customer support",
        "Mesh network support",
      ],
      idealFor: [
        "Families with 3-5 members",
        "Multiple device households",
        "4K streaming on multiple TVs",
        "Home working parents",
        "Teenagers with high data needs",
      ],
      contract: "24-month contract",
      isPopular: true,
      freeExtras: ["Mesh extender", "Premium security suite", "Parental control app"],
    },
    {
      id: "premium-bundle",
      name: "Premium Bundle",
      description: "Ultimate connectivity for large households",
      mobile: {
        plan: "3x Unlimited Max + 2x Business",
        data: "Unlimited",
        price: "$200",
      },
      broadband: {
        speed: "1000 Mbps",
        price: "$120",
      },
      totalPrice: "$275",
      originalPrice: "$320",
      savings: "$45",
      features: [
        "5 premium mobile lines",
        "Gigabit fiber broadband",
        "Ultra-premium Wi-Fi 7 router",
        "Whole-home mesh network",
        "Gaming optimization",
        "Business-grade features",
        "White-glove installation",
        "Priority tech support",
      ],
      idealFor: [
        "Large families (5+ members)",
        "Heavy data users",
        "Content creators",
        "Professional gamers",
        "Home offices/remote workers",
        "Smart home enthusiasts",
      ],
      contract: "24-month contract",
      freeExtras: ["Gaming router upgrade", "Smart home setup", "Premium tech support"],
    },
    {
      id: "business-bundle",
      name: "Business Bundle",
      description: "Professional solution for small businesses",
      mobile: {
        plan: "5x Business Lines",
        data: "Unlimited",
        price: "$250",
      },
      broadband: {
        speed: "500/500 Mbps",
        price: "$150",
      },
      totalPrice: "$350",
      originalPrice: "$400",
      savings: "$50",
      features: [
        "5 business mobile lines",
        "Symmetric fiber connection",
        "99.9% uptime SLA",
        "Business-grade security",
        "Static IP addresses",
        "VPN support",
        "Dedicated account manager",
        "24/7 business support",
      ],
      idealFor: [
        "Small businesses",
        "Remote teams",
        "Professional services",
        "E-commerce businesses",
        "Video conferencing needs",
        "Cloud-based operations",
      ],
      contract: "36-month contract",
      freeExtras: ["Business router", "Firewall setup", "Cloud backup service"],
    },
    {
      id: "student-bundle",
      name: "Student Bundle",
      description: "Affordable package for students",
      mobile: {
        plan: "Essential Student",
        data: "30GB",
        price: "$25",
      },
      broadband: {
        speed: "100 Mbps",
        price: "$45",
      },
      totalPrice: "$65",
      originalPrice: "$70",
      savings: "$5",
      features: [
        "30GB mobile data",
        "100 Mbps broadband",
        "Student discount pricing",
        "Flexible contract terms",
        "Self-installation option",
        "Online support",
      ],
      idealFor: [
        "University students",
        "Shared accommodations",
        "Budget-conscious users",
        "Online learning",
        "Basic connectivity needs",
      ],
      contract: "9-month flexible contract",
      freeExtras: ["Student verification", "Setup guide"],
    },
  ]

  const bundleComparison = [
    { feature: "Mobile Lines", essential: "1", family: "4", premium: "5", business: "5", student: "1" },
    {
      feature: "Mobile Data",
      essential: "Unlimited",
      family: "Unlimited",
      premium: "Unlimited",
      business: "Unlimited",
      student: "30GB",
    },
    {
      feature: "Broadband Speed",
      essential: "200 Mbps",
      family: "500 Mbps",
      premium: "1000 Mbps",
      business: "500/500 Mbps",
      student: "100 Mbps",
    },
    {
      feature: "Router Type",
      essential: "Wi-Fi 6",
      family: "Wi-Fi 6E",
      premium: "Wi-Fi 7",
      business: "Business",
      student: "Basic",
    },
    {
      feature: "Installation",
      essential: "Professional",
      family: "Professional",
      premium: "White-glove",
      business: "Priority",
      student: "Self-install",
    },
    {
      feature: "Support Level",
      essential: "Standard",
      family: "Priority",
      premium: "Premium",
      business: "Business",
      student: "Online",
    },
  ]

  const addOnServices = [
    {
      name: "International Calling",
      price: "$15/month",
      description: "Unlimited calls to 50+ countries",
      icon: Smartphone,
    },
    { name: "Device Insurance", price: "$12/month", description: "Protect all your devices", icon: Package },
    { name: "Cloud Storage", price: "$10/month", description: "1TB cloud storage for the family", icon: Package },
    { name: "Entertainment Pack", price: "$20/month", description: "Premium streaming services included", icon: Star },
  ]

  return (
    <main className="min-h-screen bg-background">
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName="Bundles"
          pageProperties={{ brand: brand.label, locale: locale.code, category: "bundles" }}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Bundle Deals & Packages</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Save money by combining mobile and broadband services. Get everything you need with one simple bill.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Calculator className="h-5 w-5" />
                Save up to $50/month
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Gift className="h-5 w-5" />
                Free installation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bundle Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Choose Your Perfect Bundle</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {bundles.map(bundle => (
              <Card
                key={bundle.id}
                className={`relative hover:shadow-lg transition-shadow duration-300 ${
                  bundle.isPopular ? "ring-2 ring-primary" : ""
                }`}>
                {bundle.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl mb-2">{bundle.name}</CardTitle>
                  <CardDescription className="text-base">{bundle.description}</CardDescription>

                  <div className="space-y-4 mt-4">
                    {/* Mobile Component */}
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Smartphone className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Mobile</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>{bundle.mobile.plan}</div>
                        <div className="text-muted-foreground">{bundle.mobile.data} data</div>
                        <div className="font-semibold">
                          {formatPriceData({ price: bundle.mobile.price }, locale.code, brand.key).price}/month
                        </div>
                      </div>
                    </div>

                    {/* Broadband Component */}
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span className="font-medium text-sm">Broadband</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>{bundle.broadband.speed} speed</div>
                        <div className="text-muted-foreground">Unlimited usage</div>
                        <div className="font-semibold">
                          {formatPriceData({ price: bundle.broadband.price }, locale.code, brand.key).price}/month
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div className="text-center pt-2 border-t border-muted">
                      <div className="text-3xl font-bold text-primary">
                        {formatPriceData({ price: bundle.totalPrice }, locale.code, brand.key).price}
                      </div>
                      <div className="text-sm text-muted-foreground">per month</div>
                      <div className="text-sm text-muted-foreground line-through">
                        was {formatPriceData({ price: bundle.originalPrice }, locale.code, brand.key).price}
                      </div>
                      <Badge variant="secondary" className="mt-2">
                        Save {formatPriceData({ price: bundle.savings }, locale.code, brand.key).price}/month
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Bundle Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      What&apos;s Included
                    </h4>
                    <ul className="space-y-2">
                      {bundle.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Ideal For */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Perfect For
                    </h4>
                    <ul className="space-y-1">
                      {bundle.idealFor.map((use, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {use}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Free Extras */}
                  {bundle.freeExtras && (
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Gift className="h-4 w-4 text-primary" />
                        Free Extras
                      </h4>
                      <ul className="space-y-1">
                        {bundle.freeExtras.map((extra, index) => (
                          <li key={index} className="text-sm text-muted-foreground">
                            • {extra}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Contract Info */}
                  <div className="text-sm">
                    <span className="font-medium">Contract: </span>
                    <span className="text-muted-foreground">{bundle.contract}</span>
                  </div>

                  {/* Action Button */}
                  <AddToCartButton
                    item={{
                      id: bundle.id,
                      type: "bundle",
                      name: bundle.name,
                      price: bundle.totalPrice,
                      originalPrice: bundle.originalPrice,
                      priceValue: parseInt(bundle.totalPrice.replace(/[$€,]/g, "")),
                      features: bundle.features,
                      bundleComponents: [
                        `${bundle.mobile.plan} Mobile Plan (${bundle.mobile.data})`,
                        `${bundle.broadband.speed} Broadband`,
                      ],
                      isNew: false,
                      isBestSeller: bundle.isPopular || false,
                      pageUrl: `/bundles`,
                    }}
                    className="w-full">
                    Choose {bundle.name}
                  </AddToCartButton>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Compare All Bundles</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-background rounded-lg overflow-hidden shadow-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-center font-semibold">Essential</th>
                  <th className="px-6 py-4 text-center font-semibold">Family</th>
                  <th className="px-6 py-4 text-center font-semibold">Premium</th>
                  <th className="px-6 py-4 text-center font-semibold">Business</th>
                  <th className="px-6 py-4 text-center font-semibold">Student</th>
                </tr>
              </thead>
              <tbody>
                {bundleComparison.map((row, index) => (
                  <tr key={index} className="border-t border-muted">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.essential}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.family}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.premium}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.business}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{row.student}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-on Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Additional Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">Enhance your bundle with premium add-on services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOnServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{service.name}</CardTitle>
                  <div className="text-lg font-bold text-primary">{service.price}</div>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    Add to Bundle
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Bundle Section */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Choose {brand.label} Bundles?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Save Money</h3>
              <p className="text-muted-foreground text-sm">Get better value by bundling services together</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">One Bill</h3>
              <p className="text-muted-foreground text-sm">Simplify your life with a single monthly payment</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Family Friendly</h3>
              <p className="text-muted-foreground text-sm">Plans designed for households of all sizes</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Hassle</h3>
              <p className="text-muted-foreground text-sm">One provider for all your connectivity needs</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
