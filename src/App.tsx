import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Auth/Login';
import Navigation from './components/Layout/Navigation';
import InventoryDashboard from './components/Dashboard/InventoryDashboard';
import SalesEntry from './components/Sales/SalesEntry';
import RestockSuggestions from './components/AI/RestockSuggestions';
import SalesInsights from './components/Analytics/SalesInsights';
import ChatBot from './components/AI/ChatBot';
import ConfigurationHelper from './components/AI/ConfigurationHelper';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!currentUser) {
    return <Login />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <InventoryDashboard />;
      case 'sales':
        return <SalesEntry />;
      case 'restock':
        return <RestockSuggestions />;
      case 'insights':
        return <SalesInsights />;
      case 'chat':
        return <ChatBot />;
      case 'config':
        return <ConfigurationHelper />;
      default:
        return <InventoryDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;