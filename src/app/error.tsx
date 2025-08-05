/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  const { theme } = useStore();

  return (
    <main
      className={`flex h-screen w-full flex-col items-center justify-center px-4 text-center ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex max-w-md flex-col items-center"
      >
        <div
          className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
            theme === "dark" ? "bg-red-900/30" : "bg-red-100"
          }`}
        >
          <AlertTriangle
            className={`h-10 w-10 ${
              theme === "dark" ? "text-red-400" : "text-red-500"
            }`}
          />
        </div>

        <h1
          className={`text-3xl font-bold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          مشکلی برایمان پیش آمده
        </h1>

        <p
          className={`mt-4 ${
            theme === "dark" ? "text-gray-400" : "text-gray-600"
          }`}
        >
          سریع حل میشه
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <RefreshCw size={16} />
            دوباره سعی کن
          </button>
          <Link
            href="/"
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-all ${
              theme === "dark"
                ? "bg-gray-800 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            <Home size={16} />
            به خانه برو
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
