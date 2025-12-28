import { useState, useEffect, useCallback } from 'react';
import { Machine, TARGET_TIME_MS } from '../types';



const generateInitialMachines = (): Machine[] => {
    return Array.from({ length: 50 }, (_, i) => {
        const idNum = i + 1;
        const displayId = idNum.toString().padStart(2, '0');
        return {
            id: `MAC-${displayId}`,
            displayId,
            status: 'PAUSED',
            startTime: null,
            accumulatedTime: 0,
            targetTime: TARGET_TIME_MS,
        };
    });
};

export const useMachineData = () => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial Load
    useEffect(() => {
        fetch('http://localhost:3001/api/machines')
            .then(res => {
                if (!res.ok) throw new Error("Fetch failed");
                return res.json();
            })
            .then(data => {
                if (data.machines && data.machines.length > 0) {
                    setMachines(data.machines);
                } else {
                    const initial = generateInitialMachines();
                    setMachines(initial);
                    // Initial save to populate DB
                    syncMachines(initial);
                }
                setIsLoaded(true);
            })
            .catch(err => {
                console.error("Failed to load machines", err);
                // Fallback to local generation if server fails
                setMachines(generateInitialMachines());
                setIsLoaded(true);
            });
    }, []);

    const syncMachines = async (currentMachines: Machine[]) => {
        try {
            const res = await fetch('http://localhost:3001/api/machines/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ machines: currentMachines })
            });
            if (!res.ok) {
                const err = await res.text();
                console.error("Sync failed response:", err);
            }
        } catch (e) {
            console.error("Failed to sync machines", e);
        }
    };


    // Auto-save every 5 seconds (Debounce/Interval strategy)
    useEffect(() => {
        if (!isLoaded) return;
        const interval = setInterval(() => {
            syncMachines(machines);
        }, 5000);
        return () => clearInterval(interval);
    }, [machines, isLoaded]);

    const toggleMachine = useCallback((id: string) => {
        setMachines(prev => {
            const newMachines = prev.map(m => {
                if (m.id !== id) return m;

                const now = Date.now();
                if (m.status === 'RUNNING') {
                    const elapsed = now - (m.startTime || now);
                    return {
                        ...m,
                        status: 'PAUSED' as const,
                        startTime: null,
                        accumulatedTime: m.accumulatedTime + elapsed,
                        wasRunningBeforeOutage: false // Clear flag on manual toggle
                    };
                } else if (m.status === 'PAUSED') {
                    if (m.accumulatedTime >= m.targetTime) return m;

                    return {
                        ...m,
                        status: 'RUNNING' as const,
                        startTime: now,
                        wasRunningBeforeOutage: false // Clear flag on manual toggle
                    };
                }
                return m;
            });
            syncMachines(newMachines);
            return newMachines;
        });
    }, []);

    const resetMachine = useCallback((id: string) => {
        setMachines(prev => {
            const newMachines = prev.map(m => {
                if (m.id !== id) return m;
                return {
                    ...m,
                    status: 'PAUSED' as const,
                    startTime: null,
                    accumulatedTime: 0,
                    wasRunningBeforeOutage: false // Clear on reset
                };
            });
            syncMachines(newMachines);
            return newMachines;
        });
    }, []);

    const handleGlobalPowerOutage = useCallback(() => {
        setMachines(prev => {
            const newMachines = prev.map(m => {
                if (m.status === 'RUNNING') {
                    const now = Date.now();
                    const elapsed = now - (m.startTime || now);
                    return {
                        ...m,
                        status: 'PAUSED' as const,
                        startTime: null,
                        accumulatedTime: m.accumulatedTime + elapsed,
                        wasRunningBeforeOutage: true // Mark as running
                    };
                }
                return {
                    ...m,
                    wasRunningBeforeOutage: false
                };
            });
            // Immediate sync on critical action
            syncMachines(newMachines as Machine[]);
            return newMachines as Machine[];
        });
    }, []);

    const handleGlobalResume = useCallback(() => {
        setMachines(prev => {
            const newMachines = prev.map(m => {
                if (m.status === 'PAUSED' && m.accumulatedTime < m.targetTime && m.wasRunningBeforeOutage) {
                    return {
                        ...m,
                        status: 'RUNNING' as const,
                        startTime: Date.now(),
                        wasRunningBeforeOutage: false // Consume the flag
                    };
                }
                return m;
            });
            syncMachines(newMachines);
            return newMachines;
        });
    }, []);

    const resetAllMachines = useCallback(() => {
        setMachines(prev => {
            const newMachines = prev.map(m => ({
                ...m,
                status: 'PAUSED' as const,
                startTime: null,
                accumulatedTime: 0,
                wasRunningBeforeOutage: false
            }));
            syncMachines(newMachines);
            return newMachines;
        });
    }, []);

    const toggleMultipleMachines = useCallback((ids: string[], targetStatus: 'RUNNING' | 'PAUSED') => {
        setMachines(prev => {
            const newMachines = prev.map(m => {
                if (!ids.includes(m.id)) return m;

                if (targetStatus === 'RUNNING' && m.status === 'PAUSED') {
                    // Start the machine
                    if (m.accumulatedTime >= m.targetTime) return m; // Don't start if completed
                    return {
                        ...m,
                        status: 'RUNNING' as const,
                        startTime: Date.now(),
                        wasRunningBeforeOutage: false
                    };
                } else if (targetStatus === 'PAUSED' && m.status === 'RUNNING') {
                    // Pause the machine
                    const now = Date.now();
                    const elapsed = now - (m.startTime || now);
                    return {
                        ...m,
                        status: 'PAUSED' as const,
                        startTime: null,
                        accumulatedTime: m.accumulatedTime + elapsed,
                        wasRunningBeforeOutage: false
                    };
                }
                return m;
            });
            syncMachines(newMachines);
            return newMachines;
        });
    }, []);

    return {
        machines,
        toggleMachine,
        resetMachine,
        handleGlobalPowerOutage,
        handleGlobalResume,
        resetAllMachines,
        toggleMultipleMachines
    };
};
