import { useEffect, useRef, useCallback, useState } from 'react'
import { Hands, Results } from '@mediapipe/hands'
import { Camera } from '@mediapipe/camera_utils'
import type { Point } from '../types'

interface UseMediaPipeOptions {
  onResults: (landmarks: Point[] | null, results: Results) => void;
  maxHands?: number;
  modelComplexity?: 0 | 1;
  minDetectionConfidence?: number;
  minTrackingConfidence?: number;
}

export function useMediaPipe(options: UseMediaPipeOptions) {
  const {
    onResults,
    maxHands = 1,
    modelComplexity = 1,
    minDetectionConfidence = 0.7,
    minTrackingConfidence = 0.5,
  } = options;

  const videoRef = useRef<HTMLVideoElement>(null);
  const handsRef = useRef<Hands | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleResults = useCallback((results: Results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0].map(lm => ({
        x: lm.x,
        y: lm.y,
      }));
      onResults(landmarks, results);
    } else {
      onResults(null, results);
    }
  }, [onResults]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      },
    });

    hands.setOptions({
      maxNumHands: maxHands,
      modelComplexity,
      minDetectionConfidence,
      minTrackingConfidence,
    });

    hands.onResults(handleResults);
    handsRef.current = hands;

    const camera = new Camera(video, {
      onFrame: async () => {
        if (handsRef.current) {
          await handsRef.current.send({ image: video });
        }
      },
      width: 640,
      height: 480,
    });

    cameraRef.current = camera;

    camera.start()
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to start camera');
        setIsLoading(false);
      });

    return () => {
      camera.stop();
      hands.close();
    };
  }, [handleResults, maxHands, modelComplexity, minDetectionConfidence, minTrackingConfidence]);

  return {
    videoRef,
    isLoading,
    error,
  };
}
