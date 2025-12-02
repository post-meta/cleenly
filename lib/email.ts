import { Resend } from 'resend';

export async function sendMagicLinkEmail({
  email,
  url,
}: {
  email: string;
  url: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'CLEENLY <noreply@cleenly.app>',
    to: email,
    subject: 'Sign in to CLEENLY',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
          Sign in to CLEENLY
        </h1>
        <p style="font-size: 16px; color: #525252; margin-bottom: 24px;">
          Click the button below to sign in to your account:
        </p>
        <a 
          href="${url}" 
          style="
            display: inline-block;
            background: #D97757;
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 2px;
            font-weight: 500;
          "
        >
          Sign In
        </a>
        <p style="font-size: 14px; color: #737373; margin-top: 24px;">
          This link expires in 24 hours. If you didn't request this, ignore this email.
        </p>
      </div>
    `,
  });
}

export async function sendBookingConfirmationEmail({
  email,
  booking,
  magicLinkUrl,
}: {
  email: string;
  booking: any;
  magicLinkUrl: string;
}) {
  const { bookingConfirmationEmail } = await import('@/lib/email-templates/booking-confirmation');

  const html = bookingConfirmationEmail({
    name: booking.guest_name || 'Guest',
    serviceType: booking.service_type,
    date: booking.scheduled_date,
    time: booking.scheduled_time,
    address: 'Address', // You might need to fetch address details
    price: booking.price_quoted || 0,
    magicLinkUrl,
  });

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: 'CLEENLY <noreply@cleenly.app>',
    to: email,
    subject: 'Your Cleaning is Confirmed',
    html,
  });
}
