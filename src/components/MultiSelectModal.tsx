import React, { useState } from 'react';
import { X, CheckSquare, Square, Play, Pause } from 'lucide-react';
import { Machine } from '../types';

interface MultiSelectModalProps {
    isOpen: boolean;
    onClose: () => void;
    machines: Machine[];
    onAction: (selectedIds: string[], action: 'RUNNING' | 'PAUSED') => void;
}

export const MultiSelectModal = ({ isOpen, onClose, machines, onAction }: MultiSelectModalProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    if (!isOpen) return null;

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectedIds.length === machines.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(machines.map(m => m.id));
        }
    };

    const handleAction = (action: 'RUNNING' | 'PAUSED') => {
        onAction(selectedIds, action);
        setSelectedIds([]); // Clear selection after action
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="text-blue-500" size={24} />
                        <h3 className="text-lg font-bold text-white">Batch Control</h3>
                        <span className="text-gray-400 text-sm">({selectedIds.length} selected)</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 bg-gray-900/30 border-b border-gray-700 flex justify-between items-center">
                    <button
                        onClick={handleSelectAll}
                        className="text-gray-300 hover:text-white text-sm font-medium flex items-center gap-2"
                    >
                        {selectedIds.length === machines.length ? <CheckSquare size={16} /> : <Square size={16} />}
                        {selectedIds.length === machines.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleAction('PAUSED')}
                            disabled={selectedIds.length === 0}
                            className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 rounded-lg hover:bg-yellow-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Pause size={16} />
                            Pause Selected
                        </button>
                        <button
                            onClick={() => handleAction('RUNNING')}
                            disabled={selectedIds.length === 0}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 text-green-500 border border-green-600/50 rounded-lg hover:bg-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Play size={16} />
                            Start Selected
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {machines.map(machine => {
                            const isSelected = selectedIds.includes(machine.id);
                            return (
                                <button
                                    key={machine.id}
                                    onClick={() => toggleSelection(machine.id)}
                                    className={`
                                flex items-center gap-3 p-3 rounded-lg border transition-all text-left group
                                ${isSelected
                                            ? 'bg-blue-600/20 border-blue-500/50'
                                            : 'bg-gray-800 border-gray-700 hover:border-gray-600 hover:bg-gray-700/50'
                                        }
                            `}
                                >
                                    <div className={`
                                w-5 h-5 rounded flex items-center justify-center border transition-colors
                                ${isSelected
                                            ? 'bg-blue-500 border-blue-500 text-white'
                                            : 'border-gray-500 group-hover:border-gray-400'
                                        }
                            `}>
                                        {isSelected && <CheckSquare size={14} />}
                                    </div>
                                    <div>
                                        <div className={`font-mono font-bold ${isSelected ? 'text-blue-200' : 'text-gray-300'}`}>
                                            {machine.displayId}
                                        </div>
                                        <div className={`text-xs ${machine.status === 'RUNNING' ? 'text-green-400' : 'text-gray-500'}`}>
                                            {machine.status}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
