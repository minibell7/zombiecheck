import React from 'react';
import { LayoutGrid, Calendar, List, Plus, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
    activeTab: 'dashboard' | 'calendar' | 'items';
    onTabChange: (tab: 'dashboard' | 'calendar' | 'items') => void;
    onAddClick: () => void;
    onSettingsClick: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onAddClick, onSettingsClick }) => {
    return (
        <>
            {/* Top Navigation (Desktop) */}
            <div className="hidden lg:flex fixed top-0 left-0 right-0 bg-surface/80 backdrop-blur-md border-b border-white-5 z-50 px-6 py-4 items-center justify-between max-w-7xl mx-auto">
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

                <div className="flex items-center gap-3">
                    <button
                        onClick={onSettingsClick}
                        className="p-2 text-textSecondary hover:text-white hover:bg-white-5 rounded-lg transition-colors"
                        aria-label="Settings"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={onAddClick}
                        className="bg-accent hover:bg-accentHover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-accent-20"
                    >
                        <Plus size={18} />
                        Add Item
                    </button>
                </div>
            </div>

            {/* Bottom Navigation (Mobile) */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border-30 pb-safe pt-2 px-6 flex justify-between items-center z-50">
                <button
                    onClick={() => onTabChange('dashboard')}
                    className={cn(
                        "flex flex-col items-center gap-1 p-2 transition-colors min-w-[64px]",
                        activeTab === 'dashboard' ? "text-accent" : "text-textSecondary hover:text-white"
                    )}
                >
                    <LayoutGrid size={24} />
                    <span className="text-xs font-medium">Home</span>
                </button>

                <button
                    onClick={() => onTabChange('calendar')}
                    className={cn(
                        "flex flex-col items-center gap-1 p-2 transition-colors min-w-[64px]",
                        activeTab === 'calendar' ? "text-accent" : "text-textSecondary hover:text-white"
                    )}
                >
                    <Calendar size={24} />
                    <span className="text-xs font-medium">Calendar</span>
                </button>

                <button
                    onClick={() => onTabChange('items')}
                    className={cn(
                        "flex flex-col items-center gap-1 p-2 transition-colors min-w-[64px]",
                        activeTab === 'items' ? "text-accent" : "text-textSecondary hover:text-white"
                    )}
                >
                    <List size={24} />
                    <span className="text-xs font-medium">Items</span>
                </button>

                <button
                    onClick={onSettingsClick}
                    className="flex flex-col items-center gap-1 p-2 transition-colors min-w-[64px] text-textSecondary hover:text-white"
                >
                    <Settings size={24} />
                    <span className="text-xs font-medium">Settings</span>
                </button>
            </div>
        </>
    );
};
