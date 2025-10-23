"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent, useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Wifi, Globe, Zap, Check, X, User } from "lucide-react"
import { useTranslations } from "next-intl"
import { formatPriceData } from "@/lib/priceFormatting"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Label } from "@/components/ui/label"
import LoginModal from "@/components/LoginModal"
import PlanFinder from "@/components/PlanFinder"

export default function MobilePlansPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const { track } = useCdp()
  const router = useRouter()
  const t = useTranslations()

  const pageData = t.raw("pages.mobilePlans")

  usePageMeta(`${pageData.meta.title} - ${brand.label}`, pageData.meta.description)

  // State for customer status selection for checkout
  const [customerStatus, setCustomerStatus] = useState<string>("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Function to check login status
  const checkLoginStatus = useCallback(() => {
    const customerData = JSON.parse(localStorage.getItem(`${brand.key}_customer_data`) || "{}")
    setIsLoggedIn(!!customerData?.loginData?.email)
  }, [brand.key])

  // Check login status on component mount and send Plan_Acquire event
  useEffect(() => {
    checkLoginStatus()

    // Send Plan_Acquire CDP event when page loads
    if (isCDPTrackingEnabled) {
      const planList: MobilePlan[] = pageData.plans || []
      track({
        identifier: "Plan_Acquire",
        properties: {
          brand: brand.label,
          locale: locale.code,
          category: "mobile-plans",
          availablePlans: planList.map((plan: MobilePlan) => plan.id),
          planCount: planList.length,
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Listen for login/logout events
    const handleLoginChange = () => {
      checkLoginStatus()
    }

    window.addEventListener("user-login-changed", handleLoginChange)
    return () => {
      window.removeEventListener("user-login-changed", handleLoginChange)
    }
  }, [checkLoginStatus, isCDPTrackingEnabled, track, brand.label, locale.code, pageData.plans])

  // Update customer status based on login state
  useEffect(() => {
    if (isLoggedIn) {
      setCustomerStatus("existing")
    } else {
      setCustomerStatus("")
    }
  }, [isLoggedIn])

  const handleLoginSuccess = () => {
    setCustomerStatus("existing")

    // Send Plan_Interest CDP event for existing customer login
    if (isCDPTrackingEnabled) {
      track({
        identifier: "Plan_Interest",
        properties: {
          brand: brand.label,
          locale: locale.code,
          customerType: "existing",
          timestamp: new Date().toISOString(),
        },
      })
    }
    // checkLoginStatus will be called automatically via event listener
  }

  // Handle customer status selection and CDP tracking
  const handleCustomerStatusChange = async (status: string) => {
    setCustomerStatus(status)

    // Send Plan_Interest CDP event
    if (isCDPTrackingEnabled) {
      await track({
        identifier: "Plan_Interest",
        properties: {
          brand: brand.label,
          locale: locale.code,
          customerType: status,
          timestamp: new Date().toISOString(),
        },
      })
    }
  }

  // Handle direct checkout for mobile plans
  const handleBuyNow = async (plan: MobilePlan) => {
    if (!customerStatus) {
      alert("Please select whether you are a new or existing customer")
      return
    }

    // Send Plan_Intent CDP event when user selects a plan
    if (isCDPTrackingEnabled) {
      await track({
        identifier: "Plan_Intent",
        properties: {
          brand: brand.label,
          locale: locale.code,
          selectedPlan: {
            id: plan.id,
            name: plan.name,
            price: plan.price,
            originalPrice: plan.originalPrice,
            data: plan.data,
            minutes: plan.minutes || "N/A",
            texts: plan.texts || "N/A",
            network: plan.network || plan.speed || "Standard",
            features: plan.features || [],
            restrictions: plan.restrictions || [],
            isPopular: plan.isPopular || false,
            isUnlimited: plan.isUnlimited || false,
            discount: plan.discount,
          },
          customerType: customerStatus,
          timestamp: new Date().toISOString(),
        },
      })
    }

    // Structure the data to be compatible with the checkout page
    const checkoutData = {
      type: "mobile-plan",
      product: {
        id: plan.id,
        name: plan.name,
        brand: brand.label,
        price: plan.price,
        imageUrl: null, // Plans use icons instead of images
        icon: "Smartphone", // Icon identifier for plans
        features: plan.features || [],
        storage: [], // Not applicable for plans
        colors: [], // Not applicable for plans
        rating: 5, // Default rating for plans
      },
      configuration: {
        storage: "N/A", // Not applicable for plans
        color: "N/A", // Not applicable for plans
        paymentPeriod: "monthly",
        customerStatus,
        hasTradeIn: false,
        tradeInValue: 0,
        simType: "physical", // Default
        accessories: [], // Empty array for mobile plans
        selectedPlan: {
          id: plan.id,
          name: plan.name,
          dataAllowance: plan.data,
          minutes: plan.minutes || "N/A",
          texts: plan.texts || "N/A",
          monthlyPrice: parseInt(plan.price.replace(/[$€,]/g, "")),
          features: plan.features || [],
          speed: plan.network || plan.speed || "Standard",
        },
      },
      pricing: {
        deviceUpfront: 0,
        deviceMonthly: 0,
        planMonthly: parseInt(plan.price.replace(/[$€,]/g, "")),
        accessoriesUpfront: 0,
        tradeInUpfrontDiscount: 0,
        total: {
          upfront: 0,
          monthly: parseInt(plan.price.replace(/[$€,]/g, "")),
        },
      },
    }

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    router.push(`/${locale.code}/${brand.key}/checkout`)
  }

  interface MobilePlan {
    id: string
    name: string
    price: string
    originalPrice?: string
    data: string
    minutes?: string
    texts?: string
    features?: string[]
    restrictions?: string[]
    network?: string
    speed?: string // For Italian locale compatibility
    isPopular?: boolean
    isUnlimited?: boolean
    discount?: string
  }

  // State for plan highlighting
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null)

  // Get plans from language file
  const plans: MobilePlan[] = pageData.plans

  const handlePlanRecommendation = (recommendedPlan: MobilePlan | null) => {
    setHighlightedPlan(recommendedPlan?.id || null)
  }

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
          {/* Plan Finder */}
          <PlanFinder plans={plans} onPlanRecommendation={handlePlanRecommendation} />

          {/* Customer Status Selection */}
          <Card id="customer-status-section" className="mb-8 scroll-mt-4">
            <CardContent className="pt-3">
              <div className="space-y-3">
                <Label className="text-3xl font-bold mb-6 block text-center">{pageData.customerStatus.subtitle}</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={customerStatus === "new" ? "default" : "outline"}
                    onClick={() => handleCustomerStatusChange("new")}
                    className="h-auto py-6 flex flex-col items-center gap-3">
                    <User className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-medium text-base">{pageData.customerStatus.newCustomer.title}</div>
                      <div className="text-md text-muted-foreground">
                        {pageData.customerStatus.newCustomer.subtitle}
                      </div>
                    </div>
                  </Button>
                  {isLoggedIn ? (
                    <Button
                      variant={customerStatus === "existing" ? "default" : "outline"}
                      onClick={() => handleCustomerStatusChange("existing")}
                      className="h-auto py-6 flex flex-col items-center gap-3">
                      <User className="w-6 h-6" />
                      <div className="text-center">
                        <div className="font-medium text-base">{pageData.customerStatus.existingCustomer.title}</div>
                        <div className="text-md text-muted-foreground">
                          {pageData.customerStatus.existingCustomer.subtitle}
                        </div>
                      </div>
                    </Button>
                  ) : (
                    <LoginModal onLogin={handleLoginSuccess}>
                      <Button
                        variant={customerStatus === "existing" ? "default" : "outline"}
                        className="h-auto py-6 flex flex-col items-center gap-3">
                        <User className="w-6 h-6" />
                        <div className="text-center">
                          <div className="font-medium text-base">{pageData.customerStatus.existingCustomer.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {pageData.customerStatus.existingCustomer.loginPrompt}
                          </div>
                        </div>
                      </Button>
                    </LoginModal>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div id="mobile-plans-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 scroll-mt-8">
            {plans.map(plan => (
              <Card
                key={plan.id}
                className={`relative hover:shadow-lg transition-all duration-300 ${
                  plan.isPopular ? "ring-2 ring-primary" : ""
                } ${highlightedPlan === plan.id ? "ring-2 ring-green-500 bg-green-50/50 shadow-lg scale-105" : ""}`}>
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">Most Popular</Badge>
                  </div>
                )}

                {highlightedPlan === plan.id && (
                  <div className="absolute -top-3 right-1/2 transform translate-x-1/2">
                    <Badge className="bg-green-500 text-white px-4 py-1">Recommended for You</Badge>
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
                      <strong>{plan.minutes || "N/A"}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Text</span>
                      <strong>{plan.texts || "N/A"}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network</span>
                      <span className="flex items-center gap-1">
                        <Wifi className="h-4 w-4 text-primary" />
                        <strong>{plan.network || plan.speed || "N/A"}</strong>
                      </span>
                    </div>
                  </div>

                  <hr />

                  {/* Plan Features */}
                  {plan.features && plan.features.length > 0 && (
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
                  )}

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
                  <Button onClick={() => handleBuyNow(plan)} className="w-full" disabled={!customerStatus}>
                    {customerStatus
                      ? pageData.labels.choosePlan.replace("{planName}", plan.name)
                      : pageData.labels.selectCustomerStatus}
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
