import { useStore } from "@/store/useStore";
import type { Post } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../user/ProfileCard";

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
    bgGradientLight: "bg-gradient-to-t from-green-400/60 to-gray-50",
    bgGradientDark: "bg-gradient-to-t from-green-500/40 to-gray-800",
  },
  bad: {
    badge: "bg-red-100 text-red-800",
    badgeDark: "bg-red-900/50 text-red-300",
    text: "Bad",
    emoji: "/bad.png",
    bgGradientLight: "bg-gradient-to-t from-red-400/60 to-gray-50",
    bgGradientDark: "bg-gradient-to-t from-red-500/40 to-gray-800",
  },
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useStore();
  const styles = satisfactionStyles[post.satisfaction];
  const [isProfileCardVisible, setProfileCardVisible] = useState(false);

  return (
    <div className="relative w-full max-w-xs pt-10">
      <div
        className={`rounded-xl shadow-lg pt-20 pb-2 px-4 ${
          theme === "dark" ? styles.bgGradientDark : styles.bgGradientLight
        }`}
      >
        <div className="flex flex-col gap-2 text-right">
          <div className="flex items-center gap-2 justify-end">
            <span
              className={`text-sm font-semibold ${
                theme === "dark" ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {post.user.username}
            </span>
          </div>

          <p
            className={`text-base font-bold leading-tight ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            {post.description}
          </p>
          <div className="flex justify-start pt-1">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-lg font-bold ${
                theme === "dark" ? styles.badgeDark : styles.badge
              }`}
            >
              <Image
                src={styles.emoji}
                alt={post.satisfaction}
                width={28}
                height={28}
              />
              <span>{styles.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-11/12 h-40 rounded-xl shadow-lg overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.id}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2">
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
        </div>
      </div>

      <AnimatePresence>
        {isProfileCardVisible && (
          <ProfileCard
            user={post.user}
            onClose={() => setProfileCardVisible(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default PostCard;
