"use client";
import { useStore } from "@/store/useStore";
import { useEffect } from "react";

export const ThemeSync = () => {
  const { theme, setMapStyle } = useStore();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const ZUSTAND_STORAGE_KEY = "dishdash";
    const storedState = localStorage.getItem(ZUSTAND_STORAGE_KEY);

    const hasSavedState =
      storedState && JSON.parse(storedState).state?.mapStyleKey;

    if (!hasSavedState) {
      const systemThemeIsDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemThemeIsDark) {
        setMapStyle("dark");
      } else {
        setMapStyle("lightV2");
      }
    }
  }, [setMapStyle]);

  return null;
};
