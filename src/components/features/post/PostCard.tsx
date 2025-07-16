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
} from "lucide-react";
import ProfileCard from "../user/ProfileCard";
import { DirectionsPill } from "./DirectionPill";

const satisfactionStyles = {
  awesome: {
    badge: "bg-yellow-100 text-yellow-800",
    badgeDark: "bg-yellow-900/50 text-yellow-300",
    text: "!Awesome",
    emoji: "/awesome.png",
    bgGradientLight: "bg-gradient-to-t from-amber-400/60 to-gray-50",
    bgGradientDark: "bg-gradient-to-t from-amber-500/40 to-gray-800",
  },
  good: {
    badge: "bg-green-100 text-green-800",
    badgeDark: "bg-green-900/50 text-green-300",
    text: "Good",
    emoji: "/good.png",
    bgGradientLight: "bg-gradient-to-t from-green-400/70 to-gray-50",
    bgGradientDark: "bg-gradient-to-t from-green-500/50 to-gray-800",
  },
  bad: {
    badge: "bg-red-100 text-red-800",
    badgeDark: "bg-red-900/50 text-red-300",
    text: "Bad",
    emoji: "/bad.png",
    bgGradientLight: "bg-gradient-to-t from-red-400/70 to-gray-50",
    bgGradientDark: "bg-gradient-to-t from-red-500/50 to-gray-800",
  },
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme, setEditingPost, togglePostModal, setDeletingPost } =
    useStore();
  const styles = satisfactionStyles[post.satisfaction];
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);
  const [isDirectionsPillOpen, setDirectionsPillOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const isOwnPost = true;
  // currentUser?.id === post.user.id;
  const [vote, setVote] = useState<"like" | "dislike" | null>(null);
  const [likeCount, setLikeCount] = useState(132);
  const [dislikeCount, setDislikeCount] = useState(12);
  const handleLike = () => {
    if (vote === "like") {
      setVote(null);
      setLikeCount(likeCount - 1);
    } else {
      if (vote === "dislike") setDislikeCount(dislikeCount - 1);
      setVote("like");
      setLikeCount(likeCount + 1);
    }
  };

  const handleDislike = () => {
    if (vote === "dislike") {
      setVote(null);
      setDislikeCount(dislikeCount - 1);
    } else {
      if (vote === "like") setLikeCount(likeCount - 1);
      setVote("dislike");
      setDislikeCount(dislikeCount + 1);
    }
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

  return (
    <div className="relative w-full max-w-sm pt-7" onClick={handleCardClick}>
      <div className="h-21" aria-hidden />
      <div
        className={`relative z-10 rounded-xl shadow-lg pb-2 px-4 flex flex-col ${
          theme === "dark" ? styles.bgGradientDark : styles.bgGradientLight
        }`}
      >
        <div className="flex flex-col mt-8 pt-6 text-right">
          <p
            className={`text-base font-bold leading-tight break-words overflow-hidden ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {post.description}
          </p>
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
              post={post}
              isOpen={isDirectionsPillOpen}
              setIsOpen={setDirectionsPillOpen}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute z-20 top-0 left-1/2 -translate-x-1/2 w-11/12 h-40 rounded-xl shadow-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.id}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <motion.button
            onClick={() => setProfileCardVisible(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`View profile of ${post.user.username}`}
          >
            <Image
              src={post.user.imgUrl}
              alt={post.user.username}
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

        <motion.div
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center ${
            post.satisfaction === "awesome" ? "bottom-2.5" : ""
          }`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <Image
            src={styles.emoji}
            alt={post.satisfaction}
            width={post.satisfaction === "awesome" ? 47 : 70}
            height={47}
            className="drop-shadow-lg"
            style={{
              width:
                post.satisfaction === "good"
                  ? 77
                  : post.satisfaction === "awesome"
                  ? 47
                  : 67,
            }}
          />
        </motion.div>
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
        {isProfileCardVisible && (
          <div className="absolute inset-0 z-30">
            <ProfileCard
              user={post.user}
              onClose={() => setProfileCardVisible(false)}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
