/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/axiosClient";
import { getDistanceInMeters } from "@/lib/getDistance";
import { useStore } from "@/store/useStore";
import { Poi, SearchParams } from "@/types";
import { useMutation } from "@tanstack/react-query";

const performSearch = async (params: SearchParams): Promise<Poi[]> => {
  const query = new URLSearchParams({
    term: params.searchTerm,
    atmosphere: params.atmosphere,
    amenity: params.amenity,
  });
  const { data } = await apiClient.get(`search?${query.toString()}`);
  return data;
};

export const useSearch = () => {
  const userLocation = useStore((state) => state.location.coords);
  const { setIsSearching } = useStore();

  return useMutation({
    mutationFn: async (params: SearchParams) => {
      if (!params.searchTerm) {
        return [];
      }
      if (!userLocation) {
        throw new Error("User location is not available to filter results.");
      }

      setIsSearching(true);

      const results: Poi[] = await performSearch(params);

      const distanceRadiusMap = {
        walking: 1000, // 1km
        near: 7500, // 7km
        driving: 21000, // 21km
      };
      const maxDistance = distanceRadiusMap[params.distance];

      return results.filter((place) => {
        if (!place.position) return false;
        const placeCoords: [number, number] = [
          place.position[1],
          place.position[0],
        ];
        const distance = getDistanceInMeters(userLocation, placeCoords);
        return distance <= maxDistance;
      });
    },
  });
};
