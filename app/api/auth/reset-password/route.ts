import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { getPasswordResetEmailHtml, getPasswordResetEmailText } from '@/lib/email-templates/password-reset';
import crypto from 'crypto';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Request password reset
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, token, newPassword } = body;

        // If token and newPassword provided, this is a password reset
        if (token && newPassword) {
            return await resetPassword(token, newPassword);
        }

        // Otherwise, this is a password reset request
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user
        const { data: user } = await supabase
            .from('users')
            .select('id, email, name')
            .eq('email', email)
            .single();

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent.',
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

        // Store reset token
        const { error: tokenError } = await supabase
            .from('password_resets')
            .insert({
                user_id: user.id,
                token: resetToken,
                expires_at: expiresAt.toISOString(),
            });

        if (tokenError) {
            console.error('Error creating reset token:', tokenError);
            return NextResponse.json(
                { error: 'Failed to create reset token' },
                { status: 500 }
            );
        }

        // Send reset email
        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

        try {
            if (!resend) {
                console.warn('Resend API key not configured, skipping email');
                return NextResponse.json({
                    success: true,
                    message: 'If an account exists with this email, a password reset link has been sent.',
                });
            }

            await resend.emails.send({
                from: 'CLEENLY <noreply@cleenly.app>',
                to: user.email,
                subject: 'Reset Your Password - CLEENLY',
                html: getPasswordResetEmailHtml(resetUrl, user.name),
                text: getPasswordResetEmailText(resetUrl, user.name),
            });
        } catch (emailError) {
            console.error('Error sending reset email:', emailError);
            return NextResponse.json(
                { error: 'Failed to send reset email' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent.',
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// Reset password with token
async function resetPassword(token: string, newPassword: string) {
    try {
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Find valid reset token
        const { data: resetRecord } = await supabase
            .from('password_resets')
            .select('*')
            .eq('token', token)
            .eq('used', false)
            .gt('expires_at', new Date().toISOString())
            .single();

        if (!resetRecord) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hash(newPassword, 12);

        // Update user password
        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', resetRecord.user_id);

        if (updateError) {
            console.error('Error updating password:', updateError);
            return NextResponse.json(
                { error: 'Failed to update password' },
                { status: 500 }
            );
        }

        // Mark token as used
        await supabase
            .from('password_resets')
            .update({ used: true })
            .eq('id', resetRecord.id);

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
