"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { Loader, CheckCircle, AlertTriangle } from "lucide-react";

export const UploadNotifier = () => {
  const { uploadStatus, setUploadStatus } = useStore();

  const statusInfo = {
    classifying: {
      icon: <Loader size={16} className="animate-spin" />,
      text: "در حال ایجاد پست",
    },
    uploading: {
      icon: <Loader size={16} className="animate-spin" />,
      text: "در حال ایجاد پست",
    },
    success: { icon: <CheckCircle size={16} />, text: "Post successful!" },
    error: { icon: <AlertTriangle size={16} />, text: "Upload failed." },
  };

  useEffect(() => {
    if (uploadStatus === "success" || uploadStatus === "error") {
      const timer = setTimeout(() => {
        setUploadStatus("idle");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadStatus, setUploadStatus]);

  const isVisible =
    uploadStatus === "classifying" ||
    uploadStatus === "uploading" ||
    uploadStatus === "success" ||
    uploadStatus === "error";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300000] flex items-center gap-3 px-4 py-2 rounded-full shadow-lg text-sm font-semibold bg-gray-800/80 text-white backdrop-blur-md border border-white/10"
        >
          {statusInfo[uploadStatus].icon}
          <span>{statusInfo[uploadStatus].text}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
