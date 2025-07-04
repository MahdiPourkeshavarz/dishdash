"use client";
import { MapLoader } from "@/components/features/map/MapLoader";
import PostModal from "@/components/features/post/PostModal";
import { Navbar } from "@/components/layout/Navbar";
import { posts } from "@/lib/posts";
import { Post, User } from "@/types";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStoreStore";

const currentUser: User = {
  id: "currentUser123",
  username: "Nahid",
  imgUrl: "/user-photo.jpg",
};

export default function HomePage() {
  const [mockPosts, setPosts] = useState<Post[]>(posts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { location, fetchUserLocation } = useStore();

  const handleToggleModal = () => setIsModalOpen((prev) => !prev);

  const handlePostSubmit = (newPostData: Omit<Post, "id">) => {
    const newPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
    };
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const MapView = useMemo(
    () =>
      dynamic(() => import("@/components/features/map/MapView"), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  return (
    <main className="w-screen h-screen relative">
      <Navbar />

      <motion.button
        onClick={handleToggleModal}
        className="fixed bottom-4 left-4 z-[1000] flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Create new post"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePostSubmit}
        user={currentUser}
        key={mockPosts.length}
      />

      <MapView
        center={location.coords}
        user={currentUser}
        onMarkerClick={handleToggleModal}
      />
    </main>
  );
}
