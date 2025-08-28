"use client";

import React from "react";
import { setMonth, setYear, getYear, getMonth } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

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
  const years = Array.from({ length: 12 }, (_, i) => currentYear - 5 + i);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute w-full top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-6 gap-2 mb-4">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`p-2 text-sm rounded-md transition-colors ${
                  year === currentYear
                    ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:text-white dark:hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] shadow-md hover:shadow-lg transition-all"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-6 gap-2">
            {monthNames.map((month, index) => (
              <button
                key={month}
                onClick={() => handleMonthSelect(index)}
                className={`p-2 text-sm rounded-md transition-colors ${
                  index === getMonth(currentMonth)
                    ? "bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:text-white dark:hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] shadow-md hover:shadow-lg transition-all"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {month.substring(0, 3)}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonthPicker;
