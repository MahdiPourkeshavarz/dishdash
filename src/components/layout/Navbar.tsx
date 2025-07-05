"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, X } from "lucide-react";
import { motion } from "framer-motion";
import { useSession, signIn, signOut } from "next-auth/react";

export function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

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
      className="fixed top-0 left-0 right-0 z-[1500] backdrop-blur-md"
      dir="rtl"
    >
      <div className="mx-auto flex h-14 items-center justify-between px-3 sm:px-4 max-w-screen-2xl">
        <div className="flex items-center gap-3 sm:gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/20 p-1 pr-2 sm:pr-3 shadow-md hover:bg-white/30 transition-all"
              >
                <Image
                  src={user?.image || "/default-user.jpg"}
                  alt={user?.name || "User"}
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-blue-200"
                  width={40}
                  height={40}
                />
                <span className="text-xs sm:text-sm font-medium text-blue-500 max-w-[100px] sm:max-w-[150px] truncate pl-4">
                  {user?.name}
                </span>
              </motion.button>

              {isProfileOpen && (
                <motion.div
                  ref={profileCardRef}
                  className="absolute top-12 right-0 z-50 w-[80vw] max-w-[280px] rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 p-3 sm:p-4"
                >
                  <button
                    onClick={() => setIsProfileOpen(false)}
                    className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <div className="flex flex-col items-center gap-2 pt-6 sm:pt-0">
                    <Image
                      src={user?.image || "/default-user.jpg"}
                      alt={user?.name || "User"}
                      className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover border-2 border-blue-200"
                      width={64}
                      height={64}
                    />
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate w-full text-center">
                      {user?.name}
                    </p>
                    <button
                      className="mt-2 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-1 text-xs sm:text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
                      onClick={() => signOut()}
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
              // ... animation props
              className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-500 transition-all"
              onClick={() => signIn()}
            >
              ورود
            </motion.button>
          )}
        </div>
        <Link
          href="/"
          className="flex items-center gap-1 text-lg sm:text-xl font-bold text-blue-600"
        >
          DISHDASH
          <Image src={"/Logo.png"} alt="logo" width={76} height={76} />
        </Link>
      </div>
    </header>
  );
}
