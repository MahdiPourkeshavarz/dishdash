"use client";

import { Poi, Post } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import PostCarousel from "../post/PostCarousel";

interface PostCarouselOverlayProps {
  poi: Poi | null;
  posts: Post[];
}

// A simple function to check if two coordinates are very close
const areCoordsNear = (
  coords1: [number, number],
  coords2: [number, number]
) => {
  const tolerance = 0.0001; // Adjust this for desired proximity
  return (
    Math.abs(coords1[0] - coords2[0]) < tolerance &&
    Math.abs(coords1[1] - coords2[1]) < tolerance
  );
};

export const PostCarouselOverlay: React.FC<PostCarouselOverlayProps> = ({
  poi,
  posts,
}) => {
  if (!poi) return null;

  // Filter posts to find those that match the selected POI's location
  const relatedPosts = posts.filter((post) =>
    areCoordsNear(post.position, [poi.lat, poi.lon])
  );

  // If no related posts, don't show the carousel
  if (relatedPosts.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-[15%] left-0 right-0 z-[1001] flex justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="w-[310px] pointer-events-auto">
          <PostCarousel posts={relatedPosts} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
