/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Post } from "@/types";
import PostCarousel from "./PostCarousel";

interface PostMarkerProps {
  posts: Post[];
  theme: "light" | "dark";
}

const satisfactionIcons = {
  awesome: "/awesome.png",
  good: "/good.png",
  bad: "/bad.png",
  disgusted: "/disgusted.png",
};

const PostMarker: React.FC<PostMarkerProps> = ({ posts, theme }) => {
  if (!posts || posts.length === 0) return null;

  const topPost = posts[0];
  const isStack = posts.length > 1;
  let customIcon;

  if (isStack && topPost.source === "poi") {
    const displayCount = posts.length > 9 ? "9+" : posts.length;

    const stackIconHtml = `
      <div class="relative w-7 h-7">
        <img src="/clustered-marker.png" class="w-full h-full" alt="Post stack" />
        <div class="absolute inset-0 flex items-center justify-center pb-1 text-blue-700 font-bold text-xs">
          ${displayCount}
        </div>
      </div>
    `;

    customIcon = L.divIcon({
      html: stackIconHtml,
      className: "bg-transparent border-none",
      iconSize: [30, 30],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  } else {
    const iconUrl =
      satisfactionIcons[
        topPost.satisfaction as keyof typeof satisfactionIcons
      ] || satisfactionIcons.good;

    customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [20, 20],
      className: "drop-shadow-lg",
      iconAnchor: [20, 20],
      popupAnchor: [0, -20],
    });
  }

  return (
    <Marker position={topPost.position} icon={customIcon}>
      <Popup className="custom-popup">
        <PostCarousel posts={posts} />
      </Popup>
    </Marker>
  );
};

export default PostMarker;
