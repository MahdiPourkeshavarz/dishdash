/* eslint-disable react/jsx-no-undef */
import { useStore } from "@/store/useStore";
import { Post } from "@/types";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Image as ImageIcon, Send, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";
import { usePostForm } from "@/hooks/usePostForm";
import { useNearbyPoiCheck } from "@/hooks/useNearbyPoiCheck";
type Satisfaction = "awesome" | "good" | "bad" | "";

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postToEdit: Post | null;
}

const modalVariants: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export const PostModal: React.FC<PostModalProps> = ({
  isOpen,
  onClose,
  postToEdit,
}) => {
  const keyboardHeight = useVirtualKeyboard();
  const {
    location: userLocation,
    theme,
    postTargetLocation,
    setPostTargetLocation,
    setEditingPost,
  } = useStore();

  const {
    poiToConfirm,
    confirmPoi,
    rejectPoi,
    reset: resetPoiCheck,
  } = useNearbyPoiCheck({
    location: userLocation.coords
      ? { lat: userLocation.coords[0], lng: userLocation.coords[1] }
      : null,
    enabled: isOpen && !postToEdit && !postTargetLocation,
  });

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

  const handleClose = () => {
    setPostTargetLocation(null);
    setEditingPost(null);
    onClose();
  };

  const handleManualClose = () => {
    resetForm();
    handleClose();
    resetPoiCheck();
  };

  const {
    view,
    imagePreview,
    description,
    satisfaction,
    isClassifying,
    isSubmitting,
    fileInputRef,
    setView,
    setDescription,
    setSatisfaction,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = usePostForm({ postToEdit, onSuccess: handleManualClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] pb-22 flex items-end justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleManualClose}
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
              onClick={handleManualClose}
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
                          {poiToConfirm ? (
                            <div className="flex flex-col items-center animate-pulse pt-4">
                              <span>
                                Are you at{" "}
                                <strong>{poiToConfirm.tags?.name}</strong>?
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={confirmPoi}
                                  className="px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
                                >
                                  Yes
                                </button>
                                <button
                                  type="button"
                                  onClick={rejectPoi}
                                  className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-300 rounded-full hover:bg-gray-400"
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span>
                              {postTargetLocation?.name ||
                                postToEdit?.areaName ||
                                userLocation.areaName ||
                                "Location"}
                            </span>
                          )}
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
                      disabled={postToEdit ? true : false}
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
                    {isSubmitting
                      ? "Posting..."
                      : isClassifying
                      ? "Analyzing..."
                      : "Post"}
                    <Send size={16} />
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
