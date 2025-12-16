export interface Point {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: number[]; // [x1, y1, x2, y2, ...]
  color: string;
  width: number;
  opacity: number;
  tool: 'pen' | 'eraser';
}

export interface HandLandmarks {
  landmarks: Point[];
  handedness: 'Left' | 'Right';
}

export type GestureState = 'idle' | 'detected' | 'drawing';

export type Tool = 'pen' | 'eraser';

export interface ToolSettings {
  tool: Tool;
  color: string;
  width: number;
  opacity: number;
}
