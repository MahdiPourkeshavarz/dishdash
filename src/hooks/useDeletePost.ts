/* eslint-disable @typescript-eslint/no-unused-vars */
import apiClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const deletePost = async (postId: string) => {
  try {
    const { data } = await apiClient.delete(`posts/${postId}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: (deletedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      throw error;
    },
  });
};
