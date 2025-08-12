import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const postChatQuery = async (query: string) => {
  const { data } = await apiClient.post("search/chat", { query });
  return data;
};

export const useChat = () => {
  return useMutation({
    mutationFn: postChatQuery,
  });
};
