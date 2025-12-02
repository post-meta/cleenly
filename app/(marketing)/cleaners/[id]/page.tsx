import { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Briefcase, Clock, Shield, Calendar, ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Cleaner Profile | Cleenly",
  description: "View cleaner profile and book a cleaning",
};

interface CleanerProfilePageProps {
  params: Promise<{ id: string }>;
}

// Mock data - replace with API call
const mockCleaner = {
  id: "1",
  name: "Sarah M.",
  avatar: null,
  rating: 4.9,
  totalReviews: 47,
  bio: "Professional cleaner with 5 years of experience. I take pride in transforming spaces and creating clean, healthy environments for families. Specializing in deep cleaning and move-out services. I use eco-friendly products when requested and pay attention to every detail.",
  hourlyRate: 3500,
  serviceTypes: ["regular", "deep", "move_out"],
  serviceAreas: ["Seattle", "Capitol Hill", "Ballard", "Fremont", "Wallingford"],
  yearsExperience: 5,
  isVerified: true,
  backgroundCheckPassed: true,
  totalJobs: 156,
  memberSince: "March 2022",
  availability: {
    monday: ["8:00 AM - 6:00 PM"],
    tuesday: ["8:00 AM - 6:00 PM"],
    wednesday: ["8:00 AM - 6:00 PM"],
    thursday: ["8:00 AM - 6:00 PM"],
    friday: ["8:00 AM - 6:00 PM"],
    saturday: ["9:00 AM - 3:00 PM"],
    sunday: [],
  },
  reviews: [
    {
      id: 1,
      customer: "John D.",
      rating: 5,
      date: "Nov 28, 2024",
      comment: "Sarah did an amazing job with our deep cleaning. She was thorough, professional, and left our home spotless. Highly recommend!",
    },
    {
      id: 2,
      customer: "Emily R.",
      rating: 5,
      date: "Nov 20, 2024",
      comment: "Excellent attention to detail. Sarah even cleaned areas I forgot to mention. Will definitely book again!",
    },
    {
      id: 3,
      customer: "Mike T.",
      rating: 4,
      date: "Nov 15, 2024",
      comment: "Great cleaning overall. Very friendly and professional.",
    },
  ],
};

const serviceTypeLabels: Record<string, string> = {
  regular: "Regular Cleaning",
  deep: "Deep Cleaning",
  move_out: "Move-out Cleaning",
};

export default async function CleanerProfilePage({ params }: CleanerProfilePageProps) {
  const { id } = await params;

  // TODO: Fetch cleaner from API
  const cleaner = mockCleaner;

  if (!cleaner) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cleaner not found</h1>
          <p className="text-gray-600 mb-6">
            The cleaner you&apos;re looking for doesn&apos;t exist or is no longer available.
          </p>
          <Button asChild>
            <Link href="/cleaners">Browse All Cleaners</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/cleaners"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cleaners
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile header */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-3xl font-semibold text-gray-400">
                    {cleaner.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-gray-900">{cleaner.name}</h1>
                    {cleaner.isVerified && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{cleaner.rating}</span>
                      <span className="text-gray-500">({cleaner.totalReviews} reviews)</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">{cleaner.totalJobs} jobs</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-600">{cleaner.yearsExperience} years exp.</span>
                  </div>
                  <p className="text-gray-600 mt-4">{cleaner.bio}</p>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Services Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {cleaner.serviceTypes.map((type) => (
                  <span
                    key={type}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
                  >
                    {serviceTypeLabels[type]}
                  </span>
                ))}
              </div>
            </div>

            {/* Service areas */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Service Areas
              </h2>
              <div className="flex flex-wrap gap-2">
                {cleaner.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Availability
              </h2>
              <div className="grid gap-2">
                {Object.entries(cleaner.availability).map(([day, times]) => (
                  <div key={day} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                    <span className="font-medium text-gray-900 capitalize">{day}</span>
                    <span className="text-gray-600">
                      {times.length > 0 ? times.join(", ") : "Unavailable"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-6">
                Reviews ({cleaner.totalReviews})
              </h2>
              <div className="space-y-6">
                {cleaner.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.customer}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full mt-6">
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  ${(cleaner.hourlyRate / 100).toFixed(0)}
                </div>
                <div className="text-gray-500">per hour</div>
              </div>

              <Button asChild className="w-full mb-3" size="lg">
                <Link href={`/book?cleaner_id=${cleaner.id}`}>
                  <Calendar className="w-5 h-5 mr-2" />
                  Book {cleaner.name.split(" ")[0]}
                </Link>
              </Button>

              <Button variant="secondary" className="w-full" size="lg">
                <Heart className="w-5 h-5 mr-2" />
                Save to Favorites
              </Button>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  Background check passed
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Top rated cleaner
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Member since {cleaner.memberSince}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Response rate</span>
                  <span className="font-medium text-gray-900">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium text-gray-900">&lt; 1 hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Repeat clients</span>
                  <span className="font-medium text-gray-900">85%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
