/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Poi, Post, User } from "@/types";
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
  postTargetLocation: [number, number] | null;
  editingPost: Post | null;
  deletingPost: Post | null;
  isPostModalOpen: boolean;
  wishlist: Poi[];
  flyToLocation: [number, number] | null;
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
  setPostTargetLocation: (coords: [number, number] | null) => void;
  setEditingPost: (post: Post | null) => void;
  setDeletingPost: (post: Post | null) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (postId: string) => void;
  togglePostModal: (isOpen: boolean) => void;
  addToWishlist: (place: Poi) => void;
  removeFromWishlist: (placeId: number) => void;
  setFlyToLocation: (coords: [number, number] | null) => void;
}

type Store = StoreState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme:
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      user: null as User | null,
      accessToken: null,
      wishlist: [],
      flyToLocation: null,
      posts: initialState,
      isProfileModalOpen: false,
      postTargetLocation: null,
      editingPost: null,
      deletingPost: null,
      isPostModalOpen: false,
      location: {
        coords: null,
        areaName: null,
        error: null,
      },

      setTheme: (theme) => set({ theme }),

      toggleProfileModal: () =>
        set((state) => ({ isProfileModalOpen: !state.isProfileModalOpen })),

      setEditingPost: (post) => set({ editingPost: post }),
      setDeletingPost: (post) => set({ deletingPost: post }),

      togglePostModal: (isOpen) => set({ isPostModalOpen: isOpen }),

      updatePost: (updatedPost) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === updatedPost.id ? updatedPost : p
          ),
        })),

      deletePost: (postId) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== postId),
        })),

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
            enableHighAccuracy: false,
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

      setPostTargetLocation: (coords) => set({ postTargetLocation: coords }),

      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "dark" ? "light" : "dark",
        })),

      setUser: (user) => set({ user }),

      addToWishlist: (place) => {
        if (!get().wishlist.some((p) => p.id === place.id)) {
          set((state) => ({ wishlist: [...state.wishlist, place] }));
        }
      },
      removeFromWishlist: (placeId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((p) => p.id !== placeId),
        })),
      setFlyToLocation: (coords) => set({ flyToLocation: coords }),

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
        wishlist: state.wishlist,
      }),
    }
  )
);
