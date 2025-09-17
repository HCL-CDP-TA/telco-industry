"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, Download, Upload, Tv, Gamepad2, Laptop, Check, Clock } from "lucide-react"

interface BroadbandPlan {
  id: string
  name: string
  speed: string
  uploadSpeed: string
  price: string
  originalPrice?: string
  features: string[]
  idealFor: string[]
  installation: string
  equipment: string[]
  contract: string
  isPopular?: boolean
  isFiber?: boolean
  discount?: string
}

export default function BroadbandPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()

  usePageMeta(
    "Broadband Internet - " + brand.label,
    "Superfast fiber broadband with unlimited data, reliable speeds, and professional installation.",
  )

  const broadbandPlans: BroadbandPlan[] = [
    {
      id: "superfast-200",
      name: "Superfast 200",
      speed: "200 Mbps",
      uploadSpeed: "25 Mbps",
      price: "$65",
      originalPrice: "$75",
      features: [
        "Unlimited data usage",
        "Wi-Fi 6 router included",
        "24/7 technical support",
        "Security suite included",
        "Professional installation",
        "Speed guarantee",
      ],
      idealFor: [
        "Small households (1-2 people)",
        "Basic streaming (HD)",
        "Video calls",
        "Social media",
        "Email and browsing",
      ],
      installation: "Free professional installation",
      equipment: ["Wi-Fi 6 Router", "Ethernet cables", "Setup guide"],
      contract: "12-month contract",
      discount: "Save $10/month for first year",
    },
    {
      id: "ultrafast-500",
      name: "Ultrafast 500",
      speed: "500 Mbps",
      uploadSpeed: "50 Mbps",
      price: "$85",
      originalPrice: "$95",
      features: [
        "Unlimited data usage",
        "Premium Wi-Fi 6E router",
        "Priority customer support",
        "Advanced security suite",
        "Professional installation",
        "Speed guarantee",
        "Mesh network support",
        "Parental controls",
      ],
      idealFor: [
        "Medium households (3-4 people)",
        "4K streaming on multiple devices",
        "Online gaming",
        "Video conferencing",
        "Remote work",
        "Smart home devices",
      ],
      installation: "Free professional installation + setup",
      equipment: ["Premium Wi-Fi 6E Router", "Mesh extender", "Ethernet cables", "Setup guide"],
      contract: "24-month contract",
      isPopular: true,
      isFiber: true,
      discount: "Save $10/month for first year",
    },
    {
      id: "gigafast-1000",
      name: "Gigafast 1000",
      speed: "1000 Mbps",
      uploadSpeed: "100 Mbps",
      price: "$120",
      originalPrice: "$140",
      features: [
        "Unlimited data usage",
        "Ultra-premium Wi-Fi 7 router",
        "White-glove installation",
        "Premium security suite",
        "Priority technical support",
        "Speed guarantee",
        "Whole-home mesh network",
        "Advanced parental controls",
        "Gaming optimization",
        "Business-grade reliability",
      ],
      idealFor: [
        "Large households (5+ people)",
        "8K streaming",
        "Professional gaming",
        "Content creation",
        "Multiple remote workers",
        "Smart home automation",
        "Home office/business use",
      ],
      installation: "Free white-glove installation + optimization",
      equipment: ["Wi-Fi 7 Router", "Mesh system (3 nodes)", "Gaming ethernet cables", "Setup & optimization"],
      contract: "24-month contract",
      isFiber: true,
      discount: "Save $20/month for first year",
    },
    {
      id: "business-fiber",
      name: "Business Fiber",
      speed: "500 Mbps",
      uploadSpeed: "500 Mbps",
      price: "$150",
      features: [
        "Symmetric upload/download speeds",
        "99.9% uptime SLA",
        "Business-grade router",
        "Dedicated business support",
        "Static IP addresses (5 included)",
        "Priority installation",
        "24/7 monitoring",
        "Advanced firewall",
        "VPN support",
        "Scalable bandwidth",
      ],
      idealFor: [
        "Small/medium businesses",
        "Video conferencing",
        "Cloud applications",
        "File sharing",
        "Remote teams",
        "E-commerce sites",
      ],
      installation: "Priority business installation",
      equipment: ["Business Router", "Firewall", "Ethernet switches", "Professional setup"],
      contract: "36-month contract",
      isFiber: true,
    },
    {
      id: "student-essential",
      name: "Student Essential",
      speed: "100 Mbps",
      uploadSpeed: "15 Mbps",
      price: "$45",
      features: [
        "Unlimited data usage",
        "Basic Wi-Fi router",
        "Online support",
        "Student discount pricing",
        "Flexible 9-month contract",
        "Easy self-installation",
      ],
      idealFor: ["Students", "Budget-conscious users", "Basic streaming", "Online learning", "Light gaming"],
      installation: "Self-installation kit",
      equipment: ["Basic Wi-Fi Router", "Installation kit", "Setup guide"],
      contract: "9-month flexible contract",
      discount: "Student pricing - proof of enrollment required",
    },
  ]

  const addOns = [
    {
      name: "Mesh Network Upgrade",
      price: "$15/month",
      description: "Extend coverage throughout your home",
      icon: Wifi,
    },
    { name: "Gaming Accelerator", price: "$10/month", description: "Optimize connection for gaming", icon: Gamepad2 },
    { name: "Premium Security", price: "$12/month", description: "Advanced threat protection", icon: Check },
    { name: "Tech Support Plus", price: "$8/month", description: "24/7 premium technical support", icon: Clock },
  ]

  const speedGuide = [
    { activity: "Email & Browsing", speed: "5-10 Mbps", icon: Laptop },
    { activity: "HD Video Streaming", speed: "25 Mbps", icon: Tv },
    { activity: "4K Video Streaming", speed: "25+ Mbps", icon: Tv },
    { activity: "Online Gaming", speed: "50+ Mbps", icon: Gamepad2 },
    { activity: "Video Conferencing", speed: "10-25 Mbps", icon: Laptop },
    { activity: "Large File Downloads", speed: "100+ Mbps", icon: Download },
  ]

  return (
    <main className="min-h-screen bg-background">
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName="Broadband"
          pageProperties={{ brand: brand.label, locale: locale.code, category: "broadband" }}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Superfast Fiber Broadband</h1>
            <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience blazing-fast internet speeds with unlimited data, reliable connectivity, and professional
              installation
            </p>
          </div>
        </div>
      </section>

      {/* Speed Guide */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">How Much Speed Do You Need?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speedGuide.map((item, index) => (
              <div key={index} className="flex items-center gap-3 bg-background p-4 rounded-lg">
                <item.icon className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <span className="font-medium">{item.activity}</span>
                </div>
                <Badge variant="outline">{item.speed}</Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Broadband Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Choose Your Perfect Plan</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {broadbandPlans.map(plan => (
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
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    {plan.isFiber && (
                      <Badge variant="secondary" className="text-xs">
                        Fiber
                      </Badge>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{plan.speed}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Download
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-muted-foreground">{plan.uploadSpeed}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Upload className="h-3 w-3" />
                          Upload
                        </div>
                      </div>
                    </div>

                    <div className="text-4xl font-bold text-primary">{plan.price}</div>
                    <div className="text-sm text-muted-foreground">per month</div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">was {plan.originalPrice}</div>
                    )}
                    {plan.discount && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {plan.discount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Plan Features */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      What&apos;s Included
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

                  {/* Ideal For */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Perfect For</h4>
                    <ul className="space-y-1">
                      {plan.idealFor.map((use, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          • {use}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Installation & Equipment */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium">Installation: </span>
                      <span className="text-muted-foreground">{plan.installation}</span>
                    </div>
                    <div>
                      <span className="font-medium">Contract: </span>
                      <span className="text-muted-foreground">{plan.contract}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className={`w-full ${plan.isPopular ? "bg-primary hover:bg-primary/90" : ""}`}>
                    <Wifi className="h-4 w-4 mr-2" />
                    Choose {plan.name}
                  </Button>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Enhance Your Internet</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Add premium features to optimize your broadband experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow text-center">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <addon.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-lg font-bold text-primary">{addon.price}</div>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Why Choose {brand.label} Broadband?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fiber Network</h3>
              <p className="text-muted-foreground text-sm">
                Ultra-reliable fiber optic technology for consistent speeds
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Data Limits</h3>
              <p className="text-muted-foreground text-sm">Unlimited usage with no fair usage policies or throttling</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground text-sm">Round-the-clock technical support and customer service</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Download className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Speed Guarantee</h3>
              <p className="text-muted-foreground text-sm">
                Money-back guarantee if you don&apos;t get advertised speeds
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
