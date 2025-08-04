/* eslint-disable @typescript-eslint/no-unused-vars */
import { useStore } from "@/store/useStore";
import type { Post } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Pencil,
  MoreVertical,
  MapPin,
} from "lucide-react";
import ProfileCard from "../user/ProfileCard";
import { DirectionsPill } from "./DirectionPill";
import { useDislikePost, useLikePost } from "@/hooks/useInteractions";
import { useUser } from "@/hooks/useUser";
import { useSession } from "next-auth/react";

const satisfactionStyles = {
  awesome: {
    badge: "bg-yellow-100 text-yellow-800",
    badgeDark: "bg-yellow-900/50 text-yellow-300",
    text: "خوشمزه",
    emoji: "/awesome.png",
    shadowColorLight: "rgba(251, 191, 36, 0.15)",
    shadowColorDark: "rgba(251, 191, 36, 0.15)",
  },
  good: {
    badge: "bg-green-100 text-green-800",
    badgeDark: "bg-green-900/50 text-green-300",
    text: "خوب",
    emoji: "/good.png",
    shadowColorLight: "rgba(134, 239, 172, 0.15)",
    shadowColorDark: "rgba(134, 239, 172, 0.15)",
  },
  bad: {
    badge: "bg-red-100 text-red-800",
    badgeDark: "bg-red-900/50 text-red-300",
    text: "بد",
    emoji: "/bad.png",
    shadowColorLight: "rgba(248, 113, 113, 0.15)",
    shadowColorDark: "rgba(248, 113, 113, 0.15)",
  },
  disgusted: {
    badge: "bg-purple-100 text-purple-800",
    badgeDark: "bg-purple-900/50 text-purple-300",
    text: "افتضاح",
    emoji: "/disgusted.png",
    shadowColorLight: "rgba(192, 132, 252, 0.15)",
    shadowColorDark: "rgba(192, 132, 252, 0.15)",
  },
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme, setEditingPost, togglePostModal, setDeletingPost } =
    useStore();
  const styles = post
    ? satisfactionStyles[post.satisfaction]
    : satisfactionStyles.awesome;
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const [isDirectionsPillOpen, setDirectionsPillOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [vote, setVote] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(post ? (post.likes as number) : 0);
  const [dislikeCount, setDislikeCount] = useState(
    post ? (post.dislikes as number) : 0
  );

  const { data: session } = useSession();

  const isOwnPost = session?.user?.id === post.userId;

  const canVote = !!session && !isOwnPost;

  const { data: user } = useUser(post.userId);

  const likeMutation = useLikePost();
  const dislikeMutation = useDislikePost();

  const handleLike = () => {
    if (vote === "dislike") {
      setDislikeCount(dislikeCount - 1);
    }
    if (vote === "like") {
      setVote(null);
      setLikeCount(likeCount - 1);
    } else {
      setVote("like");
      setLikeCount(likeCount + 1);
    }
    likeMutation.mutate(post._id as string);
  };

  const handleDislike = () => {
    if (vote === "like") {
      setLikeCount(likeCount - 1);
    }
    if (vote === "dislike") {
      setVote(null);
      setDislikeCount(dislikeCount - 1);
    } else {
      setVote("dislike");
      setDislikeCount(dislikeCount + 1);
    }
    dislikeMutation.mutate(post._id as string);
  };

  const handleEdit = () => {
    setMenuOpen(false);
    setEditingPost(post);
    togglePostModal(true);
  };

  const handleDelete = () => {
    setMenuOpen(false);
    setDeletingPost(post);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (isDirectionsPillOpen) setDirectionsPillOpen(false);
    if (isMenuOpen) setMenuOpen(false);
  };

  const shadowColor =
    theme === "dark" ? styles.shadowColorDark : styles.shadowColorLight;

  const shadowValue = `4px 0 12px -2px ${shadowColor}, -4px 0 12px -2px ${shadowColor}, 0 4px 12px -2px ${shadowColor}`;

  return (
    <div className="relative w-full max-w-sm pt-7" onClick={handleCardClick}>
      <div className="h-21" aria-hidden />
      <div
        className={`relative z-10 rounded-xl shadow-lg pb-2 px-4 flex flex-col ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-50"
        }`}
        style={{ boxShadow: shadowValue }}
      >
        <div className="flex mt-8 pt-6 text-right">
          <p
            className={`text-base font-bold leading-tight break-words overflow-hidden ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {post.description}
          </p>
          {post.areaName && (
            <motion.div
              className={`
                absolute top-13 left-4 flex items-center gap-1
                p-1.5 pr-2 rounded-full text-xs font-semibold shadow-md
                backdrop-blur-sm border
                ${
                  theme === "dark"
                    ? "bg-black/20 border-white/10 text-gray-200"
                    : "bg-white/40 border-black/10 text-gray-700"
                }
              `}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.3,
              }}
            >
              <MapPin size={14} />
              <span>{post.areaName}</span>
            </motion.div>
          )}
        </div>

        <div className="flex-grow"></div>

        <motion.div
          className="flex justify-between items-center pt-1 mt-3 border-t border-white/10"
          layout
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <motion.div className="flex items-center gap-4" layout>
            <button
              onClick={handleLike}
              disabled={!canVote}
              className="flex items-center gap-1.5 group"
            >
              <ThumbsUp
                size={18}
                className={`transition-all duration-200 motion-reduce:transition-none ${
                  vote === "like"
                    ? theme === "dark"
                      ? "text-blue-500 fill-blue-500/30 scale-110"
                      : "text-blue-600 fill-blue-600/20 scale-110"
                    : theme === "dark"
                    ? "text-gray-400 group-hover:text-white group-hover:scale-105"
                    : "text-gray-500 group-hover:text-black group-hover:scale-105"
                }`}
              />
              <span
                className={`text-sm font-mono transition-colors duration-200 ${
                  vote === "like"
                    ? theme === "dark"
                      ? "text-blue-400"
                      : "text-blue-600"
                    : theme === "dark"
                    ? "text-gray-400 group-hover:text-white"
                    : "text-gray-500 group-hover:text-black"
                }`}
              >
                {likeCount}
              </span>
            </button>
            <button
              onClick={handleDislike}
              disabled={!canVote}
              className="flex items-center gap-1.5 group"
            >
              <ThumbsDown
                size={18}
                className={`transition-all duration-200 motion-reduce:transition-none ${
                  vote === "dislike"
                    ? theme === "dark"
                      ? "text-red-500 fill-red-500/30 scale-110"
                      : "text-red-600 fill-red-600/20 scale-110"
                    : theme === "dark"
                    ? "text-gray-400 group-hover:text-white group-hover:scale-105"
                    : "text-gray-500 group-hover:text-black group-hover:scale-105"
                }`}
              />
              <span
                className={`text-sm font-mono transition-colors duration-200 ${
                  vote === "dislike"
                    ? theme === "dark"
                      ? "text-red-400"
                      : "text-red-600"
                    : theme === "dark"
                    ? "text-gray-400 group-hover:text-white"
                    : "text-gray-500 group-hover:text-black"
                }`}
              >
                {dislikeCount}
              </span>
            </button>
          </motion.div>
          <motion.div
            className="pr-2.5"
            layout
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DirectionsPill
              destination={[post.position[0], post.position[1]]}
              isOpen={isDirectionsPillOpen}
              setIsOpen={setDirectionsPillOpen}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute z-20 top-0 left-1/2 -translate-x-1/2 w-11/12 h-40 rounded-xl shadow-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post?._id || "post"}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <motion.button
            onClick={() => setProfileCardVisible(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View profile of ${user?.username}`}
          >
            <Image
              src={user?.image || "/user-photo.jpg"}
              alt={user?.username || "user"}
              width={32}
              height={32}
              className={`rounded-full object-cover border-2 shadow-md ${
                theme === "dark" ? "border-gray-50" : "border-gray-800"
              }`}
            />
          </motion.button>
          {isOwnPost && (
            <motion.button
              onClick={() => setMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className={`p-1 rounded-full absolute top-30 right ${
                theme === "dark"
                  ? "bg-gray-800/50 text-gray-300"
                  : "bg-gray-100/50 text-gray-700"
              }`}
              aria-label="Post actions"
            >
              <MoreVertical size={16} />
            </motion.button>
          )}
        </div>

        <motion.button
          className={`absolute bottom-2 left-2 flex items-center gap-1 p-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-sm border
            ${
              theme === "dark"
                ? "bg-black/20 border-white/10 text-gray-200"
                : "bg-white/40 border-black/10 text-gray-700"
            }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.3,
          }}
          onClick={() => {
            // Placeholder: Engage users by opening a modal with details or related posts
            console.log(`Tapped satisfaction: ${post.satisfaction}`);
            // e.g., toggleSatisfactionModal(post);
          }}
          aria-label={`Satisfaction: ${styles.text}`}
        >
          <Image
            src={styles.emoji}
            alt={post.satisfaction}
            width={16}
            height={16}
          />
          <span>{styles.text}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isMenuOpen && isOwnPost && (
          <motion.div
            className={`absolute z-30 top-12 right-4 p-2 rounded-lg shadow-xl ${
              theme === "dark"
                ? "bg-gray-800/90 text-white"
                : "bg-white/90 text-gray-900"
            }`}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 hover:bg-opacity-10 hover:bg-gray-500 w-full text-left"
            >
              <Pencil size={16} />
              ویرایش
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 hover:bg-opacity-10 hover:bg-red-500 w-full text-left text-red-500"
            >
              <Trash2 size={16} />
              حذف
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileCardVisible && user && (
          <div className="absolute inset-0 z-30">
            <ProfileCard
              user={user}
              onClose={() => setProfileCardVisible(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
