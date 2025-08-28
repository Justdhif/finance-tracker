"use client";

import React, { useState, useEffect } from "react";
import { addMonths, isSameMonth, isSameDay, format } from "date-fns";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Transaction } from "@/models/Transaction";
import CalendarView from "@/components/CalendarView";
import TransactionForm from "@/components/TransactionForm";
import MobileTransactionForm from "@/components/MobileTransactionForm";
import LoadingScreen from "@/components/LoadingScreen"; // Komponen loading baru
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
  const [isMobileFormOpen, setMobileFormOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(format(now, "HH:mm:ss"));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulasi loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Sedikit lebih lama untuk menikmati animasi loading

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

  // ---- Buka form ----
  const openForm = (mode: "add" | "edit", transaction?: Transaction) => {
    setDialogMode(mode);
    if (transaction) {
      setEditTransaction(transaction);
    }

    if (isMobile) {
      setMobileFormOpen(true);
    } else {
      setDialogOpen(true);
    }
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

    // Tutup kedua jenis form
    setDialogOpen(false);
    setMobileFormOpen(false);
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
      <AnimatePresence>{isLoading && <LoadingScreen />}</AnimatePresence>

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
              className="text-xl md:text-2xl font-semibold text-blue-800/90 drop-shadow-sm"
            >
              {currentTime}
            </motion.div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                setSelectedDate(new Date());
                openForm("add");
              }}
              className="bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] text-white hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] dark:text-white dark:hover:bg-[linear-gradient(to_bottom_left,_#7DBEFF_23%,_#A8E5FF_100%)] cursor-pointer text-sm md:text-base shadow-md hover:shadow-lg transition-all"
            >
              Tambah Transaksi +
            </Button>
          </motion.div>
        </motion.div>

        {/* 2 kolom: kalender kiri, summary & transaksi kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Kalender */}
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

          {/* Panel kanan */}
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
              onEdit={(t) => openForm("edit", t)}
              onDelete={deleteTransaction}
            />
          </motion.div>
        </div>

        {/* Dialog untuk Desktop */}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[500px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">
                {dialogMode === "edit" ? "Edit Transaksi" : "Tambah Transaksi"}
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
              onAdd={addTransaction}
              isEditMode={dialogMode === "edit"}
              onCancel={() => {
                setDialogOpen(false);
                setEditTransaction(null);
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Mobile Form (muncul dari bawah) */}
        <AnimatePresence>
          {isMobileFormOpen && (
            <MobileTransactionForm
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
              onAdd={addTransaction}
              isEditMode={dialogMode === "edit"}
              onClose={() => {
                setMobileFormOpen(false);
                setEditTransaction(null);
              }}
            />
          )}
        </AnimatePresence>
      </motion.main>
    </>
  );
}
