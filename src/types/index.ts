// ─────────────────────────────────────────────
//  Core Types
// ─────────────────────────────────────────────

/**
 * Detection result from TFLite model.
 *
 * NOTE: yolo26 outputs are structured differently from standard COCO models.
 * yolo26 output tensor layout: [batch, num_detections, 85]
 *   where 85 = 4 (bbox: cx, cy, w, h) + 1 (objectness) + 80 (class scores)
 * When swapping to yolo26, update the parseDetections() function in
 * src/utils/modelParser.ts to use YOLO anchor decoding instead of standard NMS.
 *
 * Current placeholder model (EfficientDet Lite0) output layout:
 *   - boxes:   [1, 25, 4]   (y1, x1, y2, x2 normalized)
 *   - classes: [1, 25]      (class index)
 *   - scores:  [1, 25]      (confidence 0–1)
 *   - count:   [1]          (number of valid detections)
 */
export interface Detection {
  label: string
  confidence: number
  bbox: BoundingBox
}

export interface BoundingBox {
  x: number  // left (0–1, normalized)
  y: number  // top  (0–1, normalized)
  width: number
  height: number
}

// ─────────────────────────────────────────────
//  Map / Location
// ─────────────────────────────────────────────

export interface GeoPoint {
  latitude: number
  longitude: number
}

export interface MapRegion extends GeoPoint {
  latitudeDelta: number
  longitudeDelta: number
}

// ─────────────────────────────────────────────
//  COCO-80 Labels (for placeholder model)
//  Replace with yolo26's label set when swapping model.
// ─────────────────────────────────────────────
export const COCO_LABELS: string[] = [
  'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train',
  'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
  'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
  'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag',
  'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite',
  'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
  'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana',
  'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
  'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table',
  'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
  'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock',
  'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush',
]
