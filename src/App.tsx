import React, { useState } from 'react';
import { SystemProvider } from './context/SystemContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardPage } from './components/pages/DashboardPage';
import { StorageMonitoringPage } from './components/pages/StorageMonitoringPage';
import { EnergyManagementPage } from './components/pages/EnergyManagementPage';
import { ProduceManagementPage } from './components/pages/ProduceManagementPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { SystemControlPage } from './components/pages/SystemControlPage';
import { SettingsPage } from './components/pages/SettingsPage';
import { LoginModal } from './components/pages/LoginModal';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const renderCurrentPage = () => {
    switch (activeTab) {
      case 'storage':
        return <StorageMonitoringPage />;
      case 'energy':
        return <EnergyManagementPage />;
      case 'produce':
        return <ProduceManagementPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'control':
        return <SystemControlPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <DashboardPage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Topbar
          onToggleMobileSidebar={() => setIsOpenMobile(!isOpenMobile)}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderCurrentPage()}
        </main>

        {/* Global Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">AGROFROST</span>
            <span>• Solar-Powered Smart Cold Storage System</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px]">
            <span>SIH 2026 Problem ID: <strong>SIH26005</strong></span>
            <span>• North Eastern Region (NER) Agricultural Cluster</span>
          </div>
        </footer>
      </div>

      {/* Authentication / Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}

export default App;
