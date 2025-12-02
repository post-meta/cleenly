'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // Load Telegram Widget script
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME!);
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '2');
        script.setAttribute('data-request-access', 'write');
        script.async = true;

        // Callback when user logs in
        (window as any).onTelegramAuth = async (user: any) => {
            await signIn('telegram', {
                ...user,
                redirect: true,
                callbackUrl: '/dashboard',
            });
        };

        script.setAttribute('data-onauth', 'onTelegramAuth(user)');

        document.getElementById('telegram-login-container')?.appendChild(script);

        return () => {
            delete (window as any).onTelegramAuth;
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await signIn('email', { email, redirect: false });
            setEmailSent(true);
        } catch (error) {
            console.error('Error signing in:', error);
        } finally {
            setLoading(false);
        }
    };

    if (emailSent) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full space-y-6 text-center">
                    <h1 className="text-3xl font-semibold">Check your email</h1>
                    <p className="text-gray-600">
                        We sent a sign-in link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                        Click the link in the email to sign in. The link expires in 24 hours.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold">Sign in to CLEENLY</h1>
                    <p className="text-gray-600 mt-2">
                        Enter your email to receive a sign-in link
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-sm"
                            placeholder="you@example.com"
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Sending...' : 'Send Sign-In Link'}
                    </Button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Or sign in with
                    </p>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-600">Or continue with</span>
                    </div>
                </div>

                <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Continue with Google
                </Button>

                {/* Telegram Widget */}
                <div className="flex justify-center">
                    <div id="telegram-login-container" />
                </div>

                <p className="text-center text-sm text-gray-600">
                    <a href="/login/sms" className="text-accent hover:underline">
                        Or sign in with phone number →
                    </a>
                </p>

                <p className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <a href="/register" className="text-accent hover:underline font-medium">
                        Sign up
                    </a>
                </p>

                <p className="text-center text-sm">
                    <a href="/forgot-password" className="text-gray-600 hover:underline">
                        Forgot your password?
                    </a>
                </p>
            </div>
        </div>
    );
}
