# expo-tiktok-ads-events

Expo module for TikTok Business SDK integration, enabling event tracking for TikTok advertising campaigns.

## Installation

```bash
npm install expo-tiktok-ads-events
# or
yarn add expo-tiktok-ads-events
```

### Peer Dependencies

```bash
npm install expo-tracking-transparency
# or
yarn add expo-tracking-transparency
```

## Setup

### iOS Configuration

#### SKAdNetwork Configuration

Add the following to your `app.json` to enable proper attribution for TikTok Ads:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "SKAdNetworkItems": [
          {"SKAdNetworkIdentifier": "238da6jt44.skadnetwork"},
          {"SKAdNetworkIdentifier": "22mmun2rn5.skadnetwork"},
          // ... add all required SKAdNetwork IDs
          // Full list available in the example app
        ]
      }
    }
  }
}
```

> **Note:** The complete list of 150+ SKAdNetwork IDs is available in the [example app.json](./example/app.json). These IDs are required for proper attribution of TikTok Ads campaigns.

#### Tracking Permission

Add to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "This identifier will be used to deliver personalized ads to you."
        }
      ]
    ]
  }
}
```

### Initialization

```typescript
import TiktokAdsEvents from 'expo-tiktok-ads-events';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

// Request tracking permission (iOS 14+)
const { status } = await requestTrackingPermissionsAsync();

// Initialize SDK
await TiktokAdsEvents.initializeSdk(
  'YOUR_ACCESS_TOKEN',  // TikTok Ads Manager access token
  'YOUR_APP_ID',        // App ID  
  'YOUR_TIKTOK_APP_ID'  // TikTok App ID
);
```

> **Important:** Get your credentials from [TikTok Ads Manager](https://ads.tiktok.com/)

## Usage

### Standard Events

The module exports all TikTok standard events:

```typescript
import TiktokAdsEvents, { TikTokStandardEvents } from 'expo-tiktok-ads-events';

// Track event without properties
await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.launch_app);

// Track event with properties
await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.add_payment_info, [
  { key: 'currency', value: 'USD' },
  { key: 'value', value: 99.99 },
  { key: 'payment_method', value: 'credit_card' }
]);
```

#### Available Events

- `achieve_level` - Level achieved
- `add_payment_info` - Payment info added
- `complete_tutorial` - Tutorial completed
- `create_group` - Group created
- `create_role` - Role created
- `generate_lead` - Lead generated
- `in_app_ad_click` - In-app ad clicked
- `in_app_ad_impr` - In-app ad impression
- `install_app` - App installed
- `join_group` - Group joined
- `launch_app` - App launched
- `loan_application` - Loan application
- `loan_approval` - Loan approval
- `loan_disbursal` - Loan disbursal
- `login` - User login
- `rate` - Rating given
- `registration` - User registration
- `search` - Search performed
- `spend_credits` - Credits spent
- `start_trial` - Trial started
- `subscribe` - Subscription
- `unlock_achievement` - Achievement unlocked

### Custom Events

```typescript
// Create custom event
await TiktokAdsEvents.trackCustomEvent(
  'custom_event_name',  // Event name
  'EVENT_ID_123',       // Unique event ID
  [                     // Optional properties
    { key: 'category', value: 'gaming' },
    { key: 'score', value: 1500 }
  ]
);
```

### User Identification

```typescript
import { TikTokIdentify } from 'expo-tiktok-ads-events';

// Identify user
await TikTokIdentify({
  externalId: 'USER_123',
  externalUserName: 'John Doe',
  phoneNumber: '+1234567890',
  email: 'john@example.com'
});

// Or using direct method
await TiktokAdsEvents.identify(
  'USER_123',           // External ID (required)
  'John Doe',           // Name (optional)
  '+1234567890',        // Phone (optional)
  'john@example.com'    // Email (optional)
);
```

### Helper Functions

```typescript
import { TikTokLaunchApp } from 'expo-tiktok-ads-events';

// Helper for launch_app event
await TikTokLaunchApp();

// With properties
await TikTokLaunchApp([
  { key: 'source', value: 'notification' }
]);
```

### Debug Information

```typescript
// Get anonymous user ID
const anonymousId = await TiktokAdsEvents.getAnonymousID();

// Get current access token
const accessToken = await TiktokAdsEvents.getAccessToken();

// Get test event code
const testEventCode = await TiktokAdsEvents.getTestEventCode();
```

## Complete Example

```typescript
import { useEffect } from 'react';
import TiktokAdsEvents, { 
  TikTokLaunchApp, 
  TikTokIdentify,
  TikTokStandardEvents 
} from 'expo-tiktok-ads-events';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

export default function App() {
  useEffect(() => {
    (async () => {
      // 1. Request tracking permission
      const { status } = await requestTrackingPermissionsAsync();
      
      if (status === 'granted') {
        // 2. Initialize SDK
        await TiktokAdsEvents.initializeSdk(
          'YOUR_ACCESS_TOKEN',
          'YOUR_APP_ID',
          'YOUR_TIKTOK_APP_ID'
        );
        
        // 3. Identify user
        await TikTokIdentify({
          externalId: 'USER_123',
          email: 'user@example.com'
        });
        
        // 4. Track app launch
        await TikTokLaunchApp();
        
        // 5. Get debug info
        const anonymousId = await TiktokAdsEvents.getAnonymousID();
        console.log('Anonymous ID:', anonymousId);
      }
    })();
  }, []);

  const handlePurchase = async () => {
    // Track purchase with properties
    await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.subscribe, [
      { key: 'currency', value: 'USD' },
      { key: 'value', value: 29.90 },
      { key: 'content_type', value: 'subscription' },
      { key: 'content_id', value: 'plan_premium' }
    ]);
  };

  return (
    // Your component
  );
}
```

## Event Properties

### Common Properties

- `currency` - Currency code (e.g., "USD", "EUR", "BRL")
- `value` - Monetary value
- `content_type` - Content type (e.g., "product", "subscription")
- `content_id` - Content ID or SKU
- `content_name` - Content name
- `content_category` - Content category
- `quantity` - Quantity
- `description` - Description
- `query` - Search query
- `status` - Status (e.g., "success", "failed")
- `level` - Level achieved (for gaming apps)
- `score` - Score value
- `success` - Success flag (boolean as string: "true"/"false")
- `payment_method` - Payment method used

### TypeScript Types

```typescript
type EventProperty = {
  key: string;
  value: string | number;
};
```

## Testing Events

1. Get test code:
```typescript
const testCode = await TiktokAdsEvents.getTestEventCode();
console.log('Use this code in TikTok Events Manager:', testCode);
```

2. Go to [TikTok Events Manager](https://ads.tiktok.com/events_manager/)

3. Select your pixel/app

4. Navigate to "Test Events" 

5. Enter the test code

6. Trigger events in your app and see them in real-time

## SDK Configuration

The SDK is automatically configured with:

- ✅ Tracking enabled
- ✅ Launch tracking enabled  
- ✅ Retention tracking enabled
- ✅ SKAdNetwork enabled (iOS)
- ✅ Debug mode enabled (development)
- ✅ Install tracking enabled
- ✅ Auto tracking disabled (manual control)

## Requirements

- iOS 15.1+
- Android (in development)
- Expo SDK 54+
- TikTok Business SDK
- expo-tracking-transparency (for iOS 14+)

## Troubleshooting

### Events Not Appearing in TikTok

1. Verify tracking permission is granted (iOS)
2. Confirm credentials are correct
3. Use test mode to validate events
4. Wait up to 24 hours for production events to appear
5. Ensure SKAdNetwork IDs are properly configured
6. Check that the app is running on a real device (not simulator)

### Empty Anonymous ID

Anonymous ID is generated after successful initialization. Make sure to call `initializeSdk` first.

### Initialization Error

Check:
- Valid access token from TikTok Ads Manager
- Correct app IDs (both App ID and TikTok App ID)
- Internet connection
- TikTok Business SDK is properly installed via CocoaPods

### SKAdNetwork Attribution Issues

- Ensure all required SKAdNetwork IDs are added to `app.json`
- Run `npx expo prebuild` after adding SKAdNetwork configuration
- Test on a real device (attribution doesn't work on simulator)

## API Reference

### Methods

#### `initializeSdk(accessToken, appId, tiktokAppId, debugMode?)`
Initialize the TikTok Business SDK.

**Parameters:**
- `accessToken` (string): TikTok Ads Manager access token
- `appId` (string): Your app ID
- `tiktokAppId` (string): TikTok app ID
- `debugMode` (boolean): Enable debug mode (optional, default: true in development)

**Returns:** Promise<string> - "initialization successful" or error message

#### `trackTTEvent(eventName, properties?)`
Track a standard TikTok event.

**Parameters:**
- `eventName` (TikTokStandardEventValue): Event name from TikTokStandardEvents
- `properties` (EventProperty[]): Optional array of event properties

**Returns:** Promise<string>

#### `trackCustomEvent(eventName, eventID, properties?)`
Track a custom event.

**Parameters:**
- `eventName` (string): Custom event name
- `eventID` (string): Unique event identifier
- `properties` (EventProperty[]): Optional array of event properties

**Returns:** Promise<void>

#### `identify(externalId, externalUserName?, phoneNumber?, email?)`
Identify a user.

**Parameters:**
- `externalId` (string): External user ID (required)
- `externalUserName` (string): User name (optional)
- `phoneNumber` (string): Phone number (optional)
- `email` (string): Email address (optional)

**Returns:** Promise<void>

#### `getAnonymousID()`
Get the anonymous user ID.

**Returns:** Promise<string>

#### `getAccessToken()`
Get the current access token.

**Returns:** Promise<string>

#### `getTestEventCode()`
Get the test event code for debugging.

**Returns:** Promise<string>

## License

MIT

## Author

Bruno Verçosa - [Pixel Logic Apps](https://github.com/Pixel-Logic-Apps)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Resources

### Official Documentation
- [TikTok for Business](https://business.tiktok.com/)
- [TikTok Ads Manager](https://ads.tiktok.com/)
- [TikTok Events Manager](https://ads.tiktok.com/events_manager/)
- [TikTok Events API](https://business-api.tiktok.com/portal/docs)
- [TikTok Business SDK iOS](https://github.com/tiktok/tiktok-business-ios-sdk)

### Related
- [Expo Modules Documentation](https://docs.expo.dev/modules/)
- [SKAdNetwork Documentation](https://developer.apple.com/documentation/storekit/skadnetwork)
- [App Tracking Transparency](https://developer.apple.com/documentation/apptrackingtransparency)