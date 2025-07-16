"use client";

import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import PostCard from "./PostCard";

export function DeleteConfirmationModal() {
  const { theme, deletingPost, setDeletingPost, deletePost } = useStore();

  const handleDelete = () => {
    if (deletingPost) {
      deletePost(deletingPost.id);
      setDeletingPost(null);
    }
  };

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
                className="px-6 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
              >
                مطمعنم
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
