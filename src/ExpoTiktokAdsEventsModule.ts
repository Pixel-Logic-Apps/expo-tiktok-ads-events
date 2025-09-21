import { NativeModule, requireNativeModule } from 'expo';

import { ExpoTiktokAdsEventsModuleEvents } from './ExpoTiktokAdsEvents.types';

declare class ExpoTiktokAdsEventsModule extends NativeModule<ExpoTiktokAdsEventsModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoTiktokAdsEventsModule>('ExpoTiktokAdsEvents');
