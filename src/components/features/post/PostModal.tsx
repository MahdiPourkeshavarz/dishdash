/* eslint-disable react/jsx-no-undef */
import { User } from "@/types";
import { Variants, motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface Post {
  user: User;
  description: string;
  id: string;
  satisfaction: "awesome" | "good" | "bad";
  imageUrl: string;
  position: [number, number];
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, "id">) => void; // Callback for submission
  user: User | null; // Current user (from auth)
}

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      duration: 0.3,
    },
  },
};

const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [satisfaction, setSatisfaction] = useState<
    "awesome" | "good" | "bad" | ""
  >("");
  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("لطفاً ابتدا وارد شوید");
      return;
    }
    if (!imageFile || !description || !satisfaction) {
      alert("لطفاً تصویر، توضیحات و وضعیت را وارد کنید");
      return;
    }
    onSubmit({
      user,
      description,
      satisfaction,
      imageUrl: imagePreview || "/default-post.jpg",
      position: [35.6892, 51.389], // Mock position (replace with actual, e.g., map click)
    });
    setImageFile(null);
    setImagePreview(null);
    setDescription("");
    setSatisfaction("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        ref={modalRef}
        className="w-[90vw] max-w-[400px] rounded-xl bg-white/95 backdrop-blur-md shadow-lg border border-gray-100 p-4 sm:p-6"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-gray-600 hover:text-gray-800"
          aria-label="بستن"
        >
          <X className="h-5 w-5" />
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 pt-6 sm:pt-0"
        >
          {/* Image Input */}
          <label
            htmlFor="image-upload"
            className="relative flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="پیش‌نمایش تصویر"
                className="h-full w-full object-cover rounded-lg"
                width={400}
                height={128}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <Upload className="h-8 w-8" />
                <span className="text-xs sm:text-sm">
                  تصویر را انتخاب کنید یا بکشید
                </span>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
          </label>
          {imagePreview && (
            <div className="flex justify-end">
              <Image
                src={imagePreview}
                alt="پیش‌نمایش کوچک"
                className="h-16 w-16 rounded-md object-cover border border-gray-200"
                width={64}
                height={64}
              />
            </div>
          )}

          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => {
                if (e.target.value.length <= 250) {
                  setDescription(e.target.value);
                }
              }}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-800 resize-none"
              rows={4}
              placeholder="توضیحات (حداکثر ۲۵۰ کاراکتر)"
              dir="rtl"
            />
            <span className="absolute bottom-2 left-2 text-xs text-gray-500">
              {description.length}/250
            </span>
          </div>

          <select
            value={satisfaction}
            onChange={(e) =>
              setSatisfaction(e.target.value as "awesome" | "good" | "bad")
            }
            className="rounded-lg border border-gray-200 p-3 text-sm text-gray-800"
            dir="rtl"
          >
            <option value="" disabled>
              وضعیت را انتخاب کنید
            </option>
            <option value="awesome">عالی</option>
            <option value="good">خوب</option>
            <option value="bad">بد</option>
          </select>

          <motion.button
            type="submit"
            className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 text-sm font-semibold text-white hover:from-blue-700 hover:to-blue-500 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ارسال پست
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PostModal;
