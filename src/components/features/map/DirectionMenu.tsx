"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useClickOutside } from "@/hooks/useClickOutside";

interface DirectionsMenuProps {
  destination: [number, number];
}

export const DirectionsMenu: React.FC<DirectionsMenuProps> = ({
  destination,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { location: userLocation, theme } = useStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  const handleNavigation = (urlPattern: string) => {
    if (!userLocation.coords) {
      alert("مکان شما هنوز یافت نشده است.");
      return;
    }
    const url = urlPattern
      .replace("{dest_lat}", destination[1].toString())
      .replace("{dest_lng}", destination[0].toString())
      .replace("{origin_lat}", userLocation.coords[0].toString())
      .replace("{origin_lng}", userLocation.coords[1].toString());
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const mapProviders = [
    {
      name: "گوگل مپ",
      logo: "/logos/google.png",
      url: "https://maps.google.com/maps?saddr={origin_lat},{origin_lng}&daddr={dest_lat},{dest_lng}",
    },
    {
      name: "ویز",
      logo: "/logos/waze.png",
      url: "https://waze.com/ul?ll={dest_lat},{dest_lng}&navigate=yes",
    },
    {
      name: "نشان",
      logo: "/logos/neshan.jpg",
      url: "https://nshn.ir/maps/routing?origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
  ];

  return (
    <div ref={menuRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={`absolute bottom-full mb-2 w-28 rounded-xl border shadow-lg overflow-hidden backdrop-blur-xl z-50 ${
              theme === "dark"
                ? "bg-gray-800/80 border-white/10"
                : "bg-white/80 border-black/10"
            }`}
          >
            {mapProviders.map((provider) => (
              <button
                key={provider.name}
                onClick={() => handleNavigation(provider.url)}
                className="flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-100/70 dark:hover:bg-gray-700/60 w-full transition-colors"
                dir="rtl"
              >
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {provider.name}
                </span>
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={22}
                  height={22}
                  className="rounded"
                />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 p-2 text-sm mt-3 ${
          theme === "dark"
            ? "border-white/10 text-white hover:bg-gray-700/50"
            : "border-black/10 text-black hover:bg-gray-100"
        }`}
        whileTap={{ scale: 0.9 }}
      >
        <Navigation size={20} />
      </motion.button>
    </div>
  );
};
