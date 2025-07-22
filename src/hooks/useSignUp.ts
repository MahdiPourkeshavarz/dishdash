"use client";

import { SignUpData } from "@/lib/authValidation";
import apiClient from "@/lib/axiosClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

const signUpUser = async (data: SignUpData) => {
  const response = await apiClient.post("auth/register", data);
  if (response.status !== 201) {
    throw new Error("ثبت نام موفق نبود");
  }
  return data;
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signUpUser,
    onSuccess: async (data) => {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Registration succeeded, but auto-login failed.");
      }

      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
};
