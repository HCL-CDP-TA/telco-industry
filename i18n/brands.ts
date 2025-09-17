import { Smartphone, Radio, Wifi } from "lucide-react"
import { LucideIcon } from "lucide-react"

export interface SupportedBrand {
  key: string
  label: string
  icon: LucideIcon
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

const supportedBrands: SupportedBrand[] = [
  {
    key: "vodafone",
    label: "Vodafone",
    icon: Smartphone,
    primaryColor: "oklch(0.52 0.24 25)", // Vodafone red
    secondaryColor: "oklch(0.45 0.20 25)", // Darker red
    accentColor: "oklch(0.60 0.18 25)", // Lighter red accent
  },
  {
    key: "orange",
    label: "Orange",
    icon: Radio,
    primaryColor: "oklch(0.70 0.20 65)", // Orange brand color
    secondaryColor: "oklch(0.60 0.18 65)", // Darker orange
    accentColor: "oklch(0.80 0.15 65)", // Lighter orange accent
  },
  {
    key: "tmobile",
    label: "T-Mobile",
    icon: Wifi,
    primaryColor: "oklch(0.55 0.25 330)", // T-Mobile magenta
    secondaryColor: "oklch(0.45 0.22 330)", // Darker magenta
    accentColor: "oklch(0.65 0.20 330)", // Lighter magenta accent
  },
]

export { supportedBrands }
