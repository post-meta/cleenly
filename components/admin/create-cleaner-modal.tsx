'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createCleaner } from '@/app/actions/cleaners';
import { Loader2, X } from 'lucide-react';

interface CreateCleanerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateCleanerModal({ isOpen, onClose }: CreateCleanerModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        photoUrl: '',
        notes: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await createCleaner({
            fullName: formData.fullName,
            phone: formData.phone,
            email: formData.email || undefined,
            photoUrl: formData.photoUrl || undefined,
            notes: formData.notes || undefined,
        });

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        // Reset form and close modal
        setFormData({
            fullName: '',
            phone: '',
            email: '',
            photoUrl: '',
            notes: '',
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold">Add New Cleaner</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <Input
                        name="fullName"
                        label="Full Name"
                        placeholder="Maria Rodriguez"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        name="phone"
                        label="Phone"
                        placeholder="206-555-0101"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        pattern="[0-9\-\+\(\)\s]+"
                    />

                    <Input
                        name="email"
                        label="Email (optional)"
                        type="email"
                        placeholder="maria@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <Input
                        name="photoUrl"
                        label="Photo URL (optional)"
                        type="url"
                        placeholder="https://..."
                        value={formData.photoUrl}
                        onChange={handleChange}
                    />

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Notes (optional)
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            placeholder="Prefers Eastside, has own supplies"
                        />
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Create Cleaner
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
