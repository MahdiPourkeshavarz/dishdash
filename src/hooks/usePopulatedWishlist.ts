import apiClient from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

const fetchPopulatedWishlist = async () => {
  const response = await apiClient.get("interactions/wishlist");
  const items: { placeId: string }[] = response.data;

  if (!items || items.length === 0) return [];

  const placePromises = items.map((item) =>
    apiClient.get(`/places/${item.placeId}`).then((res) => res.data)
  );

  const populatedPlaces = await Promise.all(placePromises);
  return populatedPlaces.filter((place) => place != null);
};

export const usePopulatedWishlist = (options: { enabled?: boolean } = {}) => {
  return useQuery({
    queryKey: ["populatedWishlist"],
    queryFn: fetchPopulatedWishlist,
    enabled: options.enabled,
  });
};
