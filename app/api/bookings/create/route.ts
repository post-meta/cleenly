import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { supabase } from '@/lib/supabase';
import { sendBookingConfirmationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const session = await auth();
        const body = await request.json();

        const {
            serviceType,
            scheduledDate,
            scheduledTime,
            address,
            guestEmail,
            guestPhone,
            guestName,
            specialRequests,
        } = body;

        let userId = session?.user?.id;

        // If not logged in, check if user exists by email
        if (!userId && guestEmail) {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', guestEmail)
                .single();

            if (existingUser) {
                userId = existingUser.id;
            } else {
                // Create new user
                const { data: newUser } = await supabase
                    .from('users')
                    .insert({
                        email: guestEmail,
                        phone: guestPhone,
                        name: guestName,
                        email_verified: null, // Supabase handles this
                        // first_booking_at: new Date().toISOString(), // Add column if needed
                    })
                    .select()
                    .single();

                if (newUser) {
                    userId = newUser.id;
                }
            }
        }

        // Create address
        const { data: addressRecord } = await supabase
            .from('addresses')
            .insert({
                user_id: userId, // Can be null if guest user creation failed or logic differs
                ...address,
            })
            .select()
            .single();

        if (!addressRecord) throw new Error('Failed to create address');

        // Create booking
        const { data: booking } = await supabase
            .from('bookings')
            .insert({
                user_id: userId,
                service_type: serviceType,
                scheduled_date: scheduledDate,
                scheduled_time: scheduledTime,
                address_id: addressRecord.id,
                special_requests: specialRequests,
                status: 'pending',
                guest_email: !userId ? guestEmail : null,
                guest_phone: !userId ? guestPhone : null,
                guest_name: !userId ? guestName : null,
            })
            .select()
            .single();

        if (!booking) throw new Error('Failed to create booking');

        // Send confirmation email with magic link
        if (guestEmail) {
            await sendBookingConfirmationEmail({
                email: guestEmail,
                booking,
                magicLinkUrl: `${process.env.NEXTAUTH_URL} /api/auth / magic - link ? email = ${guestEmail}& bookingId=${booking.id} `,
            });
        }

        return NextResponse.json({ booking });
    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json(
            { error: 'Failed to create booking' },
            { status: 500 }
        );
    }
}
