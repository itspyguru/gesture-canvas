import { useCallback, useRef } from 'react'
import type { Point } from '../types'
import { useCanvasStore } from '../stores/canvasStore'
import { useToolStore } from '../stores/toolStore'
import { interpolatePoints } from '../utils/smoothing'

export function useDrawing() {
  const currentPoints = useRef<number[]>([]);

  const { startStroke, updateCurrentStroke, endStroke } = useCanvasStore();
  const { tool, color, width, opacity } = useToolStore();

  const handleDrawingStart = useCallback(() => {
    currentPoints.current = [];
    startStroke({
      points: [],
      color: tool === 'eraser' ? '#FFFFFF' : color,
      width: tool === 'eraser' ? width * 3 : width,
      opacity: tool === 'eraser' ? 100 : opacity,
      tool,
    });
  }, [startStroke, tool, color, width, opacity]);

  const handleDrawingMove = useCallback((point: Point) => {
    currentPoints.current.push(point.x, point.y);

    // Interpolate for smoother lines
    const interpolated = interpolatePoints(currentPoints.current);
    updateCurrentStroke(interpolated);
  }, [updateCurrentStroke]);

  const handleDrawingEnd = useCallback(() => {
    endStroke();
    currentPoints.current = [];
  }, [endStroke]);

  return {
    handleDrawingStart,
    handleDrawingMove,
    handleDrawingEnd,
  };
}
