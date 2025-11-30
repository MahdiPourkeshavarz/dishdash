"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useCallback } from "react";

export function FoodTruckToggleButton() {
  const { theme, foodTruckMode, setPoiMode } = useStore();

  const handleToggle = useCallback(() => {
    setPoiMode("foodTruck", !foodTruckMode);
  }, [foodTruckMode, setPoiMode]);

  const iconSrc =
    theme === "dark" ? "/food-truck-icon.png" : "/food-truck-icon-dark.png";

  return (
    <div className="absolute top-8/12 right-6 z-[1001]">
      <motion.button
        onClick={handleToggle}
        whileTap={{ scale: 0.9 }}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors duration-300
          ${theme === "dark" ? "bg-gray-800/80" : "bg-white/80"}
        `}
      >
        {foodTruckMode && (
          <motion.div
            className="absolute inset-0 rounded-full border border-blue-500"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}

        <Image
          src={iconSrc}
          width={28}
          height={28}
          alt="Food Truck"
          className="pointer-events-none"
        />
      </motion.button>
    </div>
  );
}
