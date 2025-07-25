import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import apiClient from "@/lib/axiosClient";

const fetchUser = async (userId: string): Promise<User> => {
  const { data } = await apiClient.get(`users/${userId}`);
  return data;
};

export const useUser = (userId: string | undefined | null) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};
