# 26waffha — Expo Local ML App

사물 인식(온디바이스 ML) + GPS 지도 크로스플랫폼 앱 (Android / iOS).

## 기술 스택

| 영역 | 라이브러리 |
|---|---|
| 프레임워크 | Expo SDK 54 (Development Build) |
| 카메라 | react-native-vision-camera v4 |
| 온디바이스 ML | react-native-fast-tflite |
| 지도 | react-native-maps |
| GPS | expo-location |
| 상태 | zustand |
| 라우팅 | expo-router v4 (file-based) |

## 프로젝트 구조

```
app/
  (tabs)/
    index.tsx       # 🗺 지도 화면
    camera.tsx      # 🎯 카메라 + 물체 인식 화면
src/
  components/
    DetectionOverlay.tsx   # 바운딩박스 오버레이
  hooks/
    useObjectDetection.ts  # TFLite 추론 훅
    useLocation.ts         # GPS 훅
  utils/
    modelParser.ts         # 모델 출력 파싱
  types/
    index.ts               # 공용 타입
assets/
  models/
    efficientdet_lite0.tflite  # 현재 플레이스홀더 모델 (4.4MB, COCO 80-class)
```

## 모델 교체 방법

현재는 **EfficientDet Lite0** (COCO 80-class, 4.4MB)이 번들돼 있습니다.

### yolo26으로 교체

1. `assets/models/yolo26.tflite` 파일 복사
2. `src/hooks/useObjectDetection.ts` 에서 require 경로 변경:
   ```ts
   // require('../../assets/models/efficientdet_lite0.tflite')
   require('../../assets/models/yolo26.tflite')
   ```
3. `src/utils/modelParser.ts` 에서 `parseYolo26()` 구현 후 호출:
   - yolo26 출력: `[1, num_detections, 85]` — `[cx, cy, w, h, objectness, score×80]`
   - 표준 EfficientDet과 다른 anchor decoding + NMS 필요

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
