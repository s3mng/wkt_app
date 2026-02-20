크로스플랫폼 앱

## 개발 빌드 실행

> Expo Go 미지원 — TFLite native module 때문에 Development Build 필요

```bash
# Android
npx expo run:android

# iOS (macOS)
npx expo run:ios
```

## Google Maps 키 설정 (Android)

`app.json` → `android.config.googleMaps.apiKey` 에 Google Cloud Maps SDK for Android 키 추가:
```json
"android": {
  "config": {
    "googleMaps": { "apiKey": "YOUR_GOOGLE_MAPS_API_KEY" }
  }
}
```
