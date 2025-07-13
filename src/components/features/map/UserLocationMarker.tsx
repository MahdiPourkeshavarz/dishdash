"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { User } from "@/types";
import { MapPin } from "lucide-react";
import { useStore } from "@/store/useStore";
import { renderToStaticMarkup } from "react-dom/server";

interface UserLocationMarkerProps {
  position: [number, number];
  user: User | null;
  onClick: () => void;
}

const UserLocationMarker: React.FC<UserLocationMarkerProps> = ({
  position,
  user,
  onClick,
}) => {
  const { theme } = useStore();
  if (!position || !user) {
    return null;
  }

  const mapPinSvg = renderToStaticMarkup(
    <MapPin
      size={35}
      className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}
    />
  );

  const userIcon = new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center group">
        <svg class="w-10 h-10 ${
          theme === "dark" ? "text-blue-400" : "text-blue-600"
        } group-hover:scale-110 transition-transform duration-200" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));">
          ${mapPinSvg}
        </svg>
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <Marker
      position={position}
      icon={userIcon}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
    />
  );
};

export default UserLocationMarker;
