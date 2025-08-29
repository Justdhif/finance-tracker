import { motion } from "framer-motion";

interface AvatarProps {
  className?: string;
}

export default function Avatar({ className = "" }: AvatarProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md cursor-pointer flex-shrink-0 overflow-hidden ${className}`}
    >
      <span className="text-white text-lg md:text-xl font-bold">$</span>

      {/* Efek kilau sesekali */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white opacity-20"
        animate={{ x: [-20, 20] }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 3,
          delay: Math.random() * 2,
        }}
      />
    </motion.div>
  );
}
