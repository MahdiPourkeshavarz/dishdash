import apiClient from "@/lib/axiosClient";
import { Poi } from "@/types";
import L from "leaflet";

export const fetchPoisInBounds = async (
  bounds: L.LatLngBounds
): Promise<Poi[]> => {
  const { data } = await apiClient.get("places", {
    params: {
      sw_lat: bounds.getSouth(),
      sw_lng: bounds.getWest(),
      ne_lat: bounds.getNorth(),
      ne_lng: bounds.getEast(),
    },
  });

  return data;
};
