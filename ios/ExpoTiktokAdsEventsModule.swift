import ExpoModulesCore
import TikTokBusinessSDK
import UIKit

public class ExpoTiktokAdsEventsModule: Module {
  
  private func addPropertiesToEvent(_ event: TikTokBaseEvent, properties: [[String: Any]]?) {
    properties?.forEach { prop in
        if let key = prop["key"] as? String,
           let value = prop["value"] {
            event.addProperty(withKey: key, value: value)
        }
    }
  }

  public func definition() -> ModuleDefinition {
    Name("TiktokAdsEvents")

      AsyncFunction("initializeSdk") { (accessToken: String, appId: String, tiktokAppId: String, debugModeEnabled: Bool) -> Bool in
        let config = TikTokConfig.init(accessToken: accessToken, appId: appId, tiktokAppId: tiktokAppId)
        config?.debugModeEnabled = debugModeEnabled
        config?.trackingEnabled = true
        config?.automaticTrackingEnabled = true
        let res = try await TikTokBusiness.initializeSdk(config)
        return res
    }
    
    AsyncFunction("getAnonymousID") { () -> String in
      return TikTokBusiness.getInstance().anonymousID
    }

    AsyncFunction("getAccessToken") { () -> String in
      return TikTokBusiness.getInstance().accessToken
    }

    AsyncFunction("getTestEventCode") { () -> String in
      return TikTokBusiness.getTestEventCode()
    }

    AsyncFunction("trackCustomEvent") { (eventName: String, eventID: String, properties: [[String: Any]]?) in
        let customEvent = TikTokBaseEvent(eventName: eventName, eventId: eventID)
        self.addPropertiesToEvent(customEvent, properties: properties)
        TikTokBusiness.trackTTEvent(customEvent)
        TikTokBusiness.explicitlyFlush()
    }
    
    AsyncFunction("trackTTEvent") { (eventKey: String, properties: [[String: Any]]?) -> String in
        let map: [String: String] = [
            "achieve_level": TTEventName.achieveLevel.rawValue,
            "add_payment_info": TTEventName.addPaymentInfo.rawValue,
            "complete_tutorial": TTEventName.completeTutorial.rawValue,
            "create_group": TTEventName.createGroup.rawValue,
            "create_role": TTEventName.createRole.rawValue,
            "generate_lead": TTEventName.generateLead.rawValue,
            "in_app_ad_click": TTEventName.inAppADClick.rawValue,
            "in_app_ad_impr": TTEventName.inAppADImpr.rawValue,
            "install_app": TTEventName.installApp.rawValue,
            "join_group": TTEventName.joinGroup.rawValue,
            "launch_app": TTEventName.launchAPP.rawValue,
            "loan_application": TTEventName.loanApplication.rawValue,
            "loan_approval": TTEventName.loanApproval.rawValue,
            "loan_disbursal": TTEventName.loanDisbursal.rawValue,
            "login": TTEventName.login.rawValue,
            "rate": TTEventName.rate.rawValue,
            "registration": TTEventName.registration.rawValue,
            "search": TTEventName.search.rawValue,
            "spend_credits": TTEventName.spendCredits.rawValue,
            "start_trial": TTEventName.startTrial.rawValue,
            "subscribe": TTEventName.subscribe.rawValue,
            "unlock_achievement": TTEventName.unlockAchievement.rawValue
        ]
        let resolved = map[eventKey] ?? eventKey
        let event = TikTokBaseEvent(name: resolved)
        self.addPropertiesToEvent(event, properties: properties)
        TikTokBusiness.explicitlyFlush()
        TikTokBusiness.trackTTEvent(event)
        TikTokBusiness.explicitlyFlush()
        
        return resolved
    }

    AsyncFunction("identify") { (externalId: String, externalUserName: String?, phoneNumber: String?, email: String?) in
        let name = externalUserName ?? ""
        let phone = phoneNumber ?? ""
        let mail = email ?? ""
        TikTokBusiness.identify(withExternalID: externalId, externalUserName: name, phoneNumber: phone, email: mail)
    }
      
  }
}
