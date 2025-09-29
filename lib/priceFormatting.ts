import { formatPrice, formatPriceString } from "./currency"

export interface PriceData {
  priceValue: number
  pricePrefix?: string
  priceSuffix?: string
  originalPriceValue?: number
  savingsValue?: number
  savingsPrefix?: string
  savingsSuffix?: string
}

/**
 * Format price data with brand and locale awareness
 */
export interface PriceDisplayData {
  price: string
  savings?: string
}

export function formatPriceData(
  item: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  localeCode: string,
  brandKey: string,
): PriceDisplayData {
  // Handle new structured format (priceValue, pricePrefix, priceSuffix)
  if (item.priceValue) {
    const basePrice = formatPrice(item.priceValue, localeCode, brandKey)

    let price = basePrice
    if (item.pricePrefix) {
      price = `${item.pricePrefix} ${price}`
    }
    if (item.priceSuffix) {
      price = `${price}${item.priceSuffix}`
    }

    let savings: string | undefined

    // Format savings if available
    if (item.savingsValue) {
      const baseSavings = formatPrice(item.savingsValue, localeCode, brandKey)
      savings = baseSavings
      if (item.savingsPrefix) {
        savings = `${item.savingsPrefix} ${savings}`
      }
      if (item.savingsSuffix) {
        savings = `${savings}${item.savingsSuffix}`
      }
    }

    return { price, savings }
  }

  // Handle legacy format (price: "From $1199")
  if (item.price) {
    const convertedPrice = formatPriceString(item.price, localeCode, brandKey)
    return {
      price: convertedPrice,
      savings: item.savings ? formatPriceString(item.savings, localeCode, brandKey) : undefined,
    }
  }

  return { price: "" }
}

/**
 * Convert legacy price string format to new price data format
 * This is for migration purposes
 */
export function migrateLegacyPrice(priceString: string): PriceData {
  // Extract numeric value
  const numericValue = parseInt(priceString.replace(/[^0-9]/g, ""), 10) || 0

  // Detect patterns
  const hasFrom = priceString.toLowerCase().includes("from")
  const hasSave = priceString.toLowerCase().includes("save")
  const hasMonth = priceString.includes("/month")

  return {
    priceValue: numericValue,
    pricePrefix: hasFrom ? "from" : hasSave ? "save" : undefined,
    priceSuffix: hasMonth ? "/month" : undefined,
  }
}
