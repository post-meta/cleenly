import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SettingsForms } from '@/components/dashboard/settings-forms';

export default async function SettingsPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const uid = (session.user as { id?: string } | undefined)?.id;

    const { data: user } = uid
        ? await supabase
              .from('users')
              .select('name, email, phone, password, preferences')
              .eq('id', uid)
              .single()
        : { data: null };

    const prefs = (user?.preferences as { notifications?: Record<string, boolean> } | null)?.notifications;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-semibold">Settings</h1>
                <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
            </div>

            <SettingsForms
                initialName={user?.name || session.user?.name || ''}
                email={user?.email || session.user?.email || ''}
                initialPhone={user?.phone || ''}
                hasPassword={!!user?.password}
                initialNotifications={{
                    booking_confirmations: prefs?.booking_confirmations ?? true,
                    service_reminders: prefs?.service_reminders ?? true,
                    marketing: prefs?.marketing ?? false,
                }}
            />
        </div>
    );
}
