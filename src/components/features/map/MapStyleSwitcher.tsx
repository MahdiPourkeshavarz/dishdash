"use client";

import { useState, useRef } from "react";
import { useStore, MapStyleKey } from "@/store/useStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Layers } from "lucide-react";
import { cartoMapStyles } from "@/lib/mapStyles";

export function MapStyleSwitcher() {
  const { theme, setMapStyle } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useClickOutside(switcherRef, () => setIsOpen(false));

  const styles: { key: MapStyleKey; style: { url: string } }[] = [
    { key: "lightV1", style: cartoMapStyles.lightV1 },
    { key: "lightV2", style: cartoMapStyles.lightV2 },
    { key: "dark", style: cartoMapStyles.dark },
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
      className="absolute top-3/9 -translate-y-1/2 right-4 z-[1001]"
    >
      <div className="relative flex items-center">
        <AnimatePresence>
          {isOpen &&
            styles.map((style, index) => (
              <motion.div
                key={style.key}
                variants={previewVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                custom={index}
                className="absolute"
              >
                <button
                  onClick={() => {
                    setMapStyle(style.key);
                    setIsOpen(false);
                  }}
                  className={`relative w-14 h-14 rounded-lg border-2 overflow-hidden transition-all shadow-lg`}
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
          className={`relative z-10 p-[11px] rounded-full shadow-lg transition-colors ${
            theme === "dark"
              ? "bg-gray-800/80 text-white hover:bg-gray-700"
              : "bg-white/80 text-black hover:bg-gray-100"
          }`}
          whileTap={{ scale: 0.9 }}
        >
          <Layers size={21} />
        </motion.button>
      </div>
    </div>
  );
}
