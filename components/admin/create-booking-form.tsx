'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createBooking } from '@/app/actions/bookings';
import { Loader2 } from 'lucide-react';

interface Cleaner {
    id: string;
    full_name: string;
}

interface Customer {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
}

interface CreateBookingFormProps {
    cleaners: Cleaner[];
    customers: Customer[];
}

export function CreateBookingForm({ cleaners, customers }: CreateBookingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        // Customer
        customerId: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        useExistingCustomer: false,

        // Service
        serviceType: 'regular',
        bedrooms: '',
        bathrooms: '',
        squareFeet: '',

        // Address
        addressLine1: '',
        addressLine2: '',
        city: 'Seattle',
        state: 'WA',
        zip: '',

        // Schedule
        scheduledDate: '',
        scheduledStart: '',
        estimatedDuration: '',

        // Pricing
        priceEstimated: '',
        priceFinal: '',

        // Assignment
        cleanerId: '',

        // Notes
        customerNotes: '',
        adminNotes: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData((prev) => ({ ...prev, [name]: val }));
    };

    const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const customerId = e.target.value;
        if (customerId) {
            const customer = customers.find((c) => c.id === customerId);
            if (customer) {
                setFormData((prev) => ({
                    ...prev,
                    customerId,
                    customerName: customer.name || '',
                    customerEmail: customer.email || '',
                    customerPhone: customer.phone || '',
                    useExistingCustomer: true,
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                customerId: '',
                useExistingCustomer: false,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await createBooking({
            customerId: formData.customerId || undefined,
            customerName: formData.customerName || undefined,
            customerEmail: formData.customerEmail || undefined,
            customerPhone: formData.customerPhone || undefined,
            serviceType: formData.serviceType,
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
            bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
            squareFeet: formData.squareFeet || undefined,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2 || undefined,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            scheduledDate: formData.scheduledDate,
            scheduledStart: formData.scheduledStart || undefined,
            estimatedDuration: formData.estimatedDuration
                ? parseInt(formData.estimatedDuration)
                : undefined,
            priceEstimated: formData.priceEstimated
                ? parseFloat(formData.priceEstimated)
                : undefined,
            priceFinal: parseFloat(formData.priceFinal),
            cleanerId: formData.cleanerId || undefined,
            customerNotes: formData.customerNotes || undefined,
            adminNotes: formData.adminNotes || undefined,
        });

        setLoading(false);

        if (result.error) {
            setError(result.error);
            return;
        }

        if (result.data) {
            router.push(`/admin/bookings/${result.data.id}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Section 1: Customer */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Customer</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Select Existing Customer
                        </label>
                        <select
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleCustomerSelect}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">-- New Customer --</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name || customer.email || customer.phone}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Input
                            name="customerName"
                            label="Name"
                            value={formData.customerName}
                            onChange={handleChange}
                            placeholder="John Smith"
                        />
                        <Input
                            name="customerEmail"
                            label="Email"
                            type="email"
                            value={formData.customerEmail}
                            onChange={handleChange}
                            placeholder="john@example.com"
                        />
                        <Input
                            name="customerPhone"
                            label="Phone"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="206-555-0100"
                        />
                    </div>
                </div>
            </section>

            {/* Section 2: Service Details */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Service Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Service Type
                        </label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="regular">Regular Cleaning</option>
                            <option value="deep">Deep Cleaning</option>
                            <option value="move_out">Move-Out Cleaning</option>
                        </select>
                    </div>

                    <Input
                        name="bedrooms"
                        label="Bedrooms"
                        type="number"
                        min="0"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        placeholder="2"
                    />

                    <Input
                        name="bathrooms"
                        label="Bathrooms"
                        type="number"
                        min="0"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        placeholder="1.5"
                    />

                    <Input
                        name="squareFeet"
                        label="Square Feet"
                        value={formData.squareFeet}
                        onChange={handleChange}
                        placeholder="1200"
                    />
                </div>
            </section>

            {/* Section 3: Address */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Address</h2>

                <div className="space-y-4">
                    <Input
                        name="addressLine1"
                        label="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleChange}
                        required
                        placeholder="123 Main Street"
                    />

                    <Input
                        name="addressLine2"
                        label="Address Line 2 (optional)"
                        value={formData.addressLine2}
                        onChange={handleChange}
                        placeholder="Apt 4B"
                    />

                    <div className="grid grid-cols-3 gap-4">
                        <Input
                            name="city"
                            label="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="state"
                            label="State"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="zip"
                            label="ZIP"
                            value={formData.zip}
                            onChange={handleChange}
                            required
                            placeholder="98101"
                        />
                    </div>
                </div>
            </section>

            {/* Section 4: Schedule */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Schedule</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                        name="scheduledDate"
                        label="Date"
                        type="date"
                        value={formData.scheduledDate}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        name="scheduledStart"
                        label="Start Time (optional)"
                        type="time"
                        value={formData.scheduledStart}
                        onChange={handleChange}
                    />

                    <Input
                        name="estimatedDuration"
                        label="Estimated Duration (hours)"
                        type="number"
                        min="1"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        placeholder="3"
                    />
                </div>
            </section>

            {/* Section 5: Pricing */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        name="priceEstimated"
                        label="Estimated Price ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceEstimated}
                        onChange={handleChange}
                        placeholder="150.00"
                    />

                    <Input
                        name="priceFinal"
                        label="Final Price ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.priceFinal}
                        onChange={handleChange}
                        required
                        placeholder="150.00"
                    />
                </div>
            </section>

            {/* Section 6: Assignment */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Assignment</h2>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Assign Cleaner (optional)
                    </label>
                    <select
                        name="cleanerId"
                        value={formData.cleanerId}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                        <option value="">-- Unassigned --</option>
                        {cleaners.map((cleaner) => (
                            <option key={cleaner.id} value={cleaner.id}>
                                {cleaner.full_name}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            {/* Section 7: Notes */}
            <section className="bg-white border border-gray-200 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Notes</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Customer Notes
                        </label>
                        <textarea
                            name="customerNotes"
                            value={formData.customerNotes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Special requests from customer..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Admin Notes
                        </label>
                        <textarea
                            name="adminNotes"
                            value={formData.adminNotes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-foreground focus:border-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Internal notes for staff..."
                        />
                    </div>
                </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                    {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Create Booking
                </Button>
            </div>
        </form>
    );
}
