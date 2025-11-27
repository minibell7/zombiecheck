import { useState, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Navigation } from './components/Navigation';
import { DashboardView } from './views/DashboardView';
import { CalendarView } from './views/CalendarView';
import { AllItemsView } from './views/AllItemsView';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Subscription } from './types';
import { Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('subscriptions', []);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'items'>('dashboard');
  const [itemsFilter, setItemsFilter] = useState<'all' | 'today' | 'week'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const totalMonthlyCost = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      if (sub.cycle === 'Monthly') {
        return total + Number(sub.amount);
      } else {
        return total + (Number(sub.amount) / 12);
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
      if (subscriptions.length >= 100) {
        alert('You can only add up to 100 items.');
        return;
      }
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

  const handleDashboardNavigation = (filter: 'all' | 'today' | 'week') => {
    setItemsFilter(filter);
    setActiveTab('items');
  };

  return (
    <Layout>
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddClick={() => setIsModalOpen(true)}
      />

      <div className="min-h-screen bg-surface pt-0 md:pt-20 pb-24 md:pb-10 px-4 md:px-8 transition-all">
        {activeTab === 'dashboard' && (
          <DashboardView
            subscriptions={subscriptions}
            totalMonthlyCost={totalMonthlyCost}
            onNavigate={handleDashboardNavigation}
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
            filter={itemsFilter}
          />
        )}
      </div>

      <div className="md:hidden fixed bottom-20 left-0 right-0 pointer-events-none z-40 px-6">
        <div className="absolute right-6 w-14 h-14 pointer-events-auto group">
          <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-30 animate-ping duration-1000"></span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="relative w-14 h-14 bg-accent hover:bg-accentHover text-white rounded-full flex items-center justify-center shadow-lg shadow-accent-30 transition-transform hover:scale-105 active:scale-95"
            aria-label="Add Subscription"
          >
            <Plus size={28} />
          </button>
        </div>
      </div>

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
