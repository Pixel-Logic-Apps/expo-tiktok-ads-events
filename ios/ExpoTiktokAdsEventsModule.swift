import ExpoModulesCore
import TikTokBusinessSDK
import os

public class TiktokAdsEventsModule: Module {
    
  private let logger = Logger(subsystem: "com.expo.tiktok-ads-events", category: "TiktokAdsEvents")

  public func definition() -> ModuleDefinition {
    Name("TiktokAdsEvents")

    AsyncFunction("initializeSdk") { (accessToken: String, appId: String, tiktokAppId: String, promise: Promise) in
        let config = TikTokConfig.init(accessToken: accessToken, appId: appId, tiktokAppId: tiktokAppId)
        TikTokBusiness.initializeSdk(config){ success, error in
          if (success) {
              TikTokBusiness.setTrackingEnabled(true);
              self.logger.info("initialization successful")
              promise.resolve("initialization successful")
          } else {
              let message = error?.localizedDescription ?? "unknown"
              self.logger.error("\(message, privacy: .public)")
              promise.reject("ERR_TIKTOK_INIT", message)
          }
        }
    }
    
    AsyncFunction("trackTTEvent") { (eventKey: String) -> String in
        let map: [String: String] = [
            "achieve_level": TTEventNameAchieveLevel,
            "add_payment_info": TTEventNameAddPaymentInfo,
            "complete_tutorial": TTEventNameCompleteTutorial,
            "create_group": TTEventNameCreateGroup,
            "create_role": TTEventNameCreateRole,
            "generate_lead": TTEventNameGenerateLead,
            "in_app_ad_click": TTEventNameInAppADClick,
            "in_app_ad_impr": TTEventNameInAppADImpr,
            "install_app": TTEventNameInstallApp,
            "join_group": TTEventNameJoinGroup,
            "launch_app": TTEventNameLaunchAPP,
            "loan_application": TTEventNameLoanApplication,
            "loan_approval": TTEventNameLoanApproval,
            "loan_disbursal": TTEventNameLoanDisbursal,
            "login": TTEventNameLogin,
            "rate": TTEventNameRate,
            "registration": TTEventNameRegistration,
            "search": TTEventNameSearch,
            "spend_credits": TTEventNameSpendCredits,
            "start_trial": TTEventNameStartTrial,
            "subscribe": TTEventNameSubscribe,
            "unlock_achievement": TTEventNameUnlockAchievement
        ]
        let resolved = map[eventKey] ?? eventKey
        TikTokBusiness.trackTTEvent(TikTokBaseEvent(name: resolved))
        return TikTokBusiness.getTestEventCode()
    }
  }
}
