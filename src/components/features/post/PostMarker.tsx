"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Post, SatisfactionStatus } from "@/types";
import PostCard from "./Post";

const awesomeIcon = new L.Icon({
  iconUrl: "/awesome-marker.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const goodIcon = new L.Icon({
  iconUrl: "/good-marker.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const badIcon = new L.Icon({
  iconUrl: "/bad-marker.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

const getIconForStatus = (status: SatisfactionStatus) => {
  switch (status) {
    case "awesome":
      return awesomeIcon;
    case "good":
      return goodIcon;
    case "bad":
      return badIcon;
    default:
      return goodIcon;
  }
};

interface PostMarkerProps {
  post: Post;
}

const PostMarker: React.FC<PostMarkerProps> = ({ post }) => {
  return (
    <Marker position={post.position} icon={getIconForStatus(post.satisfaction)}>
      <Popup
        className="custom-popup bg-transparent shadow-none p-0"
        maxWidth={320}
        autoPanPadding={[50, 50]}
      >
        <PostCard post={post} />
      </Popup>
    </Marker>
  );
};

export default PostMarker;
