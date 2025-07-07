"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { ProfileModal } from "../features/user/ProfileModal";
import { useEffect, useState } from "react";

interface NavbarProps {
  onLoginClick: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  const { theme, toggleProfileModal, isProfileModalOpen } = useStore();

  const [isNameVisible, setIsNameVisible] = useState(false);

  const handleProfileClick = () => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;

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

  return (
    <header className="fixed top-0 left-0 right-0 z-[1500]" dir="rtl">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative group pt-1">
              <motion.button
                onClick={handleProfileClick}
                whileTap={{ scale: 0.95 }}
                className="flex items-center rounded-full bg-white/10 p-1 transition-all pl-2"
              >
                <Image
                  src={user?.image || "/user-photo.jpg"}
                  alt={user?.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-gray-400 group-hover:border-blue-400 transition-colors"
                />

                <div className="hidden md:block overflow-hidden transition-all duration-300 ease-in-out max-w-0 group-hover:max-w-[150px]">
                  <span className="text-sm font-medium text-blue-500 whitespace-nowrap pr-2">
                    {user?.name || "مهدی کشاورز"}
                  </span>
                </div>

                <div className="md:hidden overflow-hidden">
                  <AnimatePresence>
                    {isNameVisible && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <span className="text-sm font-semibold text-blue-500 whitespace-nowrap pr-2">
                          {user?.name || "مهدی کشاورز"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
              <ProfileModal />
            </div>
          ) : (
            <div className="relative group">
              <motion.div className="rounded-full p-[1px] shadow-lg">
                <motion.button
                  onClick={onLoginClick}
                  className={`
                    flex items-center gap-2.5 w-full justify-center
                    px-5 py-2.5 text-sm font-bold rounded-full
                    transition-colors duration-300
                    ${
                      theme === "dark"
                        ? "bg-gray-800/70 text-white hover:bg-gray-800"
                        : "bg-white/70 text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  suppressHydrationWarning={true}
                >
                  <LogIn size={18} />
                  <span>ورود</span>
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
        <Link
          href="/"
          className="flex items-center text-2xl sm:text-2xl font-bold text-blue-600"
        >
          <span style={{ fontFamily: "var(--font-nabla)" }}>DISH DASH</span>
          <Image
            src={"/Logo.png"}
            alt="logo"
            width={76}
            height={76}
            className={`transition-all duration-300
                      ${
              theme === "dark"
                ? "[filter:drop-shadow(0_2px_3px_rgba(255,255,255,0.15))]"
                : "[filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.25))]"
            }`}
            suppressHydrationWarning={true}
          />
        </Link>
      </div>
    </header>
  );
}
