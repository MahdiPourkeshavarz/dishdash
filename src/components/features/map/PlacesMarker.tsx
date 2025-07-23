"use client";

import { useMemo } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/store/useStore";
import { Poi } from "@/types";

const restaurantIcon = L.icon({
  iconUrl: "./restaurants.png",
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const cafeIcon = L.icon({
  iconUrl: "./cafe.png",
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const fastfoodIcon = L.icon({
  iconUrl: "./fastfood.png",
  iconSize: [24, 24],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

interface PoiMarkersLayerProps {
  pois: Poi[];
}

export const PlacesMarker: React.FC<PoiMarkersLayerProps> = ({ pois }) => {
  const { theme, setSelectedPoi, setHighlightedPoi } = useStore();

  const poiMarkers = useMemo(() => {
    return pois
      .map((poi) => {
        if (!poi.tags?.name) return null;

        const lat = poi.lat ?? poi.position?.[1];
        const lon = poi.lon ?? poi.position?.[0];

        const keyId = poi._id || poi.id;

        if (lat === undefined || lon === undefined) return null;

        let iconToUse;
        switch (poi.tags.amenity) {
          case "restaurant":
            iconToUse = restaurantIcon;
            break;
          case "fast_food":
            iconToUse = fastfoodIcon;
            break;
          case "cafe":
            iconToUse = cafeIcon;
            break;
          default:
            return null;
        }

        return (
          <Marker
            key={keyId + poi.tags.name}
            position={[lat, lon]}
            icon={iconToUse}
            eventHandlers={{
              click: () => {
                setSelectedPoi(poi);
                setHighlightedPoi(poi.id);
              },
            }}
          />
        );
      })
      .filter(Boolean);
  }, [pois, theme]);

  return <>{poiMarkers}</>;
};
