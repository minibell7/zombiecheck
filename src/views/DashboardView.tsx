import React, { useState } from 'react';
import { Dashboard } from '../components/Dashboard';
import { SubscriptionCard } from '../components/SubscriptionCard';
import type { Subscription } from '../types';
import { ChevronDown, ChevronUp, Lightbulb, Share2, AlertTriangle, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { differenceInDays, parseISO } from 'date-fns';

interface DashboardViewProps {
    subscriptions: Subscription[];
    totalMonthlyCost: number;
    onNavigate: (filter: 'all' | 'today' | 'week') => void;
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: 'active' | 'to_cancel') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
    subscriptions,
    totalMonthlyCost,
    onNavigate,
    onEdit,
    onDelete,
    onStatusChange
}) => {
    const [isTipsOpen, setIsTipsOpen] = useState(false);

    const activeSubscriptions = subscriptions.filter(sub => sub.status !== 'to_cancel');
    const killListSubscriptions = subscriptions.filter(sub => sub.status === 'to_cancel');

    const trialEndingSoon = activeSubscriptions.filter(sub => {
        if (!sub.isFreeTrial || !sub.trialEndDate) return false;
        const daysLeft = differenceInDays(parseISO(sub.trialEndDate), new Date());
        return daysLeft >= 0 && daysLeft <= 3;
    });

    const todayCost = activeSubscriptions.reduce((total, sub) => {
        const today = new Date();
        if (sub.paymentDay === today.getDate()) {
            return total + Number(sub.amount);
        }
        return total;
    }, 0);

    const weekCost = activeSubscriptions.reduce((total, sub) => {
        const today = new Date();
        let isInWeek = false;
        for (let i = 0; i < 7; i++) {
            const weekDate = new Date(today);
            weekDate.setDate(today.getDate() - today.getDay() + i);
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

            {/* Critical Alert Banner */}
            <AnimatePresence>
                {trialEndingSoon.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 mb-4"
                    >
                        <div className="bg-warning/10 border border-warning/50 rounded-xl p-4 flex items-start gap-3 shadow-lg shadow-warning/5">
                            <div className="p-2 bg-warning/20 rounded-full text-warning shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h3 className="text-warning font-bold text-lg">Critical Alert</h3>
                                <p className="text-textSecondary text-sm leading-relaxed">
                                    You have <span className="text-white font-bold">{trialEndingSoon.length} free trial(s)</span> ending soon!
                                    Cancel them now to avoid unwanted charges.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Dashboard totalMonthlyCost={totalMonthlyCost} onClick={() => onNavigate('all')} />

            {/* Trial Alerts */}
            {trialEndingSoon.length > 0 && (
                <div className="px-6 mb-6">
                    <div className="flex items-center gap-2 mb-3 text-warning">
                        <AlertTriangle size={18} />
                        <h2 className="font-bold text-sm uppercase tracking-wider">Free Trials Ending Soon</h2>
                    </div>
                    <div className="grid gap-3">
                        {trialEndingSoon.map(sub => (
                            <SubscriptionCard
                                key={sub.id}
                                subscription={sub}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Kill List */}
            {killListSubscriptions.length > 0 && (
                <div className="px-6 mb-6">
                    <div className="flex items-center gap-2 mb-3 text-kill">
                        <Skull size={18} />
                        <h2 className="font-bold text-sm uppercase tracking-wider">The Kill List</h2>
                    </div>
                    <div className="grid gap-3">
                        {killListSubscriptions.map(sub => (
                            <SubscriptionCard
                                key={sub.id}
                                subscription={sub}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                            />
                        ))}
                    </div>
                </div>
            )}

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
