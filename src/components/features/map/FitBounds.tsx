import { useEffect, useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { Poi } from "@/types";

interface FitBoundsProps {
  pois: Poi[];
}

export const FitBounds: React.FC<FitBoundsProps> = ({ pois }) => {
  const map = useMap();

  const points = useMemo((): L.LatLngExpression[] => {
    if (!pois) return [];

    return pois
      .map((poi) => {
        const lat = poi.lat ?? poi.position?.[1];
        const lon = poi.lon ?? poi.position?.[0];

        if (typeof lat === "number" && typeof lon === "number") {
          return [lat, lon];
        }
        return null;
      })
      .filter(Boolean) as L.LatLngExpression[];
  }, [pois]);

  useEffect(() => {
    if (points && points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [points, map]);

  return null;
};
