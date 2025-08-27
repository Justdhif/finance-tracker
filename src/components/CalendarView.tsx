"use client";

import React, { useState } from "react";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  addMonths,
} from "date-fns";
import { Transaction } from "@/models/Transaction";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  currentMonth: Date;
  transactions: Transaction[];
  selectedDate?: Date | null;
  onDateClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
};

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export default function CalendarView({
  currentMonth,
  transactions,
  selectedDate,
  onDateClick,
  onMonthChange,
}: Props) {
  const [direction, setDirection] = useState(0); // 0: no animation, -1: left, 1: right

  const monthStart = startOfMonth(currentMonth);
  const rangeStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEnd = endOfMonth(currentMonth);
  const rangeEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: rangeStart, end: rangeEnd });

  const txByDate = (date: Date) =>
    transactions.filter(
      (t) =>
        format(new Date(t.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );

  const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => {
    setDirection(-1);
    const prevMonth = addMonths(currentMonth, -1);
    setTimeout(() => onMonthChange(prevMonth), 300);
  };

  const handleNextMonth = () => {
    setDirection(1);
    const nextMonth = addMonths(currentMonth, 1);
    setTimeout(() => onMonthChange(nextMonth), 300);
  };

  // Variants for month title animation
  const monthTitleVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  // Variants for calendar grid animation
  const calendarGridVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
    center: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    }),
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 md:p-4 overflow-x-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrevMonth}
          className="p-1 md:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </motion.button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.h2
            key={format(currentMonth, "MMMM yyyy")}
            custom={direction}
            variants={monthTitleVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl font-bold text-gray-800 dark:text-white min-w-[150px] text-center"
          >
            {format(currentMonth, "MMMM yyyy")}
          </motion.h2>
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNextMonth}
          className="p-1 md:p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 text-gray-600 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      </div>

      {/* Calendar container */}
      <div className="min-w-[350px]">
        {/* Weekday headers - static */}
        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-3 md:mb-4">
          {weekdayNames.map((d) => (
            <div
              key={d}
              className="text-center text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
            >
              {d.substring(0, 3)}
            </div>
          ))}
        </div>

        {/* Days grid with animation */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={format(currentMonth, "MM-yyyy")}
            custom={direction}
            variants={calendarGridVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-7 gap-1 md:gap-2"
          >
            {days.map((day) => {
              const iso = format(day, "yyyy-MM-dd");
              const dayTx = txByDate(day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);
              const isSelected =
                selectedDate &&
                format(selectedDate, "yyyy-MM-dd") ===
                  format(day, "yyyy-MM-dd");

              // Calculate total income and expenses for the day
              const dayIncome = dayTx
                .filter((t) => t.type === "income")
                .reduce((sum, t) => sum + t.amount, 0);

              const dayExpenses = dayTx
                .filter((t) => t.type === "expense")
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => onDateClick(day)}
                  key={iso}
                  className={cn(
                    "min-h-[4.5rem] md:min-h-[7rem] rounded-lg p-1 md:p-2 cursor-pointer flex flex-col transition-all duration-300",
                    "border border-gray-200 dark:border-gray-700",
                    // Gradient background for current month days
                    inMonth && !today && !isSelected
                      ? "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                      : "",
                    // Other month styling - more subtle
                    !inMonth
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-900 dark:text-gray-600"
                      : "",
                    // Today highlight with more professional gradient
                    today && inMonth
                      ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 ring-1 ring-blue-300 dark:ring-blue-700"
                      : "",
                    // Selected date with professional gradient
                    isSelected
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-indigo-900/40 dark:to-blue-900/40 ring-1 ring-blue-400 dark:ring-blue-600"
                      : "",
                    // Smooth hover effect for current month days
                    inMonth
                      ? "hover:bg-gradient-to-br hover:from-blue-50/70 hover:to-indigo-50/70 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:shadow-sm transition-all duration-300 ease-in-out"
                      : "transition-all duration-300 ease-in-out"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div
                      className={cn(
                        "text-xs md:text-sm font-medium h-5 w-5 md:h-7 md:w-7 flex items-center justify-center rounded-full transition-all duration-300 ease-in-out",
                        // Current month styling
                        inMonth
                          ? today
                            ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm"
                            : isSelected
                            ? "text-blue-700 dark:text-blue-300 bg-blue-300 dark:bg-blue-900/50"
                            : "text-gray-700 dark:text-gray-200"
                          : "text-gray-400 dark:text-gray-600"
                      )}
                    >
                      {format(day, "d")}
                    </div>

                    {/* Transaction indicators - only show on desktop or if there are transactions */}
                    {dayTx.length > 0 && (
                      <div
                        className={cn(
                          "hidden md:block h-2 w-2 rounded-full transition-all duration-300",
                          dayIncome > dayExpenses
                            ? "bg-gradient-to-br from-green-500 to-emerald-500"
                            : dayExpenses > dayIncome
                            ? "bg-gradient-to-br from-rose-500 to-red-500"
                            : "bg-gradient-to-br from-gray-400 to-gray-500"
                        )}
                      />
                    )}
                  </div>

                  {/* Transaction summary - only show on desktop */}
                  <div className="hidden md:flex flex-1 flex-col overflow-hidden space-y-1">
                    {dayIncome > 0 && (
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate transition-all duration-300">
                        +Rp{dayIncome.toLocaleString("id-ID")}
                      </div>
                    )}

                    {dayExpenses > 0 && (
                      <div className="text-xs font-medium text-rose-600 dark:text-rose-400 truncate transition-all duration-300">
                        -Rp{dayExpenses.toLocaleString("id-ID")}
                      </div>
                    )}

                    {/* Transaction count badge */}
                    {dayTx.length > 0 && (
                      <div className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full px-1.5 py-0.5 text-center transition-all duration-300">
                        {dayTx.length}
                      </div>
                    )}
                  </div>

                  {/* Mobile indicator - dot for transactions */}
                  <div className="md:hidden flex justify-center mt-auto">
                    {dayTx.length > 0 && (
                      <div
                        className={cn(
                          "h-2 w-2 rounded-full",
                          dayIncome > dayExpenses
                            ? "bg-emerald-500"
                            : dayExpenses > dayIncome
                            ? "bg-rose-500"
                            : "bg-gray-500"
                        )}
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
