import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HighlightLabelProps {
  name: string;
}

export const HighlightLabel: React.FC<HighlightLabelProps> = ({ name }) => {
  return (
    <motion.div
      className="flex flex-col items-center z-[100000]"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="bg-yellow-900/80 text-yellow-200 z-[100000] border border-yellow-700/50 rounded-lg px-3 py-1 text-sm font-bold shadow-lg backdrop-blur-sm whitespace-nowrap">
        {name}
      </div>
      <ChevronDown
        size={24}
        className="text-yellow-700/80 -mt-1 drop-shadow-lg"
      />
    </motion.div>
  );
};
