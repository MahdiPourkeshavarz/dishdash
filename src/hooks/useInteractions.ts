"use client";

import apiClient from "@/lib/axiosClient";
import { Poi } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const likePost = (postId: string) => apiClient.post(`posts/${postId}/like`);
const dislikePost = (postId: string) =>
  apiClient.post(`posts/${postId}/dislike`);

export const useLikePost = () => {
  return useMutation({ mutationFn: likePost });
};

export const useDislikePost = () => {
  return useMutation({ mutationFn: dislikePost });
};

const addToWishlist = (poi: Poi) => {
  return apiClient.post("interactions/wishlist", { poi });
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
