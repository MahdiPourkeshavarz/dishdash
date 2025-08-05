"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";
import { useDeletePost } from "@/hooks/useDeletePost";
import { useEffect, useState } from "react";

export function DeleteConfirmationModal() {
  const { theme, deletingPost, setDeletingPost, deletePost } = useStore();
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useDeletePost();

  const handleDelete = () => {
    if (!deletingPost?._id) return;

    setError(null);

    mutate(deletingPost._id, {
      onSuccess: () => {
        deletePost(deletingPost._id as string);
        setDeletingPost(null);
      },
      onError: (err) => {
        console.error("Deletion failed:", err);
        setError("حدف پست موفقیت آمیز نبود. دوباره امتحان کن");
      },
    });
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <AnimatePresence>
      {deletingPost && (
        <motion.div
          className="fixed inset-0 z-[200000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className={`p-5 rounded-2xl shadow-xl w-full max-w-xs border ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
            dir="rtl"
          >
            <h3
              className={`text-lg font-bold mb-2 text-center ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              آیا از حذف این پست اطمینان دارید؟
            </h3>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-red-500 text-center my-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex justify-center my-2 opacity-80 scale-75">
              <PostCard post={deletingPost} />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeletingPost(null)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  theme === "dark"
                    ? "bg-gray-600 hover:bg-gray-500"
                    : "bg-gray-400 hover:bg-gray-300"
                }`}
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                {isPending ? "در حال حذف..." : "مطمئنم"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
