/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "@/lib/axiosClient";
import { useStore } from "@/store/useStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const fetchPosts = async (bbox: any) => {
  const { data } = await apiClient.get("posts", { params: bbox });
  return data;
};

export const usePosts = (bbox: any) => {
  const { setPosts } = useStore();
  const queryResult = useQuery({
    queryKey: ["posts", bbox],
    queryFn: () => fetchPosts(bbox),
    enabled: !!bbox,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      setPosts(queryResult.data);
    }
  }, [queryResult.data, queryResult.isSuccess, setPosts]);

  return queryResult;
};
