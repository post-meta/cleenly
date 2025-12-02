import { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard | Cleenly",
  description: "Manage your cleaning bookings",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your cleanings.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/book"
          className="flex items-center gap-4 p-6 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
        >
          <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Book a Cleaning</h3>
            <p className="text-sm text-gray-300">Schedule your next service</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto" />
        </Link>

        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">View Bookings</h3>
            <p className="text-sm text-gray-500">See all your cleanings</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>

        <Link
          href="/cleaners"
          className="flex items-center gap-4 p-6 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <Clock className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Browse Cleaners</h3>
            <p className="text-sm text-gray-500">Find your perfect cleaner</p>
          </div>
          <ArrowRight className="w-5 h-5 ml-auto text-gray-400" />
        </Link>
      </div>

      {/* Upcoming bookings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Upcoming Cleanings
          </h2>
          <Link
            href="/dashboard/bookings"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            View all
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No upcoming cleanings
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Book your first cleaning to get started
          </p>
          <Button asChild>
            <Link href="/book">Book Now</Link>
          </Button>
        </div>
      </div>

      {/* Recent activity placeholder */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500 text-center">
            No recent activity to show
          </p>
        </div>
      </div>
    </div>
  );
}
