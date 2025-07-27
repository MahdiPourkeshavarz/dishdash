/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ThemeInitializer } from "@/components/layout/ThemeInitializer";
import { useStore } from "@/store/useStore";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}

const ZustandSessionSync = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { setUser, setAccessToken, logout } = useStore();

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
      setAccessToken((session as any).accessToken);
    } else if (status === "unauthenticated") {
      logout();
    }
  }, [status, session, setUser, setAccessToken, logout]);

  return <>{children}</>;
};

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <SessionProvider>
        <ZustandSessionSync>
          <ThemeInitializer />
          {children}
        </ZustandSessionSync>
      </SessionProvider>
    </>
  );
};
