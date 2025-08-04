import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import { useStore } from "@/store/useStore";
import { useCreatePost } from "./useCreatePost";
import imageCompression from "browser-image-compression";
import { Post } from "@/types";
import { useClassifyImage } from "./useClassifyImage";
import { useUpdatePost } from "./useUpdatePost";

type Satisfaction = "awesome" | "good" | "bad" | "disgusted" | "";

interface UsePostFormProps {
  postToEdit: Post | null;
  onSuccess: () => void;
}

export const usePostForm = ({ postToEdit, onSuccess }: UsePostFormProps) => {
  const {
    user,
    location: userLocation,
    postTargetLocation,
    setUploadStatus,
  } = useStore();

  const [view, setView] = useState<"initial" | "expanded">("initial");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");

  const classifyMutation = useClassifyImage();
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  useEffect(() => {
    if (postToEdit) {
      setDescription(postToEdit.description);
      setSatisfaction(postToEdit.satisfaction as Satisfaction);
      setImagePreview(postToEdit.imageUrl);
      setView("expanded");
    }
  }, [postToEdit]);

  const resetForm = () => {
    setTimeout(() => setView("initial"), 300);
    setImageFile(null);
    setImagePreview(null);
    setDescription("");
    setSatisfaction("");
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/jpeg",
    });
    setImageFile(compressedFile);
    setImagePreview(URL.createObjectURL(compressedFile));
    setView("expanded");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (postToEdit) {
      if (!user) {
        setError("لطفا وارد حساب کاربری خود شوید");
        return;
      }
      updatePostMutation.mutate(
        {
          postId: postToEdit._id as string,
          updateData: { description, satisfaction },
        },
        {
          onSuccess: () => onSuccess(),
          onError: (error) => {
            console.error("Update failed:", error);
            setError("لطفا دوباره عکس را بارگذاری نمایید");
          },
        }
      );
      return;
    }

    const userGpsLocation = userLocation.coords
      ? [userLocation.coords[1], userLocation.coords[0]]
      : null;
    const positionToUse = postTargetLocation?.coords
      ? [postTargetLocation.coords[0], postTargetLocation.coords[1]]
      : userGpsLocation;

    if (
      !user ||
      !positionToUse ||
      !imageFile ||
      !description ||
      !satisfaction
    ) {
      setError("لطفا اطلاعات پست را تکمیل نمایید");
      return;
    }

    onSuccess();

    setUploadStatus("classifying");

    classifyMutation.mutate(imageFile, {
      onSuccess: (classificationData) => {
        const extractedLabels = classificationData.map(
          (item: { label: string }) => item.label
        );

        setUploadStatus("uploading");
        createPostMutation.mutate(
          {
            imageFile,
            description,
            satisfaction,
            position: positionToUse as [number, number],
            areaName: postTargetLocation?.name || userLocation.areaName || "",
            osmId: postTargetLocation?.osmId,
            tags: extractedLabels,
          },
          {
            onSuccess: () => setUploadStatus("success"),
            onError: () => setUploadStatus("error"),
          }
        );
      },
      onError: (error) => {
        console.error("Image classification failed:", error);
        setUploadStatus("uploading");
        createPostMutation.mutate(
          {
            imageFile,
            description,
            satisfaction,
            position: positionToUse as [number, number],
            areaName: postTargetLocation?.name || userLocation.areaName || "",
            osmId: postTargetLocation?.osmId,
            tags: [],
          },
          {
            onSuccess: () => setUploadStatus("success"),
            onError: () => setUploadStatus("error"),
          }
        );
      },
    });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    view,
    error,
    imagePreview,
    description,
    satisfaction,
    isSubmitting: createPostMutation.isPending || updatePostMutation.isPending,
    fileInputRef,
    setView,
    setDescription,
    setSatisfaction,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
};
