"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/store/useStore";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export const Input: React.FC<InputProps> = ({ label, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const { theme } = useStore();

  return (
    <div className="relative w-full">
      <label
        className={`block text-sm font-medium mb-1 ${
          theme === "dark" ? "text-gray-300" : "text-gray-700"
        }`}
      >
        {label}
      </label>
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        className={`
          w-full p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
          ${isPassword ? "dir-ltr text-left" : ""}
          ${
            theme === "dark"
              ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
              : "bg-white/50 border-gray-300 text-black placeholder:text-gray-400"
          }
        `}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute top-10 right-3 ${
            theme === "dark"
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-black"
          }`}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      )}
    </div>
  );
};
