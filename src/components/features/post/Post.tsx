import type { Post } from "@/types";
import Image from "next/image";
import { useStore } from "@/store/useStoreStore";

const satisfactionStyles = {
  awesome: {
    bgColor: "bg-blue-500",
    text: "Awesome!",
    emoji: "/awesome.png",
  },
  good: {
    bgColor: "bg-green-500",
    text: "Good",
    emoji: "/good.png",
  },
  bad: {
    bgColor: "bg-red-500",
    text: "Bad",
    emoji: "/bad.png",
  },
};

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { theme } = useStore();
  const styles = satisfactionStyles[post.satisfaction];

  return (
    <div
      className={`w-full max-w-xs overflow-hidden rounded-lg shadow-xl ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
      dir="rtl"
    >
      <div className="relative w-full h-40">
        <Image
          src={post.imageUrl}
          alt={post.id}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2">
          <Image
            src={post.user.imgUrl}
            alt={post.user.username}
            width={32}
            height={32}
            className={`rounded-full object-cover border-2 shadow-md ${
              theme === "dark" ? "border-gray-400" : "border-gray-200"
            }`}
          />
        </div>
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center gap-2 p-2 ${styles.bgColor} bg-opacity-80 backdrop-blur-sm`}
        >
          <Image
            src={styles.emoji}
            alt={post.satisfaction}
            width={24}
            height={24}
          />
          <span className="text-white text-sm font-bold">{styles.text}</span>
        </div>
      </div>
      <div className="px-3 py-2 text-right">
        <p
          className={`text-sm leading-relaxed ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {post.description}
        </p>
        <p
          className={`text-xs font-semibold mt-1 ${
            theme === "dark" ? "text-gray-400" : "text-gray-500"
          }`}
        >
          - {post.user.username}
        </p>
      </div>
    </div>
  );
};

export default PostCard;
