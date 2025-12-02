import { Metadata } from "next";
import { Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Jobs | Cleenly Cleaner Dashboard",
  description: "View and manage your cleaning jobs",
};

export default function JobsPage() {
  // TODO: Fetch jobs from API
  const jobs = {
    available: [],
    accepted: [],
    completed: [],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        <p className="text-gray-600 mt-1">
          View available jobs and manage your accepted work
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button className="px-4 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
          Available ({jobs.available.length})
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Accepted ({jobs.accepted.length})
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700">
          Completed ({jobs.completed.length})
        </button>
      </div>

      {/* Jobs list */}
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 mb-2">
          No available jobs
        </h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          New jobs matching your service areas and availability will appear here.
          Make sure your profile is complete to receive more job offers.
        </p>
      </div>
    </div>
  );
}
