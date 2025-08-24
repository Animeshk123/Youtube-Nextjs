"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { YTAPIKEY } from "@/lib/env";
import VideoList from "@/components/VideoList";
// import YouTubeVideoCardSkeleton from "@/components/LoaderCard";
import VideoCardSkeleton from "@/components/ListSkleton";

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

export default function WatchPage() {
  const { id } = useParams();
  const [suggestions, setSuggestions] = useState<VideoData[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [loadingVideo, setLoadingVideo] = useState(true);

  const fetchSuggestions = async () => {
    try {
      setLoadingSuggestions(true);
      // 1. Get video title from YouTube
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${YTAPIKEY}`
      );
      const videoJson = await videoRes.json();
      const videoTitle =
        videoJson.items?.[0]?.snippet?.title || "related videos";

      // 2. Ask Gemini for a smart search query
      const geminiRes = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: videoTitle }),
      });
      const { query } = await geminiRes.json();

      // 3. Search YouTube with Gemini’s query
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=15&q=${encodeURIComponent(
          query
        )}&key=${YTAPIKEY}`
      );
      const searchJson = await searchRes.json();
      const items = searchJson.items || [];

      const videoIds = items.map((i: any) => i.id.videoId).join(",");
      const channelIds = [
        ...new Set(items.map((i: any) => i.snippet.channelId)),
      ].join(",");

      // 4. Fetch durations
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YTAPIKEY}`
      );
      const videosJson = await videosRes.json();
      const durations: Record<string, string> = {};
      videosJson.items.forEach((vid: any) => {
        durations[vid.id] = formatDuration(vid.contentDetails.duration);
      });

      // 5. Fetch channel icons
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelIds}&key=${YTAPIKEY}`
      );
      const channelJson = await channelRes.json();
      const channelIcons: Record<string, string> = {};
      channelJson.items.forEach((ch: any) => {
        channelIcons[ch.id] = ch.snippet.thumbnails.default.url;
      });

      // 6. Merge into final list
      const finalVideos: VideoData[] = items.map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        image: item.snippet.thumbnails.high.url,
        channel: item.snippet.channelTitle,
        channelIcon: channelIcons[item.snippet.channelId],
        duration: durations[item.id.videoId],
      }));

      setSuggestions(finalVideos);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [id]);

  return (
    <section className="px-4 py-6">
      <div className="container mx-auto">
        <div className="flex flex-col  lg:flex-row gap-6">
          {/* Left - Main Video */}
          <div className="flex-1 border-2 h-[400px] w-full">
            {loadingVideo && (
              <div className="w-full h-full bg-zinc-900 animate-pulse rounded-md" />
            )}
            <iframe
              width="100%"
              height="100%"
              onLoad={() => setLoadingVideo(false)}
              className={`w-full h-full rounded-md ${
                loadingVideo ? "hidden" : "block"
              }`}
              src={`https://www.youtube.com/embed/${id}?controls=1&rel=0&showinfo=0&modestbranding=1&autohide=1&rel=0`}
              title="YouTube video player"
              allow="autoplay"
              allowFullScreen
            ></iframe>
          </div>

          {/* Right - Suggestions */}
          <div className="w-full lg:w-[400px] flex-shrink-0 space-y-4">
            {loadingSuggestions
              ? Array.from({ length: 8 }).map((_, index) => (
                  <VideoCardSkeleton key={index} />
                ))
              : suggestions.map((item, index) => (
                  <VideoList
                    key={index}
                    image={item.image}
                    title={item.title}
                    videoId={item.videoId}
                    channel={item.channel}
                    channelIcon={item.channelIcon}
                    duration={item.duration}
                  />
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
