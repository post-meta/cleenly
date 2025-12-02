import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Booking Details | Cleenly",
  description: "View booking details",
};

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch booking from API
  const booking = null;

  if (!booking) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/bookings"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h3 className="font-medium text-gray-900 mb-2">Booking not found</h3>
          <p className="text-sm text-gray-500 mb-4">
            The booking you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild variant="secondary">
            <Link href="/dashboard/bookings">View All Bookings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Booking #{id.slice(0, 8)}
              </h1>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date & Time</p>
                  <p className="text-sm text-gray-600">To be scheduled</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">Address not provided</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Estimated Price</p>
                  <p className="text-sm text-gray-600">$150 - $200</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Service Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium text-gray-900">Regular Cleaning</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Property Size</p>
                <p className="font-medium text-gray-900">2 bed, 1 bath</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cleaner card placeholder */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Cleaner</h2>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Not assigned yet</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <h2 className="font-semibold text-gray-900 mb-2">Actions</h2>
            <Button variant="secondary" className="w-full">
              Reschedule
            </Button>
            <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
              Cancel Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
