/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "./Input";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SignInSchema,
  SignInData,
  SignUpSchema,
  SignUpData,
} from "@/lib/authValidation";
import { PasswordStrength } from "./PasswordStrength";
import { X } from "lucide-react";
import { useSignUp } from "@/hooks/useSignUp";

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
  const [authType, setAuthType] = useState<
    "signin" | "signup" | "success" | "error"
  >("signin");
  const [serverError, setServerError] = useState<string | null>(null);
  const { theme } = useStore();
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: signUp } = useSignUp();

  const {
    register: registerSignIn,
    handleSubmit: handleSignInSubmit,
    formState: { errors: signInErrors },
  } = useForm<SignInData>({
    resolver: zodResolver(SignInSchema),
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSignUpSubmit,
    watch,
    formState: { errors: signUpErrors },
  } = useForm<SignUpData>({
    resolver: zodResolver(SignUpSchema),
  });

  const passwordValue = watch("password", "");

  const onSignIn = async (data: SignInData) => {
    setIsLoading(true);
    setServerError(null);

    const result = await signIn("credentials", {
      ...data,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setServerError("ایمیل یا رمز عبور اشتباه است.");
    } else if (result?.ok) {
      onClose();
    }
  };

  const onSignUp = (data: SignUpData) => {
    setIsLoading(true);
    signUp(data, {
      onSuccess: () => {
        setAuthType("success");
        setIsLoading(false);
        setTimeout(() => onClose(), 2000);
      },
      onError: (err) => {
        setIsLoading(false);
        setServerError("ثبت نام موفق نبود");
        setAuthType("error");
      },
    });
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
          className="fixed inset-0 z-[200000] flex items-end justify-center bg-black/60 backdrop-blur-sm"
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
            <button
              onClick={onClose}
              className={`absolute top-6 left-5 z-10 p-1 rounded-full border border-gray-400 transition-colors ${
                theme === "dark"
                  ? "text-gray-500 hover:text-white hover:bg-gray-700"
                  : "text-gray-500 hover:text-black hover:bg-gray-200"
              }`}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="flex justify-center mb-4">
              <div
                className={`w-12 h-1.5 rounded-full ${
                  theme === "dark" ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            </div>

            {(authType === "signin" || authType === "signup") && (
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
            )}

            <AnimatePresence mode="wait">
              {authType === "signin" ? (
                <motion.div
                  key="signin"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <form
                    onSubmit={handleSignInSubmit(onSignIn)}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="ایمیل"
                      type="email"
                      dir="ltr"
                      {...registerSignIn("email")}
                      error={signInErrors.email?.message}
                    />
                    <Input
                      label="رمز عبور"
                      type="password"
                      dir="ltr"
                      {...registerSignIn("password")}
                      error={signInErrors.password?.message}
                    />
                    {serverError && (
                      <p className="text-red-400 text-sm">{serverError}</p>
                    )}
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`${primaryButtonClass} disabled:opacity-50`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? "در حال ورود..." : "ورود"}
                    </motion.button>
                  </form>
                </motion.div>
              ) : authType === "signup" ? (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <form
                    onSubmit={handleSignUpSubmit(onSignUp)}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      label="نام کامل"
                      type="text"
                      {...registerSignUp("fullName")}
                      error={signUpErrors.fullName?.message}
                    />
                    <Input
                      label="نام کاربری"
                      type="text"
                      {...registerSignUp("username")}
                      error={signUpErrors.username?.message}
                    />
                    <Input
                      label="ایمیل"
                      type="email"
                      dir="ltr"
                      {...registerSignUp("email")}
                      error={signUpErrors.email?.message}
                    />
                    <Input
                      label="رمز عبور"
                      type="password"
                      dir="ltr"
                      {...registerSignUp("password")}
                      error={signUpErrors.password?.message}
                    />
                    <PasswordStrength password={passwordValue} />
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      className={`${primaryButtonClass} disabled:opacity-50`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isLoading ? "در حال ساخت..." : "ساخت حساب کاربری"}
                    </motion.button>
                  </form>
                </motion.div>
              ) : authType === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center gap-4 text-center py-8"
                >
                  <Image
                    src="/success.gif"
                    alt="Success"
                    width={120}
                    height={120}
                    unoptimized
                  />
                  <h2 className="text-2xl font-bold">
                    ثبت‌نام موفقیت‌آمیز بود
                  </h2>
                  <p className={inactiveTabClass}>
                    حالا به صفحه ورود هدایت می‌شوید تا وارد حساب خود شوید.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center gap-4 text-center py-8"
                >
                  <Image
                    src="/error.gif"
                    alt="Error"
                    width={120}
                    height={120}
                    unoptimized
                  />
                  <h2 className="text-2xl font-bold text-red-500">
                    اوه! مشکلی پیش آمد
                  </h2>
                  <p className={inactiveTabClass}>
                    لطفاً دوباره تلاش کنید. اگر مشکل ادامه داشت، با پشتیبانی
                    تماس بگیرید.
                  </p>
                  <motion.button
                    onClick={() => setAuthType("signup")}
                    className="w-full max-w-xs mt-4 p-3 bg-red-600 rounded-lg font-semibold text-white hover:bg-red-500 transition-colors"
                    whileTap={{ scale: 0.95 }}
                  >
                    تلاش مجدد
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {(authType === "signin" || authType === "signup") && (
              <>
                <div className="flex items-center gap-4 my-6">
                  <hr className={`flex-grow ${dividerClass}`} />
                  <span className={`text-sm ${inactiveTabClass}`}>
                    یا ورود با
                  </span>
                  <hr className={`flex-grow ${dividerClass}`} />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => signIn("google")}
                    className={`p-3 border flex items-center gap-3 rounded-full transition-colors ${socialButtonClass}`}
                  >
                    <GoogleIcon />
                    <span className="font-semibold text-sm">Google</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
