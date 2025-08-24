"use client";
import React, { useEffect, useState } from "react";
import { YTAPIKEY } from "@/lib/env";
import VideoCard from "@/components/VideoCard";
import YouTubeVideoCardSkeleton from "@/components/LoaderCard";
import { useParams } from "next/navigation";

interface YTResponseType {
  id: { videoId: string };
  snippet: {
    channelId: string;
    channelTitle: string;
    title: string;
    thumbnails: { high: { url: string } };
  };
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

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function Page() {
  const { keyword } = useParams();
  const [videos, setVideos] = useState<VideoData[]>([]);

  const getYtRes = async () => {
    try {
      // 1. Search videos
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YTAPIKEY}&type=video&part=snippet&maxResults=12&q=${keyword}`
      );
      const searchJson = await searchRes.json();
      const items: YTResponseType[] = searchJson.items;

      const videoIds = items.map((i) => i.id.videoId).join(",");
      const channelIds = [
        ...new Set(items.map((i) => i.snippet.channelId)),
      ].join(",");

      // 2. Fetch video details (for duration)
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YTAPIKEY}`
      );
      const videosJson = await videosRes.json();

      const durations: Record<string, string> = {};
      videosJson.items.forEach((vid: any) => {
        durations[vid.id] = formatDuration(vid.contentDetails.duration);
      });

      // 3. Fetch channel details (for channel icons)
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${YTAPIKEY}`
      );
      const channelJson = await channelRes.json();

      const channelIcons: Record<string, string> = {};
      channelJson.items.forEach((ch: any) => {
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
      console.error(err);
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
            videos.map((item, index) => (
              <VideoCard
                key={index}
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
