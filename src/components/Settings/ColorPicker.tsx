import { useToolStore } from '../../stores/toolStore'

const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#EF4444', '#F97316',
  '#EAB308', '#22C55E', '#14B8A6', '#3B82F6',
  '#8B5CF6', '#EC4899', '#6B7280', '#78716C',
];

export function ColorPicker() {
  const { color, setColor, recentColors } = useToolStore();

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Color</h3>

      {/* Current color preview */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-lg border-2 border-gray-600 shadow-inner"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
        />
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="flex-1 bg-panel-hover text-white px-3 py-2 rounded-lg text-sm font-mono uppercase"
        />
      </div>

      {/* Preset swatches */}
      <div className="grid grid-cols-6 gap-2">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${
              color === c ? 'border-white ring-2 ring-accent-primary' : 'border-gray-600'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Recent colors */}
      {recentColors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Recent</p>
          <div className="flex gap-2">
            {recentColors.map((c, i) => (
              <button
                key={`${c}-${i}`}
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-md border-2 border-gray-600 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
