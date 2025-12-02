import { Metadata } from "next";
import Link from "next/link";
import { Briefcase, DollarSign, Star, TrendingUp, Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cleaner Dashboard | Cleenly",
  description: "Manage your cleaning jobs",
};

export default function CleanerDashboardPage() {
  // TODO: Fetch stats from API
  const stats = {
    todayJobs: 0,
    weekJobs: 3,
    monthEarnings: 145000, // in cents
    rating: 4.9,
    totalReviews: 47,
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning!</h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s your overview for today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs text-gray-500">Today</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.todayJobs}</p>
          <p className="text-sm text-gray-600">Jobs scheduled</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">
            ${(stats.monthEarnings / 100).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Earnings</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-500">{stats.totalReviews} reviews</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.rating}</p>
          <p className="text-sm text-gray-600">Average rating</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-xs text-gray-500">This week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-4">{stats.weekJobs}</p>
          <p className="text-sm text-gray-600">Jobs completed</p>
        </div>
      </div>

      {/* Today's schedule */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Jobs</h2>
          <Link
            href="/cleaner-dashboard/schedule"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            View schedule <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No jobs scheduled for today
          </h3>
          <p className="text-sm text-gray-500">
            Check available jobs to accept new work
          </p>
        </div>
      </div>

      {/* Available jobs preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Jobs</h2>
          <Link
            href="/cleaner-dashboard/jobs"
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No new jobs available
          </h3>
          <p className="text-sm text-gray-500">
            New jobs will appear here when they match your service areas
          </p>
        </div>
      </div>
    </div>
  );
}
