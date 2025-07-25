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
