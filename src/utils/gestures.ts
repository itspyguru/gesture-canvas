import type { Point } from '../types'
import { distance } from './coordinates'

// MediaPipe hand landmark indices
export const LANDMARKS = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_MCP: 5,
  INDEX_PIP: 6,
  INDEX_DIP: 7,
  INDEX_TIP: 8,
  MIDDLE_MCP: 9,
  MIDDLE_PIP: 10,
  MIDDLE_DIP: 11,
  MIDDLE_TIP: 12,
  RING_MCP: 13,
  RING_PIP: 14,
  RING_DIP: 15,
  RING_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20,
} as const;

export function getIndexFingerTip(landmarks: Point[]): Point | null {
  if (landmarks.length <= LANDMARKS.INDEX_TIP) return null;
  return landmarks[LANDMARKS.INDEX_TIP];
}

export function getThumbTip(landmarks: Point[]): Point | null {
  if (landmarks.length <= LANDMARKS.THUMB_TIP) return null;
  return landmarks[LANDMARKS.THUMB_TIP];
}

export function isPinching(landmarks: Point[], threshold: number = 0.05): boolean {
  const thumbTip = getThumbTip(landmarks);
  const indexTip = getIndexFingerTip(landmarks);

  if (!thumbTip || !indexTip) return false;

  const dist = distance(thumbTip, indexTip);
  return dist < threshold;
}

export function isIndexFingerExtended(landmarks: Point[]): boolean {
  if (landmarks.length < 21) return false;

  const indexMCP = landmarks[LANDMARKS.INDEX_MCP];
  const indexPIP = landmarks[LANDMARKS.INDEX_PIP];
  const indexTIP = landmarks[LANDMARKS.INDEX_TIP];

  // Check if finger is extended by comparing y positions
  // Tip should be above (lower y) the other joints for extended finger
  const isExtended = indexTIP.y < indexPIP.y && indexPIP.y < indexMCP.y;

  return isExtended;
}

export function getDrawingPoint(landmarks: Point[]): Point | null {
  // Use index finger tip for drawing
  return getIndexFingerTip(landmarks);
}
