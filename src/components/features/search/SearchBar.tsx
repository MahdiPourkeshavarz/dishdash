/* eslint-disable @typescript-eslint/no-unused-vars */
import { AlertCircle, Info, Loader, SearchIcon, X } from "lucide-react";
import { DropdownFilter, FilterOption } from "./DropdownFilter";
import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { AnimatePresence, Variants } from "framer-motion";
import { motion } from "framer-motion";
import { useSearch } from "@/hooks/useSearch";
import { useDebounce } from "@/hooks/useDebounce";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const amenityOptions: FilterOption<string>[] = [
  { value: "restaurant", label: "رستوران" },
  { value: "cafe", label: "کافه" },
  { value: "fast_food", label: "فست فود" },
];

const atmosphereOptions: FilterOption<string>[] = [
  { value: "خوب", label: "خوب" },
  { value: "شیک", label: "شیک" },
];

const distanceOptions: FilterOption<"near" | "walking" | "driving">[] = [
  { value: "near", label: " نزدیک باشه" },
  { value: "walking", label: "پیاده برم" },
  { value: "driving", label: "حال رانندگی دارم" },
];

interface Notification {
  message: string;
  type: "info" | "error";
}

export const SearchBar: React.FC = () => {
  const { theme, setSearchResults, isSearching, clearSearch } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [distance, setDistance] = useState<"near" | "walking" | "driving">(
    "near"
  );
  const [atmosphere, setAtmosphere] = useState("خوب");
  const [amenity, setAmenity] = useState("restaurant");
  const [notification, setNotification] = useState<Notification | null>(null);

  const { mutate: search, isPending: isLoading, error } = useSearch();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim()) {
      search(
        { searchTerm: debouncedSearchTerm, distance, atmosphere, amenity },
        {
          onSuccess: (data) => {
            setSearchResults(data);
            if (data && data.length === 0) {
              setNotification({
                message: "هیچی پیدا نشد",
                type: "info",
              });
            }
          },
          onError: (error) => {
            clearSearch();
            setNotification({
              message: "خطا در جستجو",
              type: "error",
            });
          },
        }
      );
    } else {
      clearSearch();
    }
  }, [
    debouncedSearchTerm,
    distance,
    atmosphere,
    amenity,
    search,
    setSearchResults,
    clearSearch,
  ]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  function handleReset() {
    setSearchTerm("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-[95vw] max-w-lg z-10 p-2"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`backdrop-blur-lg rounded-2xl shadow-lg p-3 space-y-3 border ${
          theme === "dark"
            ? "bg-gray-800/50 border-gray-700/50"
            : "bg-white/80 border-gray-200/50"
        }`}
      >
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearch}
          className="relative w-full"
        >
          <input
            type="text"
            placeholder="دنبال چی میگردی؟"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className={`w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:outline-none text-right ${
              theme === "dark"
                ? "bg-gray-900/50 text-white placeholder:text-gray-400 focus:ring-gray-500"
                : "bg-gray-100/80 text-gray-900 placeholder:text-gray-500 focus:ring-gray-800"
            }`}
            dir="rtl"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <Loader size={20} className="animate-spin" />
            ) : isSearching ? (
              <button
                type="button"
                onClick={handleReset}
                className="p-1 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600"
                aria-label="Clear search"
              >
                <X size={20} />
              </button>
            ) : (
              <SearchIcon size={20} />
            )}
          </div>
        </motion.form>
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between space-x-2 pb-2 -mb-2"
        >
          <DropdownFilter
            options={amenityOptions}
            selectedValue={amenity}
            setSelectedValue={setAmenity}
          />
          <DropdownFilter
            options={atmosphereOptions}
            selectedValue={atmosphere}
            setSelectedValue={setAtmosphere}
          />
          <DropdownFilter
            options={distanceOptions}
            selectedValue={distance}
            setSelectedValue={setDistance}
          />
        </motion.div>
        {error && (
          <p className="text-xs text-red-500 text-center">
            لطفا دوباره جستجو کنید
          </p>
        )}
      </motion.div>
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`absolute top-full mt-2 w-auto left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full shadow-md backdrop-blur-lg ${
              notification.type === "error"
                ? "bg-red-500/80 text-white border border-red-400/50"
                : "bg-blue-500/80 text-white border border-blue-400/50"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle size={14} />
            ) : (
              <Info size={14} />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
