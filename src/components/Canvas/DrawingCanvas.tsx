import { Stage, Layer, Line, Circle } from 'react-konva'
import { useCanvasStore } from '../../stores/canvasStore'
import { useGestureStore } from '../../stores/gestureStore'

interface DrawingCanvasProps {
  width: number;
  height: number;
}

export function DrawingCanvas({ width, height }: DrawingCanvasProps) {
  const { strokes, currentStroke } = useCanvasStore();
  const { cursorPosition, gestureState } = useGestureStore();

  return (
    <Stage width={width} height={height} className="bg-canvas-white">
      <Layer>
        {/* Render completed strokes */}
        {strokes.map((stroke) => (
          <Line
            key={stroke.id}
            points={stroke.points}
            stroke={stroke.color}
            strokeWidth={stroke.width}
            opacity={stroke.opacity / 100}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              stroke.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        ))}

        {/* Render current stroke being drawn */}
        {currentStroke && (
          <Line
            points={currentStroke.points}
            stroke={currentStroke.color}
            strokeWidth={currentStroke.width}
            opacity={currentStroke.opacity / 100}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation={
              currentStroke.tool === 'eraser' ? 'destination-out' : 'source-over'
            }
          />
        )}

        {/* Render cursor */}
        {cursorPosition && (
          <Circle
            x={cursorPosition.x}
            y={cursorPosition.y}
            radius={gestureState === 'drawing' ? 8 : 12}
            fill={gestureState === 'drawing' ? '#EF4444' : '#3B82F6'}
            opacity={0.7}
            shadowColor="black"
            shadowBlur={5}
            shadowOpacity={0.3}
          />
        )}
      </Layer>
    </Stage>
  );
}
