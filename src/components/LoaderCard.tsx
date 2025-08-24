export default function YouTubeVideoCardSkeleton() {
  return (
    <div className="bg-zinc-900 rounded-lg overflow-hidden shadow-lg w-full">
      {/* Video Thumbnail Skeleton */}
      <div className="relative aspect-video bg-zinc-800">
        {/* Animated shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 animate-pulse"></div>

        {/* Duration badge skeleton */}
        <div className="absolute bottom-2 right-2 bg-zinc-700 text-transparent text-xs px-1.5 py-0.5 rounded animate-pulse">
          0:00
        </div>
      </div>

      {/* Video Info Skeleton */}
      <div className="p-3">
        <div className="flex gap-3">
          {/* Channel Avatar Skeleton */}
          <div className="w-9 h-9 bg-zinc-700 rounded-full flex-shrink-0 animate-pulse"></div>

          {/* Video Details Skeleton */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Title skeleton - two lines */}
            <div className="space-y-1">
              <div className="h-3 bg-zinc-700 rounded animate-pulse"></div>
              <div className="h-3 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Channel name and metadata skeleton */}
            <div className="space-y-1">
              <div className="h-2.5 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-2.5 bg-zinc-700 rounded w-2/3 animate-pulse"></div>
            </div>
          </div>

          {/* More options skeleton */}
          <div className="w-4 h-4 bg-zinc-700 rounded flex-shrink-0 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
