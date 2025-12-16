import { create } from 'zustand'
import type { GestureState, Point } from '../types'

interface GestureStoreState {
  gestureState: GestureState;
  cursorPosition: Point | null;
  isPinching: boolean;
  confidence: number;

  setGestureState: (state: GestureState) => void;
  setCursorPosition: (position: Point | null) => void;
  setIsPinching: (isPinching: boolean) => void;
  setConfidence: (confidence: number) => void;
}

export const useGestureStore = create<GestureStoreState>((set) => ({
  gestureState: 'idle',
  cursorPosition: null,
  isPinching: false,
  confidence: 0,

  setGestureState: (gestureState) => set({ gestureState }),
  setCursorPosition: (cursorPosition) => set({ cursorPosition }),
  setIsPinching: (isPinching) => set({ isPinching }),
  setConfidence: (confidence) => set({ confidence }),
}))
