/* eslint-disable react/jsx-no-undef */
import { useStore } from "@/store/useStoreStore";
import { Post, User } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Image as ImageIcon, Send, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";

// Define custom types for satisfaction
type Satisfaction = "awesome" | "good" | "bad" | "";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: Omit<Post, "id" | "user"> & { user: User }) => void;
  user: User | null;
}

// Animation variants for sliding up from the bottom
const modalVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  user,
}) => {
  const keyboardHeight = useVirtualKeyboard();
  const [view, setView] = useState<"initial" | "expanded">("initial");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [satisfaction, setSatisfaction] = useState<Satisfaction>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { location } = useStore();

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
  ];

  const resetForm = () => {
    // Delay resetting the view to allow the exit animation to complete smoothly
    setTimeout(() => setView("initial"), 300);
    setImageFile(null);
    setImagePreview(null);
    setDescription("");
    setSatisfaction("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
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
    if (!user || !location.coords) return;
    if (!imageFile || !description || !satisfaction) {
      alert("Please complete all fields.");
      return;
    }
    onSubmit({
      user,
      description,
      satisfaction,
      imageUrl: imagePreview!,
      position: location.coords,
    });
    handleClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center bg-black/50"
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
              className="absolute -top-10 right-0 text-white/80 hover:text-white z-20"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X size={24} />
            </motion.button>

            <div className="relative rounded-2xl">
              <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,#F4B400_0deg,#9B59B6_120deg,#4285F4_240deg,#F4B400_360deg)] rounded-2xl blur-lg opacity-75" />
              <div className="relative z-10 bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-2xl overflow-hidden">
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
                        className="w-full bg-gray-800/50 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={3}
                        dir="rtl"
                      />
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={16} />
                          <span>{location.areaName || "Location"}</span>
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
                                  width={option.name === "bad" ? 28 : 40}
                                  height={option.name === "bad" ? 28 : 40}
                                />
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 p-3">
                  <label htmlFor="image-upload-gemini">
                    <input
                      id="image-upload-gemini"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                    <ImageIcon className="text-gray-400 hover:text-white cursor-pointer" />
                  </label>
                  <input
                    type="text"
                    placeholder="از تجربه جدیدت برامون بگو 😋"
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    onFocus={() => setView("expanded")}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setView("expanded");
                    }}
                    dir="rtl"
                  />
                  {/* ✅ The Post Button is now here */}
                  <button
                    type="submit"
                    form="post-form" // This links the button to the form
                    className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-500"
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
