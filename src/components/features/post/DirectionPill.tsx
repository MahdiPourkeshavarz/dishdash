"use client";

import { Post } from "@/types";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Navigation } from "lucide-react";

interface DirectionsPillProps {
  post: Post;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const pillVariants: Variants = {
  hidden: {
    width: 44,
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.05,
      staggerDirection: -1,
      delayChildren: 0.1,
    },
  },
  visible: {
    width: "auto",
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const iconVariants: Variants = {
  hidden: { y: 10, opacity: 0, transition: { duration: 0.2, ease: "easeOut" } },
  visible: { y: 0, opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
};

export const DirectionsPill: React.FC<DirectionsPillProps> = ({
  post,
  isOpen,
  setIsOpen,
}) => {
  const { location: userLocation, theme } = useStore();

  const handleNavigation = (urlPattern: string) => {
    if (!userLocation.coords) {
      alert("مکان شما هنوز یافت نشده است.");
      return;
    }
    const url = urlPattern
      .replace("{dest_lat}", post.position[0].toString())
      .replace("{dest_lng}", post.position[1].toString())
      .replace("{origin_lat}", userLocation.coords[0].toString())
      .replace("{origin_lng}", userLocation.coords[1].toString());
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const mapProviders = [
    {
      name: "Google Maps",
      logo: "/logos/google.png",
      url: "https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
    {
      name: "Neshan",
      logo: "/logos/neshan.jpg",
      url: "https://nshn.ir/maps/routing?origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
  ];

  return (
    <div className="relative flex items-center justify-center h-10">
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="pill-open"
            variants={pillVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`flex items-center gap-2`}
          >
            {mapProviders.map((provider) => (
              <motion.button
                key={provider.name}
                variants={iconVariants}
                onClick={() => handleNavigation(provider.url)}
                className={`p-1 rounded-full transition-colors`}
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={30}
                  height={30}
                  className={`${provider.name === "Neshan" && "rounded-sm"}`}
                />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.button
            key="pill-closed"
            onClick={() => setIsOpen(true)}
            exit={{
              scale: 0.9,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            <Navigation size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
