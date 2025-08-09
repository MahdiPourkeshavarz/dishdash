import { useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import L from "leaflet";
import { useStore } from "@/store/useStore";
import apiClient from "@/lib/axiosClient";
import { createBoundingBox } from "@/lib/createBoundingBox";

const fetchFeedPosts = async ({
  pageParam = 1,
  bbox,
}: {
  pageParam?: number;
  bbox: L.LatLngBounds;
}) => {
  const { data } = await apiClient.get("posts/feed", {
    params: {
      page: pageParam,
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

  return useInfiniteQuery({
    queryKey: ["posts", "feed", feedBbox?.toBBoxString()],
    queryFn: ({ pageParam }) => fetchFeedPosts({ pageParam, bbox: feedBbox! }),
    enabled: !!feedBbox,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
  });
};
