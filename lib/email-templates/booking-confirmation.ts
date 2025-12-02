export function bookingConfirmationEmail({
    name,
    serviceType,
    date,
    time,
    address,
    price,
    magicLinkUrl,
}: {
    name: string;
    serviceType: string;
    date: string;
    time: string;
    address: string;
    price: number;
    magicLinkUrl: string;
}) {
    return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 24px; font-weight: 600; margin-bottom: 24px;">
          Your cleaning is confirmed
        </h1>
        
        <p style="font-size: 16px; color: #525252; margin-bottom: 24px;">
          Hi ${name}, your ${serviceType} is scheduled for:
        </p>
        
        <div style="background: #F5F5F5; padding: 24px; border-radius: 2px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0;"><strong>Date:</strong> ${date}</p>
          <p style="margin: 0 0 8px 0;"><strong>Time:</strong> ${time}</p>
          <p style="margin: 0 0 8px 0;"><strong>Address:</strong> ${address}</p>
          <p style="margin: 0;"><strong>Price:</strong> $${price}</p>
        </div>
        
        <a 
          href="${magicLinkUrl}" 
          style="
            display: inline-block;
            background: #D97757;
            color: white;
            padding: 12px 32px;
            text-decoration: none;
            border-radius: 2px;
            font-weight: 500;
            margin-bottom: 24px;
          "
        >
          View Booking Details
        </a>
        
        <p style="font-size: 14px; color: #737373;">
          Click the button above to view your booking and manage it anytime.
        </p>
      </body>
    </html>
  `;
}
