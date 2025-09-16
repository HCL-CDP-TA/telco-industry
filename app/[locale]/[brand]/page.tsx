"use client"
import { useTranslations } from "next-intl"
import { useSiteContext } from "@/lib/SiteContext"
import { CdpPageEvent } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { usePageMeta } from "@/lib/hooks/usePageMeta"

export default function HomePage() {
  const { brand, locale, getPageNamespace } = useSiteContext()
  const pageNamespace = getPageNamespace()
  const t = useTranslations(pageNamespace)
  const { isCDPTrackingEnabled } = useCDPTracking()

  usePageMeta(t("meta.title"), t("meta.description"))

  return (
    <main>
      {isCDPTrackingEnabled && (
        <CdpPageEvent pageName={t("cdp.pageEventName")} pageProperties={{ brand: brand.label, locale: locale.code }} />
      )}
    </main>
  )
}
