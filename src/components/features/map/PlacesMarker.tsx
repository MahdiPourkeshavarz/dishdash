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
  const { theme, setSelectedPoi, setHighlightedPoi, foodTruckMode } =
    useStore();
  const map = useMap();

  const foodTruckIcon = L.icon({
    iconUrl: "food-truck.png",
    iconSize: theme === "light" ? [30, 32] : [27, 36],
    iconAnchor: [15, 32],
    popupAnchor: [0, 0],
    className: "map-poi-icon",
  });

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
        if (!poi?.name) return null;

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
          case "food_truck":
            iconToUse = foodTruckIcon;
            break;
          default:
            return null;
        }

        const currentZoom = map.getZoom();
        const showlabel = currentZoom >= 18;

        const themeIsDark = theme === "dark" ? true : false;

        return (
          <Marker
            key={keyId + poi?.name}
            position={[lat, lon]}
            icon={iconToUse}
            eventHandlers={{
              click: () => {
                setSelectedPoi(poi);
                setHighlightedPoi(poi.id);
              },
            }}
          >
            {showlabel && themeIsDark && (
              <Tooltip
                direction="top"
                offset={[46, 20]}
                opacity={1}
                permanent
                className={`custom-label ${
                  theme === "dark" ? "dark-theme" : "light-theme"
                }`}
              >
                <span>{poi.name}</span>
              </Tooltip>
            )}
          </Marker>
        );
      })
      .filter(Boolean);
  }, [pois, theme, foodTruckMode]);

  return <>{poiMarkers}</>;
};
