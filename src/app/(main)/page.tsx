"use client";
import { MapLoader } from "@/components/features/map/MapLoader";
import PostModal from "@/components/features/post/PostModal";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useStore } from "@/store/useStore";
import { User } from "@/types";

const currentUser: User = {
  id: "currentUser123",
  username: "Nahid",
  imgUrl: "/user-photo.jpg",
};

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { location, fetchUserLocation, theme } = useStore();

  const handleToggleModal = () => setIsModalOpen((prev) => !prev);

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

      <div className="fixed bottom-4 left-4 z-[1000]">
        <motion.div
          className="relative w-16 h-16 rounded-full p-[3px] bg-[conic-gradient(from_180deg_at_50%_50%,#F4B400_0deg,#9B59B6_120deg,#4285F4_240deg,#F4B400_360deg)]"
          animate={{ rotate: 90 }}
          transition={{
            duration: 46,
            ease: "linear",
            repeat: Infinity,
          }}
          suppressHydrationWarning={true}
        >
          <motion.button
            onClick={handleToggleModal}
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

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={currentUser}
      />

      <MapView
        center={location.coords}
        user={currentUser}
        onMarkerClick={handleToggleModal}
      />
    </main>
  );
}
