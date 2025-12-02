export function getWelcomeEmailHtml(name: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to CLEENLY</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 28px;">Welcome to CLEENLY! 🎉</h1>
    <p style="color: #666; margin: 0; font-size: 16px;">Your home cleaning made simple</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <p style="font-size: 16px; margin: 0 0 20px 0;">Hi ${name},</p>
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">
      Thank you for joining CLEENLY! We're excited to help you keep your home sparkling clean.
    </p>

    <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <h2 style="font-size: 18px; margin: 0 0 15px 0; color: #1a1a1a;">Getting Started</h2>
      <ul style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 10px;">Book your first cleaning in just 2 minutes</li>
        <li style="margin-bottom: 10px;">Choose from Regular, Deep, or Move-Out cleaning</li>
        <li style="margin-bottom: 10px;">Get instant pricing based on your home size</li>
        <li style="margin-bottom: 10px;">Track your bookings in your dashboard</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.NEXTAUTH_URL}/dashboard" 
         style="display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Go to Dashboard
      </a>
    </div>

    <p style="font-size: 14px; color: #666; margin: 20px 0 0 0;">
      Need help? Reply to this email or visit our <a href="${process.env.NEXTAUTH_URL}/faq" style="color: #1a1a1a;">FAQ page</a>.
    </p>
  </div>

  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #999; font-size: 14px; margin: 0;">
      CLEENLY - Professional House Cleaning in Seattle
    </p>
    <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
      © ${new Date().getFullYear()} CLEENLY. All rights reserved.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function getWelcomeEmailText(name: string): string {
    return `
Welcome to CLEENLY!

Hi ${name},

Thank you for joining CLEENLY! We're excited to help you keep your home sparkling clean.

Getting Started:
• Book your first cleaning in just 2 minutes
• Choose from Regular, Deep, or Move-Out cleaning
• Get instant pricing based on your home size
• Track your bookings in your dashboard

Visit your dashboard: ${process.env.NEXTAUTH_URL}/dashboard

Need help? Reply to this email or visit our FAQ page at ${process.env.NEXTAUTH_URL}/faq

CLEENLY - Professional House Cleaning in Seattle
© ${new Date().getFullYear()} CLEENLY. All rights reserved.
  `.trim();
}
