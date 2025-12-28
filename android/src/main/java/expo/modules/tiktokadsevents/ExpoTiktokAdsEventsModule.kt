package expo.modules.tiktokadsevents

import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import com.tiktok.TikTokBusinessSdk
import com.tiktok.TikTokBusinessSdk.TTConfig
import com.tiktok.TikTokBusinessSdk.LogLevel
import org.json.JSONObject

class ExpoTiktokAdsEventsModule : Module() {

  // Store accessToken since Android SDK doesn't expose it like iOS
  private var storedAccessToken: String = ""

  private val standardEventMap = mapOf(
    "achieve_level" to "AchieveLevel",
    "add_payment_info" to "AddPaymentInfo",
    "complete_tutorial" to "CompleteTutorial",
    "create_group" to "CreateGroup",
    "create_role" to "CreateRole",
    "generate_lead" to "GenerateLead",
    "in_app_ad_click" to "InAppADClick",
    "in_app_ad_impr" to "InAppADImpr",
    "install_app" to "InstallApp",
    "join_group" to "JoinGroup",
    "launch_app" to "LaunchAPP",
    "loan_application" to "LoanApplication",
    "loan_approval" to "LoanApproval",
    "loan_disbursal" to "LoanDisbursal",
    "login" to "Login",
    "rate" to "Rate",
    "registration" to "Registration",
    "search" to "Search",
    "spend_credits" to "SpendCredits",
    "start_trial" to "StartTrial",
    "subscribe" to "Subscribe",
    "unlock_achievement" to "UnlockAchievement"
  )

  private fun buildPropertiesJson(properties: List<Map<String, Any>>?): JSONObject? {
    if (properties == null || properties.isEmpty()) return null
    val json = JSONObject()
    properties.forEach { prop ->
      val key = prop["key"] as? String
      val value = prop["value"]
      if (key != null && value != null) {
        json.put(key, value)
      }
    }
    return json
  }

  override fun definition() = ModuleDefinition {
    Name("TiktokAdsEvents")

    AsyncFunction("initializeSdk") { accessToken: String, appId: String, tiktokAppId: String, debugModeEnabled: Boolean, promise: Promise ->
      try {
        val context = appContext.reactContext ?: throw Exception("React context is null")

        // Store accessToken for later retrieval
        storedAccessToken = accessToken

        val configBuilder = TTConfig(context)
          .setAppId(appId)
          .setTTAppId(tiktokAppId)

        if (debugModeEnabled) {
          configBuilder.setLogLevel(LogLevel.DEBUG)
          configBuilder.openDebugMode()
        }

        TikTokBusinessSdk.initializeSdk(configBuilder)
        promise.resolve(true)
      } catch (e: Exception) {
        Log.e("TiktokAdsEvents", "Error initializing SDK: ${e.message}", e)
        promise.reject("INIT_ERROR", e.message, e)
      }
    }

    AsyncFunction("getAnonymousID") { promise: Promise ->
      try {
        // Android SDK uses getSessionID() as equivalent to iOS anonymousID
        val sessionId = TikTokBusinessSdk.getSessionID() ?: ""
        promise.resolve(sessionId)
      } catch (e: Exception) {
        promise.reject("ERROR", e.message, e)
      }
    }

    AsyncFunction("getAccessToken") { promise: Promise ->
      try {
        // Return the stored accessToken from initialization
        promise.resolve(storedAccessToken)
      } catch (e: Exception) {
        promise.reject("ERROR", e.message, e)
      }
    }

    AsyncFunction("getTestEventCode") { promise: Promise ->
      try {
        val code = TikTokBusinessSdk.getTestEventCode() ?: ""
        promise.resolve(code)
      } catch (e: Exception) {
        promise.reject("ERROR", e.message, e)
      }
    }

    AsyncFunction("trackCustomEvent") { eventName: String, eventID: String, properties: List<Map<String, Any>>?, promise: Promise ->
      try {
        val propsJson = buildPropertiesJson(properties)
        if (propsJson != null) {
          TikTokBusinessSdk.trackEvent(eventName, propsJson)
        } else {
          TikTokBusinessSdk.trackEvent(eventName)
        }
        TikTokBusinessSdk.flush()
        promise.resolve(null)
      } catch (e: Exception) {
        Log.e("TiktokAdsEvents", "Error tracking custom event: ${e.message}", e)
        promise.reject("TRACK_ERROR", e.message, e)
      }
    }

    AsyncFunction("trackTTEvent") { eventKey: String, properties: List<Map<String, Any>>?, promise: Promise ->
      try {
        val resolved = standardEventMap[eventKey] ?: eventKey
        val propsJson = buildPropertiesJson(properties)

        if (propsJson != null) {
          TikTokBusinessSdk.trackEvent(resolved, propsJson)
        } else {
          TikTokBusinessSdk.trackEvent(resolved)
        }
        TikTokBusinessSdk.flush()

        promise.resolve(resolved)
      } catch (e: Exception) {
        Log.e("TiktokAdsEvents", "Error tracking event: ${e.message}", e)
        promise.reject("TRACK_ERROR", e.message, e)
      }
    }

    AsyncFunction("identify") { externalId: String, externalUserName: String?, phoneNumber: String?, email: String?, promise: Promise ->
      try {
        TikTokBusinessSdk.identify(
          externalId,
          externalUserName ?: "",
          phoneNumber ?: "",
          email ?: ""
        )
        promise.resolve(null)
      } catch (e: Exception) {
        Log.e("TiktokAdsEvents", "Error identifying user: ${e.message}", e)
        promise.reject("IDENTIFY_ERROR", e.message, e)
      }
    }
  }
}
