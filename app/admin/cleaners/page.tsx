import { getCleaners } from '@/app/actions/cleaners';
import { CleanersTable } from '@/components/admin/cleaners-table';
import { AddCleanerButton } from './add-cleaner-button';

export default async function CleanersPage() {
    const { data: cleaners, error } = await getCleaners();

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                Error loading cleaners: {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Cleaners</h1>
                <AddCleanerButton />
            </div>

            <CleanersTable cleaners={cleaners || []} />
        </div>
    );
}
