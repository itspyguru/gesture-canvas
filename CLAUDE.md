# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AirDraw is a web-based gesture-controlled drawing application. Users draw in the air using hand gestures captured by their webcam, which are translated into digital strokes on a canvas.

## Development Commands

```bash
npm run dev      # Start dev server at http://localhost:5173
npm run build    # TypeScript check + production build
npm run preview  # Preview production build
```

## Tech Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (via @tailwindcss/vite plugin)
- **Konva.js** (react-konva) - canvas rendering with object model
- **Zustand** - state management
- **MediaPipe Hands** - hand tracking (loaded from CDN)

## Architecture

**Layout**: Split-panel (`src/components/Layout/AppLayout.tsx`)
- Canvas area (left, flex-1) - Konva Stage with strokes + cursor overlay
- Settings panel (right, 280px) - tool/color/brush controls

**Key Components**:
- `DrawingCanvas.tsx` - Konva Stage rendering strokes and cursor
- `VideoPreview.tsx` - webcam feed (bottom-left overlay, mirrored)
- `GestureIndicator.tsx` - status dot (idle/detected/drawing)
- `SettingsPanel.tsx` - tools, colors, brush, actions

**Hooks**:
- `useMediaPipe` - initializes MediaPipe Hands, processes webcam frames
- `useGestureDetection` - interprets landmarks (pinch detection, cursor position)
- `useDrawing` - connects gesture events to canvas store

**Stores** (Zustand):
- `canvasStore` - strokes array, currentStroke, history (undo/redo)
- `toolStore` - active tool, color, width, opacity
- `gestureStore` - cursor position, gesture state, pinch status

**Utils**:
- `gestures.ts` - landmark indices, pinch detection, finger extension
- `smoothing.ts` - point interpolation and moving average
- `coordinates.ts` - camera-to-canvas coordinate mapping (mirrored)

## Gesture Detection

MediaPipe landmarks (21 points per hand):
- Thumb tip: index 4
- Index finger tip: index 8
- Pinch = distance(thumb tip, index tip) < 0.06

Drawing flow:
1. Pinch detected → `startStroke()`
2. Index finger moves → `updateCurrentStroke(points)`
3. Pinch released → `endStroke()` commits to history

## Design System

Custom colors defined in `src/index.css` via `@theme`:
- `--color-panel-dark: #1E1E1E`
- `--color-accent-primary: #3B82F6`
- `--color-accent-success: #10B981`
- `--color-accent-destructive: #EF4444`
