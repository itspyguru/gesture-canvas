import { forwardRef } from 'react'

interface VideoPreviewProps {
  isLoading: boolean;
  error: string | null;
}

export const VideoPreview = forwardRef<HTMLVideoElement, VideoPreviewProps>(
  function VideoPreview({ isLoading, error }, ref) {
    return (
      <div className="absolute bottom-4 left-4 w-[200px] h-[150px] rounded-lg overflow-hidden shadow-lg border-2 border-panel-dark bg-black">
        <video
          ref={ref}
          className="w-full h-full object-cover scale-x-[-1]"
          playsInline
          muted
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 text-white text-sm">
            Loading camera...
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 text-white text-xs p-2 text-center">
            {error}
          </div>
        )}
      </div>
    );
  }
);
