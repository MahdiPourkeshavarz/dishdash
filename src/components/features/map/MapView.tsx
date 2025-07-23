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
import { Poi, Post, User } from "@/types";
import UserLocationMarker from "./UserLocationMarker";
import ChangeView from "./ChangeView";
import { useEffect, useMemo, useRef, useState } from "react";
import PostMarker from "../post/PostMarker";
import { MapStyleSwitcher } from "./MapStyleSwticher";
import { FindLocationButton } from "./FindLocationButton";
import { PoiLoader } from "./PoiLoader";
import { PlacesMarker } from "./PlacesMarker";
import { LocationDetailCard } from "./LocationDetailCard";
import { useClickOutside } from "@/hooks/useClickOutside";
import { motion, AnimatePresence } from "framer-motion";
import { PostCarouselOverlay } from "./PostCarouselOverlay";
import { FlyToLocation } from "./FlyToLocation";
import { Heart } from "lucide-react";
import { WishPlacesModal } from "../wishPlaces/WishPlaces";
import { getDistanceInMeters } from "@/lib/getDistance";

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
  const { theme, posts, selectedPoi, setSelectedPoi, mapUrl } = useStore();
  const [pois, setPois] = useState<Poi[]>([]);
  const [isWishlistOpen, setWishlistOpen] = useState(false);

  const locationCardRef = useRef<HTMLDivElement>(null);
  const zoomLevel = 15;

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // const poiToHighlight = useMemo(() => {
  //   return pois.find((p) => p.id === highlightedPoiId);
  // }, [highlightedPoiId, pois]);

  // const highlightPosition = useMemo(() => {
  //   if (!poiToHighlight) return null;

  //   const lat = poiToHighlight.lat ?? poiToHighlight.position?.[1];
  //   const lon = poiToHighlight.lon ?? poiToHighlight.position?.[0];

  //   if (lat === undefined || lon === undefined) return null;

  //   return [lat, lon] as [number, number];
  // }, [poiToHighlight]);

  const groupedPosts = useMemo(() => {
    const DISTANCE_THRESHOLD = 10; // 10 meters

    // 1. Separate posts by source
    const poiPosts = posts.filter((p) => p.source === "poi");
    const userPosts = posts.filter((p) => p.source !== "poi");

    // 2. Group POI posts by exact location (original logic)
    const poiGroups: Post[][] = [];
    const poiGroupMap: { [key: string]: Post[] } = {};
    poiPosts.forEach((post) => {
      const key = post.position.join(",");
      if (!poiGroupMap[key]) {
        poiGroupMap[key] = [];
      }
      poiGroupMap[key].push(post);
    });
    poiGroups.push(...Object.values(poiGroupMap));

    // 3. Group user posts by proximity
    const userGroups: Post[][] = [];
    const processedUserPostIds = new Set<string>();

    for (const post of userPosts) {
      if (processedUserPostIds.has(post.id)) continue;

      const nearbyGroup: Post[] = [post];
      processedUserPostIds.add(post.id);

      for (const otherPost of userPosts) {
        if (processedUserPostIds.has(otherPost.id)) continue;

        if (
          getDistanceInMeters(post.position, otherPost.position) <
          DISTANCE_THRESHOLD
        ) {
          nearbyGroup.push(otherPost);
          processedUserPostIds.add(otherPost.id);
        }
      }
      userGroups.push(nearbyGroup);
    }

    // 4. Combine all groups
    return [...poiGroups, ...userGroups];
  }, [posts]);

  const handleCloseDetail = () => {
    setSelectedPoi(null);
  };

  useClickOutside(locationCardRef, () => {
    if (selectedPoi) handleCloseDetail();
  });

  const mapCenter = center || defaultPosition;

  return (
    <div className="relative overflow-hidden w-screen h-screen" dir="rtl">
      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={!selectedPoi}
        dragging={!selectedPoi}
        className="w-full h-full !z-0"
        zoomControl={false}
      >
        <TileLayer url={mapUrl} />
        <ChangeView center={mapCenter} zoom={zoomLevel} />

        <FlyToLocation />

        <PoiLoader setPois={setPois} />

        <PlacesMarker pois={pois} />

        {/* {highlightPosition && (
          <HighlightMarker
            position={highlightPosition}
            onComplete={() => setHighlightedPoi(null)}
          />
        )} */}

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

      <AnimatePresence>
        {selectedPoi && (
          <motion.div
            key="location-detail"
            ref={locationCardRef}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <PostCarouselOverlay poi={selectedPoi} posts={posts} />
            <LocationDetailCard
              poi={selectedPoi}
              onClose={handleCloseDetail}
              onAddPost={() => {
                handleCloseDetail();
                onMarkerClick();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isMounted && (
        <>
          <MapStyleSwitcher />
          <div className="absolute top-2/7 right-4 z-[10000]">
            <motion.button
              onClick={() => setWishlistOpen(!isWishlistOpen)}
              className={`p-3 rounded-full shadow-lg ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Heart size={24} />
            </motion.button>
            <AnimatePresence>
              <WishPlacesModal isOpen={isWishlistOpen} />
            </AnimatePresence>
          </div>
          <FindLocationButton />
        </>
      )}
    </div>
  );
};

export default MapView;
