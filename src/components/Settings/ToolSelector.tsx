import { useToolStore } from '../../stores/toolStore'
import type { Tool } from '../../types'

export function ToolSelector() {
  const { tool, setTool } = useToolStore();

  const tools: { id: Tool; label: string; icon: string }[] = [
    { id: 'pen', label: 'Pen', icon: '✏️' },
    { id: 'eraser', label: 'Eraser', icon: '🧹' },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Tool</h3>
      <div className="flex gap-2">
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => setTool(t.id)}
            className={`flex-1 py-3 px-4 rounded-lg text-center transition-all ${
              tool === t.id
                ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/30'
                : 'bg-panel-hover text-gray-300 hover:bg-panel-slate'
            }`}
          >
            <div className="text-xl mb-1">{t.icon}</div>
            <div className="text-xs">{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
