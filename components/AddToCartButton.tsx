"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/CartContext"
import { CartItem } from "@/types/cart"
import { useState } from "react"

interface AddToCartButtonProps {
  item: Omit<CartItem, "quantity">
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive" | null | undefined
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  className?: string
  children?: React.ReactNode
}

export default function AddToCartButton({
  item,
  variant = "default",
  size = "default",
  className = "",
  children,
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart()
  const [justAdded, setJustAdded] = useState(false)

  const inCart = isInCart(item.id)

  const handleAddToCart = () => {
    addToCart(item)
    setJustAdded(true)

    // Reset the "just added" state after a short delay
    setTimeout(() => {
      setJustAdded(false)
    }, 2000)
  }

  if (justAdded) {
    return (
      <Button variant="outline" size={size} className={`${className} text-green-600 border-green-600`} disabled>
        <Check className="h-4 w-4 mr-2" />
        Added to Cart!
      </Button>
    )
  }

  return (
    <Button variant={inCart ? "outline" : variant} size={size} className={className} onClick={handleAddToCart}>
      <ShoppingCart className="h-4 w-4 mr-2" />
      {children || (inCart ? "Add Another" : "Add to Cart")}
    </Button>
  )
}
