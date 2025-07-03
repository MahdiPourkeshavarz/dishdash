import type { Post } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);

  return (
    <div
      className="relative w-72 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-right"
      dir="rtl"
    >
      <div className="relative">
        <Image
          src={post.imageUrl}
          alt={post.id}
          className="h-40 w-full object-cover rounded-t-2xl"
          width={288}
          height={160}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute top-2 right-2">
          <button onClick={() => setIsUserCardOpen(!isUserCardOpen)}>
            <Image
              src={post.user.imgUrl}
              alt={post.user.username}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/80 shadow-md"
              width={40}
              height={40}
            />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="mb-3 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {post.description}
        </p>
        <div className="mt-3 flex justify-end">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
              post.satisfaction === "awesome"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {post.satisfaction === "awesome" ? "عالی" : "معمولی"}
          </span>
        </div>
      </div>

      {isUserCardOpen && (
        <div className="absolute top-12 right-2 z-50 w-48 rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 p-4">
          <div className="flex flex-col items-center">
            <Image
              src={post.user.imgUrl}
              alt={post.user.username}
              className="h-16 w-16 rounded-full object-cover border-2 border-blue-200 mb-2"
              width={64}
              height={64}
            />
            <p className="text-sm font-medium text-gray-800">
              {post.user.username}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
