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
  awesome: "/awesome-marker.png",
  good: "/good-marker.png",
  bad: "/bad-marker.png",
};

const satisfactionPinColors = {
  awesome: "#3B82F6", // blue-500
  good: "#22C55E", // green-500
  bad: "#EF4444", // red-500
};

const PostMarker: React.FC<PostMarkerProps> = ({ posts, theme }) => {
  if (!posts || posts.length === 0) return null;

  const topPost = posts[0];
  const isStack = posts.length > 1;
  let customIcon;

  if (isStack) {
    const pinColor = satisfactionPinColors[topPost.satisfaction];
    const stackCounterClasses =
      theme === "dark" ? "bg-white text-black" : "bg-black text-white";

    const svgIconHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${pinColor}" class="w-10 h-10 drop-shadow-lg">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
      <div class="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-4 text-xs font-bold flex items-center justify-center rounded-full border border-gray-500 ${stackCounterClasses}">${posts.length}</div>
    `;

    customIcon = L.divIcon({
      html: `<div class="relative">${svgIconHtml}</div>`,
      className: "bg-transparent border-none",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  } else {
    const iconUrl = satisfactionIcons[topPost.satisfaction];

    customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [40, 40],
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
