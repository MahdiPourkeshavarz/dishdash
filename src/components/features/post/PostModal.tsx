/* eslint-disable react/jsx-no-undef */
import { useStore } from "@/store/useStore";
import { Post, User } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Image as ImageIcon, Send, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";

type Satisfaction = "awesome" | "good" | "bad" | "";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  postToEdit: Post | null;
}

const modalVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  user,
  postToEdit,
}) => {
  const keyboardHeight = useVirtualKeyboard();
  const [view, setView] = useState<"initial" | "expanded">("initial");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    location: userLocation,
    addPost,
    theme,
    postTargetLocation,
    setPostTargetLocation,
    updatePost,
    setEditingPost,
  } = useStore();

  const positionToUse = postTargetLocation?.coords || userLocation.coords;

  const satisfactionOptions = [
    {
      name: "awesome",
      src: "/awesome.png",
      glow: "drop-shadow-[0_0_8px_rgba(34,197,94,0.7)]",
    },
    {
      name: "good",
      src: "/good.png",
      glow: "drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]",
    },
    {
      name: "bad",
      src: "/bad.png",
      glow: "drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]",
    },
    {
      name: "disgusted",
      src: "/disgusted.png",
      glow: "drop-shadow-[0_0_8px_rgba(147,51,234,0.7)]",
    },
  ];

  useEffect(() => {
    if (postToEdit) {
      setDescription(postToEdit.description);
      setSatisfaction(postToEdit.satisfaction);
      setImagePreview(postToEdit.imageUrl);
      setView("expanded");
    }
  }, [postToEdit]);

  const resetForm = () => {
    setTimeout(() => setView("initial"), 300);
    setImageFile(null);
    setImagePreview(null);
    setDescription("");
    setSatisfaction("");
  };

  const handleClose = () => {
    setPostTargetLocation(null, null);
    resetForm();
    onClose();
    setEditingPost(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setView("expanded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !positionToUse) return;
    if (!imageFile || !description || !satisfaction) {
      alert("Please complete all fields.");
      return;
    }

    if (postToEdit) {
      const updatedPost: Post = {
        ...postToEdit,
        description,
        satisfaction,
        imageUrl: imagePreview || postToEdit.imageUrl,
      };
      updatePost(updatedPost);
    } else {
      const newPost: Post = {
        id: `post_${Date.now()}`,
        user,
        description,
        satisfaction,
        imageUrl: imagePreview || "/food.webp",
        position: positionToUse,
        areaName:
          postTargetLocation?.name || userLocation.areaName || "location",
      };
      addPost(newPost);
    }

    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] pb-22 flex items-end justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            layout
            className="relative w-[95vw] max-w-lg"
            style={{
              marginBottom: keyboardHeight > 0 ? keyboardHeight : "1rem",
            }}
          >
            <motion.button
              onClick={handleClose}
              className={`absolute -top-10 right-0 z-20 transition-colors ${
                theme === "dark"
                  ? "text-white/80 hover:text-white"
                  : "text-gray-900/80 hover:text-black"
              }`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X size={28} />
            </motion.button>

            <div className="relative rounded-3xl">
              <div className="absolute inset-0 bg-gemini-gradient rounded-2xl blur-lg opacity-75" />
              <div
                className={`relative z-10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden ${
                  theme === "dark"
                    ? "bg-gray-900/80 text-white"
                    : "bg-slate-100/90 text-gray-900"
                }`}
              >
                {view === "expanded" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <form
                      id="post-form"
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-3 p-4"
                    >
                      {imagePreview && (
                        <Image
                          src={imagePreview}
                          alt="Post preview"
                          width={500}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="اینجا بنویس ..."
                        className={`w-full p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                          theme === "dark"
                            ? "bg-gray-800/50 placeholder:text-gray-400"
                            : "bg-white/60 placeholder:text-gray-500"
                        }`}
                        rows={3}
                        dir="rtl"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <div
                          className={`flex items-center gap-2 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <MapPin size={16} />
                          <span>
                            {postTargetLocation?.name ||
                              userLocation.areaName ||
                              "Location"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {satisfactionOptions.map((option) => {
                            const isSelected = satisfaction === option.name;
                            return (
                              <motion.button
                                key={option.name}
                                type="button"
                                whileTap={{ scale: 1.2 }}
                                onClick={() =>
                                  setSatisfaction(option.name as Satisfaction)
                                }
                                animate={{ scale: isSelected ? 1.1 : 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <Image
                                  src={option.src}
                                  alt={option.name}
                                  className={`
                                    cursor-pointer transition-all duration-300
                                    ${
                                      isSelected
                                        ? `${option.glow} opacity-100`
                                        : "opacity-60 hover:opacity-100 hover:scale-105"
                                    }
                                  `}
                                  width={40}
                                  height={40}
                                />
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
                <div className="flex items-center gap-2 p-3 py-6">
                  <label htmlFor="image-upload-gemini">
                    <input
                      id="image-upload-gemini"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    <ImageIcon
                      className={`cursor-pointer ${
                        theme === "dark"
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-500 hover:text-black"
                      }`}
                    />
                  </label>
                  <input
                    type="text"
                    placeholder="از تجربه جدیدت برامون بگو 😋"
                    className={`flex-1 bg-transparent focus:outline-none ${
                      theme === "dark"
                        ? "text-white placeholder:text-gray-400"
                        : "text-black placeholder:text-gray-500"
                    }`}
                    onFocus={() => setView("expanded")}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setView("expanded");
                    }}
                    dir="rtl"
                  />
                  <button
                    type="submit"
                    form="post-form"
                    className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Post <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
