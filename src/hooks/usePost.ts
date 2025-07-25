/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

const fetchPosts = async (bbox: any) => {
  const { data } = await apiClient.get("posts", { params: bbox });
  return data;
};

export const usePosts = (bbox: any) => {
  return useQuery({
    queryKey: ["posts", bbox],
    queryFn: () => fetchPosts(bbox),
    enabled: !!bbox,
    staleTime: 1000 * 60,
  });
};
