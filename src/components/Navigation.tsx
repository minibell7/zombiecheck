import React from 'react';
import { LayoutGrid, Calendar, List, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
    activeTab: 'dashboard' | 'calendar' | 'items';
    onTabChange: (tab: 'dashboard' | 'calendar' | 'items') => void;
    onAddClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onAddClick }) => {
    return (
        <>
            {/* Top Navigation (Desktop) */}
            <div className="hidden md:flex fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-white-5 z-50 px-6 py-4 items-center justify-between max-w-7xl mx-auto">
                <h1 className="text-xl font-bold text-white tracking-tight">Zombiecheck</h1>

                <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
                    <button
                        onClick={() => onTabChange('dashboard')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                            activeTab === 'dashboard' ? "bg-white-10 text-white shadow-sm" : "text-textSecondary hover:text-white hover:bg-white-5"
                        )}
                    >
                        <LayoutGrid size={18} />
                        Dashboard
                    </button>
                    <button
                        onClick={() => onTabChange('calendar')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                            activeTab === 'calendar' ? "bg-white-10 text-white shadow-sm" : "text-textSecondary hover:text-white hover:bg-white-5"
                        )}
                    >
                        <Calendar size={18} />
                        Calendar
                    </button>
                    <button
                        onClick={() => onTabChange('items')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                            activeTab === 'items' ? "bg-white-10 text-white shadow-sm" : "text-textSecondary hover:text-white hover:bg-white-5"
                        )}
                    >
                        <List size={18} />
                        All Items
                    </button>
                </div>

                <button
                    onClick={onAddClick}
                    className="bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-accent-20"
                >
                    <Plus size={18} />
                    Add Item
                </button>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-30 pb-safe pt-2 px-6 flex justify-around items-center z-50">
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
        </>
    );
};
