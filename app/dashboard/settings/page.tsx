import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { User, Lock, Bell, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default async function SettingsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const user = session.user;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">Settings</h1>
                <p className="text-gray-600 mt-2">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Information */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Profile Information</h2>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Full Name
                        </label>
                        <Input
                            type="text"
                            defaultValue={user?.name || ''}
                            placeholder="Your name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <Input
                            type="email"
                            defaultValue={user?.email || ''}
                            placeholder="your@email.com"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Used for booking confirmations and account notifications
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Phone Number
                        </label>
                        <Input
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Cleaner will use this to contact you on service day
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>

            {/* Password & Security */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Password & Security</h2>
                        <p className="text-sm text-gray-600">Manage your password</p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Current Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter current password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            New Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" variant="secondary">
                            Update Password
                        </Button>
                    </div>
                </form>
            </div>

            {/* Notification Preferences */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">Notifications</h2>
                        <p className="text-sm text-gray-600">Choose how you want to be notified</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <div>
                            <p className="font-medium">Booking Confirmations</p>
                            <p className="text-sm text-gray-600">
                                Get notified when your booking is confirmed
                            </p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            defaultChecked
                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <div>
                            <p className="font-medium">Service Reminders</p>
                            <p className="text-sm text-gray-600">
                                Reminder 24 hours before your scheduled cleaning
                            </p>
                        </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                        <div>
                            <p className="font-medium">Marketing & Promotions</p>
                            <p className="text-sm text-gray-600">
                                Receive special offers and cleaning tips
                            </p>
                        </div>
                    </label>

                    <div className="pt-4">
                        <Button type="button">
                            Save Preferences
                        </Button>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 rounded-lg p-6 bg-red-50/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-red-100 rounded-sm flex items-center justify-center">
                        <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
                        <p className="text-sm text-red-700">Irreversible actions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-red-900 mb-2">Delete Account</h3>
                        <p className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. All your data,
                            bookings, and preferences will be permanently deleted.
                        </p>
                        <Button variant="destructive">
                            Delete My Account
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
