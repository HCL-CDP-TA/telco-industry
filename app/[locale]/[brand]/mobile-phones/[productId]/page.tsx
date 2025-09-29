"use client"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent, useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Star, Shield, RefreshCw, CreditCard, User, Phone, Wifi } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useMemo, useEffect, useCallback } from "react"
import { formatPriceData } from "@/lib/priceFormatting"
import { useRouter } from "next/navigation"
import Image from "next/image"
import LoginModal from "@/components/LoginModal"

interface Phone {
  id: string
  name: string
  brand: string
  price: string
  originalPrice?: string
  imageUrl: string
  features: string[]
  storage: string[]
  storagePricing?: Record<string, string>
  colors: Array<{ name: string; swatch: string }>
  rating: number
  isNew?: boolean
  isBestSeller?: boolean
  priceValue?: number
}

interface Plan {
  id: string
  name: string
  dataAllowance: string
  minutes: string
  texts: string
  monthlyPrice: number
  features: string[]
  speed: string
}

interface Accessory {
  id: string
  name: string
  price: number
  category: "case" | "screen-protector" | "charger" | "other"
}

interface PaymentOption {
  value: string
  label: string
  description: string
}

interface ProductConfiguration {
  storage: string
  color: string
  paymentPeriod: string
  customerStatus: "new" | "existing" | "" // Allow empty string
  hasTradeIn: boolean
  tradeInValue: number
  selectedPlan: Plan | null
  simType: "physical" | "esim"
  accessories: Accessory[]
}

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { brand, locale } = useSiteContext()
  const { isCDPTrackingEnabled } = useCDPTracking()
  const { track } = useCdp()
  const router = useRouter()
  const t = useTranslations()

  // State for resolved params and product
  const [resolvedParams, setResolvedParams] = useState<{ productId: string } | null>(null)
  const [product, setProduct] = useState<Phone | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Get page data
  const pageData = t.raw("pages.mobilePhones")
  const productDetailData = t.raw("pages.mobilePhones.productDetail")

  // Function to check login status
  const checkLoginStatus = useCallback(() => {
    const customerData = JSON.parse(localStorage.getItem(`${brand.key}_customer_data`) || "{}")
    setIsLoggedIn(!!customerData?.loginData?.email)
  }, [brand.key])

  // Resolve params
  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  // Check login status on component mount
  useEffect(() => {
    checkLoginStatus()

    // Listen for login/logout events
    const handleLoginChange = () => {
      checkLoginStatus()
    }

    window.addEventListener("user-login-changed", handleLoginChange)

    return () => {
      window.removeEventListener("user-login-changed", handleLoginChange)
    }
  }, [brand.key, checkLoginStatus])

  // Find product when params are resolved
  useEffect(() => {
    if (resolvedParams) {
      // Helper function to create URL slug from brand and product name
      const createProductSlug = (brandName: string, name: string) => {
        return `${brandName}-${name}`
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      }

      // Try to find product by the new slug format (brand-name) or fallback to old ID
      let foundProduct = pageData.products.find((phone: Phone) => {
        const expectedSlug = createProductSlug(phone.brand, phone.name)
        return expectedSlug === resolvedParams.productId
      })

      // Fallback to old ID format for backward compatibility
      if (!foundProduct) {
        foundProduct = pageData.products.find((phone: Phone) => phone.id === resolvedParams.productId)
      }

      setProduct(foundProduct || null)
    }
  }, [resolvedParams, pageData.products])

  useEffect(() => {
    const trackProduct = async () => {
      await track({
        identifier: "mobile_phone_interest",
        properties: {
          product: product?.name,
          brand: product?.brand,
          price: product?.price,
        },
      })
    }

    if (product) {
      trackProduct()
    }
  }, [product, track])

  // Set default storage and color when product is loaded
  useEffect(() => {
    if (product && product.storage && product.colors) {
      setConfig(prev => ({
        ...prev,
        storage: prev.storage || product.storage[0] || "",
        color: prev.color || product.colors[0]?.name || "",
      }))
    }
  }, [product])

  // Product configuration state - Set customer status based on login state
  const [config, setConfig] = useState<ProductConfiguration>({
    storage: "",
    color: "",
    paymentPeriod: "24",
    customerStatus: "", // Will be set by useEffect based on login state
    hasTradeIn: false,
    tradeInValue: 0,
    selectedPlan: null,
    simType: "physical",
    accessories: [],
  })

  // Update customer status based on login state
  useEffect(() => {
    if (isLoggedIn) {
      setConfig(prev => ({ ...prev, customerStatus: "existing" }))
    } else {
      // Reset to empty if user logs out
      setConfig(prev => ({ ...prev, customerStatus: "" }))
    }
  }, [isLoggedIn])

  // Handle successful login
  const handleLoginSuccess = () => {
    setConfig(prev => ({ ...prev, customerStatus: "existing" }))
    // checkLoginStatus will be called automatically via event listener
  }

  // Sample data
  const paymentOptions: PaymentOption[] = productDetailData.paymentOptions

  const samplePlans: Plan[] = productDetailData.plans

  const sampleAccessories: Accessory[] = productDetailData.accessories

  // Calculate pricing with improved trade-in handling
  const calculatePricing = useMemo(() => {
    if (!product)
      return {
        deviceMonthly: 0,
        deviceUpfront: 0,
        deviceMonthlyBeforeTradeIn: 0,
        planMonthly: 0,
        accessoriesUpfront: 0,
        tradeInUpfrontDiscount: 0,
        tradeInMonthlyDiscount: 0,
        total: { monthly: 0, upfront: 0 },
      }

    // Use storage-specific pricing if available, otherwise fall back to base price
    const selectedStoragePrice =
      product.storagePricing && config.storage ? product.storagePricing[config.storage] : product.price
    const devicePrice = parseInt(selectedStoragePrice.replace(/[€$,]/g, ""))
    const tradeInValue = config.hasTradeIn ? config.tradeInValue : 0

    let deviceMonthly = 0
    let deviceMonthlyBeforeTradeIn = 0
    let deviceUpfront = 0
    let tradeInUpfrontDiscount = 0
    let tradeInMonthlyDiscount = 0

    if (config.paymentPeriod === "outright") {
      // For outright payment, trade-in reduces upfront cost
      deviceUpfront = devicePrice
      tradeInUpfrontDiscount = tradeInValue
    } else {
      // For monthly payments, trade-in reduces monthly device cost
      const months = parseInt(config.paymentPeriod)
      deviceMonthlyBeforeTradeIn = Math.round(devicePrice / months)
      tradeInMonthlyDiscount = config.hasTradeIn ? Math.round(tradeInValue / months) : 0
      deviceMonthly = Math.max(0, deviceMonthlyBeforeTradeIn - tradeInMonthlyDiscount)
    }

    const planMonthly = config.selectedPlan?.monthlyPrice || 0
    const accessoriesUpfront = config.accessories.reduce((sum, acc) => sum + acc.price, 0)

    // Calculate totals
    const totalUpfront = Math.max(0, deviceUpfront + accessoriesUpfront - tradeInUpfrontDiscount)

    return {
      deviceMonthly,
      deviceUpfront,
      deviceMonthlyBeforeTradeIn,
      planMonthly,
      accessoriesUpfront,
      tradeInUpfrontDiscount,
      tradeInMonthlyDiscount,
      total: {
        monthly: deviceMonthly + planMonthly,
        upfront: totalUpfront,
      },
    }
  }, [product, config])

  // Get current price based on selected storage
  const getCurrentPrice = useMemo(() => {
    if (!product) return ""
    return product.storagePricing && config.storage ? product.storagePricing[config.storage] : product.price
  }, [product, config.storage])

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product || !config.storage || !config.color || !config.selectedPlan) {
      alert(productDetailData.labels.pleaseSelectAllOptions)
      return
    }

    const cartData = {
      product,
      configuration: config,
      pricing: calculatePricing,
    }

    await track({
      identifier: "mobile_phone_intent",
      properties: {
        product: product.name,
        storage: config.storage,
        color: config.color,
        plan: config.selectedPlan.name,
        trade_in_value: config.tradeInValue,
        payments_monthly: calculatePricing.total.monthly,
        payments_upfront: calculatePricing.total.upfront,
      },
    })

    sessionStorage.setItem("checkoutData", JSON.stringify(cartData))
    router.push(`/${locale.code}/${brand.key}/checkout`)
  }

  // Loading state
  if (!resolvedParams || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-lg">
            {!resolvedParams ? productDetailData.labels.loading : productDetailData.labels.productNotFound}
          </div>
          {!resolvedParams ? null : (
            <Button onClick={() => router.back()} className="mt-4">
              {productDetailData.labels.goBack}
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      {isCDPTrackingEnabled && (
        <CdpPageEvent
          pageName={`${product.brand} ${product.name}`}
          pageProperties={{ brand: brand.label, locale: locale.code }}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-6">
          <span>Mobile Phones</span> /{" "}
          <span className="text-foreground font-medium">
            {product.brand} {product.name}
          </span>
        </nav>

        {/* Top Section - Aligned with columns below */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Product Image - aligns with right column and matches height - shows first on mobile */}
          <div className="flex flex-col h-full lg:order-2">
            <Card className="overflow-hidden flex-1 flex flex-col">
              <div className="aspect-square bg-muted flex-1 flex items-center justify-center">
                <Image
                  src={`${product.imageUrl}&w=600`}
                  alt={`${product.brand} ${product.name}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>
          </div>

          {/* Product Info and Device Configuration - spans 2 columns - shows second on mobile */}
          <div className="lg:col-span-2 space-y-6 lg:order-1">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.isNew && <Badge variant="secondary">New</Badge>}
                {product.isBestSeller && <Badge>Best Seller</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">
                {product.brand} {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`product-rating-${i}`}
                      className={`w-4 h-4 ${i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({product.rating}/5)</span>
              </div>

              {/* Pricing Display */}
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatPriceData({ price: getCurrentPrice }, locale.code, brand.key).price}
                </div>
                {product.originalPrice && (
                  <div className="text-lg text-muted-foreground line-through">
                    {formatPriceData({ price: product.originalPrice }, locale.code, brand.key).price}
                  </div>
                )}
                {config.hasTradeIn && config.tradeInValue > 0 && (
                  <div className="text-sm text-green-600">
                    {productDetailData.labels.tradeInValue} -
                    {formatPriceData({ price: `$${config.tradeInValue}` }, locale.code, brand.key).price}
                  </div>
                )}
              </div>
            </div>

            {/* Device Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  {productDetailData.labels.deviceConfiguration}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Storage Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">{productDetailData.labels.storageCapacity}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.storage.map((storage: string) => (
                      <Button
                        key={storage}
                        variant={config.storage === storage ? "default" : "outline"}
                        onClick={() => setConfig(prev => ({ ...prev, storage }))}
                        className="h-auto py-3">
                        {storage}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <Label className="text-base font-medium mb-3 block">{productDetailData.labels.color}</Label>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((colorObj, index) => (
                      <Button
                        key={`color-${index}-${colorObj.name}`}
                        variant={config.color === colorObj.name ? "default" : "outline"}
                        onClick={() => setConfig(prev => ({ ...prev, color: colorObj.name }))}
                        className="h-auto py-3 px-4 flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: colorObj.swatch }}
                        />
                        <span className="capitalize">{colorObj.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Payment Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  {productDetailData.labels.paymentOptions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentOptions.map(option => (
                    <div
                      key={option.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        config.paymentPeriod === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, paymentPeriod: option.value }))}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        {option.value !== "outright" && (
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">
                              {productDetailData.labels.monthlyPayments}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {productDetailData.labels.customerStatus}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label className="text-base font-medium mb-3 block">
                    {productDetailData.labels.newOrExistingCustomer}
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={config.customerStatus === "new" ? "default" : "outline"}
                      onClick={() => setConfig(prev => ({ ...prev, customerStatus: "new" }))}
                      className="h-auto py-4 flex flex-col items-center gap-2">
                      <User className="w-5 h-5" />
                      <div>
                        <div className="font-medium">{productDetailData.labels.newCustomer}</div>
                        <div className="text-xs text-muted-foreground">{productDetailData.labels.joinOurNetwork}</div>
                      </div>
                    </Button>
                    {isLoggedIn ? (
                      <Button
                        variant={config.customerStatus === "existing" ? "default" : "outline"}
                        onClick={() => setConfig(prev => ({ ...prev, customerStatus: "existing" }))}
                        className="h-auto py-4 flex flex-col items-center gap-2">
                        <User className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{productDetailData.labels.existingCustomer}</div>
                          <div className="text-xs text-muted-foreground">{productDetailData.labels.welcomeBack}</div>
                        </div>
                      </Button>
                    ) : (
                      <LoginModal onLogin={handleLoginSuccess}>
                        <Button
                          variant={config.customerStatus === "existing" ? "default" : "outline"}
                          className="h-auto py-4 flex flex-col items-center gap-2">
                          <User className="w-5 h-5" />
                          <div>
                            <div className="font-medium">{productDetailData.labels.existingCustomer}</div>
                            <div className="text-xs text-muted-foreground">
                              {productDetailData.labels.loginToContinue}
                            </div>
                          </div>
                        </Button>
                      </LoginModal>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trade-in Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  {productDetailData.labels.tradeInProgram}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">{productDetailData.labels.tradeInDescription}</div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant={config.hasTradeIn ? "default" : "outline"}
                      onClick={() =>
                        setConfig(prev => ({
                          ...prev,
                          hasTradeIn: !prev.hasTradeIn,
                          tradeInValue: !prev.hasTradeIn ? 150 : 0,
                        }))
                      }
                      className="flex-1">
                      {config.hasTradeIn
                        ? productDetailData.labels.removeTradeIn
                        : productDetailData.labels.addTradeInDevice}
                    </Button>
                  </div>

                  {config.hasTradeIn && (
                    <div className="p-3 bg-muted rounded-lg space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4 text-green-600" />
                        <span>{productDetailData.labels.estimatedTradeInValue} </span>
                        <span className="font-semibold text-green-600">
                          {formatPriceData({ price: `$${config.tradeInValue}` }, locale.code, brand.key).price}
                        </span>
                      </div>
                      {config.paymentPeriod !== "outright" && calculatePricing.tradeInMonthlyDiscount > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <span>{productDetailData.labels.monthlyDiscount} </span>
                          <span className="font-semibold text-green-600">
                            -
                            {
                              formatPriceData(
                                { price: `$${calculatePricing.tradeInMonthlyDiscount}` },
                                locale.code,
                                brand.key,
                              ).price
                            }
                            /month
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground">Final value determined upon device inspection</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Plan Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Choose Your Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {samplePlans.map(plan => (
                    <div
                      key={plan.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        config.selectedPlan?.id === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, selectedPlan: plan }))}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.dataAllowance} • {plan.minutes} • {plan.texts}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatPriceData({ price: `$${plan.monthlyPrice}` }, locale.code, brand.key).price}
                          </div>
                          <div className="text-sm text-muted-foreground">per month</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {plan.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SIM Type */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  SIM Card Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Label className="text-base font-medium mb-3 block">Choose your SIM card type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={config.simType === "physical" ? "default" : "outline"}
                      onClick={() => setConfig(prev => ({ ...prev, simType: "physical" }))}
                      className="h-auto py-4 flex flex-col items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Physical SIM</div>
                        <div className="text-xs text-muted-foreground">Shipped to you</div>
                      </div>
                    </Button>
                    <Button
                      variant={config.simType === "esim" ? "default" : "outline"}
                      onClick={() => setConfig(prev => ({ ...prev, simType: "esim" }))}
                      className="h-auto py-4 flex flex-col items-center gap-2">
                      <Wifi className="w-5 h-5" />
                      <div>
                        <div className="font-medium">eSIM</div>
                        <div className="text-xs text-muted-foreground">Activate instantly</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Add Accessories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {sampleAccessories.map(accessory => {
                    const isSelected = config.accessories.some(acc => acc.id === accessory.id)
                    return (
                      <div
                        key={accessory.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          if (isSelected) {
                            setConfig(prev => ({
                              ...prev,
                              accessories: prev.accessories.filter(acc => acc.id !== accessory.id),
                            }))
                          } else {
                            setConfig(prev => ({
                              ...prev,
                              accessories: [...prev.accessories, accessory],
                            }))
                          }
                        }}>
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <Shield className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{accessory.name}</h4>
                            <p className="text-sm font-bold">
                              {formatPriceData({ price: `$${accessory.price}` }, locale.code, brand.key).price}
                            </p>
                          </div>
                          <Checkbox checked={isSelected} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>{productDetailData.labels.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Configuration */}
                <div className="space-y-2 text-sm">
                  <div className="font-medium">
                    {product.brand} {product.name}
                  </div>
                  {config.storage && <div>Storage: {config.storage}</div>}
                  {config.color && (
                    <div>
                      Color: <span className="capitalize">{config.color}</span>
                    </div>
                  )}
                  {config.selectedPlan && <div>Plan: {config.selectedPlan.name}</div>}
                  <div>SIM: {config.simType === "esim" ? "eSIM" : "Physical SIM"}</div>
                  {config.paymentPeriod !== "outright" && <div>Payment: {config.paymentPeriod} months</div>}
                </div>

                <Separator />

                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="font-medium mb-2">{productDetailData.labels.monthlyCharges}</div>
                  {calculatePricing.deviceMonthly > 0 && (
                    <>
                      {config.hasTradeIn && calculatePricing.tradeInMonthlyDiscount > 0 ? (
                        <div className="space-y-1">
                          <div className="flex justify-between text-muted-foreground">
                            <span>Device payment</span>
                            <span>
                              {
                                formatPriceData(
                                  { price: `$${calculatePricing.deviceMonthlyBeforeTradeIn}` },
                                  locale.code,
                                  brand.key,
                                ).price
                              }
                            </span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Trade-in discount</span>
                            <span>
                              -
                              {
                                formatPriceData(
                                  { price: `$${calculatePricing.tradeInMonthlyDiscount}` },
                                  locale.code,
                                  brand.key,
                                ).price
                              }
                            </span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>{productDetailData.labels.devicePaymentAfterTradeIn}</span>
                            <span>
                              {
                                formatPriceData({ price: `$${calculatePricing.deviceMonthly}` }, locale.code, brand.key)
                                  .price
                              }
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <span>{productDetailData.labels.devicePayment}</span>
                          <span>
                            {
                              formatPriceData({ price: `$${calculatePricing.deviceMonthly}` }, locale.code, brand.key)
                                .price
                            }
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  {calculatePricing.planMonthly > 0 && (
                    <div className="flex justify-between">
                      <span>{productDetailData.labels.planCharges}</span>
                      <span>
                        {formatPriceData({ price: `$${calculatePricing.planMonthly}` }, locale.code, brand.key).price}
                      </span>
                    </div>
                  )}
                  {calculatePricing.total.monthly > 0 && (
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>{productDetailData.labels.totalMonthly}</span>
                      <span>
                        {formatPriceData({ price: `$${calculatePricing.total.monthly}` }, locale.code, brand.key).price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Upfront Charges - Always show, highlight when zero */}
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="font-medium mb-2">{productDetailData.labels.upfrontCharges}</div>
                  {calculatePricing.total.upfront === 0 ? (
                    <div className="flex justify-between font-medium text-green-600 bg-green-50 p-2 rounded">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">🎉</span>
                        {productDetailData.labels.noUpfrontPayment}
                      </span>
                      <span className="font-bold">
                        {formatPriceData({ price: `$0` }, locale.code, brand.key).price}
                      </span>
                    </div>
                  ) : (
                    <>
                      {calculatePricing.deviceUpfront > 0 && (
                        <div className="flex justify-between">
                          <span>Device payment</span>
                          <span>
                            {
                              formatPriceData({ price: `$${calculatePricing.deviceUpfront}` }, locale.code, brand.key)
                                .price
                            }
                          </span>
                        </div>
                      )}
                      {calculatePricing.accessoriesUpfront > 0 && (
                        <div className="flex justify-between">
                          <span>Accessories</span>
                          <span>
                            {
                              formatPriceData(
                                { price: `$${calculatePricing.accessoriesUpfront}` },
                                locale.code,
                                brand.key,
                              ).price
                            }
                          </span>
                        </div>
                      )}
                      {calculatePricing.tradeInUpfrontDiscount > 0 && config.paymentPeriod === "outright" && (
                        <div className="flex justify-between text-green-600">
                          <span>{productDetailData.labels.tradeInCredit}</span>
                          <span>
                            -
                            {
                              formatPriceData(
                                { price: `$${calculatePricing.tradeInUpfrontDiscount}` },
                                locale.code,
                                brand.key,
                              ).price
                            }
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium pt-2 border-t">
                        <span>{productDetailData.labels.totalUpfront}</span>
                        <span>
                          {
                            formatPriceData({ price: `$${calculatePricing.total.upfront}` }, locale.code, brand.key)
                              .price
                          }
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="w-full"
                  size="lg"
                  disabled={!config.storage || !config.color || !config.selectedPlan || !config.customerStatus}>
                  {productDetailData.labels.addToCart}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Free shipping • 30-day returns • 2-year warranty
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold">Display</h4>
                      <p className="text-sm text-muted-foreground">6.1&quot; Super Retina XDR display</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Camera</h4>
                      <p className="text-sm text-muted-foreground">48MP Main camera</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Processor</h4>
                      <p className="text-sm text-muted-foreground">A17 Pro chip</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold">Battery</h4>
                      <p className="text-sm text-muted-foreground">Up to 23 hours video playback</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">Key Features</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {product.features.map((feature: string, index: number) => (
                          <div key={`feature-${index}-${feature.slice(0, 10)}`} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-4">Additional Details</h4>
                      <div className="text-muted-foreground space-y-2">
                        <p>Advanced camera system with multiple lenses for professional photography</p>
                        <p>Latest processor technology for seamless performance and gaming</p>
                        <p>Premium build quality with aerospace-grade materials</p>
                        <p>Enhanced security features including facial recognition and fingerprint</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">{product.rating}</div>
                      <div>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`review-rating-${i}`}
                              className={`w-5 h-5 ${
                                i < product.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">Based on customer reviews</div>
                      </div>
                    </div>
                    <div className="text-muted-foreground">
                      Customer reviews would be displayed here in a real implementation.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
