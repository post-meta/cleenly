import { Metadata } from "next";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Favorite Cleaners | Cleenly",
  description: "Your favorite cleaners",
};

export default function FavoritesPage() {
  // TODO: Fetch favorites from API
  const favorites: unknown[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Favorite Cleaners</h1>
        <p className="text-gray-600 mt-1">
          Quick access to cleaners you&apos;ve saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No favorites yet
          </h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Browse our cleaners and save your favorites for quick booking next
            time.
          </p>
          <Button asChild>
            <Link href="/cleaners">Browse Cleaners</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Favorite cleaner cards would go here */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Sarah M.</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9</span>
                  <span className="text-gray-400">(47 reviews)</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Regular, Deep Cleaning</p>
              </div>
              <button className="text-red-500 hover:text-red-600">
                <Heart className="w-5 h-5 fill-current" />
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <Button asChild variant="secondary" size="sm" className="flex-1">
                <Link href="/cleaners/1">View Profile</Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link href="/book?cleaner_id=1">Book</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
