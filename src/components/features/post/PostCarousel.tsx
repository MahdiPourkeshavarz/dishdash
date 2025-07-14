import { Post } from "@/types";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import PostCard from "./PostCard";

interface PostCarouselProps {
  posts: Post[];
}

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

// Defines how far the user needs to swipe to trigger a page change.
const swipeConfidenceThreshold = 10000;

const PostCarousel: React.FC<PostCarouselProps> = ({ posts }) => {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    if (newDirection > 0) {
      // Next
      setPage(page === posts.length - 1 ? 0 : page + 1);
    } else {
      // Previous
      setPage(page === 0 ? posts.length - 1 : page - 1);
    }
  };

  // This function will be triggered when the user finishes a swipe gesture.
  const handleDragEnd = (
    e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = Math.abs(offset.x) * velocity.x;

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1); // Swipe left, go to next
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1); // Swipe right, go to previous
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={page}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={handleDragEnd}
          className="flex justify-center"
        >
          <PostCard post={posts[page]} />
        </motion.div>
      </AnimatePresence>

      {posts.length > 1 && (
        <div className="flex items-center justify-center gap-4 pt-3">
          <button
            onClick={() => paginate(-1)}
            className="hidden md:block bg-gray-700/50 text-white p-2 rounded-full hover:bg-gray-600"
            aria-label="Previous post"
          >
            <ArrowLeft size={16} />
          </button>

          <span className="text-sm font-mono text-gray-400 w-12 text-center">
            {page + 1} / {posts.length}
          </span>

          <button
            onClick={() => paginate(1)}
            className="hidden md:block bg-gray-700/50 text-white p-2 rounded-full hover:bg-gray-600"
            aria-label="Next post"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCarousel;
