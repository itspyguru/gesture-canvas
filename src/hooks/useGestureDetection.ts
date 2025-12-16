import { useCallback, useRef } from 'react'
import type { Point } from '../types'
import { isPinching, getDrawingPoint } from '../utils/gestures'
import { mapCameraToCanvas } from '../utils/coordinates'
import { PointSmoother } from '../utils/smoothing'
import { useGestureStore } from '../stores/gestureStore'

interface UseGestureDetectionOptions {
  canvasWidth: number;
  canvasHeight: number;
  pinchThreshold?: number;
  onDrawingStart?: () => void;
  onDrawingMove?: (point: Point) => void;
  onDrawingEnd?: () => void;
}

export function useGestureDetection(options: UseGestureDetectionOptions) {
  const {
    canvasWidth,
    canvasHeight,
    pinchThreshold = 0.06,
    onDrawingStart,
    onDrawingMove,
    onDrawingEnd,
  } = options;

  const smoother = useRef(new PointSmoother(5));
  const wasDrawing = useRef(false);

  const {
    setGestureState,
    setCursorPosition,
    setIsPinching,
  } = useGestureStore();

  const processLandmarks = useCallback((landmarks: Point[] | null) => {
    if (!landmarks) {
      setGestureState('idle');
      setCursorPosition(null);
      setIsPinching(false);

      if (wasDrawing.current) {
        wasDrawing.current = false;
        smoother.current.reset();
        onDrawingEnd?.();
      }
      return;
    }

    const drawingPoint = getDrawingPoint(landmarks);
    if (!drawingPoint) return;

    const canvasPoint = mapCameraToCanvas(drawingPoint, canvasWidth, canvasHeight);
    const smoothedPoint = smoother.current.addPoint(canvasPoint);

    setCursorPosition(smoothedPoint);

    const pinching = isPinching(landmarks, pinchThreshold);
    setIsPinching(pinching);

    if (pinching) {
      setGestureState('drawing');

      if (!wasDrawing.current) {
        wasDrawing.current = true;
        onDrawingStart?.();
      }

      onDrawingMove?.(smoothedPoint);
    } else {
      setGestureState('detected');

      if (wasDrawing.current) {
        wasDrawing.current = false;
        smoother.current.reset();
        onDrawingEnd?.();
      }
    }
  }, [
    canvasWidth,
    canvasHeight,
    pinchThreshold,
    setGestureState,
    setCursorPosition,
    setIsPinching,
    onDrawingStart,
    onDrawingMove,
    onDrawingEnd,
  ]);

  return { processLandmarks };
}
