"use client";

import { useClickOutside } from "@/hooks/useClickOutside";
import { useStore } from "@/store/useStore";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Edit3, LogOut, Shield, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { Input } from "../auth/Input";

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

export function ProfileModal() {
  const { theme, isProfileModalOpen, toggleProfileModal } = useStore();
  const { data: session, update } = useSession();
  const user = session?.user;

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [username, setUsername] = useState(user?.name || "");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileCardRef, () => {
    if (isProfileModalOpen) {
      toggleProfileModal();
    }
  });

  useEffect(() => {
    if (user?.name) setUsername(user.name);
  }, [user?.name]);

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    await update({
      name: username,
      image: imagePreview || user?.image,
    });
    alert("Profile updated!");
    toggleProfileModal();
    setImagePreview(null);
  };

  return (
    <AnimatePresence>
      {isProfileModalOpen && (
        <div ref={profileCardRef} className="absolute top-14 right-2 z-[2000]">
          <motion.div
            variants={profileCardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`w-[90vw] max-w-sm rounded-2xl shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700"
                : "bg-white/80 border-gray-200"
            } backdrop-blur-md text-white`}
          >
            {/* Tabs */}
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
            {/* Tab Content */}
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
                      <motion.label
                        className="relative cursor-pointer"
                        // ✅ The whileHover prop will manage the visibility of the child
                        whileHover="hover"
                        initial="initial"
                      >
                        <Image
                          src={imagePreview || user?.image || "/user-photo.jpg"}
                          alt="Profile"
                          width={80}
                          height={80}
                          className="rounded-full object-cover"
                        />
                        {/* ✅ The overlay now has variants and uses the parent's hover state */}
                        <motion.div
                          className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white"
                          variants={{
                            initial: { opacity: 0 },
                            hover: { opacity: 1 },
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <Edit3 size={24} />
                        </motion.div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const file = e.target.files?.[0];
                            if (file)
                              setImagePreview(URL.createObjectURL(file));
                          }}
                        />
                      </motion.label>
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
                      <Input label="رمز عبور فعلی" type="password" dir="ltr" />
                      <Input label="رمز عبور جدید" type="password" dir="ltr" />
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
            {/* Logout Button */}
            <div
              className={`border-t p-2 ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <LogOut size={16} /> خروج
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
