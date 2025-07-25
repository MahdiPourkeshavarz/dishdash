/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMapEvents } from "react-leaflet";
import { useEffect, useRef } from "react";
import { LatLngBounds } from "leaflet";

interface MapEventsProps {
  onBoundsChange: (bbox: any) => void;
}

export const MapEvents: React.FC<MapEventsProps> = ({ onBoundsChange }) => {
  const initialLoadRef = useRef(true);

  const map = useMapEvents({
    moveend: () => {
      const bounds: LatLngBounds = map.getBounds();
      const bbox = {
        sw_lat: bounds.getSouthWest().lat,
        sw_lng: bounds.getSouthWest().lng,
        ne_lat: bounds.getNorthEast().lat,
        ne_lng: bounds.getNorthEast().lng,
      };
      onBoundsChange(bbox);
    },
  });

  useEffect(() => {
    if (initialLoadRef.current && map) {
      map.fire("moveend");
      initialLoadRef.current = false;
    }
  }, [map, onBoundsChange]);

  return null;
};
