import { supportedBrands } from "@/i18n/brands"
import { supportedLocales } from "@/i18n/locales"
import { getCurrencyConfig, CurrencyConfig } from "./currency"

export interface BrandLocaleConfig {
  brandKey: string
  localeCode: string
  currency: CurrencyConfig
  displayName: string
  isSupported: boolean
}

/**
 * Get currency configuration based on locale (brand-agnostic since all brands operate in all regions)
 */
export function getBrandCurrencyConfig(brandKey: string, localeCode: string): BrandLocaleConfig {
  const brand = supportedBrands.find(b => b.key === brandKey)
  const locale = supportedLocales.find(l => l.code === localeCode)

  // Since all brands are available in all regions, currency is purely locale-based
  const currencyConfig = getCurrencyConfig(localeCode)
  const displayName = brand?.label || brandKey
  const isSupported = locale?.visible !== false // All combinations are supported

  return {
    brandKey,
    localeCode,
    currency: currencyConfig,
    displayName,
    isSupported,
  }
}

/**
 * Get all brand-locale combinations with their currency configurations
 */
export function getAllBrandLocaleCombinations(): BrandLocaleConfig[] {
  const combinations: BrandLocaleConfig[] = []

  for (const brand of supportedBrands) {
    for (const locale of supportedLocales.filter(l => l.visible)) {
      combinations.push(getBrandCurrencyConfig(brand.key, locale.code))
    }
  }

  return combinations
}

/**
 * Get all supported locales (same for all brands since they operate globally)
 */
export function getBrandSupportedLocales(brandKey: string): string[] {
  // All brands support all visible locales (brandKey kept for API compatibility)
  void brandKey // Acknowledge parameter for API compatibility
  return supportedLocales.filter(l => l.visible).map(l => l.code)
}

/**
 * Check if a brand supports a specific locale (always true since all brands are global)
 */
export function isBrandLocaleSupported(brandKey: string, localeCode: string): boolean {
  // All brands are global (brandKey kept for API compatibility)
  void brandKey // Acknowledge parameter for API compatibility
  const locale = supportedLocales.find(l => l.code === localeCode)
  return locale?.visible !== false
}

/**
 * Get default locale for a brand (en-US as global default)
 */
export function getBrandDefaultLocale(brandKey: string): string {
  // All brands use same default (brandKey kept for API compatibility)
  void brandKey // Acknowledge parameter for API compatibility
  return "en-US"
}
