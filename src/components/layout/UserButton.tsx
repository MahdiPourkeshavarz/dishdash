"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { ProfileModal } from "../features/user/ProfileModal";

export function UserButton() {
  const { data: session } = useSession();
  const { isProfileModalOpen, toggleProfileModal } = useStore();
  const [isNameVisible, setIsNameVisible] = useState(false);
  const user = session?.user;

  const handleInteraction = () => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      if (isNameVisible || isProfileModalOpen) {
        toggleProfileModal();
        setIsNameVisible(false);
      } else {
        setIsNameVisible(true);
      }
    } else {
      toggleProfileModal();
    }
  };

  useEffect(() => {
    if (!isProfileModalOpen) {
      setIsNameVisible(false);
    }
  }, [isProfileModalOpen]);

  if (!user) return null;

  return (
    <div className="relative group pt-1">
      <motion.button
        onClick={handleInteraction}
        onHoverStart={() => {
          const isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;
          if (!isTouchDevice) setIsNameVisible(true);
        }}
        onHoverEnd={() => {
          const isTouchDevice =
            "ontouchstart" in window || navigator.maxTouchPoints > 0;
          if (!isTouchDevice) setIsNameVisible(false);
        }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center rounded-full bg-white/10 p-1 transition-all pl-2"
      >
        <Image
          src={user.image || "/user-photo.jpg"}
          alt={user.name || "User"}
          width={40}
          height={40}
          className="rounded-full object-cover border-2 border-gray-400 group-hover:border-blue-400 transition-colors"
        />
        <div className="overflow-hidden">
          <AnimatePresence>
            {isNameVisible && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{
                  width: "auto",
                  opacity: 1,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                exit={{ width: 0, opacity: 0, transition: { duration: 0.2 } }}
              >
                <span className="text-sm font-semibold text-blue-500 whitespace-nowrap pr-2">
                  {user.name || "مهدی کشاورز"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.button>
      <ProfileModal />
    </div>
  );
}
