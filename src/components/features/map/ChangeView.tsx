"use client";

import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface ChangeViewProps {
  center: [number, number];
  zoom: number;
}

const ChangeView: React.FC<ChangeViewProps> = ({ center, zoom }) => {
  const map = useMap(); // Get the map instance

  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
};

export default ChangeView;
