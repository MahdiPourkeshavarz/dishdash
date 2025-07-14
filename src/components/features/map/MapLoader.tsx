"use client";

import Lottie from "lottie-react";
import loader from "../../../../public/loader.json";
import { useStore } from "@/store/useStore";

export function MapLoader() {
  const { theme } = useStore();

  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center transition-colors
      ${theme === "dark" ? "bg-gray-900" : "bg-gray-100"}
    `}
    >
      <div
        className={`w-full max-w-sm p-8 flex flex-col items-center justify-center rounded-2xl
        ${theme === "dark" ? "bg-black/20" : "bg-white/30"}
        backdrop-blur-lg border ${
          theme === "dark" ? "border-white/10" : "border-black/10"
        }
      `}
      >
        <div className="w-48 h-48">
          <Lottie animationData={loader} loop={true} />
        </div>

        <p
          className={`mt-4 text-lg font-semibold ${
            theme === "dark" ? "text-slate-300" : "text-slate-700"
          }`}
        >
          در حال بارگذاری نقشه...
        </p>
      </div>
    </div>
  );
}
