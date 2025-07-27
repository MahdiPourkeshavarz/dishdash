"use client";

import { useMemo } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { useStore } from "@/store/useStore";
import { Poi } from "@/types";

interface PoiMarkersLayerProps {
  pois: Poi[];
}

export const PlacesMarker: React.FC<PoiMarkersLayerProps> = ({ pois }) => {
  const { theme, setSelectedPoi, setHighlightedPoi } = useStore();
  const map = useMap();

  const restaurantIcon = L.icon({
    iconUrl: theme === "light" ? "./restaurants.png" : "./restaurants-dark.png",
    iconSize: theme === "light" ? [30, 32] : [27, 36],
    iconAnchor: [15, 32],
    popupAnchor: [0, 0],
    className: "map-poi-icon",
  });

  const cafeIcon = L.icon({
    iconUrl: theme === "light" ? "./cafe.png" : "./cafe-dark.png",
    iconSize: theme === "light" ? [30, 32] : [27, 36],
    iconAnchor: [15, 32],
    popupAnchor: [0, 0],
    className: "map-poi-icon",
  });

  const fastfoodIcon = L.icon({
    iconUrl: theme === "light" ? "./fastfood.png" : "./fastfood-dark.png",
    iconSize: theme === "light" ? [30, 33] : [27, 36],
    iconAnchor: [15, 32],
    popupAnchor: [0, 0],
    className: "map-poi-icon",
  });

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

        const currentZoom = map.getZoom();
        const showlabel = currentZoom >= 18;

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
          >
            {showlabel && (
              <Tooltip
                direction="top"
                offset={[43, -30]}
                opacity={1}
                permanent
                className={`custom-label ${
                  theme === "dark" ? "dark-theme" : "light-theme"
                }`}
              >
                <span>{poi.tags.name}</span>
              </Tooltip>
            )}
          </Marker>
        );
      })
      .filter(Boolean);
  }, [pois, theme]);

  return <>{poiMarkers}</>;
};
