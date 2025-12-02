'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function SMSLoginPage() {
    const [step, setStep] = useState<'phone' | 'code'>('phone');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            if (res.ok) {
                setStep('code');
            } else {
                alert('Failed to send code');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('sms', {
                phone,
                code,
                redirect: false,
                callbackUrl: '/dashboard',
            });

            if (result?.error) {
                alert('Invalid code');
            } else {
                window.location.href = '/dashboard';
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (step === 'code') {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold">Enter verification code</h1>
                        <p className="text-gray-600 mt-2">
                            We sent a 6-digit code to {phone}
                        </p>
                    </div>

                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                                required
                                className="w-full border border-gray-300 px-4 py-3 rounded-sm text-center text-2xl tracking-widest"
                                placeholder="000000"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading || code.length !== 6}
                            className="w-full"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </Button>

                        <Button
                            type="button"
                            variant="link"
                            className="w-full"
                            onClick={() => setStep('phone')}
                        >
                            ← Back
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-semibold">Sign in with phone</h1>
                    <p className="text-gray-600 mt-2">
                        We'll send you a verification code
                    </p>
                </div>

                <form onSubmit={handleSendOTP} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full border border-gray-300 px-4 py-3 rounded-sm"
                            placeholder="+1 (555) 123-4567"
                        />
                        <p className="text-xs text-gray-600 mt-1">
                            Format: +1XXXXXXXXXX
                        </p>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={loading}
                        className="w-full"
                    >
                        {loading ? 'Sending...' : 'Send Code'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
