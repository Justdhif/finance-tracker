"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryPanelProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function SummaryPanel({
  totalIncome,
  totalExpense,
  balance,
}: SummaryPanelProps) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader className="pb-2 md:pb-3">
        <CardTitle className="text-base md:text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-600 dark:text-blue-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Summary Bulan Ini
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4">
        {/* Income Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-emerald-900/20 dark:to-green-900/20 p-2 md:p-3 rounded-lg border border-green-100 dark:border-emerald-800/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-2"></div>
              <span className="text-xs md:text-sm text-muted-foreground">
                Pemasukan
              </span>
            </div>
            <span className="font-semibold text-green-600 dark:text-emerald-400 text-xs md:text-sm">
              +Rp {totalIncome.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-rose-900/20 dark:to-red-900/20 p-2 md:p-3 rounded-lg border border-red-100 dark:border-rose-800/30">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-gradient-to-r from-red-400 to-rose-500 mr-2"></div>
              <span className="text-xs md:text-sm text-muted-foreground">
                Pengeluaran
              </span>
            </div>
            <span className="font-semibold text-red-600 dark:text-rose-400 text-xs md:text-sm">
              -Rp {totalExpense.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Balance Card */}
        <div
          className={`pt-2 md:pt-3 border-t border-gray-200 dark:border-gray-700`}
        >
          <div
            className={`p-2 md:p-3 rounded-lg ${
              balance >= 0
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-indigo-900/20 dark:to-blue-900/20 border border-blue-100 dark:border-indigo-800/30"
                : "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-amber-100 dark:border-orange-800/30"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`h-2.5 w-2.5 md:h-3 md:w-3 rounded-full mr-2 ${
                    balance >= 0
                      ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                      : "bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
                ></div>
                <span className="font-medium text-xs md:text-sm">Saldo</span>
              </div>
              <span
                className={`font-bold text-xs md:text-sm ${
                  balance >= 0
                    ? "text-blue-700 dark:text-blue-400"
                    : "text-amber-700 dark:text-amber-400"
                }`}
              >
                {balance >= 0 ? "+" : ""}Rp{" "}
                {Math.abs(balance).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Additional visual indicator */}
        <div className="flex justify-center pt-1 md:pt-2">
          <div
            className={`h-1.5 md:h-2 w-12 md:w-16 rounded-full ${
              balance >= 0
                ? "bg-gradient-to-r from-green-400 to-blue-400"
                : "bg-gradient-to-r from-amber-400 to-red-400"
            }`}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
}
