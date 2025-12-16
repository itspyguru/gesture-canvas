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
    pinchThreshold = 0.08, // Increased threshold for easier detection
    onDrawingStart,
    onDrawingMove,
    onDrawingEnd,
  } = options;

  const smoother = useRef(new PointSmoother(3)); // Reduced buffer for faster response
  const isDrawingMode = useRef(false);
  const wasPinching = useRef(false);
  const lastPinchToggle = useRef(0);
  const DEBOUNCE_MS = 300; // Prevent rapid toggling

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
      // Don't end drawing when hand temporarily lost - give user a chance to recover
      return;
    }

    const drawingPoint = getDrawingPoint(landmarks);
    if (!drawingPoint) return;

    const canvasPoint = mapCameraToCanvas(drawingPoint, canvasWidth, canvasHeight);
    const smoothedPoint = smoother.current.addPoint(canvasPoint);

    setCursorPosition(smoothedPoint);

    const currentlyPinching = isPinching(landmarks, pinchThreshold);
    setIsPinching(currentlyPinching);

    const now = Date.now();

    // Detect pinch toggle (transition from not pinching to pinching)
    if (currentlyPinching && !wasPinching.current && (now - lastPinchToggle.current > DEBOUNCE_MS)) {
      lastPinchToggle.current = now;

      if (!isDrawingMode.current) {
        // Start drawing mode
        isDrawingMode.current = true;
        smoother.current.reset();
        onDrawingStart?.();
      } else {
        // Stop drawing mode
        isDrawingMode.current = false;
        onDrawingEnd?.();
      }
    }

    wasPinching.current = currentlyPinching;

    // Update gesture state based on drawing mode
    if (isDrawingMode.current) {
      setGestureState('drawing');
      onDrawingMove?.(smoothedPoint);
    } else {
      setGestureState('detected');
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
