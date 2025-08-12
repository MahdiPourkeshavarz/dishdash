"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ThumbsDown, ThumbsUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Post } from "@/types";
import { useEffect, useState } from "react";
import { useDislikePost, useLikePost } from "@/hooks/useInteractions";
import { useInView } from "react-intersection-observer";
import { SatisfactionDisplay } from "./SatisfactionDisplay";
import { useUser } from "@/hooks/useUser";
import { formatTimeAgo } from "@/lib/timeCalculation";

interface FeedPostCardProps {
  post: Post;
  onShowOnMap: (post: Post) => void;
  onInView: (postId: string) => void;
}

export const FeedPostCard: React.FC<FeedPostCardProps> = ({
  post,
  onShowOnMap,
  onInView,
}) => {
  const { theme, user } = useStore();

  const { data: userData } = useUser(post.userId);

  const [vote, setVote] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikes || 0);

  const { mutate: likePost } = useLikePost();
  const { mutate: dislikePost } = useDislikePost();

  const { ref, inView } = useInView({
    rootMargin: "-50% 0px -50% 0px",
    threshold: 0,
  });

  useEffect(() => {
    if (inView && post._id) {
      onInView(post._id);
    }
  }, [inView, onInView, post._id]);

  const handleLike = () => {
    if (vote === "dislike") setDislikeCount((c: number) => c - 1);
    setVote(vote === "like" ? null : "like");
    setLikeCount((c: number) => (vote === "like" ? c - 1 : c + 1));
    likePost(post._id as string);
  };

  const handleDislike = () => {
    if (vote === "like") setLikeCount((c: number) => c - 1);
    setVote(vote === "dislike" ? null : "dislike");
    setDislikeCount((c: number) => (vote === "dislike" ? c - 1 : c + 1));
    dislikePost(post._id as string);
  };

  return (
    <motion.div
      ref={ref}
      className="w-full snap-center flex-shrink-0"
      initial={{ opacity: 0, scale: 0.98, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 20 }}
    >
      <div
        className={`group mx-auto max-w-sm rounded-3xl shadow-xl p-6 space-y-5
        ${
          theme === "dark"
            ? "bg-gradient-to-b from-gray-900/55 to-gray-800/55 shadow-black/30"
            : "bg-gradient-to-b from-white/55 to-gray-50/55 shadow-black/10"
        }`}
      >
        {userData && (
          <div className="flex items-center gap-3">
            <Image
              src={userData.image || "/user-photo.jpg"}
              alt={userData.username || "User"}
              width={44}
              height={44}
              className="rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div>
              <span
                className={`block font-semibold ${
                  theme === "dark" ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {userData.username}
              </span>
              <span className="text-xs text-gray-500">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
          </div>
        )}

        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.description}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 right-3">
            <SatisfactionDisplay satisfaction={post.satisfaction} />
          </div>
          {post.place?.name && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-md border border-white/20"
            >
              {post.place.name}
            </motion.div>
          )}
        </div>

        <p
          className={`leading-relaxed line-clamp-3 ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {post.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              disabled={!user}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
              ${
                vote === "like"
                  ? theme === "dark"
                    ? "bg-blue-900/30 text-blue-600"
                    : "bg-blue-100 text-blue-600"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <ThumbsUp size={20} />
              <motion.span
                key={likeCount}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
              >
                {likeCount}
              </motion.span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDislike}
              disabled={!user}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition
              ${
                vote === "dislike"
                  ? theme === "dark"
                    ? "bg-red-900/30 text-red-600"
                    : "bg-red-100 text-red-600"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-500"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              <ThumbsDown size={20} />
              <motion.span
                key={dislikeCount}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
              >
                {dislikeCount}
              </motion.span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onShowOnMap(post)}
            className="flex items-center gap-[6px] px-2 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/60 to-indigo-500/60 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30"
          >
            <MapPin size={16} />
            نمایش روی نقشه
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
