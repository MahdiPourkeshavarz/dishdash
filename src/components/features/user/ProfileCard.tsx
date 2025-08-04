import { User } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useStore } from "@/store/useStore";

interface ProfileCardProps {
  user: User;
  onClose: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onClose }) => {
  const { theme } = useStore();

  return (
    <AnimatePresence>
      <motion.div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className={`w-[120px] rounded-3xl p-4 flex flex-col items-center gap-2 border shadow-2xl ${
            theme === "dark"
              ? "bg-gray-800/90 border-white/10"
              : "bg-white/95 border-black/10"
          }`}
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <Image
            src={user?.image || "/user-photo.jpg"}
            alt={user?.username || "user"}
            width={64}
            height={64}
            className="rounded-full object-cover ring-2 ring-white/20 shadow-lg"
          />
          <p
            className={`text-base font-bold truncate w-full text-center ${
              theme === "dark" ? "text-white" : "text-black"
            }`}
          >
            {user?.username}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCard;
