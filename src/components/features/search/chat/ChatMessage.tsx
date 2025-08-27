"use client";

import { motion } from "framer-motion";
import { useStore } from "@/store/useStore";
import Image from "next/image";
import { ChatMessage, Poi } from "@/types";
import { LinkedMessageContent } from "./LinkedMessageContent";

// const PlaceSuggestionCard = ({ place }: { place: Poi }) => {
//   const { theme } = useStore();
//   const positionToUse: [number, number] = place.position
//     ? [place.position[0], place.position[1]]
//     : [place.lat, place.lon];

//   return (
//     <div
//       className={`flex items-center justify-between p-2 rounded-xl border ${
//         theme === "dark"
//           ? "bg-gray-800/50 border-white/10"
//           : "bg-white/50 border-black/10"
//       }`}
//     >
//       <div className="flex-shrink-0">
//         <DirectionsMenu destination={positionToUse} />
//       </div>
//       <div className="flex flex-col items-end">
//         <p
//           className={`font-semibold text-xs truncate ${
//             theme === "dark" ? "text-white" : "text-black"
//           }`}
//         >
//           {place.name}
//         </p>
//         <div className="flex items-center gap-1 text-xs text-gray-400">
//           <Star size={12} className="text-yellow-400" fill="currentColor" />
//           <span className="font-medium">
//             {place.averageRating ? place.averageRating.toFixed(1) : "New"}
//           </span>
//           <span>({place.ratingCount || 0})</span>
//         </div>
//       </div>
//     </div>
//   );
// };

interface BotMessageProps {
  message: ChatMessage;
  onPlaceClick: (place: Poi) => void;
}

export const BotMessage: React.FC<BotMessageProps> = ({
  message,
  onPlaceClick,
}) => {
  const { theme } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3"
    >
      <div className="flex-shrink-0 w-8 h-8">
        <Image
          src="/bot.png"
          alt="Bot"
          width={32}
          height={32}
          className="w-full h-full object-contain"
        />
      </div>
      <div
        className={`w-full p-3 rounded-2xl rounded-bl-none space-y-3 ${
          theme === "dark"
            ? "bg-gray-700 text-gray-200"
            : "bg-gray-200 text-gray-800"
        }`}
      >
        <LinkedMessageContent
          text={message.text}
          places={message.places || []}
          onPlaceClick={onPlaceClick}
        />
      </div>
    </motion.div>
  );
};

export const UserMessage = ({ text }: { text: string }) => {
  const { user } = useStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 justify-end"
    >
      <div className="bg-blue-500 text-white p-3 rounded-2xl rounded-br-none max-w-xs">
        <p>{text}</p>
      </div>
      <Image
        src={user?.image || "/user-photo.jpg"}
        alt="User"
        width={32}
        height={32}
        className="rounded-full"
      />
    </motion.div>
  );
};

export const BotMessageSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <Image src="/bot.png" alt="Bot" width={32} height={32} />
      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none">
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-gray-400 rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};
