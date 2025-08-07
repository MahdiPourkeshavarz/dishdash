"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ThumbsDown, ThumbsUp } from "lucide-react";
import { useStore } from "@/store/useStore";
import { Post } from "@/types";
import { useEffect, useState } from "react";
import { useDislikePost, useLikePost } from "@/hooks/useInteractions";
import { useInView } from "react-intersection-observer";

const SatisfactionBadge = ({ satisfaction }: { satisfaction: string }) => {
  const satisfactionEmojis: { [key: string]: string } = {
    awesome: "🤩",
    good: "😊",
    bad: "😕",
    disgusted: "🤢",
  };
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 text-xl">
      {satisfactionEmojis[satisfaction] || "🤔"}
    </div>
  );
};

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
      data-post-id={post._id}
      className="w-full snap-center flex-shrink-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        className={`mx-auto max-w-sm rounded-3xl p-3 space-y-3 transition-colors ${
          theme === "dark" ? "bg-gray-800/60" : "bg-white/60"
        }`}
      >
        <div className="flex items-center gap-3 px-2">
          <Image
            src={post.user?.imgUrl || "/user-photo.jpg"}
            alt={post.user?.username || "User"}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold ${
                theme === "dark" ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {post.user?.username}
            </span>
            <span
              className={`text-xs ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {post.areaName}
            </span>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={post.imageUrl}
            alt={post.description}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="px-2 space-y-3">
          <p
            className={`text-sm leading-relaxed ${
              theme === "dark" ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {post.description}
          </p>
          <div
            className={`flex items-center justify-between pt-2 border-t ${
              theme === "dark" ? "border-white/10" : "border-black/10"
            }`}
          >
            <div className="flex items-center gap-4">
              <SatisfactionBadge satisfaction={post.satisfaction} />
              <button
                onClick={handleLike}
                disabled={!user}
                className="flex items-center gap-1.5"
              >
                <ThumbsUp
                  size={16}
                  className={
                    vote === "like" ? "text-blue-500" : "text-gray-500"
                  }
                />
                <span className="text-xs">{likeCount}</span>
              </button>
              <button
                onClick={handleDislike}
                disabled={!user}
                className="flex items-center gap-1.5"
              >
                <ThumbsDown
                  size={16}
                  className={
                    vote === "dislike" ? "text-red-500" : "text-gray-500"
                  }
                />
                <span className="text-xs">{dislikeCount}</span>
              </button>
            </div>

            <motion.button
              onClick={() => onShowOnMap(post)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin size={14} />
              Show on Map
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
