import { create } from 'zustand'
import type { Stroke } from '../types'

interface CanvasState {
  strokes: Stroke[];
  currentStroke: Stroke | null;
  history: Stroke[][];
  historyIndex: number;

  startStroke: (stroke: Omit<Stroke, 'id'>) => void;
  updateCurrentStroke: (points: number[]) => void;
  endStroke: () => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useCanvasStore = create<CanvasState>((set, get) => ({
  strokes: [],
  currentStroke: null,
  history: [[]],
  historyIndex: 0,

  startStroke: (strokeData) => {
    const stroke: Stroke = {
      ...strokeData,
      id: generateId(),
    };
    set({ currentStroke: stroke });
  },

  updateCurrentStroke: (points) => {
    set((state) => {
      if (!state.currentStroke) return state;
      return {
        currentStroke: {
          ...state.currentStroke,
          points,
        },
      };
    });
  },

  endStroke: () => {
    const { currentStroke, strokes, history, historyIndex } = get();
    if (!currentStroke || currentStroke.points.length < 4) {
      set({ currentStroke: null });
      return;
    }

    const newStrokes = [...strokes, currentStroke];
    const newHistory = [...history.slice(0, historyIndex + 1), newStrokes];

    set({
      strokes: newStrokes,
      currentStroke: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;

    const newIndex = historyIndex - 1;
    set({
      strokes: history[newIndex],
      historyIndex: newIndex,
    });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;

    const newIndex = historyIndex + 1;
    set({
      strokes: history[newIndex],
      historyIndex: newIndex,
    });
  },

  clearCanvas: () => {
    const { history, historyIndex } = get();
    const newHistory = [...history.slice(0, historyIndex + 1), []];
    set({
      strokes: [],
      currentStroke: null,
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },
}))
