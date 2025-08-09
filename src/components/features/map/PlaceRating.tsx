"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { useStore } from "@/store/useStore";
import { useRatePlace } from "@/hooks/useInteractions";
import { Poi } from "@/types";

interface PlaceRatingProps {
  placeId: string;
  averageRating: number;
  ratingCount: number;
}

export const PlaceRating: React.FC<PlaceRatingProps> = ({
  placeId,
  averageRating,
  ratingCount,
}) => {
  const { user } = useStore();
  const isUserLoggedIn = !!user;
  const [hoverRating, setHoverRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);

  const [displayRating, setDisplayRating] = useState(averageRating);
  const [displayCount, setDisplayCount] = useState(ratingCount);

  const { mutate: ratePlace, isPending } = useRatePlace();

  useEffect(() => {
    setDisplayRating(averageRating);
    setDisplayCount(ratingCount);
  }, [averageRating, ratingCount]);

  const handleRating = (score: number) => {
    if (!user || isPending) return;
    ratePlace(
      { placeId, score },
      {
        onSuccess: (updatedPlace: Poi) => {
          setHasRated(true);
          setDisplayRating(updatedPlace.averageRating as number);
          setDisplayCount(updatedPlace.ratingCount as number);
        },
      }
    );
  };

  const starColor = (index: number) => {
    const ratingToShow = hoverRating > 0 ? hoverRating : displayRating;
    return index < ratingToShow ? "text-yellow-400" : "text-gray-400/50";
  };

  return (
    <div className="flex items-center gap-2 flex-row-reverse">
      <AnimatePresence mode="wait">
        {!hasRated && isUserLoggedIn ? (
          <motion.div
            key="rating-input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => user && setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRating(i + 1)}
                className={`cursor-pointer transition-colors ${
                  !user ? "cursor-not-allowed" : ""
                }`}
              >
                <Star
                  size={24}
                  className={starColor(i)}
                  fill={
                    starColor(i) === "text-yellow-400" ? "currentColor" : "none"
                  }
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="rating-summary"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center"
          >
            <Star size={24} className="text-yellow-400" fill="currentColor" />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        {displayRating > 0 ? displayRating.toFixed(1) : "New"}
        {displayCount > 0 && ` (${displayCount})`}
      </p>
    </div>
  );
};
