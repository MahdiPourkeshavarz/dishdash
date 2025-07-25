import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

const changePassword = (data: ChangePasswordData) => {
  return apiClient.patch("users/change-password", data);
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};
