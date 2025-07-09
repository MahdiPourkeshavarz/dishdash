"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { LocateFixed } from "lucide-react";

export function FindLocationButton() {
  const { theme, fetchUserLocation } = useStore();
  const [status, setStatus] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  const handleClick = async () => {
    if (status === "loading") return;
    setStatus("loading");

    const timeoutId = setTimeout(() => {
      setStatus("error");
    }, 4000);

    const success = await fetchUserLocation();
    clearTimeout(timeoutId);

    if (success) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (status === "error") {
      const timer = setTimeout(() => {
        setStatus("idle");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const buttonBg =
    status === "error"
      ? "bg-red-500/90"
      : status === "success"
      ? "bg-green-500/90"
      : theme === "dark"
      ? "bg-gray-800/80"
      : "bg-white/80";

  const iconColor =
    status === "error" || status === "success"
      ? "text-white"
      : theme === "dark"
      ? "text-white"
      : "text-black";

  return (
    <div className="absolute top-4/7 right-4 z-[1001] flex items-center gap-2">
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, x: 0, scale: 0.5 }}
            animate={{ opacity: 1, x: -85, scale: 1 }}
            exit={{ opacity: 0, x: 0, scale: 0.5, zIndex: -1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="absolute right-0 whitespace-nowrap"
          >
            <div className="px-3 py-1.5 rounded-lg bg-red-800/90 text-white text-xs font-semibold shadow-lg">
              مکان یافت نشد
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        className={`relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-colors duration-300 ${buttonBg}`}
        whileTap={{ scale: 0.9 }}
        disabled={status === "loading"}
      >
        {status === "loading" && (
          <motion.div
            className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        <LocateFixed size={24} className={iconColor} />
      </motion.button>
    </div>
  );
}
