import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoTiktokAdsEventsViewProps } from './ExpoTiktokAdsEvents.types';

const NativeView: React.ComponentType<ExpoTiktokAdsEventsViewProps> =
  requireNativeView('ExpoTiktokAdsEvents');

export default function ExpoTiktokAdsEventsView(props: ExpoTiktokAdsEventsViewProps) {
  return <NativeView {...props} />;
}
