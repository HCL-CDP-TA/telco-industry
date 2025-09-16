import { useTrackingType } from "./useTrackingType"

/**
 * Custom hook to check if CDP tracking is active.
 * Returns true only if the tracking type is 'cdp'.
 */
export const useCDPTracking = () => {
  const { trackingType, isLoading } = useTrackingType()

  const isCDPTrackingEnabled = !isLoading && trackingType === "cdp"

  return {
    isCDPTrackingEnabled,
    isLoading,
  }
}
