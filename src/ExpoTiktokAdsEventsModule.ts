import { NativeModule, requireNativeModule } from 'expo';

export const TikTokStandardEvents = {
  achieve_level: 'achieve_level',
  add_payment_info: 'add_payment_info',
  complete_tutorial: 'complete_tutorial',
  create_group: 'create_group',
  create_role: 'create_role',
  generate_lead: 'generate_lead',
  in_app_ad_click: 'in_app_ad_click',
  in_app_ad_impr: 'in_app_ad_impr',
  install_app: 'install_app',
  join_group: 'join_group',
  launch_app: 'launch_app',
  loan_application: 'loan_application',
  loan_approval: 'loan_approval',
  loan_disbursal: 'loan_disbursal',
  login: 'login',
  rate: 'rate',
  registration: 'registration',
  search: 'search',
  spend_credits: 'spend_credits',
  start_trial: 'start_trial',
  subscribe: 'subscribe',
  unlock_achievement: 'unlock_achievement',
} as const;

export type TikTokStandardEventKey = keyof typeof TikTokStandardEvents;
export type TikTokStandardEventValue = typeof TikTokStandardEvents[TikTokStandardEventKey];
export type EventProperty = { key: string; value: string | number };

declare class TiktokAdsEventsModule extends NativeModule {
  initializeSdk(accessToken: string, appId: string, tiktokAppId: string): Promise<boolean>;
  trackTTEvent(name: TikTokStandardEventValue, properties?: EventProperty[]): Promise<string>;
  trackCustomEvent(eventName: string, eventID: string, properties?: EventProperty[]): Promise<void>;
  identify(externalId: string, externalUserName?: string, phoneNumber?: string, email?: string): Promise<void>;
  getAnonymousID(): Promise<string>;
  getAccessToken(): Promise<string>;
  getTestEventCode(): Promise<string>;
}

const TiktokAdsEvents = requireNativeModule<TiktokAdsEventsModule>('TiktokAdsEvents');
export default TiktokAdsEvents;

export async function TikTokLaunchApp(properties?: EventProperty[]): Promise<string> {
  return TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.launch_app, properties);
}

export async function TikTokIdentify(params: { externalId: string; externalUserName?: string; phoneNumber?: string; email?: string; }): Promise<void> {
  const { externalId, externalUserName, phoneNumber, email } = params;
  return TiktokAdsEvents.identify(externalId, externalUserName, phoneNumber, email);
}
