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
  const { user, location: userLocation, postTargetLocation } = useStore();

  const [view, setView] = useState<"initial" | "expanded">("initial");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("");
  const [tags, setTags] = useState<string[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setTags([]);
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

    setIsClassifying(true);
    classifyMutation.mutate(compressedFile, {
      onSuccess: (data) => {
        const extractedLabels = data.map(
          (item: { label: string }) => item.label
        );
        setTags(extractedLabels);
        setIsClassifying(false);
      },
      onError: (error) => {
        console.error("Image classification failed:", error);
        setIsClassifying(false);
      },
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (postToEdit) {
      if (!user) {
        alert("You must be logged in to edit a post.");
        return;
      }

      try {
        await updatePostMutation.mutateAsync({
          postId: postToEdit._id as string,
          updateData: {
            description,
            satisfaction,
          },
        });
        onSuccess();
      } catch (error) {
        console.error("Update failed:", error);
        alert("Failed to update post. Please try again.");
      }
    } else {
      const convertedUserLocationToSend = userLocation.coords
        ? [userLocation.coords[1], userLocation.coords[0]]
        : null;

      const positionToUse =
        postTargetLocation?.coords || convertedUserLocationToSend;

      if (
        !user ||
        !positionToUse ||
        !imageFile ||
        !description ||
        !satisfaction
      ) {
        alert("Please complete all fields to create a post.");
        return;
      }

      try {
        await createPostMutation.mutateAsync({
          imageFile,
          description,
          satisfaction,
          position:
            (postTargetLocation?.coords as [number, number]) ||
            convertedUserLocationToSend,
          areaName: postTargetLocation?.name || "",
          osmId: postTargetLocation?.osmId,
          tags,
        });
        onSuccess();
      } catch (error) {
        console.error("Create failed:", error);
        alert("Failed to create post. Please try again.");
      }
    }
  };

  return {
    view,
    imagePreview,
    description,
    satisfaction,
    tags,
    isClassifying,
    isSubmitting: createPostMutation.isPending,
    fileInputRef,
    setView,
    setDescription,
    setSatisfaction,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
};
