import { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { SubscriptionCard } from './components/SubscriptionCard';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Subscription } from './types';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subscriptions', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const totalMonthlyCost = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      if (sub.cycle === 'Monthly') {
        return total + sub.amount;
      } else {
        return total + (sub.amount / 12);
      }
    }, 0);
  }, [subscriptions]);

  const handleAddSubscription = (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingSubscription) {
      setSubscriptions(prev => prev.map(sub =>
        sub.id === editingSubscription.id
          ? { ...sub, ...data, updatedAt: new Date().toISOString() }
          : sub
      ));
      setEditingSubscription(null);
    } else {
      const newSubscription: Subscription = {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setSubscriptions(prev => [newSubscription, ...prev]);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  return (
    <Layout>
      <Dashboard totalMonthlyCost={totalMonthlyCost} />

      <div className="px-6 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Your Subscriptions</h2>
          <span className="text-xs text-textSecondary bg-surfaceHighlight px-2 py-1 rounded-full">
            {subscriptions.length} items
          </span>
        </div>

        <div className="space-y-1">
          <AnimatePresence>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12 text-textSecondary opacity-50">
                <p>No subscriptions yet.</p>
                <p className="text-sm mt-1">Tap + to add one.</p>
              </div>
            ) : (
              subscriptions.map(sub => (
                <SubscriptionCard
                  key={sub.id}
                  subscription={sub}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute bottom-8 right-6 w-14 h-14 bg-accent hover:bg-accentHover text-white rounded-full flex items-center justify-center shadow-lg shadow-accent/30 transition-transform hover:scale-105 active:scale-95"
        aria-label="Add Subscription"
      >
        <Plus size={28} />
      </button>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddSubscription}
        editingSubscription={editingSubscription}
      />
    </Layout>
  );
}

export default App;
