"use client";

import React, { useState, useEffect } from "react";
import { addMonths, isSameMonth, isSameDay, format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Transaction } from "@/models/Transaction";
import CalendarView from "@/components/CalendarView";
import TransactionForm from "@/components/TransactionForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SummaryPanel from "@/components/SummaryPanel";
import DailyTransactionsList from "@/components/DailyTransactionsList";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    "transactions",
    []
  );

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true); // State untuk animasi loading

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(format(now, "HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulasi loading saat pertama kali buka atau refresh
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Durasi animasi loading

    return () => clearTimeout(timer);
  }, []);

  // ---- Navigasi bulan ----
  const prevMonth = () => setCurrentMonth((m) => addMonths(m, -1));
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => setCurrentMonth(new Date());

  // ---- Handle month change from calendar ----
  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  // ---- Klik tanggal ----
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // ---- Tambah/Edit transaksi ----
  const addTransaction = (t: Transaction) => {
    setTransactions((prev) => {
      const exists = prev.find((p) => p.id === t.id);
      if (exists) {
        return prev.map((p) => (p.id === t.id ? t : p));
      }
      return [...prev, t];
    });
    setDialogOpen(false);
    setEditTransaction(null);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // ---- Summary calculation ----
  const monthTransactions = transactions.filter((t) =>
    isSameMonth(new Date(t.date), currentMonth)
  );

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  // ---- Daily Transactions ----
  const dailyTransactions =
    selectedDate !== null
      ? transactions.filter((t) => isSameDay(new Date(t.date), selectedDate))
      : [];

  return (
    <>
      {/* Animasi Loading */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-gradient-to-br from-[#7DBEFF] via-blue-100/60 to-transparent z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"
              />
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-blue-800"
              >
                Finance Tracker
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-blue-600 mt-2"
              >
                Mengelola keuangan dengan mudah
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konten Utama */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: isLoading ? 1.2 : 0 }}
        className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 min-h-screen"
      >
        {/* Header dengan jam dan tombol tambah */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: isLoading ? 1.4 : 0.2 }}
          className="flex items-center justify-between p-3 md:p-4 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm border border-blue-200/30"
        >
          <div className="flex items-center space-x-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-2xl md:text-3xl font-semibold text-blue-800/90 drop-shadow-sm"
            >
              {currentTime}
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                setSelectedDate(new Date());
                setDialogMode("add");
                setEditTransaction(null);
                setDialogOpen(true);
              }}
              className="bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:text-white dark:hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all"
            >
              Tambah Transaksi +
            </Button>
          </motion.div>
        </motion.div>

        {/* 2 kolom: kalender kiri, summary & transaksi kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Kalender - di mobile akan full width dan di atas */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: isLoading ? 1.6 : 0.4 }}
            className="lg:col-span-2 order-1 lg:order-1"
          >
            <CalendarView
              currentMonth={currentMonth}
              transactions={transactions}
              selectedDate={selectedDate}
              onDateClick={handleDateClick}
              onMonthChange={handleMonthChange}
            />
          </motion.div>

          {/* Panel kanan - di mobile akan full width dan di bawah */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: isLoading ? 1.8 : 0.6 }}
            className="space-y-4 order-2 lg:order-2"
          >
            <SummaryPanel
              totalIncome={totalIncome}
              totalExpense={totalExpense}
              balance={balance}
            />

            <DailyTransactionsList
              selectedDate={selectedDate}
              transactions={dailyTransactions}
              search={search}
              setSearch={setSearch}
              onEdit={(t) => {
                setEditTransaction(t);
                setDialogMode("edit");
                setDialogOpen(true);
              }}
              onDelete={deleteTransaction}
            />
          </motion.div>
        </div>

        {/* Dialog Tambah/Edit */}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">
                {dialogMode === "edit" ? "Edit Transaksi" : "Tambah Transaksi"}{" "}
              </DialogTitle>
            </DialogHeader>

            <TransactionForm
              defaultValue={
                dialogMode === "edit" && editTransaction
                  ? editTransaction
                  : selectedDate
                  ? {
                      id: "",
                      type: "expense",
                      description: "",
                      amount: 0,
                      date: selectedDate.toISOString(),
                    }
                  : undefined
              }
              onAdd={(t) => {
                if (!t.id) t.id = Date.now().toString();
                addTransaction(t);
              }}
              isEditMode={false}
              onCancel={() => {
                setDialogOpen(false);
                setEditTransaction(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </motion.main>
    </>
  );
}
