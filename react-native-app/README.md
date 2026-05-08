# Wisenet Player - React Native

React Native mobile app for Hanwha Wisenet Security Camera viewing.

## Architecture

UMP Player (Web Component) is embedded in a `WebView` without modification. React Native handles device management, navigation, and native UI.

```
┌─────────────────────────────────┐
│        React Native App         │
│  ┌───────────────────────────┐  │
│  │   HomeScreen (devices)    │  │
│  │   AddDeviceScreen         │  │
│  │   PlayerScreen            │  │
│  │   MultiPlayerScreen       │  │
│  └───────────┬───────────────┘  │
│              │ WebView          │
│  ┌───────────▼───────────────┐  │
│  │  UmpPlayerWebView         │  │
│  │  (ump-player Web Component│  │
│  │   unchanged)              │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Prerequisites

- Node.js >= 18
- React Native CLI
- Android Studio / Xcode

## Setup

```bash
cd react-native-app
npm install

# Android
npx react-native run-android

# iOS
cd ios && pod install && cd ..
npx react-native run-ios
```

## Network Requirement

The app connects to cameras via the UMP proxy server. The proxy must be reachable from the mobile device on the same network.

Start the proxy server on your desktop/server:

```bash
# From the root of react-wisenet-player
npm start
# or
grunt server
```

Then configure the device in the app using the proxy server's IP and port.

## Features

- Add / Edit / Delete camera devices
- Single camera full-screen player
- Multi-camera grid view (2-column)
- Play state indicator (PLAYING / PAUSED / STOPPED)
- Persistent device storage (AsyncStorage)
- Dark theme matching Wisenet design language
