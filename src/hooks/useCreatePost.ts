import apiClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostData {
  imageFile: File;
  description: string;
  satisfaction: string;
  position: [number, number] | null;
  areaName?: string | null;
  tags?: string[];
  osmId?: number | null;
}

const createPost = async (postData: CreatePostData) => {
  const formData = new FormData();

  formData.append("imageFile", postData.imageFile);
  formData.append("description", postData.description);
  formData.append("satisfaction", postData.satisfaction);
  formData.append("position", JSON.stringify(postData.position));

  if (postData.areaName) {
    formData.append("areaName", postData.areaName);
  }

  if (postData.osmId) {
    formData.append("osmId", String(postData.osmId));
  }

  if (postData.tags && postData.tags.length > 0) {
    formData.append("tags", JSON.stringify(postData.tags));
  }

  const { data } = await apiClient.post("/posts", formData);
  return data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
};
