"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { useStore } from "@/store/useStore";

export function FlyToLocation() {
  const map = useMap();
  const { flyToLocation, setFlyToLocation } = useStore();

  useEffect(() => {
    if (flyToLocation) {
      map.flyTo(flyToLocation, 16);
      setFlyToLocation(null);
    }
  }, [flyToLocation, setFlyToLocation, map]);

  return null;
}
