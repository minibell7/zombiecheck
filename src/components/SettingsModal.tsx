import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import type { Subscription } from '../types';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptions: Subscription[];
    setSubscriptions: (subscriptions: Subscription[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    subscriptions,
    setSubscriptions
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        const dataStr = JSON.stringify(subscriptions, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `zombiecheck_backup_${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileObj = event.target.files && event.target.files[0];
        if (!fileObj) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const parsedData = JSON.parse(content);

                if (Array.isArray(parsedData)) {
                    // Basic validation: check if items have id and amount
                    const isValid = parsedData.every(item => item.id && typeof item.amount === 'number');
                    if (isValid) {
                        if (window.confirm(`Found ${parsedData.length} items. Do you want to replace your current data?`)) {
                            setSubscriptions(parsedData);
                            alert('Data imported successfully!');
                            onClose();
                        }
                    } else {
                        alert('Invalid data format. Please use a valid Zombiecheck backup file.');
                    }
                } else {
                    alert('Invalid data format. Expected an array of subscriptions.');
                }
            } catch (error) {
                console.error('Import error:', error);
                alert('Failed to parse file. Is it a valid JSON file?');
            }
        };
        reader.readAsText(fileObj);
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    const handleClearData = () => {
        if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
            setSubscriptions([]);
            alert('All data has been cleared.');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black-60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    >
                        <div className="w-full max-w-md bg-surface border-t border-border rounded-t-3xl p-6 pointer-events-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Settings</h2>
                                <button onClick={onClose} className="p-2 hover:bg-white-10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-surfaceHighlight rounded-xl p-4 border border-border">
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Download size={18} />
                                        Backup Data
                                    </h3>
                                    <p className="text-sm text-textSecondary mb-4">
                                        Save your data as a JSON file. You can restore it later or on another device.
                                    </p>
                                    <button
                                        onClick={handleExport}
                                        className="w-full bg-surface border border-border hover:bg-white-5 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Export Data
                                    </button>
                                </div>

                                <div className="bg-surfaceHighlight rounded-xl p-4 border border-border">
                                    <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                                        <Upload size={18} />
                                        Restore Data
                                    </h3>
                                    <p className="text-sm text-textSecondary mb-4">
                                        Import data from a backup file. This will replace your current data.
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept=".json"
                                        className="hidden"
                                    />
                                    <button
                                        onClick={handleImportClick}
                                        className="w-full bg-surface border border-border hover:bg-white-5 text-white font-medium py-3 rounded-lg transition-colors"
                                    >
                                        Import Data
                                    </button>
                                </div>

                                <div className="bg-danger-10 rounded-xl p-4 border border-danger-20">
                                    <h3 className="text-danger font-bold mb-2 flex items-center gap-2">
                                        <AlertTriangle size={18} />
                                        Danger Zone
                                    </h3>
                                    <button
                                        onClick={handleClearData}
                                        className="w-full bg-danger hover:bg-dangerHover text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 size={18} />
                                        Clear All Data
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <p className="text-xs text-textSecondary">
                                    Zombiecheck v1.0.0 • <a href="https://mini-bell.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Get more at mini-bell.com</a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
