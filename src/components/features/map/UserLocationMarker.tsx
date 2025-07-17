"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { User } from "@/types";

const userLocationIcon = L.icon({
  iconUrl: "/userLocation.png",
  iconSize: [30, 30],
  iconAnchor: [20, 40],
  className: "drop-shadow-lg",
});

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
  if (!position || !user) {
    return null;
  }

  return (
    <Marker
      position={position}
      zIndexOffset={1000}
      icon={userLocationIcon}
      eventHandlers={{
        click: () => {
          onClick();
        },
      }}
    />
  );
};

export default UserLocationMarker;
