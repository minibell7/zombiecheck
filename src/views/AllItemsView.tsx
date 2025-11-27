import React, { useState } from 'react';
import type { Subscription } from '../types';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { isSameWeek, parseISO } from 'date-fns';

interface AllItemsViewProps {
    subscriptions: Subscription[];
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
    filter?: 'all' | 'today' | 'week';
}

export const AllItemsView: React.FC<AllItemsViewProps> = ({ subscriptions, onEdit, onDelete, filter = 'all' }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearch = sub.itemName.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        const subDate = parseISO(sub.createdAt);
        const today = new Date();

        if (filter === 'today') {
            return subDate.getDate() === today.getDate();
        } else if (filter === 'week') {
            return isSameWeek(subDate, today);
        }

        return true;
    });

    return (
        <div className="pb-24 px-6 pt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">
                        {filter === 'today' ? "Today's Items" : filter === 'week' ? "This Week's Items" : "All Items"}
                    </h2>
                    {filter !== 'all' && (
                        <p className="text-sm text-textSecondary mt-1">Filtered by {filter}</p>
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

            <div className="space-y-1 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4">
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
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
