export default function VideoCardSkeleton() {
  return (
    <div className="w-full w-full border-border overflow-hidden">
      <div className="flex gap-3 p-3">
        {/* Video thumbnail skeleton */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-20 bg-zinc-500 rounded-lg animate-pulse" />
          {/* Duration badge skeleton */}
          <div className="absolute bottom-1 right-1 bg-zinc-500 rounded px-1.5 py-0.5 animate-pulse">
            <div className="w-8 h-3 bg-zinc-500-foreground/20 rounded animate-pulse" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Title skeleton */}
          <div className="space-y-1">
            <div className="h-4 bg-zinc-500 rounded animate-pulse" />
            <div className="h-4 bg-zinc-500 rounded w-3/4 animate-pulse" />
          </div>

          {/* Subtitle skeleton */}
          <div className="h-3 bg-zinc-500 rounded w-2/3 animate-pulse" />

          {/* Channel info skeleton */}
          <div className="flex items-center gap-2 mt-3">
            {/* Avatar skeleton */}
            <div className="w-6 h-6 bg-zinc-500 rounded-full animate-pulse flex-shrink-0" />
            {/* Channel name skeleton */}
            <div className="h-3 bg-zinc-500 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
