"use client";

import { MapStyleProvider } from "@/store/useMapStyle";
import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <MapStyleProvider>{children}</MapStyleProvider>
      </SessionProvider>
    </>
  );
};
