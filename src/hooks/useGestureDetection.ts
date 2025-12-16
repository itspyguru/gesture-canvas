import { useCallback, useRef } from 'react'
import type { Point } from '../types'
import { isPinching, getDrawingPoint, isOpenPalm } from '../utils/gestures'
import { mapCameraToCanvas } from '../utils/coordinates'
import { PointSmoother } from '../utils/smoothing'
import { useGestureStore } from '../stores/gestureStore'
import { useToolStore } from '../stores/toolStore'

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
    pinchThreshold = 0.08,
    onDrawingStart,
    onDrawingMove,
    onDrawingEnd,
  } = options;

  const smoother = useRef(new PointSmoother(3));
  const isDrawingMode = useRef(false);
  const wasPinching = useRef(false);
  const wasOpenPalm = useRef(false);
  const lastPinchToggle = useRef(0);
  const lastPalmToggle = useRef(0);
  const DEBOUNCE_MS = 300;

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
      return;
    }

    const drawingPoint = getDrawingPoint(landmarks);
    if (!drawingPoint) return;

    const canvasPoint = mapCameraToCanvas(drawingPoint, canvasWidth, canvasHeight);

    // Clamp cursor position to canvas bounds with padding
    const padding = 10;
    const clampedPoint = {
      x: Math.max(padding, Math.min(canvasWidth - padding, canvasPoint.x)),
      y: Math.max(padding, Math.min(canvasHeight - padding, canvasPoint.y)),
    };

    const smoothedPoint = smoother.current.addPoint(clampedPoint);
    setCursorPosition(smoothedPoint);

    const currentlyPinching = isPinching(landmarks, pinchThreshold);
    const currentlyOpenPalm = isOpenPalm(landmarks);
    setIsPinching(currentlyPinching);

    const now = Date.now();

    // Detect open palm gesture for eraser toggle
    if (currentlyOpenPalm && !wasOpenPalm.current && (now - lastPalmToggle.current > DEBOUNCE_MS)) {
      lastPalmToggle.current = now;
      // Get current tool and toggle - use getState() to always get fresh value
      const currentTool = useToolStore.getState().tool;
      useToolStore.getState().setTool(currentTool === 'eraser' ? 'pen' : 'eraser');
    }
    wasOpenPalm.current = currentlyOpenPalm;

    // Detect pinch toggle (transition from not pinching to pinching)
    // Don't trigger if palm is open
    if (currentlyPinching && !wasPinching.current && !currentlyOpenPalm && (now - lastPinchToggle.current > DEBOUNCE_MS)) {
      lastPinchToggle.current = now;

      if (!isDrawingMode.current) {
        isDrawingMode.current = true;
        smoother.current.reset();
        onDrawingStart?.();
      } else {
        isDrawingMode.current = false;
        onDrawingEnd?.();
      }
    }

    wasPinching.current = currentlyPinching;

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
