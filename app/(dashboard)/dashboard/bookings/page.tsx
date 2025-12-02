import { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "My Bookings | Cleenly",
  description: "View and manage your cleaning bookings",
};

export default function BookingsPage() {
  // TODO: Fetch bookings from API
  const bookings: unknown[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">
            View and manage all your cleaning bookings
          </p>
        </div>
        <Button asChild>
          <Link href="/book">Book New</Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
          Upcoming
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Past
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Cancelled
        </button>
      </div>

      {/* Bookings list */}
      {bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No bookings yet
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            You haven&apos;t made any bookings yet. Book your first cleaning to see
            it here.
          </p>
          <Button asChild>
            <Link href="/book">Book Your First Cleaning</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Booking cards would go here */}
        </div>
      )}
    </div>
  );
}
