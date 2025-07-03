/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { posts } from "@/lib/posts";
import PostMarker from "../post/PostMarker";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapViewProps {
  // We can add props later, e.g., for posts, user location, etc.
}

const MapView: React.FC<MapViewProps> = () => {
  const defaultPosition: [number, number] = [35.6892, 51.389];

  return (
    <MapContainer
      center={defaultPosition}
      zoom={12}
      scrollWheelZoom={true}
      className="w-full h-full rounded-lg shadow-md !z-0 relative"
      zoomControl={false}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {posts.map((post) => (
        <PostMarker key={post.id} post={post} />
      ))}
    </MapContainer>
  );
};

export default MapView;
