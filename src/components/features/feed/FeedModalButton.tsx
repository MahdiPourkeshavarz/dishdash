import { useStore } from "@/store/useStore";
import { useEffect, useMemo, useState } from "react";
import { PostFeedModal } from "./FeedModal";
import { Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { usePostFeed } from "@/hooks/useFeedPosts";

export const PostFeedButton = () => {
  const { theme, lastSeenPostTimestamp, markPostsAsSeen } = useStore(); //should be implemented
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const { data: posts = [] } = usePostFeed();

  const hasNewPosts = useMemo(() => {
    if (!posts || posts.length === 0) return false;
    if (!lastSeenPostTimestamp) return true;

    const newestPostTimestamp = new Date(posts[0].createdAt).getTime();
    return newestPostTimestamp > lastSeenPostTimestamp;
  }, [posts, lastSeenPostTimestamp]);

  useEffect(() => {
    if (hasNewPosts) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [posts, hasNewPosts]);

  const handleOpenFeed = () => {
    setIsFeedOpen(true);
    if (hasNewPosts) {
      markPostsAsSeen();
    }
  };

  return (
    <>
      <div className="absolute top-2/5 left-4 z-[10000]">
        <motion.button
          onClick={handleOpenFeed}
          className={`relative p-3 rounded-full shadow-lg ${
            theme === "dark"
              ? "bg-gray-800/80 text-white"
              : "bg-white/80 text-gray-900"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{ scale: pulse ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <Newspaper size={24} />
          {hasNewPosts && (
            <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800" />
          )}
        </motion.button>
      </div>

      <PostFeedModal isOpen={isFeedOpen} onClose={() => setIsFeedOpen(false)} />
    </>
  );
};
