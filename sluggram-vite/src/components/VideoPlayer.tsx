import { useState, useEffect } from 'react';
import { isIndexedDBUrl, getIdFromIndexedDBUrl, getVideo } from '../lib/videoStorage';

interface VideoPlayerProps {
  src: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
}

export function VideoPlayer({
  src,
  className = '',
  controls = true,
  autoPlay = false,
  loop = false,
  muted = false,
  playsInline = true,
}: VideoPlayerProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    let blobUrl: string | null = null;

    async function loadVideo() {
      setLoading(true);
      setError(false);

      if (isIndexedDBUrl(src)) {
        // Load from IndexedDB
        const id = getIdFromIndexedDBUrl(src);
        try {
          const url = await getVideo(id);
          if (mounted) {
            if (url) {
              blobUrl = url;
              setVideoUrl(url);
            } else {
              setError(true);
            }
          }
        } catch (e) {
          console.error('Failed to load video from IndexedDB:', e);
          if (mounted) setError(true);
        }
      } else {
        // Regular URL
        if (mounted) setVideoUrl(src);
      }

      if (mounted) setLoading(false);
    }

    loadVideo();

    return () => {
      mounted = false;
      // Revoke blob URL to free memory
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [src]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 ${className}`}>
        <div className="animate-spin h-8 w-8 border-4 border-ucsc-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error || !videoUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-900 text-white ${className}`}>
        <div className="text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <p className="text-sm text-gray-400">Video unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <video
      src={videoUrl}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
    />
  );
}
