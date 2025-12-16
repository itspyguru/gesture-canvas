import { useCallback, useRef, useEffect, useState } from 'react'
import { Results } from '@mediapipe/hands'
import { DrawingCanvas } from '../Canvas/DrawingCanvas'
import { VideoPreview } from '../Canvas/VideoPreview'
import { GestureIndicator } from '../Canvas/GestureIndicator'
import { SettingsPanel } from '../Settings/SettingsPanel'
import { useMediaPipe } from '../../hooks/useMediaPipe'
import { useGestureDetection } from '../../hooks/useGestureDetection'
import { useDrawing } from '../../hooks/useDrawing'
import type { Point } from '../../types'

export function AppLayout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  const { handleDrawingStart, handleDrawingMove, handleDrawingEnd } = useDrawing();

  const { processLandmarks } = useGestureDetection({
    canvasWidth: canvasSize.width,
    canvasHeight: canvasSize.height,
    onDrawingStart: handleDrawingStart,
    onDrawingMove: handleDrawingMove,
    onDrawingEnd: handleDrawingEnd,
  });

  const handleResults = useCallback((landmarks: Point[] | null, _results: Results) => {
    processLandmarks(landmarks);
  }, [processLandmarks]);

  const { videoRef, isLoading, error } = useMediaPipe({
    onResults: handleResults,
  });

  // Handle canvas resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Export canvas as PNG
  const handleExport = useCallback(() => {
    const stage = stageRef.current?.querySelector('canvas');
    if (!stage) return;

    const dataUrl = stage.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `airdraw-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  }, []);

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 relative bg-canvas-white"
      >
        <div ref={stageRef}>
          <DrawingCanvas width={canvasSize.width} height={canvasSize.height} />
        </div>

        <VideoPreview
          ref={videoRef}
          isLoading={isLoading}
          error={error}
        />

        <GestureIndicator />

        {/* Instructions overlay - shows on first load */}
        {!error && !isLoading && (
          <div className="absolute bottom-4 right-4 bg-panel-dark/80 text-white text-sm p-3 rounded-lg max-w-xs">
            <p className="font-medium mb-1">How to draw:</p>
            <p className="text-gray-300 text-xs">
              Pinch your thumb and index finger to draw. Release to stop.
            </p>
          </div>
        )}
      </div>

      {/* Settings panel */}
      <SettingsPanel onExport={handleExport} />
    </div>
  );
}
