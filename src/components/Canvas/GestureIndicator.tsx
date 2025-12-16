import { useGestureStore } from '../../stores/gestureStore'

export function GestureIndicator() {
  const { gestureState } = useGestureStore();

  const getStatusColor = () => {
    switch (gestureState) {
      case 'drawing':
        return 'bg-accent-destructive';
      case 'detected':
        return 'bg-accent-success';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    switch (gestureState) {
      case 'drawing':
        return 'DRAWING MODE - Pinch to stop';
      case 'detected':
        return 'Ready - Pinch to start';
      default:
        return 'No Hand Detected';
    }
  };

  return (
    <div className={`absolute top-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
      gestureState === 'drawing'
        ? 'bg-accent-destructive/90 ring-2 ring-accent-destructive ring-offset-2 ring-offset-transparent'
        : 'bg-panel-dark/80'
    }`}>
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} ${gestureState !== 'idle' ? 'animate-pulse' : ''}`} />
      <span className="text-white text-sm font-medium">{getStatusText()}</span>
    </div>
  );
}
