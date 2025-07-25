import { User } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useStore } from "@/store/useStore";

interface ProfileCardProps {
  user: User;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClose }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { theme } = useStore();

  useClickOutside(cardRef, onClose);

  return (
    <motion.div
      onClick={onClose}
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-3 p-4 rounded-2xl shadow-2xl bg-gray-700/80 border border-gray-500"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <Image
          src={user?.image || "/user-photo.jpg"}
          alt={user?.username || "user"}
          width={80}
          height={80}
          className={`rounded-full object-cover border-4 ${
            theme === "dark" ? "border-gray-300" : "border-gray-500"
          }`}
        />
        <p className="text-lg font-bold text-white">{user?.username}</p>
      </motion.div>
    </motion.div>
  );
};

export default ProfileCard;
