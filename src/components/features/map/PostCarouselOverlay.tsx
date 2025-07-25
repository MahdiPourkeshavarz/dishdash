"use client";

import { Poi, Post } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import PostCarousel from "../post/PostCarousel";

interface PostCarouselOverlayProps {
  poi: Poi | null;
  posts: Post[];
}

export const PostCarouselOverlay: React.FC<PostCarouselOverlayProps> = ({
  poi,
  posts,
}) => {
  if (!poi) return null;

  const relatedPosts = posts.filter(
    (post) => post.areaName && post.areaName === poi.tags.name
  );

  if (relatedPosts.length === 0) {
    return null;
  }

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
