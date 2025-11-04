/* eslint-disable @typescript-eslint/no-explicit-any */
import { useChat } from "@/hooks/useChat";
import { useVirtualKeyboard } from "@/hooks/useVirtualKeyboard";
import { useStore } from "@/store/useStore";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info, Loader, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BotMessage, BotMessageSkeleton, UserMessage } from "./ChatMessage";
import { ChatMessage, Poi } from "@/types";

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
  const [showGreeting, setShowGreeting] = useState(true);

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

  useEffect(() => {
    if (isOpen && chatMessages.length === 0) {
      setShowGreeting(true);
    } else {
      setShowGreeting(false);
    }
  }, [isOpen, chatMessages.length]);

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = { sender: "user", text: inputText };
    addChatMessage(userMessage as ChatMessage);

    setNotification({
      message: "پاسخ ممکن است کمی طول بکشد",
      type: "info",
    });

    sendMessage(inputText, {
      onSuccess: (data) => {
        const botMessage = {
          sender: "bot",
          text: data.aiResponse,
          places: data.places,
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

  function handlePlaceClick(poi: Poi) {
    console.log(poi);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[4000000] bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: keyboardHeight }}
            className={`absolute inset-x-4 top-4 bottom-4 rounded-3xl shadow-2xl flex flex-col overflow-hidden
                        md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:h-[85vh]
                        ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800"
                            : "bg-gradient-to-br from-white via-gray-50 to-gray-100"
                        }`}
          >
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <motion.div
                animate={{
                  backgroundPosition: ["0% 0%", "100% 100%"],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 80%, rgba(74, 144, 226, 0.3), transparent 50%)",
                  backgroundSize: "200% 200%",
                }}
              />
            </div>

            {/* Header */}
            <div className="relative flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Image
                    src={"/bot.png"}
                    alt="bot"
                    width={40}
                    height={40}
                    className="drop-shadow-lg"
                  />
                </motion.div>
                <div>
                  <h3
                    className={`font-bold text-lg ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    دیش دش
                  </h3>
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    دستیار هوشمند شما
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  theme === "dark"
                    ? "hover:bg-white/10 text-gray-400"
                    : "hover:bg-black/5 text-gray-600"
                }`}
              >
                <X size={22} />
              </motion.button>
            </div>

            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
              .no-scrollbar {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Conversation Area */}
            <div
              ref={chatContainerRef}
              className="relative no-scrollbar flex-grow overflow-y-auto px-6 py-4"
            >
              {/* Greeting Animation */}
              <AnimatePresence>
                {showGreeting && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="text-center space-y-6 max-w-md px-8">
                      {/* Animated Sparkles */}
                      <motion.div
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="relative mx-auto w-20 h-20"
                      >
                        <Sparkles
                          className={`w-full h-full ${
                            theme === "dark" ? "text-blue-400" : "text-blue-500"
                          }`}
                        />
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-blue-400 rounded-full blur-xl opacity-30"
                        />
                      </motion.div>

                      {/* Greeting Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.h2
                          className={`text-3xl font-bold mb-3 bg-gradient-to-r ${
                            theme === "dark"
                              ? "from-blue-400 via-purple-400 to-pink-400"
                              : "from-blue-600 via-purple-600 to-pink-600"
                          } bg-clip-text text-transparent`}
                          animate={{
                            backgroundPosition: ["0%", "100%"],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          style={{
                            backgroundSize: "200% auto",
                          }}
                        >
                          !من دیش دش هستم
                        </motion.h2>
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className={`text-lg ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          !بگو چی هوس کردی تا برات پیدا کنم
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages */}
              <motion.div
                initial={false}
                animate={{
                  opacity: showGreeting ? 0 : 1,
                }}
                className="space-y-4"
              >
                {chatMessages.map((msg, index) =>
                  msg.sender === "user" ? (
                    <UserMessage key={index} text={msg.text} />
                  ) : (
                    <BotMessage
                      key={index}
                      message={msg}
                      onPlaceClick={handlePlaceClick}
                    />
                  )
                )}
                {isLoading && <BotMessageSkeleton />}
              </motion.div>
            </div>

            {/* Input Area */}
            <div className="relative flex-shrink-0 px-6 py-4 border-t border-white/10">
              <AnimatePresence>
                {notification && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-xl ${
                      theme === "dark"
                        ? "bg-gray-800/90 text-white border border-white/10"
                        : "bg-white/90 text-gray-900 border border-black/10"
                    }`}
                  >
                    {notification.type === "info" ? (
                      <Info size={16} className="text-blue-500" />
                    ) : (
                      <AlertTriangle size={16} className="text-red-500" />
                    )}
                    <span>{notification.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                className={`flex items-center gap-3 px-5 py-3 rounded-full transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-white/5 border border-white/10 hover:bg-white/10 focus-within:bg-white/10 focus-within:border-blue-500/50"
                    : "bg-black/5 border border-black/10 hover:bg-black/10 focus-within:bg-black/10 focus-within:border-blue-500/50"
                }`}
              >
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="چی دوست داری بخوری؟"
                  className={`flex-grow bg-transparent focus:outline-none resize-none placeholder:text-sm ${
                    theme === "dark"
                      ? "text-white placeholder:text-gray-500"
                      : "text-gray-900 placeholder:text-gray-400"
                  }`}
                  rows={1}
                  dir="rtl"
                />
                <motion.button
                  onClick={handleSend}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10 transition-all"
                  disabled={!inputText.trim() || isLoading}
                >
                  {isLoading ? (
                    <Loader size={20} className="animate-spin text-white" />
                  ) : (
                    <Image
                      src={"/send.png"}
                      alt="send"
                      width={20}
                      height={20}
                      className="brightness-0 invert"
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
