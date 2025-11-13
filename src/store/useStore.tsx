/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ChatMessage, Poi, Post, User } from "@/types";
import { posts as initialState } from "@/lib/posts";
import { cartoMapStyles } from "@/lib/mapStyles";

export type MapStyleKey = "lightV1" | "lightV2" | "dark";

export type UploadStatus =
  | "idle"
  | "classifying"
  | "uploading"
  | "success"
  | "error";

export interface LocationState {
  coords: [number, number] | null;
  areaName: string | null;
  error: string | null;
}

interface TargetLocation {
  name: string | null;
  coords: [number, number];
  osmId: number;
}

interface StoreState {
  theme: "light" | "dark";
  mapStyleKey: MapStyleKey;
  mapCurrentBounds: number[];
  mapUrl: string;
  user: User | null;
  accessToken: string | null;
  location: LocationState;
  posts: Post[];
  isProfileModalOpen: boolean;
  postTargetLocation: TargetLocation | null;
  editingPost: Post | null;
  deletingPost: Post | null;
  isPostModalOpen: boolean;
  wishlist: Poi[];
  feedFlyToCoords: [number, number] | null;
  selectedPoi: Poi | null;
  flyToTarget: Poi | null;
  highlightedPoiId: number | null;
  isAuthModalOpen: boolean;
  searchResults: Poi[] | null;
  isSearching: boolean;
  uploadStatus: UploadStatus;
  lastSeenPostTimestamp: number | null;
  chatMessages: ChatMessage[];
  thread_id: string | null;
}

interface StoreActions {
  toggleTheme: () => void;
  setMapCurrentBounds: (bounds: number[]) => void;
  initializeThreadId: () => void;
  setMapStyle: (key: MapStyleKey) => void;
  toggleAuthModal: (isOpen: boolean) => void;
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setUploadStatus: (status: UploadStatus) => void;
  logout: () => void;
  fetchUserLocation: () => Promise<boolean>;
  addPost: (post: Post) => void;
  toggleProfileModal: () => void;
  setPostTargetLocation: (target: TargetLocation | null) => void;
  setEditingPost: (post: Post | null) => void;
  setDeletingPost: (post: Post | null) => void;
  updatePost: (updatedPost: Post) => void;
  deletePost: (postId: string) => void;
  togglePostModal: (isOpen: boolean) => void;
  addToWishlist: (place: Poi) => void;
  removeFromWishlist: (placeId: number) => void;
  setFeedFlyToCoords: (coords: [number, number] | null) => void;
  setSelectedPoi: (poi: Poi | null) => void;
  setFlyToTarget: (poi: Poi | null) => void;
  setHighlightedPoi: (id: number | null) => void;
  setPosts: (posts: Post[]) => void;
  setSearchResults: (results: Poi[] | null) => void;
  setIsSearching: (isSearching: boolean) => void;
  clearSearch: () => void;
  markPostsAsSeen: () => void;
  addChatMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
}

type Store = StoreState & StoreActions;

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      theme: "light",
      mapCurrentBounds: [],
      mapStyleKey: "lightV1",
      user: null as User | null,
      accessToken: null,
      wishlist: [],
      chatMessages: [],
      isAuthModalOpen: false,
      feedFlyToCoords: null,
      selectedPoi: null,
      flyToTarget: null,
      uploadStatus: "idle",
      highlightedPoiId: null,
      posts: initialState,
      mapUrl: cartoMapStyles.lightV1.url,
      isProfileModalOpen: false,
      postTargetLocation: null,
      editingPost: null,
      deletingPost: null,
      lastSeenPostTimestamp: null,
      isPostModalOpen: false,
      thread_id: null,
      location: {
        coords: null,
        areaName: null,
        error: null,
      },
      searchResults: null,
      isSearching: false,

      setMapStyle: (key: MapStyleKey) =>
        set({
          mapStyleKey: key,
          theme: key === "dark" ? "dark" : "light",
          mapUrl: cartoMapStyles[key].url,
        }),
      clearSearch: () => set({ searchResults: null, isSearching: false }),

      initializeThreadId: () => {
        if (!get().thread_id) {
          set({
            thread_id: `thread_${Date.now()}_${Math.random() / 2}`,
          });
        }
      },

      setMapCurrentBounds(bounds: number[]) {
        set({ mapCurrentBounds: bounds });
      },

      addChatMessage: (message) =>
        set((state) => ({
          chatMessages: [...state.chatMessages, message],
        })),

      clearMessages: () =>
        set(() => ({
          chatMessages: [],
        })),

      markPostsAsSeen: () => set({ lastSeenPostTimestamp: Date.now() }),

      setUploadStatus: (status) => set({ uploadStatus: status }),

      setPosts: (posts) => set({ posts }),

      setHighlightedPoi: (id) => set({ highlightedPoiId: id }),

      setSelectedPoi: (poi) => set({ selectedPoi: poi }),
      setFlyToTarget: (poi) => set({ flyToTarget: poi }),

      toggleTheme: () => {
        const currentStyle = get().mapStyleKey;
        const newStyle = currentStyle === "dark" ? "lightV1" : "dark";
        get().setMapStyle(newStyle);
      },

      toggleAuthModal: (isOpen) => set({ isAuthModalOpen: isOpen }),

      toggleProfileModal: () =>
        set((state) => ({ isProfileModalOpen: !state.isProfileModalOpen })),

      setEditingPost: (post) => set({ editingPost: post }),
      setDeletingPost: (post) => set({ deletingPost: post }),

      togglePostModal: (isOpen) => set({ isPostModalOpen: isOpen }),

      updatePost: (updatedPost) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p._id === updatedPost._id ? updatedPost : p
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

      setPostTargetLocation: (target) => set({ postTargetLocation: target }),

      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
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
      setFeedFlyToCoords: (coords) => set({ feedFlyToCoords: coords }),

      setAccessToken: (token) => set({ accessToken: token }),

      logout: () => set({ user: null, accessToken: null }),

      setSearchResults: (results) => set({ searchResults: results }),
      setIsSearching: (isSearching) => set({ isSearching }),
    }),

    {
      name: "dishdash",
      partialize: (state) => ({
        mapStyleKey: state.mapStyleKey,
        theme: state.theme,
        mapUrl: state.mapUrl,
        posts: state.posts,
        wishlist: state.wishlist,
        lastSeenPostTimestamp: state.lastSeenPostTimestamp,
        thread_id: state.thread_id,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
