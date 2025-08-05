/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SessionProvider } from "next-auth/react";

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>{children}</SessionProvider>
    </>
  );
};
