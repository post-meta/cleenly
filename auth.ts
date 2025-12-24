import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import Email from 'next-auth/providers/email';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { sendMagicLinkEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !secret) {
    const missing = [];
    if (!process.env.SUPABASE_URL) missing.push('SUPABASE_URL');
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    if (!secret) missing.push('AUTH_SECRET/NEXTAUTH_SECRET');

    console.error('Missing required environment variables:', missing.join(', '));
    // In production, we don't want to throw and crash the entire edge runtime if possible,
    // but NextAuth will fail anyway. Let's provide a clear log.
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    trustHost: true,
    secret: secret,
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL || 'https://placeholder-url.supabase.co',
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
    }),
    session: { strategy: 'jwt' },
    providers: [
        Email({
            server: {
                host: 'smtp.resend.com',
                port: 465,
                auth: {
                    user: 'resend',
                    pass: process.env.RESEND_API_KEY!,
                },
            },
            from: 'noreply@cleenly.app',
            sendVerificationRequest: async (params) => {
                const { identifier, url } = params;
                await sendMagicLinkEmail({ email: identifier, url });
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        Credentials({
            id: 'sms',
            name: 'SMS',
            credentials: {
                phone: { label: 'Phone', type: 'text' },
                code: { label: 'Code', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.phone || !credentials?.code) return null;

                // Verify OTP
                // NOTE: 'supabase' client needs to be imported or defined in this scope.
                // Assuming it's available, e.g., from a global client or imported.
                const { data: otpRecord } = await supabase
                    .from('otp_codes')
                    .select('*')
                    .eq('phone', credentials.phone)
                    .eq('code', credentials.code)
                    .eq('used', false)
                    .gt('expires_at', new Date().toISOString())
                    .single();

                if (!otpRecord) return null;

                // Mark OTP as used
                await supabase
                    .from('otp_codes')
                    .update({ used: true })
                    .eq('id', otpRecord.id);

                // Find or create user
                let { data: user } = await supabase
                    .from('users')
                    .select('*')
                    .eq('phone', credentials.phone)
                    .single();

                if (!user) {
                    const { data: newUser } = await supabase
                        .from('users')
                        .insert({ phone: credentials.phone })
                        .select()
                        .single();
                    user = newUser;
                }

                return {
                    id: user.id,
                    phone: user.phone,
                    email: user.email,
                    name: user.name,
                };
            },
        }),
        Credentials({
            id: 'credentials',
            name: 'Email and Password',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Import bcrypt dynamically
                const bcrypt = await import('bcryptjs');

                // Find user by email
                const { data: user } = await supabase
                    .from('users')
                    .select('*')
                    .eq('email', credentials.email)
                    .single();

                if (!user || !user.password) return null;

                // Verify password
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
        Credentials({
            id: 'telegram',
            name: 'Telegram',
            credentials: {
                id: { label: 'ID', type: 'text' },
                first_name: { label: 'First Name', type: 'text' },
                username: { label: 'Username', type: 'text' },
                photo_url: { label: 'Photo URL', type: 'text' },
                auth_date: { label: 'Auth Date', type: 'text' },
                hash: { label: 'Hash', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials) return null;

                // Verify Telegram data
                const botToken = process.env.TELEGRAM_BOT_TOKEN!;
                const { hash, ...data } = credentials;

                const checkString = Object.keys(data)
                    .sort()
                    .map((key) => `${key}=${(data as Record<string, any>)[key]}`)
                    .join('\n');

                const secretKey = crypto
                    .createHash('sha256')
                    .update(botToken)
                    .digest();

                const hmac = crypto
                    .createHmac('sha256', secretKey)
                    .update(checkString)
                    .digest('hex');

                if (hmac !== hash) {
                    return null; // Invalid hash
                }

                // Check auth_date (not older than 1 hour)
                const authDate = parseInt(data.auth_date as string);
                const now = Math.floor(Date.now() / 1000);
                if (now - authDate > 3600) {
                    return null; // Expired
                }

                // Find or create user
                let { data: user } = await supabase
                    .from('users')
                    .select('*')
                    .eq('telegram_id', data.id)
                    .single();

                if (!user) {
                    const { data: newUser } = await supabase
                        .from('users')
                        .insert({
                            telegram_id: data.id,
                            name: data.first_name,
                            username: data.username,
                            profile_photo: data.photo_url,
                        })
                        .select()
                        .single();
                    user = newUser;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.profile_photo,
                };
            },
        }),
    ],
});
