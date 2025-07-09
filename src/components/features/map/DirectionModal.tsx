"use client";

import { Post } from "@/types";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

interface DirectionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({
  isOpen,
  onClose,
  post,
}) => {
  const { location: userLocation, theme } = useStore();

  const handleNavigation = (urlPattern: string) => {
    if (!userLocation.coords) {
      alert("Your location has not been found yet.");
      return;
    }

    const url = urlPattern
      .replace("{dest_lat}", post.position[0].toString())
      .replace("{dest_lng}", post.position[1].toString())
      .replace("{origin_lat}", userLocation.coords[0].toString())
      .replace("{origin_lng}", userLocation.coords[1].toString());

    window.open(url, "_blank");
    onClose();
  };

  const mapProviders = [
    {
      name: "Google Maps",
      logo: "/logos/google.png",
      url: "https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
    {
      name: "Waze",
      logo: "/logos/waze.png",
      url: "https://waze.com/ul?ll={dest_lat},{dest_lng}&navigate=yes",
    },
    {
      name: "Neshan",
      logo: "/logos/neshan.jpg",
      url: "https://nshn.ir/maps/routing?origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
    {
      name: "Balad",
      logo: "/logos/balad.png",
      url: "https://balad.ir/d-rout/?to={dest_lat},{dest_lng}",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-sm rounded-t-2xl p-6 ${
              theme === "dark" ? "bg-gray-800" : "bg-gray-100"
            }`}
            dir="rtl"
          >
            <button
              onClick={onClose}
              className={`absolute top-4 left-4 p-1 rounded-full transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
              }`}
              aria-label="Close"
            >
              <X
                className={theme === "dark" ? "text-gray-400" : "text-gray-600"}
                size={20}
              />
            </button>

            <h3
              className={`text-lg font-bold text-center mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              انتخاب برنامه مسیریاب
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {mapProviders.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleNavigation(provider.url)}
                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-colors ${
                    theme === "dark"
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-white hover:bg-gray-200"
                  }`}
                >
                  <Image
                    src={provider.logo}
                    alt={`${provider.name} logo`}
                    width={48}
                    height={48}
                  />
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-black"
                    }`}
                  >
                    {provider.name}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
