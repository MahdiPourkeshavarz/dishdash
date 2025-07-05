/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Post, User } from "@/types";
import { posts as initialState } from "@/lib/posts";
export interface LocationState {
  coords: [number, number] | null;
  areaName: string | null;
  error: string | null;
}

interface StoreState {
  theme: "light" | "dark";
  user: User | null;
  accessToken: string | null;
  location: LocationState;
  posts: Post[];
}

interface StoreActions {
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  fetchUserLocation: () => Promise<void>;
  addPost: (post: Post) => void;
}

type Store = StoreState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set) => ({
      theme:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      user: null,
      accessToken: null,
      posts: initialState,
      location: {
        coords: null,
        areaName: null,
        error: null,
      },

      fetchUserLocation: async () => {
        if (!navigator.geolocation) {
          set((state) => ({
            location: {
              ...state.location,
              error: "Geolocation is not supported by your browser.",
            },
          }));
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const coords: [number, number] = [latitude, longitude];

            try {
              // Reverse Geocoding using Nominatim (free, OpenStreetMap-based)
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );
              if (!response.ok) throw new Error("Failed to fetch area name.");

              const data = await response.json();
              const { neighbourhood, suburb, city, town, state } = data.address;

              const area = neighbourhood || suburb || city || town;
              const shortAddress = [area, state].filter(Boolean).join(", ");

              const areaName = shortAddress || "Unknown Location";

              set((state) => ({
                location: { ...state.location, coords, areaName, error: null },
              }));
            } catch (error) {
              set((state) => ({
                location: {
                  ...state.location,
                  coords,
                  error: "Could not fetch area name.",
                },
              }));
            }
          },
          (error) => {
            set((state) => ({
              location: {
                ...state.location,
                error: `Geolocation error: ${error.message}`,
              },
            }));
          }
        );
      },

      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setUser: (user) => set({ user }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => set({ user: null, accessToken: null }),
    }),
    {
      name: "dishdash",
      partialize: (state) => ({
        theme: state.theme,
        user: state.user,
        accessToken: state.accessToken,
        posts: state.posts,
      }),
    }
  )
);
