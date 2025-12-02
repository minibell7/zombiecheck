import React, { useState } from 'react';
import type { Subscription } from '../types';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { Search, X, Filter } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

interface AllItemsViewProps {
    subscriptions: Subscription[];
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    onStatusChange?: (id: string, status: 'active' | 'to_cancel') => void;
    filter?: 'all' | 'today' | 'week';
    onClearFilter?: () => void;
}

export const AllItemsView: React.FC<AllItemsViewProps> = ({
    subscriptions,
    onEdit,
    onDelete,
    onStatusChange,
    filter = 'all',
    onClearFilter
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.itemName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        const today = new Date();

        if (filter === 'today') {
            return sub.paymentDay === today.getDate();
        } else if (filter === 'week') {
            // Check if paymentDay falls within this week
            let isInWeek = false;
            for (let i = 0; i < 7; i++) {
                const weekDate = new Date(today);
                weekDate.setDate(today.getDate() - today.getDay() + i);
                if (sub.paymentDay === weekDate.getDate()) {
                    isInWeek = true;
                    break;
                }
            }
            return isInWeek;
        }

        return true;
    });

    return (
        <div className="pb-24 px-6 pt-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">All Items</h2>
                    {filter !== 'all' && (
                        <div className="flex items-center gap-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium border border-accent/20 animate-in fade-in slide-in-from-left-4">
                            <Filter size={14} />
                            <span className="capitalize">{filter}</span>
                            {onClearFilter && (
                                <button
                                    onClick={onClearFilter}
                                    className="ml-1 p-0.5 hover:bg-accent/20 rounded-full transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <span className="text-xs text-textSecondary bg-surfaceHighlight px-2 py-1 rounded-full">
                    {filteredSubscriptions.length} items
                </span>
            </div>

            <div className="relative mb-6">
                <Search className="absolute left-4 top-3.5 text-textSecondary" size={20} />
                <input
                    type="text"
                    placeholder="Search items... e.g., Netflix"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-surfaceHighlight border border-border-30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all placeholder:text-textSecondary/50"
                />
            </div>

            <div className="space-y-1 lg:space-y-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4">
                <AnimatePresence>
                    {filteredSubscriptions.length === 0 ? (
                        <div className="text-center py-12 text-textSecondary opacity-50">
                            <p>No items found.</p>
                        </div>
                    ) : (
                        filteredSubscriptions.map(sub => (
                            <SubscriptionCard
                                key={sub.id}
                                subscription={sub}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onStatusChange={onStatusChange}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
