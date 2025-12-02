'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export function LoginForm() {
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
        <>
            <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">
                    Welcome back
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to your account
                </p>
            </div>

            {registered && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm text-center">
                    Account created successfully! Please sign in.
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                    <div className="mt-1">
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-gray-50 text-gray-500">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full flex justify-center items-center gap-3"
                        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                    >
                        <FcGoogle className="w-5 h-5" />
                        <span>Continue with Google</span>
                    </Button>

                    <div className="flex justify-center">
                        <div id="telegram-login-container" />
                    </div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    <Link href="/login/sms" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign in with phone number →
                    </Link>
                </p>
            </div>

            <div className="mt-2 text-center">
                <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Sign up
                    </Link>
                </p>
            </div>
        </>
    );
}
