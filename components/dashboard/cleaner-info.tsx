import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PHONE_SMS_HREF } from '@/lib/constants';

export function CleanerInfo({
    cleaner,
}: {
    cleaner: any;
    bookingId?: string;
}) {
    const name = cleaner.full_name || cleaner.name;
    const photo = cleaner.photo_url || cleaner.profile_photo;

    return (
        <section className="border border-gray-200 p-6 rounded-sm">
            <h2 className="font-sans font-semibold mb-4">Your Cleaner</h2>

            <div className="flex items-start gap-4">
                {photo ? (
                    <img
                        src={photo}
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                )}

                <div className="flex-1">
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Part of the CLEENLY team
                    </p>
                </div>
            </div>

            <a href={PHONE_SMS_HREF} className="block mt-4">
                <Button variant="secondary" size="sm" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Text us about this visit
                </Button>
            </a>
        </section>
    );
}
