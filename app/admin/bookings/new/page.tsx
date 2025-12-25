import { getActiveCleaners } from '@/app/actions/cleaners';
import { getCustomers } from '@/app/actions/bookings';
import { CreateBookingForm } from '@/components/admin/create-booking-form';

export default async function NewBookingPage() {
    const [cleanersResult, customersResult] = await Promise.all([
        getActiveCleaners(),
        getCustomers(),
    ]);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Create New Booking</h1>

            <CreateBookingForm
                cleaners={cleanersResult.data || []}
                customers={customersResult.data || []}
            />
        </div>
    );
}
