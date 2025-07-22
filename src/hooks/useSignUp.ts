"use client";

import { SignUpData } from "@/lib/authValidation";
import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const signUpUser = async (data: SignUpData) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: signUpUser,
  });
};
