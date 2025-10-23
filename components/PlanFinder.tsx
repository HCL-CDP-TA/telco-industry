"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { useCdp } from "@hcl-cdp-ta/hclcdp-web-sdk-react"
import { useCDPTracking } from "@/lib/hooks/useCDPTracking"
import { Target, RotateCcw } from "lucide-react"

interface PlanFinderProps {
  plans: MobilePlan[]
  onPlanRecommendation?: (recommendedPlan: MobilePlan | null) => void
}

interface MobilePlan {
  id: string
  name: string
  price: string
  originalPrice?: string
  data: string
  minutes?: string
  texts?: string
  features?: string[]
  restrictions?: string[]
  network?: string
  speed?: string // For Italian locale compatibility
  isPopular?: boolean
  isUnlimited?: boolean
  discount?: string
  // Add properties for matching algorithm
  dataGB?: number
  minutesNum?: number
  textsNum?: number
  internationalLevel?: number
  networkLevel?: number
  isPrepaid?: boolean
}

interface UsageRequirements {
  monthlyData: number // GB
  callMinutes: number // minutes
  textMessages: number // SMS count
  internationalUsage: number // 0-3 scale
  networkPriority: number // 0-3 scale
  paymentPreference: number // 0=no preference, 1=prepaid, 2=postpaid
}

export default function PlanFinder({ plans, onPlanRecommendation }: PlanFinderProps) {
  const t = useTranslations("pages.mobilePlans.planFinder")
  const { track } = useCdp()
  const { isCDPTrackingEnabled } = useCDPTracking()

  const [requirements, setRequirements] = useState<UsageRequirements>({
    monthlyData: 15,
    callMinutes: 500,
    textMessages: 500,
    internationalUsage: 0,
    networkPriority: 1,
    paymentPreference: 0,
  })

  const [isExpanded, setIsExpanded] = useState(true) // Make visible by default

  // Enhanced plans with scoring data - memoized to prevent infinite re-renders
  const enhancedPlans: MobilePlan[] = useMemo(
    () =>
      plans.map(plan => ({
        ...plan,
        dataGB: plan.data === "Unlimited" || plan.data === "Illimitato" ? 999 : parseInt(plan.data) || 0,
        minutesNum:
          plan.minutes === "Unlimited" || plan.minutes === "Illimitati" ? 9999 : parseInt(plan.minutes || "0") || 0,
        textsNum: plan.texts === "Unlimited" || plan.texts === "Illimitati" ? 9999 : parseInt(plan.texts || "0") || 0,
        internationalLevel: (plan.features || []).some(
          f =>
            (f && f.toLowerCase().includes("international roaming")) ||
            (f && f.toLowerCase().includes("worldwide")) ||
            (f && f.toLowerCase().includes("roaming internazionale")),
        )
          ? 3
          : (plan.features || []).some(
              f => f && (f.toLowerCase().includes("international") || f.toLowerCase().includes("internazionale")),
            )
          ? 2
          : 0,
        networkLevel: (plan.network || plan.speed || "").includes("Ultra")
          ? 3
          : (plan.network || plan.speed || "").includes("5G")
          ? 2
          : 1,
        isPrepaid: plan.id.includes("prepaid"),
      })),
    [plans],
  )

  const calculatePlanMatch = (plan: MobilePlan, reqs: UsageRequirements): number => {
    let score = 0
    let maxScore = 0

    // Data requirement (30% weight)
    const dataWeight = 0.3
    const dataScore =
      plan.dataGB! >= reqs.monthlyData
        ? 1
        : plan.dataGB! >= reqs.monthlyData * 0.8
        ? 0.8
        : plan.dataGB! >= reqs.monthlyData * 0.6
        ? 0.6
        : 0.3
    score += dataScore * dataWeight
    maxScore += dataWeight

    // Minutes requirement (20% weight)
    const minutesWeight = 0.2
    const minutesScore =
      plan.minutesNum! >= reqs.callMinutes
        ? 1
        : plan.minutesNum! >= reqs.callMinutes * 0.8
        ? 0.8
        : plan.minutesNum! >= reqs.callMinutes * 0.6
        ? 0.6
        : 0.3
    score += minutesScore * minutesWeight
    maxScore += minutesWeight

    // SMS requirement (15% weight)
    const smsWeight = 0.15
    const smsScore =
      plan.textsNum! >= reqs.textMessages
        ? 1
        : plan.textsNum! >= reqs.textMessages * 0.8
        ? 0.8
        : plan.textsNum! >= reqs.textMessages * 0.6
        ? 0.6
        : 0.3
    score += smsScore * smsWeight
    maxScore += smsWeight

    // International requirement (5% weight)
    const intlWeight = 0.05
    const intlScore =
      plan.internationalLevel! >= reqs.internationalUsage
        ? 1
        : Math.max(0, 1 - (reqs.internationalUsage - plan.internationalLevel!) * 0.3)
    score += intlScore * intlWeight
    maxScore += intlWeight

    // Network priority (10% weight)
    const networkWeight = 0.1
    const networkScore =
      plan.networkLevel! >= reqs.networkPriority
        ? 1
        : Math.max(0, 1 - (reqs.networkPriority - plan.networkLevel!) * 0.3)
    score += networkScore * networkWeight
    maxScore += networkWeight

    // Payment preference (20% weight)
    const paymentWeight = 0.2
    let paymentScore = 1 // Default: no preference or perfect match
    if (reqs.paymentPreference === 1) {
      // Prefers prepaid - strong preference
      paymentScore = plan.isPrepaid ? 1 : 0.3
    } else if (reqs.paymentPreference === 2) {
      // Prefers postpaid - strong preference
      paymentScore = plan.isPrepaid ? 0.3 : 1
    }
    score += paymentScore * paymentWeight
    maxScore += paymentWeight

    return Math.round((score / maxScore) * 100)
  }

  const findBestPlan = useCallback(
    (reqs: UsageRequirements) => {
      const planScores = enhancedPlans.map(plan => ({
        plan,
        score: calculatePlanMatch(plan, reqs),
      }))

      // If user has a strong payment preference, filter and prioritize accordingly
      if (reqs.paymentPreference === 1) {
        // User prefers prepaid - find best prepaid plan first
        const prepaidPlans = planScores.filter(p => p.plan.isPrepaid)
        const postpaidPlans = planScores.filter(p => !p.plan.isPrepaid)

        if (prepaidPlans.length > 0) {
          const bestPrepaid = prepaidPlans.sort((a, b) => b.score - a.score)[0]
          const bestPostpaid = postpaidPlans.length > 0 ? postpaidPlans.sort((a, b) => b.score - a.score)[0] : null

          // Choose prepaid if it scores reasonably well (45% threshold) or if it's close to postpaid
          if (bestPrepaid.score >= 45 || !bestPostpaid || bestPrepaid.score >= bestPostpaid.score - 15) {
            onPlanRecommendation?.(bestPrepaid.plan)
            return bestPrepaid
          }
        }
      } else if (reqs.paymentPreference === 2) {
        // User prefers postpaid - find best postpaid plan first
        const prepaidPlans = planScores.filter(p => p.plan.isPrepaid)
        const postpaidPlans = planScores.filter(p => !p.plan.isPrepaid)

        if (postpaidPlans.length > 0) {
          const bestPostpaid = postpaidPlans.sort((a, b) => b.score - a.score)[0]
          const bestPrepaid = prepaidPlans.length > 0 ? prepaidPlans.sort((a, b) => b.score - a.score)[0] : null

          // Choose postpaid if it scores reasonably well (45% threshold) or if it's close to prepaid
          if (bestPostpaid.score >= 45 || !bestPrepaid || bestPostpaid.score >= bestPrepaid.score - 15) {
            onPlanRecommendation?.(bestPostpaid.plan)
            return bestPostpaid
          }
        }
      }

      // Default behavior: highest scoring plan regardless of payment type
      const bestMatch = planScores.sort((a, b) => b.score - a.score)[0]

      if (bestMatch && bestMatch.score >= 60) {
        onPlanRecommendation?.(bestMatch.plan)
      } else {
        onPlanRecommendation?.(null)
      }

      return bestMatch
    },
    [enhancedPlans, onPlanRecommendation],
  )

  const trackPlanConsideration = useCallback(
    async (reqs: UsageRequirements, recommendedPlan: MobilePlan | null, score: number) => {
      if (!isCDPTrackingEnabled) return

      // Get the actual text values for dropdown selections
      const internationalOptions: string[] = t.raw("usage.internationalUsage.options")
      const networkOptions: string[] = t.raw("usage.networkPriority.options")
      const paymentOptions: string[] = t.raw("usage.paymentPreference.options")

      await track({
        identifier: "Plan_Consider",
        properties: {
          monthlyDataGB: reqs.monthlyData,
          callMinutes: reqs.callMinutes,
          textMessages: reqs.textMessages,
          internationalUsage: internationalOptions[reqs.internationalUsage] || "Unknown",
          networkPriority: networkOptions[reqs.networkPriority] || "Unknown",
          paymentPreference: paymentOptions[reqs.paymentPreference] || "Unknown",
          recommendedPlan: recommendedPlan?.name || "No match",
          recommendedPlanId: recommendedPlan?.id || null,
          matchScore: score,
        },
      })
    },
    [isCDPTrackingEnabled, track, t],
  )

  const updateRequirements = (key: keyof UsageRequirements, value: number) => {
    const newReqs = { ...requirements, [key]: value }
    setRequirements(newReqs)
    // Remove automatic calculation - will be triggered manually
  }

  const calculateAndRecommend = useCallback(() => {
    const bestMatch = findBestPlan(requirements)
    trackPlanConsideration(requirements, bestMatch?.plan || null, bestMatch?.score || 0)

    // Scroll to customer status section after a short delay to allow for plan highlighting
    setTimeout(() => {
      const customerStatusSection = document.getElementById("customer-status-section")
      if (customerStatusSection) {
        customerStatusSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        })
      }
    }, 100)
  }, [findBestPlan, requirements, trackPlanConsideration])

  const resetRequirements = useCallback(() => {
    const defaultReqs = {
      monthlyData: 15,
      callMinutes: 500,
      textMessages: 500,
      internationalUsage: 0,
      networkPriority: 1,
      paymentPreference: 0,
    }
    setRequirements(defaultReqs)
    // Clear any existing recommendations
    onPlanRecommendation?.(null)
  }, [onPlanRecommendation])

  const getDataLabel = (value: number) => {
    if (value <= 2) return t("labels.dataUsage.light")
    if (value <= 15) return t("labels.dataUsage.moderate")
    if (value <= 50) return t("labels.dataUsage.heavy")
    return t("labels.dataUsage.unlimited")
  }

  const getMinutesLabel = (value: number) => {
    if (value <= 100) return t("labels.callMinutes.light")
    if (value <= 500) return t("labels.callMinutes.moderate")
    if (value <= 1000) return t("labels.callMinutes.heavy")
    return t("labels.callMinutes.unlimited")
  }

  const getSMSLabel = (value: number) => {
    if (value <= 100) return t("labels.textMessages.light")
    if (value <= 500) return t("labels.textMessages.moderate")
    if (value <= 1000) return t("labels.textMessages.heavy")
    return t("labels.textMessages.unlimited")
  }

  const internationalOptions: string[] = t.raw("usage.internationalUsage.options")

  const networkOptions: string[] = t.raw("usage.networkPriority.options")

  const paymentOptions: string[] = t.raw("usage.paymentPreference.options")

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            <div>
              <CardTitle>{t("title")}</CardTitle>
              <CardDescription>{t("subtitle")}</CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? t("controls.hide") : t("controls.show")}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Data Usage Slider */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.monthlyData.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.monthlyData.description")}</p>
              <div className="space-y-3">
                <Slider
                  value={[requirements.monthlyData]}
                  onValueChange={([value]) => updateRequirements("monthlyData", value)}
                  max={100}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("labels.dataUsage.min")}</span>
                  <span className="font-medium">{requirements.monthlyData}GB</span>
                  <span>{t("labels.dataUsage.max")}</span>
                </div>
                <p className="text-sm font-medium text-center">{getDataLabel(requirements.monthlyData)}</p>
              </div>
            </div>

            {/* Call Minutes Slider */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.callMinutes.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.callMinutes.description")}</p>
              <div className="space-y-3">
                <Slider
                  value={[requirements.callMinutes]}
                  onValueChange={([value]) => updateRequirements("callMinutes", value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("labels.callMinutes.min")}</span>
                  <span className="font-medium">{requirements.callMinutes} min</span>
                  <span>{t("labels.callMinutes.max")}</span>
                </div>
                <p className="text-sm font-medium text-center">{getMinutesLabel(requirements.callMinutes)}</p>
              </div>
            </div>

            {/* SMS Usage Slider */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.textMessages.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.textMessages.description")}</p>
              <div className="space-y-3">
                <Slider
                  value={[requirements.textMessages]}
                  onValueChange={([value]) => updateRequirements("textMessages", value)}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t("labels.textMessages.min")}</span>
                  <span className="font-medium">{requirements.textMessages} SMS</span>
                  <span>{t("labels.textMessages.max")}</span>
                </div>
                <p className="text-sm font-medium text-center">{getSMSLabel(requirements.textMessages)}</p>
              </div>
            </div>

            {/* International Usage */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.internationalUsage.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.internationalUsage.description")}</p>
              <Select
                value={requirements.internationalUsage.toString()}
                onValueChange={value => updateRequirements("internationalUsage", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {internationalOptions.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Network Priority */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.networkPriority.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.networkPriority.description")}</p>
              <Select
                value={requirements.networkPriority.toString()}
                onValueChange={value => updateRequirements("networkPriority", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {networkOptions.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Preference */}
            <div className="space-y-3">
              <Label className="text-base font-medium">{t("usage.paymentPreference.label")}</Label>
              <p className="text-sm text-muted-foreground">{t("usage.paymentPreference.description")}</p>
              <Select
                value={requirements.paymentPreference.toString()}
                onValueChange={value => updateRequirements("paymentPreference", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentOptions.map((option, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button variant="outline" onClick={resetRequirements} className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              {t("buttons.reset")}
            </Button>
            <Button onClick={calculateAndRecommend} className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t("buttons.findMyPlan")}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
