"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { User } from "@/types";

const mockUser: User | null = {
  id: "varagh",
  username: "محمد محمدی",
  imgUrl: "/user-photo.jpg",
};

const profileCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3,
    },
  },
};

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = !!mockUser; // Replace with your auth check
  const profileCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileCardRef.current &&
        !profileCardRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-[1500] backdrop-blur-md "
      dir="rtl"
    >
      <div className="mx-auto flex h-14 items-center justify-between px-3 sm:px-4 max-w-screen-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/20 p-1 pr-2 sm:pr-3 shadow-md hover:bg-white/30 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="نمایش پروفایل کاربر"
              >
                <Image
                  src={mockUser!.imgUrl || "/default-user.jpg"}
                  alt={mockUser!.username}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-blue-200"
                  width={40}
                  height={40}
                />
                <span className="text-xs sm:text-sm font-medium text-blue-500 max-w-[100px] sm:max-w-[150px] truncate pl-4">
                  {mockUser!.username}
                </span>
              </motion.button>

              {isProfileOpen && (
                <motion.div
                  variants={profileCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  ref={profileCardRef}
                  className="absolute top-12 right-0 z-50 w-[80vw] max-w-[280px] rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 p-3 sm:p-4"
                >
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
                    aria-label="بستن پروفایل"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="flex flex-col items-center gap-2 pt-6 sm:pt-0">
                    <Image
                      src={mockUser!.imgUrl || "/default-user.jpg"}
                      alt={mockUser!.username}
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-blue-200"
                      width={64}
                      height={64}
                    />
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate w-full text-center">
                      {mockUser!.username}
                    </p>
                    <button
                      className="mt-2 flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-1 text-xs sm:text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
                      onClick={() => {
                        // Replace with your logout logic
                        console.log("Logout clicked");
                        setIsProfileOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      خروج
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-500 transition-all"
            >
              ورود
            </motion.button>
          )}
        </div>
        <Link
          href="/"
          className="flex items-center gap-1.5 text-lg sm:text-xl font-bold text-blue-600"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Image
              src="/Logo.png"
              width={36}
              height={36}
              alt="DishDash Logo"
              priority
              className="sm:w-12 sm:h-12"
            />
          </motion.div>
          <motion.span
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          >
            DishDash
          </motion.span>
        </Link>
      </div>
    </header>
  );
}
