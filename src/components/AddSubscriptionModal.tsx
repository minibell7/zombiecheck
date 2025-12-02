import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Subscription } from '../types';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { DayPicker } from 'react-day-picker';
import { enUS } from 'date-fns/locale';
import { format, parseISO } from 'date-fns';
import 'react-day-picker/dist/style.css';

interface AddSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => void;
    editingSubscription?: Subscription | null;
}

interface FormData {
    itemName: string;
    amount: number;
    paymentDay: number;
    category: 'subscription' | 'fixed';
    isFreeTrial: boolean;
    trialEndDate: string;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    editingSubscription
}) => {
    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            itemName: '',
            amount: 0,
            paymentDay: new Date().getDate(), // Default to today
            category: 'subscription',
            isFreeTrial: false,
            trialEndDate: ''
        }
    });

    const isFreeTrial = watch('isFreeTrial');
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);



    useEffect(() => {
        if (editingSubscription) {
            setValue('itemName', editingSubscription.itemName);
            setValue('amount', editingSubscription.amount);
            setValue('paymentDay', editingSubscription.paymentDay || new Date().getDate());
            setValue('category', editingSubscription.category || 'subscription');
            setValue('isFreeTrial', editingSubscription.isFreeTrial || false);
            setValue('trialEndDate', editingSubscription.trialEndDate || '');
        } else {
            reset({
                itemName: '',
                amount: undefined,
                paymentDay: new Date().getDate(),
                category: 'subscription',
                isFreeTrial: false,
                trialEndDate: ''
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
                                            <div className="text-center py-2 rounded-lg text-sm font-medium text-textSecondary peer-checked:bg-accent peer-checked:text-gray-900 peer-checked:font-bold transition-all">
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
                                            <div className="text-center py-2 rounded-lg text-sm font-medium text-textSecondary peer-checked:bg-accent peer-checked:text-gray-900 peer-checked:font-bold transition-all">
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
                                                onFocus={(e) => e.target.select()}
                                                className={cn(
                                                    "w-full bg-surfaceHighlight border border-border rounded-xl pl-8 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all",
                                                    errors.amount && "border-danger focus:ring-danger-50"
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-textSecondary mb-1">Payment Day</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="1"
                                                max="31"
                                                {...register('paymentDay', {
                                                    required: 'Required',
                                                    min: { value: 1, message: '1-31' },
                                                    max: { value: 31, message: '1-31' },
                                                    valueAsNumber: true
                                                })}
                                                onFocus={(e) => e.target.select()}
                                                className={cn(
                                                    "w-full bg-surfaceHighlight border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-50 transition-all",
                                                    errors.paymentDay && "border-danger focus:ring-danger-50"
                                                )}
                                            />
                                            <span className="absolute right-4 top-3 text-textSecondary text-sm">of month</span>
                                        </div>
                                        {errors.paymentDay && <p className="text-danger text-xs mt-1">{errors.paymentDay.message}</p>}
                                    </div>
                                </div>

                                <div className="bg-surfaceHighlight/50 p-4 rounded-xl border border-border space-y-4">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                {...register('isFreeTrial')}
                                                className="peer sr-only"
                                            />
                                            <div className="w-10 h-6 bg-surface border border-border rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-textSecondary after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent peer-checked:after:bg-white"></div>
                                        </div>
                                        <span className="text-sm font-medium text-textSecondary group-hover:text-white transition-colors">
                                            Is this a Free Trial?
                                        </span>
                                    </label>

                                    <AnimatePresence>
                                        {isFreeTrial && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="pt-2">
                                                    <label className="block text-sm font-medium text-warning mb-1">Trial End Date</label>
                                                    <div className="relative">
                                                        <button
                                                            type="button"
                                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                                            className={cn(
                                                                "w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-warning transition-all",
                                                                errors.trialEndDate && "border-danger focus:ring-danger-50"
                                                            )}
                                                        >
                                                            <span className={!watch('trialEndDate') ? "text-textSecondary" : ""}>
                                                                {watch('trialEndDate') ? format(parseISO(watch('trialEndDate')), 'PPP', { locale: enUS }) : "Select date"}
                                                            </span>
                                                            <Calendar size={18} className="text-textSecondary" />
                                                        </button>

                                                        <AnimatePresence>
                                                            {isCalendarOpen && (
                                                                <>
                                                                    <div
                                                                        className="fixed inset-0 z-10"
                                                                        onClick={() => setIsCalendarOpen(false)}
                                                                    />
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 10 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: 10 }}
                                                                        className="absolute bottom-full left-0 mb-2 bg-surfaceHighlight border border-border rounded-xl shadow-xl z-20 p-2"
                                                                    >
                                                                        <DayPicker
                                                                            mode="single"
                                                                            selected={watch('trialEndDate') ? parseISO(watch('trialEndDate')) : undefined}
                                                                            onSelect={(date) => {
                                                                                if (date) {
                                                                                    setValue('trialEndDate', format(date, 'yyyy-MM-dd'));
                                                                                    setIsCalendarOpen(false);
                                                                                }
                                                                            }}
                                                                            locale={enUS}
                                                                            modifiersClassNames={{
                                                                                selected: "bg-accent text-white hover:bg-accentHover",
                                                                                today: "text-accent font-bold"
                                                                            }}
                                                                            styles={{
                                                                                caption: { color: 'white' },
                                                                                head_cell: { color: '#9ca3af' },
                                                                                day: { color: 'white', borderRadius: '0.5rem' },
                                                                                nav_button: { color: 'white' }
                                                                            }}
                                                                        />
                                                                    </motion.div>
                                                                </>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                    {errors.trialEndDate && <p className="text-danger text-xs mt-1">{errors.trialEndDate.message}</p>}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
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
