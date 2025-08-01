import { useClickOutside } from "@/hooks/useClickOutside";
import { useStore } from "@/store/useStore";
import { ChevronDown } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterOption<T> {
  value: T;
  label: string;
}

interface DropdownFilterProps<T extends string> {
  options: FilterOption<T>[];
  selectedValue: T;
  setSelectedValue: Dispatch<SetStateAction<T>>;
}

export const DropdownFilter = <T extends string>({
  options,
  selectedValue,
  setSelectedValue,
}: DropdownFilterProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { theme } = useStore();
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 text-xs font-bold rounded-full transition-colors duration-200 flex items-center gap-2 ${
          theme === "dark"
            ? "bg-gray-700/50 text-gray-200 hover:bg-gray-600/50"
            : "bg-gray-100/50 text-gray-700 hover:bg-gray-200/80"
        }`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full font-bold right-0 mt-2 w-[135px] rounded-xl shadow-lg border backdrop-blur-lg z-20 ${
              theme === "dark"
                ? "bg-gray-900/80 border-gray-700/50"
                : "bg-white/80 border-gray-200/50"
            }`}
          >
            <ul className="p-2">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedValue(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 text-sm rounded-md transition-colors ${
                      theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700/80"
                        : "text-gray-700 hover:bg-gray-200/80"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
