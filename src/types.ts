export interface Subscription {
    id: string;
    itemName: string;
    amount: number;
    paymentDay: number; // 1-31
    category: 'subscription' | 'fixed';
    isFreeTrial?: boolean;
    trialEndDate?: string; // ISO string
    status?: 'active' | 'to_cancel';
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
