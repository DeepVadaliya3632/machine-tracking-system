import { useMachineData } from '../hooks/useMachineData';
import { MachineTile } from './MachineTile';
import { Power, Activity } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { MultiSelectModal } from './MultiSelectModal';
import { useState } from 'react';

import { LogOut } from 'lucide-react';

interface DashboardProps {
    onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const { machines, toggleMachine, resetMachine, handleGlobalPowerOutage, handleGlobalResume, resetAllMachines, toggleMultipleMachines } = useMachineData();
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isMultiSelectModalOpen, setIsMultiSelectModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
            <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                <div className="flex items-center gap-3">
                    <Activity className="text-blue-500" size={32} />
                    <h1 className="text-2xl font-bold tracking-tight">Machine Tracking System</h1>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setIsMultiSelectModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.5)] active:scale-95 transition-all"
                    >
                        <Activity size={24} />
                        BATCH CONTROL
                    </button>
                    <button
                        onClick={() => setIsResetModalOpen(true)}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 border border-gray-600 active:scale-95 transition-all"
                    >
                        <Power size={24} className="text-gray-400" />
                        RESET ALL
                    </button>
                    <button
                        onClick={handleGlobalResume}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(22,163,74,0.5)] active:scale-95 transition-all"
                    >
                        <Power size={24} className="rotate-180" />
                        RESUME ALL
                    </button>
                    <button
                        onClick={handleGlobalPowerOutage}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.5)] active:scale-95 transition-all"
                    >
                        <Power size={24} />
                        STOP ALL
                    </button>
                    {onLogout && (
                        <button
                            onClick={onLogout}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 active:scale-95 transition-all"
                        >
                            <LogOut size={24} />
                            LOGOUT
                        </button>
                    )}
                </div>
            </header >

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {machines.map(machine => (
                    <MachineTile
                        key={machine.id}
                        machine={machine}
                        onToggle={toggleMachine}
                        onReset={resetMachine}
                    />
                ))}
            </div>
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={resetAllMachines}
                title="Confirm Reset All"
                message="Are you sure you want to RESET ALL machines? This action will set all timers to zero and cannot be undone."
            />
            <MultiSelectModal
                isOpen={isMultiSelectModalOpen}
                onClose={() => setIsMultiSelectModalOpen(false)}
                machines={machines}
                onAction={toggleMultipleMachines}
            />
        </div>
    );
};
