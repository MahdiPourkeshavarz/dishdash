/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Sun, Moon } from "lucide-react";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { posts } from "@/lib/posts";
import PostMarker from "../post/PostMarker";
import { useStore } from "@/store/useStoreStore";
import { User } from "@/types";
import UserLocationMarker from "./UserLocationMarker";
import ChangeView from "./ChangeView";
import { useEffect, useState } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapViewProps {
  // We can add props later, e.g., for posts, user location, etc.
}

interface MapViewProps {
  center?: [number, number] | null;
  user: User | null;
  onMarkerClick: () => void;
}

const MapView: React.FC<MapViewProps> = ({ center, user, onMarkerClick }) => {
  const defaultPosition: [number, number] = [35.6892, 51.389];
  const { theme, toggleTheme } = useStore();

  const zoomLevel = 13;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tileLayers = {
    voyager: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/attributions">CARTO</a>',
    },
    darkMatter: {
      url: "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/attributions">CARTO</a>',
    },
  };

  const mapCenter = center || defaultPosition;

  return (
    <div className="relative overflow-hidden w-screen h-screen" dir="rtl">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        className="w-full h-full !z-0"
        zoomControl={false}
      >
        <TileLayer
          url={
            theme === "dark"
              ? tileLayers.darkMatter.url
              : tileLayers.voyager.url
          }
        />
        <ChangeView center={mapCenter} zoom={zoomLevel} />

        {center && (
          <UserLocationMarker
            position={center}
            user={user}
            onClick={onMarkerClick}
          />
        )}

        {posts.map((post) => (
          <PostMarker key={post.id} post={post} />
        ))}
      </MapContainer>

      {isMounted && (
        <button
          onClick={toggleTheme}
          className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-10 h-10 text-blue-600" />
          ) : (
            <Moon className="w-10 h-10 text-blue-600" />
          )}
        </button>
      )}
    </div>
  );
};

export default MapView;
