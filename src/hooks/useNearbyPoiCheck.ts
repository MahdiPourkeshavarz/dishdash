import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as L from "leaflet";
import { Poi } from "@/types";
import { fetchPoisInBounds } from "@/services/osmService";
import { createBoundingBox } from "@/lib/createBoundingBox";
import { useStore } from "@/store/useStore";
import { getDistanceInMeters } from "@/lib/getDistance";

interface UseNearbyPoiCheckProps {
  location: { lat: number; lng: number } | null;
  enabled: boolean;
}

export const useNearbyPoiCheck = ({
  location,
  enabled,
}: UseNearbyPoiCheckProps) => {
  const { setPostTargetLocation } = useStore();
  const [poiToConfirm, setPoiToConfirm] = useState<Poi | null>(null);
  const [isCheckComplete, setIsCheckComplete] = useState(false);

  const {
    data: poi,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["nearbyPoiCheck", location?.lat, location?.lng],
    queryFn: async () => {
      if (!location) return null;

      const center = L.latLng(location.lat, location.lng);
      const bounds = createBoundingBox(center, 6);
      const pois = await fetchPoisInBounds(bounds);

      if (!pois || pois.length === 0) {
        return null;
      }

      if (pois.length === 1) {
        return pois[0];
      }

      return pois.reduce((closest, current) => {
        const userPos: [number, number] = [location.lat, location.lng];
        const closestPos: [number, number] = [closest.lat, closest.lon];
        const currentPos: [number, number] = [current.lat, current.lon];

        const closestDist = getDistanceInMeters(userPos, closestPos);
        const currentDist = getDistanceInMeters(userPos, currentPos);

        return currentDist < closestDist ? current : closest;
      });
    },
    enabled: enabled && !isCheckComplete,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isSuccess) return;

    if (poi) {
      setPoiToConfirm(poi);
    } else {
      setIsCheckComplete(true);
    }
  }, [isSuccess, poi]);

  const confirmPoi = () => {
    if (!poiToConfirm) return;
    setPostTargetLocation({
      name: poiToConfirm.tags?.name || "Unknown Place",
      coords: [poiToConfirm.lat, poiToConfirm.lon],
      osmId: poiToConfirm.id,
    });
    setPoiToConfirm(null);
    setIsCheckComplete(true);
  };

  const rejectPoi = () => {
    setPoiToConfirm(null);
    setIsCheckComplete(true);
  };

  const reset = () => {
    setPoiToConfirm(null);
    setIsCheckComplete(false);
  };

  return {
    poiToConfirm,
    isChecking: isLoading,
    isCheckComplete,
    confirmPoi,
    rejectPoi,
    reset,
  };
};
