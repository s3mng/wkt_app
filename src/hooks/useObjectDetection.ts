import { useEffect, useState, useCallback } from 'react'
import { useTensorflowModel } from 'react-native-fast-tflite'
import { useFrameProcessor } from 'react-native-vision-camera'
import { runAtTargetFps, useSharedValue } from 'react-native-worklets-core'
import { Detection } from '../types'
import { parseDetections } from '../utils/modelParser'

/**
 * useObjectDetection
 *
 * Loads a TFLite model and runs inference on every camera frame via
 * react-native-vision-camera Frame Processor.
 *
 * Model file location: assets/models/efficientdet_lite0.tflite
 * ─── Swap to yolo26 ─────────────────────────────────────────────────────────
 * 1. Place your yolo26.tflite in assets/models/
 * 2. Change the require() path below
 * 3. Switch parseDetections() to parseYolo26() in modelParser.ts
 * ────────────────────────────────────────────────────────────────────────────
 */

// Runs inference at this FPS to balance accuracy vs battery
const INFERENCE_FPS = 10

export function useObjectDetection() {
    const model = useTensorflowModel(
        // Replace with yolo26 path when ready:
        // require('../../assets/models/yolo26.tflite')
        require('../../assets/models/efficientdet_lite0.tflite'),
    )

    const isReady = model.state === 'loaded'
    const detections = useSharedValue<Detection[]>([])

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        runAtTargetFps(INFERENCE_FPS, () => {
            'worklet'
            if (model.state !== 'loaded') return
            const outputs = model.model.runSync([frame])
            const parsed = parseDetections(outputs, frame.width, frame.height)
            detections.value = parsed
        })
    }, [model])

    return {
        isReady,
        detections,
        frameProcessor,
        modelState: model.state,
    }
}
