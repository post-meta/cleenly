'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteAddress, setDefaultAddress } from '@/app/dashboard/addresses/actions';

export function AddressCardActions({
    addressId,
    isDefault,
}: {
    addressId: string;
    isDefault: boolean;
}) {
    const [pending, startTransition] = useTransition();
    const [err, setErr] = useState('');

    function onSetDefault() {
        setErr('');
        startTransition(async () => {
            const res = await setDefaultAddress(addressId);
            if ('error' in res) setErr(res.error);
        });
    }

    function onDelete() {
        if (!confirm('Delete this address?')) return;
        setErr('');
        startTransition(async () => {
            const res = await deleteAddress(addressId);
            if ('error' in res) setErr(res.error);
        });
    }

    return (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Link
                href={`/dashboard/addresses/${addressId}/edit`}
                className="text-sm text-accent hover:underline"
            >
                Edit
            </Link>
            {!isDefault && (
                <>
                    <span className="text-gray-300">•</span>
                    <button
                        onClick={onSetDefault}
                        disabled={pending}
                        className="text-sm text-gray-600 hover:text-foreground disabled:opacity-50"
                    >
                        Set as Default
                    </button>
                </>
            )}
            <span className="text-gray-300 ml-auto">•</span>
            <button
                onClick={onDelete}
                disabled={pending}
                className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 disabled:opacity-50"
            >
                <Trash2 className="w-3 h-3" />
                Delete
            </button>
            {err && <span className="text-xs text-red-600 w-full">{err}</span>}
        </div>
    );
}
