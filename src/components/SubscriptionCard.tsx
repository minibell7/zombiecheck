import React from 'react';
import type { Subscription } from '../types';
import { Edit2, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionCardProps {
    subscription: Subscription;
    onEdit: (subscription: Subscription) => void;
    onDelete: (id: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({ subscription, onEdit, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-surfaceHighlight/50 backdrop-blur-sm border border-white/5 rounded-xl p-4 mb-3 flex justify-between items-center group hover:bg-surfaceHighlight transition-colors"
        >
            <div className="flex flex-col">
                <h3 className="font-semibold text-lg text-white mb-1">{subscription.itemName}</h3>
                <div className="flex items-center gap-3">
                    <span className="text-accent font-bold text-lg">
                        ${subscription.amount.toFixed(2)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-textSecondary bg-white/5 px-2 py-0.5 rounded-full">
                        <Calendar size={10} />
                        <span>{subscription.cycle}</span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(subscription)}
                    className="p-2 rounded-full hover:bg-white/10 text-textSecondary hover:text-white transition-colors"
                    aria-label="Edit"
                >
                    <Edit2 size={16} />
                </button>
                <button
                    onClick={() => onDelete(subscription.id)}
                    className="p-2 rounded-full hover:bg-red-500/10 text-textSecondary hover:text-danger transition-colors"
                    aria-label="Delete"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </motion.div>
    );
};
