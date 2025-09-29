"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/CartContext"
import { useSiteContext } from "@/lib/SiteContext"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CartIcon() {
  const { cart } = useCart()
  const { getFullPath } = useSiteContext()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Link href="/cart">
        <Button variant="ghost" size="sm" className="relative cursor-pointer">
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </Link>
    )
  }

  return (
    <Link href={getFullPath("/cart")}>
      <Button variant="ghost" size="sm" className="relative cursor-pointer">
        <ShoppingCart className="h-5 w-5" />
        {cart.totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold min-w-[1.25rem]">
            {cart.totalItems > 99 ? "99+" : cart.totalItems}
          </Badge>
        )}
        <span className="sr-only">
          Shopping cart with {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""}
        </span>
      </Button>
    </Link>
  )
}
