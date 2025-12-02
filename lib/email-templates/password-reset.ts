export function getPasswordResetEmailHtml(resetUrl: string, name?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - CLEENLY</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
    <h1 style="color: #1a1a1a; margin: 0 0 10px 0; font-size: 28px;">Reset Your Password</h1>
    <p style="color: #666; margin: 0; font-size: 16px;">CLEENLY Account Security</p>
  </div>

  <div style="background: white; padding: 30px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <p style="font-size: 16px; margin: 0 0 20px 0;">${name ? `Hi ${name},` : 'Hello,'}</p>
    
    <p style="font-size: 16px; margin: 0 0 20px 0;">
      We received a request to reset your password for your CLEENLY account. Click the button below to create a new password:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="display: inline-block; background: #1a1a1a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #856404;">
        <strong>⏰ This link expires in 1 hour</strong><br>
        For security reasons, this password reset link will only work once and expires in 1 hour.
      </p>
    </div>

    <p style="font-size: 14px; color: #666; margin: 20px 0;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>
    <p style="font-size: 12px; color: #999; word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 4px;">
      ${resetUrl}
    </p>

    <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0; font-size: 14px; color: #666;">
        <strong>Didn't request this?</strong><br>
        If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
      </p>
    </div>
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

export function getPasswordResetEmailText(resetUrl: string, name?: string): string {
    return `
Reset Your Password - CLEENLY

${name ? `Hi ${name},` : 'Hello,'}

We received a request to reset your password for your CLEENLY account.

Click this link to create a new password:
${resetUrl}

⏰ IMPORTANT: This link expires in 1 hour

For security reasons, this password reset link will only work once and expires in 1 hour.

Didn't request this?
If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

CLEENLY - Professional House Cleaning in Seattle
© ${new Date().getFullYear()} CLEENLY. All rights reserved.
  `.trim();
}
