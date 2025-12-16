import { useCanvasStore } from '../../stores/canvasStore'
import { ToolSelector } from './ToolSelector'
import { ColorPicker } from './ColorPicker'
import { BrushSettings } from './BrushSettings'

interface SettingsPanelProps {
  onExport: () => void;
}

export function SettingsPanel({ onExport }: SettingsPanelProps) {
  const { undo, redo, clearCanvas, history, historyIndex } = useCanvasStore();

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="w-[320px] bg-panel-dark h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">AirDraw</h1>
        <p className="text-xs text-gray-500">Gesture-Controlled Drawing</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <ToolSelector />
        <ColorPicker />
        <BrushSettings />
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-700 space-y-3">
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="flex-1 py-2 px-3 bg-panel-hover text-white rounded-lg hover:bg-panel-slate disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ↩ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="flex-1 py-2 px-3 bg-panel-hover text-white rounded-lg hover:bg-panel-slate disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ↪ Redo
          </button>
        </div>

        <button
          onClick={onExport}
          className="w-full py-2 px-3 bg-accent-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Export PNG
        </button>

        <button
          onClick={() => {
            if (confirm('Clear the canvas? This cannot be undone.')) {
              clearCanvas();
            }
          }}
          className="w-full py-2 px-3 bg-accent-destructive/20 text-accent-destructive rounded-lg hover:bg-accent-destructive/30 transition-colors"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
}
