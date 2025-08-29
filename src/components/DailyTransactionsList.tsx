"use client";

import { useState } from "react";
import { Transaction } from "@/models/Transaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Search, Calendar } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "sonner"; // Import Sonner toast

interface DailyTransactionsListProps {
  selectedDate: Date | null;
  transactions: Transaction[];
  search: string;
  setSearch: (val: string) => void;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

// Variants untuk animasi container
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.05,
    },
  },
};

// Variants untuk animasi item
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Variants untuk animasi card
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function DailyTransactionsList({
  selectedDate,
  transactions,
  search,
  setSearch,
  onEdit,
  onDelete,
}: DailyTransactionsListProps) {
  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("all");

  if (!selectedDate) return null;

  const filtered = transactions
    .filter((t) => t.description.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => (typeFilter === "all" ? true : t.type === typeFilter))
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "income" ? -1 : 1;
      }
      return 0;
    });

  const handleDelete = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      onDelete(id);
      toast.success("Transaksi berhasil dihapus", {
        description: `${
          transaction.description
        } - Rp ${transaction.amount.toLocaleString("id-ID")}`,
      });
    }
    setDeleteTarget(null);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDate.toISOString()}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-base md:text-lg font-bold text-gray-800 dark:text-white">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600 dark:text-blue-400" />
                Transaksi{" "}
                <span className="hidden md:inline ml-1">
                  {selectedDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="md:hidden ml-1">
                  {selectedDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {/* search & filter */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col md:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Cari transaksi..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 md:h-11 text-sm md:text-base"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-[140px] h-10 md:h-11 text-sm md:text-base">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-sm">
                      Semua
                    </SelectItem>
                    <SelectItem value="income" className="text-sm">
                      Pemasukan
                    </SelectItem>
                    <SelectItem value="expense" className="text-sm">
                      Pengeluaran
                    </SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              {/* list */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 md:space-y-3"
              >
                {filtered.length === 0 ? (
                  <motion.div
                    variants={itemVariants}
                    className="text-center py-4 md:py-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg border border-dashed border-gray-300 dark:border-gray-600"
                  >
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Tidak ada transaksi pada tanggal ini.
                    </p>
                  </motion.div>
                ) : (
                  filtered.map((t) => (
                    <motion.div
                      key={t.id}
                      variants={itemVariants}
                      layout
                      className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                        t.type === "income"
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 border-green-100 dark:border-emerald-800/30"
                          : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-rose-900/20 dark:to-red-900/20 border-red-100 dark:border-rose-800/30"
                      }`}
                    >
                      <div className="flex-1 mb-2 md:mb-0">
                        <p className="font-medium text-gray-800 dark:text-white text-sm md:text-base line-clamp-1">
                          {t.description}
                        </p>
                        <p
                          className={`text-xs md:text-sm font-semibold ${
                            t.type === "income"
                              ? "text-green-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-rose-400"
                          }`}
                        >
                          {t.type === "income" ? "+" : "-"}Rp{" "}
                          {t.amount.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex gap-2 self-end md:self-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(t)}
                          className="h-8 px-2 md:px-3 text-xs md:text-sm"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteTarget(t)}
                          className="h-8 px-2 md:px-3 text-xs md:text-sm"
                        >
                          Hapus
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* confirm delete dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        transaction={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
