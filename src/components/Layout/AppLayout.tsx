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
          <div className="absolute bottom-4 right-4 bg-panel-dark/90 text-white text-sm p-4 rounded-lg max-w-xs shadow-xl">
            <p className="font-semibold mb-2">How to draw:</p>
            <ul className="text-gray-300 text-xs space-y-1">
              <li><span className="text-accent-success font-medium">Pinch once</span> → Start drawing</li>
              <li><span className="text-white">Move hand</span> → Draw continuously</li>
              <li><span className="text-accent-destructive font-medium">Pinch again</span> → Stop drawing</li>
            </ul>
          </div>
        )}
      </div>

      {/* Settings panel */}
      <SettingsPanel onExport={handleExport} />
    </div>
  );
}
