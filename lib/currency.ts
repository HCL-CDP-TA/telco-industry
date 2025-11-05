export interface CurrencyConfig {
  symbol: string
  code: string
  locale: string
  displayName: string
}

// Currency configurations by locale (brand-agnostic)
const currencyMap: Record<string, CurrencyConfig> = {
  "en-US": { symbol: "$", code: "USD", locale: "en-US", displayName: "US Dollar" },
  "en-CA": { symbol: "C$", code: "CAD", locale: "en-CA", displayName: "Canadian Dollar" },
  "en-GB": { symbol: "£", code: "GBP", locale: "en-GB", displayName: "British Pound" },
  "en-AU": { symbol: "A$", code: "AUD", locale: "en-AU", displayName: "Australian Dollar" },
  "en-IN": { symbol: "₹", code: "INR", locale: "en-IN", displayName: "Indian Rupee" },
  fr: { symbol: "€", code: "EUR", locale: "fr-FR", displayName: "Euro" },
  "fr-CA": { symbol: "C$", code: "CAD", locale: "fr-CA", displayName: "Canadian Dollar" },
  es: { symbol: "€", code: "EUR", locale: "es-ES", displayName: "Euro" },
  de: { symbol: "€", code: "EUR", locale: "de-DE", displayName: "Euro" },
  it: { symbol: "€", code: "EUR", locale: "it-IT", displayName: "Euro" },
  en: { symbol: "$", code: "USD", locale: "en-US", displayName: "US Dollar" }, // fallback
}

export function getCurrencyConfig(localeCode: string, _brandKey?: string): CurrencyConfig {
  // brandKey is ignored since all brands use the same currency for a given locale
  void _brandKey // Acknowledge parameter for API compatibility
  return currencyMap[localeCode] || currencyMap["en"]
}

export function formatPrice(price: number, localeCode: string, brandKey?: string): string {
  const config = getCurrencyConfig(localeCode, brandKey)

  try {
    // Use Intl.NumberFormat for proper locale-aware formatting
    // Show decimals if the price has them (e.g., 9.99), hide if it's a whole number (e.g., 49)
    const hasDecimals = price % 1 !== 0
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: hasDecimals ? 2 : 0,
      maximumFractionDigits: hasDecimals ? 2 : 0,
    }).format(price)
  } catch {
    // Fallback to simple symbol + number if Intl fails
    return `${config.symbol}${price.toLocaleString()}`
  }
}

// Helper function to format price strings from language files
export function formatPriceString(priceString: string, localeCode: string, brandKey?: string): string {
  // Extract numeric value from the price string
  const numericValue = parsePriceValue(priceString)

  // Check if it's a monthly price
  const isMonthly = priceString.includes("/month")
  const hasSavings = priceString.includes("Save")
  const hasFrom = priceString.toLowerCase().includes("from")

  let formattedPrice = formatPrice(numericValue, localeCode, brandKey)

  // Add prefixes and suffixes back
  if (hasFrom) {
    formattedPrice = `From ${formattedPrice}`
  }
  if (hasSavings) {
    formattedPrice = `Save ${formattedPrice}`
  }
  if (isMonthly) {
    formattedPrice += "/month"
  }

  return formattedPrice
}

// Helper function to extract numeric value from price string
export function parsePriceValue(priceString: string): number {
  return parseInt(priceString.replace(/[^0-9]/g, ""))
}
