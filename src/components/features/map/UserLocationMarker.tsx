"use client";

import { Marker } from "react-leaflet";
import L from "leaflet";
import { User } from "@/types";

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

  const userIcon = new L.DivIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <img src="/person.png" class="w-12 h-12" alt="Your Location"/>
        <img
          src="${user.imgUrl}"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-2 border-white shadow-md"
          alt="${user.username}"
        />
      </div>
    `,
    className: "bg-transparent border-none",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
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
