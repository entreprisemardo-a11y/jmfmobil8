import React, { useState, useMemo } from 'react';
import {
  Bell,
  AlertTriangle,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  FileText,
  Activity,
  Gauge,
  Zap,
  Car,
  User,
  MapPin,
  Fuel,
  ChevronRight,
  ArrowRight,
  Search,
  Filter,
  Sparkles,
  Smartphone,
  MessageSquare,
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  Send,
  Calendar,
  Eye,
} from 'lucide-react';

export type AlertPillar = 'ALL' | 'MAINTENANCE' | 'DOCUMENTS' | 'TELEMATICS';
export type AlertSeverity = 'ALL' | 'CRITICAL' | 'WARNING' | 'PREVENTIVE';

export interface DashboardPreventiveAlert {
  id: string;
  pillar: 'MAINTENANCE' | 'DOCUMENTS' | 'TELEMATICS';
  title: string;
  severity: 'CRITICAL' | 'WARNING' | 'PREVENTIVE';
  vehicleId: string;
  vehicleReg: string;
  vehicleModel: string;
  driverName: string;
  driverPhone: string;
  driverEmail: string;
  dueDateOrTime: string;
  metricLabel: string;
  metricValue: string;
  impactRisk: string;
  locationOrWorkshop?: string;
  status: 'PENDING' | 'RELANCE_SENT' | 'SCHEDULED' | 'RESOLVED';
  telemetryType?: 'SPEED' | 'HARSH_BRAKING' | 'EXCESS_IDLE' | 'GEOFENCE';
  documentType?: 'CNSR' | 'INSURANCE' | 'TVM' | 'MEDICAL';
  maintenanceType?: 'OIL_CHANGE' | 'BRAKES' | 'COOLING' | 'REVISION';
}

const INITIAL_DASHBOARD_ALERTS: DashboardPreventiveAlert[] = [
  // --- PILIER 1 : ENTRETIENS À VENIR ---
  {
    id: 'alt_m_1',
    pillar: 'MAINTENANCE',
    title: 'Dépassement kilométrique vidange moteur Total Quartz',
    severity: 'CRITICAL',
    vehicleId: 'veh_hyundai_santa_fe',
    vehicleReg: 'BJ-7890-KL',
    vehicleModel: 'Hyundai Santa Fe Premium',
    driverName: 'Jean KOUASSI',
    driverPhone: '+229 97 00 11 22',
    driverEmail: 'jean.kouassi@societe-cliente.com',
    dueDateOrTime: 'Dépassé de 3 jours',
    metricLabel: 'Kilométrage',
    metricValue: '42 100 km / 40 000 km (+2 100 km)',
    impactRisk: 'Risque d’encrassement turbo & perte de garantie constructeur CFAO',
    locationOrWorkshop: 'Atelier CFAO Motors Cotonou',
    status: 'PENDING',
    maintenanceType: 'OIL_CHANGE',
  },
  {
    id: 'alt_m_2',
    pillar: 'MAINTENANCE',
    title: 'Remplacement d’urgence plaquettes de frein avant & disques',
    severity: 'WARNING',
    vehicleId: 'veh_renault_master',
    vehicleReg: 'BJ-5678-EF',
    vehicleModel: 'Renault Master Fourgon 12m³',
    driverName: 'Saliou BIO',
    driverPhone: '+229 94 45 67 89',
    driverEmail: 'saliou.bio@societe-cliente.com',
    dueDateOrTime: 'Sous 4 jours (< 650 km)',
    metricLabel: 'Usure plaquettes',
    metricValue: 'Garniture à 88% d’usure',
    impactRisk: 'Allongement critique des distances de freinage en charge sur RNIE',
    locationOrWorkshop: 'Atelier Central JMF',
    status: 'SCHEDULED',
    maintenanceType: 'BRAKES',
  },
  {
    id: 'alt_m_3',
    pillar: 'MAINTENANCE',
    title: 'Révision semestrielle groupe froid & condenseur',
    severity: 'PREVENTIVE',
    vehicleId: 'veh_iveco_daily',
    vehicleReg: 'BJ-3456-IJ',
    vehicleModel: 'Iveco Daily Frigo 3.5T',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverEmail: 'koffi.aman@societe-cliente.com',
    dueDateOrTime: 'Dans 8 jours',
    metricLabel: 'Compteur froid',
    metricValue: '350h moteur groupe atteintes',
    impactRisk: 'Risque de rupture de la chaîne du froid sur livraison produits frais',
    locationOrWorkshop: 'Garage Agréé Frigo Spécialisé',
    status: 'PENDING',
    maintenanceType: 'COOLING',
  },

  // --- PILIER 2 : EXPIRATIONS DE DOCUMENTS ---
  {
    id: 'alt_d_1',
    pillar: 'DOCUMENTS',
    title: 'Visite Technique CNSR expirée (Non conforme)',
    severity: 'CRITICAL',
    vehicleId: 'veh_iveco_daily',
    vehicleReg: 'BJ-3456-IJ',
    vehicleModel: 'Iveco Daily Frigo 3.5T',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverEmail: 'koffi.aman@societe-cliente.com',
    dueDateOrTime: 'Expiré il y a 3 jours',
    metricLabel: 'Réf. Certificat',
    metricValue: 'CNSR-COT-2025-3891',
    impactRisk: 'Fourrière immédiate par la Police Républicaine + amende 50 000 Francs',
    locationOrWorkshop: 'Centre Technique Partenaire',
    status: 'PENDING',
    documentType: 'CNSR',
  },
  {
    id: 'alt_d_2',
    pillar: 'DOCUMENTS',
    title: 'Police d’Assurance Flotte Tous Risques NSIA à renouveler',
    severity: 'WARNING',
    vehicleId: 'veh_peugeot_3008',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    driverName: 'Marc AGBO',
    driverPhone: '+229 95 34 56 78',
    driverEmail: 'marc.agbo@societe-cliente.com',
    dueDateOrTime: 'Dans 7 jours (28/09/2026)',
    metricLabel: 'Police d’assurance',
    metricValue: 'POL-NSIA-2025-089',
    impactRisk: 'Cessation des garanties dommages et responsabilité civile en cas d’accident',
    locationOrWorkshop: 'NSIA Assurances Bénin',
    status: 'RELANCE_SENT',
    documentType: 'INSURANCE',
  },
  {
    id: 'alt_d_3',
    pillar: 'DOCUMENTS',
    title: 'Visite médicale chauffeur poids lourd ANaTT requise',
    severity: 'WARNING',
    vehicleId: 'veh_renault_master',
    vehicleReg: 'BJ-5678-EF',
    vehicleModel: 'Renault Master Fourgon 12m³',
    driverName: 'Saliou BIO',
    driverPhone: '+229 94 45 67 89',
    driverEmail: 'saliou.bio@societe-cliente.com',
    dueDateOrTime: 'Dans 14 jours (05/10/2026)',
    metricLabel: 'Aptitude ANaTT',
    metricValue: 'Permis Catégorie C (Poids Lourd)',
    impactRisk: 'Suspension de validité du permis professionnel lors des contrôles routiers',
    locationOrWorkshop: 'Centre Médical du Travail Cotonou',
    status: 'PENDING',
    documentType: 'MEDICAL',
  },
  {
    id: 'alt_d_4',
    pillar: 'DOCUMENTS',
    title: 'Taxe Unique sur les Véhicules à Moteur (TVM) à acquitter',
    severity: 'PREVENTIVE',
    vehicleId: 'veh_toyota_hilux',
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    driverName: 'Pierre DOSSOU',
    driverPhone: '+229 97 12 34 56',
    driverEmail: 'pierre.dossou@societe-cliente.com',
    dueDateOrTime: 'Dans 18 jours (10/10/2026)',
    metricLabel: 'Vignette fiscale',
    metricValue: 'TVM ANaTT Exercice 2026',
    impactRisk: 'Pénalité fiscale automatique de 20% au-delà de l’échéance légale',
    locationOrWorkshop: 'Télépaiement Portefeuille DGI',
    status: 'PENDING',
    documentType: 'TVM',
  },

  // --- PILIER 3 : ANOMALIES DE CONDUITE TÉLÉMATIQUE ---
  {
    id: 'alt_t_1',
    pillar: 'TELEMATICS',
    title: 'Grand excès de vitesse récurrent (> 125 km/h)',
    severity: 'CRITICAL',
    vehicleId: 'veh_toyota_hilux',
    vehicleReg: 'BJ-9012-GH',
    vehicleModel: 'Toyota Hilux 4x4 Double Cabine',
    driverName: 'Pierre DOSSOU',
    driverPhone: '+229 97 12 34 56',
    driverEmail: 'pierre.dossou@societe-cliente.com',
    dueDateOrTime: 'Aujourd’hui à 11h24',
    metricLabel: 'Vitesse relevée',
    metricValue: '128 km/h (Limite autorisée : 90 km/h)',
    impactRisk: 'Risque élevé d’accident mortel • Surconsommation estimée +34% de gazole',
    locationOrWorkshop: 'RNIE 2 • Axe Allada ➔ Bohicon',
    status: 'PENDING',
    telemetryType: 'SPEED',
  },
  {
    id: 'alt_t_2',
    pillar: 'TELEMATICS',
    title: 'Freinages d’urgence violents consécutifs (-1.45G)',
    severity: 'WARNING',
    vehicleId: 'veh_renault_master',
    vehicleReg: 'BJ-5678-EF',
    vehicleModel: 'Renault Master Fourgon 12m³',
    driverName: 'Saliou BIO',
    driverPhone: '+229 94 45 67 89',
    driverEmail: 'saliou.bio@societe-cliente.com',
    dueDateOrTime: 'Aujourd’hui à 10h05',
    metricLabel: 'Décélération max',
    metricValue: '-1.45G (Seuil alerte : -0.6G • 4 chocs)',
    impactRisk: 'Dégradation du fret en soute, surchauffe disques et risque de collision arrière',
    locationOrWorkshop: 'Carrefour Vèdoko • Cotonou',
    status: 'PENDING',
    telemetryType: 'HARSH_BRAKING',
  },
  {
    id: 'alt_t_3',
    pillar: 'TELEMATICS',
    title: 'Ralenti prolongé moteur allumé à l’arrêt (54 minutes)',
    severity: 'WARNING',
    vehicleId: 'veh_peugeot_3008',
    vehicleReg: 'BJ-1234-CD',
    vehicleModel: 'Peugeot 3008 Allure',
    driverName: 'Marc AGBO',
    driverPhone: '+229 95 34 56 78',
    driverEmail: 'marc.agbo@societe-cliente.com',
    dueDateOrTime: 'Aujourd’hui à 09h40',
    metricLabel: 'Durée ralenti',
    metricValue: '54 min consécutives • Climatisation max',
    impactRisk: 'Gaspillage inutile de 2,3 L de carburant (~1 650 FCFA) & encrassement FAP',
    locationOrWorkshop: 'Parking Haie Vive • Cotonou',
    status: 'RELANCE_SENT',
    telemetryType: 'EXCESS_IDLE',
  },
  {
    id: 'alt_t_4',
    pillar: 'TELEMATICS',
    title: 'Sortie de zone géofencing autorisée en nocturne (23h45)',
    severity: 'CRITICAL',
    vehicleId: 'veh_toyota_hiace',
    vehicleReg: 'BJ-2345-AB',
    vehicleModel: 'Toyota HiAce Minibus 15 places',
    driverName: 'Koffi AMAN',
    driverPhone: '+229 96 23 45 67',
    driverEmail: 'koffi.aman@societe-cliente.com',
    dueDateOrTime: 'Hier soir à 23h45',
    metricLabel: 'Zone franchie',
    metricValue: 'Sèmè-Kpodji (Périmètre autorisé : Cotonou Agglo 06h-21h)',
    impactRisk: 'Utilisation illégitime du véhicule d’entreprise hors des heures de service',
    locationOrWorkshop: 'Axe Cotonou ➔ Porto-Novo',
    status: 'PENDING',
    telemetryType: 'GEOFENCE',
  },
];

interface PreventiveAlertsDashboardModuleProps {
  onSelectVehicle?: (vehicleId: string) => void;
  onNavigateView?: (view: string) => void;
}

export const PreventiveAlertsDashboardModule: React.FC<PreventiveAlertsDashboardModuleProps> = ({
  onSelectVehicle,
  onNavigateView,
}) => {
  const [alerts, setAlerts] = useState<DashboardPreventiveAlert[]>(INITIAL_DASHBOARD_ALERTS);
  const [activePillar, setActivePillar] = useState<AlertPillar>('ALL');
  const [activeSeverity, setActiveSeverity] = useState<AlertSeverity>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal notification / relance
  const [selectedAlertForRelance, setSelectedAlertForRelance] = useState<DashboardPreventiveAlert | null>(null);
  const [relanceChannel, setRelanceChannel] = useState<'WHATSAPP' | 'SMS' | 'EMAIL'>('WHATSAPP');
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  // Modal planifier / traiter
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<DashboardPreventiveAlert | null>(null);
  const [actionScheduleDate, setActionScheduleDate] = useState<string>('2026-09-25');
  const [actionWorkshopNote, setActionWorkshopNote] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Counts by pillar
  const counts = useMemo(() => {
    const total = alerts.length;
    const maintenance = alerts.filter((a) => a.pillar === 'MAINTENANCE').length;
    const documents = alerts.filter((a) => a.pillar === 'DOCUMENTS').length;
    const telematics = alerts.filter((a) => a.pillar === 'TELEMATICS').length;
    const critical = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
    const warning = alerts.filter((a) => a.severity === 'WARNING' && a.status !== 'RESOLVED').length;
    const resolved = alerts.filter((a) => a.status === 'RESOLVED').length;
    return { total, maintenance, documents, telematics, critical, warning, resolved };
  }, [alerts]);

  // Filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter((alt) => {
      // Pillar filter
      if (activePillar !== 'ALL' && alt.pillar !== activePillar) return false;

      // Severity filter
      if (activeSeverity !== 'ALL' && alt.severity !== activeSeverity) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          alt.title.toLowerCase().includes(q) ||
          alt.vehicleReg.toLowerCase().includes(q) ||
          alt.vehicleModel.toLowerCase().includes(q) ||
          alt.driverName.toLowerCase().includes(q) ||
          alt.impactRisk.toLowerCase().includes(q) ||
          (alt.locationOrWorkshop && alt.locationOrWorkshop.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [alerts, activePillar, activeSeverity, searchQuery]);

  // Simulate a live telematics alert incoming in real time
  const handleSimulateLiveAlert = () => {
    const newAlert: DashboardPreventiveAlert = {
      id: `alt_live_${Date.now()}`,
      pillar: 'TELEMATICS',
      title: 'Alerte Télématique en direct : Accélération brutale (+0.72G)',
      severity: 'WARNING',
      vehicleId: 'veh_peugeot_3008',
      vehicleReg: 'BJ-1234-CD',
      vehicleModel: 'Peugeot 3008 Allure',
      driverName: 'Marc AGBO',
      driverPhone: '+229 95 34 56 78',
      driverEmail: 'marc.agbo@societe-cliente.com',
      dueDateOrTime: 'À l’instant (Temps réel)',
      metricLabel: 'G-Force',
      metricValue: '+0.72G à 68 km/h en virage',
      impactRisk: 'Comportement agressif susceptible d’endommager les pneumatiques Michelin',
      locationOrWorkshop: 'Hub Opérationnel JMF Mobility',
      status: 'PENDING',
      telemetryType: 'HARSH_BRAKING',
    };

    setAlerts((prev) => [newAlert, ...prev]);
    showToast('🚨 Nouvelle alerte télématique en direct reçue via boîtier GPS !');
  };

  // Mark alert as resolved
  const handleResolveAlert = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'RESOLVED' } : a))
    );
    showToast('Alerte marquée comme résolue / régularisée.');
  };

  // Build professional relance message
  const getRelanceMessage = (alt: DashboardPreventiveAlert, channel: 'WHATSAPP' | 'SMS' | 'EMAIL') => {
    const isTelem = alt.pillar === 'TELEMATICS';
    const isMaint = alt.pillar === 'MAINTENANCE';

    if (channel === 'WHATSAPP') {
      return (
        `*NOTIFICATION FLOTTE & PRÉVENTION - JMF MOBILITY SERVICES*\n\n` +
        `Bonjour *${alt.driverName}*,\n\n` +
        `Une notification de sécurité préventive concerne votre véhicule de service (*${alt.vehicleReg}* - ${alt.vehicleModel}) :\n\n` +
        `📌 *Objet :* ${alt.title}\n` +
        `📊 *Donnée constatée :* ${alt.metricValue}\n` +
        `⏳ *Échéance / Moment :* ${alt.dueDateOrTime}\n` +
        `📍 *Lieu / Référent :* ${alt.locationOrWorkshop || 'Base Cotonou'}\n\n` +
        `⚠️ *Consigne obligatoire :* ${
          isTelem
            ? 'Merci d’adopter une conduite souple et conforme aux limitations du Code de la Route béninois pour préserver la sécurité de tous.'
            : isMaint
            ? 'Présentation impérative du véhicule à l’atelier pour l’intervention mécanique planifiée.'
            : 'Rapprochement immédiat avec la cellule conformité pour éviter toute sanction ou fourrière routière.'
        }\n\n` +
        `_Coordination Logistique Flotte • JMF Mobility Services, Cotonou_`
      );
    } else if (channel === 'SMS') {
      return `JMF FLOTTE: Bonjour ${alt.driverName}. Alerte préventive sur ${alt.vehicleReg} (${alt.title} - ${alt.metricValue}). Contactez la logistique au +229 97000000.`;
    } else {
      return (
        `Bonjour ${alt.driverName},\n\n` +
        `Dans le cadre du suivi préventif et de la sécurité de la flotte d’entreprise, nous vous signalons le point suivant concernant votre véhicule ${alt.vehicleReg} (${alt.vehicleModel}) :\n\n` +
        `- Objet de l’alerte : ${alt.title}\n` +
        `- Constat : ${alt.metricValue}\n` +
        `- Échéance / Détection : ${alt.dueDateOrTime}\n` +
        `- Impact / Risque : ${alt.impactRisk}\n\n` +
        `Merci de prendre les dispositions nécessaires ou de confirmer votre passage à la coordination logistique.\n\n` +
        `Bien cordialement,\n` +
        `Direction Flotte & Télématique • JMF Mobility Services`
      );
    }
  };

  const handleCopyRelance = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleSendRelance = (altId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === altId ? { ...a, status: 'RELANCE_SENT' } : a))
    );
    setSelectedAlertForRelance(null);
    showToast('Relance préventive transmise avec succès au chauffeur.');
  };

  const handleConfirmActionPlan = (altId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === altId ? { ...a, status: 'SCHEDULED' } : a))
    );
    setSelectedAlertForAction(null);
    showToast('Plan d’action enregistré : rendez-vous et ordre de travaux confirmés.');
  };

  return (
    <section
      id="dashboard-preventive-alerts-module"
      aria-label="Module d'alertes préventives"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
    >
      {/* Toast floating feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header du Module avec Statuts & Contrôles */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/50">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Surveillance Active 24/7
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                Télématique • Maintenance • Conformité
              </span>
              {counts.critical > 0 && (
                <span className="text-[11px] font-bold text-white bg-rose-600 px-2 py-0.5 rounded-full shadow-2xs">
                  {counts.critical} {counts.critical > 1 ? 'urgences critiques' : 'urgence critique'}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Module d’Alertes Préventives & Télématique</span>
            </h2>

            <p className="text-xs text-slate-500 font-medium max-w-3xl">
              Anticipation automatique des révisions atelier, alertes sur expirations documentaires (CNSR, Assurances, TVM) et détection en direct des anomalies de comportement conducteur.
            </p>
          </div>

          {/* Quick Module Actions */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0 flex-wrap">
            <button
              onClick={handleSimulateLiveAlert}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Injecter une télémétrie en temps réel pour tester le flux"
            >
              <Zap className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
              <span>Simuler alerte GPS</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={soundEnabled ? 'Alertes sonores activées' : 'Alertes sonores coupées'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onNavigateView && onNavigateView('proactive_alerts')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <span>Centre d’Alertes complet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Three Pillar Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
          {/* Card 1: Entretiens Mécaniques */}
          <div
            onClick={() => setActivePillar('MAINTENANCE')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activePillar === 'MAINTENANCE'
                ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-2 ring-amber-400/20'
                : 'bg-white border-slate-200/90 hover:border-amber-200 hover:bg-amber-50/20'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Entretiens Mécaniques
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium">Atelier & Pièces</div>
                </div>
              </div>
              <span className="text-lg font-black text-amber-700">{counts.maintenance}</span>
            </div>

            <div className="pt-2.5 space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Vidange dépassée :</span>
                <span className="font-mono text-[11px] font-bold text-rose-600">BJ-7890-KL (+2 100km)</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Plaquettes frein :</span>
                <span className="text-[11px] font-bold text-amber-700">Sous 4j (Renault Master)</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700">
              <span>Filtrer les entretiens</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Documents & Conformité */}
          <div
            onClick={() => setActivePillar('DOCUMENTS')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activePillar === 'DOCUMENTS'
                ? 'bg-purple-50/70 border-purple-300 shadow-xs ring-2 ring-purple-400/20'
                : 'bg-white border-slate-200/90 hover:border-purple-200 hover:bg-purple-50/20'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Conformité Documentaire
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium">CNSR, Assurances, TVM</div>
                </div>
              </div>
              <span className="text-lg font-black text-purple-700">{counts.documents}</span>
            </div>

            <div className="pt-2.5 space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Visite CNSR expirée :</span>
                <span className="font-mono text-[11px] font-bold text-rose-600">BJ-3456-IJ (-3j)</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Police NSIA échoit :</span>
                <span className="text-[11px] font-bold text-purple-700">Dans 7 jours (Peugeot 3008)</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-purple-700">
              <span>Filtrer les documents</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Éco-Conduite & Télématique GPS */}
          <div
            onClick={() => setActivePillar('TELEMATICS')}
            className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
              activePillar === 'TELEMATICS'
                ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-2 ring-rose-400/20'
                : 'bg-white border-slate-200/90 hover:border-rose-200 hover:bg-rose-50/20'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    Anomalies Télématiques
                  </h3>
                  <div className="text-[11px] text-slate-500 font-medium">Vitesse, Freinages, Ralenti</div>
                </div>
              </div>
              <span className="text-lg font-black text-rose-700">{counts.telematics}</span>
            </div>

            <div className="pt-2.5 space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Excès de vitesse :</span>
                <span className="font-mono text-[11px] font-bold text-rose-600">128 km/h sur RNIE 2</span>
              </div>
              <div className="flex justify-between items-center text-slate-700">
                <span className="text-[11px] font-medium text-slate-500">Sortie nocturne géofence :</span>
                <span className="text-[11px] font-bold text-rose-700">Sèmè-Kpodji (23h45)</span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-700">
              <span>Filtrer les anomalies</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filtres & Barre de recherche */}
      <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-200/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Pillar Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActivePillar('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activePillar === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Toutes les alertes ({counts.total})
          </button>

          <button
            onClick={() => setActivePillar('MAINTENANCE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'MAINTENANCE'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-amber-700 border border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Entretiens ({counts.maintenance})</span>
          </button>

          <button
            onClick={() => setActivePillar('DOCUMENTS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'DOCUMENTS'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-purple-700 border border-slate-200 hover:bg-purple-50/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Documents ({counts.documents})</span>
          </button>

          <button
            onClick={() => setActivePillar('TELEMATICS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activePillar === 'TELEMATICS'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:text-rose-700 border border-slate-200 hover:bg-rose-50/50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Télématique ({counts.telematics})</span>
          </button>
        </div>

        {/* Severity Filter & Search Bar */}
        <div className="flex items-center gap-2.5">
          {/* Severity selector */}
          <div className="relative shrink-0">
            <select
              value={activeSeverity}
              onChange={(e) => setActiveSeverity(e.target.value as AlertSeverity)}
              className="pl-3 pr-8 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
            >
              <option value="ALL">Tous les niveaux</option>
              <option value="CRITICAL">🔴 Critique uniquement</option>
              <option value="WARNING">🟠 Attention / Modéré</option>
              <option value="PREVENTIVE">🔵 Préventif / Info</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 md:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Immat, conducteur, atelier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Liste des Alertes Préventives */}
      <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">Aucune alerte correspondant à vos critères</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Toutes les échéances d’entretiens, visites techniques et données télématiques sont actuellement conformes ou traitées.
            </p>
            <button
              onClick={() => {
                setActivePillar('ALL');
                setActiveSeverity('ALL');
                setSearchQuery('');
              }}
              className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 border border-sky-200 cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          filteredAlerts.map((alt) => {
            const isResolved = alt.status === 'RESOLVED';
            const isCritical = alt.severity === 'CRITICAL';
            const isWarning = alt.severity === 'WARNING';

            return (
              <div
                key={alt.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isResolved
                    ? 'bg-slate-50/50 opacity-60'
                    : isCritical
                    ? 'hover:bg-rose-50/30'
                    : isWarning
                    ? 'hover:bg-amber-50/30'
                    : 'hover:bg-slate-50'
                }`}
              >
                {/* Left side: Icon, Badges, Title, Driver, Risk Description */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {/* Category icon */}
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                      isCritical
                        ? 'bg-rose-100 text-rose-600'
                        : isWarning
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-sky-100 text-sky-700'
                    }`}
                  >
                    {alt.pillar === 'MAINTENANCE' && <Wrench className="w-5 h-5" />}
                    {alt.pillar === 'DOCUMENTS' && <FileText className="w-5 h-5" />}
                    {alt.pillar === 'TELEMATICS' && <Activity className="w-5 h-5" />}
                  </div>

                  {/* Alert Details */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    {/* Top pill badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Severity badge */}
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          isCritical
                            ? 'bg-rose-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-white'
                            : 'bg-sky-600 text-white'
                        }`}
                      >
                        {alt.severity === 'CRITICAL' ? 'Critique' : alt.severity === 'WARNING' ? 'Attention' : 'Préventif'}
                      </span>

                      {/* Pillar badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {alt.pillar === 'MAINTENANCE'
                          ? 'Entretien Atelier'
                          : alt.pillar === 'DOCUMENTS'
                          ? 'Conformité Papier'
                          : 'Télématique GPS'}
                      </span>

                      {/* Status badge */}
                      {alt.status === 'RELANCE_SENT' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Relance chauffeur transmise</span>
                        </span>
                      )}
                      {alt.status === 'SCHEDULED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>RDV / Ordre planifié</span>
                        </span>
                      )}
                      {alt.status === 'RESOLVED' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          Régularisé / Clôturé
                        </span>
                      )}

                      {/* Time / Due label */}
                      <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{alt.dueDateOrTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <span>{alt.title}</span>
                    </h3>

                    {/* Impact / Risk explanation */}
                    <p className="text-xs text-slate-600 flex items-baseline gap-1.5">
                      <span className="font-bold text-slate-800">Impact :</span>
                      <span>{alt.impactRisk}</span>
                    </p>

                    {/* Metadata chips (Vehicle, Driver, Metric, Location) */}
                    <div className="flex items-center gap-2.5 flex-wrap pt-1 text-xs">
                      {/* Vehicle chip */}
                      <button
                        onClick={() => onSelectVehicle && onSelectVehicle(alt.vehicleId)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-sky-50 hover:text-sky-700 border border-slate-200 font-bold text-slate-800 transition-colors cursor-pointer"
                        title="Voir la fiche détaillée du véhicule"
                      >
                        <Car className="w-3 h-3 text-sky-600" />
                        <span className="font-mono">{alt.vehicleReg}</span>
                        <span className="font-normal text-slate-500">• {alt.vehicleModel}</span>
                      </button>

                      {/* Driver chip */}
                      <div className="inline-flex items-center gap-1 text-slate-600 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{alt.driverName}</span>
                        <span className="text-slate-400">({alt.driverPhone})</span>
                      </div>

                      {/* Metric chip */}
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 font-semibold">
                        <Gauge className="w-3 h-3 text-amber-600" />
                        <span>{alt.metricValue}</span>
                      </div>

                      {/* Location chip */}
                      {alt.locationOrWorkshop && (
                        <div className="inline-flex items-center gap-1 text-slate-500">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[200px]">{alt.locationOrWorkshop}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Interactive Actions */}
                <div className="flex items-center gap-2 self-start lg:self-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-end">
                  {/* Action 1: Relancer le chauffeur */}
                  <button
                    onClick={() => {
                      setSelectedAlertForRelance(alt);
                      setRelanceChannel('WHATSAPP');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Envoyer un avertissement ou une convocation au chauffeur"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Notifier chauffeur</span>
                  </button>

                  {/* Action 2: Planifier / Traiter */}
                  <button
                    onClick={() => {
                      setSelectedAlertForAction(alt);
                      setActionScheduleDate('2026-09-25');
                      setActionWorkshopNote('');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-all cursor-pointer shadow-2xs"
                    title="Planifier l’ordre de travail ou fixer le rendez-vous"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>Traiter / RDV</span>
                  </button>

                  {/* Action 3: Résoudre / Acquitter */}
                  <button
                    onClick={(e) => handleResolveAlert(alt.id, e)}
                    className="p-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-lg transition-all cursor-pointer"
                    title={isResolved ? 'Déjà clôturé' : 'Marquer comme régularisé'}
                  >
                    <Check className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. Footer info & navigation rapide */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Politique de relance proactive conforme aux normes de maintenance constructeur & ANaTT Bénin.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateView && onNavigateView('maintenance_schedule')}
            className="font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Calendrier atelier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => onNavigateView && onNavigateView('telematics_live')}
            className="font-bold text-sky-700 hover:text-sky-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Supervision GPS en direct</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="text-slate-300">•</span>
          <button
            onClick={() => onNavigateView && onNavigateView('maintenance_sms')}
            className="font-bold text-teal-700 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-600" />
            <span>Alertes SMS Particuliers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1 : NOTIFICATION & RELANCE DU CONDUCTEUR                 */}
      {/* ============================================================== */}
      {selectedAlertForRelance && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Transmission d’Alerte Chauffeur
                  </h3>
                  <p className="text-xs text-slate-500">
                    Véhicule {selectedAlertForRelance.vehicleReg} • {selectedAlertForRelance.driverName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlertForRelance(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Channel Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Canal de notification prioritaire :
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRelanceChannel('WHATSAPP')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      relanceChannel === 'WHATSAPP'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => setRelanceChannel('SMS')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      relanceChannel === 'SMS'
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>SMS Direct</span>
                  </button>

                  <button
                    onClick={() => setRelanceChannel('EMAIL')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      relanceChannel === 'EMAIL'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Pro</span>
                  </button>
                </div>
              </div>

              {/* Recipient Coordinates */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium">Destinataire : </span>
                  <span className="font-bold text-slate-900">{selectedAlertForRelance.driverName}</span>
                </div>
                <div className="font-mono text-emerald-700 font-bold">
                  {relanceChannel === 'EMAIL' ? selectedAlertForRelance.driverEmail : selectedAlertForRelance.driverPhone}
                </div>
              </div>

              {/* Pre-formatted message */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Aperçu du message officiel formaté :
                  </label>
                  <button
                    onClick={() =>
                      handleCopyRelance(getRelanceMessage(selectedAlertForRelance, relanceChannel))
                    }
                    className="flex items-center gap-1 text-[11px] font-bold text-sky-700 hover:text-sky-800 cursor-pointer"
                  >
                    {copiedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier le texte</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="w-full p-3.5 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto border border-slate-800">
                  {getRelanceMessage(selectedAlertForRelance, relanceChannel)}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedAlertForRelance(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSendRelance(selectedAlertForRelance.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirmer et Marquer comme notifié</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2 : TRAITEMENT & PLANIFICATION ATELIER / CONFORMITÉ      */}
      {/* ============================================================== */}
      {selectedAlertForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Planification & Ordre de Travail
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedAlertForAction.vehicleReg} • {selectedAlertForAction.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Date prévisionnelle d’intervention / régularisation :
                </label>
                <input
                  type="date"
                  value={actionScheduleDate}
                  onChange={(e) => setActionScheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Atelier / Centre prestataire désigné :
                </label>
                <select
                  defaultValue={selectedAlertForAction.locationOrWorkshop || 'Atelier CFAO Motors Cotonou'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Atelier CFAO Motors Cotonou">Atelier Agréé CFAO Motors Cotonou</option>
                  <option value="Atelier Central JMF">Atelier Central Flotte JMF</option>
                  <option value="Centre Technique Partenaire">Centre Technique et Visite Périodique</option>
                  <option value="NSIA Assurances Bénin">Agence NSIA Assurances Cotonou</option>
                  <option value="Garage Agréé Calavi">Garage Partenaire Abomey-Calavi</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Instructions techniques & consignes spécifiques :
                </label>
                <textarea
                  rows={3}
                  value={actionWorkshopNote}
                  onChange={(e) => setActionWorkshopNote(e.target.value)}
                  placeholder="Ex: Remplacement filtre à huile et cartouche gasoil, vérification parallélisme, immobilisation max 4h..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Validation du flux logistique</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  L’attribution de ce rendez-vous bloque automatiquement le créneau dans le planning atelier et met à jour le statut du véhicule dans le pool partagé.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => handleConfirmActionPlan(selectedAlertForAction.id)}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Valider l’ordre d’intervention</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
