"use client";

import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LogIn,
  LogOut,
  X,
  Shield,
  User as UserIcon,
  Edit3,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useStore } from "@/store/useStore";
import { Input } from "../features/auth/Input"; // Assuming Input component path
import { useClickOutside } from "@/hooks/useClickOutside";

interface NavbarProps {
  onLoginClick: () => void;
}

const profileCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -10, originY: 0, originX: 1 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2 },
  },
};

export function Navbar({ onLoginClick }: NavbarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileCardRef = useRef<HTMLDivElement>(null);

  const { data: session, status, update } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user;

  const { theme } = useStore();

  // State for the new modal's functionality
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [username, setUsername] = useState(user?.name || "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Close profile modal if clicking outside of it
  useClickOutside(profileCardRef, () => setIsProfileOpen(false));

  useEffect(() => {
    // When the session data loads or changes, update the form's username
    if (user?.name) {
      setUsername(user.name);
    }
  }, [user?.name]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    // In a real app, you would upload the image file to a server first.
    // For now, we simulate by updating the session on the client side for instant feedback.
    await update({
      name: username,
      image: imagePreview || user?.image, // Use new preview or existing image
    });
    alert("پروفایل با موفقیت به‌روزرسانی شد!");
    setIsProfileOpen(false);
    setImagePreview(null); // Clear preview after submission
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1500]" dir="rtl">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative pt-8 pr-2">
              <motion.button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                whileTap={{ scale: 0.9 }}
              >
                <Image
                  src={user?.image || "/user-photo.jpg"}
                  alt={user?.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover border-2 border-gray-400 hover:border-blue-400 transition-all"
                />
                <span className="text-xs sm:text-sm font-medium text-blue-500 max-w-[100px] sm:max-w-[150px] truncate pl-4">
                  {user?.name || "مهدی کشاورز"}
                </span>
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    ref={profileCardRef}
                    variants={profileCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={`absolute top-14 right-0 z-50 w-[90vw] max-w-sm rounded-2xl shadow-2xl border ${
                      theme === "dark"
                        ? "bg-gray-800/80 border-gray-700"
                        : "bg-white/80 border-gray-200"
                    } backdrop-blur-md text-white`}
                  >
                    <nav
                      className={`flex border-b ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => setActiveTab("profile")}
                        className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm transition-colors ${
                          activeTab === "profile"
                            ? theme === "dark"
                              ? "bg-gray-700/50 text-white"
                              : "bg-gray-200/50 text-black"
                            : theme === "dark"
                            ? "text-gray-400 hover:bg-gray-700/50"
                            : "text-gray-500 hover:bg-gray-200/50"
                        }`}
                      >
                        <UserIcon size={16} /> پروفایل
                      </button>
                      <button
                        onClick={() => setActiveTab("security")}
                        className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm transition-colors ${
                          activeTab === "security"
                            ? theme === "dark"
                              ? "bg-gray-700/50 text-white"
                              : "bg-gray-200/50 text-black"
                            : theme === "dark"
                            ? "text-gray-400 hover:bg-gray-700/50"
                            : "text-gray-500 hover:bg-gray-200/50"
                        }`}
                      >
                        <Shield size={16} /> امنیت
                      </button>
                    </nav>

                    <div className="p-4">
                      <AnimatePresence mode="wait">
                        {activeTab === "profile" ? (
                          <motion.div
                            key="profile"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <form
                              onSubmit={handleProfileUpdate}
                              className="flex flex-col items-center gap-4"
                            >
                              <label className="relative cursor-pointer group">
                                <Image
                                  src={
                                    imagePreview ||
                                    user?.image ||
                                    "/user-photo.jpg"
                                  }
                                  alt="Profile"
                                  width={80}
                                  height={80}
                                  className="rounded-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Edit3 size={24} />
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(
                                    e: ChangeEvent<HTMLInputElement>
                                  ) => {
                                    const file = e.target.files?.[0];
                                    if (file)
                                      setImagePreview(
                                        URL.createObjectURL(file)
                                      );
                                  }}
                                />
                              </label>
                              <Input
                                label="نام کاربری"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                              />
                              <button
                                type="submit"
                                className="w-full mt-2 p-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors text-white"
                              >
                                ذخیره تغییرات
                              </button>
                            </form>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="security"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <form
                              className="flex flex-col items-center gap-4"
                              onSubmit={(e) => {
                                e.preventDefault();
                                alert("Password changed (simulated)!");
                              }}
                            >
                              <Input label="رمز عبور فعلی" type="password" />
                              <Input label="رمز عبور جدید" type="password" />
                              <button
                                type="submit"
                                className="w-full mt-2 p-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition-colors text-white"
                              >
                                تغییر رمز عبور
                              </button>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <div
                      className={`border-t p-2 ${
                        theme === "dark" ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <button
                        onClick={() => signOut()}
                        className="w-full flex items-center justify-center gap-2 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <LogOut size={16} /> خروج
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="relative group">
              <motion.div className="rounded-full p-[3px] bg-gradient-to-r from-purple-600/25 via-blue-500/25 to-orange-400/25 shadow-md">
                <motion.button
                  onClick={() => onLoginClick()}
                  className={`
                              flex items-center gap-2.5 w-full justify-center
                              px-5 py-2.5 text-sm font-bold rounded-full
                              transition-colors duration-300
                              ${
                                theme === "dark"
                                  ? "bg-gray-900/70 text-white hover:bg-gray-800"
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
          className="flex items-center gap-1 text-lg sm:text-xl font-bold text-blue-600"
        >
          DISHDASH
          <Image
            src={"/Logo.png"}
            alt="logo"
            width={76}
            height={76}
            className={`
                      transition-all duration-300
                      ${
                        theme === "dark"
                          ? "[filter:drop-shadow(0_2px_3px_rgba(255,255,255,0.15))]"
                          : "[filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.25))]"
                      }
            `}
            suppressHydrationWarning={true}
          />
        </Link>
      </div>
    </header>
  );
}
