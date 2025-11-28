import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import type { Subscription } from '../types';
import { SubscriptionCard } from '../components/SubscriptionCard';
import 'react-day-picker/dist/style.css';
import { AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
    subscriptions: Subscription[];
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ subscriptions, onEdit, onDelete }) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    const selectedSubscriptions = subscriptions.filter(sub => {
        if (!selectedDate) return false;
        return sub.paymentDay === selectedDate.getDate();
    });

    // Modifiers to highlight days with subscriptions
    // Since it's monthly, we check if the day matches any subscription's paymentDay
    const hasSub = (date: Date) => {
        return subscriptions.some(sub => sub.paymentDay === date.getDate());
    };

    return (
        <div className="pb-24 px-6 pt-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Calendar</h2>
            </div>

            <div className="bg-surfaceHighlight rounded-2xl p-4 mb-6 shadow-lg">
                <style>{`
          .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #14b8a6; margin: 0; }
          .rdp-day_selected:not([disabled]) { background-color: var(--color-accent); color: white; }
          .rdp-day_today { color: var(--color-accent); font-weight: bold; }
          .rdp-day { color: var(--color-text-primary); }
          .rdp-caption_label { color: var(--color-text-primary); }
          .rdp-nav_button { color: var(--color-text-primary); }
          .rdp-head_cell { color: var(--color-text-secondary); }
        `}</style>
                <DayPicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    modifiers={{ hasSub }}
                    modifiersStyles={{
                        hasSub: { fontWeight: 'bold', textDecoration: 'underline', textDecorationColor: '#14b8a6' }
                    }}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                    {selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' }) : 'Select a date'}
                    <span className="ml-2 text-sm text-textSecondary font-normal">
                        • {selectedSubscriptions.length} items
                    </span>
                </h3>

                <div className="space-y-1">
                    <AnimatePresence>
                        {selectedSubscriptions.length === 0 ? (
                            <div className="text-center py-8 text-textSecondary opacity-50 bg-surfaceHighlight/30 rounded-xl border border-white-5">
                                <p>No subscriptions due on this date.</p>
                            </div>
                        ) : (
                            selectedSubscriptions.map(sub => (
                                <SubscriptionCard
                                    key={sub.id}
                                    subscription={sub}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
