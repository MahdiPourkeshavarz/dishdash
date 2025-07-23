/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMap, useMapEvents } from "react-leaflet";
import { Poi } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { fetchPoisInBounds } from "@/services/osmService";
import { useEffect, useState } from "react";

interface PoiLoaderProps {
  setPois: (pois: Poi[]) => void;
}

export const PoiLoader: React.FC<PoiLoaderProps> = ({ setPois }) => {
  const map = useMap();

  const [bounds, setBounds] = useState<L.LatLngBounds>(() => map.getBounds());

  const { data, isSuccess } = useQuery({
    queryKey: ["pois", bounds.toBBoxString()],
    queryFn: () => {
      if (map.getZoom() < 16) {
        return [];
      }
      return fetchPoisInBounds(bounds);
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isSuccess) {
      setPois(data || []);
    }
  }, [isSuccess, data, setPois]);

  useMapEvents({
    moveend: () => setBounds(map.getBounds()),
  });

  return null;
};
