'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        setError('');

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/dashboard',
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold">Welcome back</h1>
                    <p className="text-gray-600 mt-2">
                        Sign in to your account
                    </p>
                </div>

                {registered && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm text-center">
                        Account created successfully! Please sign in.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-sm text-gray-600 hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-600">Or continue with</span>
                    </div>
                </div>

                <div className="space-y-3">
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
                </div>

                <p className="text-center text-sm text-gray-600">
                    <Link href="/login/sms" className="text-foreground hover:underline">
                        Sign in with phone number →
                    </Link>
                </p>

                <p className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link href="/register" className="text-foreground hover:underline font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
