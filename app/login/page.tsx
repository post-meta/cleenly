'use client';

import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gray-50">
                <div className="w-full max-w-2xl min-w-[400px] bg-white shadow-lg rounded-lg p-8 md:p-10">
                    <LoginForm />
                </div>
            </div>
        </Suspense>
    );
}
