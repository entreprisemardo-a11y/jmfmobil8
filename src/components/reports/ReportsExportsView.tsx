import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  PieChart,
  Truck,
  Fuel,
  Wrench,
  ShieldCheck,
  AlertTriangle,
  Search,
  Check,
  Building2,
  Users,
  Radio,
  FileSpreadsheet,
  ArrowDownToLine,
  Layers,
  Sparkles,
  ExternalLink,
  Printer,
  ChevronDown,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { localDb } from '../../services/localDb.js';
import {
  generateFleetPdfReport,
  generateFleetExcelReport,
  generateTcoPdfReport,
  generateTcoExcelReport,
  DEFAULT_TCO_DATASET,
  FleetVehicleExportItem,
  VehicleTcoExportItem,
} from '../../utils/fleetExportGenerator.js';

interface ReportsExportsViewProps {
  currentSubView?: string;
  onNavigateSubView?: (subView: string) => void;
}

interface ReportItem {
  id: string;
  title: string;
  category: 'EXPLOITATION' | 'CARBURANT' | 'MAINTENANCE' | 'CONFORMITE' | 'RSE' | 'FINANCE';
  frequency: string;
  lastGenerated: string;
  fileFormat: 'PDF' | 'EXCEL' | 'MULTI';
  description: string;
  keyMetric: string;
  keyMetricLabel: string;
}

const AVAILABLE_REPORTS: ReportItem[] = [
  {
    id: 'rep_tco_analysis',
    title: 'Audit Financier & Total Cost of Ownership (TCO)',
    category: 'FINANCE',
    frequency: 'Mensuel & Exercice Annuel (2026)',
    lastGenerated: 'Aujourd\'hui à 09:30',
    fileFormat: 'MULTI',
    description: 'Consolidation financière intégrale de la flotte : décomposition des 5 postes (carburant, maintenance, assurances, pneus, taxes), coût de revient kilométrique FCFA/km et préconisations d\'optimisation.',
    keyMetric: '508 F/km',
    keyMetricLabel: 'Coût TCO moyen parc',
  },
  {
    id: 'rep_monthly_ops',
    title: 'Rapport Mensuel d’Exploitation & Kilométrage',
    category: 'EXPLOITATION',
    frequency: 'Mensuel (Septembre 2026)',
    lastGenerated: '21/09/2026 à 08:30',
    fileFormat: 'PDF',
    description: 'Synthèse de l’activité globale de la flotte : taux d’utilisation par véhicule, rotation des missions, répartition des trajets urbains vs interurbains Bénin.',
    keyMetric: '458 900 km',
    keyMetricLabel: 'Distance cumulée',
  },
  {
    id: 'rep_fuel_efficiency',
    title: 'Audit Carburant, Cartes & Éco-Conduite',
    category: 'CARBURANT',
    frequency: 'Hebdomadaire & Mensuel',
    lastGenerated: '20/09/2026 à 18:00',
    fileFormat: 'MULTI',
    description: 'Rapprochement des cartes TotalEnergies/Oryx, détection des anomalies de consommation anormale (>12L/100km) et classements des chauffeurs éco-responsables.',
    keyMetric: '9.8 L/100',
    keyMetricLabel: 'Conso moyenne parc',
  },
  {
    id: 'rep_maintenance_costs',
    title: 'Bilan Maintenance Préventive & Coûts d’Atelier',
    category: 'MAINTENANCE',
    frequency: 'Mensuel',
    lastGenerated: '19/09/2026 à 14:15',
    fileFormat: 'PDF',
    description: 'Ventilation des interventions préventives vs curatives, approvisionnement en pièces d’usure (plaquettes, filtres, pneumatiques) et temps moyen d’immobilisation.',
    keyMetric: '94.4%',
    keyMetricLabel: 'Taux disponibilité',
  },
  {
    id: 'rep_cnsr_compliance',
    title: 'Audit de Conformité Réglementaire & Sécurité CNSR',
    category: 'CONFORMITE',
    frequency: 'Bimensuel',
    lastGenerated: '21/09/2026 à 07:00',
    fileFormat: 'MULTI',
    description: 'Tableau de bord exhaustif des validités : visites techniques CNSR Cotonou/Parakou, polices assurances NSIA/Sanlam, TVM DGI et extincteurs certifiés SIC.',
    keyMetric: '92.0%',
    keyMetricLabel: 'Taux conformité',
  },
  {
    id: 'rep_carbon_footprint',
    title: 'Bilan Empreinte Carbone & Émissions CO2',
    category: 'RSE',
    frequency: 'Trimestriel (T3 2026)',
    lastGenerated: '15/09/2026 à 10:00',
    fileFormat: 'PDF',
    description: 'Calcul des tonnes équivalent CO2 émises sur les corridors routiers béninois et recommandations d’optimisation des tournées logistiques.',
    keyMetric: '118.4 t',
    keyMetricLabel: 'CO2 estimé ce mois',
  },
];

export const ReportsExportsView: React.FC<ReportsExportsViewProps> = ({
  currentSubView = 'reports_overview',
  onNavigateSubView,
}) => {
  const { user, company } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'exports'>('overview');
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Export State & Filters
  const [selectedDataset, setSelectedDataset] = useState<'fleet' | 'tco' | 'fuel' | 'maintenance' | 'docs'>('fleet');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');
  const [selectedSite, setSelectedSite] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  useEffect(() => {
    if (currentSubView === 'reports_exports') {
      setActiveTab('exports');
    } else if (currentSubView === 'reports_overview' || currentSubView?.startsWith('reports')) {
      setActiveTab('overview');
    }
  }, [currentSubView]);

  const handleSubTabSwitch = (tab: 'overview' | 'exports') => {
    setActiveTab(tab);
    if (onNavigateSubView) {
      if (tab === 'exports') onNavigateSubView('reports_exports');
      else onNavigateSubView('reports_overview');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Fetch real stored vehicles from localDb
  const rawVehicles = useMemo(() => {
    return localDb.getVehicles().data;
  }, []);

  // Filtered vehicles according to the user's active filter criteria
  const filteredVehicles: FleetVehicleExportItem[] = useMemo(() => {
    let list = rawVehicles.map((v) => ({
      registration: v.registration_number,
      brand: v.brand,
      model: v.model,
      version: (v as any).version || '',
      category: v.category || v.vehicle_type || 'VP',
      vehicle_type: v.vehicle_type || 'VP',
      energy_type: (v as any).energy_type || 'Diesel',
      year: (v as any).year || 2023,
      current_mileage: v.current_mileage || 0,
      fuel_level_percent: (v as any).fuel_level_percent,
      status: v.status,
      driverName: v.driver?.name,
      siteName: v.site?.name,
      acquisition_mode: (v as any).acquisition_mode,
      purchase_value: (v as any).purchase_value,
      monthly_lease: (v as any).monthly_lease,
      supplier: (v as any).supplier,
    }));

    // Filter by site
    if (selectedSite !== 'ALL') {
      const siteLower = selectedSite.toLowerCase();
      list = list.filter((item) => {
        if (!item.siteName) return false;
        const s = item.siteName.toLowerCase();
        if (siteLower === 'marina' || siteLower === 'siege') return s.includes('siège') || s.includes('marina') || s.includes('cotonou');
        if (siteLower === 'hub_logistique') return s.includes('logistique') || s.includes('hub') || s.includes('central');
        if (siteLower === 'port') return s.includes('port');
        if (siteLower === 'calavi') return s.includes('calavi');
        return s.includes(siteLower);
      });
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      if (selectedStatus === 'active') {
        list = list.filter((v) => (v.status as string) === 'active' || (v.status as string) === 'EN SERVICE');
      } else if (selectedStatus === 'maintenance') {
        list = list.filter((v) => (v.status as string) === 'maintenance' || (v.status as string) === 'immobilized');
      } else if (selectedStatus === 'available') {
        list = list.filter((v) => (v.status as string) === 'available');
      }
    }

    // Filter by category
    if (selectedCategory !== 'ALL') {
      list = list.filter((v) => v.category === selectedCategory || v.vehicle_type === selectedCategory);
    }

    // Filter by search query
    if (searchFilter.trim()) {
      const q = searchFilter.trim().toLowerCase();
      list = list.filter(
        (v) =>
          v.registration.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          (v.driverName && v.driverName.toLowerCase().includes(q)) ||
          (v.siteName && v.siteName.toLowerCase().includes(q))
      );
    }

    return list;
  }, [rawVehicles, selectedSite, selectedStatus, selectedCategory, searchFilter]);

  // Unique categories for filtering
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    rawVehicles.forEach((v) => {
      if (v.category) cats.add(v.category);
    });
    return Array.from(cats);
  }, [rawVehicles]);

  const handleDownloadReport = (rep: ReportItem) => {
    // Generate filtered PDF or text summary based on report type
    if (rep.id === 'rep_tco_analysis') {
      if (rep.fileFormat === 'PDF' || rep.fileFormat === 'MULTI') {
        generateTcoPdfReport(DEFAULT_TCO_DATASET, {
          companyName: company?.name || 'JMF Mobility Services Client',
          generatedBy: `${user?.first_name || 'Direction'} ${user?.last_name || 'Financière'}`,
          periodLabel: rep.frequency,
          currency: 'FCFA',
        });
        showToast(`Rapport officiel PDF d'audit TCO généré et téléchargé avec succès !`);
      } else {
        generateTcoExcelReport(DEFAULT_TCO_DATASET, {
          companyName: company?.name || 'JMF Mobility Services Client',
          generatedBy: `${user?.first_name || 'Direction'} ${user?.last_name || 'Financière'}`,
        });
        showToast(`Classeur Excel d'audit TCO exporté avec succès !`);
      }
      return;
    }

    if (rep.fileFormat === 'PDF' || rep.fileFormat === 'MULTI') {
      generateFleetPdfReport(filteredVehicles, {
        companyName: company?.name || 'JMF Mobility Services Client',
        generatedBy: `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'}`,
        siteFilter: selectedSite === 'ALL' ? 'Tous les sites opérationnels' : selectedSite,
        categoryFilter: rep.title,
        statusFilter: 'Audit Complet & Relevés Kilométriques',
        periodLabel: rep.frequency,
      });
      showToast(`Rapport officiel PDF « ${rep.title} » généré et téléchargé avec succès !`);
    } else {
      generateFleetExcelReport(filteredVehicles, {
        companyName: company?.name || 'JMF Mobility Services Client',
        generatedBy: `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'}`,
        siteFilter: selectedSite === 'ALL' ? 'Tous les sites' : selectedSite,
        categoryFilter: rep.category,
        statusFilter: 'Tous statuts',
      });
      showToast(`Fichier Excel « ${rep.title} » exporté avec succès !`);
    }
  };

  const handleExecuteExport = () => {
    setIsExporting(true);

    try {
      const cleanDate = new Date().toISOString().split('T')[0];
      const companyName = company?.name || 'JMF Mobility Services Client';
      const author = `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'} (${user?.role || 'ADMIN'})`;

      if (exportFormat === 'pdf') {
        if (selectedDataset === 'tco') {
          generateTcoPdfReport(DEFAULT_TCO_DATASET, {
            companyName,
            generatedBy: author,
            periodLabel: 'Exercice Annuel 2026',
            currency: 'FCFA',
          });
          showToast(`Document officiel PDF d'audit TCO généré avec succès !`);
        } else {
          generateFleetPdfReport(filteredVehicles, {
            companyName,
            generatedBy: author,
            siteFilter: selectedSite === 'ALL' ? 'Tous les sites opérationnels' : selectedSite,
            categoryFilter: selectedCategory === 'ALL' ? 'Toutes catégories' : selectedCategory,
            statusFilter: selectedStatus === 'ALL' ? 'Tous statuts' : selectedStatus,
            searchFilter: searchFilter.trim() || undefined,
          });
          showToast(`Document PDF officiel généré avec succès (${filteredVehicles.length} véhicules inclus) !`);
        }
      } else if (exportFormat === 'excel') {
        if (selectedDataset === 'tco') {
          generateTcoExcelReport(DEFAULT_TCO_DATASET, {
            companyName,
            generatedBy: author,
          });
          showToast(`Classeur Microsoft Excel d'audit TCO exporté avec succès !`);
        } else {
          generateFleetExcelReport(filteredVehicles, {
            companyName,
            generatedBy: author,
            siteFilter: selectedSite === 'ALL' ? 'Tous les sites' : selectedSite,
            categoryFilter: selectedCategory === 'ALL' ? 'Toutes catégories' : selectedCategory,
            statusFilter: selectedStatus === 'ALL' ? 'Tous statuts' : selectedStatus,
          });
          showToast(`Classeur Microsoft Excel (.xls) exporté avec succès (${filteredVehicles.length} lignes) !`);
        }
      } else if (exportFormat === 'csv') {
        let filename = `export_${selectedDataset}_${cleanDate}.csv`;
        let content = '';

        if (selectedDataset === 'tco') {
          const headers = [
            'Immatriculation',
            'Modele',
            'Conducteur',
            'Km_Cumules',
            'Carburant_FCFA',
            'Entretien_FCFA',
            'Assurances_FCFA',
            'Pneus_FCFA',
            'Total_TCO_FCFA',
            'FCFA_par_Km',
            'Efficience'
          ];
          const rows = DEFAULT_TCO_DATASET.map((v) => [
            `"${v.reg}"`,
            `"${v.model}"`,
            `"${v.driver}"`,
            v.total_km,
            v.fuel_cost,
            v.maintenance_cost,
            v.insurance_taxes_cost,
            v.tires_cost,
            v.total_cost,
            v.cost_per_km,
            `"${v.efficiency_rating}"`
          ]);
          content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        } else if (selectedDataset === 'fleet') {
          const headers = [
            'Immatriculation',
            'Marque',
            'Modèle',
            'Version',
            'Catégorie',
            'Type',
            'Énergie',
            'Année',
            'Kilométrage_km',
            'Statut',
            'Conducteur_Attitré',
            'Site_Opérationnel',
            'Mode_Acquisition',
            'Valeur_Achat_FCFA',
            'Loyer_Mensuel_FCFA',
            'Fournisseur',
          ];
          const rows = filteredVehicles.map((v) => [
            `"${v.registration}"`,
            `"${v.brand}"`,
            `"${v.model}"`,
            `"${v.version || ''}"`,
            `"${v.category}"`,
            `"${v.vehicle_type}"`,
            `"${v.energy_type}"`,
            v.year,
            v.current_mileage,
            `"${v.status}"`,
            `"${v.driverName || 'Non affecté'}"`,
            `"${v.siteName || 'Siège Cotonou'}"`,
            `"${v.acquisition_mode || 'LLD'}"`,
            v.purchase_value || 0,
            v.monthly_lease || 0,
            `"${v.supplier || 'CFAO Motors Bénin'}"`,
          ]);
          content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        } else if (selectedDataset === 'fuel') {
          content = `Date,Vehicule,Conducteur,Station,Litre,Montant_FCFA,Kilometrage_Saisi,Ratio_L100
"2026-09-20","BJ-1234-CD","Pierre DOSSOU","TotalEnergies Marina",55.5,38850,56780,9.2
"2026-09-19","BJ-5678-EF","Koffi AMAN","Oryx Station Centrale",72.0,50400,112400,11.4
"2026-09-18","BJ-9012-GH","Mathieu KPADONOU","Shell Port Cotonou",68.0,47600,24300,9.8
"2026-09-17","BJ-3456-IJ","Michel HOUNGBO","TotalEnergies Étoile Rouge",90.0,63000,145600,14.2
"2026-09-16","BJ-7890-KL","Jean KOUASSI","Oryx Ganhi",65.0,45500,42100,10.1`;
        } else if (selectedDataset === 'maintenance') {
          content = `Date,Vehicule,Nature_Intervention,Atelier,Cout_Pieces_Francs,Main_Oeuvre_Francs,Statut
"2026-09-15","BJ-1234-CD","Révision constructeur 50 000 km","CFAO Motors",85000,25000,"CLÔTURÉ"
"2026-09-10","BJ-5678-EF","Remplacement plaquettes avant & vidange","Atelier Central JMF",45000,15000,"CLÔTURÉ"
"2026-09-04","BJ-3456-IJ","Recharge gaz frigorifique & contrôle compresseur","Techni-Froid Service",120000,35000,"CLÔTURÉ"
"2026-08-28","BJ-9012-GH","Permutation pneus & géométrie","SOCAR Service",35000,12000,"CLÔTURÉ"`;
        } else {
          content = `Vehicule,Document,Emetteur,Date_Emission,Date_Expiration,Statut
"BJ-1234-CD","Police Assurance Flotte","NSIA Assurances","2025-09-30","2026-09-30","ÉCHÉANCE PROCHE"
"BJ-1234-CD","Visite Technique Périodique","Centre Contrôle Technique Agréé","2025-10-10","2026-10-10","ÉCHÉANCE PROCHE"
"BJ-5678-EF","Visite Technique Périodique","Centre Contrôle Technique Agréé","2025-03-15","2026-03-15","EXPIRÉ"
"BJ-9012-GH","Carte Grise Définitive","ANaTT Bénin","2024-01-10","2029-01-10","VALIDE"
"BJ-7890-KL","Taxe sur les Véhicules à Moteur (TVM)","DGI Bénin","2026-01-05","2027-01-05","VALIDE"`;
        }

        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(`Exportation CSV « ${filename} » téléchargée avec succès !`);
      } else {
        // JSON
        const filename = `export_${selectedDataset}_${cleanDate}.json`;
        const content = JSON.stringify(
          selectedDataset === 'tco' ? DEFAULT_TCO_DATASET : filteredVehicles,
          null,
          2
        );
        const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast(`Exportation JSON « ${filename} » générée avec succès !`);
      }
    } catch (err) {
      console.error('Erreur export :', err);
      showToast('Une erreur est survenue lors de l\'exportation.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1680px] mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Rapports & Décisionnel</span>
            <span>&gt;</span>
            <span className="font-semibold text-slate-700">
              {activeTab === 'overview' ? 'Synthèses & Audits de Flotte' : 'Centre d’Exports de Données'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-sky-600" />
            <span>
              {activeTab === 'overview' ? 'Rapports & Analyses d’Activité' : 'Centre d’Exports Multi-Formats'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeTab === 'overview'
              ? 'Rapports consolidés d’exploitation, audits de conformité CNSR, bilans carburant et KPI décisionnels.'
              : 'Extraction instantanée de vos données brutes de flotte aux formats CSV (Excel) et JSON filtrées par site.'}
          </p>
        </div>

        {/* 2 Sub-tabs matching the sidebar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button
              onClick={() => handleSubTabSwitch('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-600" />
              <span>Rapports & Audits ({AVAILABLE_REPORTS.length})</span>
            </button>
            <button
              onClick={() => handleSubTabSwitch('exports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'exports'
                  ? 'bg-white text-sky-700 shadow-xs ring-1 ring-sky-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ArrowDownToLine className="w-3.5 h-3.5 text-sky-600" />
              <span>Centre d’Exports (CSV / Excel)</span>
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setPeriod('month')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'month' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Septembre 2026
              </button>
              <button
                onClick={() => setPeriod('quarter')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'quarter' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                T3 2026
              </button>
              <button
                onClick={() => setPeriod('year')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  period === 'year' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Année 2026
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Taux de Disponibilité</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-2">94.4%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">118 sur 125 véhicules prêts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conformité Légale</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-600 mt-2">92.0%</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">CNSR, NSIA, TVM à jour</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Conso Moyenne Flotte</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600 mt-2">9.8 L/100</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-medium">-0.4L vs mois précédent</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Distance Cumulée</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">458 900 km</div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Parcourus sur le réseau routier & corridors</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VUE 1 : RAPPORTS ET AUDITS */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List of 5 Standard Reports */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Rapports d’Activité Consolidés</h3>
                <span className="text-xs text-slate-500">Mise à jour en temps réel</span>
              </div>

              <div className="space-y-3">
                {AVAILABLE_REPORTS.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-sky-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                            {rep.category}
                          </span>
                          <span className="text-xs text-slate-400 font-mono">• {rep.frequency}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{rep.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{rep.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-black text-slate-900 font-mono">{rep.keyMetric}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{rep.keyMetricLabel}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 text-[11px]">Dernière extraction : {rep.lastGenerated}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (rep.id === 'rep_tco_analysis') {
                              generateTcoPdfReport(DEFAULT_TCO_DATASET, {
                                companyName: company?.name || 'JMF Mobility Services Client',
                                generatedBy: `${user?.first_name || 'Direction'} ${user?.last_name || 'Financière'}`,
                                periodLabel: rep.frequency,
                                currency: 'FCFA',
                              });
                              showToast(`Rapport officiel PDF d'audit TCO téléchargé !`);
                            } else {
                              generateFleetPdfReport(filteredVehicles, {
                                companyName: company?.name || 'JMF Mobility Services Client',
                                generatedBy: `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'}`,
                                siteFilter: 'Tous les sites opérationnels',
                                categoryFilter: rep.title,
                                statusFilter: 'Audit Complet & Relevés Kilométriques',
                                periodLabel: rep.frequency,
                              });
                              showToast(`Rapport officiel PDF « ${rep.title} » téléchargé !`);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          title="Télécharger version PDF"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-600" />
                          <span>PDF</span>
                        </button>
                        <button
                          onClick={() => {
                            if (rep.id === 'rep_tco_analysis') {
                              generateTcoExcelReport(DEFAULT_TCO_DATASET, {
                                companyName: company?.name || 'JMF Mobility Services Client',
                                generatedBy: `${user?.first_name || 'Direction'} ${user?.last_name || 'Financière'}`,
                              });
                              showToast(`Classeur Excel d'audit TCO exporté !`);
                            } else {
                              generateFleetExcelReport(filteredVehicles, {
                                companyName: company?.name || 'JMF Mobility Services Client',
                                generatedBy: `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'}`,
                                siteFilter: 'Tous les sites',
                                categoryFilter: rep.category,
                                statusFilter: 'Tous statuts',
                              });
                              showToast(`Classeur Excel « ${rep.title} » téléchargé !`);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg transition-colors cursor-pointer text-xs"
                          title="Télécharger version Excel"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Excel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Insights Sidebar */}
            <div className="space-y-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-sky-600" />
                  <span>Répartition de l’Activité par Catégorie</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Pick-up 4x4 (Missions & Chantiers)</span>
                      <span className="text-slate-900 font-bold">42% (52 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-sky-600 h-full rounded-full w-[42%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Fourgonnettes & Utilitaires Logistique</span>
                      <span className="text-slate-900 font-bold">28% (35 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-[28%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Berlines & SUV Direction VIP</span>
                      <span className="text-slate-900 font-bold">18% (23 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full w-[18%]"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span className="text-slate-700">Poids Lourds & Frigorifiques Port</span>
                      <span className="text-slate-900 font-bold">12% (15 véh.)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full w-[12%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Global Pack Export */}
              <div className="p-5 bg-gradient-to-br from-sky-900 to-indigo-950 text-white rounded-2xl shadow-md space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-300" />
                  <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">Pack Direction</span>
                </div>
                <h4 className="text-base font-bold">Rapport Annuel Consolidé Flotte 2026</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Générez en un seul document l’intégralité des indicateurs : TCO, consommation de carburant, registre CNSR et interventions de maintenance.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() =>
                      handleDownloadReport({
                        id: 'rep_pack_direction',
                        title: 'Pack Direction - Synthèse Globale Flotte',
                        category: 'EXPLOITATION',
                        frequency: 'Annuelle 2026',
                        lastGenerated: '21/09/2026',
                        fileFormat: 'PDF',
                        description: 'Compilation complète du TCO, des coûts kilométriques et des audits réglementaires.',
                        keyMetric: '100% Conforme',
                        keyMetricLabel: 'Audit validé',
                      })
                    }
                    className="flex-1 py-2.5 bg-sky-500 hover:bg-sky-400 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Rapport PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      generateFleetExcelReport(filteredVehicles, {
                        companyName: company?.name || 'JMF Mobility Services Client',
                        generatedBy: `${user?.first_name || 'Admin'} ${user?.last_name || 'JMF'}`,
                        siteFilter: 'Tous les sites',
                        categoryFilter: 'Pack Direction',
                        statusFilter: 'Tous statuts',
                      });
                      showToast('Classeur Excel Pack Direction exporté !');
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Classeur Excel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VUE 2 : CENTRE D'EXPORTS MULTI-FORMATS */}
      {/* ========================================================================= */}
      {activeTab === 'exports' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Main Export Configuration Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowDownToLine className="w-5 h-5 text-sky-600" />
                  <span>Paramétrage de l’Extraction & Filtres Avancés</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Exportez les données de flotte filtrées vers des formats professionnels <strong>PDF</strong> haute définition et <strong>Excel</strong> (.xls/.csv).
                </p>
              </div>

              {/* Status counter badge */}
              <div className="flex items-center gap-2 text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700">
                <Truck className="w-4 h-4 text-sky-600" />
                <span><strong>{filteredVehicles.length}</strong> véhicule{filteredVehicles.length > 1 ? 's' : ''} filtré{filteredVehicles.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            {/* Step 1: Select Dataset */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Choisissez le Jeu de Données à Exporter
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDataset('fleet')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'fleet'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Truck className="w-5 h-5 text-sky-600" />
                    {selectedDataset === 'fleet' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Parc & Fiches Véhicules</div>
                  <p className="text-[11px] text-slate-500">Immatriculations, modèles, statuts, affectations, km</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('tco')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'tco'
                      ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <DollarSign className="w-5 h-5 text-rose-600" />
                    {selectedDataset === 'tco' && <Check className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Audit Financier & TCO</div>
                  <p className="text-[11px] text-slate-500">Postes carburant, atelier, assurances, pneus & FCFA/km</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('fuel')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'fuel'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Fuel className="w-5 h-5 text-amber-600" />
                    {selectedDataset === 'fuel' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Journal des Pleins Carburant</div>
                  <p className="text-[11px] text-slate-500">Dates, litrages, montants FCFA, stations Total/Oryx</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('maintenance')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'maintenance'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Wrench className="w-5 h-5 text-emerald-600" />
                    {selectedDataset === 'maintenance' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Ordres de Travaux Atelier</div>
                  <p className="text-[11px] text-slate-500">Révisions, pièces d’usure, factures prestataires</p>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDataset('docs')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    selectedDataset === 'docs'
                      ? 'border-sky-500 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    {selectedDataset === 'docs' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900">Conformité Légale & Assurances</div>
                  <p className="text-[11px] text-slate-500">Dates de validité CNSR, NSIA, TVM, extincteurs</p>
                </button>
              </div>
            </div>

            {/* Step 2: Granular Filters (Site, Status, Category, Search) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Filtres Opérationnels de la Flotte
                </label>
                {(selectedSite !== 'ALL' || selectedStatus !== 'ALL' || selectedCategory !== 'ALL' || searchFilter) && (
                  <button
                    onClick={() => {
                      setSelectedSite('ALL');
                      setSelectedStatus('ALL');
                      setSelectedCategory('ALL');
                      setSearchFilter('');
                    }}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Site selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Site Opérationnel
                  </label>
                  <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="ALL">Tous les sites ({rawVehicles.length} véh.)</option>
                    <option value="marina">Siège Administratif (Cotonou / Marina)</option>
                    <option value="hub_logistique">Hub Logistique Central</option>
                    <option value="port">Base Opérationnelle Portuaire</option>
                    <option value="calavi">Agence Abomey-Calavi</option>
                  </select>
                </div>

                {/* Status selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Statut du Véhicule
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="ALL">Tous les statuts</option>
                    <option value="active">En service / Actif</option>
                    <option value="maintenance">En maintenance / Atelier</option>
                    <option value="available">Pool Libre / Disponible</option>
                  </select>
                </div>

                {/* Category selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Catégorie de Véhicule
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option value="ALL">Toutes les catégories</option>
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Search bar */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Recherche Rapide
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Immat, modèle, chauffeur..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 font-medium focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Format Selection */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Choisissez le Format d'Exportation
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* PDF */}
                <button
                  type="button"
                  onClick={() => setExportFormat('pdf')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    exportFormat === 'pdf'
                      ? 'border-rose-500 bg-rose-50/50 ring-2 ring-rose-200 text-rose-900 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      PDF
                    </div>
                    {exportFormat === 'pdf' && <Check className="w-4 h-4 text-rose-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Rapport PDF Officiel</div>
                    <div className="text-[10px] text-slate-500">Mise en page A4 paysage certifiée JMF</div>
                  </div>
                </button>

                {/* Excel */}
                <button
                  type="button"
                  onClick={() => setExportFormat('excel')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    exportFormat === 'excel'
                      ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-200 text-emerald-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    {exportFormat === 'excel' && <Check className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Classeur Excel (.xls)</div>
                    <div className="text-[10px] text-slate-500">Styles natifs, totaux et colonnes dimensionnées</div>
                  </div>
                </button>

                {/* CSV */}
                <button
                  type="button"
                  onClick={() => setExportFormat('csv')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    exportFormat === 'csv'
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-200 text-sky-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                      CSV
                    </div>
                    {exportFormat === 'csv' && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Format CSV Standard</div>
                    <div className="text-[10px] text-slate-500">Séparateur virgule UTF-8 pour ERP</div>
                  </div>
                </button>

                {/* JSON */}
                <button
                  type="button"
                  onClick={() => setExportFormat('json')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    exportFormat === 'json'
                      ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200 text-indigo-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      JSON
                    </div>
                    {exportFormat === 'json' && <Check className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">JSON Brut API</div>
                    <div className="text-[10px] text-slate-500">Structure objet brute pour développeurs</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                L’exportation contient <strong>{filteredVehicles.length}</strong> ligne(s) correspondant à vos critères actuels.
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Quick PDF Export
                    setExportFormat('pdf');
                    setTimeout(() => handleExecuteExport(), 50);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Export PDF Rapide</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    // Quick Excel Export
                    setExportFormat('excel');
                    setTimeout(() => handleExecuteExport(), 50);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export Excel Rapide</span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleExecuteExport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Génération en cours...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Télécharger ({exportFormat.toUpperCase()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Live Data Preview Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-sky-600" />
                  <span>
                    {selectedDataset === 'tco'
                      ? `Aperçu du Rapport d'Audit Financier TCO (${DEFAULT_TCO_DATASET.length} véhicules)`
                      : `Aperçu des Données Filtrées Prêtes pour l'Export (${filteredVehicles.length})`}
                  </span>
                </h4>
                <p className="text-xs text-slate-500">
                  {selectedDataset === 'tco'
                    ? 'Consolidation financière avec ventilation par poste analytique prête pour génération PDF/Excel.'
                    : 'Vérifiez le contenu exact qui sera généré dans votre document PDF ou Excel.'}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                {selectedDataset === 'tco' ? (
                  <span>
                    Dépenses Totales: <strong>{DEFAULT_TCO_DATASET.reduce((s, v) => s + v.total_cost, 0).toLocaleString('fr-FR')}</strong> FCFA
                  </span>
                ) : (
                  <span>
                    Total km: <strong>{filteredVehicles.reduce((s, v) => s + (v.current_mileage || 0), 0).toLocaleString('fr-FR')}</strong> km
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              {selectedDataset === 'tco' ? (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">N°</th>
                      <th className="py-3 px-3">Immatriculation</th>
                      <th className="py-3 px-3">Modèle</th>
                      <th className="py-3 px-3">Conducteur</th>
                      <th className="py-3 px-3 text-right">Km Cumulés</th>
                      <th className="py-3 px-3 text-right">Carburant</th>
                      <th className="py-3 px-3 text-right">Entretien</th>
                      <th className="py-3 px-3 text-right">Assurances</th>
                      <th className="py-3 px-3 text-right">Total TCO</th>
                      <th className="py-3 px-3 text-right">FCFA/km</th>
                      <th className="py-3 px-3 text-center">Efficience</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {DEFAULT_TCO_DATASET.map((v, i) => (
                      <tr key={v.reg} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">{i + 1}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{v.reg}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{v.model}</td>
                        <td className="py-2.5 px-3 text-slate-600">{v.driver}</td>
                        <td className="py-2.5 px-3 text-right font-mono">{v.total_km.toLocaleString('fr-FR')} km</td>
                        <td className="py-2.5 px-3 text-right font-mono">{v.fuel_cost.toLocaleString('fr-FR')} F</td>
                        <td className="py-2.5 px-3 text-right font-mono">{v.maintenance_cost.toLocaleString('fr-FR')} F</td>
                        <td className="py-2.5 px-3 text-right font-mono">{v.insurance_taxes_cost.toLocaleString('fr-FR')} F</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">{v.total_cost.toLocaleString('fr-FR')} F</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{v.cost_per_km}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                              v.efficiency_rating === 'EXCELLENT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : v.efficiency_rating === 'NORMAL'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {v.efficiency_rating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">N°</th>
                      <th className="py-3 px-3">Immatriculation</th>
                      <th className="py-3 px-3">Marque & Modèle</th>
                      <th className="py-3 px-3">Catégorie</th>
                      <th className="py-3 px-3">Statut</th>
                      <th className="py-3 px-3">Conducteur</th>
                      <th className="py-3 px-3">Site</th>
                      <th className="py-3 px-3 text-right">Kilométrage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          Aucun véhicule ne correspond à vos filtres actuels.
                        </td>
                      </tr>
                    ) : (
                      filteredVehicles.slice(0, 15).map((v, i) => (
                        <tr key={v.registration + i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">{i + 1}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-sky-700">{v.registration}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{v.brand} {v.model}</td>
                          <td className="py-2.5 px-3 text-slate-600">{v.category}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.status === 'active' || v.status === 'EN SERVICE'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : v.status === 'maintenance' || v.status === 'immobilized'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-sky-50 text-sky-700 border border-sky-200'
                              }`}
                            >
                              {v.status === 'active' || v.status === 'EN SERVICE' ? 'En service' : v.status === 'maintenance' ? 'Maintenance' : 'Pool Libre'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{v.driverName || <span className="text-slate-400 italic">Non affecté</span>}</td>
                          <td className="py-2.5 px-3 text-slate-600">{v.siteName || 'Siège Cotonou'}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                            {v.current_mileage.toLocaleString('fr-FR')} km
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {selectedDataset !== 'tco' && filteredVehicles.length > 15 && (
              <div className="text-center text-xs text-slate-500 py-1">
                + {filteredVehicles.length - 15} autres véhicules inclus dans l'export final.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
