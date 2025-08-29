"use client";

import React, { useEffect, useRef, useState } from "react";
import { setMonth, setYear, getYear, getMonth } from "date-fns";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface MonthPickerProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({
  currentMonth,
  onMonthChange,
  isOpen,
  onClose,
}) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const formRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Handle mount/unmount based on isOpen state
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  // Close on escape key press and prevent body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Hanya prevent scroll di mobile
      if (window.innerWidth < 768) {
        document.body.style.overflow = "hidden";
      }
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(currentMonth, monthIndex);
    onMonthChange(newDate);
    onClose();
  };

  const handleYearSelect = (year: number) => {
    const newDate = setYear(currentMonth, year);
    onMonthChange(newDate);
  };

  // Generate recent years for year selector
  const currentYear = getYear(currentMonth);
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleExitComplete = () => {
    setIsMounted(false);
  };

  if (!isMounted && !isOpen) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <>
          {/* Backdrop - hanya untuk mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={handleBackdropClick}
          />

          {/* Desktop version (original design) */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden md:block absolute w-80 top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            {/* Year Section */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-1">
                Tahun
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`p-2 text-xs rounded-md transition-all duration-200 ${
                      year === currentYear
                        ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white font-medium shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>

            {/* Month Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-1">
                Bulan
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {monthNames.map((month, index) => (
                  <button
                    key={month}
                    onClick={() => handleMonthSelect(index)}
                    className={`p-3 text-sm rounded-lg transition-all duration-200 flex items-center justify-center ${
                      index === getMonth(currentMonth) &&
                      getYear(currentMonth) === currentYear
                        ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white font-medium shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {month.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
              <Button
                onClick={onClose}
                variant="destructive"
                className="w-full py-2 text-sm"
              >
                Tutup
              </Button>
            </div>
          </motion.div>

          {/* Mobile version - full screen popup with drag */}
          <motion.div
            ref={formRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            dragElastic={{ top: 0, bottom: 0.2 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl max-h-[85vh] overflow-hidden"
          >
            {/* Drag handle */}
            <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none">
              <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pilih Bulan & Tahun
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Konten dengan scrollbar yang dihilangkan di mobile */}
            <div
              className="overflow-y-auto max-h-[calc(85vh-60px)] p-4 pb-8
              md:scrollbar-thin md:scrollbar-thumb-gray-300 md:scrollbar-track-gray-100
              md:dark:scrollbar-thumb-gray-600 md:dark:scrollbar-track-gray-800
              [-ms-overflow-style:none] [scrollbar-width:none] 
              [&::-webkit-scrollbar]:hidden"
            >
              {/* Year Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 pl-1">
                  Tahun
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {years.map((year) => (
                    <button
                      key={year}
                      onClick={() => handleYearSelect(year)}
                      className={`p-3 text-sm rounded-lg transition-all duration-200 ${
                        year === currentYear
                          ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white font-medium shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 pl-1">
                  Bulan
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {monthNames.map((month, index) => (
                    <button
                      key={month}
                      onClick={() => handleMonthSelect(index)}
                      className={`p-4 text-sm rounded-lg transition-all duration-200 flex items-center justify-center ${
                        index === getMonth(currentMonth) &&
                        getYear(currentMonth) === currentYear
                          ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white font-medium shadow-md"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {month.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <Button
                onClick={onClose}
                className="w-full py-3 text-base font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white"
              >
                Tutup
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MonthPicker;
