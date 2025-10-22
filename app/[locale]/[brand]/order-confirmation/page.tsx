"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Check, Package, Mail, Calendar, Home } from "lucide-react"
import { useState, useEffect } from "react"
import { formatPriceData } from "@/lib/priceFormatting"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

interface OrderData {
  orderNumber: string
  customerInfo?: {
    firstName: string
    lastName: string
    email: string
    mobile: string
  }
  product: {
    id: string
    name: string
    brand: string
    price: string
    imageUrl: string
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
  orderDate: string
}

export default function OrderConfirmationPage() {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const router = useRouter()
  const t = useTranslations()

  // Get order confirmation translations
  const orderT = t.raw("orderConfirmation")

  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load order data from session storage
  useEffect(() => {
    const data = sessionStorage.getItem("orderConfirmationData")
    console.log("Order confirmation data found:", !!data) // Debug log
    if (data) {
      const orderInfo = JSON.parse(data)
      setOrderData(orderInfo)
      setIsLoading(false)
      // Don't immediately remove the data - keep it for potential page refreshes
      // sessionStorage.removeItem("orderConfirmationData")
    } else {
      // Give it more time before redirecting, in case data is still being written
      console.log("No order data found, will redirect in 3 seconds") // Debug log
      setTimeout(() => {
        setIsLoading(false)
        router.push(`/${locale.code}/${brand.key}`)
      }, 3000) // Increased to 3 seconds
    }
  }, [locale.code, brand.key, router])

  const handleBackToHome = () => {
    // Clear the order confirmation data when explicitly going back to home
    sessionStorage.removeItem("orderConfirmationData")
    router.push(`/${locale.code}/${brand.key}`)
  }

  if (isLoading || !orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>{orderT.loading}</p>
        </div>
      </div>
    )
  }

  const { product, configuration, pricing } = orderData

  return (
    <>
      {isCDPTrackingEnabled && (
        <CdpPageEvent pageName="Order Confirmation" pageProperties={{ brand: brand.label, locale: locale.code }} />
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">{orderT.title}</h1>
            <p className="text-lg text-muted-foreground">{orderT.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="md:col-span-2 space-y-6">
              {/* Order Summary Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {orderT.orderSummary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {product.brand} {product.name}
                      </h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          {orderT.storage} {configuration.storage}
                        </p>
                        <p>
                          {orderT.color} {configuration.color}
                        </p>
                        <p>
                          {orderT.sim} {configuration.simType === "physical" ? orderT.physicalSim : orderT.esim}
                        </p>
                      </div>
                    </div>
                  </div>

                  {configuration.selectedPlan && (
                    <div className="border rounded-lg p-3">
                      <h4 className="font-medium">{configuration.selectedPlan.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>
                          {configuration.selectedPlan.dataAllowance} • {configuration.selectedPlan.minutes} •{" "}
                          {configuration.selectedPlan.texts}
                        </p>
                      </div>
                    </div>
                  )}

                  {configuration.accessories.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">{orderT.accessories}</h4>
                      <div className="space-y-1">
                        {configuration.accessories.map(accessory => (
                          <div key={accessory.id} className="flex justify-between text-sm">
                            <span>{accessory.name}</span>
                            <span>
                              {formatPriceData({ price: `$${accessory.price}` }, locale.code, brand.key).price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information for New Customers */}
              {orderData.customerInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      {orderT.customerInformation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-muted-foreground">{orderT.name}</p>
                        <p>
                          {orderData.customerInfo.firstName} {orderData.customerInfo.lastName}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-muted-foreground">{orderT.email}</p>
                        <p>{orderData.customerInfo.email}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="font-medium text-muted-foreground">{orderT.mobilePhone}</p>
                        <p>{orderData.customerInfo.mobile}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* What to Expect */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {orderT.whatToExpect}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">{orderT.orderProcessing}</h4>
                        <p className="text-sm text-muted-foreground">{orderT.step1}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">{orderT.deviceShipment}</h4>
                        <p className="text-sm text-muted-foreground">{orderT.step2}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">{orderT.serviceActivation}</h4>
                        <p className="text-sm text-muted-foreground">
                          {configuration.simType === "physical" ? orderT.step3Physical : orderT.step3eSIM}
                        </p>
                      </div>
                    </div>

                    {configuration.hasTradeIn && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          4
                        </div>
                        <div>
                          <h4 className="font-medium">{orderT.tradeInDevice}</h4>
                          <p className="text-sm text-muted-foreground">{orderT.tradeIn}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Info Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">{orderT.orderDetails}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Order Number */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{orderT.orderNumber}</p>
                    <p className="font-mono text-lg font-semibold text-primary">{orderData.orderNumber}</p>
                  </div>

                  {/* Order Date */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{orderT.orderDate}</p>
                    <p className="font-medium">{new Date(orderData.orderDate).toLocaleDateString(locale.code)}</p>
                  </div>

                  <Separator />

                  {/* Pricing Summary */}
                  <div className="space-y-2">
                    <h4 className="font-medium">{orderT.pricingSummary}</h4>

                    {configuration.paymentPeriod !== "outright" && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span>{orderT.deviceMonthly}</span>
                          <span>
                            {formatPriceData({ price: `$${pricing.deviceMonthly}` }, locale.code, brand.key).price}
                          </span>
                        </div>
                        {configuration.selectedPlan && (
                          <div className="flex justify-between text-sm">
                            <span>{orderT.planMonthly}</span>
                            <span>
                              {formatPriceData({ price: `$${pricing.planMonthly}` }, locale.code, brand.key).price}
                            </span>
                          </div>
                        )}
                        {configuration.hasTradeIn && pricing.tradeInMonthlyDiscount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>{orderT.tradeInDiscount}</span>
                            <span>
                              -
                              {
                                formatPriceData({ price: `$${pricing.tradeInMonthlyDiscount}` }, locale.code, brand.key)
                                  .price
                              }
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold pt-2 border-t">
                          <span>{orderT.totalMonthly}</span>
                          <span className="text-lg">
                            {formatPriceData({ price: `$${pricing.total.monthly}` }, locale.code, brand.key).price}
                          </span>
                        </div>
                      </>
                    )}

                    {pricing.deviceUpfront > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{orderT.deviceUpfront}</span>
                        <span>
                          {formatPriceData({ price: `$${pricing.deviceUpfront}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                    )}
                    {pricing.accessoriesUpfront > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>{orderT.accessories}</span>
                        <span>
                          {formatPriceData({ price: `$${pricing.accessoriesUpfront}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                    )}
                    {configuration.hasTradeIn && pricing.tradeInUpfrontDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>{orderT.tradeInCredit}</span>
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
                      <span>{orderT.totalUpfront}</span>
                      <span className="text-lg">
                        {formatPriceData({ price: `$${pricing.total.upfront}` }, locale.code, brand.key).price}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Contact Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{orderT.confirmationEmailSent}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Back to Home Button */}
                  <Button onClick={handleBackToHome} className="w-full" size="lg">
                    <Home className="w-4 h-4 mr-2" />
                    {orderT.backToHome}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
