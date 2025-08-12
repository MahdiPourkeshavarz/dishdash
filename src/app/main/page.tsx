"use client";
import { MapLoader } from "@/components/features/map/MapLoader";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";
import { AuthModal } from "@/components/features/auth/AuthModal";
import { DeleteConfirmationModal } from "@/components/features/post/DeleteConfirmationModal";
import { useSession } from "next-auth/react";
import { useIsMounted } from "@/hooks/useIsmounted";
import "leaflet/dist/leaflet.css";
import { SearchAction } from "@/components/features/search/SearchAction";

const currentUser: User = {
  id: "currentUser123",
  username: "Nahid",
  image: "/user-photo.jpg",
};

const PostModal = dynamic(
  () =>
    import("@/components/features/post/PostModal").then((mod) => mod.PostModal),
  { ssr: false }
);

export default function HomePage() {
  const {
    location,
    fetchUserLocation,
    theme,
    isPostModalOpen,
    togglePostModal,
    editingPost,
    setEditingPost,
    isAuthModalOpen,
    toggleAuthModal,
    isProfileModalOpen,
  } = useStore();

  const { data: session } = useSession();

  const isMounted = useIsMounted();

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
    <main className="w-screen h-[100dvh] relative overflow-hidden">
      <Navbar onLoginClick={() => toggleAuthModal(true)} />

      {isMounted && !isProfileModalOpen && (
        <>
          <SearchAction />
        </>
      )}

      {isMounted && session?.user && (
        <div className="absolute bottom-7 right-4 z-[1000]">
          <motion.div
            className="relative w-16 h-16 rounded-full p-[2px] bg-[conic-gradient(from_180deg_at_50%_50%,#F4B400_0deg,#9B59B6_120deg,#4285F4_240deg,#F4B400_360deg)]"
            suppressHydrationWarning={true}
          >
            <motion.button
              onClick={() => togglePostModal(true)}
              className={`
                      relative flex items-center justify-center w-full h-full rounded-full shadow-lg
                      transition-colors duration-200
                      ${
                        theme === "dark"
                          ? "bg-gray-900 text-white hover:bg-gray-700"
                          : "bg-white text-blue-600 hover:bg-gray-200"
                      }
                    `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Create new post"
              suppressHydrationWarning={true}
            >
              <Plus className="w-7 h-7" />
            </motion.button>
          </motion.div>
        </div>
      )}

      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => {
          togglePostModal(false);
          setEditingPost(null);
        }}
        postToEdit={editingPost}
      />

      <MapView
        center={location.coords}
        user={currentUser}
        onMarkerClick={() => togglePostModal(true)}
      />

      <DeleteConfirmationModal />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => toggleAuthModal(false)}
      />
    </main>
  );
}
