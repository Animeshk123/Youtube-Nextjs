import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";

interface VideoProps {
  image: string;
  title: string;
  videoId: string;
  channel: string;
  channelIcon: string;
  duration: string;
}

export default function YouTubeVideoCard({
  image,
  title,
  videoId,
  channel,
  channelIcon,
  duration,
}: VideoProps) {
  return (
    <Link href={`/watch/${videoId}`} className="overflow-hidden w-full">
      {/* Video Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-zinc-600 to-zinc-800 overflow-hidden">
        <Image
          loading="lazy"
          src={image}
          fill
          alt="Video thumbnail"
          className="w-full h-full object-cover"
        />

        {/* Duration badge */}
        <div className="absolute font-sans bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded">
          {duration}
        </div>
      </div>

      {/* Video Info */}
      <div className="px-3 mt-3">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={channelIcon} />
            <AvatarFallback>{channel[0]}</AvatarFallback>
          </Avatar>

          {/* Video Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium font-sans text-sm text-gray-100 line-clamp-2 leading-tight mb-1">
              {title}
            </h3>

            <div className="text-xs text-gray-300 space-y-0.5">
              <p>{channel}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
