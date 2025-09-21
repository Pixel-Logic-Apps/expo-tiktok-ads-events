import { registerWebModule, NativeModule } from 'expo';

import { ExpoTiktokAdsEventsModuleEvents } from './ExpoTiktokAdsEvents.types';

class ExpoTiktokAdsEventsModule extends NativeModule<ExpoTiktokAdsEventsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ExpoTiktokAdsEventsModule, 'ExpoTiktokAdsEventsModule');
