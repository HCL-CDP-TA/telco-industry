export interface CartItem {
  id: string
  type: "phone" | "plan" | "broadband" | "bundle"
  name: string
  brand?: string
  price: string
  originalPrice?: string
  priceValue: number
  quantity: number
  image?: string
  features?: string[]
  // Phone specific options
  storage?: string
  color?: string
  // Plan specific options
  data?: string
  minutes?: string
  texts?: string
  // Broadband specific options
  speed?: string
  // Bundle specific options
  bundleComponents?: string[]
  // Additional metadata
  isNew?: boolean
  isBestSeller?: boolean
  pageUrl?: string
}

export interface Cart {
  items: CartItem[]
  totalItems: number
  totalValue: number
  lastUpdated: number
}

export interface CartContextType {
  cart: Cart
  addToCart: (item: Omit<CartItem, "quantity">) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  isInCart: (itemId: string) => boolean
  getCartItem: (itemId: string) => CartItem | undefined
}
