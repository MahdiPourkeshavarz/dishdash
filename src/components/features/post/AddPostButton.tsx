"use client";

import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { Poi } from "@/types";
import { Plus, LogIn } from "lucide-react";

interface AddPostButtonProps {
  poi: Poi;
  onAddPost: () => void;
}

export const AddPostButton: React.FC<AddPostButtonProps> = ({
  poi,
  onAddPost,
}) => {
  const { data: session } = useSession();
  const { setPostTargetLocation, toggleAuthModal } = useStore();

  const handleAddPost = () => {
    const coordsToSet = poi.position || [poi.lon, poi.lat];
    const osmId = poi.osmId || poi.id;

    setPostTargetLocation({
      name: poi.tags?.name as string,
      coords: coordsToSet,
      osmId: osmId,
    });
    onAddPost();
  };

  if (session) {
    return (
      <button
        onClick={handleAddPost}
        className="w-full mt-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        aria-label="Add post for this location"
      >
        <Plus size={20} />
        افزودن پست برای این مکان
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleAuthModal(true)}
      className="w-full mt-4 p-3 bg-gradient-to-r from-gray-600 to-gray-800 text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      aria-label="Log in to add a post"
    >
      <LogIn size={20} />
      برای افزودن پست وارد شوید
    </button>
  );
};
