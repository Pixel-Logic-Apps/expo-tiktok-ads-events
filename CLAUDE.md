# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo native module that wraps the TikTok Business SDK for both iOS and Android, enabling event tracking for TikTok advertising campaigns in React Native/Expo apps.

## Commands

```bash
# Build TypeScript
npm run build

# Clean build artifacts
npm run clean

# Lint code
npm run lint

# Run tests
npm run test

# Prepare for publishing
npm run prepare

# Open iOS project in Xcode
npm run open:ios

# Open Android project in Android Studio
npm run open:android
```

## Architecture

### Native Module Structure

The module exports a native module named `TiktokAdsEvents` (not `ExpoTiktokAdsEvents`). Both platforms must use this exact name.

```
src/
├── index.ts                    # Public exports
└── ExpoTiktokAdsEventsModule.ts # TypeScript interface and helpers

ios/
├── ExpoTiktokAdsEvents.podspec  # CocoaPods spec (uses TikTokBusinessSDK)
└── ExpoTiktokAdsEventsModule.swift # iOS implementation

android/
├── build.gradle                 # Gradle config (uses JitPack SDK)
└── src/main/java/expo/modules/tiktokadsevents/
    └── ExpoTiktokAdsEventsModule.kt # Android implementation
```

### Key Implementation Details

- **Module Name**: Must be `TiktokAdsEvents` in both `Name()` definitions
- **iOS SDK**: `TikTokBusinessSDK` via CocoaPods
- **Android SDK**: `com.github.tiktok:tiktok-business-android-sdk` via JitPack
- **Event Properties**: Passed as `List<Map<String, Any>>` (Android) or `[[String: Any]]` (iOS)

### TypeScript Interface

All native methods are async and must match this interface:
- `initializeSdk(accessToken, appId, tiktokAppId, debugModeEnabled)` → `Promise<boolean>`
- `trackTTEvent(name, properties?)` → `Promise<string>`
- `trackCustomEvent(eventName, eventID, properties?)` → `Promise<void>`
- `identify(externalId, externalUserName?, phoneNumber?, email?)` → `Promise<void>`
- `getAnonymousID()` → `Promise<string>`
- `getAccessToken()` → `Promise<string>`
- `getTestEventCode()` → `Promise<string>`

## Testing in Consumer Apps

After making changes, consumer apps need:
```bash
npx expo prebuild --clean
```

For Android, ensure the app's `android/build.gradle` includes JitPack:
```groovy
allprojects {
    repositories {
        maven { url 'https://jitpack.io' }
    }
}
```
