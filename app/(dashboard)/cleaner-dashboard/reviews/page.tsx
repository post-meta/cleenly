import { Metadata } from "next";
import { Star, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Reviews | Cleenly Cleaner Dashboard",
  description: "View your customer reviews",
};

export default function ReviewsPage() {
  // TODO: Fetch reviews from API
  const stats = {
    averageRating: 4.9,
    totalReviews: 47,
    fiveStars: 42,
    fourStars: 4,
    threeStars: 1,
    twoStars: 0,
    oneStars: 0,
  };

  const reviews = [
    {
      id: 1,
      customer: "Sarah M.",
      rating: 5,
      date: "Dec 5, 2024",
      comment: "Amazing job! The apartment has never looked cleaner. Very thorough and professional.",
      serviceType: "Deep Cleaning",
    },
    {
      id: 2,
      customer: "John D.",
      rating: 5,
      date: "Dec 2, 2024",
      comment: "Great attention to detail. Will definitely book again!",
      serviceType: "Regular Cleaning",
    },
    {
      id: 3,
      customer: "Mike R.",
      rating: 4,
      date: "Nov 28, 2024",
      comment: "Good cleaning overall. A few spots missed but otherwise very satisfied.",
      serviceType: "Regular Cleaning",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-gray-600 mt-1">
          See what your customers are saying about you
        </p>
      </div>

      {/* Rating overview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Average rating */}
          <div className="text-center md:text-left md:border-r md:border-gray-200 md:pr-6">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-5xl font-bold text-gray-900">{stats.averageRating}</span>
              <div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500">{stats.totalReviews} reviews</p>
              </div>
            </div>
          </div>

          {/* Rating breakdown */}
          <div className="space-y-2">
            {[
              { stars: 5, count: stats.fiveStars },
              { stars: 4, count: stats.fourStars },
              { stars: 3, count: stats.threeStars },
              { stars: 2, count: stats.twoStars },
              { stars: 1, count: stats.oneStars },
            ].map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-gray-600 w-8">{stars} star</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${(count / stats.totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{review.customer}</p>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-sm text-gray-500">{review.serviceType}</p>
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
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {reviews.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No reviews yet
          </h3>
          <p className="text-sm text-gray-500">
            Complete jobs to start receiving reviews from customers
          </p>
        </div>
      )}
    </div>
  );
}
