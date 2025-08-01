import apiClient from "@/lib/axiosClient";
import { useMutation } from "@tanstack/react-query";

const classifyImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post("uploads/classify", formData);
  return data;
};

export const useClassifyImage = () => {
  return useMutation({
    mutationFn: classifyImage,
  });
};
