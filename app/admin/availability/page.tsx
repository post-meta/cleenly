import { requireAdmin } from '@/lib/auth/admin';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatMinute } from '@/lib/availability/intervals';
import { nowInSeattle, TIMEZONE } from '@/lib/availability/resolver';
import {
    addBusyBlockFormAction,
    deleteBusyBlockFormAction,
    saveSettingsFormAction,
    saveWorkingRuleFormAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface SettingsRow {
    auto_confirm_enabled: boolean;
    lead_time_hours: number;
    horizon_days: number;
    max_stale_minutes: number;
}

interface RuleRow {
    weekday: number;
    works: boolean;
    start_minute: number;
    end_minute: number;
    crew_size: number;
}

interface BlockRow {
    id: string;
    source: 'ical' | 'manual' | 'smartsheet';
    feed_key: string;
    who: 'eugene' | 'inna' | 'both';
    block_date: string;
    start_minute: number | null;
    end_minute: number | null;
    note: string | null;
}

interface SyncRow {
    feed_key: string;
    enabled: boolean;
    last_success_at: string | null;
    last_attempt_at: string | null;
    last_error: string | null;
    blocks_synced: number;
}

const WEEKDAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

// Read the week the way the crew works it, not the way Postgres numbers it.
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

const WHO_LABELS: Record<BlockRow['who'], string> = {
    eugene: 'Eugene',
    inna: 'Inna',
    both: 'Both',
};

const GRID = 'grid-cols-[7rem_4rem_8rem_8rem_5rem_auto]';

/** Minutes from midnight -> the value an <input type="time"> expects. */
function timeValue(minute: number): string {
    const m = Math.min(Math.max(minute, 0), 1439);
    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

function formatBlockDate(date: string): string {
    const [y, m, d] = date.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', {
        timeZone: 'UTC',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

function formatStamp(value: string | null): string {
    if (!value) return 'never';
    return new Date(value).toLocaleString('en-US', {
        timeZone: TIMEZONE,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

/**
 * Feeds that are enabled but have gone quiet. Same test the resolver applies —
 * a feed with no success at all counts as stale, not as an empty calendar.
 */
function staleFeedKeys(feeds: SyncRow[], maxStaleMinutes: number): string[] {
    const cutoff = Date.now() - maxStaleMinutes * 60_000;
    return feeds
        .filter(
            (feed) =>
                feed.enabled &&
                (!feed.last_success_at ||
                    new Date(feed.last_success_at).getTime() < cutoff)
        )
        .map((feed) => feed.feed_key);
}

function NumberField({
    name,
    label,
    help,
    defaultValue,
    min,
    max,
}: {
    name: string;
    label: string;
    help: string;
    defaultValue: number;
    min: number;
    max: number;
}) {
    return (
        <div className="space-y-1">
            <label htmlFor={name} className="block text-sm font-medium">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                step={1}
                defaultValue={defaultValue}
                className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
            />
            <p className="text-xs text-foreground-muted">{help}</p>
        </div>
    );
}

export default async function AdminAvailabilityPage({
    searchParams,
}: {
    searchParams: Promise<{ done?: string; error?: string }>;
}) {
    await requireAdmin();

    const { done, error } = await searchParams;
    const supabase = createAdminClient();
    const today = nowInSeattle().date;

    const [settingsRes, rulesRes, blocksRes, syncRes] = await Promise.all([
        supabase.from('availability_settings').select('*').eq('id', true).maybeSingle(),
        supabase.from('availability_rules').select('*'),
        supabase
            .from('busy_blocks')
            .select('id, source, feed_key, who, block_date, start_minute, end_minute, note')
            .gte('block_date', today)
            .order('block_date', { ascending: true })
            .order('start_minute', { ascending: true, nullsFirst: true })
            .limit(200),
        supabase.from('availability_sync_state').select('*').order('feed_key'),
    ]);

    // Same fallbacks the resolver uses, so the screen cannot show one thing and
    // the wizard act on another.
    const settings: SettingsRow = (settingsRes.data as SettingsRow | null) ?? {
        auto_confirm_enabled: false,
        lead_time_hours: 24,
        horizon_days: 14,
        max_stale_minutes: 180,
    };

    const ruleByWeekday = new Map<number, RuleRow>(
        ((rulesRes.data ?? []) as RuleRow[]).map((r) => [r.weekday, r])
    );
    const rules: RuleRow[] = WEEKDAY_ORDER.map(
        (weekday) =>
            ruleByWeekday.get(weekday) ?? {
                weekday,
                works: weekday !== 0,
                start_minute: 480,
                end_minute: 960,
                crew_size: 2,
            }
    );

    const blocks = (blocksRes.data ?? []) as BlockRow[];
    const feeds = (syncRes.data ?? []) as SyncRow[];

    const staleFeeds = staleFeedKeys(feeds, settings.max_stale_minutes);

    return (
        <div className="space-y-8 p-6">
            <div>
                <h1 className="text-3xl font-semibold">Availability</h1>
                <p className="mt-2 max-w-[70ch] text-sm text-foreground-soft">
                    The working pattern below, minus busy days and visits already booked,
                    is what the booking wizard offers. Auto-confirm decides whether a
                    request that fits becomes a confirmed visit on its own.
                </p>

                {done ? (
                    <p className="mt-3 rounded-sm border border-mushroom bg-surface-warm p-3 text-sm">
                        {done}
                    </p>
                ) : null}
                {error ? (
                    <p className="mt-3 rounded-sm border border-red-300 bg-red-50 p-3 text-sm text-red-800">
                        {error}
                    </p>
                ) : null}

                {staleFeeds.length ? (
                    <p className="mt-3 rounded-sm border border-mushroom bg-surface-warm p-3 text-sm">
                        {staleFeeds.length === 1 ? 'One feed has' : `${staleFeeds.length} feeds have`}{' '}
                        not synced inside the freshness limit: {staleFeeds.join(', ')}.
                        Auto-confirm is withdrawn until they sync. New bookings wait for a
                        human.
                    </p>
                ) : null}
            </div>

            <section className="rounded-lg border border-mushroom bg-background p-5">
                <h2 className="text-lg font-medium">Switches</h2>
                <form action={saveSettingsFormAction} className="mt-4 space-y-5">
                    <div className="flex items-start gap-3">
                        <input
                            id="auto_confirm_enabled"
                            name="auto_confirm_enabled"
                            type="checkbox"
                            defaultChecked={settings.auto_confirm_enabled}
                            className="mt-1 h-4 w-4"
                        />
                        <div>
                            <label
                                htmlFor="auto_confirm_enabled"
                                className="block text-sm font-medium"
                            >
                                Confirm bookings that fit, without asking
                            </label>
                            <p className="text-xs text-foreground-muted">
                                Off means every booking waits for a human.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <NumberField
                            name="lead_time_hours"
                            label="Lead time (hours)"
                            help="Earliest visit we offer, counted from now."
                            defaultValue={settings.lead_time_hours}
                            min={0}
                            max={720}
                        />
                        <NumberField
                            name="horizon_days"
                            label="Horizon (days)"
                            help="How far ahead the wizard offers dates."
                            defaultValue={settings.horizon_days}
                            min={1}
                            max={90}
                        />
                        <NumberField
                            name="max_stale_minutes"
                            label="Feed freshness (minutes)"
                            help="A feed silent longer than this withdraws auto-confirm."
                            defaultValue={settings.max_stale_minutes}
                            min={1}
                            max={10080}
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background"
                    >
                        Save switches
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-lg font-medium">Working pattern</h2>
                <p className="mt-1 max-w-[70ch] text-sm text-foreground-muted">
                    Baseline hours per weekday. Crew size is how many cleaners that day
                    has: two cleaners do the same job in half the wall-clock time.
                </p>

                <div className="mt-3 overflow-x-auto">
                    <div className="min-w-[46rem] rounded-lg border border-mushroom bg-background">
                        <div
                            className={`grid ${GRID} gap-3 border-b border-mushroom/50 px-4 py-2 text-xs uppercase tracking-wide text-foreground-muted`}
                        >
                            <span>Day</span>
                            <span>Works</span>
                            <span>Start</span>
                            <span>End</span>
                            <span>Crew</span>
                            <span />
                        </div>

                        {rules.map((rule) => (
                            <form
                                key={rule.weekday}
                                action={saveWorkingRuleFormAction}
                                className={`grid ${GRID} items-center gap-3 border-b border-mushroom/50 px-4 py-3 last:border-b-0`}
                            >
                                <input type="hidden" name="weekday" value={rule.weekday} />

                                <span className="text-sm font-medium">
                                    {WEEKDAY_NAMES[rule.weekday]}
                                </span>

                                <span>
                                    <label htmlFor={`works-${rule.weekday}`} className="sr-only">
                                        {WEEKDAY_NAMES[rule.weekday]} is a working day
                                    </label>
                                    <input
                                        id={`works-${rule.weekday}`}
                                        name="works"
                                        type="checkbox"
                                        defaultChecked={rule.works}
                                        className="h-4 w-4"
                                    />
                                </span>

                                <span>
                                    <label htmlFor={`start-${rule.weekday}`} className="sr-only">
                                        {WEEKDAY_NAMES[rule.weekday]} start
                                    </label>
                                    <input
                                        id={`start-${rule.weekday}`}
                                        name="start_time"
                                        type="time"
                                        defaultValue={timeValue(rule.start_minute)}
                                        className="w-full rounded-sm border border-mushroom bg-background px-2 py-1.5 text-sm"
                                    />
                                </span>

                                <span>
                                    <label htmlFor={`end-${rule.weekday}`} className="sr-only">
                                        {WEEKDAY_NAMES[rule.weekday]} end
                                    </label>
                                    <input
                                        id={`end-${rule.weekday}`}
                                        name="end_time"
                                        type="time"
                                        defaultValue={timeValue(rule.end_minute)}
                                        className="w-full rounded-sm border border-mushroom bg-background px-2 py-1.5 text-sm"
                                    />
                                </span>

                                <span>
                                    <label htmlFor={`crew-${rule.weekday}`} className="sr-only">
                                        {WEEKDAY_NAMES[rule.weekday]} crew size
                                    </label>
                                    <input
                                        id={`crew-${rule.weekday}`}
                                        name="crew_size"
                                        type="number"
                                        inputMode="numeric"
                                        min={0}
                                        max={4}
                                        step={1}
                                        defaultValue={rule.crew_size}
                                        className="w-full rounded-sm border border-mushroom bg-background px-2 py-1.5 text-sm"
                                    />
                                </span>

                                <span>
                                    <button
                                        type="submit"
                                        className="rounded-md border border-mushroom px-3 py-1.5 text-sm"
                                    >
                                        Save
                                    </button>
                                </span>
                            </form>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-mushroom bg-background p-5">
                <h2 className="text-lg font-medium">Add a busy day</h2>
                <form action={addBusyBlockFormAction} className="mt-4 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-1">
                            <label htmlFor="block_date" className="block text-sm font-medium">
                                Date
                            </label>
                            <input
                                id="block_date"
                                name="block_date"
                                type="date"
                                defaultValue={today}
                                className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="who" className="block text-sm font-medium">
                                Who
                            </label>
                            <select
                                id="who"
                                name="who"
                                defaultValue="both"
                                className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                            >
                                <option value="both">Both</option>
                                <option value="eugene">Eugene</option>
                                <option value="inna">Inna</option>
                            </select>
                            <p className="text-xs text-foreground-muted">
                                One person out halves the crew. Both closes the day.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="new-start" className="block text-sm font-medium">
                                Start
                            </label>
                            <input
                                id="new-start"
                                name="start_time"
                                type="time"
                                className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="new-end" className="block text-sm font-medium">
                                End
                            </label>
                            <input
                                id="new-end"
                                name="end_time"
                                type="time"
                                className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input id="all_day" name="all_day" type="checkbox" className="h-4 w-4" />
                        <label htmlFor="all_day" className="text-sm">
                            All day
                        </label>
                        <span className="text-xs text-foreground-muted">
                            Tick this, or set both a start and an end.
                        </span>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="note" className="block text-sm font-medium">
                            Note
                        </label>
                        <input
                            id="note"
                            name="note"
                            className="w-full rounded-sm border border-mushroom bg-background px-3 py-2 text-sm"
                            placeholder="Dentist, 164th walkthrough"
                        />
                        <p className="text-xs text-foreground-muted">
                            Optional. Admin only, the customer never sees it.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-background"
                    >
                        Add busy day
                    </button>
                </form>
            </section>

            <section>
                <h2 className="text-lg font-medium">Busy days</h2>
                <p className="mt-1 max-w-[70ch] text-sm text-foreground-muted">
                    Today onward. Rows from a feed are read-only here: the next sync would
                    overwrite the change. Edit those in the calendar they come from.
                </p>

                {blocks.length === 0 ? (
                    <p className="mt-3 text-sm text-foreground-muted">
                        Nothing blocked ahead. Every working day is offered in full.
                    </p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                                <tr>
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">When</th>
                                    <th className="py-2 pr-4">Who</th>
                                    <th className="py-2 pr-4">Source</th>
                                    <th className="py-2 pr-4">Note</th>
                                    <th className="py-2" />
                                </tr>
                            </thead>
                            <tbody>
                                {blocks.map((block) => (
                                    <tr key={block.id} className="border-t border-mushroom/50">
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {formatBlockDate(block.block_date)}
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {block.start_minute === null || block.end_minute === null
                                                ? 'All day'
                                                : `${formatMinute(block.start_minute)} – ${formatMinute(block.end_minute)}`}
                                        </td>
                                        <td className="py-2 pr-4">{WHO_LABELS[block.who]}</td>
                                        <td className="py-2 pr-4">
                                            {block.source === 'manual' ? (
                                                'Manual'
                                            ) : (
                                                <>
                                                    <span>{block.source}</span>
                                                    <span className="block font-mono text-xs text-foreground-muted">
                                                        {block.feed_key}
                                                    </span>
                                                </>
                                            )}
                                        </td>
                                        <td className="py-2 pr-4 text-foreground-soft">
                                            {block.note ?? '—'}
                                        </td>
                                        <td className="py-2 text-right">
                                            {block.source === 'manual' ? (
                                                <form action={deleteBusyBlockFormAction}>
                                                    <input type="hidden" name="id" value={block.id} />
                                                    <button
                                                        type="submit"
                                                        className="text-sm text-foreground-soft underline underline-offset-2"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
                                            ) : (
                                                <span className="text-xs text-foreground-muted">
                                                    Read-only
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-lg font-medium">Feeds</h2>
                <p className="mt-1 max-w-[70ch] text-sm text-foreground-muted">
                    A feed that stops syncing is not read as an empty calendar. It
                    withdraws auto-confirm instead, and bookings go back to a human.
                </p>

                {feeds.length === 0 ? (
                    <p className="mt-3 text-sm text-foreground-muted">
                        No feeds registered. Busy time comes from manual entries only.
                    </p>
                ) : (
                    <div className="mt-3 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-xs uppercase tracking-wide text-foreground-muted">
                                <tr>
                                    <th className="py-2 pr-4">Feed</th>
                                    <th className="py-2 pr-4">Last success</th>
                                    <th className="py-2 pr-4">Blocks</th>
                                    <th className="py-2">State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeds.map((feed) => (
                                    <tr key={feed.feed_key} className="border-t border-mushroom/50">
                                        <td className="py-2 pr-4 font-mono text-xs">
                                            {feed.feed_key}
                                        </td>
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {formatStamp(feed.last_success_at)}
                                        </td>
                                        <td className="py-2 pr-4">{feed.blocks_synced}</td>
                                        <td className="py-2 text-foreground-soft">
                                            {!feed.enabled ? (
                                                'Switched off. Its blocks stay, nothing new arrives.'
                                            ) : staleFeeds.includes(feed.feed_key) ? (
                                                <>
                                                    Stale for longer than {settings.max_stale_minutes}{' '}
                                                    minutes. Auto-confirm is withdrawn.
                                                    {feed.last_error ? (
                                                        <span className="block text-xs text-foreground-muted">
                                                            Last error: {feed.last_error}
                                                        </span>
                                                    ) : null}
                                                </>
                                            ) : (
                                                'Fresh.'
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}
