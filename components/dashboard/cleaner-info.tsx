import { Star, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CleanerInfo({
    cleaner,
    bookingId
}: {
    cleaner: any;
    bookingId: string;
}) {
    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-semibold mb-4">Your Cleaner</h2>

            <div className="flex items-start gap-4">
                {cleaner.profile_photo ? (
                    <img
                        src={cleaner.profile_photo}
                        alt={cleaner.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                )}

                <div className="flex-1">
                    <h3 className="font-semibold">{cleaner.name}</h3>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-sm">
                            <Star className="w-4 h-4 fill-current text-accent" />
                            <span className="font-medium">{cleaner.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                            ({cleaner.total_reviews} reviews)
                        </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                        {cleaner.total_bookings} cleanings completed
                    </p>
                </div>
            </div>

            <Button
                variant="secondary"
                size="sm"
                className="w-full mt-4"
                onClick={() => {
                    // Open chat or contact modal
                }}
            >
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Cleaner
            </Button>
        </section>
    );
}
