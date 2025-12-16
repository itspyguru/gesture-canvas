import { useToolStore } from '../../stores/toolStore'

export function BrushSettings() {
  const { width, opacity, setWidth, setOpacity, color } = useToolStore();

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Brush</h3>

      {/* Width slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Size</span>
          <span className="text-white font-mono">{width}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="50"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-full h-2 bg-panel-hover rounded-lg appearance-none cursor-pointer accent-accent-primary"
        />
        {/* Size preview */}
        <div className="flex items-center justify-center h-12 bg-panel-hover rounded-lg">
          <div
            className="rounded-full"
            style={{
              width: Math.min(width, 40),
              height: Math.min(width, 40),
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      {/* Opacity slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Opacity</span>
          <span className="text-white font-mono">{opacity}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full h-2 bg-panel-hover rounded-lg appearance-none cursor-pointer accent-accent-primary"
        />
      </div>
    </div>
  );
}
