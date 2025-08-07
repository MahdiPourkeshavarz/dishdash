"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useStore } from "@/store/useStore";

export function FeedFlyToHandler() {
  const map = useMap();
  const { feedFlyToCoords, setFeedFlyToCoords } = useStore();

  useEffect(() => {
    if (feedFlyToCoords) {
      map.flyTo(feedFlyToCoords, 18, {
        duration: 1.5,
        easeLinearity: 0.5,
      });
      setFeedFlyToCoords(null);
    }
  }, [feedFlyToCoords, map, setFeedFlyToCoords]);

  return null;
}
