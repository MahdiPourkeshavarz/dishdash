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
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(() =>
    map.getBounds()
  );
  const [currentZoom, setCurrentZoom] = useState(() => map.getZoom());

  const { data: fetchedPois } = useQuery({
    queryKey: ["pois", bounds?.toBBoxString()],
    queryFn: () => fetchPoisInBounds(bounds!),
    enabled: !!bounds && currentZoom >= 15,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (currentZoom >= 16) {
      setPois(fetchedPois || []);
    } else {
      setPois([]);
    }
  }, [fetchedPois, setPois, currentZoom]);

  useMapEvents({
    moveend: () => {
      setBounds(map.getBounds());
      setCurrentZoom(map.getZoom());
    },
  });

  return null;
};
