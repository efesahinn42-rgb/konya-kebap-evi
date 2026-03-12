'use client';
import { motion } from 'framer-motion';

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-zinc-800/30 rounded-xl animate-pulse ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-zinc-800/50 via-zinc-700/50 to-zinc-800/50 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function SkeletonText({ lines = 1, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-zinc-800/30 rounded animate-pulse ${
            i === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ aspectRatio = 'square', className = '' }) {
  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  }[aspectRatio] || 'aspect-square';

  return (
    <div className={`${aspectClass} bg-zinc-800/30 rounded-xl overflow-hidden ${className}`}>
      <div className="h-full w-full bg-gradient-to-r from-zinc-800/50 via-zinc-700/50 to-zinc-800/50 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonImage key={i} aspectRatio="square" />
      ))}
    </div>
  );
}

export function MenuSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-zinc-800/30 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-zinc-700/50 rounded mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex justify-between items-center">
                <div className="h-4 w-1/2 bg-zinc-700/50 rounded" />
                <div className="h-4 w-20 bg-zinc-700/50 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Add shimmer animation to globals.css
const shimmerStyle = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
`;

export default function SkeletonLoader({ type = 'card', ...props }) {
  switch (type) {
    case 'card':
      return <SkeletonCard {...props} />;
    case 'text':
      return <SkeletonText {...props} />;
    case 'image':
      return <SkeletonImage {...props} />;
    case 'gallery':
      return <GallerySkeleton />;
    case 'menu':
      return <MenuSkeleton />;
    default:
      return <SkeletonCard {...props} />;
  }
}
