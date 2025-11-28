import React, { useState } from 'react';
import { Dashboard } from '../components/Dashboard';
import type { Subscription } from '../types';
import { ChevronDown, ChevronUp, Lightbulb, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardViewProps {
    subscriptions: Subscription[];
    totalMonthlyCost: number;
    onNavigate: (filter: 'all' | 'today' | 'week') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ subscriptions, totalMonthlyCost, onNavigate }) => {
    const [isTipsOpen, setIsTipsOpen] = useState(false);

    const todayCost = subscriptions.reduce((total, sub) => {
        const today = new Date();
        if (sub.paymentDay === today.getDate()) {
            return total + Number(sub.amount);
        }
        return total;
    }, 0);

    const weekCost = subscriptions.reduce((total, sub) => {
        const today = new Date();
        // Check next 7 days from Monday (or just check if paymentDay is in this week's dates)
        // Simpler: iterate through the 7 days of this week
        let isInWeek = false;
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(today);
            weekDate.setDate(today.getDate() - today.getDay() + i); // Sunday to Saturday
            if (sub.paymentDay === weekDate.getDate()) {
                isInWeek = true;
                break;
            }
        }

        if (isInWeek) {
            return total + Number(sub.amount);
        }
        return total;
    }, 0);

    const handleShare = async () => {
        const shareData = {
            title: 'Zombiecheck',
            text: "I'm using Zombiecheck to stop invisible spending! Fixed expenses are dangerous. Check your subscriptions manually to save money.",
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.text);
                alert('Message copied to clipboard! Share it with your friends.');
            } catch (err) {
                console.error('Error copying to clipboard:', err);
            }
        }
    };

    return (
        <div className="pb-24">
            <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">Zombiecheck</h1>
                <button
                    onClick={handleShare}
                    className="p-2 rounded-full bg-surfaceHighlight text-accent hover:bg-accent hover:text-white transition-colors"
                    aria-label="Share"
                >
                    <Share2 size={20} />
                </button>
            </div>

            <Dashboard totalMonthlyCost={totalMonthlyCost} onClick={() => onNavigate('all')} />

            <div className="px-6 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 max-w-7xl mx-auto">
                <div
                    onClick={() => onNavigate('today')}
                    className="bg-accent rounded-2xl p-4 text-white shadow-lg shadow-accent-20 cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <p className="text-xs font-medium opacity-90 mb-1">Today's Cost</p>
                    <p className="text-2xl font-bold">${todayCost.toFixed(2)}</p>
                </div>
                <div
                    onClick={() => onNavigate('week')}
                    className="bg-accent rounded-2xl p-4 text-white shadow-lg shadow-accent-20 cursor-pointer hover:opacity-90 transition-opacity"
                >
                    <p className="text-xs font-medium opacity-90 mb-1">This Week's Cost</p>
                    <p className="text-2xl font-bold">${weekCost.toFixed(2)}</p>
                </div>
            </div>

            <div className="px-6">
                <button
                    onClick={() => setIsTipsOpen(!isTipsOpen)}
                    className="w-full bg-surfaceHighlight rounded-xl p-4 flex justify-between items-center text-textSecondary hover:text-white transition-colors border border-accent/20"
                >
                    <div className="flex items-center gap-2">
                        <Lightbulb size={18} className="text-accent" />
                        <span className="font-medium text-sm text-accent">How to Stop Zombie Spending</span>
                    </div>
                    {isTipsOpen ? <ChevronUp size={18} className="text-accent" /> : <ChevronDown size={18} className="text-accent" />}
                </button>

                <AnimatePresence>
                    {isTipsOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="bg-surfaceHighlight/50 rounded-b-xl p-4 mt-1 text-sm text-textSecondary leading-relaxed border border-white-5 space-y-3">
                                <div>
                                    <p className="text-white font-medium mb-1">👻 The Danger of Invisible Spending</p>
                                    <p>Fixed expenses are dangerous because they are invisible.</p>
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">👁️ The Power of Awareness</p>
                                    <p>Just knowing your monthly outflows can help you reduce costs.</p>
                                </div>
                                <div>
                                    <p className="text-white font-medium mb-1">📝 The Importance of Manual Comparison</p>
                                    <p>Manually compare this list with your actual statement to find hidden expenses.</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
