"use client";

import { useState, useRef } from "react";
import { useStore } from "@/store/useStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Layers } from "lucide-react";
import { useMapStyle } from "@/store/useMapStyle";

export function MapStyleSwitcher() {
  const { theme, setTheme } = useStore();
  const mapStyles = useMapStyle();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useClickOutside(switcherRef, () => setIsOpen(false));

  const styles = [
    { name: "light", style: mapStyles.light },
    { name: "dark", style: mapStyles.dark },
  ];

  const previewVariants: Variants = {
    hidden: {
      x: 0,
      scale: 0.5,
      opacity: 0,
    },
    visible: (index: number) => ({
      x: -(index * 60 + 60),
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: index * 0.05,
      },
    }),
    exit: {
      x: 0,
      scale: 0.5,
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      ref={switcherRef}
      className="absolute top-1/3 -translate-y-1/2 right-4 z-[1001]"
    >
      <div className="relative flex items-center">
        <AnimatePresence>
          {isOpen &&
            styles.map((style, index) => (
              <motion.div
                key={style.name}
                variants={previewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                className="absolute"
              >
                <button
                  onClick={() => {
                    setTheme(style.name as "light" | "dark");
                    setIsOpen(false);
                  }}
                  className={`relative w-14 h-14 rounded-lg border-2 overflow-hidden transition-all shadow-lg ${
                    theme === style.name
                      ? "border-blue-500"
                      : "border-transparent hover:border-gray-500"
                  }`}
                >
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${style.style.url
                        .replace("{s}", "a")
                        .replace("{z}", "10")
                        .replace("{x}", "525")
                        .replace("{y}", "400")})`,
                    }}
                  />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 p-3 rounded-full shadow-lg transition-colors ${
            theme === "dark"
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-black hover:bg-gray-100"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Layers size={24} />
        </motion.button>
      </div>
    </div>
  );
}
