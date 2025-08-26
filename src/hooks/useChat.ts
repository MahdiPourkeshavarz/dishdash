import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const postChatQuery = async (query: string) => {
  const thread_id = "varagh";
  const { data } = await apiClient.post("search/chat", { query, thread_id });
  return data;
};

export const useChat = () => {
  return useMutation({
    mutationFn: postChatQuery,
  });
};
