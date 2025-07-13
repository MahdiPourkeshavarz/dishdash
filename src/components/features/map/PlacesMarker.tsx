"use client";

import { useMemo } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Poi } from "@/services/osmService";
import { useStore } from "@/store/useStore";
import { Clock, Globe, MapPin, Phone } from "lucide-react";

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
  const { theme } = useStore();

  const poiMarkers = useMemo(() => {
    return pois
      .map((poi) => {
        if (!poi.tags?.name) return null;

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
          <Marker key={poi.id} position={[poi.lat, poi.lon]} icon={iconToUse}>
            <Popup className="custom-popupp">
              <div
                className={`w-60 rounded-lg p-3 text-sm ${
                  theme === "dark"
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900"
                } backdrop-blur-md`}
              >
                <h3 className="font-bold text-base mb-2 text-center">
                  {poi.tags.name}
                </h3>

                <div
                  className={`space-y-2 border-t pt-2 mt-2 text-xs ${
                    theme === "dark" ? "border-white/10" : "border-black/10"
                  }`}
                >
                  {poi.tags["addr:street"] &&
                    (() => {
                      const isFarsi = /[\u0600-\u06FF]/.test(
                        poi.tags["addr:street"] ?? ""
                      );
                      const addressDirection = isFarsi ? "rtl" : "ltr";
                      const addressFlex = isFarsi
                        ? "flex-row-reverse"
                        : "flex-row";
                      const addressTextAlign = isFarsi
                        ? "text-right"
                        : "text-left";

                      return (
                        <div
                          className={`flex items-center gap-2 ${addressFlex} ${addressTextAlign} w-full justify-between`}
                          dir={addressDirection}
                        >
                          <span className="flex-1">
                            {poi.tags["addr:street"]}
                          </span>
                          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </div>
                      );
                    })()}
                  {poi.tags.opening_hours && (
                    <div
                      className="flex items-center gap-2 flex-row text-left w-full justify-between"
                      dir="ltr"
                    >
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1">{poi.tags.opening_hours}</span>
                    </div>
                  )}
                  {poi.tags.phone && (
                    <a
                      href={`tel:${poi.tags.phone}`}
                      className="flex items-center gap-2 flex-row text-left hover:text-blue-400 w-full justify-between"
                      dir="ltr"
                      aria-label={`Call ${poi.tags.phone}`}
                    >
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1">{poi.tags.phone}</span>
                    </a>
                  )}
                  {poi.tags.website && (
                    <a
                      href={poi.tags.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 flex-row text-left hover:text-blue-400 truncate w-full justify-between"
                      dir="ltr"
                      aria-label={`Visit website ${poi.tags.website}`}
                    >
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="flex-1 truncate">
                        {poi.tags.website}
                      </span>
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })
      .filter(Boolean);
  }, [pois, theme]);

  return <>{poiMarkers}</>;
};
