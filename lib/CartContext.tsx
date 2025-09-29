"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useSiteContext } from "./SiteContext"
import { Cart, CartItem, CartContextType } from "@/types/cart"

const CartContext = createContext<CartContextType | undefined>(undefined)

const EMPTY_CART: Cart = {
  items: [],
  totalItems: 0,
  totalValue: 0,
  lastUpdated: Date.now(),
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { brand } = useSiteContext()
  const [cart, setCart] = useState<Cart>(EMPTY_CART)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`${brand.key}_cart`)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error("Failed to parse saved cart:", error)
        setCart(EMPTY_CART)
      }
    }
  }, [brand.key])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`${brand.key}_cart`, JSON.stringify(cart))
  }, [cart, brand.key])

  // Calculate totals
  const calculateTotals = (items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalValue = items.reduce((sum, item) => sum + item.priceValue * item.quantity, 0)
    return { totalItems, totalValue }
  }

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem =>
          cartItem.id === item.id &&
          cartItem.storage === item.storage &&
          cartItem.color === item.color &&
          cartItem.data === item.data &&
          cartItem.speed === item.speed,
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = [...prevCart.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        }
      } else {
        // Add new item
        newItems = [...prevCart.items, { ...item, quantity: 1 }]
      }

      const { totalItems, totalValue } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalValue,
        lastUpdated: Date.now(),
      }
    })

    // Dispatch event for UI updates
    window.dispatchEvent(new CustomEvent("cart-updated"))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== itemId)
      const { totalItems, totalValue } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalValue,
        lastUpdated: Date.now(),
      }
    })

    window.dispatchEvent(new CustomEvent("cart-updated"))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => (item.id === itemId ? { ...item, quantity } : item))
      const { totalItems, totalValue } = calculateTotals(newItems)

      return {
        items: newItems,
        totalItems,
        totalValue,
        lastUpdated: Date.now(),
      }
    })

    window.dispatchEvent(new CustomEvent("cart-updated"))
  }

  const clearCart = () => {
    setCart(EMPTY_CART)
    window.dispatchEvent(new CustomEvent("cart-updated"))
  }

  const isInCart = (itemId: string) => {
    return cart.items.some(item => item.id === itemId)
  }

  const getCartItem = (itemId: string) => {
    return cart.items.find(item => item.id === itemId)
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
