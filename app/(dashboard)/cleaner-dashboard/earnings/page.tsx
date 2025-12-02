import { Metadata } from "next";
import { DollarSign, TrendingUp, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Earnings | Cleenly Cleaner Dashboard",
  description: "Track your earnings",
};

export default function EarningsPage() {
  // TODO: Fetch earnings from API
  const earnings = {
    thisWeek: 35000,
    thisMonth: 145000,
    allTime: 892000,
    pendingPayout: 35000,
  };

  const transactions = [
    { id: 1, date: "Dec 6, 2024", type: "Regular Cleaning", customer: "John D.", amount: 12000, status: "completed" },
    { id: 2, date: "Dec 5, 2024", type: "Deep Cleaning", customer: "Sarah M.", amount: 18000, status: "completed" },
    { id: 3, date: "Dec 4, 2024", type: "Regular Cleaning", customer: "Mike R.", amount: 11500, status: "completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">
            Track your income and payouts
          </p>
        </div>
        <Button variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">This week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(earnings.thisWeek / 100).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-4 h-4" />
            +12% from last week
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(earnings.thisMonth / 100).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">December 2024</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">All time</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${(earnings.allTime / 100).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 mt-1">Since joining</p>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-gray-400">Pending</span>
          </div>
          <p className="text-2xl font-bold">
            ${(earnings.pendingPayout / 100).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400 mt-1">Next payout: Dec 15</p>
        </div>
      </div>

      {/* Transaction history */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{tx.type}</p>
                <p className="text-sm text-gray-500">{tx.customer} • {tx.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  +${(tx.amount / 100).toFixed(0)}
                </p>
                <p className="text-xs text-green-600">Completed</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <button className="text-sm text-gray-600 hover:text-gray-900">
            View all transactions
          </button>
        </div>
      </div>

      {/* Tax documents */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Tax Documents</h2>
        <p className="text-sm text-gray-600">
          Your 1099 forms will be available here at the end of the tax year.
        </p>
      </div>
    </div>
  );
}
