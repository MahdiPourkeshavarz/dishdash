"use client";
import { MapLoader } from "@/components/features/map/MapLoader";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SearchIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";
import { AuthModal } from "@/components/features/auth/AuthModal";
import { DeleteConfirmationModal } from "@/components/features/post/DeleteConfirmationModal";
import { useSession } from "next-auth/react";
import { useIsMounted } from "@/hooks/useIsmounted";
import { SearchBar } from "@/components/features/search/SearchBar";
import { useClickOutside } from "@/hooks/useClickOutside";
import "leaflet/dist/leaflet.css";

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
    setIsSearching,
    isSearching,
    isProfileModalOpen,
  } = useStore();

  const { data: session } = useSession();

  const isMounted = useIsMounted();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => {
    if (isSearchOpen && !isSearching) {
      setIsSearchOpen(false);
      setIsSearching(false);
    }
  });

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
        <div
          ref={searchRef}
          className="absolute top-16 left-1/2 -translate-x-1/2 z-[200000] flex flex-col items-center"
        >
          {!isSearchOpen && (
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors backdrop-blur-md ${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              }`}
              aria-label="Toggle search bar"
              whileTap={{ scale: 0.95 }}
            >
              <span>جستجو</span>
              <SearchIcon size={20} />
            </motion.button>
          )}

          <AnimatePresence>{isSearchOpen && <SearchBar />}</AnimatePresence>
        </div>
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
