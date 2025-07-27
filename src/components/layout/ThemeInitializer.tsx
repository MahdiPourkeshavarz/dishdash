"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";

const ZUSTAND_STORAGE_KEY = "dishdash";

export function ThemeInitializer() {
  const { setMapStyle } = useStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isInitialized) return;

    const storedState = localStorage.getItem(ZUSTAND_STORAGE_KEY);
    const hasSavedState =
      storedState && JSON.parse(storedState).state?.mapStyleKey;

    if (!hasSavedState) {
      const systemThemeIsDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (systemThemeIsDark) {
        setMapStyle("dark");
      }
    }

    setIsInitialized(true);
  }, [isInitialized, setMapStyle]);

  return null;
}
