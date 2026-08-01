'use server';

/**
 * Admin edits to the availability model.
 *
 * Every export in this file is reachable over HTTP on its own — a Server Action
 * is not protected by the /admin layout that happens to render its form. So each
 * one gates itself with requireAdmin() and validates its own input before the
 * service-role client (which bypasses RLS) touches a row.
 */

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';

const PATH = '/admin/availability';

export type ActionResult = { success: true } | { error: string };

export type BusyWho = 'eugene' | 'inna' | 'both';

export interface AvailabilitySettingsInput {
    autoConfirmEnabled: boolean;
    leadTimeHours: number;
    horizonDays: number;
    maxStaleMinutes: number;
}

export interface WorkingRuleInput {
    works: boolean;
    startMinute: number;
    endMinute: number;
    crewSize: number;
}

export interface ManualBusyBlockInput {
    date: string;
    who: BusyWho;
    allDay: boolean;
    startMinute?: number | null;
    endMinute?: number | null;
    note?: string | null;
}

// ---------------------------------------------------------------------------
// Validation. Everything the browser sends is a string and a suggestion.
// ---------------------------------------------------------------------------

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WHO_VALUES = ['eugene', 'inna', 'both'];

/** Real calendar date, not just the right shape — 2026-02-31 is neither. */
function isRealDate(value: string): boolean {
    if (!DATE_PATTERN.test(value)) return false;
    const [y, m, d] = value.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() === m - 1 &&
        dt.getUTCDate() === d
    );
}

function isMinute(value: unknown): value is number {
    return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 1440
    );
}

function isWholeNumber(value: unknown, min: number, max: number): value is number {
    return (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= min &&
        value <= max
    );
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export async function updateAvailabilitySettings(
    input: AvailabilitySettingsInput
): Promise<ActionResult> {
    await requireAdmin();

    if (!isWholeNumber(input.leadTimeHours, 0, 720)) {
        return { error: 'Lead time must be a whole number of hours, 0 to 720.' };
    }
    if (!isWholeNumber(input.horizonDays, 1, 90)) {
        return { error: 'Horizon must be 1 to 90 days.' };
    }
    if (!isWholeNumber(input.maxStaleMinutes, 1, 10080)) {
        return { error: 'Feed freshness limit must be 1 to 10080 minutes.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('availability_settings').upsert(
        {
            id: true,
            auto_confirm_enabled: Boolean(input.autoConfirmEnabled),
            lead_time_hours: input.leadTimeHours,
            horizon_days: input.horizonDays,
            max_stale_minutes: input.maxStaleMinutes,
            updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
    );

    if (error) {
        console.error('[availability] settings update failed:', error);
        return { error: error.message };
    }

    revalidatePath(PATH);
    return { success: true };
}

export async function updateWorkingRule(
    weekday: number,
    input: WorkingRuleInput
): Promise<ActionResult> {
    await requireAdmin();

    if (!isWholeNumber(weekday, 0, 6)) {
        return { error: 'Weekday must be 0 to 6.' };
    }
    if (!isMinute(input.startMinute) || !isMinute(input.endMinute)) {
        return { error: 'Start and end must be times of day.' };
    }
    if (input.endMinute <= input.startMinute) {
        return { error: 'End must be after start.' };
    }
    if (!isWholeNumber(input.crewSize, 0, 4)) {
        return { error: 'Crew size must be 0 to 4.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('availability_rules').upsert(
        {
            weekday,
            works: Boolean(input.works),
            start_minute: input.startMinute,
            end_minute: input.endMinute,
            crew_size: input.crewSize,
        },
        { onConflict: 'weekday' }
    );

    if (error) {
        console.error('[availability] rule update failed:', error);
        return { error: error.message };
    }

    revalidatePath(PATH);
    return { success: true };
}

export async function addManualBusyBlock(
    input: ManualBusyBlockInput
): Promise<ActionResult> {
    await requireAdmin();

    const date = String(input.date ?? '').trim();
    if (!isRealDate(date)) {
        return { error: 'Enter a real date.' };
    }
    if (!WHO_VALUES.includes(input.who)) {
        return { error: 'Pick who the block is for.' };
    }

    let startMinute: number | null = null;
    let endMinute: number | null = null;

    if (!input.allDay) {
        startMinute = input.startMinute ?? null;
        endMinute = input.endMinute ?? null;
        if (!isMinute(startMinute) || !isMinute(endMinute)) {
            return { error: 'Set both a start and an end, or mark it all day.' };
        }
        if (endMinute <= startMinute) {
            return { error: 'End must be after start.' };
        }
    }

    const note = String(input.note ?? '').trim();
    if (note.length > 500) {
        return { error: 'Keep the note under 500 characters.' };
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('busy_blocks').insert({
        source: 'manual',
        feed_key: 'manual',
        // No source_ref: nothing upstream owns this row, so no sync can claim it.
        source_ref: null,
        who: input.who,
        block_date: date,
        start_minute: startMinute,
        end_minute: endMinute,
        note: note || null,
    });

    if (error) {
        console.error('[availability] block insert failed:', error);
        return { error: error.message };
    }

    revalidatePath(PATH);
    return { success: true };
}

export async function deleteManualBusyBlock(id: string): Promise<ActionResult> {
    await requireAdmin();

    const blockId = String(id ?? '').trim();
    if (!UUID_PATTERN.test(blockId)) {
        return { error: 'Block not found.' };
    }

    const supabase = createAdminClient();
    const { data: block } = await supabase
        .from('busy_blocks')
        .select('id, source, feed_key')
        .eq('id', blockId)
        .maybeSingle();

    if (!block) {
        return { error: 'Block not found.' };
    }

    // A feed row is owned upstream. Deleting it here lasts until the next sync,
    // which would put it straight back and make the calendar look unreliable.
    if (block.source !== 'manual') {
        return {
            error: `This block comes from the ${block.feed_key} feed. Remove it in the source calendar.`,
        };
    }

    const { error } = await supabase
        .from('busy_blocks')
        .delete()
        .eq('id', blockId)
        .eq('source', 'manual');

    if (error) {
        console.error('[availability] block delete failed:', error);
        return { error: error.message };
    }

    revalidatePath(PATH);
    return { success: true };
}

// ---------------------------------------------------------------------------
// Form adapters. The page is a server component, so its forms post FormData
// straight to these; they parse, delegate, and put the outcome in the URL.
// ---------------------------------------------------------------------------

function toInt(value: FormDataEntryValue | null): number {
    const raw = String(value ?? '').trim();
    if (!raw) return Number.NaN;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.trunc(n) : Number.NaN;
}

/** '08:00' -> 480. NaN when the field is empty or malformed. */
function toMinute(value: FormDataEntryValue | null): number {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? '').trim());
    if (!match) return Number.NaN;
    return Number(match[1]) * 60 + Number(match[2]);
}

function checked(value: FormDataEntryValue | null): boolean {
    return value === 'on';
}

/** Send the admin back to the page carrying either the confirmation or the reason. */
function finish(result: ActionResult, done: string): never {
    if ('error' in result) {
        redirect(`${PATH}?error=${encodeURIComponent(result.error)}`);
    }
    redirect(`${PATH}?done=${encodeURIComponent(done)}`);
}

export async function saveSettingsFormAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const result = await updateAvailabilitySettings({
        autoConfirmEnabled: checked(formData.get('auto_confirm_enabled')),
        leadTimeHours: toInt(formData.get('lead_time_hours')),
        horizonDays: toInt(formData.get('horizon_days')),
        maxStaleMinutes: toInt(formData.get('max_stale_minutes')),
    });
    finish(result, 'Switches saved.');
}

export async function saveWorkingRuleFormAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const weekday = toInt(formData.get('weekday'));
    const result = await updateWorkingRule(weekday, {
        works: checked(formData.get('works')),
        startMinute: toMinute(formData.get('start_time')),
        endMinute: toMinute(formData.get('end_time')),
        crewSize: toInt(formData.get('crew_size')),
    });
    finish(result, 'Working pattern saved.');
}

export async function addBusyBlockFormAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const allDay = checked(formData.get('all_day'));
    const result = await addManualBusyBlock({
        date: String(formData.get('block_date') ?? ''),
        who: String(formData.get('who') ?? '') as BusyWho,
        allDay,
        startMinute: allDay ? null : toMinute(formData.get('start_time')),
        endMinute: allDay ? null : toMinute(formData.get('end_time')),
        note: String(formData.get('note') ?? ''),
    });
    finish(result, 'Busy day added.');
}

export async function deleteBusyBlockFormAction(formData: FormData): Promise<void> {
    await requireAdmin();
    const result = await deleteManualBusyBlock(String(formData.get('id') ?? ''));
    finish(result, 'Busy day removed.');
}
