import { Stage, Layer, Line, Circle, Ring } from 'react-konva'
import { useCanvasStore } from '../../stores/canvasStore'
import { useGestureStore } from '../../stores/gestureStore'
import { useToolStore } from '../../stores/toolStore'

interface DrawingCanvasProps {
  width: number;
  height: number;
}

export function DrawingCanvas({ width, height }: DrawingCanvasProps) {
  const { strokes, currentStroke } = useCanvasStore();
  const { cursorPosition, gestureState } = useGestureStore();
  const { tool, width: brushWidth, color } = useToolStore();

  const isEraser = tool === 'eraser';
  const cursorRadius = Math.max(brushWidth / 2, 4);

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
          <>
            {/* Brush size preview ring */}
            <Ring
              x={cursorPosition.x}
              y={cursorPosition.y}
              innerRadius={cursorRadius - 1}
              outerRadius={cursorRadius + 1}
              fill={isEraser ? '#EF4444' : (gestureState === 'drawing' ? '#EF4444' : '#3B82F6')}
              opacity={0.8}
            />
            {/* Center dot */}
            <Circle
              x={cursorPosition.x}
              y={cursorPosition.y}
              radius={3}
              fill={isEraser ? '#EF4444' : color}
              opacity={1}
            />
            {/* Eraser indicator - X mark */}
            {isEraser && (
              <>
                <Line
                  points={[
                    cursorPosition.x - cursorRadius * 0.5,
                    cursorPosition.y - cursorRadius * 0.5,
                    cursorPosition.x + cursorRadius * 0.5,
                    cursorPosition.y + cursorRadius * 0.5,
                  ]}
                  stroke="#EF4444"
                  strokeWidth={2}
                  lineCap="round"
                />
                <Line
                  points={[
                    cursorPosition.x + cursorRadius * 0.5,
                    cursorPosition.y - cursorRadius * 0.5,
                    cursorPosition.x - cursorRadius * 0.5,
                    cursorPosition.y + cursorRadius * 0.5,
                  ]}
                  stroke="#EF4444"
                  strokeWidth={2}
                  lineCap="round"
                />
              </>
            )}
          </>
        )}
      </Layer>
    </Stage>
  );
}
