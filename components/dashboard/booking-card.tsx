"use client";

import Link from "next/link";
import { Calendar, Clock, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Booking } from "@/lib/supabase/types";
import { SERVICE_TYPES } from "@/lib/constants";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  assigned: "bg-purple-100 text-purple-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  assigned: "Cleaner Assigned",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function BookingCard({ booking, showActions = true }: BookingCardProps) {
  const serviceType = SERVICE_TYPES[booking.service_type as keyof typeof SERVICE_TYPES];
  const formattedDate = booking.preferred_date
    ? new Date(booking.preferred_date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "TBD";

  const priceRange = `$${(booking.estimated_min / 100).toFixed(0)} - $${(booking.estimated_max / 100).toFixed(0)}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Service type and status */}
          <div className="flex items-center gap-3 mb-3">
            <h3 className="font-semibold text-gray-900">
              {serviceType?.name || booking.service_type}
            </h3>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                statusColors[booking.status] || statusColors.pending
              }`}
            >
              {statusLabels[booking.status] || booking.status}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
              {booking.preferred_time && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{booking.preferred_time}</span>
                </>
              )}
            </div>

            {booking.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">
                  {booking.address}, {booking.city}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span>
                {booking.actual_price
                  ? `$${(booking.actual_price / 100).toFixed(0)}`
                  : priceRange}
              </span>
              <span className="text-gray-400">
                • {booking.bedrooms} bed, {booking.bathrooms} bath
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-col gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link href={`/dashboard/bookings/${booking.id}`}>View</Link>
            </Button>
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                Cancel
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
