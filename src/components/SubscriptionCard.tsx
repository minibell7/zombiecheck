import React from 'react';
import type { Subscription } from '../types';
import { Edit2, Calendar, PlayCircle, Shield, Skull, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { differenceInDays, parseISO } from 'date-fns';

interface SubscriptionCardProps {
    subscription: Subscription;
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onStatusChange?: (id: string, status: 'active' | 'to_cancel') => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onEdit, onDelete, onStatusChange }) => {
    const isKillList = subscription.status === 'to_cancel';

    // Calculate trial days remaining
    const getTrialStatus = () => {
        if (!subscription.isFreeTrial || !subscription.trialEndDate) return null;

        const today = new Date();
        const endDate = parseISO(subscription.trialEndDate);
        const daysLeft = differenceInDays(endDate, today);

        if (daysLeft < 0) return { text: 'Expired', color: 'text-kill', bg: 'bg-kill/10' };
        if (daysLeft <= 3) return { text: `${daysLeft} days left`, color: 'text-warning', bg: 'bg-warning/10' };
        return { text: 'Free Trial', color: 'text-accent', bg: 'bg-accent/10' };
    };

    const trialStatus = getTrialStatus();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "backdrop-blur-sm border rounded-xl p-4 mb-3 md:mb-0 flex justify-between items-center group transition-all h-full relative overflow-hidden",
                isKillList
                    ? "bg-kill/5 border-kill/30 hover:bg-kill/10"
                    : "bg-surfaceHighlight/50 border-white-5 hover:bg-surfaceHighlight"
            )}
        >
            {/* Kill List Background Effect */}
            {isKillList && (
                <div className="absolute -right-4 -top-4 text-kill/5 rotate-12 pointer-events-none">
                    <Skull size={120} />
                </div>
            )}

            <div className="flex flex-col relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className={cn("font-semibold text-lg", isKillList ? "text-kill" : "text-white")}>
                        {subscription.itemName}
                    </h3>
                    {trialStatus && (
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1", trialStatus.color, trialStatus.bg)}>
                            {trialStatus.text === 'Expired' || trialStatus.text.includes('days') ? <AlertTriangle size={10} /> : <Clock size={10} />}
                            {trialStatus.text}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span className={cn("font-bold text-lg", isKillList ? "text-kill/80" : "text-accent")}>
                        ${Number(subscription.amount).toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-textSecondary bg-white-5 px-2 py-0.5 rounded-full">
                        <Calendar size={10} />
                        <span>Day {subscription.paymentDay}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-textSecondary bg-white-5 px-2 py-0.5 rounded-full">
                        {subscription.category === 'fixed' ? <Shield size={10} /> : <PlayCircle size={10} />}
                        <span className="capitalize">{subscription.category === 'fixed' ? 'Fixed' : 'Sub'}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                {/* Add to Calendar Button for Free Trials */}
                {subscription.isFreeTrial && subscription.trialEndDate && !isKillList && (
                    <button
                        onClick={() => {
                            const endDate = parseISO(subscription.trialEndDate!);
                            const reminderDate = new Date(endDate);
                            reminderDate.setDate(endDate.getDate() - 1); // Remind 1 day before

                            const title = `Cancel ${subscription.itemName}`;
                            const description = `Your free trial for ${subscription.itemName} ends on ${subscription.trialEndDate}. Cancel now to avoid charges!`;

                            // Create .ics content
                            const icsContent = [
                                'BEGIN:VCALENDAR',
                                'VERSION:2.0',
                                'BEGIN:VEVENT',
                                `DTSTART;VALUE=DATE:${reminderDate.toISOString().split('T')[0].replace(/-/g, '')}`,
                                `DTEND;VALUE=DATE:${reminderDate.toISOString().split('T')[0].replace(/-/g, '')}`,
                                `SUMMARY:${title}`,
                                `DESCRIPTION:${description}`,
                                'END:VEVENT',
                                'END:VCALENDAR'
                            ].join('\n');

                            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `cancel-${subscription.itemName.toLowerCase()}.ics`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }}
                        className="p-2 rounded-full hover:bg-accent/20 text-textSecondary hover:text-accent transition-colors"
                        title="Add to Calendar"
                    >
                        <Calendar size={16} />
                    </button>
                )}

                {onStatusChange && !isKillList && (
                    <button
                        onClick={() => onStatusChange(subscription.id, 'to_cancel')}
                        className="p-2 rounded-full hover:bg-kill/20 text-textSecondary hover:text-kill transition-colors"
                        title="Add to Kill List"
                    >
                        <Skull size={16} />
                    </button>
                )}

                {isKillList && (
                    <button
                        onClick={() => onDelete(subscription.id)}
                        className="p-2 rounded-full bg-kill text-white hover:bg-killHover transition-colors shadow-lg shadow-kill/20"
                        title="Kill Now!"
                    >
                        <Skull size={16} />
                    </button>
                )}

                {!isKillList && (
                    <button
                        onClick={() => onEdit(subscription)}
                        className="p-2 rounded-full hover:bg-white-10 text-textSecondary hover:text-white transition-colors"
                        aria-label="Edit"
                    >
                        <Edit2 size={16} />
                    </button>
                )}

                {isKillList && (
                    <button
                        onClick={() => onStatusChange && onStatusChange(subscription.id, 'active')}
                        className="p-2 rounded-full hover:bg-white-10 text-textSecondary hover:text-white transition-colors"
                        title="Restore"
                    >
                        <Edit2 size={16} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};
