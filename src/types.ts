export interface Machine {
    id: string; // 'MAC-01'
    displayId: string; // '01'
    status: 'RUNNING' | 'PAUSED' | 'COMPLETED';
    startTime: number | null; // Timestamp when started/resumed (ms)
    accumulatedTime: number; // Total ms worked BEFORE the current session
    targetTime: number; // 80 hours in ms
    wasRunningBeforeOutage?: boolean; // Track if machine was running when GLOBAL POWER OUTAGE was triggered
}

export const TARGET_TIME_HOURS = 80;
export const TARGET_TIME_MS = TARGET_TIME_HOURS * 60 * 60 * 1000;
