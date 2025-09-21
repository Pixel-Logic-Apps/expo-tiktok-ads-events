// Reexport the native module. On web, it will be resolved to ExpoTiktokAdsEventsModule.web.ts
// and on native platforms to ExpoTiktokAdsEventsModule.ts
export { default, TikTokLaunchApp } from './ExpoTiktokAdsEventsModule';
export { default as ExpoTiktokAdsEvents } from './ExpoTiktokAdsEventsModule';
export * from  './ExpoTiktokAdsEvents.types';
export { TikTokStandardEvents, TikTokStandardEventKey, TikTokStandardEventValue } from './ExpoTiktokAdsEventsModule';
