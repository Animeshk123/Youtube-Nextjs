"use client";
import React, { useEffect, useState } from "react";
import { YTAPIKEY } from "@/lib/env";
import VideoCard from "@/components/VideoCard";
import YouTubeVideoCardSkeleton from "@/components/LoaderCard";

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface YouTubeSnippet {
  channelId: string;
  channelTitle: string;
  title: string;
  thumbnails: {
    default?: YouTubeThumbnail;
    medium?: YouTubeThumbnail;
    high: YouTubeThumbnail;
  };
}

interface YouTubeContentDetails {
  duration: string; // ISO 8601 (PT#H#M#S)
}

interface YouTubeVideoItem {
  id: string;
  snippet: YouTubeSnippet;
  contentDetails: YouTubeContentDetails;
}

interface YouTubeAPIResponse {
  items: YouTubeVideoItem[];
}

interface VideoData {
  videoId: string;
  title: string;
  image: string;
  channel: string;
  channelIcon: string;
  duration: string;
}

function formatDuration(duration: string) {
  // duration comes in ISO 8601 (e.g. "PT5M17S")
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return "0:00";

  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Page() {
  const [videos, setVideos] = useState<VideoData[]>([]);

  const getYtRes = async () => {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&maxResults=12&regionCode=IN&key=${YTAPIKEY}`
      );
      const data: YouTubeAPIResponse = await res.json();

      const finalVideos: VideoData[] = data.items.map((item) => ({
        videoId: item.id,
        title: item.snippet.title,
        image: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle,
        channelIcon: item.snippet.thumbnails.default?.url || "",
        duration: formatDuration(item.contentDetails.duration),
      }));

      setVideos(finalVideos);
    } catch (err) {
      console.error("Error fetching YouTube videos:", err);
    }
  };

  useEffect(() => {
    getYtRes();
  }, []);

  return (
    <div className="min-h-[calc(100vh-50px)]">
      <div className="container mx-auto px-4">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {videos.length > 0 ? (
            videos.map((item) => (
              <VideoCard
                key={item.videoId}
                image={item.image}
                title={item.title}
                videoId={item.videoId}
                channel={item.channel}
                channelIcon={item.channelIcon}
                duration={item.duration}
              />
            ))
          ) : (
            <>
              {Array.from({ length: 12 }).map((_, index) => (
                <YouTubeVideoCardSkeleton key={index} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
