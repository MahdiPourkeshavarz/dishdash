"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useStore } from "@/store/useStore";

export function FlyToLocation() {
  const map = useMap();
  const { flyToTarget, setFlyToTarget, setSelectedPoi, setHighlightedPoi } =
    useStore();

  useEffect(() => {
    if (flyToTarget) {
      const targetCoords: [number, number] = [flyToTarget.lat, flyToTarget.lon];

      map.flyTo(targetCoords, 16, {
        duration: 2.2,
      });

      map.once("moveend", () => {
        setSelectedPoi(flyToTarget);
        setHighlightedPoi(flyToTarget.id);
        setFlyToTarget(null);
      });
    }
  }, [flyToTarget, setFlyToTarget, setSelectedPoi, map, setHighlightedPoi]);

  return null;
}
