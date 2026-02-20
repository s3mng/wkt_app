import { Detection, BoundingBox, COCO_LABELS } from '../types'

/**
 * Parses raw TFLite output tensors into Detection objects.
 *
 * ─── CURRENT MODEL: EfficientDet Lite0 (COCO 80-class) ───────────────────────
 * Output tensors (in order):
 *   [0] boxes:   Float32Array, shape [1, 25, 4]  — (y1, x1, y2, x2) normalized
 *   [1] classes: Float32Array, shape [1, 25]     — class index (float)
 *   [2] scores:  Float32Array, shape [1, 25]     — confidence 0–1
 *   [3] count:   Float32Array, shape [1]         — number of valid detections
 *
 * ─── SWAP TO yolo26 ──────────────────────────────────────────────────────────
 * yolo26 outputs a SINGLE tensor: Float32Array, shape [1, num_detections, 85]
 *   Layout per detection: [cx, cy, w, h, objectness, class_score × 80]
 * Steps to swap:
 *   1. Replace parseEfficientDet() call below with parseYolo26()
 *   2. Implement parseYolo26() with anchor decoding + NMS
 *   3. Update LABELS import if yolo26 uses a different label set
 * ─────────────────────────────────────────────────────────────────────────────
 */

const CONFIDENCE_THRESHOLD = 0.45

export function parseDetections(outputs: unknown[], frameW: number, frameH: number): Detection[] {
    return parseEfficientDet(outputs, frameW, frameH)
}

// ── EfficientDet Lite0 parser ────────────────────────────────────────────────
function parseEfficientDet(outputs: unknown[], _frameW: number, _frameH: number): Detection[] {
    if (outputs.length < 4) return []

    const boxes = outputs[0] as Float32Array
    const classes = outputs[1] as Float32Array
    const scores = outputs[2] as Float32Array
    const count = outputs[3] as Float32Array

    const numDetections = Math.min(Math.round(count[0]), 25)
    const results: Detection[] = []

    for (let i = 0; i < numDetections; i++) {
        const score = scores[i]
        if (score < CONFIDENCE_THRESHOLD) continue

        const y1 = boxes[i * 4]
        const x1 = boxes[i * 4 + 1]
        const y2 = boxes[i * 4 + 2]
        const x2 = boxes[i * 4 + 3]

        const bbox: BoundingBox = {
            x: x1,
            y: y1,
            width: x2 - x1,
            height: y2 - y1,
        }

        const classIdx = Math.round(classes[i])
        const label = COCO_LABELS[classIdx] ?? `class_${classIdx}`

        results.push({ label, confidence: score, bbox })
    }

    return results
}

// ── yolo26 parser (stub — implement when model is ready) ─────────────────────
// export function parseYolo26(outputs: unknown[], frameW: number, frameH: number): Detection[] {
//   const raw = outputs[0] as Float32Array
//   // raw shape: [1, num_detections, 85]
//   // TODO: anchor decode → objectness filter → class argmax → NMS
//   return []
// }
