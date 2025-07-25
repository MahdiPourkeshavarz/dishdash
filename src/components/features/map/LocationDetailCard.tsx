/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "@/hooks/useInteractions";
import { usePopulatedWishlist } from "@/hooks/usePopulatedWishlist";
import { useStore } from "@/store/useStore";
import { Poi } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Clock,
  Globe,
  X,
  MapPin,
  BookmarkCheck,
  Bookmark,
} from "lucide-react";
import { AddPostButton } from "../post/AddPostButton";

interface LocationDetailCardProps {
  poi: Poi | null;
  onClose: () => void;
  onAddPost: () => void;
}

export const LocationDetailCard: React.FC<LocationDetailCardProps> = ({
  poi,
  onClose,
  onAddPost,
}) => {
  const { theme } = useStore();

  const { data: wishlist = [] } = usePopulatedWishlist();

  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  if (!poi) return null;

  const currentPlaceOsmId = poi.osmId || poi.id;

  const isInWishlist = wishlist.some(
    (place: any) => place && place.osmId === currentPlaceOsmId
  );

  const handleWishlistClick = () => {
    if (isInWishlist) {
      const placeInWishlist = wishlist.find(
        (p: any) => p.osmId === currentPlaceOsmId
      );
      if (placeInWishlist) {
        removeFromWishlistMutation.mutate(placeInWishlist._id);
      }
    } else {
      addToWishlistMutation.mutate(poi);
    }
  };

  return (
    <AnimatePresence>
      {poi && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-[1003] p-2"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
        >
          <div
            className={`relative w-full max-w-md mx-auto rounded-2xl shadow-2xl p-4 text-sm backdrop-blur-xl border ${
              theme === "dark"
                ? "bg-gray-800/80 border-gray-700 text-white"
                : "bg-white/80 border-gray-200 text-black"
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-3 left-3 p-1 rounded-full transition-colors ${
                theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-300"
              }`}
              aria-label="Close popup"
            >
              <X size={18} />
            </button>

            <button
              onClick={handleWishlistClick}
              className={`absolute top-3 right-3 p-1 rounded-full ...`}
            >
              {isInWishlist ? (
                <BookmarkCheck size={18} className="text-green-400" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>

            <h3 className={`font-bold text-xl mb-2 pr-6 text-center`}>
              {poi.tags.name}
            </h3>

            <div
              className={`space-y-2 text-xs border-t pt-2 mt-2 ${
                theme === "dark" ? "border-white/10" : "border-black/10"
              }`}
            >
              {poi.tags["addr:street"] &&
                (() => {
                  const isFarsi = /[\u0600-\u06FF]/.test(
                    poi.tags["addr:street"] ?? ""
                  );
                  const addressDirection = isFarsi ? "rtl" : "ltr";
                  const addressFlex = isFarsi ? "flex-row-reverse" : "flex-row";
                  const addressTextAlign = isFarsi ? "text-right" : "text-left";

                  return (
                    <div
                      className={`flex items-center gap-2 ${addressFlex} ${addressTextAlign} w-full justify-between`}
                      dir={addressDirection}
                    >
                      <span className="flex-1">{poi.tags["addr:street"]}</span>
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  );
                })()}
              {poi.tags.opening_hours && (
                <div
                  className="flex items-center gap-2 flex-row text-left w-full justify-between"
                  dir="ltr"
                >
                  <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1">{poi.tags.opening_hours}</span>
                </div>
              )}
              {poi.tags.phone && (
                <a
                  href={`tel:${poi.tags.phone}`}
                  className="flex items-center gap-2 flex-row text-left hover:text-blue-400 w-full justify-between"
                  dir="ltr"
                  aria-label={`Call ${poi.tags.phone}`}
                >
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1">{poi.tags.phone}</span>
                </a>
              )}
              {poi.tags.website && (
                <a
                  href={poi.tags.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 flex-row text-left hover:text-blue-400 truncate w-full justify-between"
                  dir="ltr"
                  aria-label={`Visit website ${poi.tags.website}`}
                >
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 truncate">{poi.tags.website}</span>
                </a>
              )}
            </div>

            <AddPostButton poi={poi} onAddPost={onAddPost} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
