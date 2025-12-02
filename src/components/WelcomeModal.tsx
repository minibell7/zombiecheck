import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, Search, Check } from 'lucide-react';

interface WelcomeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black-80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-surface border border-border rounded-3xl p-6 max-w-md w-full shadow-2xl relative overflow-hidden"
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome to Zombiecheck</h2>
                                    <p className="text-textSecondary">Stop invisible spending and take control.</p>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surfaceHighlight flex items-center justify-center flex-shrink-0 text-accent">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">No Bank Link Needed</h3>
                                            <p className="text-sm text-textSecondary leading-relaxed">
                                                We don't ask for your bank login. Your financial privacy is our top priority.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surfaceHighlight flex items-center justify-center flex-shrink-0 text-accent">
                                            <Search size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">Manual Audit</h3>
                                            <p className="text-sm text-textSecondary leading-relaxed">
                                                Manually checking your expenses is the best way to find hidden "zombie" subscriptions.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-surfaceHighlight flex items-center justify-center flex-shrink-0 text-accent">
                                            <Database size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">100% Local Data</h3>
                                            <p className="text-sm text-textSecondary leading-relaxed">
                                                All your data is stored locally on your device. We can't see it even if we wanted to.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="w-full bg-accent hover:bg-accentHover text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-accent-20 flex items-center justify-center gap-2 group"
                                >
                                    <span>Get Started</span>
                                    <Check size={20} className="group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
