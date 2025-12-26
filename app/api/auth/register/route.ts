import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { getWelcomeEmailHtml, getWelcomeEmailText } from '@/lib/email-templates/welcome';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, name, phone } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                email,
                password: hashedPassword,
                name: name || null,
                phone: phone || null,
            })
            .select()
            .single();

        if (createError) {
            console.error('Error creating user:', createError);
            return NextResponse.json(
                { error: 'Failed to create user' },
                { status: 500 }
            );
        }

        // Send welcome email
        try {
            if (resend) {
                await resend.emails.send({
                    from: 'CLEENLY <noreply@cleenly.app>',
                    to: email,
                    subject: 'Welcome to CLEENLY! 🎉',
                    html: getWelcomeEmailHtml(name || 'there'),
                    text: getWelcomeEmailText(name || 'there'),
                });
            } else {
                console.warn('Resend API key not configured, skipping welcome email');
            }
        } catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail registration if email fails
        }

        return NextResponse.json({
            success: true,
            user: {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
