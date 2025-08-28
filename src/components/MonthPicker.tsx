"use client";

import React from "react";
import { setMonth, setYear, getYear, getMonth } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

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
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute w-80 top-16 left-1/2 transform -translate-x-1/2 z-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          {/* Year Section */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 pl-1">
              Year
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
              Month
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
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MonthPicker;
