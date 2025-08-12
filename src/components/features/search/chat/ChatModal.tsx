/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/hooks/useChat";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";
import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, Loader, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BotMessage, BotMessageSkeleton, UserMessage } from "./ChatMessage";
import { ChatMessage } from "@/types";

interface Notification {
  message: string;
  type: "info" | "error";
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose }) => {
  const { theme, chatMessages, addChatMessage } = useStore();
  const [inputText, setInputText] = useState("");
  const { mutate: sendMessage, isPending: isLoading } = useChat();
  const keyboardHeight = useVirtualKeyboard();

  const [notification, setNotification] = useState<Notification | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { sender: "user", text: inputText };
    addChatMessage(userMessage as ChatMessage);

    sendMessage(inputText, {
      onSuccess: (data) => {
        setNotification({
          message: "پاسخ ممکن است کمی طول بکشد...",
          type: "info",
        });
        const processedPlaces = data.places
          ? data.places
              .reduceRight((accumulator: any[], currentPlace: any) => {
                accumulator.push(currentPlace);
                return accumulator;
              }, [])
              .slice(0, 8)
          : [];
        const botMessage = {
          sender: "bot",
          text: data.aiResponse,
          places: processedPlaces,
        };
        addChatMessage(botMessage as ChatMessage);
      },
      onError: (error) => {
        setNotification({
          message: "خطا! لطفا دوباره تلاش کنید.",
          type: "error",
        });
        console.log(error);
      },
    });

    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[4000000] bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 250 }}
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: keyboardHeight }}
            className={`absolute inset-y-10 inset-x-5 rounded-3xl shadow-2xl p-4 border flex flex-col
                        md:inset-auto md:bottom-0 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-md md:h-[85vh] md:rounded-t-3xl md:rounded-b-none
                        backdrop-blur-xl ${
                          theme === "dark"
                            ? "bg-gray-900/70 border-white/10"
                            : "bg-white/70 border-black/10"
                        }`}
          >
            <div className="absolute top-5 left-1/2 -translate-x-1/2">
              <Image src={"/bot.png"} alt="bot" width={100} height={100} />
            </div>
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-end pb-3 mb-3 border-b border-black/10 dark:border-white/10">
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-500 hover:bg-black/10 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <style>
              {`
                .no-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .no-scrollbar {
                  -ms-overflow-style: none;  /* IE and Edge */
                  scrollbar-width: none;  /* Firefox */
                }
              `}
            </style>

            {/* Conversation Area */}
            <div
              ref={chatContainerRef}
              className="no-scrollbar flex-grow overflow-y-auto p-4 space-y-4 mt-7"
            >
              {chatMessages.map((msg, index) =>
                msg.sender === "user" ? (
                  <UserMessage key={index} text={msg.text} />
                ) : (
                  <BotMessage key={index} message={msg} />
                )
              )}
              {isLoading && <BotMessageSkeleton />}
            </div>

            {/* Input Area */}
            <div className="relative flex-shrink-0 py-4">
              <AnimatePresence>
                {notification && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {notification.type === "info" ? (
                      <Info size={14} />
                    ) : (
                      <AlertTriangle size={14} />
                    )}
                    <span>{notification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`flex items-center gap-2 px-2 py-3.5 rounded-full border ${
                  theme === "dark"
                    ? "border-gray-700 text-white"
                    : "border-gray-800 text-black"
                }`}
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="چی دوست داری بخوری"
                  className="flex-grow bg-transparent focus:outline-none resize-none"
                  rows={1}
                  dir="rtl"
                />
                <motion.button
                  onClick={handleSend}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-blue-200 shadow-lg text-white disabled:opacity-50 flex items-center justify-center w-9 h-9"
                  disabled={!inputText.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Image
                      src={"/send.png"}
                      alt="send"
                      width={22}
                      height={22}
                    />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
