import { X, AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50">
                    <div className="flex items-center gap-3 text-red-500">
                        <AlertTriangle size={24} />
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-300 leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 bg-gray-900/50 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-900/20 transition-all active:scale-95"
                    >
                        Confirm Reset
                    </button>
                </div>

            </div>
        </div>
    );
};
