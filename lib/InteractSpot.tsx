// Interact Web Page Spot
// Default configuration setting
import InteractAPI, { type InteractCommand } from "./InteractApi"

// Define proper typing for InteractAPI
interface InteractAPIWithCommandUtil {
  init: (config: { url: string }) => void
  CommandUtil: {
    createPostEventCmd: (event: string, data: NameValuePair[]) => InteractCommand
    createGetOffersCmd: (interactionPoint: string, maxOffers: number) => InteractCommand
    createStartSessionCmd: (
      icName: string,
      visitor: NameValuePair[],
      audLevel: string,
      sessionVars: NameValuePair[],
      relyOldSs: boolean,
      debug: boolean,
    ) => InteractCommand
    createSetAudienceCmd: (audience: NameValuePair[], audLevel: string, data: NameValuePair[]) => InteractCommand
    createGetProfileCmd: () => InteractCommand
  }
  Callback: {
    create: (successCallback: unknown, errorCallback: unknown) => unknown
  }
  execute: (commands: InteractCommand[], callback?: unknown) => void
  executeBatch: (sessionId: string, commands: InteractCommand[], callback?: unknown) => void
  postEvent: (sessionId: string, event: string, params: NameValuePair[] | null, callback: unknown) => void
  NameValuePair: {
    create: (name: string, value: unknown, type: string) => NameValuePair
    prototype: {
      TypeEnum: {
        NUMERIC: string
      }
    }
  }
}

// Type definitions
interface SpotConfig {
  event?: string
  eventVars?: string
  interactionPoint?: string
  maxNumOffers?: number
  renderFunction?: (spotId: string, response: InteractResponse) => void
  errorCallback?: (error: unknown) => void // Add error callback support
}

interface AudienceConfig {
  audId?: string
  audLevel?: number
  serverUrl?: string
  visitorAudLvl?: number
  customerAudLvl?: number
  visitorAudID?: string
  acceptEvent?: string
  timeout?: number
  sessionCookie?: string
  startSession?: boolean
  newVisitor?: boolean
  setAudience?: boolean
  prevAudId?: string
  ssId?: string
  icName?: string
  visitorAltIDVar?: string
  sessVars?: string
  debug?: boolean
  idMgmt?: boolean
  prevAudIdVar?: string
  customerAud?: string
  customerAudType?: string
}

interface GlobalConfig extends AudienceConfig {
  [spotId: string]: SpotConfig | unknown
}

interface InteractResponse {
  responses?: ResponseItem[]
  batchStatusCode?: number
}

interface ResponseItem {
  profile?: ProfileItem[]
  messages?: MessageItem[]
}

interface ProfileItem {
  n: string
  v: string | number | boolean
}

interface MessageItem {
  msg: string
}

interface OfferAttribute {
  n: string
  v: string | number | boolean
}

interface NameValuePair {
  n: string
  v: string | number | boolean | null
  t: string
}

// Helper to safely access spot config
const getSpotConfig = (spotId: string): SpotConfig => {
  const config = confObj[spotId]
  return typeof config === "object" && config !== null ? (config as SpotConfig) : {}
}

let confObj: GlobalConfig = {}

// Utility functions
const logMsg = (message: string): void => {
  if (confObj.debug) {
    console.log("[InteractClient] " + message)
  }
}

const dummyCallback = (): void => undefined

const onError = (error: unknown): void => {
  logMsg("Error occurred: " + JSON.stringify(error))
}

const renderDefaultOffer = (): void => undefined

// Main functions
const postEventAndGetOffers = (spotId: string, aud?: AudienceConfig, conf?: SpotConfig): void => {
  updateConf(spotId, aud, conf)
  const spotConfig = getSpotConfig(spotId)

  if (confObj.serverUrl == null) {
    logMsg("Error: Interact server URL is not configured")
    return
  } else {
    ;(InteractAPI as unknown as InteractAPIWithCommandUtil).init({ url: confObj.serverUrl })
  }

  checkSession()

  const calls: InteractCommand[] = []
  sessionCalls(calls)

  calls.push(
    (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createPostEventCmd(
      spotConfig.event || "",
      getNameValuePairs(spotConfig.eventVars || "") || [],
    ),
  )

  calls.push(
    (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createGetOffersCmd(
      spotConfig.interactionPoint || "",
      spotConfig.maxNumOffers || 0,
    ),
  )

  // Create custom callback that handles both single response and batch response structures
  const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(
    (response: InteractResponse) => {
      let responseWithOffers = response

      // Check if this is a batch response with multiple responses
      if (response && response.responses && Array.isArray(response.responses) && response.responses.length > 0) {
        // Try to find a response that has offers with actual offer data
        const responseHasOffers = (resp: unknown): boolean => {
          const r = resp as { offerList?: unknown[]; offerLists?: unknown[] }

          // Check offerLists (plural) - more common in some environments
          if (r.offerLists && Array.isArray(r.offerLists) && r.offerLists.length > 0) {
            // Check if any offerList has actual offers
            return r.offerLists.some((list: unknown) => {
              const offerList = list as { offers?: unknown[] }
              return offerList.offers && Array.isArray(offerList.offers) && offerList.offers.length > 0
            })
          }

          // Check offerList (singular) - fallback for production environment
          if (r.offerList && Array.isArray(r.offerList) && r.offerList.length > 0) {
            return r.offerList.some((list: unknown) => {
              const offerList = list as { offers?: unknown[] }
              return offerList.offers && Array.isArray(offerList.offers) && offerList.offers.length > 0
            })
          }

          return false
        }

        // Find the first response with offers
        const foundResponse = response.responses.find(responseHasOffers)

        if (foundResponse) {
          responseWithOffers = foundResponse as unknown as InteractResponse
        } else {
          // If no response has offers, use the last response (fallback)
          responseWithOffers = response.responses[response.responses.length - 1] as unknown as InteractResponse
        }
      }
      // If it's not a batch response, use the response as-is

      if (spotConfig.renderFunction && responseWithOffers) {
        spotConfig.renderFunction(spotId, responseWithOffers)
      }
    },
    (error: unknown) => {
      if (spotConfig.errorCallback) {
        spotConfig.errorCallback(error)
      } else {
        renderDefaultOffer()
      }
    },
  )

  executeTransformedBatch(confObj.ssId || "", calls, callback)
}

const postEvent = (spotId: string, aud?: AudienceConfig, conf?: SpotConfig): void => {
  updateConf(spotId, aud, conf)
  const spotConfig = getSpotConfig(spotId)

  if (confObj.serverUrl == null) {
    logMsg("Error: Interact server URL is not configured")
    return
  } else {
    ;(InteractAPI as unknown as InteractAPIWithCommandUtil).init({ url: confObj.serverUrl })
  }

  checkSession()

  const calls: InteractCommand[] = []
  sessionCalls(calls)

  calls.push(
    (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createPostEventCmd(
      spotConfig.event || "",
      getNameValuePairs(spotConfig.eventVars || "") || [],
    ),
  )

  const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(
    audienceSwitch,
    onErrorCallback,
  )

  executeTransformedBatch(confObj.ssId || "", calls, callback)
}

const postAccept = (treatment: string): void => {
  logMsg("In AcceptEvent " + treatment)
  const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(dummyCallback, onError)

  checkSession()

  const calls: InteractCommand[] = []
  sessionCalls(calls)

  calls.push(
    (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createPostEventCmd(
      confObj.acceptEvent || "",
      getNameValuePairs(treatment) || [],
    ),
  )
  executeTransformedBatch(confObj.ssId || "", calls, callback)
}

const postPresentEvent = (params: string): void => {
  logMsg("In ContactEvent " + params)
  const trackingCode = "UACIOfferTrackingCode," + params + ",string"

  const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(dummyCallback, onError)
  ;(InteractAPI as unknown as InteractAPIWithCommandUtil).postEvent(
    confObj.ssId || "",
    "contact",
    getNameValuePairs(trackingCode),
    callback,
  )
}

const getOffers = (spotId: string, aud?: AudienceConfig, conf?: SpotConfig): void => {
  updateConf(spotId, aud, conf)
  const spotConfig = getSpotConfig(spotId)

  if (confObj.serverUrl == null) {
    logMsg(" Error: Interact server URL is not configured")
    return
  } else {
    ;(InteractAPI as unknown as InteractAPIWithCommandUtil).init({ url: confObj.serverUrl })
  }

  checkSession()

  const calls: InteractCommand[] = []

  // Check for existing sessionId in sessionStorage (server-provided GUID only)
  const existingSessionId = sessionStorage.getItem("sessionId")

  // If no sessionId exists, need to start a session first
  if (!existingSessionId) {
    sessionCalls(calls)
  }

  // Only add the getOffers command - no postEvent needed
  calls.push(
    (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createGetOffersCmd(
      spotConfig.interactionPoint || "",
      spotConfig.maxNumOffers || 0,
    ),
  )

  const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(
    (response: InteractResponse) => {
      if (spotConfig.renderFunction) {
        spotConfig.renderFunction(spotId, response)
      }
    },
    (error: unknown) => {
      if (spotConfig.errorCallback) {
        spotConfig.errorCallback(error)
      } else {
        renderDefaultOffer()
      }
    },
  )

  executeTransformedBatch(confObj.ssId || "", calls, callback)
}

const checkSession = (): void => {
  if (!confObj.audId) {
    logMsg("Error: Audience ID is not configured")
    return
  }

  const currAudId = sessionStorage.getItem("audId")
  const isNewVisitor = !currAudId && confObj.audLevel === confObj.visitorAudLvl
  const formattedAudId = confObj.audId.replaceAll(",", "|")

  if (!currAudId) {
    sessionStorage.setItem("audId", formattedAudId)
    confObj.startSession = true
    confObj.newVisitor = isNewVisitor
    return
  }

  const restoredAudId = currAudId.replaceAll("|", ",")
  if (restoredAudId !== confObj.audId) {
    const [currKey, audKey, visitorKey] = [
      restoredAudId.split(",")[0],
      confObj.audId.split(",")[0],
      confObj.visitorAudID ? confObj.visitorAudID.split(",")[0] : "",
    ]

    if (audKey === visitorKey && currKey !== visitorKey) {
      confObj.audId = restoredAudId
      confObj.audLevel = confObj.customerAudLvl
    } else {
      confObj.setAudience = true
      confObj.prevAudId = restoredAudId
      sessionStorage.setItem("audId", formattedAudId)
    }
  }

  const savedSess = sessionStorage.getItem("ssId")
  const savedTime = sessionStorage.getItem("ssTs")
  const currentTime = new Date().getTime()

  // Only check for timeout, don't generate new session IDs client-side
  if (!savedSess || (savedTime && currentTime - parseInt(savedTime) > 1000 * 60 * (confObj.timeout || 30))) {
    console.log("Session expired or not found, will start new session")
    confObj.startSession = true
    // Clear old session data
    sessionStorage.removeItem("ssId")
    sessionStorage.removeItem("ssTs")
    sessionStorage.removeItem("sessionId")
  } else {
    confObj.ssId = savedSess
    sessionStorage.setItem("ssTs", currentTime.toString())
  }
}

// Helper function to transform commands to match the required payload format
const transformCommandToAction = (command: InteractCommand, userId?: string): Record<string, unknown> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmd = command as any

  if (cmd.command === "startSession") {
    return {
      action: "startSession",
      ic: cmd.session || "Banking Web Site",
      audienceID: userId
        ? [{ n: "CustomerID", v: userId, t: "numeric" }]
        : cmd.visitor || [{ n: "VisitorID", v: "0", t: "string" }],
      audienceLevel: userId ? "Customer" : "Visitor",
      relyOnExistingSession: true,
      debug: true,
      parameters: [{ n: "UACIWaitForSegmentation", v: "true", t: "string" }],
    }
  } else if (cmd.command === "getOffers") {
    return {
      action: "getOffers",
      ip: cmd.interactionPoint || "ipMortgage",
      numberRequested: cmd.data || 1,
    }
  } else if (cmd.command === "postEvent") {
    return {
      action: "postEvent",
      event: cmd.event,
      data: cmd.parameters || [],
    }
  } else if (cmd.command === "setAudience") {
    // Skip setAudience commands for visitors when not signed in, as audience info should be in startSession
    const userId = getCurrentUserId()
    if (!userId && cmd.level === "Visitor") {
      // Return an empty object with a skip flag to indicate this command should be filtered out
      return { _skip: true }
    }
    return {
      action: "setAudience",
      audience: cmd.audience || [],
      level: cmd.level || "Customer",
      data: cmd.data || [],
    }
  }

  // For other commands, transform command -> action and pass through
  return {
    ...cmd,
    action: cmd.command,
    command: undefined,
  }
}

// Get current user ID for audience configuration
const getCurrentUserId = (): string => {
  if (typeof window === "undefined") return ""

  try {
    // Look for any brand_customer_data key pattern
    const keys = Object.keys(localStorage).filter(key => key.endsWith("_customer_data"))
    if (keys.length > 0) {
      const customerData = JSON.parse(localStorage.getItem(keys[0]) || "{}")
      const userId = customerData?.loginData?.id || ""
      console.log("getCurrentUserId found:", userId, "from key:", keys[0])
      return userId
    }
  } catch (error) {
    console.log("Error getting current user ID:", error)
  }
  console.log("getCurrentUserId: no user found")
  return ""
}

// Wrapper for executeBatch to transform commands
const executeTransformedBatch = (sessionId: string, commands: InteractCommand[], callback: unknown): void => {
  const userId = getCurrentUserId()

  // Check for existing sessionId in sessionStorage first
  const existingSessionId = sessionStorage.getItem("sessionId")

  // For testing: you can temporarily override the userId here
  // const userId = "1" // Uncomment this line to force user ID to "1"

  console.log("executeTransformedBatch using userId:", userId)
  console.log("executeTransformedBatch using stored sessionId:", existingSessionId)

  // Transform all commands (including postEvent) and filter out skipped commands
  const transformedCommands = commands
    .map(cmd => transformCommandToAction(cmd, userId))
    .filter(cmd => !(cmd as Record<string, unknown> & { _skip?: boolean })?._skip)

  // Create custom payload structure
  // Only include sessionId if we have one from a previous startSession response
  const payload: { sessionId?: string; commands: unknown[] } = {
    commands: transformedCommands,
  }

  if (existingSessionId) {
    payload.sessionId = existingSessionId
  }

  console.log("Final payload:", JSON.stringify(payload, null, 2))

  // Send the transformed payload directly
  if (confObj.serverUrl) {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", `${confObj.serverUrl}/servlet/RestServlet`, true)
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8")

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            console.log("Response received:", JSON.stringify(response, null, 2))

            // Extract and store sessionId from any response that contains it
            if (response && response.responses && Array.isArray(response.responses)) {
              response.responses.forEach((responseItem: ResponseItem & { sessionId?: string }) => {
                if (responseItem.sessionId) {
                  sessionStorage.setItem("sessionId", responseItem.sessionId)
                  sessionStorage.setItem("ssId", responseItem.sessionId)
                  sessionStorage.setItem("ssTs", new Date().getTime().toString())
                  console.log("Stored sessionId from response:", responseItem.sessionId)
                }
              })
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (callback && typeof (callback as any).successCb === "function") {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(callback as any).successCb(response)
            }
          } catch (error) {
            console.error("Error parsing response:", error)
          }
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (callback && typeof (callback as any).failureCb === "function") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ;(callback as any).failureCb(xhr.responseText)
          }
        }
      }
    }

    xhr.send(JSON.stringify(payload))
  }
} // Helper function to create transformed startSession command
const createStartSessionCmdWithIC = (
  session: string,
  visitor: NameValuePair[],
  data: string,
  options: NameValuePair[],
  profile: boolean,
  events: boolean,
): InteractCommand => {
  const command = (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createStartSessionCmd(
    session,
    visitor,
    data,
    options,
    profile,
    events,
  )

  return command
}

const sessionCalls = (calls: InteractCommand[]): void => {
  if (confObj.startSession) {
    const relyOldSs = true
    const audParts = confObj.audId ? confObj.audId.split(",") : []

    if (confObj.newVisitor) {
      const altID = `${confObj.visitorAltIDVar},${audParts[1] || ""},${audParts[2] || ""}`
      calls.push(
        createStartSessionCmdWithIC(
          confObj.icName || "",
          getNameValuePairs(confObj.visitorAudID || "") || [],
          String(confObj.visitorAudLvl || ""),
          getNameValuePairs(`${altID};${confObj.sessVars || ""}`) || [],
          relyOldSs,
          confObj.debug || false,
        ),
      )

      calls.push(
        (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createSetAudienceCmd(
          getNameValuePairs(confObj.audId || "") || [],
          String(confObj.audLevel || ""),
          getNameValuePairs("") || [],
        ),
      )

      if (confObj.idMgmt) {
        calls.push((InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createGetProfileCmd())
      }
    } else {
      calls.push(
        createStartSessionCmdWithIC(
          confObj.icName || "",
          getNameValuePairs(confObj.audId || "") || [],
          String(confObj.audLevel || ""),
          getNameValuePairs(confObj.sessVars || "") || [],
          relyOldSs,
          confObj.debug || false,
        ),
      )
    }
  } else if (confObj.setAudience) {
    const parms = confObj.prevAudIdVar
      ? `${confObj.prevAudIdVar},${confObj.prevAudId ? confObj.prevAudId.replaceAll(",", "|") : ""},string`
      : ""

    calls.push(
      (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createSetAudienceCmd(
        getNameValuePairs(confObj.audId || "") || [],
        String(confObj.audLevel || ""),
        getNameValuePairs(parms) || [],
      ),
    )

    if (confObj.idMgmt) {
      calls.push((InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createGetProfileCmd())
    }
  }
}

const audienceSwitch = (response: InteractResponse): void => {
  const respList = response.responses

  if (respList) {
    respList.forEach((responseItem: ResponseItem) => {
      if (responseItem.profile) {
        const profileList = responseItem.profile
        logMsg("Reading profile")

        const profile = profileList.find((p: ProfileItem) => p.n === confObj.customerAud)
        if (profile && profile.v.toString().length > 1) {
          const audID = `${confObj.customerAud},${profile.v},${confObj.customerAudType}`
          const calls = [
            (InteractAPI as unknown as InteractAPIWithCommandUtil).CommandUtil.createSetAudienceCmd(
              getNameValuePairs("") || [],
              String(confObj.customerAudLvl || ""),
              getNameValuePairs(audID) || [],
            ),
          ]

          const callback = (InteractAPI as unknown as InteractAPIWithCommandUtil).Callback.create(
            dummyCallback,
            onErrorCallback,
          )
          executeTransformedBatch(confObj.ssId || "", calls, callback)
        }
      }
    })
  }
}

const getOfferAttrValue = (offerAttrs: OfferAttribute[], offerName: string): string | number | boolean => {
  const foundOffer = offerAttrs.find(attr => attr.n.toLowerCase() === offerName.toLowerCase())
  return foundOffer ? foundOffer.v : ""
}

const getNameValuePairs = (parameters: string): NameValuePair[] | null => {
  if (parameters === "") return null

  return parameters.split(";").map(part => {
    const nvp1 = part.split(",")
    const nvp: [string, string | number | boolean | null, string] = [nvp1[0], null, nvp1[nvp1.length - 1]]

    // Combine the middle parts of nvp1 to form the value
    const value = nvp1.slice(1, -1).join(",")

    // Handle numeric type
    if (
      nvp[2] === (InteractAPI as unknown as InteractAPIWithCommandUtil).NameValuePair.prototype.TypeEnum.NUMERIC &&
      !isNaN(Number(value))
    ) {
      nvp[1] = Number(value)
    } else {
      nvp[1] = value
    }

    // Special handling for NULL value
    if (nvp[1] && typeof nvp[1] === "string" && nvp[1].toUpperCase() === "NULL") {
      nvp[1] = null
    }

    return (InteractAPI as unknown as InteractAPIWithCommandUtil).NameValuePair.create(nvp[0], nvp[1], nvp[2])
  })
}

const onErrorCallback = (response: InteractResponse): void => {
  const respList = response.responses

  if (response.batchStatusCode && response.batchStatusCode > 0) {
    logMsg("API call(s) failed")
    if (respList) {
      respList.forEach((resp: ResponseItem) => {
        if (resp.messages) {
          resp.messages.forEach((message: MessageItem) => logMsg("   " + message.msg))
        }
      })
    }
    sessionStorage.setItem("ssTs", "0")
    return
  }
}

const updateConf = (spotId: string, aud?: AudienceConfig, conf?: SpotConfig): void => {
  if (aud) {
    Object.keys(aud).forEach(key => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(confObj as any)[key] = (aud as any)[key]
    })
  }
  if (conf) {
    confObj[spotId] = conf
  }
}

const setConfig = (config: GlobalConfig): void => {
  confObj = config
}

export {
  audienceSwitch,
  checkSession,
  dummyCallback,
  getNameValuePairs,
  getOfferAttrValue,
  getOffers,
  logMsg,
  onErrorCallback,
  postAccept,
  postEvent,
  postEventAndGetOffers,
  postPresentEvent,
  sessionCalls,
  setConfig,
  updateConf,
}

// Export types for external use
export type {
  SpotConfig,
  AudienceConfig,
  GlobalConfig,
  InteractResponse,
  ResponseItem,
  ProfileItem,
  MessageItem,
  OfferAttribute,
}
