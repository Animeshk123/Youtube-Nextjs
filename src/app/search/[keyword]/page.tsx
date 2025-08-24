"use client";
import React, { useEffect, useState } from "react";
import { YTAPIKEY } from "@/lib/env";
import VideoCard from "@/components/VideoCard";
import YouTubeVideoCardSkeleton from "@/components/LoaderCard";
import { useParams } from "next/navigation";

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

interface YouTubeSearchId {
  videoId: string;
}

interface YouTubeSearchItem {
  id: YouTubeSearchId;
  snippet: YouTubeSnippet;
}

interface YouTubeSearchResponse {
  items: YouTubeSearchItem[];
}

interface YouTubeVideoContentDetails {
  duration: string;
}

interface YouTubeVideoItem {
  id: string;
  contentDetails: YouTubeVideoContentDetails;
}

interface YouTubeVideoResponse {
  items: YouTubeVideoItem[];
}

interface YouTubeChannelSnippet {
  thumbnails: {
    default: YouTubeThumbnail;
  };
}

interface YouTubeChannelItem {
  id: string;
  snippet: YouTubeChannelSnippet;
}

interface YouTubeChannelResponse {
  items: YouTubeChannelItem[];
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
  const params = useParams<{ keyword: string }>();
  const keyword = params.keyword;

  const [videos, setVideos] = useState<VideoData[]>([]);

  const getYtRes = async () => {
    try {
      // 1. Search videos
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YTAPIKEY}&type=video&part=snippet&maxResults=12&q=${keyword}`
      );
      const searchJson: YouTubeSearchResponse = await searchRes.json();
      const items = searchJson.items;

      const videoIds = items.map((i) => i.id.videoId).join(",");
      const channelIds = [
        ...new Set(items.map((i) => i.snippet.channelId)),
      ].join(",");

      // 2. Fetch video details (durations)
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YTAPIKEY}`
      );
      const videosJson: YouTubeVideoResponse = await videosRes.json();

      const durations: Record<string, string> = {};
      videosJson.items.forEach((vid) => {
        durations[vid.id] = formatDuration(vid.contentDetails.duration);
      });

      // 3. Fetch channel details (icons)
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${YTAPIKEY}`
      );
      const channelJson: YouTubeChannelResponse = await channelRes.json();

      const channelIcons: Record<string, string> = {};
      channelJson.items.forEach((ch) => {
        channelIcons[ch.id] = ch.snippet.thumbnails.default.url;
      });

      // 4. Merge data
      const finalVideos: VideoData[] = items.map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        image: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle,
        channelIcon: channelIcons[item.snippet.channelId],
        duration: durations[item.id.videoId],
      }));

      setVideos(finalVideos);
    } catch (err) {
      if (err instanceof Error) {
        console.error("YouTube fetch error:", err.message);
      } else {
        console.error("Unknown error fetching YouTube data:", err);
      }
    }
  };

  useEffect(() => {
    getYtRes();
  }, [keyword]);

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
