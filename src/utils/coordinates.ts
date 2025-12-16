import type { Point } from '../types'

export function mapCameraToCanvas(
  cameraPoint: Point,
  canvasWidth: number,
  canvasHeight: number,
  mirror: boolean = true
): Point {
  // Camera coordinates are normalized 0-1
  // Mirror the X axis for natural interaction
  const x = mirror ? (1 - cameraPoint.x) * canvasWidth : cameraPoint.x * canvasWidth;
  const y = cameraPoint.y * canvasHeight;

  return { x, y };
}

export function distance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
