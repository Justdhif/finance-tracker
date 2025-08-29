import { motion, AnimatePresence } from "framer-motion";

interface ChatBubbleProps {
  messages: string[];
  currentMessageIndex: number;
  className?: string;
}

export default function ChatBubble({
  messages,
  currentMessageIndex,
  className = "",
}: ChatBubbleProps) {
  return (
    <div
      className={`relative p-3 bg-white rounded-xl shadow-sm border border-blue-100 flex-1 ${className}`}
    >
      {/* Segitiga pointer */}
      <div className="absolute -left-2 top-4 w-0 h-0 border-t-4 border-t-transparent border-r-8 border-r-white border-b-4 border-b-transparent"></div>

      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-sm md:text-base text-gray-700 font-medium"
        >
          {messages[currentMessageIndex]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
