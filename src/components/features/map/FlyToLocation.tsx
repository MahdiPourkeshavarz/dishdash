"use client";
import { useEffect, useState, useMemo, useRef } from "react";
import { useMap } from "react-leaflet";
import { useStore } from "@/store/useStore";
import { AnimatePresence } from "framer-motion";
import { HighlightMarker } from "./HighlightMarker";
import { Poi } from "@/types";

export function FlyToLocation() {
  const map = useMap();
  const { flyToTarget, setFlyToTarget, setSelectedPoi } = useStore();
  const [poiToHighlight, setPoiToHighlight] = useState<Poi | null>(null);

  const highlightTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (flyToTarget) {
      const targetCoords: [number, number] = flyToTarget.position
        ? [flyToTarget.position[1], flyToTarget.position[0]]
        : [flyToTarget.lat, flyToTarget.lon];

      map.flyTo(targetCoords, 16, { duration: 2.2 });

      map.once("moveend", () => {
        setSelectedPoi(flyToTarget);
        setPoiToHighlight(flyToTarget);

        if (highlightTimerRef.current) {
          clearTimeout(highlightTimerRef.current);
        }
        highlightTimerRef.current = setTimeout(() => {
          setPoiToHighlight(null);
        }, 3500);
      });
    }
  }, [flyToTarget, map, setFlyToTarget, setSelectedPoi]);

  const highlightPosition = useMemo((): [number, number] | null => {
    if (!poiToHighlight) return null;
    return poiToHighlight.position
      ? [poiToHighlight.position[1], poiToHighlight.position[0]]
      : [poiToHighlight.lat, poiToHighlight.lon];
  }, [poiToHighlight]);

  const highlightName = poiToHighlight?.tags?.name as string;

  return (
    <AnimatePresence>
      {poiToHighlight && highlightPosition && (
        <HighlightMarker position={highlightPosition} name={highlightName} />
      )}
    </AnimatePresence>
  );
}
