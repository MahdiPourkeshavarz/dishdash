import { useStore } from "@/store/useStore";
import { Poi, Post } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FeedPostCard } from "./FeedPostCard";
import { Loader, X } from "lucide-react";
import { usePostFeed } from "@/hooks/useFeedPosts";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";

interface PostFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PostFeedModal: React.FC<PostFeedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, setSelectedPoi, setFeedFlyToCoords, feedFlyToCoords } =
    useStore();
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
    usePostFeed();

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flat() || [];

  const [inViewPostId, setInViewPostId] = useState<string | null>(null);
  const debouncedInViewPostId = useDebounce(inViewPostId, 400);

  useEffect(() => {
    if (debouncedInViewPostId && isOpen) {
      const postInView = posts.find(
        (p: Post) => p._id === debouncedInViewPostId
      );
      if (postInView?.position) {
        const coords: [number, number] = [
          postInView.position[1],
          postInView.position[0],
        ];
        if (
          coords[0] !== feedFlyToCoords?.[0] ||
          coords[1] !== feedFlyToCoords?.[1]
        ) {
          setFeedFlyToCoords(coords);
        }
      }
    }
  }, [
    debouncedInViewPostId,
    posts,
    setFeedFlyToCoords,
    isOpen,
    feedFlyToCoords,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setInViewPostId(null);
    }
  }, [isOpen]);

  const handleShowOnMap = (post: Post) => {
    onClose();
    if (post.place) {
      setSelectedPoi(post.place as Poi);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] bg-black/30"
          onClick={onClose}
        >
          <style>
            {`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}
          </style>
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute bottom-0 left-0 w-full h-[85vh] rounded-t-3xl shadow-2xl p-4 border-t
                        md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
                        md:w-[380px] md:h-[70vh] md:max-h-[600px] md:rounded-3xl md:border
                        backdrop-blur-xl ${
                          theme === "dark"
                            ? "bg-gray-900/30 border-white/10"
                            : "bg-white/30 border-black/10"
                        }`}
          >
            <div
              className={`flex items-center justify-between pb-3 mb-3  ${
                theme === "dark" ? "border-white/10" : "border-black/10"
              }`}
            >
              <h2
                className={`text-lg font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-800"
                }`}
              >
                پست های اخیر
              </h2>
              <button
                onClick={onClose}
                className={`p-2 rounded-full text-gray-500 ${
                  theme === "dark" ? "hover:bg-white/10" : "hover:bg-black/10"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <div className="no-scrollbar h-[calc(100%-60px)] w-full overflow-y-auto snap-y snap-mandatory space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader className="animate-spin text-gray-500" />
                </div>
              ) : posts.length > 0 ? (
                posts.map((post: Post, index) => {
                  if (index === posts.length - 1) {
                    return (
                      <div ref={ref} key={post._id}>
                        <FeedPostCard
                          post={post}
                          onShowOnMap={handleShowOnMap}
                          onInView={setInViewPostId}
                        />
                      </div>
                    );
                  }
                  return (
                    <FeedPostCard
                      key={post._id}
                      post={post}
                      onShowOnMap={handleShowOnMap}
                      onInView={setInViewPostId}
                    />
                  );
                })
              ) : (
                <div
                  className={`flex items-center justify-center h-full text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No posts yet.
                </div>
              )}

              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-4">
                  <Loader className="animate-spin text-gray-500" />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
