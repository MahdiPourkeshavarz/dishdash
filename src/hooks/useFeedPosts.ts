import apiClient from "@/lib/axiosClient";
import { createBoundingBox } from "@/lib/createBoundingBox";
import { useStore } from "@/store/useStore";
import { useMemo } from "react";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";

const fetchFeedPosts = async (bbox: L.LatLngBounds) => {
  const { data } = await apiClient.get("posts", {
    params: {
      sw_lat: bbox.getSouth(),
      sw_lng: bbox.getWest(),
      ne_lat: bbox.getNorth(),
      ne_lng: bbox.getEast(),
    },
  });
  return data;
};

export const usePostFeed = () => {
  const { location: userLocation } = useStore();

  const feedBbox = useMemo(() => {
    if (!userLocation.coords) return null;
    const center = L.latLng(userLocation.coords[0], userLocation.coords[1]);
    return createBoundingBox(center, 30000);
  }, [userLocation.coords]);

  return useQuery({
    queryKey: ["posts", "feed"],
    queryFn: () => fetchFeedPosts(feedBbox!),
    enabled: !!feedBbox,
    staleTime: 1000 * 60 * 5,
  });
};
