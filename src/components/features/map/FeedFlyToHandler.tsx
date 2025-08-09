"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useStore } from "@/store/useStore";

export function FeedFlyToHandler() {
  const map = useMap();
  const { feedFlyToCoords } = useStore();

  useEffect(() => {
    if (feedFlyToCoords) {
      map.flyTo(feedFlyToCoords, 17, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
    }
  }, [feedFlyToCoords, map]);
  return null;
}
