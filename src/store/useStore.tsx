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
  isProfileModalOpen: boolean;
}

interface StoreActions {
  toggleTheme: () => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  fetchUserLocation: () => Promise<boolean>;
  addPost: (post: Post) => void;
  toggleProfileModal: () => void;
  setTheme: (theme: "light" | "dark") => void;
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
      isProfileModalOpen: false,
      location: {
        coords: null,
        areaName: null,
        error: null,
      },

      setTheme: (theme) => set({ theme }),

      toggleProfileModal: () =>
        set((state) => ({ isProfileModalOpen: !state.isProfileModalOpen })),

      fetchUserLocation: () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            set((state) => ({
              location: {
                ...state.location,
                error: "Geolocation not supported.",
              },
            }));
            resolve(false);
            return;
          }

          const options: PositionOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000,
          };

          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const coords: [number, number] = [latitude, longitude];

              try {
                const response = await fetch(
                  `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                );
                if (!response.ok)
                  throw new Error(`API error: ${response.status}`);

                const data = await response.json();
                if (!data.address) throw new Error("No address found.");

                const { city, town, neighbourhood, state } = data.address;
                const primaryArea = city || town || neighbourhood;
                const areaName = [primaryArea, state]
                  .filter(Boolean)
                  .join(", ");

                set((state) => ({
                  location: {
                    ...state.location,
                    coords,
                    areaName: areaName || "Unknown Location",
                    error: null,
                  },
                }));
                resolve(true);
              } catch (error) {
                console.error("Reverse geocoding failed:", error);
                set((state) => ({
                  location: {
                    ...state.location,
                    coords,
                    error: "Could not fetch area name.",
                  },
                }));
                resolve(false);
              }
            },
            (error) => {
              console.error("Geolocation failed:", error);
              set((state) => ({
                location: {
                  ...state.location,
                  error: `Geolocation error: ${error.message}`,
                },
              }));
              resolve(false);
            },
            options
          );
        });
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
