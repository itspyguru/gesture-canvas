import { create } from 'zustand'
import type { Tool } from '../types'

interface ToolState {
  tool: Tool;
  color: string;
  width: number;
  opacity: number;
  recentColors: string[];
  setTool: (tool: Tool) => void;
  setColor: (color: string) => void;
  setWidth: (width: number) => void;
  setOpacity: (opacity: number) => void;
}

const MAX_RECENT_COLORS = 5;

export const useToolStore = create<ToolState>((set) => ({
  tool: 'pen',
  color: '#000000',
  width: 4,
  opacity: 100,
  recentColors: [],

  setTool: (tool) => set({ tool }),

  setColor: (color) => set((state) => {
    const recentColors = [color, ...state.recentColors.filter(c => c !== color)]
      .slice(0, MAX_RECENT_COLORS);
    return { color, recentColors };
  }),

  setWidth: (width) => set({ width: Math.max(1, Math.min(50, width)) }),

  setOpacity: (opacity) => set({ opacity: Math.max(0, Math.min(100, opacity)) }),
}))
