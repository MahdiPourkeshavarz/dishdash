/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useStore } from "@/store/useStore";
import { Post, User } from "@/types";
import UserLocationMarker from "./UserLocationMarker";
import ChangeView from "./ChangeView";
import { useEffect, useMemo, useState } from "react";
import PostMarker from "../post/PostMarker";
import { useMapStyle } from "@/store/useMapStyle";
import { MapStyleSwitcher } from "./MapStyleSwticher";
import { FindLocationButton } from "./FindLocationButton";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapViewProps {
  center?: [number, number] | null;
  user: User | null;
  onMarkerClick: () => void;
}

const MapView: React.FC<MapViewProps> = ({ center, user, onMarkerClick }) => {
  const defaultPosition: [number, number] = [35.6892, 51.389];
  const { theme, posts } = useStore();

  const zoomLevel = 15;

  const [isMounted, setIsMounted] = useState(false);

  const mapStyles = useMapStyle();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const groupedPosts = useMemo(() => {
    const groups: { [key: string]: Post[] } = {};
    posts.forEach((post) => {
      const key = post.position.join(",");
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(post);
    });
    return Object.values(groups);
  }, [posts]);

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
          url={theme === "dark" ? mapStyles.dark.url : mapStyles.light.url}
          attribution={
            theme === "dark"
              ? mapStyles.dark.attribution
              : mapStyles.light.attribution
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

        {groupedPosts.map((postGroup) => (
          <PostMarker key={postGroup[0].id} posts={postGroup} theme={theme} />
        ))}
      </MapContainer>

      {isMounted && (
        <>
          <MapStyleSwitcher />
          <FindLocationButton />
        </>
      )}
    </div>
  );
};

export default MapView;
