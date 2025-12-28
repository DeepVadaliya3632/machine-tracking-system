import { useEffect, useState } from 'react';
import { Machine, TARGET_TIME_MS } from '../types';
import { Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface MachineTileProps {
    machine: Machine;
    onToggle: (id: string) => void;
    onReset: (id: string) => void;
}

export const MachineTile = ({ machine, onToggle, onReset }: MachineTileProps) => {
    const calculateCurrentTotal = () => {
        if (machine.status === 'RUNNING' && machine.startTime) {
            return machine.accumulatedTime + (Date.now() - machine.startTime);
        }
        return machine.accumulatedTime;
    };

    const [currentTotal, setCurrentTotal] = useState(calculateCurrentTotal());

    useEffect(() => {
        let interval: any;
        setCurrentTotal(calculateCurrentTotal()); // Initial update on re-render

        if (machine.status === 'RUNNING') {
            interval = setInterval(() => {
                setCurrentTotal(calculateCurrentTotal());
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [machine.status, machine.startTime, machine.accumulatedTime]);

    const progress = Math.min((currentTotal / TARGET_TIME_MS) * 100, 100);
    const isCompleted = currentTotal >= TARGET_TIME_MS;

    const getECT = () => {
        if (machine.status !== 'RUNNING' || isCompleted) return '-';
        const remaining = TARGET_TIME_MS - currentTotal;
        const completionDate = new Date(Date.now() + remaining);
        return completionDate.toLocaleString();
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className={clsx(
            "p-4 rounded-lg border-2 flex flex-col gap-3 transition-all relative overflow-hidden",
            isCompleted ? "bg-red-900/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]" : "bg-gray-800 border-gray-700 hover:border-blue-500/50"
        )}>
            <div className="flex justify-between items-center z-10">
                <span className="text-xl font-mono font-bold text-gray-200">{machine.id}</span>
                {isCompleted && <AlertTriangle className="text-red-500 animate-pulse" />}
            </div>

            <div className="space-y-1 z-10">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={clsx("h-full transition-all duration-1000", isCompleted ? "bg-red-500" : "bg-blue-500")}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="text-center py-2 z-10">
                <div className={clsx("text-2xl font-mono font-bold tracking-wider", isCompleted ? "text-red-400" : "text-white")}>
                    {formatTime(currentTotal)}
                </div>
                <div className="text-xs text-gray-500 mt-1 h-4">
                    {machine.status === 'RUNNING' ? `ECT: ${getECT()}` : 'Paused'}
                </div>
            </div>

            <div className="flex gap-2 mt-auto z-10">
                <button
                    onClick={() => onToggle(machine.id)}
                    className={clsx(
                        "flex-1 py-2 rounded flex items-center justify-center gap-2 font-semibold transition-colors",
                        machine.status === 'RUNNING'
                            ? "bg-yellow-600 hover:bg-yellow-500 text-white"
                            : "bg-green-600 hover:bg-green-500 text-white",
                        isCompleted && machine.status !== 'RUNNING' && "opacity-50 cursor-not-allowed"
                    )}
                    disabled={isCompleted && machine.status !== 'RUNNING'}
                >
                    {machine.status === 'RUNNING' ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Start</>}
                </button>
                <button
                    onClick={() => onReset(machine.id)}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-gray-300"
                    title="Reset"
                >
                    <RotateCcw size={16} />
                </button>
            </div>
        </div>
    );
};
