/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "./Input";
import { useStore } from "@/store/useStore";

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.229-11.303-7.536l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.904,36.467,44,30.865,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const { theme } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // This remains essential
    });

    setIsLoading(false);

    if (result?.error) {
      setError("ایمیل یا رمز عبور اشتباه است.");
    } else if (result?.ok) {
      onClose();
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    console.log("New user signing up:", {
      fullName: formData.get("fullName"),
      username: formData.get("username"),
      email: formData.get("email"),
    });
    alert("ثبت‌نام موفقیت‌آمیز بود! اکنون می‌توانید وارد شوید.");
    setAuthType("signin");
  };

  const modalBgClass = theme === "dark" ? "bg-gray-900/80" : "bg-white/80";
  const inactiveTabClass = theme === "dark" ? "text-gray-500" : "text-gray-400";
  const dividerClass = theme === "dark" ? "border-gray-700" : "border-gray-300";
  const socialButtonClass =
    theme === "dark"
      ? "border-gray-700 hover:bg-gray-800"
      : "border-gray-300 hover:bg-gray-100";
  const primaryButtonClass =
    "w-full mt-2 p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[2000] flex items-end justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            layout
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md backdrop-blur-md rounded-t-2xl p-6 ${modalBgClass} ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
            dir="rtl"
          >
            <div className="flex justify-center mb-4">
              <div
                className={`w-12 h-1.5 rounded-full ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            </div>

            <div className={`flex gap-4 border-b mb-6 ${dividerClass}`}>
              <button
                onClick={() => setAuthType("signin")}
                className={`pb-2 ${
                  authType === "signin"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : inactiveTabClass
                }`}
              >
                ورود
              </button>
              <button
                onClick={() => setAuthType("signup")}
                className={`pb-2 ${
                  authType === "signup"
                    ? "text-blue-500 border-b-2 border-blue-500"
                    : inactiveTabClass
                }`}
              >
                ثبت‌نام
              </button>
            </div>

            <AnimatePresence mode="wait">
              {authType === "signin" ? (
                <motion.div key="signin" /* ... */>
                  <div className="flex flex-col gap-4">
                    <Input
                      label="ایمیل"
                      type="email"
                      required
                      value={email} // Controlled input
                      onChange={(e) => setEmail(e.target.value)}
                      dir="ltr"
                    />
                    <Input
                      label="رمز عبور"
                      type="password"
                      required
                      value={password} // Controlled input
                      onChange={(e) => setPassword(e.target.value)}
                      dir="ltr"
                    />
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <motion.button
                      onClick={handleSignIn} // ✅ 4. Button now calls the new handler
                      disabled={isLoading}
                      className="w-full mt-2 p-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity disabled:opacity-50"
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? "در حال ورود..." : "ورود"}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="signup" /* ... */>
                  <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <Input
                      name="fullName"
                      label="نام کامل"
                      type="text"
                      required
                    />
                    <Input
                      name="username"
                      label="نام کاربری"
                      type="text"
                      required
                    />
                    <Input
                      name="email"
                      label="ایمیل"
                      type="email"
                      required
                      dir="ltr"
                    />
                    <Input
                      name="password"
                      label="رمز عبور"
                      type="password"
                      required
                      dir="ltr"
                    />
                    <motion.button
                      type="submit"
                      className={primaryButtonClass}
                      whileTap={{ scale: 0.95 }}
                    >
                      ساخت حساب کاربری
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 my-6">
              <hr className={`flex-grow ${dividerClass}`} />
              <span className={`text-sm ${inactiveTabClass}`}>یا ورود با</span>
              <hr className={`flex-grow ${dividerClass}`} />
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => signIn("google")}
                className={`p-3 border flex gap-1 items-center rounded-full transition-colors ${socialButtonClass}`}
              >
                <GoogleIcon /> Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
