import { Metadata } from "next";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Schedule | Cleenly Cleaner Dashboard",
  description: "Manage your cleaning schedule",
};

export default function SchedulePage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = [2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">
            View your schedule and manage availability
          </p>
        </div>
        <Button variant="secondary">
          Manage Availability
        </Button>
      </div>

      {/* Calendar header */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">December 2024</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Week view */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {days.map((day, i) => (
            <div
              key={day}
              className="p-4 text-center border-r border-gray-200 last:border-r-0"
            >
              <p className="text-sm text-gray-500">{day}</p>
              <p className={`text-lg font-semibold mt-1 ${
                i === 0 ? "text-gray-900 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto" : "text-gray-900"
              }`}>
                {dates[i]}
              </p>
            </div>
          ))}
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-7 min-h-[400px]">
          {days.map((day, i) => (
            <div
              key={day}
              className="border-r border-gray-200 last:border-r-0 p-2"
            >
              {i === 2 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-xs">
                  <p className="font-medium text-blue-900">Regular Cleaning</p>
                  <p className="text-blue-700">9:00 AM - 12:00 PM</p>
                  <p className="text-blue-600 truncate">Capitol Hill</p>
                </div>
              )}
              {i === 4 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-xs">
                  <p className="font-medium text-green-900">Deep Cleaning</p>
                  <p className="text-green-700">2:00 PM - 6:00 PM</p>
                  <p className="text-green-600 truncate">Ballard</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Availability settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Your Availability</h2>
        <div className="space-y-3">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, i) => (
            <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="font-medium text-gray-900">{day}</span>
              <span className="text-sm text-gray-600">
                {i < 5 ? "8:00 AM - 6:00 PM" : i === 5 ? "9:00 AM - 3:00 PM" : "Unavailable"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
