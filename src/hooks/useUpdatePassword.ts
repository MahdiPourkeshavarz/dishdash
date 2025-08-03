import apiClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const changePassword = (data: ChangePasswordData) => {
  return apiClient.patch("users/change-password", data);
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
