"use client";
import { MapLoader } from "@/components/features/map/MapLoader";
import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function HomePage() {
  // Dynamically import the MapView component with SSR turned off
  const MapView = useMemo(
    () =>
      dynamic(() => import("@/components/features/map/MapView"), {
        loading: () => <MapLoader />,
        ssr: false,
      }),
    []
  );

  return (
    <main className="w-screen h-screen">
      <Navbar />
      <MapView />
    </main>
  );
}
