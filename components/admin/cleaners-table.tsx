'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toggleCleanerActive, updateCleaner } from '@/app/actions/cleaners';
import { Loader2, Edit2, Check, X } from 'lucide-react';

interface Cleaner {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
    photo_url: string | null;
    notes: string | null;
    is_active: boolean;
    rating: number | null;
    total_bookings: number;
    created_at: string;
}

interface CleanersTableProps {
    cleaners: Cleaner[];
}

export function CleanersTable({ cleaners }: CleanersTableProps) {
    if (cleaners.length === 0) {
        return (
            <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
                <p className="text-gray-600">No cleaners found. Add your first cleaner to get started.</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bookings
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {cleaners.map((cleaner) => (
                        <CleanerRow key={cleaner.id} cleaner={cleaner} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CleanerRow({ cleaner }: { cleaner: Cleaner }) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [editData, setEditData] = useState({
        fullName: cleaner.full_name,
        phone: cleaner.phone,
        email: cleaner.email || '',
    });

    const handleToggleActive = async () => {
        setLoading(true);
        await toggleCleanerActive(cleaner.id, !cleaner.is_active);
        setLoading(false);
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        await updateCleaner(cleaner.id, {
            fullName: editData.fullName,
            phone: editData.phone,
            email: editData.email || undefined,
        });
        setLoading(false);
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setEditData({
            fullName: cleaner.full_name,
            phone: cleaner.phone,
            email: cleaner.email || '',
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <tr className="bg-gray-50">
                <td className="px-6 py-4">
                    <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </td>
                <td className="px-6 py-4">
                    <input
                        type="text"
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </td>
                <td className="px-6 py-4">
                    <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </td>
                <td className="px-6 py-4">
                    <StatusBadge isActive={cleaner.is_active} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                    {cleaner.total_bookings}
                </td>
                <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={handleSaveEdit}
                            disabled={loading}
                            className="p-1 text-green-600 hover:text-green-800 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </td>
            </tr>
        );
    }

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                    {cleaner.photo_url ? (
                        <img
                            src={cleaner.photo_url}
                            alt={cleaner.full_name}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            {cleaner.full_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="font-medium text-gray-900">{cleaner.full_name}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {cleaner.phone}
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {cleaner.email || '-'}
            </td>
            <td className="px-6 py-4">
                <StatusBadge isActive={cleaner.is_active} />
            </td>
            <td className="px-6 py-4 text-sm text-gray-600">
                {cleaner.total_bookings}
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1 text-gray-600 hover:text-gray-900"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleActive}
                        disabled={loading}
                        className="text-xs"
                    >
                        {loading ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                        ) : cleaner.is_active ? (
                            'Deactivate'
                        ) : (
                            'Activate'
                        )}
                    </Button>
                </div>
            </td>
        </tr>
    );
}

function StatusBadge({ isActive }: { isActive: boolean }) {
    return (
        <span
            className={`inline-flex px-2 py-1 text-xs font-medium rounded-sm ${
                isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
            }`}
        >
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}
