"use client";

import { useState } from "react";
import { Transaction } from "@/models/Transaction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Props = {
  onAdd: (t: Transaction) => void;
  defaultValue?: Transaction;
  onCancel?: () => void;
  isEditMode?: boolean;
};

export default function TransactionForm({
  onAdd,
  defaultValue,
  onCancel,
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

    if (!defaultValue) {
      setDescription("");
      setAmount(0);
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <Card className="overflow-hidden border-0 md:border shadow-none md:shadow-sm">
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Jenis Transaksi */}
          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jenis Transaksi *
            </Label>
            <Select
              value={type}
              onValueChange={(val) => setType(val as "income" | "expense")}
            >
              <SelectTrigger className="w-full h-11 md:h-12 rounded-lg md:rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200">
                <SelectValue placeholder="Pilih jenis transaksi" />
              </SelectTrigger>
              <SelectContent className="rounded-lg md:rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                <SelectItem
                  value="income"
                  className="flex items-center py-2 md:py-3 px-3 md:px-4 rounded-md md:rounded-lg data-[state=checked]:bg-emerald-50 data-[state=checked]:text-emerald-700 dark:data-[state=checked]:bg-emerald-900/20 dark:data-[state=checked]:text-emerald-300 transition-colors"
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm md:text-base">Pemasukan</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="expense"
                  className="flex items-center py-2 md:py-3 px-3 md:px-4 rounded-md md:rounded-lg data-[state=checked]:bg-rose-50 data-[state=checked]:text-rose-700 dark:data-[state=checked]:bg-rose-900/20 dark:data-[state=checked]:text-rose-300 transition-colors"
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm md:text-base">Pengeluaran</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Deskripsi */}
          <div className="space-y-2 md:space-y-3">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi *
            </Label>
            <Input
              type="text"
              placeholder="Masukkan deskripsi transaksi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11 md:h-12 rounded-lg md:rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
            />
          </div>

          {/* Jumlah dan Tanggal dalam grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {/* Jumlah */}
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Jumlah (Rp) *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                  Rp
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  value={amount || ""}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="h-11 md:h-12 rounded-lg md:rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-9 md:pl-10 transition-all duration-200 text-sm md:text-base"
                />
              </div>
            </div>

            {/* Tanggal */}
            <div className="space-y-2 md:space-y-3">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal *
              </Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 md:h-12 rounded-lg md:rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm md:text-base"
              />
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col md:flex-row gap-3 pt-3 md:pt-4">
            <Button
              type="submit"
              className="h-11 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-sm md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isEditMode ? "M5 13l4 4L19 7" : "M12 6v6m0 0v6m0-6h6m-6 0H6"
                  }
                />
              </svg>
              {isEditMode ? "Update" : "Tambah"}
            </Button>

            {isEditMode && onCancel && (
              <Button
                type="button"
                variant="outline"
                className="h-11 md:h-12 rounded-lg md:rounded-xl border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 font-semibold text-sm md:text-base"
                onClick={onCancel}
              >
                Batal
              </Button>
            )}
          </div>

          {/* Catatan required fields */}
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            * Field wajib diisi
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
