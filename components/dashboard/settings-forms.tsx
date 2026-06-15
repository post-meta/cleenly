'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { User, Lock, Bell, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    updateProfile,
    changePassword,
    saveNotificationPrefs,
    deactivateAccount,
} from '@/app/dashboard/settings/actions';

type Notifications = {
    booking_confirmations: boolean;
    service_reminders: boolean;
    marketing: boolean;
};

function Status({ state }: { state: { ok?: string; err?: string } | null }) {
    if (!state) return null;
    return (
        <p className={`text-sm ${state.err ? 'text-red-600' : 'text-green-700'}`}>
            {state.err || state.ok}
        </p>
    );
}

export function SettingsForms({
    initialName,
    email,
    initialPhone,
    hasPassword,
    initialNotifications,
}: {
    initialName: string;
    email: string;
    initialPhone: string;
    hasPassword: boolean;
    initialNotifications: Notifications;
}) {
    // Profile
    const [name, setName] = useState(initialName);
    const [phone, setPhone] = useState(initialPhone);
    const [profileBusy, setProfileBusy] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ ok?: string; err?: string } | null>(null);

    // Password
    const [current, setCurrent] = useState('');
    const [next, setNext] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwBusy, setPwBusy] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ ok?: string; err?: string } | null>(null);

    // Notifications
    const [notif, setNotif] = useState<Notifications>(initialNotifications);
    const [notifBusy, setNotifBusy] = useState(false);
    const [notifMsg, setNotifMsg] = useState<{ ok?: string; err?: string } | null>(null);

    // Danger zone
    const [confirmDelete, setConfirmDelete] = useState('');
    const [deleteBusy, setDeleteBusy] = useState(false);
    const [deleteMsg, setDeleteMsg] = useState<{ ok?: string; err?: string } | null>(null);

    async function onProfile(e: React.FormEvent) {
        e.preventDefault();
        setProfileBusy(true);
        setProfileMsg(null);
        const res = await updateProfile({ name, phone });
        setProfileBusy(false);
        setProfileMsg('error' in res ? { err: res.error } : { ok: 'Profile saved' });
    }

    async function onPassword(e: React.FormEvent) {
        e.preventDefault();
        if (next !== confirmPw) {
            setPwMsg({ err: 'New passwords do not match' });
            return;
        }
        setPwBusy(true);
        setPwMsg(null);
        const res = await changePassword({ current, next });
        setPwBusy(false);
        if ('error' in res) setPwMsg({ err: res.error });
        else {
            setPwMsg({ ok: 'Password updated' });
            setCurrent('');
            setNext('');
            setConfirmPw('');
        }
    }

    async function onNotif() {
        setNotifBusy(true);
        setNotifMsg(null);
        const res = await saveNotificationPrefs(notif);
        setNotifBusy(false);
        setNotifMsg('error' in res ? { err: res.error } : { ok: 'Preferences saved' });
    }

    async function onDelete() {
        setDeleteBusy(true);
        setDeleteMsg(null);
        const res = await deactivateAccount({ confirm: confirmDelete });
        if ('error' in res) {
            setDeleteBusy(false);
            setDeleteMsg({ err: res.error });
            return;
        }
        await signOut({ callbackUrl: '/' });
    }

    return (
        <div className="space-y-8">
            {/* Profile */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center">
                        <User className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h2 className="font-sans text-xl font-semibold">Profile Information</h2>
                        <p className="text-sm text-gray-600">Update your personal details</p>
                    </div>
                </div>

                <form onSubmit={onProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <Input type="email" value={email} disabled />
                        <p className="text-xs text-gray-500 mt-1">Email is used to sign in and can't be changed here.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                        <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567" />
                        <p className="text-xs text-gray-500 mt-1">Your cleaner uses this to reach you on service day.</p>
                    </div>
                    <div className="pt-2 flex items-center gap-4">
                        <Button type="submit" disabled={profileBusy}>
                            {profileBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                        </Button>
                        <Status state={profileMsg} />
                    </div>
                </form>
            </div>

            {/* Password */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Lock className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="font-sans text-xl font-semibold">Password &amp; Security</h2>
                        <p className="text-sm text-gray-600">
                            {hasPassword ? 'Change your password' : 'Set a password for email sign-in'}
                        </p>
                    </div>
                </div>

                <form onSubmit={onPassword} className="space-y-4">
                    {hasPassword && (
                        <div>
                            <label className="block text-sm font-medium mb-2">Current Password</label>
                            <Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="Enter current password" />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-2">New Password</label>
                        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                        <Input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" />
                    </div>
                    <div className="pt-2 flex items-center gap-4">
                        <Button type="submit" variant="secondary" disabled={pwBusy}>
                            {pwBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : hasPassword ? 'Update Password' : 'Set Password'}
                        </Button>
                        <Status state={pwMsg} />
                    </div>
                </form>
            </div>

            {/* Notifications */}
            <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                        <h2 className="font-sans text-xl font-semibold">Notifications</h2>
                        <p className="text-sm text-gray-600">Choose how you want to be notified</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {([
                        ['booking_confirmations', 'Booking Confirmations', 'Get notified when your booking is confirmed'],
                        ['service_reminders', 'Service Reminders', 'Reminder 24 hours before your scheduled cleaning'],
                        ['marketing', 'Marketing & Promotions', 'Receive special offers and cleaning tips'],
                    ] as const).map(([key, title, desc]) => (
                        <label key={key} className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notif[key]}
                                onChange={(e) => setNotif({ ...notif, [key]: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-300 text-accent focus:ring-accent"
                            />
                            <div>
                                <p className="font-medium">{title}</p>
                                <p className="text-sm text-gray-600">{desc}</p>
                            </div>
                        </label>
                    ))}
                    <div className="pt-2 flex items-center gap-4">
                        <Button type="button" onClick={onNotif} disabled={notifBusy}>
                            {notifBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Preferences'}
                        </Button>
                        <Status state={notifMsg} />
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
                        <h2 className="font-sans text-xl font-semibold text-red-900">Danger Zone</h2>
                        <p className="text-sm text-red-700">Irreversible actions</p>
                    </div>
                </div>

                <h3 className="font-medium text-red-900 mb-2">Close Account</h3>
                <p className="text-sm text-red-700 mb-4">
                    This deactivates your account and signs you out. Type <strong>DELETE</strong> to confirm.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <Input
                        type="text"
                        value={confirmDelete}
                        onChange={(e) => setConfirmDelete(e.target.value)}
                        placeholder="DELETE"
                        className="sm:max-w-[160px]"
                    />
                    <Button
                        variant="primary"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={deleteBusy || confirmDelete !== 'DELETE'}
                        onClick={onDelete}
                    >
                        {deleteBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Close My Account'}
                    </Button>
                    <Status state={deleteMsg} />
                </div>
            </div>
        </div>
    );
}
