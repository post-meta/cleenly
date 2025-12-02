import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Job Details | Cleenly Cleaner Dashboard",
  description: "View job details",
};

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  // TODO: Fetch job from API
  const job = null;

  if (!job) {
    return (
      <div className="space-y-6">
        <Link
          href="/cleaner-dashboard/jobs"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Link>

        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <h3 className="font-medium text-gray-900 mb-2">Job not found</h3>
          <p className="text-sm text-gray-500 mb-4">
            The job you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button asChild variant="secondary">
            <Link href="/cleaner-dashboard/jobs">View All Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/cleaner-dashboard/jobs"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold text-gray-900">
                Regular Cleaning
              </h1>
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                Available
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Preferred Date</p>
                  <p className="text-sm text-gray-600">Monday, Dec 9, 2024</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Preferred Time</p>
                  <p className="text-sm text-gray-600">Morning (8am - 12pm)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-600">Seattle, WA</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Your Earnings</p>
                  <p className="text-sm text-gray-600">$120 - $160 (80% of booking)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Property details */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">Bedrooms</p>
                <p className="font-medium text-gray-900">2</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bathrooms</p>
                <p className="font-medium text-gray-900">1</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Square Feet</p>
                <p className="font-medium text-gray-900">~1,200 sq ft</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="font-medium text-gray-900">Regular Cleaning</p>
              </div>
            </div>
          </div>

          {/* Special instructions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Special Instructions
            </h2>
            <p className="text-gray-600">No special instructions provided.</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">John D.</p>
                  <p className="text-sm text-gray-500">New customer</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Contact info will be shown after you accept the job
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3">
            <Button className="w-full">Accept Job</Button>
            <Button variant="secondary" className="w-full">
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
