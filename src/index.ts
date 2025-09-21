// Reexport the native module. On web, it will be resolved to ExpoTiktokAdsEventsModule.web.ts
// and on native platforms to ExpoTiktokAdsEventsModule.ts
export { default } from './ExpoTiktokAdsEventsModule';
export { default as ExpoTiktokAdsEventsView } from './ExpoTiktokAdsEventsView';
export * from  './ExpoTiktokAdsEvents.types';
