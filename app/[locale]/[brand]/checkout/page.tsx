"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent, useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Star, Shield, CreditCard, MapPin, Calendar, Check } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { formatPriceData } from "@/lib/priceFormatting"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import UpsellOffers, { UpsellOffer } from "@/components/UpsellOffers"

interface CustomerInfo {
  firstName: string
  lastName: string
  email: string
  mobile: string
}

interface CheckoutData {
  type?: string
  product: {
    id: string
    name: string
    brand: string
    price: string
    imageUrl?: string // Optional for mobile plans
    icon?: string // Icon identifier for plans
    features: string[]
    storage: string[]
    colors: string[]
    rating: number
  }
  configuration: {
    storage: string
    color: string
    paymentPeriod: string
    customerStatus: string
    hasTradeIn: boolean
    tradeInValue: number
    selectedPlan: {
      id: string
      name: string
      dataAllowance: string
      minutes: string
      texts: string
      monthlyPrice: number
      features: string[]
      speed: string
    } | null
    simType: string
    accessories: Array<{
      id: string
      name: string
      price: number
      category: string
    }>
  }
  pricing: {
    deviceMonthly: number
    deviceUpfront: number
    planMonthly: number
    accessoriesUpfront: number
    tradeInUpfrontDiscount: number
    tradeInMonthlyDiscount: number
    total: {
      monthly: number
      upfront: number
    }
  }
}

export default function CheckoutPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const { track } = useCdp()
  const router = useRouter()
  const t = useTranslations()

  // Get checkout translations
  const checkoutT = t.raw("checkout")

  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  })
  const [customerInfoErrors, setCustomerInfoErrors] = useState<Partial<CustomerInfo>>({})
  const [selectedUpsellOffers, setSelectedUpsellOffers] = useState<UpsellOffer[]>([])

  // Upsell offers configuration
  const upsellOffers: UpsellOffer[] = [
    {
      id: "applecare-plus",
      productName: "AppleCare+",
      headline: "AppleCare+ Protection Plan",
      subheadline: "2 years of coverage with accidental damage protection",
      price: 9.99,
      imageUrl: "/images/applecare.svg",
      paymentType: "monthly",
    },
    {
      id: "premium-case",
      productName: "Premium Protective Case",
      headline: "Premium Protective Case",
      subheadline: "Military-grade drop protection with MagSafe compatibility",
      price: 49,
      imageUrl: "/images/case.svg",
      paymentType: "upfront",
    },
    {
      id: "magsafe-charger",
      productName: "MagSafe Charger",
      headline: "MagSafe Wireless Charger",
      subheadline: "Fast wireless charging with magnetic alignment",
      price: 39,
      imageUrl: "/images/charger.svg",
      paymentType: "upfront",
    },
  ]

  // Check if customer is new (needs to provide information)
  const isNewCustomer =
    checkoutData?.configuration?.customerStatus === "" || checkoutData?.configuration?.customerStatus === "new"

  // Calculate total upsell prices (separated by payment type)
  const upsellMonthlyTotal = selectedUpsellOffers
    .filter(offer => offer.paymentType === "monthly")
    .reduce((sum, offer) => sum + offer.price, 0)

  const upsellUpfrontTotal = selectedUpsellOffers
    .filter(offer => offer.paymentType === "upfront")
    .reduce((sum, offer) => sum + offer.price, 0)

  // Handle upsell offer selection changes
  const handleUpsellSelectionChange = useCallback((offers: UpsellOffer[]) => {
    setSelectedUpsellOffers(offers)
  }, [])

  // Load checkout data from session storage
  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData")
    if (data) {
      setCheckoutData(JSON.parse(data))
    } else {
      // Redirect back if no checkout data
      router.push(`/${locale.code}/${brand.key}/mobile-phones`)
    }
  }, [locale.code, brand.key, router])

  const handleCheckout = async () => {
    // Validate customer information for new customers
    if (isNewCustomer) {
      const errors: Partial<CustomerInfo> = {}

      if (!customerInfo.firstName.trim()) {
        errors.firstName = checkoutT.validation.firstNameRequired
      }
      if (!customerInfo.lastName.trim()) {
        errors.lastName = checkoutT.validation.lastNameRequired
      }
      if (!customerInfo.email.trim()) {
        errors.email = checkoutT.validation.emailRequired
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
        errors.email = checkoutT.validation.emailInvalid
      }
      if (!customerInfo.mobile.trim()) {
        errors.mobile = checkoutT.validation.mobileRequired
      } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(customerInfo.mobile)) {
        errors.mobile = checkoutT.validation.mobileInvalid
      }

      if (Object.keys(errors).length > 0) {
        setCustomerInfoErrors(errors)
        return
      }

      // Clear any previous errors
      setCustomerInfoErrors({})
    }

    setIsProcessing(true)

    if (checkoutData) {
      // Determine if this is a mobile phone or plan-only purchase
      const isMobilePlanOnly =
        checkoutData.type === "mobile-plan" ||
        (checkoutData.pricing.deviceMonthly === 0 && checkoutData.pricing.deviceUpfront === 0)

      if (isMobilePlanOnly) {
        // Send Plan_Convert event for mobile plan purchases
        await track({
          identifier: "Plan_Convert",
          properties: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            mobile: customerInfo.mobile,
            plan: checkoutData.configuration.selectedPlan?.name,
            planPrice: checkoutData.pricing.planMonthly,
            customerStatus: checkoutData.configuration.customerStatus,
            paymentsMonthly: checkoutData.pricing.total.monthly,
            paymentsUpfront: checkoutData.pricing.total.upfront,
          },
        })
      } else {
        // Send MobilePhone_Convert event for mobile phone purchases (with or without plan)
        await track({
          identifier: "MobilePhone_Convert",
          properties: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            mobile: customerInfo.mobile,
            product: checkoutData.product.name,
            storage: checkoutData.configuration.storage,
            color: checkoutData.configuration.color,
            plan: checkoutData.configuration.selectedPlan?.name,
            tradeInValue: checkoutData.configuration.tradeInValue,
            paymentsMonthly: checkoutData.pricing.total.monthly,
            paymentsUpfront: checkoutData.pricing.total.upfront,
          },
        })
      }
    }

    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate order confirmation data
    if (checkoutData) {
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      const orderData = {
        ...checkoutData,
        orderNumber,
        orderDate: new Date().toISOString(),
        ...(isNewCustomer && { customerInfo }),
      }

      // Store order confirmation data
      sessionStorage.setItem("orderConfirmationData", JSON.stringify(orderData))
      console.log("Order data saved to sessionStorage:", orderNumber) // Debug log
    }

    // Clear checkout data
    sessionStorage.removeItem("checkoutData")

    // Navigate to confirmation page
    router.push(`/${locale.code}/${brand.key}/order-confirmation`)
  }

  if (!checkoutData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">{checkoutT.loading}</div>
        </div>
      </div>
    )
  }

  const { product, configuration, pricing } = checkoutData

  return (
    <>
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={checkoutT.cdp.pageEventName}
          pageProperties={{ brand: brand.label, locale: locale.code }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{checkoutT.title}</h1>
          <p className="text-muted-foreground mt-2">{checkoutT.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Information Form for New Customers */}
          {isNewCustomer && (
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{checkoutT.customerInformation}</CardTitle>
                  <p className="text-sm text-muted-foreground">{checkoutT.customerInformationDescription}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        {checkoutT.firstName} {checkoutT.required}
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder={checkoutT.firstNamePlaceholder}
                        value={customerInfo.firstName}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className={customerInfoErrors.firstName ? "border-red-500" : ""}
                      />
                      {customerInfoErrors.firstName && (
                        <p className="text-sm text-red-500">{customerInfoErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        {checkoutT.lastName} {checkoutT.required}
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder={checkoutT.lastNamePlaceholder}
                        value={customerInfo.lastName}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className={customerInfoErrors.lastName ? "border-red-500" : ""}
                      />
                      {customerInfoErrors.lastName && (
                        <p className="text-sm text-red-500">{customerInfoErrors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {checkoutT.email} {checkoutT.required}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={checkoutT.emailPlaceholder}
                        value={customerInfo.email}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className={customerInfoErrors.email ? "border-red-500" : ""}
                      />
                      {customerInfoErrors.email && <p className="text-sm text-red-500">{customerInfoErrors.email}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">
                        {checkoutT.mobile} {checkoutT.required}
                      </Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder={checkoutT.mobilePlaceholder}
                        value={customerInfo.mobile}
                        onChange={e => setCustomerInfo(prev => ({ ...prev, mobile: e.target.value }))}
                        className={customerInfoErrors.mobile ? "border-red-500" : ""}
                      />
                      {customerInfoErrors.mobile && <p className="text-sm text-red-500">{customerInfoErrors.mobile}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {checkoutT.orderSummary}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Details */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Smartphone className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>
                        {checkoutT.storage}: {configuration.storage}
                      </div>
                      <div>
                        {checkoutT.color}: <span className="capitalize">{configuration.color}</span>
                      </div>
                      <div>
                        {checkoutT.sim}: {configuration.simType === "esim" ? checkoutT.esim : checkoutT.physicalSim}
                      </div>
                      {configuration.paymentPeriod !== "outright" && (
                        <div>
                          {checkoutT.payment}: {configuration.paymentPeriod} {checkoutT.months}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={`checkout-rating-${i}`}
                          className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground ml-1">({product.rating}/5)</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Plan Details */}
                {configuration.selectedPlan && (
                  <div>
                    <h4 className="font-semibold mb-2">{checkoutT.mobilePlan}</h4>
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{configuration.selectedPlan.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {configuration.selectedPlan.dataAllowance} • {configuration.selectedPlan.minutes} •{" "}
                            {configuration.selectedPlan.texts}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {
                              formatPriceData(
                                { price: `$${configuration.selectedPlan.monthlyPrice}` },
                                locale.code,
                                brand.key,
                              ).price
                            }
                          </div>
                          <div className="text-sm text-muted-foreground">{checkoutT.perMonth}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {configuration.selectedPlan.features.map((feature: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Accessories */}
                {configuration.accessories.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">{checkoutT.accessories}</h4>
                    <div className="space-y-2">
                      {configuration.accessories.map(
                        (accessory: { id: string; name: string; price: number; category: string }) => (
                          <div key={accessory.id} className="flex justify-between items-center p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                                <Shield className="w-5 h-5 text-muted-foreground" />
                              </div>
                              <span className="font-medium">{accessory.name}</span>
                            </div>
                            <span className="font-bold">
                              {formatPriceData({ price: `$${accessory.price}` }, locale.code, brand.key).price}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

                {/* Trade-in */}
                {configuration.hasTradeIn && (
                  <div>
                    <h4 className="font-semibold mb-2">{checkoutT.tradeIn}</h4>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span>{checkoutT.tradeInCreditApplied}</span>
                        <span className="font-bold text-green-600">
                          -{formatPriceData({ price: `$${configuration.tradeInValue}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery & Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {checkoutT.deliveryAndPayment}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{checkoutT.delivery.freeStandardDelivery}</div>
                    <div className="text-sm text-muted-foreground">{checkoutT.delivery.businessDays}</div>
                    <div className="text-sm text-muted-foreground">{checkoutT.delivery.toRegisteredAddress}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{checkoutT.billing.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {pricing.total.monthly > 0
                        ? checkoutT.billing.monthlyBillingCycle
                        : checkoutT.billing.oneTimePayment}
                    </div>
                    <div className="text-sm text-muted-foreground">{checkoutT.billing.paymentMethodOnFile}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{checkoutT.warranty.title}</div>
                    <div className="text-sm text-muted-foreground">{checkoutT.warranty.manufacturerWarranty}</div>
                    <div className="text-sm text-muted-foreground">{checkoutT.warranty.customerSupport}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upsell Offers */}
          <div className="space-y-6">
            <UpsellOffers
              offers={upsellOffers}
              locale={locale.code}
              brandKey={brand.key}
              onSelectionChange={handleUpsellSelectionChange}
              translations={{
                title: checkoutT.upsell.title,
                perMonth: checkoutT.upsell.perMonth,
                oneTime: checkoutT.upsell.oneTime,
              }}
            />

            {/* Price Breakdown */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {checkoutT.priceBreakdown}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Monthly Charges */}
                {(pricing.total.monthly > 0 || upsellMonthlyTotal > 0) && (
                  <div className="space-y-3">
                    <h4 className="font-semibold">{checkoutT.monthlyCharges}</h4>
                    {pricing.deviceMonthly > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{checkoutT.devicePayment}</span>
                        <span>
                          {formatPriceData({ price: `$${pricing.deviceMonthly}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                    )}
                    {pricing.planMonthly > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{checkoutT.planCharges}</span>
                        <span>
                          {formatPriceData({ price: `$${pricing.planMonthly}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                    )}
                    {selectedUpsellOffers
                      .filter(offer => offer.paymentType === "monthly")
                      .map(offer => (
                        <div key={offer.id} className="flex justify-between text-sm">
                          <span>{offer.productName}</span>
                          <span>{formatPriceData({ priceValue: offer.price }, locale.code, brand.key).price}</span>
                        </div>
                      ))}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>{checkoutT.totalMonthly}</span>
                      <span className="text-lg">
                        {
                          formatPriceData(
                            { priceValue: pricing.total.monthly + upsellMonthlyTotal },
                            locale.code,
                            brand.key,
                          ).price
                        }
                      </span>
                    </div>
                  </div>
                )}

                {/* Upfront Charges */}
                {(pricing.total.upfront > 0 || upsellUpfrontTotal > 0) && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="font-semibold">{checkoutT.upfrontCharges}</h4>
                      {pricing.deviceUpfront > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{checkoutT.devicePayment}</span>
                          <span>
                            {formatPriceData({ price: `$${pricing.deviceUpfront}` }, locale.code, brand.key).price}
                          </span>
                        </div>
                      )}
                      {pricing.accessoriesUpfront > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>{checkoutT.accessories}</span>
                          <span>
                            {formatPriceData({ price: `$${pricing.accessoriesUpfront}` }, locale.code, brand.key).price}
                          </span>
                        </div>
                      )}
                      {selectedUpsellOffers
                        .filter(offer => offer.paymentType === "upfront")
                        .map(offer => (
                          <div key={offer.id} className="flex justify-between text-sm">
                            <span>{offer.productName}</span>
                            <span>{formatPriceData({ priceValue: offer.price }, locale.code, brand.key).price}</span>
                          </div>
                        ))}
                      {pricing.tradeInUpfrontDiscount > 0 && (
                        <div className="flex justify-between text-sm text-green-600">
                          <span>{checkoutT.tradeInCredit}</span>
                          <span>
                            -
                            {
                              formatPriceData({ price: `$${pricing.tradeInUpfrontDiscount}` }, locale.code, brand.key)
                                .price
                            }
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>{checkoutT.totalUpfront}</span>
                        <span className="text-lg">
                          {
                            formatPriceData(
                              { priceValue: pricing.total.upfront + upsellUpfrontTotal },
                              locale.code,
                              brand.key,
                            ).price
                          }
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                {/* Terms & Conditions */}
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>• {checkoutT.terms.freeShippingText}</p>
                  <p>• {checkoutT.terms.moneyBackGuarantee}</p>
                  <p>• {checkoutT.terms.warrantyIncluded}</p>
                  <p>• {checkoutT.terms.monthlyChargesNote}</p>
                  {configuration.paymentPeriod !== "outright" && (
                    <p>• {checkoutT.terms.devicePaymentCommitment.replace("{months}", configuration.paymentPeriod)}</p>
                  )}
                </div>

                <Separator />

                {/* Checkout Button */}
                <Button onClick={handleCheckout} className="w-full" size="lg" disabled={isProcessing}>
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {checkoutT.processing}
                    </div>
                  ) : (
                    checkoutT.completeOrder
                  )}
                </Button>

                <div className="text-center">
                  <Button variant="ghost" onClick={() => router.back()} disabled={isProcessing}>
                    {checkoutT.backToProduct}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
