/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Map, Coffee, Pizza, UtensilsCrossed, Loader } from "lucide-react";
import { usePopulatedWishlist } from "@/hooks/usePopulatedWishlist";

export function WishPlacesModal({ isOpen }: { isOpen: boolean }) {
  const { theme, setFlyToTarget } = useStore();
  const [activeTab, setActiveTab] = useState("restaurant");

  const { data: wishlist = [], isLoading } = usePopulatedWishlist({
    enabled: isOpen,
  });

  const categories = [
    {
      name: "restaurant",
      label: "رستوران",
      icon: UtensilsCrossed,
      types: ["restaurant"],
    },
    {
      name: "fastfood",
      label: "فست فود",
      icon: Pizza,
      types: ["fast_food"],
    },
    {
      name: "cafe",
      label: "کافه",
      icon: Coffee,
      types: ["cafe"],
    },
  ];

  const filteredList = wishlist.filter(
    (p) =>
      p &&
      p.tags &&
      p.tags.amenity &&
      categories
        .find((c) => c.name === activeTab)
        ?.types.includes(p.tags.amenity!)
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`absolute bottom-20 right-8 z-[1001] w-[275px] rounded-xl shadow-lg border backdrop-blur-md ${
        theme === "dark"
          ? "bg-gray-800/80 border-gray-700 text-white"
          : "bg-white/80 border-gray-200 text-black"
      }`}
    >
      <div
        className={`flex border-b ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        {categories.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveTab(cat.name)}
            className={`flex-1 p-2 flex justify-center items-center gap-2 text-sm transition-colors ${
              activeTab === cat.name
                ? "text-blue-400"
                : theme === "dark"
                ? "text-gray-400 hover:bg-gray-700/50"
                : "text-gray-500 hover:bg-gray-200/50"
            }`}
          >
            <cat.icon size={16} />
          </button>
        ))}
      </div>
      <div className="p-2 max-h-48 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center p-4">
            <Loader className="animate-spin text-gray-500" />
          </div>
        ) : (
          <motion.ul
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-1"
          >
            {filteredList.length > 0 ? (
              filteredList.map((place) => (
                <li
                  key={place._id}
                  className="flex items-center justify-between text-xs p-1 rounded-md"
                >
                  <span className="truncate">{place.tags.name}</span>
                  <button
                    onClick={() => setFlyToTarget(place)}
                    className={`p-1 rounded ${
                      theme === "dark"
                        ? "hover:bg-gray-600"
                        : "hover:bg-gray-300"
                    }`}
                  >
                    <Map size={14} className="text-blue-400" />
                  </button>
                </li>
              ))
            ) : (
              <p className="text-xs text-center text-gray-500 p-4">
                لیست خالی است
              </p>
            )}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}
