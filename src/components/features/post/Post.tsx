import type { Post } from "@/types";
import Image from "next/image";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { useStore } from "@/store/useStoreStore";

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 30, scale: 0.9, rotate: 5 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      mass: 0.5,
      duration: 0.5,
    },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      type: "spring",
      stiffness: 150,
      damping: 20,
    },
  }),
};

const userCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3,
    },
  },
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);

  const { theme } = useStore();

  const cardClasses =
    theme === "dark"
      ? "bg-gray-800/90 text-gray-200 border-gray-700"
      : "bg-white/95 border-gray-100";
  const textClasses = theme === "dark" ? "text-gray-300" : "text-gray-600";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.05, rotate: -2, transition: { duration: 0.2 } }}
      className={`relative w-72 overflow-hidden rounded-2xl backdrop-blur-md shadow-lg border ${cardClasses}`}
      dir="rtl"
    >
      <div className="relative">
        <motion.div variants={childVariants} custom={0}>
          <Image
            src={post.imageUrl}
            alt={post.id}
            className={`mb-3 text-sm leading-relaxed line-clamp-3 ${textClasses}`}
            width={288}
            height={160}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </motion.div>
        <div className="absolute top-2 right-2">
          <motion.button
            variants={childVariants}
            custom={1}
            onClick={() => setIsUserCardOpen(!isUserCardOpen)}
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            aria-label="نمایش اطلاعات کاربر"
          >
            <Image
              src={post.user.imgUrl}
              alt={post.user.username}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/80 shadow-md"
              width={40}
              height={40}
            />
          </motion.button>
        </div>
      </div>

      <div className="p-4 text-right">
        <motion.p
          variants={childVariants}
          custom={3}
          className="mb-3 text-sm text-blue-400 leading-relaxed line-clamp-3"
        >
          {post.description}
        </motion.p>
        <motion.div
          variants={childVariants}
          custom={4}
          className="mt-3 flex justify-end"
        >
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              post.satisfaction === "awesome"
                ? "bg-blue-100 text-blue-700"
                : post.satisfaction === "good"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {post.satisfaction === "awesome"
              ? "عالی"
              : post.satisfaction === "good"
              ? "خوب"
              : "بد"}
          </span>
        </motion.div>
      </div>

      {isUserCardOpen && (
        <motion.div
          variants={userCardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className={`absolute top-12 right-2 z-50 w-48 rounded-xl p-4 shadow-lg backdrop-blur-md border ${cardClasses}`}
        >
          <div className="flex flex-col items-center">
            <Image
              src={post.user.imgUrl}
              alt={post.user.username}
              className="mb-2 h-16 w-16 rounded-full object-cover border-2 border-blue-200"
              width={64}
              height={64}
            />
            <p className="text-sm font-medium text-gray-800">
              {post.user.username}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PostCard;
