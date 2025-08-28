"use client";

import { useState, useEffect, useRef } from "react";
import { Transaction } from "@/models/Transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { motion, PanInfo } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  onAdd: (t: Transaction) => void;
  defaultValue?: Transaction;
  onClose: () => void;
  isEditMode?: boolean;
};

export default function MobileTransactionForm({
  onAdd,
  defaultValue,
  onClose,
  isEditMode = false,
}: Props) {
  const [type, setType] = useState<"income" | "expense">(
    defaultValue?.type ?? "expense"
  );
  const [description, setDescription] = useState(
    defaultValue?.description ?? ""
  );
  const [amount, setAmount] = useState<number>(defaultValue?.amount ?? 0);
  const [date, setDate] = useState(
    defaultValue?.date.split("T")[0] ?? new Date().toISOString().split("T")[0]
  );
  const formRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if click is directly on backdrop, not on form
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    const newTransaction: Transaction = {
      id: defaultValue?.id ?? Date.now().toString(),
      type,
      description,
      amount,
      date: new Date(date).toISOString(),
    };

    onAdd(newTransaction);
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50"
        onClick={handleBackdropClick}
      />

      {/* Form */}
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
        className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white dark:bg-gray-900 max-h-[90vh] overflow-hidden"
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="px-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isEditMode ? "Edit Transaksi" : "Tambah Transaksi"}
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

        <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
          <Card className="overflow-hidden border-0 shadow-none rounded-none">
            <CardContent className="p-4 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Jenis Transaksi */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jenis Transaksi *
                  </Label>
                  <Select
                    value={type}
                    onValueChange={(val) =>
                      setType(val as "income" | "expense")
                    }
                  >
                    <SelectTrigger className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                      <SelectValue placeholder="Pilih jenis transaksi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Pemasukan</SelectItem>
                      <SelectItem value="expense">Pengeluaran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Deskripsi */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deskripsi *
                  </Label>
                  <Input
                    type="text"
                    placeholder="Masukkan deskripsi transaksi"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-11 rounded-lg"
                  />
                </div>

                {/* Jumlah dan Tanggal */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Jumlah */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jumlah (Rp) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        Rp
                      </span>
                      <Input
                        type="number"
                        placeholder="0"
                        value={amount || ""}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="h-11 rounded-lg pl-9"
                      />
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tanggal *
                    </Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-11 rounded-lg"
                    />
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="h-11 flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditMode ? "Update" : "Tambah"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1"
                    onClick={onClose}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </>
  );
}
