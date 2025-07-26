/* eslint-disable @typescript-eslint/no-unused-vars */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/types";
import apiClient from "@/lib/axiosClient";

interface UpdatePostData {
  postId: string;
  updateData: {
    description?: string;
    satisfaction?: string;
  };
}

const updatePostApi = async ({
  postId,
  updateData,
}: UpdatePostData): Promise<Post> => {
  const { data } = await apiClient.patch(`posts/${postId}`, updateData);
  return data;
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePostApi,
    onSuccess: (updatedPost) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    },
  });
};
