"use client";

import { createContext, useContext, ReactNode } from "react";

interface MapStyle {
  url: string;
  attribution?: string;
}

interface MapStyleContextType {
  lightV1: MapStyle;
  lightV2: MapStyle;
  dark: MapStyle;
}

export const cartoMapStyles: MapStyleContextType = {
  lightV1: {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/attributions">CARTO</a>',
  },
  lightV2: {
    url: "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}@2x.png?key=m3Uw9viTGOipjGtDWWTu",
  },
  dark: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | <a href="https://carto.com/attributions">CARTO</a>',
  },
};

const MapStyleContext = createContext<MapStyleContextType | null>(null);

export const MapStyleProvider = ({ children }: { children: ReactNode }) => {
  return (
    <MapStyleContext.Provider value={cartoMapStyles}>
      {children}
    </MapStyleContext.Provider>
  );
};

export const useMapStyle = () => {
  const context = useContext(MapStyleContext);
  if (!context) {
    throw new Error("useMapStyle must be used within a MapStyleProvider");
  }
  return context;
};
