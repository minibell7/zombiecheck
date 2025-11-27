import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { Subscription } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
    editingSubscription?: Subscription | null;
}

interface FormData {
    itemName: string;
    amount: number;
    cycle: 'Monthly' | 'Yearly';
    category: 'subscription' | 'fixed';
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingSubscription
}) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            itemName: '',
            amount: 0,
            cycle: 'Monthly',
            category: 'subscription'
        }
    });

    useEffect(() => {
        if (editingSubscription) {
            setValue('itemName', editingSubscription.itemName);
            setValue('amount', editingSubscription.amount);
            setValue('cycle', editingSubscription.cycle);
            setValue('category', editingSubscription.category || 'subscription');
        } else {
            reset({
                itemName: '',
                amount: undefined,
                cycle: 'Monthly',
                category: 'subscription'
            });
        }
    }, [editingSubscription, setValue, reset, isOpen]);

    const onSubmit = (data: FormData) => {
        onSave(data);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black-60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
                    >
                        <div className="w-full max-w-md bg-surface border-t border-border rounded-t-3xl p-6 pointer-events-auto shadow-2xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">
                                    {editingSubscription ? 'Edit Subscription' : 'New Subscription'}
                                </h2>
                                <button onClick={onClose} className="p-2 hover:bg-white-10 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-2">Category</label>
                                    <div className="grid grid-cols-2 gap-2 bg-surfaceHighlight p-1 rounded-xl border border-border">
                                        <label className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value="subscription"
                                                {...register('category')}
                                                className="sr-only peer"
                                            />
                                            <div className="text-center py-2 rounded-lg text-sm font-medium text-textSecondary peer-checked:bg-accent peer-checked:text-white transition-all">
                                                Subscription
                                            </div>
                                        </label>
                                        <label className="cursor-pointer">
                                            <input
                                                type="radio"
                                                value="fixed"
                                                {...register('category')}
                                                className="sr-only peer"
                                            />
                                            <div className="text-center py-2 rounded-lg text-sm font-medium text-textSecondary peer-checked:bg-accent peer-checked:text-white transition-all">
                                                Fixed Expense
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-textSecondary mb-1">Name</label>
                                    <input
                                        {...register('itemName', { required: 'Name is required' })}
                                        placeholder="Netflix, Spotify, etc."
                                        className={cn(
                                            "w-full bg-surfaceHighlight border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all",
                                            errors.itemName && "border-danger focus:ring-danger-50"
                                        )}
                                    />
                                    {errors.itemName && <p className="text-danger text-xs mt-1">{errors.itemName.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-1">Amount</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3 text-textSecondary">$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register('amount', { required: 'Required', min: 0, valueAsNumber: true })}
                                                className={cn(
                                                    "w-full bg-surfaceHighlight border border-border rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all",
                                                    errors.amount && "border-danger focus:ring-danger-50"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-1">Cycle</label>
                                        <select
                                            {...register('cycle')}
                                            className="w-full bg-surfaceHighlight border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all appearance-none"
                                        >
                                            <option value="Monthly">Monthly</option>
                                            <option value="Yearly">Yearly</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-accent hover:bg-accentHover text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg shadow-accent-20"
                                >
                                    {editingSubscription ? 'Update Subscription' : 'Add Subscription'}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
