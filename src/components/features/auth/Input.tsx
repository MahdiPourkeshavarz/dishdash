"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useStore } from "@/store/useStore";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, type, error, ...props }, ref) => {
    const { theme } = useStore();
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const inputId = props.name;

    return (
      <div className="relative w-full">
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {label}
        </label>
        <input
          id={inputId}
          {...props}
          ref={ref}
          type={isPassword && showPassword ? "text" : type}
          className={`
            w-full p-3 rounded-md border focus:outline-none focus:ring-2 transition-all
            ${isPassword ? "dir-ltr text-left" : ""}
            ${
              theme === "dark"
                ? "bg-gray-800/50 text-white placeholder:text-gray-500"
                : "bg-white/50 text-black placeholder:text-gray-400"
            }
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : `focus:ring-blue-500 ${
                    theme === "dark" ? "border-gray-700" : "border-gray-300"
                  }`
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

        {error && <p className="text-red-500 text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
