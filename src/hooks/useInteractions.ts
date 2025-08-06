"use client";

import apiClient from "@/lib/axiosClient";
import { Poi } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const likePost = (postId: string) => apiClient.post(`posts/${postId}/like`);
const dislikePost = (postId: string) =>
  apiClient.post(`posts/${postId}/dislike`);

export const useLikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

export const useDislikePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dislikePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

const addToWishlist = (poi: Poi) => {
  console.log(poi);
  const positionToUse: [number, number] = poi.position
    ? [poi.position[1], poi.position[0]]
    : [poi.lon, poi.lat];

  const osmId = poi.id || (poi.osmId as number);
  const placeToSave = {
    name: poi.tags.name,
    osmId,
    position: positionToUse,
    tags: poi.tags,
    _id: poi._id,
  };
  return apiClient.post("interactions/wishlist", { poi: placeToSave });
};

const removeFromWishlist = (placeId: string) => {
  return apiClient.delete(`interactions/wishlist/${placeId}`);
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["populatedWishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["populatedWishlist"] });
    },
  });
};

interface RatePlacePayload {
  placeId: string;
  score: number;
}

const ratePlace = async ({ placeId, score }: RatePlacePayload) => {
  const { data } = await apiClient.post(`/interactions/${placeId}/rate`, {
    score,
  });
  return data;
};

export const useRatePlace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ratePlace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pois"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
