"use client";

import { useEffect } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

interface HighlightMarkerProps {
  position: [number, number];
  onComplete: () => void;
}

const pulseIcon = L.divIcon({
  className: "bg-transparent border-none",
  html: `
    <div class="relative w-10 h-10 mr-1 mb-[2px]">
      <div
        class="absolute inset-0 rounded-full border-2 border-blue-400/80 animate-pulse-glow"
        style="animation-delay: 0s;"
      ></div>
      <div
        class="absolute inset-0 rounded-full border-2 border-blue-400/80 animate-pulse-glow"
        style="animation-delay: 0.5s;"
      ></div>
      <div
        class="absolute inset-0 rounded-full border-2 border-blue-400/80 animate-pulse-glow"
        style="animation-delay: 0.5s;"
      ></div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export const HighlightMarker: React.FC<HighlightMarkerProps> = ({
  position,
  onComplete,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return <Marker position={position} icon={pulseIcon} interactive={false} />;
};
