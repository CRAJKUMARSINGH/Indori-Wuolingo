import React from 'react';

/**
 * Simple responsive video player used in ExercisePlayer.
 * Renders an HTML5 <video> with controls, lazy‑loads the source, and fits the container.
 */
interface VideoPlayerProps {
  src: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, title }) => {
  return (
    <div className="w-full my-4 rounded-lg overflow-hidden shadow-lg">
      <video
        className="w-full h-auto"
        controls
        preload="metadata"
        src={src}
        title={title}
        aria-label={title ?? 'Exercise video'}
      />
    </div>
  );
};
