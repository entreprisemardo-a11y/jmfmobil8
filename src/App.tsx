import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Sidebar } from './components/layout/Sidebar.js';
import { TopBar } from './components/layout/TopBar.js';
import { DashboardShell } from './components/dashboard/DashboardShell.js';
import { VehiclesListView } from './components/vehicles/VehiclesListView.js';
import { VehicleDetailView } from './components/vehicles/VehicleDetailView.js';
import { VehicleRegistrationModal } from './components/vehicles/VehicleRegistrationModal.js';
import { PublicWebsiteView } from './components/public/PublicWebsiteView.js';
import { MobileAppPreview } from './components/mobile/MobileAppPreview.js';
import { LoginView } from './components/auth/LoginView.js';
import { MaintenanceView } from './components/maintenance/MaintenanceView.js';
import { FuelTrackingView } from './components/fuel/FuelTrackingView.js';
import { DocumentsComplianceView } from './components/documents/DocumentsComplianceView.js';
import { TelematicsView } from './components/telematics/TelematicsView.js';
import { DriversView } from './components/drivers/DriversView.js';
import { FinanceTcoView } from './components/finance/FinanceTcoView.js';
import { MissionOrdersView } from './components/missions/MissionOrdersView.js';
import { VehicleReservationsView } from './components/pool/VehicleReservationsView.js';
import { ProactiveAlertsCenterView } from './components/alerts/ProactiveAlertsCenterView.js';
import { CompanySettingsView } from './components/company/CompanySettingsView.js';
import { AdminConsoleView } from './components/admin/AdminConsoleView.js';
import { AuditLogView } from './components/admin/AuditLogView.js';
import { BillingView } from './components/billing/BillingView.js';
import { ReportsExportsView } from './components/reports/ReportsExportsView.js';
import { ConvoyManagementView } from './components/convoy/ConvoyManagementView.js';
import { ConvoyPublicFormView } from './components/convoy/ConvoyPublicFormView.js';
import { RentalView } from './components/rental/RentalView.js';
import { RentalAdminDashboardView } from './components/admin/RentalAdminDashboardView.js';
import { ChatView } from './components/chat/ChatView.js';
import { QuickChatDrawer } from './components/chat/QuickChatDrawer.js';
import { OfflineIndicator } from './components/common/OfflineIndicator.js';
import { TestAccountCreatorModal } from './components/common/TestAccountCreatorModal.js';
import { AppDownloadModal } from './components/common/AppDownloadModal.js';
import { useChat } from './hooks/useChat.js';
import { JmfLogo } from './components/common/JmfLogo.js';
import { applyPageSeo } from './utils/seoManager.js';
import { RefreshCw, Car, Wrench, Fuel, FileText, Smartphone, Globe, LayoutDashboard, ShieldCheck, Truck, MessageSquare, UserPlus, LogIn, Key, ArrowLeft, ExternalLink, Maximize2 } from 'lucide-react';

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState<'platform' | 'public' | 'rental' | 'driver'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      const page = params.get('page') || params.get('view');
      if (appParam === 'driver' || window.location.pathname.endsWith('.apk') || window.location.hash === '#driver') {
        return 'driver';
      }
      if (page === 'rental' || window.location.hash === '#rental') {
        return 'rental';
      }
      if (page === 'platform' || page === 'app' || page === 'dashboard' || window.location.hash === '#platform') {
        return 'platform';
      }
      if (page === 'public' || page === 'convoyage' || page === 'pieces-auto' || window.location.hash === '#public') {
        return 'public';
      }
      // If user previously chose rental, retain it; otherwise default to public website
      const saved = localStorage.getItem('jmf_app_mode');
      if (saved === 'rental') {
        return 'rental';
      }
    }
    return 'public';
  });
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [currentView, setCurrentView] = useState<string>('admin_console');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh_peugeot_3008');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isNewVehicleModalOpen, setIsNewVehicleModalOpen] = useState<boolean>(false);
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Save mode preference & update SEO metadata
  useEffect(() => {
    try {
      if (mode !== 'driver') {
        localStorage.setItem('jmf_app_mode', mode);
      }
    } catch {}
    if (mode === 'rental') {
      applyPageSeo('rental');
    } else if (mode === 'platform' || mode === 'driver') {
      applyPageSeo('platform');
    }
  }, [mode]);

  // Browser navigation and query params / hash synchronization
  useEffect(() => {
    const handleUrlChange = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const appParam = params.get('app');
      const page = params.get('page') || params.get('view');
      if (appParam === 'driver' || window.location.pathname.endsWith('.apk') || window.location.hash === '#driver') {
        setMode('driver');
      } else if (page === 'rental' || window.location.hash === '#rental') {
        setMode('rental');
      } else if (page === 'platform' || page === 'app' || window.location.hash === '#platform') {
        setMode('platform');
      } else if (page === 'public' || page === 'convoyage' || page === 'pieces-auto' || window.location.hash === '#public') {
        setMode('public');
      } else if (!page && !window.location.hash) {
        setMode('public');
      }
    };
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  const handleNavigateRental = (openInNewTab: boolean = false) => {
    if (openInNewTab) {
      window.open('?page=rental', '_blank');
    } else {
      setMode('rental');
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('page', 'rental');
        window.history.pushState({}, '', url.toString());
      } catch {
        window.location.hash = '#rental';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToDashboard = () => {
    setMode('platform');
    setCurrentView('dashboard');
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('page');
      url.searchParams.delete('view');
      window.history.pushState({}, '', url.pathname);
    } catch {
      window.location.hash = '';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chat = useChat(user);

  if (isLoading && mode === 'platform') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center space-y-4 text-white">
        <RefreshCw className="w-10 h-10 text-sky-500 animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Initialisation de JMF Fleet & Mobility...</p>
      </div>
    );
  }

  // Dedicated Standalone Vehicle Rental Page View (Opens on separate page)
  if (mode === 'rental') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
        {/* Dedicated Standalone Top Bar for Rental Page */}
        <header className="sticky top-0 z-40 bg-[#081020] text-white border-b border-slate-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700 shadow-2xs"
                title="Retourner au tableau de bord principal"
              >
                <ArrowLeft className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Retour Tableau de bord</span>
                <span className="sm:hidden">Dashboard</span>
              </button>
              <div className="h-5 w-px bg-slate-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <JmfLogo variant="dark" className="h-8" />
                <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 bg-teal-950/60 border border-teal-800 px-2.5 py-0.5 rounded-full">
                  <Key className="w-3 h-3" />
                  Page Dédiée • Location Automobile & Flotte
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.open('?page=rental', '_blank')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/80 transition-colors cursor-pointer"
                title="Ouvrir cette page dans un nouvel onglet"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Nouvel onglet</span>
              </button>
              <button
                onClick={() => {
                  setMode('public');
                  try {
                    const url = new URL(window.location.href);
                    url.searchParams.set('page', 'public');
                    window.history.pushState({}, '', url.toString());
                  } catch {}
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>Site Public</span>
              </button>
              <button
                onClick={handleBackToDashboard}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Espace Flotte JMF</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dedicated Standalone Page Body */}
        <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <RentalView
            isStandalone={true}
            onBackToDashboard={handleBackToDashboard}
            onNavigateView={(view) => {
              setMode('platform');
              setCurrentView(view);
              try {
                const url = new URL(window.location.href);
                url.searchParams.delete('page');
                window.history.pushState({}, '', url.pathname);
              } catch {}
            }}
            onOpenNewTab={() => window.open('?page=rental', '_blank')}
            onGoToPublicWebsite={() => {
              setMode('public');
              try {
                const url = new URL(window.location.href);
                url.searchParams.set('page', 'public');
                window.history.pushState({}, '', url.toString());
              } catch {}
            }}
          />
        </main>
      </div>
    );
  }

  // Dedicated Standalone Driver Mobile App View (?app=driver or /apk/*.apk)
  if (mode === 'driver') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
        <header className="sticky top-0 z-40 bg-[#081020] text-white border-b border-slate-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <JmfLogo variant="dark" className="h-7" />
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2.5 py-0.5 rounded-full">
                <Smartphone className="w-3 h-3" />
                App Mobile Conducteur • APK
              </span>
            </div>
            <button
              onClick={() => {
                setMode('public');
                try {
                  window.history.pushState({}, '', '/');
                } catch {}
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Site Public</span>
            </button>
          </div>
        </header>
        <main className="flex-1">
          <MobileAppPreview />
        </main>
      </div>
    );
  }

  // Public website view
  if (mode === 'public') {
    return (
      <>
        {mapsQuotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}
        <PublicWebsiteView
          onGoToApp={(tab) => {
            if (tab) setAuthTab(tab);
            setMode('platform');
          }}
          onGoToRental={handleNavigateRental}
        />
      </>
    );
  }

  // If not authenticated, display login screen
  if (!isAuthenticated) {
    return (
      <LoginView
        initialTab={authTab}
        onGoToPublic={() => setMode('public')}
        onSuccess={() => setMode('platform')}
      />
    );
  }

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentView('vehicle_detail');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Application Mode Switcher Bar */}
      <div className="bg-[#081020] text-slate-400 text-xs px-3 sm:px-4 py-1.5 flex items-center justify-between gap-3 border-b border-slate-800 z-30 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
          <span className="text-[11px] font-bold text-slate-300 whitespace-nowrap">JMF Mobilité</span>
          <span className="hidden lg:inline text-[11px] text-slate-400">• Environnement Opérationnel</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline-flex items-center text-[10px] text-sky-400 font-mono whitespace-nowrap bg-sky-950/60 border border-sky-800/60 px-1.5 py-0.2 rounded">
            Tenant actif: {user?.role || 'ADMIN'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 whitespace-nowrap">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView === 'dashboard' ? 'bg-sky-600 text-white' : 'hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3 h-3 shrink-0" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentView('admin_console')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView.startsWith('admin_') || currentView === 'settings_rbac'
                ? 'bg-indigo-600 text-white'
                : 'hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>Administration</span>
          </button>
          <button
            onClick={() => setCurrentView('convoy_management')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView.startsWith('convoy') ? 'bg-amber-600 text-white' : 'hover:text-white'
            }`}
          >
            <Truck className="w-3 h-3 shrink-0" />
            <span>Convoyage</span>
          </button>
          <button
            onClick={() => handleNavigateRental(false)}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView.startsWith('rental') ? 'bg-teal-600 text-white' : 'hover:text-white'
            }`}
            title="Ouvrir la page de location"
          >
            <Key className="w-3 h-3 text-teal-300 shrink-0" />
            <span>Location de Voitures</span>
          </button>
          <button
            onClick={() => setCurrentView('mobile_preview')}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView === 'mobile_preview' ? 'bg-sky-600 text-white' : 'hover:text-white'
            }`}
          >
            <Smartphone className="w-3 h-3 shrink-0" />
            <span className="hidden sm:inline">App Conducteur</span>
            <span className="sm:hidden">App</span>
          </button>
          <button
            onClick={() => {
              setAuthTab('register');
              setCurrentView('auth_portal');
            }}
            className={`px-2 py-0.5 rounded-sm text-[11px] font-bold transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer ${
              currentView === 'auth_portal'
                ? 'bg-sky-600 text-white'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserPlus className="w-3 h-3 text-sky-400 shrink-0" />
            <span className="hidden sm:inline">Connexion & Enregistrement</span>
            <span className="sm:hidden">Accès</span>
          </button>
          <button
            onClick={() => setMode('public')}
            className="px-2 py-0.5 rounded-sm text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span>Site Public</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
          }}
          onNavigateStandaloneRental={handleNavigateRental}
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
          {/* Top Bar */}
          <TopBar
            onToggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
            onNavigatePublicWebsite={() => setMode('public')}
            onNavigateView={(view) => setCurrentView(view)}
            onSelectVehicle={handleSelectVehicle}
          />

          {/* Dynamic Route View */}
          <main className="flex-1 pb-16">
            {currentView === 'dashboard' && (
              <DashboardShell
                onSelectVehicle={handleSelectVehicle}
                onNavigateView={(view) => setCurrentView(view)}
                onNavigateRentalStandalone={handleNavigateRental}
              />
            )}

            {(currentView.startsWith('fleet_') || currentView === 'fleet_list' || currentView === 'fleet') && (
              <VehiclesListView
                currentSubView={currentView}
                onSelectVehicle={handleSelectVehicle}
                onOpenNewVehicleModal={() => setIsNewVehicleModalOpen(true)}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {currentView === 'vehicle_detail' && (
              <VehicleDetailView
                vehicleId={selectedVehicleId}
                onBack={() => setCurrentView('fleet_all')}
                onNavigateView={(view) => setCurrentView(view)}
              />
            )}

            {currentView === 'mobile_preview' && (
              <MobileAppPreview />
            )}

            {currentView === 'sandbox_test_accounts' && (
              <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    ← Retour au tableau de bord
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    Environnement de test & Sandbox
                  </span>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <TestAccountCreatorModal
                    isOpen={true}
                    onClose={() => setCurrentView('dashboard')}
                    onAccountCreatedAndLogin={() => {
                      setCurrentView('dashboard');
                    }}
                  />
                </div>
              </div>
            )}

            {/* Modular Views for all sidebar sections */}
            {(currentView.startsWith('maintenance') || currentView === 'maintenance') && (
              <MaintenanceView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('fuel') || currentView === 'fuel') && (
              <FuelTrackingView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('docs_') || currentView === 'documents') && (
              <DocumentsComplianceView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('telematics') || currentView === 'telematics') && (
              <TelematicsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('drivers') || currentView === 'drivers') && (
              <DriversView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('mission_') || currentView === 'missions') && (
              <MissionOrdersView />
            )}

            {currentView === 'convoy_public_form' && (
              <div className="bg-slate-50 min-h-screen py-4">
                <ConvoyPublicFormView
                  onBack={() => setCurrentView('convoy_management')}
                />
              </div>
            )}

            {(currentView === 'convoy_management' || (currentView.startsWith('convoy_') && currentView !== 'convoy_public_form')) && (
              <ConvoyManagementView
                onNavigateView={(view) => setCurrentView(view)}
                onOpenNewForm={() => setCurrentView('convoy_public_form')}
              />
            )}

            {(currentView === 'rental_dashboard_admin' || currentView === 'rental_admin' || currentView === 'admin_rental_dashboard') && (
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <RentalAdminDashboardView
                  onBackToDashboard={() => setCurrentView('dashboard')}
                  onNavigateView={(view) => setCurrentView(view)}
                />
              </div>
            )}

            {(currentView === 'rental_management' || (currentView.startsWith('rental') && currentView !== 'rental_dashboard_admin' && currentView !== 'rental_admin' && currentView !== 'admin_rental_dashboard') || currentView === 'rental') && (
              <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <RentalView
                  isStandalone={false}
                  onBackToDashboard={() => setCurrentView('dashboard')}
                  onNavigateView={(view) => setCurrentView(view)}
                  onToggleFullscreen={() => handleNavigateRental(false)}
                  onOpenNewTab={() => handleNavigateRental(true)}
                  onGoToPublicWebsite={() => {
                    setMode('public');
                    try {
                      const url = new URL(window.location.href);
                      url.searchParams.set('page', 'public');
                      window.history.pushState({}, '', url.toString());
                    } catch {}
                  }}
                />
              </div>
            )}

            {(currentView.startsWith('pool_') || currentView === 'reservations' || currentView === 'pool') && (
              <VehicleReservationsView />
            )}

            {(currentView === 'proactive_alerts' || currentView.startsWith('alerts_') || currentView === 'alerts') && (
              <ProactiveAlertsCenterView
                onNavigateView={(view) => setCurrentView(view)}
              />
            )}

            {(currentView.startsWith('finance') || currentView === 'finance') && (
              <FinanceTcoView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('reports') || currentView === 'reports') && (
              <ReportsExportsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('billing') || currentView === 'billing') && (
              <BillingView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView === 'audit_logs' || currentView === 'admin_audit') && (
              <AuditLogView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView === 'admin_console' || (currentView.startsWith('admin_') && currentView !== 'admin_audit') || currentView === 'settings_rbac') && (
              <AdminConsoleView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {(currentView.startsWith('company') || currentView === 'settings_general') && (
              <CompanySettingsView
                currentSubView={currentView}
                onNavigateSubView={(subView) => setCurrentView(subView)}
              />
            )}

            {currentView === 'chat' && (
              <ChatView
                chat={chat}
                currentUser={user}
                onNavigateVehicle={(vehId) => {
                  setSelectedVehicleId(vehId);
                  setCurrentView('vehicle_detail');
                }}
                onNavigateConvoy={() => setCurrentView('convoy_management')}
              />
            )}

            {currentView === 'auth_portal' && (
              <div className="p-4 sm:p-6 max-w-4xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('dashboard')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    ← Retour au tableau de bord
                  </button>
                  <span className="text-xs text-slate-500 font-medium">
                    Session active : <strong className="text-slate-800">{user?.first_name} {user?.last_name}</strong> ({user?.role})
                  </span>
                </div>
                <LoginView
                  initialTab="register"
                  onSuccess={() => setCurrentView('dashboard')}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Floating Instant Chat Widget (available across all views except full chat) */}
      {currentView !== 'chat' && (
        <QuickChatDrawer
          chat={chat}
          currentUser={user}
          onOpenFullChat={() => setCurrentView('chat')}
        />
      )}

      {/* Vehicle Registration Modal */}
      <VehicleRegistrationModal
        isOpen={isNewVehicleModalOpen}
        onClose={() => setIsNewVehicleModalOpen(false)}
        onVehicleCreated={() => {
          setCurrentView('fleet_list');
        }}
      />

      {/* PWA Offline Connectivity Status Banner */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
