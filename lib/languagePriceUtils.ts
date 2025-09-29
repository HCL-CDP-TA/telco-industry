import { formatPriceString } from "./currency"
import { getBrandCurrencyConfig } from "./brandCurrencyUtils"

/**
 * Process language file data to replace hardcoded currency strings with dynamic formatting
 */
export function processLanguageData(
  data: Record<string, unknown>,
  localeCode: string,
  brandKey: string,
): Record<string, unknown> {
  const processed = JSON.parse(JSON.stringify(data)) // Deep clone

  function processObject(obj: unknown): unknown {
    if (typeof obj === "string") {
      // Check if this string contains a price pattern
      if (isPriceString(obj)) {
        return formatPriceString(obj, localeCode, brandKey)
      }
      return obj
    } else if (Array.isArray(obj)) {
      return obj.map(item => processObject(item))
    } else if (obj && typeof obj === "object") {
      const result: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(obj)) {
        result[key] = processObject(value)
      }
      return result
    }
    return obj
  }

  return processObject(processed) as Record<string, unknown>
}

/**
 * Check if a string appears to contain price information
 */
function isPriceString(str: string): boolean {
  // Common price patterns
  const pricePatterns = [
    /\$\d+/, // $123
    /€\d+/, // €123
    /£\d+/, // £123
    /₹\d+/, // ₹123
    /C\$\d+/, // C$123
    /A\$\d+/, // A$123
    /From \$\d+/i, // From $123
    /Save \$\d+/i, // Save $123
    /\$\d+\/month/i, // $123/month
  ]

  return pricePatterns.some(pattern => pattern.test(str))
}

/**
 * Extract all price strings from a language file for migration purposes
 */
export function extractPriceStrings(
  data: Record<string, unknown>,
  path: string = "",
): Array<{ path: string; value: string }> {
  const prices: Array<{ path: string; value: string }> = []

  function traverse(obj: unknown, currentPath: string) {
    if (typeof obj === "string" && isPriceString(obj)) {
      prices.push({ path: currentPath, value: obj })
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        traverse(item, `${currentPath}[${index}]`)
      })
    } else if (obj && typeof obj === "object") {
      for (const [key, value] of Object.entries(obj)) {
        const newPath = currentPath ? `${currentPath}.${key}` : key
        traverse(value, newPath)
      }
    }
  }

  traverse(data, path)
  return prices
}

/**
 * Generate a migration report showing how prices will be converted
 */
export function generatePriceMigrationReport(data: Record<string, unknown>, localeCode: string, brandKey: string) {
  const priceStrings = extractPriceStrings(data)
  const brandConfig = getBrandCurrencyConfig(brandKey, localeCode)

  return {
    brandKey,
    localeCode,
    currency: brandConfig.currency,
    isSupported: brandConfig.isSupported,
    totalPrices: priceStrings.length,
    conversions: priceStrings.map(({ path, value }) => ({
      path,
      original: value,
      converted: formatPriceString(value, localeCode, brandKey),
      extracted: value.replace(/[^0-9]/g, ""),
    })),
  }
}
