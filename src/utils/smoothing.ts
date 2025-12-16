import type { Point } from '../types'

export class PointSmoother {
  private buffer: Point[] = [];
  private bufferSize: number;

  constructor(bufferSize: number = 5) {
    this.bufferSize = bufferSize;
  }

  addPoint(point: Point): Point {
    this.buffer.push(point);
    if (this.buffer.length > this.bufferSize) {
      this.buffer.shift();
    }
    return this.getSmoothedPoint();
  }

  getSmoothedPoint(): Point {
    if (this.buffer.length === 0) {
      return { x: 0, y: 0 };
    }

    const sum = this.buffer.reduce(
      (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
      { x: 0, y: 0 }
    );

    return {
      x: sum.x / this.buffer.length,
      y: sum.y / this.buffer.length,
    };
  }

  reset() {
    this.buffer = [];
  }
}

export function interpolatePoints(points: number[], minDistance: number = 5): number[] {
  if (points.length < 4) return points;

  const result: number[] = [points[0], points[1]];

  for (let i = 2; i < points.length; i += 2) {
    const prevX = result[result.length - 2];
    const prevY = result[result.length - 1];
    const currX = points[i];
    const currY = points[i + 1];

    const dist = Math.sqrt(Math.pow(currX - prevX, 2) + Math.pow(currY - prevY, 2));

    if (dist > minDistance) {
      const steps = Math.ceil(dist / minDistance);
      for (let j = 1; j <= steps; j++) {
        const t = j / steps;
        result.push(prevX + (currX - prevX) * t);
        result.push(prevY + (currY - prevY) * t);
      }
    } else {
      result.push(currX, currY);
    }
  }

  return result;
}
