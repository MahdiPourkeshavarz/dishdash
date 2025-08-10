"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { Navigation } from "lucide-react";

interface DirectionsPillProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  destination: [number, number];
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
  isOpen,
  setIsOpen,
  destination,
}) => {
  const { location: userLocation, theme } = useStore();

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
      name: "Google Maps",
      logo: "/logos/google.png",
      url: "https://www.google.com/maps/dir/?api=1&origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
    {
      name: "Neshan",
      logo: "/logos/neshan.jpg",
      url: "https://nshn.ir/maps/routing?origin={origin_lat},{origin_lng}&destination={dest_lat},{dest_lng}",
    },
    {
      name: "Waze",
      logo: "/logos/waze.png",
      url: "https://waze.com/ul?ll={dest_lat},{dest_lng}&navigate=yes",
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
            className="flex items-center justify-center gap-3 mr-1"
          >
            {mapProviders.map((provider, index) => (
              <motion.button
                key={provider.name}
                custom={index}
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.1,
                }}
                onClick={() => handleNavigation(provider.url)}
                className=""
                whileHover={{ scale: 1.1 }}
                aria-label={`Maps with ${provider.name}`}
              >
                <Image
                  src={provider.logo}
                  alt={provider.name}
                  width={35}
                  height={35}
                  className="shadow-md rounded-md"
                />
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.button
            key="pill-closed"
            onClick={() => setIsOpen(true)}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "text-gray-400 hover:text-blue-400"
                : "text-gray-500 hover:text-blue-600"
            }`}
            aria-label="Open navigation options"
          >
            <Navigation size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
