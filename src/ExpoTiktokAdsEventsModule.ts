import { NativeModule, requireNativeModule } from 'expo';

import { ExpoTiktokAdsEventsModuleEvents } from './ExpoTiktokAdsEvents.types';

export const TikTokStandardEvents = {
  achieve_level: 'AchieveLevel',
  add_payment_info: 'AddPaymentInfo',
  complete_tutorial: 'CompleteTutorial',
  create_group: 'CreateGroup',
  create_role: 'CreateRole',
  generate_lead: 'GenerateLead',
  in_app_ad_click: 'InAppADClick',
  in_app_ad_impr: 'InAppADImpr',
  install_app: 'InstallApp',
  join_group: 'JoinGroup',
  launch_app: 'LaunchAPP',
  loan_application: 'LoanApplication',
  loan_approval: 'LoanApproval',
  loan_disbursal: 'LoanDisbursal',
  login: 'Login',
  rate: 'Rate',
  registration: 'Registration',
  search: 'Search',
  spend_credits: 'SpendCredits',
  start_trial: 'StartTrial',
  subscribe: 'Subscribe',
  unlock_achievement: 'UnlockAchievement',
} as const;

export type TikTokStandardEventKey = keyof typeof TikTokStandardEvents;
export type TikTokStandardEventValue = typeof TikTokStandardEvents[TikTokStandardEventKey];

declare class TiktokAdsEventsModule extends NativeModule<ExpoTiktokAdsEventsModuleEvents> {
  initializeSdk(accessToken: string, appId: string, tiktokAppId: string): Promise<string>;
  trackTTEvent(name: TikTokStandardEventValue): Promise<string>;
}

const TiktokAdsEvents = requireNativeModule<TiktokAdsEventsModule>('TiktokAdsEvents');
export default TiktokAdsEvents;

export async function TikTokLaunchApp(): Promise<string> {
  return TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.launch_app);
}
