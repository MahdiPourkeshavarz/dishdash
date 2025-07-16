"use client";

import { useMapEvents } from "react-leaflet";
import { fetchPois } from "@/services/osmService";
import { useState } from "react";
import { Poi } from "@/types";

interface PoiLoaderProps {
  setPois: (pois: Poi[]) => void;
}

export const PoiLoader: React.FC<PoiLoaderProps> = ({ setPois }) => {
  const [isLoading, setIsLoading] = useState(false);

  const map = useMapEvents({
    // This event fires when the user stops moving the map
    moveend: async () => {
      if (isLoading) return;

      // We only fetch POIs if the zoom level is close enough
      if (map.getZoom() < 16) {
        setPois([]); // Clear POIs if zoomed out too far
        return;
      }

      setIsLoading(true);
      try {
        const bounds = map.getBounds();
        const fetchedPois = await fetchPois(bounds);
        setPois(fetchedPois);
      } catch (error) {
        console.error("Error fetching POIs:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return null;
};
