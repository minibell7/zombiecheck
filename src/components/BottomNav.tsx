import React from 'react';
import { LayoutGrid, Calendar, List } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
    activeTab: 'dashboard' | 'calendar' | 'items';
    onTabChange: (tab: 'dashboard' | 'calendar' | 'items') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-30 pb-safe pt-2 px-6 flex justify-around items-center z-50 max-w-sm mx-auto">
            <button
                onClick={() => onTabChange('dashboard')}
                className={cn(
                    "flex flex-col items-center gap-1 p-2 transition-colors",
                    activeTab === 'dashboard' ? "text-accent" : "text-textSecondary hover:text-white"
                )}
            >
                <LayoutGrid size={24} />
                <span className="text-xs font-medium">Dashboard</span>
            </button>

            <button
                onClick={() => onTabChange('calendar')}
                className={cn(
                    "flex flex-col items-center gap-1 p-2 transition-colors",
                    activeTab === 'calendar' ? "text-accent" : "text-textSecondary hover:text-white"
                )}
            >
                <Calendar size={24} />
                <span className="text-xs font-medium">Calendar</span>
            </button>

            <button
                onClick={() => onTabChange('items')}
                className={cn(
                    "flex flex-col items-center gap-1 p-2 transition-colors",
                    activeTab === 'items' ? "text-accent" : "text-textSecondary hover:text-white"
                )}
            >
                <List size={24} />
                <span className="text-xs font-medium">All Items</span>
            </button>
        </div>
    );
};
