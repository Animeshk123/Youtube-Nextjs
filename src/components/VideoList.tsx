"use client";

import Image from "next/image";
import Link from "next/link";

interface VideoCardProps {
  videoId: string;
  image: string;
  title: string;
  channel: string;
  channelIcon: string;
  duration: string;
}

export default function VideoList({
  videoId,
  image,
  title,
  channel,
  channelIcon,
  duration,
}: VideoCardProps) {
  return (
    <Link
      href={`/watch/${videoId}`}
      className="flex gap-3 p-2 rounded-lg transition"
    >
      {/* Thumbnail */}
      <div className="flex-shrink-0 w-36 h-20 relative">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover object-center rounded-md"
        />
        <span className="absolute font-sans bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
          {duration}
        </span>
      </div>

      {/* Video details */}
      <div className="flex flex-col justify-between">
        <h3 className="text-sm font-semibold text-gray-100 font-sans line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-200">
          {channelIcon && (
            <div className="w-5 h-5 relative rounded-full overflow-hidden">
              <Image
                src={channelIcon}
                alt={channel}
                fill
                className="object-cover"
              />
            </div>
          )}
          <span className="font-sans">{channel}</span>
        </div>
      </div>
    </Link>
  );
}
