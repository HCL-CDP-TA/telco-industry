"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, X } from "lucide-react"
import { useCart } from "@/lib/CartContext"
import { formatPrice } from "@/lib/currency"
import { CartItem } from "@/types/cart"
import Link from "next/link"
import { useParams } from "next/navigation"

interface CartSummaryProps {
  onClose?: () => void
}

export default function CartSummary({ onClose }: CartSummaryProps) {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const params = useParams()
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale || "en-US"
  const brand = Array.isArray(params.brand) ? params.brand[0] : params.brand || "unitel"

  if (cart.items.length === 0) {
    return (
      <Card className="w-80">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </h3>
            {onClose && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500">Your cart is empty</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-80">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Cart
            <Badge variant="secondary" className="ml-1">
              {cart.totalItems}
            </Badge>
          </h3>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {cart.items.map((item: CartItem) => (
            <div key={`${item.id}-${item.type}`} className="flex justify-between items-center text-sm">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-500 capitalize">{item.type}</div>
                <div className="text-green-600 font-medium">{formatPrice(item.priceValue, locale, brand)}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-sm">
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center text-sm">
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="w-6 h-6 rounded border border-red-300 text-red-500 hover:bg-red-50 flex items-center justify-center text-sm ml-2">
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center font-semibold mb-3">
            <span>Total:</span>
            <span className="text-green-600">{formatPrice(cart.totalValue, locale, brand)}</span>
          </div>

          <Link href={`/${locale}/${params.brand}/cart`}>
            <Button className="w-full" onClick={onClose}>
              View Cart
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
