import { useState, useMemo, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { AllItemsView } from './views/AllItemsView';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { WelcomeModal } from './components/WelcomeModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Subscription } from './types';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { SettingsModal } from './components/SettingsModal';

function App() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subscriptions', []);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage<boolean>('hasSeenOnboarding', false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'items'>('dashboard');
  const [itemsFilter, setItemsFilter] = useState<'all' | 'today' | 'week'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  // Migration: Ensure all subscriptions have new fields
  useEffect(() => {
    let hasChanges = false;
    const migrated = subscriptions.map(sub => {
      const updates: Partial<Subscription> = {};
      if (!sub.paymentDay) updates.paymentDay = 1;
      if (sub.isFreeTrial === undefined) updates.isFreeTrial = false;
      if (sub.trialEndDate === undefined) updates.trialEndDate = '';
      if (sub.status === undefined) updates.status = 'active';

      if (Object.keys(updates).length > 0) {
        hasChanges = true;
        return { ...sub, ...updates };
      }
      return sub;
    });

    if (hasChanges) {
      setSubscriptions(migrated);
    }
  }, [subscriptions, setSubscriptions]);

  const totalMonthlyCost = useMemo(() => {
    return subscriptions
      .filter(sub => sub.status !== 'to_cancel')
      .reduce((total, sub) => total + Number(sub.amount), 0);
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
      if (subscriptions.length >= 100) {
        alert('You can only add up to 100 items.');
        return;
      }
      const newSubscription: Subscription = {
        id: uuidv4(),
        ...data,
        status: 'active',
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

  const handleStatusChange = (id: string, status: 'active' | 'to_cancel') => {
    setSubscriptions(prev => prev.map(sub =>
      sub.id === id ? { ...sub, status } : sub
    ));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubscription(null);
  };

  const handleDashboardNavigation = (filter: 'all' | 'today' | 'week') => {
    setItemsFilter(filter);
    setActiveTab('items');
  };

  const handleTabChange = (tab: 'dashboard' | 'calendar' | 'items') => {
    if (tab === 'items') {
      setItemsFilter('all'); // Always reset filter when clicking "All Items"
    }
    setActiveTab(tab);
  };

  return (
    <Layout>
      <Navigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onAddClick={() => setIsModalOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      <div className="min-h-screen bg-surface pt-0 lg:pt-20 pb-24 lg:pb-10 px-4 lg:px-8 transition-all">
        {activeTab === 'dashboard' && (
          <DashboardView
            subscriptions={subscriptions}
            totalMonthlyCost={totalMonthlyCost}
            onNavigate={handleDashboardNavigation}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            subscriptions={subscriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'items' && (
          <AllItemsView
            subscriptions={subscriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            filter={itemsFilter}
            onClearFilter={() => setItemsFilter('all')}
          />
        )}
      </div>

      <div className="lg:hidden fixed bottom-24 right-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accentHover text-white px-5 py-3 rounded-full font-bold shadow-lg shadow-accent-30 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          aria-label="Add Subscription"
        >
          <Plus size={20} />
          Add Item
        </button>
      </div>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddSubscription}
        editingSubscription={editingSubscription}
      />

      <WelcomeModal
        isOpen={!hasSeenOnboarding}
        onClose={() => setHasSeenOnboarding(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        subscriptions={subscriptions}
        setSubscriptions={setSubscriptions}
      />
    </Layout>
  );
}

export default App;
