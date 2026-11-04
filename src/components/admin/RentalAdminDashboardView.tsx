import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Key,
  Car,
  Gauge,
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Users,
  Building2,
  CheckCircle2,
  Printer,
  Download,
  RotateCcw,
  FileText,
  MessageSquare,
  Search,
  ArrowUpRight,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Tag,
  Eye,
  Check,
  X,
  CreditCard,
  MapPin,
  HelpCircle,
  Percent,
} from 'lucide-react';
import { pricingService, RentalBookingRecord, RentalVehiclePricing } from '../../services/pricingService.js';
import { JmfLogo } from '../common/JmfLogo.js';
import { generateRentalQuotePdf } from '../../utils/pdfRentalQuoteGenerator.js';

export interface RentalAdminDashboardViewProps {
  onBackToDashboard?: () => void;
  onNavigateView?: (view: string) => void;
}

export const RentalAdminDashboardView: React.FC<RentalAdminDashboardViewProps> = ({
  onBackToDashboard,
  onNavigateView,
}) => {
  // 1. Live Data Synced from pricingService
  const [fleet, setFleet] = useState<RentalVehiclePricing[]>(() => pricingService.getRentalFleetPricing());
  const [bookings, setBookings] = useState<RentalBookingRecord[]>(() => pricingService.getRentalBookings());

  useEffect(() => {
    const handleUpdate = () => {
      setFleet(pricingService.getRentalFleetPricing());
      setBookings(pricingService.getRentalBookings());
    };
    const unsubscribe = pricingService.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  // 2. Filters & View States
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'THIS_MONTH' | 'LAST_7_DAYS' | 'TODAY'>('ALL');
  const [clientTypeFilter, setClientTypeFilter] = useState<'ALL' | 'ENTREPRISE' | 'PARTICULIER'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'EN_COURS' | 'CONFIRMÉE' | 'TERMINÉE' | 'EN_ATTENTE_ACOMPTE'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBookingForDrawer, setSelectedBookingForDrawer] = useState<RentalBookingRecord | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // 3. Filtered Bookings for calculations and table
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status
      if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
      // Client type
      if (clientTypeFilter !== 'ALL' && b.clientType !== clientTypeFilter) return false;

      // Time Filter (relative to current demo date 2026-10-07)
      if (timeFilter === 'THIS_MONTH') {
        if (!b.startDate.startsWith('2026-10')) return false;
      } else if (timeFilter === 'LAST_7_DAYS') {
        const d = new Date(b.startDate).getTime();
        const ref = new Date('2026-10-07').getTime();
        const diffDays = (ref - d) / (1000 * 3600 * 24);
        if (diffDays < -5 || diffDays > 7) return false;
      } else if (timeFilter === 'TODAY') {
        if (b.startDate !== '2026-10-07' && b.endDate !== '2026-10-07') return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchRef = b.reference.toLowerCase().includes(q);
        const matchClient = b.clientName.toLowerCase().includes(q);
        const matchCompany = b.companyName?.toLowerCase().includes(q) || false;
        const matchVehicle = b.vehicleName.toLowerCase().includes(q);
        const matchPlate = b.plateNumber.toLowerCase().includes(q);
        return matchRef || matchClient || matchCompany || matchVehicle || matchPlate;
      }

      return true;
    });
  }, [bookings, statusFilter, clientTypeFilter, timeFilter, searchQuery]);

  // 4. REAL KPIS CALCULATION
  const stats = useMemo(() => {
    const totalFleetCount = fleet.length;

    // Ongoing bookings (vehicles currently rented out)
    const onGoingBookings = bookings.filter((b) => b.status === 'EN_COURS');
    const onGoingCount = onGoingBookings.length;

    // Confirmed upcoming bookings
    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMÉE');
    const confirmedCount = confirmedBookings.length;

    // Completed bookings
    const completedBookings = bookings.filter((b) => b.status === 'TERMINÉE');
    const completedCount = completedBookings.length;

    // Pending bookings
    const pendingCount = bookings.filter((b) => b.status === 'EN_ATTENTE_ACOMPTE').length;

    // Currently deployed vehicles IDs (status = EN_COURS)
    const deployedVehicleIds = new Set(onGoingBookings.map((b) => b.vehicleId));
    const deployedVehiclesCount = deployedVehicleIds.size;
    const availableVehiclesCount = Math.max(0, totalFleetCount - deployedVehiclesCount);

    // Fleet utilization rate (%)
    const fleetUtilizationRate = totalFleetCount > 0 ? Math.round((deployedVehiclesCount / totalFleetCount) * 100) : 0;

    // Potential utilization including confirmed bookings
    const potentialUtilizationRate = totalFleetCount > 0 ? Math.round(((deployedVehiclesCount + confirmedCount) / totalFleetCount) * 100) : 0;

    // Revenues
    // 1. Total contracted revenue (all non-canceled bookings)
    const validBookings = bookings.filter((b) => b.status !== 'ANNULÉE');
    const totalRevenueFcfa = validBookings.reduce((sum, b) => sum + (b.totalAmountFcfa || 0), 0);

    // 2. Projected / pipeline revenue (in progress + confirmed + pending)
    const pipelineRevenueFcfa = bookings
      .filter((b) => b.status === 'EN_COURS' || b.status === 'CONFIRMÉE' || b.status === 'EN_ATTENTE_ACOMPTE')
      .reduce((sum, b) => sum + (b.totalAmountFcfa || 0), 0);

    // 3. Revenue from Chauffeur services
    const driverRevenueFcfa = validBookings.reduce((sum, b) => sum + (b.driverCostFcfa || 0), 0);

    // 4. Revenue from Add-on options
    const optionsRevenueFcfa = validBookings.reduce((sum, b) => sum + (b.optionsCostFcfa || 0), 0);

    // 5. Revenue from Overstay penalties (Late return fees)
    const penaltiesRevenueFcfa = validBookings.reduce((sum, b) => sum + (b.totalPenaltyFcfa || 0), 0);
    const penaltiesCasesCount = validBookings.filter((b) => (b.totalPenaltyFcfa || 0) > 0).length;

    // 6. Active deposits under escrow
    const activeDepositsFcfa = onGoingBookings.reduce((sum, b) => sum + (b.depositFcfa || 0), 0);

    // 7. Average booking ticket (Panier moyen)
    const averageTicketFcfa = validBookings.length > 0 ? Math.round(totalRevenueFcfa / validBookings.length) : 0;

    // 8. Average length of rental (Durée moyenne en jours)
    const totalDaysCount = validBookings.reduce((sum, b) => sum + (b.daysCount || 0), 0);
    const averageDays = validBookings.length > 0 ? Math.round((totalDaysCount / validBookings.length) * 10) / 10 : 0;

    // 9. B2B Corporate share (%)
    const b2bRevenue = validBookings
      .filter((b) => b.clientType === 'ENTREPRISE')
      .reduce((sum, b) => sum + (b.totalAmountFcfa || 0), 0);
    const b2bPercentage = totalRevenueFcfa > 0 ? Math.round((b2bRevenue / totalRevenueFcfa) * 100) : 0;

    // 10. With-Driver share (%)
    const withDriverBookingsCount = validBookings.filter((b) => b.withDriver).length;
    const withDriverPercentage = validBookings.length > 0 ? Math.round((withDriverBookingsCount / validBookings.length) * 100) : 0;

    // 11. Category Breakdown (revenue & bookings count)
    const categoryStats: Record<string, { count: number; revenue: number; label: string }> = {
      SUV_4X4: { count: 0, revenue: 0, label: 'SUV & 4x4 Haut de Gamme' },
      BERLINE: { count: 0, revenue: 0, label: 'Berlines Exécutives' },
      PICKUP: { count: 0, revenue: 0, label: 'Pick-up Utilitaires & Chantier' },
      CITADINE: { count: 0, revenue: 0, label: 'Citadines Urbaines' },
      PRESTIGE: { count: 0, revenue: 0, label: 'Prestige & VIP Luxe' },
      MINIBUS: { count: 0, revenue: 0, label: 'Minibus & Transport Équipe' },
    };

    validBookings.forEach((b) => {
      const cat = b.vehicleCategory || 'BERLINE';
      if (!categoryStats[cat]) {
        categoryStats[cat] = { count: 0, revenue: 0, label: cat };
      }
      categoryStats[cat].count += 1;
      categoryStats[cat].revenue += b.totalAmountFcfa || 0;
    });

    return {
      totalFleetCount,
      onGoingCount,
      confirmedCount,
      completedCount,
      pendingCount,
      totalBookingsCount: validBookings.length,
      deployedVehiclesCount,
      availableVehiclesCount,
      fleetUtilizationRate,
      potentialUtilizationRate,
      totalRevenueFcfa,
      pipelineRevenueFcfa,
      driverRevenueFcfa,
      optionsRevenueFcfa,
      penaltiesRevenueFcfa,
      penaltiesCasesCount,
      activeDepositsFcfa,
      averageTicketFcfa,
      averageDays,
      b2bRevenue,
      b2bPercentage,
      withDriverBookingsCount,
      withDriverPercentage,
      categoryStats,
    };
  }, [fleet, bookings]);

  // Status Change Handler
  const handleUpdateStatus = (bookingId: string, newStatus: RentalBookingRecord['status']) => {
    const success = pricingService.updateRentalBookingStatus(bookingId, newStatus);
    if (success) {
      showNotification(`Statut du dossier mis à jour avec succès : ${newStatus}`);
      if (selectedBookingForDrawer?.id === bookingId) {
        setSelectedBookingForDrawer((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  // Reset demo bookings
  const handleResetData = () => {
    if (window.confirm('Voulez-vous réinitialiser les contrats de location aux dossiers certifiés d’origine ?')) {
      pricingService.resetRentalBookings();
      showNotification('Données de location réinitialisées avec succès.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150 pb-12">
      {/* 1. Header with Breadcrumb & Action Controls */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-2">
          {/* Breadcrumb Navigation */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer font-semibold text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tableau de bord</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <button
              type="button"
              onClick={() => onNavigateView?.('rental_management')}
              className="hover:text-indigo-600 transition-colors cursor-pointer text-slate-700 font-semibold"
            >
              Location de Véhicules
            </button>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-slate-900 font-bold">Dashboard Admin & KPIs</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
              TEMPS RÉEL
            </span>
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Tableau de Bord & KPIs Location Automobile</span>
              <span className="p-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
                <BarChart3 className="w-5 h-5" />
              </span>
            </h1>
            <p className="text-xs text-slate-500 max-w-2xl mt-0.5">
              Pilotage financier, suivi des réservations actives, rotation de la flotte et rentabilité opérationnelle du parc de location JMF Mobility Services.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
          <button
            type="button"
            onClick={() => onNavigateView?.('admin_pricing')}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Accéder à la gestion des tarifs et pénalités"
          >
            <Tag className="w-4 h-4 text-amber-600" />
            <span>Tarifs & Overstay</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateView?.('rental_management')}
            className="px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Consulter le catalogue complet"
          >
            <Key className="w-4 h-4" />
            <span>Catalogue Location</span>
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Imprimer le rapport de performance"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer Rapport</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 text-xs transition-colors cursor-pointer"
            title="Réinitialiser les dossiers de location"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {feedbackMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="p-1 hover:bg-emerald-100 rounded text-emerald-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Primary Hero KPI Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Active Ongoing Rentals */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Réservations En Cours</span>
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
              {stats.onGoingCount} <span className="text-sm font-semibold text-slate-500">en mission</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-[10px]">
                +{stats.confirmedCount} confirmées
              </span>
              <span className="text-slate-400 text-[11px]">sur {stats.totalBookingsCount} contrats</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>En attente validation :</span>
            <strong className="text-slate-800 font-mono">{stats.pendingCount} dossier(s)</strong>
          </div>
        </div>

        {/* KPI 2: Pipeline Revenue & Total Contracted */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden group hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Revenus Prévisionnels</span>
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tracking-tight">
              {stats.pipelineRevenueFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px]">Total historique :</span>
              <strong className="text-slate-900 font-mono text-[11px]">
                {stats.totalRevenueFcfa.toLocaleString('fr-FR')} FCFA
              </strong>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Panier moyen / dossier :</span>
            <strong className="text-slate-800 font-mono">{stats.averageTicketFcfa.toLocaleString('fr-FR')} FCFA</strong>
          </div>
        </div>

        {/* KPI 3: Fleet Utilization Rate */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden group hover:border-teal-300 transition-all">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Taux d'Utilisation Flotte</span>
            <div className="p-2 rounded-xl bg-teal-50 border border-teal-100 text-teal-600">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div className="text-2xl sm:text-3xl font-black font-mono text-teal-700 tracking-tight">
                {stats.fleetUtilizationRate}%
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {stats.deployedVehiclesCount}/{stats.totalFleetCount} véhicules
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, stats.fleetUtilizationRate)}%` }}
              />
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Disponibles en agence :</span>
            <strong className="text-emerald-700 font-mono font-bold">{stats.availableVehiclesCount} modèles</strong>
          </div>
        </div>

        {/* KPI 4: Escrow Deposits & Overstay Penalties */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cautions & Pénalités</span>
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-100 text-amber-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black font-mono text-amber-800 tracking-tight">
              {stats.activeDepositsFcfa.toLocaleString('fr-FR')}{' '}
              <span className="text-xs font-normal text-slate-500">FCFA</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px]">Cautions actives sous séquestre</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Pénalités retard perçues :</span>
            <strong className="text-amber-900 font-mono font-bold bg-amber-50 px-1.5 py-0.5 rounded">
              +{stats.penaltiesRevenueFcfa.toLocaleString('fr-FR')} FCFA ({stats.penaltiesCasesCount}j)
            </strong>
          </div>
        </div>
      </div>

      {/* 3. Secondary Analytical Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Durée Moyenne (ALOR)</span>
          </div>
          <div className="text-lg font-black font-mono text-slate-900">
            {stats.averageDays} jours
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Par contrat de location</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            <span>Prestations Chauffeur</span>
          </div>
          <div className="text-lg font-black font-mono text-teal-700">
            {stats.withDriverPercentage}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">{stats.driverRevenueFcfa.toLocaleString('fr-FR')} FCFA générés</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Building2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Part Entreprises (B2B)</span>
          </div>
          <div className="text-lg font-black font-mono text-sky-800">
            {stats.b2bPercentage}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Facturation avec IFU</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Tag className="w-3.5 h-3.5 text-amber-600" />
            <span>Options & Équipements</span>
          </div>
          <div className="text-lg font-black font-mono text-amber-800">
            {stats.optionsRevenueFcfa.toLocaleString('fr-FR')} FCFA
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Wi-Fi, km illimité, sièges</div>
        </div>
      </div>

      {/* 4. Live Fleet Operational Matrix (Visual Status of all 8 Vehicles) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-teal-600" />
              <span>Matrice Opérationnelle & Statut de la Flotte en Direct</span>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                {fleet.length} véhicules
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Disponibilité immédiate, affectation contractuelle et revenus cumulés par véhicule.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Disponible ({stats.availableVehiclesCount})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span>En location ({stats.deployedVehiclesCount})</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fleet.map((veh) => {
            // Check if vehicle is currently in an ongoing booking
            const activeBooking = bookings.find((b) => b.vehicleId === veh.id && b.status === 'EN_COURS');
            const upcomingBooking = bookings.find((b) => b.vehicleId === veh.id && b.status === 'CONFIRMÉE');
            const isRented = !!activeBooking;

            // Vehicle total revenue
            const vehRevenue = bookings
              .filter((b) => b.vehicleId === veh.id && b.status !== 'ANNULÉE')
              .reduce((sum, b) => sum + (b.totalAmountFcfa || 0), 0);

            return (
              <div
                key={veh.id}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isRented
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider">
                        {veh.category.replace('_', ' ')}
                      </span>
                      <strong className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                        {veh.brand} {veh.model}
                      </strong>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isRented
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : upcomingBooking
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {isRented ? 'EN LOCATION' : upcomingBooking ? 'RÉSERVÉ' : 'DISPONIBLE'}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono font-bold text-slate-500 flex items-center justify-between">
                    <span>{veh.plateNumber}</span>
                    <span className="text-teal-800">{veh.dailyRateFcfa.toLocaleString('fr-FR')} FCFA/j</span>
                  </div>

                  {isRented && activeBooking && (
                    <div className="p-2.5 rounded-lg bg-amber-100/60 border border-amber-200 text-[11px] text-amber-950 space-y-0.5">
                      <div className="font-bold truncate">{activeBooking.clientName}</div>
                      <div className="text-[10px] text-amber-800">
                        Retour prévu : {activeBooking.endDate} ({activeBooking.endTime})
                      </div>
                    </div>
                  )}

                  {!isRented && upcomingBooking && (
                    <div className="p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-950 space-y-0.5">
                      <div className="font-bold truncate">{upcomingBooking.clientName}</div>
                      <div className="text-[10px] text-sky-700">
                        Départ le : {upcomingBooking.startDate} ({upcomingBooking.startTime})
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Revenus générés :</span>
                  <strong className="font-mono text-slate-800">{vehRevenue.toLocaleString('fr-FR')} FCFA</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Revenue Breakdown by Category & Clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Category Revenue Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>Performance & Chiffre d'Affaires par Catégorie de Véhicules</span>
              </h3>
              <p className="text-xs text-slate-500">
                Volume de contrats et répartition des flux financiers sur le parc.
              </p>
            </div>
            <span className="text-[10px] font-bold text-slate-400 font-mono uppercase">Distribution</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(stats.categoryStats).map(([catKey, catData]) => {
              const share = stats.totalRevenueFcfa > 0 ? Math.round((catData.revenue / stats.totalRevenueFcfa) * 100) : 0;

              return (
                <div key={catKey} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-slate-800 flex items-center gap-2">
                      <span className="font-bold text-slate-900">{catData.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({catData.count} contrat{catData.count > 1 ? 's' : ''})</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      {catData.revenue.toLocaleString('fr-FR')} FCFA <span className="text-[10px] text-slate-400 font-normal">({share}%)</span>
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, share)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Client Segmentation & Formula breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Typologie Client & Formules</span>
            </h3>
            <p className="text-xs text-slate-500">
              Répartition des profils et services souscrits.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Segment Entreprise vs Particulier */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Segment B2B vs B2C</span>
                <span className="text-sky-700 font-mono">{stats.b2bPercentage}% B2B</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-sky-600 h-full" style={{ width: `${stats.b2bPercentage}%` }} title="Entreprises" />
                <div className="bg-emerald-500 h-full" style={{ width: `${100 - stats.b2bPercentage}%` }} title="Particuliers" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Entreprises : {stats.b2bRevenue.toLocaleString('fr-FR')} F</span>
                <span>Particuliers : {(stats.totalRevenueFcfa - stats.b2bRevenue).toLocaleString('fr-FR')} F</span>
              </div>
            </div>

            {/* Formule Avec Chauffeur vs Autonomie */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span>Formule de conduite</span>
                <span className="text-teal-700 font-mono">{stats.withDriverPercentage}% Chauffeur</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden flex">
                <div className="bg-teal-600 h-full" style={{ width: `${stats.withDriverPercentage}%` }} title="Avec Chauffeur" />
                <div className="bg-slate-400 h-full" style={{ width: `${100 - stats.withDriverPercentage}%` }} title="Autonomie" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Avec Chauffeur JMF ({stats.withDriverBookingsCount})</span>
                <span>Sans Chauffeur ({stats.totalBookingsCount - stats.withDriverBookingsCount})</span>
              </div>
            </div>

            {/* Overstay Security Notice */}
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Politique Overstay & Pénalités</span>
              </div>
              <p className="text-[11px] text-amber-900 leading-relaxed">
                Taux d'adhésion aux pénalités : 100% des dossiers ont validé la clause légale de majoration de 35%/j en cas de retard de restitution au-delà de 2h de tolérance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Active Bookings Management Table (Control Center) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
        {/* Table Header & Interactive Filter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Gestion Centrale des Dossiers & Contrats de Location</span>
              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                {filteredBookings.length} affichés
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Validation des étapes, changement de statut en temps réel et suivi financier des dossiers.
            </p>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Réf, client, immatriculation..."
                className="h-9 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-56"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="EN_COURS">En cours (Mission active)</option>
              <option value="CONFIRMÉE">Confirmée (À venir)</option>
              <option value="TERMINÉE">Terminée (Véhicule restitué)</option>
              <option value="EN_ATTENTE_ACOMPTE">En attente acompte</option>
            </select>

            {/* Client Filter */}
            <select
              value={clientTypeFilter}
              onChange={(e) => setClientTypeFilter(e.target.value as any)}
              className="h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Tous clients</option>
              <option value="ENTREPRISE">Entreprises (B2B)</option>
              <option value="PARTICULIER">Particuliers (B2C)</option>
            </select>

            {/* Time Filter */}
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="h-9 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Toutes dates</option>
              <option value="THIS_MONTH">Mois en cours (Octobre)</option>
              <option value="LAST_7_DAYS">7 derniers jours</option>
              <option value="TODAY">Aujourd'hui</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-3">Réf. Contrat</th>
                <th className="py-3 px-3">Véhicule</th>
                <th className="py-3 px-3">Client / Entreprise</th>
                <th className="py-3 px-3">Période & Durée</th>
                <th className="py-3 px-3">Chauffeur</th>
                <th className="py-3 px-3">Montant Net</th>
                <th className="py-3 px-3">Statut Dossier</th>
                <th className="py-3 px-3 text-right">Actions rapides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                    Aucun dossier de location ne correspond aux critères de filtre.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForDrawer(book)}
                        className="hover:text-indigo-600 text-left cursor-pointer transition-colors"
                        title="Voir fiche complète"
                      >
                        {book.reference}
                      </button>
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">{book.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-slate-900 block font-bold leading-tight">{book.vehicleName}</strong>
                      <span className="text-[10px] text-slate-500 font-mono">{book.plateNumber}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">
                        {book.companyName || book.clientName}
                      </div>
                      <div className="text-[10px] text-slate-400">{book.clientPhone}</div>
                      {book.companyIfu && (
                        <div className="text-[9px] text-indigo-600 font-mono">IFU: {book.companyIfu}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      <div>Du {book.startDate} au {book.endDate}</div>
                      <div className="flex flex-wrap items-center gap-1 mt-0.5">
                        <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded">
                          {book.daysCount} jour{book.daysCount > 1 ? 's' : ''}
                        </span>
                        {book.totalPenaltyFcfa && book.totalPenaltyFcfa > 0 ? (
                          <span className="text-[9px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded" title="Pénalité de dépassement">
                            +{book.totalPenaltyFcfa.toLocaleString('fr-FR')} F dép.
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {book.withDriver ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {book.driverName ? 'Chauffeur JMF' : 'Chauffeur inclus'}
                        </span>
                      ) : (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-medium">
                          Sans chauffeur
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {book.totalAmountFcfa.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          book.status === 'CONFIRMÉE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : book.status === 'EN_COURS'
                            ? 'bg-amber-100 text-amber-800'
                            : book.status === 'TERMINÉE'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-sky-100 text-sky-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Status Modifiers */}
                        {book.status === 'CONFIRMÉE' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(book.id, 'EN_COURS')}
                            className="px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors cursor-pointer"
                            title="Véhicule remis au client : Début de mission"
                          >
                            Activer
                          </button>
                        )}

                        {book.status === 'EN_COURS' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(book.id, 'TERMINÉE')}
                            className="px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            title="Véhicule restitué : Clôturer la mission"
                          >
                            Restituer
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setSelectedBookingForDrawer(book)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Fiche détaillée"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                            `Contrat location ${book.reference} (${book.vehicleName}) pour ${book.clientName}. Total: ${book.totalAmountFcfa.toLocaleString('fr-FR')} FCFA. Statut: ${book.status}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="WhatsApp direct"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Slide-over / Modal Drawer for Complete Contract Inspection */}
      {selectedBookingForDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-600 block tracking-wider">
                  Dossier de Location JMF
                </span>
                <h3 className="text-lg font-black text-slate-900 leading-tight">
                  {selectedBookingForDrawer.reference}
                </h3>
                <span className="text-xs text-slate-400">Émis le {selectedBookingForDrawer.createdAt}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBookingForDrawer(null)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status Control within Drawer */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Statut actuel :</span>
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-mono">
                  {selectedBookingForDrawer.status}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">Changer :</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBookingForDrawer.id, 'EN_COURS')}
                  className="px-2 py-1 rounded bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 text-[10px] font-bold cursor-pointer"
                >
                  En cours
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBookingForDrawer.id, 'TERMINÉE')}
                  className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold cursor-pointer"
                >
                  Terminée
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedBookingForDrawer.id, 'ANNULÉE')}
                  className="px-2 py-1 rounded bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200 text-[10px] font-bold cursor-pointer"
                >
                  Annuler
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Véhicule loué</span>
                <strong className="text-slate-900 block font-bold">{selectedBookingForDrawer.vehicleName}</strong>
                <span className="text-slate-500 font-mono text-[10px]">{selectedBookingForDrawer.plateNumber}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Client / Société</span>
                <strong className="text-slate-900 block font-bold">{selectedBookingForDrawer.companyName || selectedBookingForDrawer.clientName}</strong>
                <span className="text-slate-500 text-[10px]">{selectedBookingForDrawer.clientPhone}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Période & Durée</span>
                <strong className="text-slate-900 block text-[11px]">
                  Du {selectedBookingForDrawer.startDate} ({selectedBookingForDrawer.startTime})
                </strong>
                <span className="text-slate-600 block text-[10px]">
                  Au {selectedBookingForDrawer.endDate} ({selectedBookingForDrawer.endTime}) — {selectedBookingForDrawer.daysCount} jour(s)
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Prestation Chauffeur</span>
                <strong className="text-slate-900 block text-[11px]">
                  {selectedBookingForDrawer.withDriver ? 'Chauffeur certifié JMF' : 'Conduite autonome'}
                </strong>
                <span className="text-slate-500 text-[10px]">
                  Lieu : {selectedBookingForDrawer.pickupLocation}
                </span>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Location véhicule ({selectedBookingForDrawer.daysCount}j) :</span>
                <span>{selectedBookingForDrawer.vehicleCostFcfa.toLocaleString('fr-FR')} FCFA</span>
              </div>
              {selectedBookingForDrawer.driverCostFcfa > 0 && (
                <div className="flex justify-between text-teal-300">
                  <span>Prestation chauffeur :</span>
                  <span>+{selectedBookingForDrawer.driverCostFcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              {selectedBookingForDrawer.optionsCostFcfa > 0 && (
                <div className="flex justify-between text-sky-300">
                  <span>Options d'équipement :</span>
                  <span>+{selectedBookingForDrawer.optionsCostFcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              {selectedBookingForDrawer.totalPenaltyFcfa && selectedBookingForDrawer.totalPenaltyFcfa > 0 ? (
                <div className="flex justify-between text-amber-300 font-bold">
                  <span>Pénalité de dépassement ({selectedBookingForDrawer.penaltyDays}j) :</span>
                  <span>+{selectedBookingForDrawer.totalPenaltyFcfa.toLocaleString('fr-FR')} FCFA</span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline font-bold text-white text-sm">
                <span>Total Net TTC :</span>
                <span className="text-emerald-400 text-base">{selectedBookingForDrawer.totalAmountFcfa.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Dépôt de garantie / Caution :</span>
                <span>{selectedBookingForDrawer.depositFcfa.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const b = selectedBookingForDrawer;
                    const veh = fleet.find((f) => f.id === b.vehicleId);
                    generateRentalQuotePdf({
                      reference: b.reference,
                      issueDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                      vehicle: {
                        brand: b.vehicleName.split(' ')[0] || 'Véhicule',
                        model: b.vehicleName.split(' ').slice(1).join(' ') || 'JMF',
                        plateNumber: b.plateNumber,
                        category: b.vehicleCategory,
                        seats: 5,
                        transmission: 'Automatique',
                        fuelType: 'Essence / Diesel',
                        dailyRateFcfa: b.baseDailyRateFcfa,
                        driverDailyFeeFcfa: 20000,
                        depositFcfa: b.depositFcfa,
                      },
                      dates: {
                        startDate: b.startDate,
                        startTime: b.startTime || '09:00',
                        endDate: b.endDate,
                        endTime: b.endTime || '18:00',
                        pickupPlace: b.pickupLocation,
                        returnPlace: b.returnLocation || b.pickupLocation,
                        baseDays: b.daysCount,
                        totalHours: b.daysCount * 24,
                        extraHours: 0,
                        graceHours: 2,
                      },
                      client: {
                        name: b.clientName,
                        phone: b.clientPhone,
                        email: b.clientEmail,
                        clientType: b.clientType,
                        companyName: b.companyName,
                        companyIfu: b.companyIfu,
                        driverLicenseNumber: b.driverLicenseNumber,
                      },
                      service: {
                        withDriver: b.withDriver,
                        options: {
                          babySeat: b.optionsSelected?.some((o) => o.includes('Bébé')) || false,
                          wifi: b.optionsSelected?.some((o) => o.includes('Wi-Fi')) || false,
                          unlimitedKm: b.optionsSelected?.some((o) => o.includes('Illimité')) || false,
                          secondDriver: b.optionsSelected?.some((o) => o.includes('Conducteur')) || false,
                        },
                        paymentMethod: b.paymentMethod,
                      },
                      pricing: {
                        baseDailyRate: b.baseDailyRateFcfa,
                        discountPercent: b.daysCount >= 30 ? 25 : b.daysCount >= 7 ? 15 : b.daysCount >= 3 ? 8 : 0,
                        discountAmount: b.discountFcfa || 0,
                        discountedVehicleCost: b.vehicleCostFcfa,
                        driverCost: b.driverCostFcfa || 0,
                        optionsCost: b.optionsCostFcfa || 0,
                        penaltyDays: b.penaltyDays || 0,
                        penaltyDailyRateFcfa: b.penaltyDailyRateFcfa || Math.round(b.baseDailyRateFcfa * 1.35),
                        totalPenaltyFcfa: b.totalPenaltyFcfa || 0,
                        subtotalBeforePenalty: b.vehicleCostFcfa + (b.driverCostFcfa || 0) + (b.optionsCostFcfa || 0),
                        totalAmountFcfa: b.totalAmountFcfa,
                        depositFcfa: b.depositFcfa,
                      },
                    });
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-slate-700"
                  title="Télécharger le devis proforma officiel au format PDF"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  <span>Télécharger Devis (PDF)</span>
                </button>

                <a
                  href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                    `Bonjour, dossier location ${selectedBookingForDrawer.reference} (${selectedBookingForDrawer.vehicleName}) pour ${selectedBookingForDrawer.clientName}. Total: ${selectedBookingForDrawer.totalAmountFcfa.toLocaleString('fr-FR')} FCFA.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBookingForDrawer(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
