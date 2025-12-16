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
        return 'Drawing';
      case 'detected':
        return 'Hand Detected';
      default:
        return 'No Hand';
    }
  };

  return (
    <div className="absolute top-4 right-4 flex items-center gap-2 bg-panel-dark/80 px-3 py-2 rounded-full shadow-lg">
      <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
      <span className="text-white text-sm font-medium">{getStatusText()}</span>
    </div>
  );
}
