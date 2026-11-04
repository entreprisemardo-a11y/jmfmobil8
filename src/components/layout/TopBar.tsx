import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Calendar,
  Bell,
  ChevronDown,
  Building,
  LogOut,
  User,
  ShieldCheck,
  ExternalLink,
  Check,
  MessageSquare,
  UserPlus,
  Smartphone,
  Key,
  CheckCircle2,
  Clock,
  Car,
  AlertTriangle,
  BarChart3,
  X,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { PWAInstallButton } from '../common/PWAInstallButton.js';
import { GlobalSearchBar } from '../common/GlobalSearchBar.js';
import { pricingService, RentalBookingRecord } from '../../services/pricingService.js';
import { AppDownloadModal } from '../common/AppDownloadModal.js';
import { TestAccountCreatorModal } from '../common/TestAccountCreatorModal.js';
import { CurrencySelector } from '../common/CurrencySelector.js';

interface TopBarProps {
  onToggleMobileMenu: () => void;
  onNavigatePublicWebsite?: () => void;
  onNavigateView?: (view: string) => void;
  onSelectVehicle?: (vehicleId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileMenu,
  onNavigatePublicWebsite,
  onNavigateView,
  onSelectVehicle,
}) => {
  const { user, company, accessibleCompanies, logout, switchCompany, login } = useAuth();
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);
  const [activeNotifTab, setActiveNotifTab] = useState<'reservations' | 'fleet'>('reservations');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showAppDownloadModal, setShowAppDownloadModal] = useState(false);
  const [showTestAccountModal, setShowTestAccountModal] = useState(false);

  // Live rental bookings synchronization from pricingService
  const [rentalBookings, setRentalBookings] = useState<RentalBookingRecord[]>(() =>
    pricingService.getRentalBookings()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setRentalBookings(pricingService.getRentalBookings());
    };
    const unsubscribe = pricingService.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  // Filter pending reservation requests
  const pendingReservations = rentalBookings.filter((b) => b.status === 'EN_ATTENTE_ACOMPTE');

  const handleValidateBooking = (e: React.MouseEvent, id: string, ref: string) => {
    e.stopPropagation();
    const ok = pricingService.updateRentalBookingStatus(id, 'CONFIRMÉE');
    if (ok) {
      setFeedbackToast(`Réservation ${ref} validée avec succès !`);
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const handleRejectBooking = (e: React.MouseEvent, id: string, ref: string) => {
    e.stopPropagation();
    const ok = pricingService.updateRentalBookingStatus(id, 'ANNULÉE');
    if (ok) {
      setFeedbackToast(`Demande de réservation ${ref} rejetée.`);
      setTimeout(() => setFeedbackToast(null), 3500);
    }
  };

  const companyMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (companyMenuRef.current && !companyMenuRef.current.contains(event.target as Node)) {
        setShowCompanyMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotificationMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickRoleSwitch = async (email: string, pass: string) => {
    setShowUserMenu(false);
    await login(email, pass);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200/80 shadow-xs">
      {/* Left section: Hamburger & Tenant Selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Company / Tenant Selector Dropdown */}
        <div className="relative" ref={companyMenuRef}>
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
          >
            <Building className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="max-w-[160px] sm:max-w-[200px] truncate">
              {company ? company.name : 'JMF Mobility Services (Global)'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          </button>

          {/* Tenant Switcher Dropdown */}
          {showCompanyMenu && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                Entreprises accessibles (Multi-tenant)
              </div>
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                {accessibleCompanies.map((c) => {
                  const isSelected = company?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        switchCompany(c.id);
                        setShowCompanyMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs transition-colors hover:bg-slate-50 ${
                        isSelected ? 'bg-sky-50 font-semibold text-sky-700' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-600 truncate">{c.city}, {c.country} • {c.currency}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center section: Global Search Bar across vehicles, drivers, and documents */}
      <div className="hidden md:flex items-center flex-1 max-w-lg mx-4">
        <GlobalSearchBar
          onNavigateView={onNavigateView}
          onSelectVehicle={onSelectVehicle}
          placeholder="Rechercher véhicules, conducteurs, documents (Cmd+K)..."
        />
      </div>

      {/* Right section: Date period, Notifications, Signature, User profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA In-App Install Prompt */}
        <PWAInstallButton variant="compact" />

        {/* Pan-African Currency Selector (USD, EUR, XOF) */}
        <CurrencySelector variant="header" className="shrink-0" />

        {/* Date Period Indicator */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <span>01/05/2026 - 31/05/2026</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </div>

        {/* Instant Chat Dispatch Button */}
        <button
          onClick={() => onNavigateView?.('chat')}
          className="relative p-2 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Messagerie instantanée & Dispatch"
          aria-label="Messagerie instantanée"
        >
          <MessageSquare className="w-4 h-4 text-amber-600" />
          <span className="absolute top-1 right-1 flex items-center justify-center w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
              pendingReservations.length > 0
                ? 'text-amber-600 bg-amber-50 hover:bg-amber-100/80 ring-1 ring-amber-300'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={
              pendingReservations.length > 0
                ? `${pendingReservations.length} demande(s) de réservation en attente de validation !`
                : 'Notifications et alertes'
            }
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {pendingReservations.length > 0 ? (
              <>
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center px-1 text-[9px] font-black text-white bg-amber-600 rounded-full shadow-xs animate-pulse">
                  {pendingReservations.length}
                </span>
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                </span>
              </>
            ) : (
              <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-rose-500 rounded-full">
                12
              </span>
            )}
          </button>

          {/* Feedback Toast if action performed */}
          {feedbackToast && (
            <div className="fixed top-20 right-6 z-50 p-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
          )}

          {/* Notifications Dropdown */}
          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-88 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden">
              {/* Header with Title and Tabs */}
              <div className="px-3.5 pt-2 pb-2.5 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <Bell className="w-4 h-4 text-sky-600" />
                    <span>Centre des Notifications</span>
                  </span>
                  {pendingReservations.length > 0 && (
                    <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      {pendingReservations.length} réservation{pendingReservations.length > 1 ? 's' : ''} à valider
                    </span>
                  )}
                </div>

                {/* Sub-Tabs: Réservations vs Alertes Flotte */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveNotifTab('reservations')}
                    className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeNotifTab === 'reservations'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 text-teal-600" />
                    <span>Réservations</span>
                    {pendingReservations.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-mono">
                        {pendingReservations.length}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveNotifTab('fleet')}
                    className={`py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeNotifTab === 'fleet'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
                    <span>Alertes Flotte</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[9px] font-mono">
                      12
                    </span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Demandes de Réservation en attente de validation */}
              {activeNotifTab === 'reservations' && (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  {pendingReservations.length > 0 ? (
                    pendingReservations.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3.5 hover:bg-slate-50 transition-colors space-y-2 bg-amber-50/20"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                                {booking.reference}
                              </span>
                              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded-full">
                                En attente validation
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 mt-1">
                              {booking.clientName}
                            </h4>
                            <p className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Car className="w-3 h-3 text-slate-400" />
                              <span>{booking.vehicleName} ({booking.plateNumber})</span>
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium shrink-0">
                            {booking.createdAt}
                          </span>
                        </div>

                        {/* Summary Details */}
                        <div className="p-2 bg-white rounded-lg border border-slate-200/80 space-y-1 text-[11px]">
                          <div className="flex justify-between text-slate-600">
                            <span>Période :</span>
                            <span className="font-semibold text-slate-900">
                              Du {booking.startDate} au {booking.endDate} ({booking.daysCount}j)
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>Formule & Chauffeur :</span>
                            <span className="font-semibold text-slate-900">
                              {booking.withDriver ? 'Avec Chauffeur JMF' : 'Sans Chauffeur'}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-700 pt-1 border-t border-slate-100 font-bold">
                            <span>Montant Total TTC :</span>
                            <span className="font-mono text-emerald-600 text-xs">
                              {booking.totalAmountFcfa.toLocaleString('fr-FR')} FCFA
                            </span>
                          </div>
                        </div>

                        {/* Fast Admin Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={(e) => handleValidateBooking(e, booking.id, booking.reference)}
                            className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                            title="Valider la réservation et confirmer le dossier"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Valider</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowNotificationMenu(false);
                              onNavigateView?.('rental_dashboard_admin');
                            }}
                            className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-slate-200"
                            title="Ouvrir le dossier dans le tableau de bord"
                          >
                            <span>Dossier</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleRejectBooking(e, booking.id, booking.reference)}
                            className="py-1.5 px-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                            title="Rejeter la demande"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-800">Aucune réservation en attente</h4>
                      <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                        Toutes les demandes de location ont été validées ou traitées. Vous serez alerté dès qu'une nouvelle réservation arrive.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Alertes Flotte & Maintenance */}
              {activeNotifTab === 'fleet' && (
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                  <div
                    onClick={() => {
                      setShowNotificationMenu(false);
                      onNavigateView?.('maintenance_sms');
                    }}
                    className="p-3 hover:bg-teal-50/70 transition-colors cursor-pointer bg-teal-50/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-teal-700 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                        Alertes SMS Maintenance Particulier
                      </span>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-teal-100 text-teal-800 rounded">Live SMS</span>
                    </div>
                    <div className="text-slate-600 text-[11px] mt-0.5">Vidange requise dans 600 km (Toyota Prado BJ-1122-PT). Passerelle active.</div>
                    <div className="text-[10px] text-teal-600 font-semibold mt-1">À l’instant • +229 97 88 99 00</div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-rose-600">Assurance expirée (3 véhicules)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Iveco Daily BJ-7890-KL et 2 autres non conformes.</div>
                    <div className="text-[10px] text-slate-400 mt-1">Aujourd’hui</div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-amber-600">Visite technique à échéance (6 véhicules)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Échéance dans moins de 30 jours (Peugeot 3008 BJ-1234-CD).</div>
                    <div className="text-[10px] text-slate-400 mt-1">Aujourd’hui</div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="font-semibold text-amber-600">Maintenance en retard (4 véhicules)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">Entretiens et révisions périodiques dépassés.</div>
                    <div className="text-[10px] text-slate-400 mt-1">Hier</div>
                  </div>
                </div>
              )}

              {/* Dropdown Footer */}
              <div className="p-2 border-t border-slate-100 bg-slate-50 rounded-b-xl space-y-1">
                {activeNotifTab === 'reservations' ? (
                  <button
                    onClick={() => {
                      setShowNotificationMenu(false);
                      onNavigateView?.('rental_dashboard_admin');
                    }}
                    className="w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-center text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    <span>Accéder au Dashboard Admin Location & KPIs</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowNotificationMenu(false);
                      onNavigateView?.('proactive_alerts');
                    }}
                    className="w-full py-1.5 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-center text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Ouvrir le Centre d'Alertes & Relances</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Official Slogan/Signature */}
        <div className="hidden 2xl:flex items-center pr-2 text-right">
          <div className="italic text-[11px] font-semibold tracking-wide bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
            « Votre mobilité, notre performance ! »
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1 text-left rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
              alt={user ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-800">
                {user ? `${user.first_name} ${user.last_name}` : 'Jean KOUASSI'}
              </div>
              <div className="text-[10px] text-slate-500">
                {user?.role === 'SUPER_ADMIN_JMF' ? 'Super Admin JMF' : 'Administrateur'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-900">{user?.first_name} {user?.last_name}</div>
                <div className="text-[11px] text-slate-500">{user?.email}</div>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 text-sky-700">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Rôle: {user?.role}</span>
                </div>
              </div>

              {/* Fast Role Switchers for testing */}
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                Changer d'utilisateur (Test & Évaluation)
              </div>
              <div className="px-2 space-y-0.5 text-xs">
                <button
                  onClick={() => handleQuickRoleSwitch('jean.kouassi@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Jean KOUASSI (Admin SARL)</span>
                  {user?.email === 'jean.kouassi@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('admin@jmf-mobility.com', 'admin123')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Super Admin JMF (Global)</span>
                  {user?.email === 'admin@jmf-mobility.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('koffi.aman@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Koffi AMAN (Fleet Manager)</span>
                  {user?.email === 'koffi.aman@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('pierre.dossou@societe-cliente.com', 'jmf2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Pierre DOSSOU (Conducteur)</span>
                  {user?.email === 'pierre.dossou@societe-cliente.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
                <button
                  onClick={() => handleQuickRoleSwitch('marc.allagbe@bollore-logistics.com', 'bollore2026')}
                  className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-100 flex items-center justify-between text-slate-700"
                >
                  <span>Marc ALLAGBE (Admin Bolloré)</span>
                  {user?.email === 'marc.allagbe@bollore-logistics.com' && <Check className="w-3.5 h-3.5 text-sky-600" />}
                </button>
              </div>

              <div className="my-1.5 border-t border-slate-100"></div>

              {/* Self-service Test Account creation */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowTestAccountModal(true);
                }}
                className="w-full px-4 py-2 text-left text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-bold cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Créer un compte test (Sandbox)</span>
              </button>

              {/* Self-service Module download */}
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  setShowAppDownloadModal(true);
                }}
                className="w-full px-4 py-2 text-left text-xs text-sky-700 hover:bg-sky-50 flex items-center gap-2 font-medium cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span>Télécharger l'App (Conducteur/Flotte)</span>
              </button>

              {onNavigateView && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigateView('auth_portal');
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                >
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <span>S'enregistrer / Nouvelle flotte</span>
                </button>
              )}

              {onNavigatePublicWebsite && (
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigatePublicWebsite();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                  <span>Voir le site public JMF</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AppDownloadModal
        isOpen={showAppDownloadModal}
        onClose={() => setShowAppDownloadModal(false)}
        defaultPart="driver"
      />

      <TestAccountCreatorModal
        isOpen={showTestAccountModal}
        onClose={() => setShowTestAccountModal(false)}
        onAccountCreatedAndLogin={async (email, pass) => {
          try {
            await login(email, pass);
            setFeedbackToast(`Connecté avec succès sous ${email} !`);
            setTimeout(() => setFeedbackToast(null), 3500);
          } catch (e: any) {
            setFeedbackToast(e.message || 'Erreur de connexion');
            setTimeout(() => setFeedbackToast(null), 3500);
          }
        }}
      />
    </header>
  );
};
