"use client";

import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UpdateProfileData {
  username: string;
  imageFile?: File | null;
}

const updateProfile = async (data: UpdateProfileData) => {
  const formData = new FormData();

  if (data.username) {
    formData.append("username", data.username);
  }

  if (data.imageFile) {
    formData.append("imageFile", data.imageFile);
  }

  const response = await apiClient.patch("users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const useUpdateProfile = () => {
  const { update: updateSession } = useSession();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      await updateSession();
    },
  });
};
