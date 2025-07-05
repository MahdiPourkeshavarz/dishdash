import { useState, useEffect } from "react";

export const useVirtualKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const handleResize = () => {
      const vh = window.innerHeight;
      const vph = window.visualViewport?.height ?? vh;
      const newHeight = vh - vph;

      setKeyboardHeight(newHeight > 100 ? newHeight : 0);
    };

    window.visualViewport.addEventListener("resize", handleResize);
    return () =>
      window.visualViewport?.removeEventListener("resize", handleResize);
  }, []);

  return keyboardHeight;
};
