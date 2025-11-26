import React from 'react';
import { TrendingUp } from 'lucide-react';

interface DashboardProps {
    totalMonthlyCost: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ totalMonthlyCost }) => {
    return (
        <div className="p-6 pt-12 pb-8 bg-gradient-to-br from-surfaceHighlight to-surface rounded-b-3xl shadow-lg mb-6 border-b border-border/30">
            <div className="flex items-center gap-2 mb-2 text-accent">
                <TrendingUp size={20} />
                <span className="text-sm font-semibold tracking-wider uppercase">Total Monthly Cost</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white tracking-tight">
                    ${totalMonthlyCost.toFixed(2)}
                </span>
                <span className="text-textSecondary font-medium">/mo</span>
            </div>
            <p className="text-xs text-textSecondary mt-4 opacity-70">
                Manage your recurring expenses efficiently.
            </p>
        </div>
    );
};
