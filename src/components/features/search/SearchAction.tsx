"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { SearchBar } from "../search/SearchBar";
import { ChatModal } from "./chat/ChatModal";

export const SearchAction = () => {
  const { theme, isProfileModalOpen, isSearching, setIsSearching } = useStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useClickOutside(searchRef, () => {
    if (isSearchOpen && !isSearching) {
      setIsSearchOpen(false);
      setIsSearching(false);
    }
  });

  if (isProfileModalOpen) {
    return null;
  }

  return (
    <>
      <div
        ref={searchRef}
        className="absolute top-16 left-1/2 -translate-x-1/2 z-[200000] flex flex-col items-center"
      >
        <div className="flex items-center gap-2">
          {!isSearchOpen && (
            <motion.button
              onClick={() => setIsSearchOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-colors backdrop-blur-md ${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              }`}
              aria-label="Toggle search bar"
              whileTap={{ scale: 0.95 }}
            >
              <span>جستجو</span>
              <SearchIcon size={20} />
            </motion.button>
          )}

          {!isSearchOpen && (
            <motion.button
              onClick={() => setIsChatOpen(true)}
              className={`p-2 rounded-full shadow-lg transition-colors backdrop-blur-md ${
                theme === "dark"
                  ? "bg-gray-800/50 text-white"
                  : "bg-white/50 text-gray-900"
              }`}
              aria-label="Open AI Assistant"
              whileTap={{ scale: 0.95 }}
            >
              <Image src="/chat.png" alt="AI Chat" width={24} height={24} />
            </motion.button>
          )}
        </div>

        <AnimatePresence>{isSearchOpen && <SearchBar />}</AnimatePresence>
      </div>

      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
};
