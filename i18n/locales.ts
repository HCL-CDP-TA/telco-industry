export interface SupportedLocale {
  code: string
  label: string
  fallbacks: string[]
  visible?: boolean
  region?: string
  defaultCurrency?: string
  currencySymbol?: string
}

const supportedLocales: SupportedLocale[] = [
  {
    code: "en",
    label: "English",
    fallbacks: [],
    visible: false,
    region: "US",
    defaultCurrency: "USD",
    currencySymbol: "$",
  },
  {
    code: "en-US",
    label: "English (US)",
    fallbacks: ["en"],
    visible: true,
    region: "US",
    defaultCurrency: "USD",
    currencySymbol: "$",
  },
  {
    code: "en-GB",
    label: "English (UK)",
    fallbacks: ["en"],
    visible: true,
    region: "GB",
    defaultCurrency: "GBP",
    currencySymbol: "£",
  },
  {
    code: "en-AU",
    label: "English (AU)",
    fallbacks: ["en"],
    visible: true,
    region: "AU",
    defaultCurrency: "AUD",
    currencySymbol: "A$",
  },
  {
    code: "en-CA",
    label: "English (Canada)",
    fallbacks: ["en"],
    visible: true,
    region: "CA",
    defaultCurrency: "CAD",
    currencySymbol: "C$",
  },
  {
    code: "en-IN",
    label: "English (India)",
    fallbacks: ["en"],
    visible: true,
    region: "IN",
    defaultCurrency: "INR",
    currencySymbol: "₹",
  },
  {
    code: "fr",
    label: "Français",
    fallbacks: ["en"],
    visible: true,
    region: "FR",
    defaultCurrency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "fr-CA",
    label: "Français (Canada)",
    fallbacks: ["fr", "en"],
    visible: true,
    region: "CA",
    defaultCurrency: "CAD",
    currencySymbol: "C$",
  },
  {
    code: "es",
    label: "Español",
    fallbacks: ["en"],
    visible: true,
    region: "ES",
    defaultCurrency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "de",
    label: "Deutsch",
    fallbacks: ["en"],
    visible: true,
    region: "DE",
    defaultCurrency: "EUR",
    currencySymbol: "€",
  },
  {
    code: "it",
    label: "Italiano",
    fallbacks: ["en"],
    visible: true,
    region: "IT",
    defaultCurrency: "EUR",
    currencySymbol: "€",
  },
]

export { supportedLocales }
