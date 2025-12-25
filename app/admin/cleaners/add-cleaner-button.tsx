'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreateCleanerModal } from '@/components/admin/create-cleaner-modal';
import { Plus } from 'lucide-react';

export function AddCleanerButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Cleaner
            </Button>
            <CreateCleanerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
