import * as React from 'react';

import { ExpoTiktokAdsEventsViewProps } from './ExpoTiktokAdsEvents.types';

export default function ExpoTiktokAdsEventsView(props: ExpoTiktokAdsEventsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
