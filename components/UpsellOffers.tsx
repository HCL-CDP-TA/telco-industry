"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { formatPriceData } from "@/lib/priceFormatting"

export interface UpsellOffer {
  id: string
  productName: string
  headline: string
  subheadline: string
  price: number
  imageUrl: string
  paymentType: "upfront" | "monthly" // Whether this is a one-time or monthly charge
}

interface UpsellOffersProps {
  offers: UpsellOffer[]
  locale: string
  brandKey: string
  onSelectionChange: (selectedOffers: UpsellOffer[]) => void
  translations: {
    title: string
    perMonth: string
    oneTime: string
  }
}

export default function UpsellOffers({ offers, locale, brandKey, onSelectionChange, translations }: UpsellOffersProps) {
  const [selectedOffers, setSelectedOffers] = useState<Set<string>>(new Set())

  const toggleOffer = useCallback(
    (offer: UpsellOffer) => {
      setSelectedOffers(prev => {
        const newSelected = new Set(prev)
        if (newSelected.has(offer.id)) {
          newSelected.delete(offer.id)
        } else {
          newSelected.add(offer.id)
        }

        // Notify parent of selection change
        const selectedItems = offers.filter(o => newSelected.has(o.id))
        onSelectionChange(selectedItems)

        return newSelected
      })
    },
    [offers, onSelectionChange],
  )

  const isSelected = (offerId: string) => selectedOffers.has(offerId)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {offers.map(offer => (
          <div
            key={offer.id}
            onClick={() => toggleOffer(offer)}
            className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              isSelected(offer.id) ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-primary/50"
            }`}>
            {/* Image */}
            <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg overflow-hidden relative">
              <Image src={offer.imageUrl} alt={offer.productName} fill className="object-cover" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight">{offer.headline}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{offer.subheadline}</p>
            </div>

            {/* Price and Selection */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="text-right">
                <div className="font-bold text-sm">
                  {formatPriceData({ priceValue: offer.price }, locale, brandKey).price}
                </div>
                <div className="text-xs text-muted-foreground">
                  {offer.paymentType === "monthly" ? translations.perMonth : translations.oneTime}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected(offer.id) ? "bg-primary border-primary" : "border-muted-foreground/30 hover:border-primary"
                }`}>
                {isSelected(offer.id) && <Check className="w-4 h-4 text-primary-foreground" />}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
