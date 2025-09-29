"use client"

import { useSiteContext } from "@/lib/SiteContext"
import { useCart } from "@/lib/CartContext"
import { CartItem } from "@/types/cart"
import { formatPrice } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft, CreditCard } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CartPage() {
  const { getFullPath, locale, brand } = useSiteContext()
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const getItemDescription = (item: CartItem) => {
    const parts = []
    if (item.storage) parts.push(`${item.storage} storage`)
    if (item.color) parts.push(item.color)
    if (item.data) parts.push(`${item.data} data`)
    if (item.speed) parts.push(`${item.speed} speed`)
    return parts.join(", ")
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-48 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Link href={getFullPath("/")} className="inline-flex">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shopping
              </Button>
            </Link>
          </div>

          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products to your cart yet. Explore our products to find something
              you love!
            </p>
            <div className="space-y-4">
              <Link href={getFullPath("/mobile-phones")}>
                <Button className="mr-4">Browse Mobile Phones</Button>
              </Link>
              <Link href={getFullPath("/mobile-plans")}>
                <Button variant="outline" className="mr-4">
                  View Mobile Plans
                </Button>
              </Link>
              <Link href={getFullPath("/broadband")}>
                <Button variant="outline" className="mr-4">
                  Check Broadband
                </Button>
              </Link>
              <Link href={getFullPath("/bundles")}>
                <Button variant="outline">Bundle Deals</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Link href={getFullPath("/")} className="inline-flex">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
          <Button variant="outline" size="sm" onClick={clearCart} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            <div className="space-y-4">
              {cart.items.map(item => (
                <Card key={`${item.id}-${item.storage}-${item.color}-${item.data}-${item.speed}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{item.name}</h3>
                            {item.brand && <p className="text-sm text-muted-foreground mb-1">{item.brand}</p>}
                            {getItemDescription(item) && (
                              <p className="text-sm text-muted-foreground mb-2">{getItemDescription(item)}</p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {item.type}
                              </Badge>
                              {item.isNew && (
                                <Badge variant="default" className="text-xs bg-green-500">
                                  New
                                </Badge>
                              )}
                              {item.isBestSeller && (
                                <Badge variant="default" className="text-xs bg-orange-500">
                                  Best Seller
                                </Badge>
                              )}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="font-bold text-lg">
                              {formatPrice(item.priceValue * item.quantity, locale.code, brand.key)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-muted-foreground">
                                {formatPrice(item.priceValue, locale.code, brand.key)} each
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Items ({cart.totalItems})</span>
                  <span>{formatPrice(cart.totalValue, locale.code, brand.key)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(cart.totalValue, locale.code, brand.key)}</span>
                </div>
                <Button className="w-full mt-6" size="lg">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Taxes and fees will be calculated at checkout
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
