import { Metadata } from "next";
import Link from "next/link";
import { Star, MapPin, Briefcase, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Find Cleaners | Cleenly",
  description: "Browse and book professional cleaners in the Greater Seattle area",
};

// Mock data - replace with API call
const mockCleaners = [
  {
    id: "1",
    name: "Sarah M.",
    avatar: null,
    rating: 4.9,
    totalReviews: 47,
    bio: "Professional cleaner with 5 years of experience. Specializing in deep cleaning and move-out services.",
    hourlyRate: 3500,
    serviceTypes: ["regular", "deep", "move_out"],
    serviceAreas: ["Seattle", "Capitol Hill", "Ballard"],
    yearsExperience: 5,
    isVerified: true,
    totalJobs: 156,
  },
  {
    id: "2",
    name: "Maria L.",
    avatar: null,
    rating: 4.8,
    totalReviews: 32,
    bio: "Attention to detail is my specialty. I treat every home like my own.",
    hourlyRate: 3000,
    serviceTypes: ["regular", "deep"],
    serviceAreas: ["Seattle", "Fremont", "Wallingford"],
    yearsExperience: 3,
    isVerified: true,
    totalJobs: 89,
  },
  {
    id: "3",
    name: "Elena K.",
    avatar: null,
    rating: 5.0,
    totalReviews: 18,
    bio: "Eco-friendly cleaning products. Creating healthy homes for families.",
    hourlyRate: 4000,
    serviceTypes: ["regular", "deep"],
    serviceAreas: ["Bellevue", "Kirkland", "Redmond"],
    yearsExperience: 7,
    isVerified: true,
    totalJobs: 203,
  },
];

const serviceTypeLabels: Record<string, string> = {
  regular: "Regular",
  deep: "Deep",
  move_out: "Move-out",
};

export default function CleanersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Cleaner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our vetted professional cleaners in the Greater Seattle area.
            Read reviews, compare rates, and book directly.
          </p>
        </div>

        {/* Search and filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by name or area..."
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="">All Services</option>
                <option value="regular">Regular Cleaning</option>
                <option value="deep">Deep Cleaning</option>
                <option value="move_out">Move-out Cleaning</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="">All Areas</option>
                <option value="seattle">Seattle</option>
                <option value="bellevue">Bellevue</option>
                <option value="kirkland">Kirkland</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="reviews">Most Reviews</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{mockCleaners.length}</span> cleaners available
          </p>
          <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
            <SlidersHorizontal className="w-4 h-4" />
            More filters
          </button>
        </div>

        {/* Cleaners grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockCleaners.map((cleaner) => (
            <div
              key={cleaner.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-semibold text-gray-400">
                      {cleaner.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{cleaner.name}</h3>
                      {cleaner.isVerified && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-gray-900">{cleaner.rating}</span>
                      <span className="text-gray-500 text-sm">
                        ({cleaner.totalReviews} reviews)
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {cleaner.totalJobs} jobs completed
                    </p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                  {cleaner.bio}
                </p>

                {/* Services */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {cleaner.serviceTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {serviceTypeLabels[type]}
                    </span>
                  ))}
                </div>

                {/* Areas */}
                <div className="flex items-center gap-1 mt-3 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{cleaner.serviceAreas.join(", ")}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    ${(cleaner.hourlyRate / 100).toFixed(0)}
                  </span>
                  <span className="text-gray-500 text-sm">/hour</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" asChild>
                    <Link href={`/cleaners/${cleaner.id}`}>View Profile</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/book?cleaner_id=${cleaner.id}`}>Book</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <Button variant="secondary" size="lg">
            Load More Cleaners
          </Button>
        </div>
      </div>
    </div>
  );
}
