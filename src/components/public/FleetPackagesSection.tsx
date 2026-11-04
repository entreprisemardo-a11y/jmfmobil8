import React, { useState, useMemo, useEffect } from 'react';
import {
  formatCurrencyAmount,
  getSelectedCurrencyCode,
} from '../../services/currencyService';
import {
  pricingService,
  DEFAULT_FLEET_PACKAGES,
} from '../../services/pricingService';
import { ProfessionalTariffGridSection } from './ProfessionalTariffGridSection';
import {
  Check,
  CheckCircle2,
  Sparkles,
  Car,
  Table as TableIcon,
  LayoutGrid,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
  FileText,
  X,
  Phone,
  Info,
  Sliders,
  Cpu,
  Radio,
  Video,
  Key,
  Users,
  Warehouse,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface FleetPackage {
  id: string;
  name: string;
  shortName: string;
  fleetSize: string;
  fleetRange: string;
  monthlyPrice: string;
  monthlyPriceNumeric: number;
  setupFee: string;
  setupFeeNumeric?: number;
  isPopular?: boolean;
  badge?: string;
  badgeColor?: string;
  accentColor: string;
  description: string;
  includedBase?: string;
  services: string[];
  note?: string;
}

export interface FleetOption {
  id: string;
  name: string;
  shortName: string;
  category: 'Télématique & IoT' | 'Sécurité & Contrôle' | 'Chauffeurs & RH' | 'Continuité & Logistique';
  monthlyRate: string;
  monthlyRatePerVehicleFcfa: number; // 0 if on quote or flat
  setupFee: string;
  badge?: string;
  badgeColor?: string;
  iconName: 'radio' | 'cpu' | 'video' | 'users' | 'key' | 'warehouse' | 'shield' | 'car';
  description: string;
  features: string[];
  isStandaloneEligible: boolean; // can be ordered without a pack
  highlight?: boolean;
}

export const FLEET_PACKAGES: FleetPackage[] = DEFAULT_FLEET_PACKAGES as any;

export const FLEET_OPTIONS: FleetOption[] = [
  {
    id: 'gps-4g',
    name: 'Balises GPS 4G & Télématique Temps Réel',
    shortName: 'Balises GPS 4G',
    category: 'Télématique & IoT',
    monthlyRate: '12 500 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 12500,
    setupFee: 'Inclus dès 5 véhicules',
    badge: 'Incontournable',
    badgeColor: 'bg-emerald-600 text-white',
    iconName: 'radio',
    description: 'Géolocalisation haute précision 24/7, historique des trajets, alertes excès de vitesse et sorties de zone.',
    features: [
      'Boîtier GPS 4G étanche & anti-brouillage',
      'Carte SIM data multi-opérateur (Roaming inclus)',
      'Plateforme web & application mobile en direct',
      'Rapports d’itinéraires & temps d’arrêt',
    ],
    isStandaloneEligible: true,
    highlight: true,
  },
  {
    id: 'coupure-moteur',
    name: 'Coupure Moteur à Distance & Anti-Démarrage',
    shortName: 'Coupure Moteur',
    category: 'Sécurité & Contrôle',
    monthlyRate: '3 500 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 3500,
    setupFee: '25 000 Francs / installation',
    badge: 'Antivol',
    badgeColor: 'bg-red-600 text-white',
    iconName: 'cpu',
    description: 'Immobilisation sécurisée du véhicule par commande mobile ou SMS en cas de vol, détournement ou hors horaire autorisé.',
    features: [
      'Relais sécurisé certifié constructeur',
      'Activation instantanée via application ou SMS',
      'Immobilisation progressive sans danger',
      'Déverrouillage crypté réservé au gestionnaire',
    ],
    isStandaloneEligible: true,
  },
  {
    id: 'sonde-carburant',
    name: 'Sonde Carburant Capacitive & Alerte Vol',
    shortName: 'Sonde Carburant',
    category: 'Sécurité & Contrôle',
    monthlyRate: '15 000 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 15000,
    setupFee: '40 000 Francs (pose & calibrage)',
    badge: 'Anti-Fraude',
    badgeColor: 'bg-amber-600 text-white',
    iconName: 'shield',
    description: 'Mesure en temps réel du volume de carburant au litre près avec alerte immédiate lors des baisses brutales (siphonnage).',
    features: [
      'Sonde de haute précision ±1% dans le réservoir',
      'Notification SMS / alerte push immédiate en cas de vol',
      'Réconciliation automatique tickets de carburant / litres réels',
      'Élimination prouvée des déperditions (-20% de budget carburant)',
    ],
    isStandaloneEligible: true,
    highlight: true,
  },
  {
    id: 'dashcam-ia',
    name: 'Dashcam IA Vidéosurveillance Embarquée (Route + Habitacle)',
    shortName: 'Dashcam Vidéo IA',
    category: 'Sécurité & Contrôle',
    monthlyRate: '20 000 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 20000,
    setupFee: '35 000 Francs / pose',
    badge: 'Sécurité IA',
    badgeColor: 'bg-indigo-600 text-white',
    iconName: 'video',
    description: 'Double caméra connectée 4G avec levée de doute en direct, détection de somnolence et preuve vidéo en cas de litige.',
    features: [
      'Caméra route Full HD + caméra habitacle infrarouge',
      'Alertes intelligentes DSM (distraction, fatigue, téléphone)',
      'Enregistrement continu & cloud sécurisé',
      'Preuve vidéo irréfutable pour assureurs et police',
    ],
    isStandaloneEligible: true,
  },
  {
    id: 'badge-rfid',
    name: 'Lecteur de Badge RFID Conducteur & Éco-Conduite',
    shortName: 'Badge RFID & Éco-Score',
    category: 'Chauffeurs & RH',
    monthlyRate: '5 000 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 5000,
    setupFee: '15 000 Francs / équipement',
    badge: 'Comportement',
    badgeColor: 'bg-blue-600 text-white',
    iconName: 'key',
    description: 'Identification nominative du chauffeur avant démarrage, attribution automatique des trajets et analyse d’éco-conduite.',
    features: [
      'Badges nominatifs individuels infalsifiables',
      'Attribution automatique de chaque trajet au bon conducteur',
      'Score d’éco-conduite (accélérations, freinages brusques)',
      'Préservation de la mécanique et valorisation des bons chauffeurs',
    ],
    isStandaloneEligible: true,
  },
  {
    id: 'formation-securite',
    name: 'Formation Sécurité Routière & Conduite Défensive',
    shortName: 'Formation Chauffeurs',
    category: 'Chauffeurs & RH',
    monthlyRate: '60 000 Francs / session / chauffeur',
    monthlyRatePerVehicleFcfa: 0,
    setupFee: 'Forfait entreprise sur devis',
    badge: 'Certifiante',
    badgeColor: 'bg-teal-600 text-white',
    iconName: 'users',
    description: 'Programme certifiant en entreprise : réflexes d’urgence, conduite défensive et éco-conduite (-18% de consommation constatée).',
    features: [
      'Formateurs et ingénieurs transport certifiés',
      'Attestations individuelles de conduite préventive',
      'Réduction constatée de 40% des sinistres et accrochages',
      'Modules pratiques sur route et théorie code de la route',
    ],
    isStandaloneEligible: true,
  },
  {
    id: 'vehicule-relais',
    name: 'Véhicule Relais Garanti (VIP Replacement < 2h)',
    shortName: 'Véhicule Relais Garanti',
    category: 'Continuité & Logistique',
    monthlyRate: '35 000 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 35000,
    setupFee: 'Sans engagement',
    badge: 'Disponibilité 100%',
    badgeColor: 'bg-purple-600 text-white',
    iconName: 'car',
    description: 'Mise à disposition immédiate sous 2 heures d’un véhicule de remplacement équivalent en cas de panne, révision ou sinistre.',
    features: [
      'Garantie de non-rupture de vos opérations commerciales',
      'Flotte relais diversifiée (berlines, pick-up 4x4, SUV)',
      'Véhicules récents et climatisés prêts à rouler',
      'Prise en charge intégrale de la logistique d’échange',
    ],
    isStandaloneEligible: true,
  },
  {
    id: 'stockage-gardiennage',
    name: 'Stockage Sécurisé de Parc & Gardiennage 24/7',
    shortName: 'Stockage Sécurisé 24/7',
    category: 'Continuité & Logistique',
    monthlyRate: '45 000 Francs / véh. / mois',
    monthlyRatePerVehicleFcfa: 45000,
    setupFee: 'Ou 2 500 Francs / jour',
    badge: 'Haute Sécurité',
    badgeColor: 'bg-slate-700 text-white',
    iconName: 'warehouse',
    description: 'Stationnement sous surveillance physique et vidéo 24/7 en centre logistique sécurisé avec maintien de charge batterie.',
    features: [
      'Site clos, éclairé et vidéosurveillé 24h/24 et 7j/7',
      'Contrôle d’accès biométrique et registre des mouvements',
      'Maintien de charge de batterie hebdomadaire inclus',
      'Lavage complet et inspection avant restitution',
    ],
    isStandaloneEligible: true,
  },
];

interface FleetPackagesSectionProps {
  onSelectPackage: (packageName: string, fleetSize?: string, details?: string) => void;
}

export const FleetPackagesSection: React.FC<FleetPackagesSectionProps> = ({ onSelectPackage }) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'packs' | 'options' | 'configurator' | 'pro_grid'>('packs');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  
  // Currency state
  const [currencyCode, setCurrencyCode] = useState<string>(getSelectedCurrencyCode());

  useEffect(() => {
    const handleCurrencyEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code: string }>;
      if (customEvent.detail?.code) {
        setCurrencyCode(customEvent.detail.code);
      }
    };
    window.addEventListener('jmf-currency-change', handleCurrencyEvent);
    return () => window.removeEventListener('jmf-currency-change', handleCurrencyEvent);
  }, []);

  // Selection states
  const [packagesList, setPackagesList] = useState<FleetPackage[]>(() => {
    return pricingService.getFleetPackages().filter((p) => p.enabled !== false) as any;
  });

  useEffect(() => {
    const unsubscribe = pricingService.subscribe(() => {
      setPackagesList(pricingService.getFleetPackages().filter((p) => p.enabled !== false) as any);
    });
    return () => unsubscribe();
  }, []);

  const [selectedPackId, setSelectedPackId] = useState<string>('pro');
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>(['gps-4g']);
  const [fleetCount, setFleetCount] = useState<number>(10);
  const [includePackInConfig, setIncludePackInConfig] = useState<boolean>(true);

  // Modals
  const [modalPack, setModalPack] = useState<FleetPackage | null>(null);
  const [modalOption, setModalOption] = useState<FleetOption | null>(null);

  // Current selected pack object
  const currentPack = useMemo(() => {
    return packagesList.find((p) => p.id === selectedPackId) || packagesList[0] || FLEET_PACKAGES[2];
  }, [selectedPackId, packagesList]);

  // Toggle option selection in configurator
  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Calculate configurator estimate
  const calculation = useMemo(() => {
    const packCost = includePackInConfig ? currentPack.monthlyPriceNumeric : 0;
    const packSetup = includePackInConfig ? (currentPack.setupFeeNumeric || 0) : 0;

    let optionsMonthlyTotal = 0;
    const selectedOptionsList = FLEET_OPTIONS.filter((o) => selectedOptionIds.includes(o.id));

    selectedOptionsList.forEach((opt) => {
      if (opt.monthlyRatePerVehicleFcfa > 0) {
        optionsMonthlyTotal += opt.monthlyRatePerVehicleFcfa * fleetCount;
      }
    });

    const totalMonthly = packCost + optionsMonthlyTotal;

    return {
      packCost,
      packSetup,
      optionsMonthlyTotal,
      totalMonthly,
      selectedOptionsList,
    };
  }, [includePackInConfig, currentPack, selectedOptionIds, fleetCount]);

  const handleChoosePack = (pack: FleetPackage) => {
    setSelectedPackId(pack.id);
    setModalPack(pack);
  };

  const handleChooseOptionStandalone = (option: FleetOption) => {
    setModalOption(option);
  };

  const handleConfirmQuoteFromPack = (pack: FleetPackage) => {
    const details = `${pack.name} (${pack.fleetSize}) - Tarif : ${pack.monthlyPrice} - Frais mise en place : ${pack.setupFee}`;
    onSelectPackage(pack.name, pack.fleetRange, details);
    setModalPack(null);
  };

  const handleConfirmQuoteFromOption = (option: FleetOption) => {
    const details = `Option à la carte : ${option.name} (${option.monthlyRate} - ${option.setupFee}) - Flotte de ${fleetCount} véhicules`;
    onSelectPackage(`Option seule : ${option.shortName}`, `${fleetCount} véh.`, details);
    setModalOption(null);
  };

  const handleConfirmConfigurator = () => {
    const packLabel = includePackInConfig ? currentPack.name : 'Sans Pack Forfaitaire (Options Seules)';
    const optionsNames = calculation.selectedOptionsList.map((o) => o.shortName).join(' + ') || 'Aucune option additionnelle';
    const totalEst = calculation.totalMonthly > 0 ? `${formatCurrencyAmount(calculation.totalMonthly, currencyCode)} / mois` : 'Sur devis';
    const details = `Configuration 360° : ${packLabel} | Options : ${optionsNames} | Flotte : ${fleetCount} véhicules | Estimation : ${totalEst}`;
    
    onSelectPackage(packLabel, `${fleetCount} véh.`, details);
  };

  const getWhatsAppMessageForConfig = () => {
    const packLabel = includePackInConfig ? currentPack.name : 'Sans Pack Forfaitaire (Options Seules)';
    const optionsNames = calculation.selectedOptionsList.map((o) => o.shortName).join(', ') || 'Aucune option';
    const text = `Bonjour JMF Mobility Services, je souhaite obtenir un devis pour ma flotte de ${fleetCount} véhicules. Formule choisie : ${packLabel}. Options sélectionnées : ${optionsNames}. Merci de me recontacter pour finaliser notre proposition.`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppMessageForPack = (pack: FleetPackage) => {
    const text = `Bonjour JMF Mobility Services, je souhaite obtenir un devis et souscrire au ${pack.name} (Taille de flotte : ${pack.fleetSize}, Tarif mensuel : ${pack.monthlyPrice}, Frais de mise en place : ${pack.setupFee}). Merci de me recontacter pour formaliser notre offre.`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  const getWhatsAppMessageForOption = (opt: FleetOption) => {
    const text = `Bonjour JMF Mobility Services, je souhaite souscrire à l'option à la carte : ${opt.name} (${opt.monthlyRate}) pour ma flotte de ${fleetCount} véhicules sans forcément sélectionner de pack. Merci de me recontacter.`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  const renderOptionIcon = (iconName: string) => {
    switch (iconName) {
      case 'radio':
        return <Radio className="w-5 h-5 text-sky-600" />;
      case 'cpu':
        return <Cpu className="w-5 h-5 text-red-600" />;
      case 'video':
        return <Video className="w-5 h-5 text-indigo-600" />;
      case 'users':
        return <Users className="w-5 h-5 text-teal-600" />;
      case 'key':
        return <Key className="w-5 h-5 text-blue-600" />;
      case 'warehouse':
        return <Warehouse className="w-5 h-5 text-slate-700" />;
      case 'car':
        return <Car className="w-5 h-5 text-purple-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <section id="tarifs" className="py-20 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* ======================================================== */}
        {/* SECTION HEADER                                           */}
        {/* ======================================================== */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Tarification Transparente • Gestion de Flotte Globale</span>
          </div>

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            NOS OFFRES DE GESTION DE FLOTTE 360°
          </h3>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Notre approche garantit une maîtrise totale de vos opérations de transport, structurée autour de Packs d'accompagnement forfaitaires et d'options technologiques adaptées à vos contraintes.
          </p>

          {/* Subheading Notice: Choice flexibility */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs font-semibold text-slate-600 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-emerald-600 font-bold">✓ Flexibilité intégrale :</span>
              <span>Souscrivez à un Pack Global, ou choisissez librement parmi nos Options Technologiques à la carte, avec ou sans pack !</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN NAVIGATION TABS (Packs vs Options vs Configurator)  */}
        {/* ======================================================== */}
        <div className="space-y-3 border-b border-slate-200 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:flex xl:flex-row items-stretch gap-2.5 w-full">
            <button
              type="button"
              onClick={() => setActiveTab('packs')}
              className={`xl:flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'packs'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>I. Packs de Gestion Globale</span>
              <span className="px-1.5 py-0.5 rounded-md bg-sky-500/20 text-[10px] font-mono">
                {packagesList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('options')}
              className={`xl:flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'options'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>II. Options & Services à la Carte</span>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-[10px] font-mono">
                {FLEET_OPTIONS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('configurator')}
              className={`xl:flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'configurator'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/20 ring-2 ring-sky-400/30'
                  : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>III. Configurateur Sur-Mesure 360°</span>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500 text-white text-[9px] font-bold uppercase">
                Direct
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pro_grid')}
              className={`xl:flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'pro_grid'
                  ? 'bg-teal-800 text-white shadow-md shadow-teal-800/20 ring-2 ring-teal-500/30'
                  : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'pro_grid' ? 'text-teal-200' : 'text-teal-700'}`} />
              <span>IV. Grille Pro : Utilitaires, Poids Lourds &amp; Engins</span>
            </button>
          </div>

          {/* Sub-toggle for Packs tab: Cards vs Table */}
          {activeTab === 'packs' && (
            <div className="flex items-center justify-end">
              <div className="inline-flex p-1 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'cards'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Vue Cartes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Tableau Comparatif</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* TAB 1: PACKS DE GESTION GLOBALE                          */}
        {/* ======================================================== */}
        {activeTab === 'packs' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* View 1: Cards */}
            {viewMode === 'cards' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-3.5 xl:gap-4 items-stretch">
                {packagesList.map((pack) => {
                  const isSelected = selectedPackId === pack.id;
                  const isPro = pack.isPopular;
                  const isCorporate = pack.id === 'corporate';
                  const priceNumericFormatted = pack.monthlyPriceNumeric
                    ? formatCurrencyAmount(pack.monthlyPriceNumeric, currencyCode)
                    : 'Sur devis';

                  return (
                    <div
                      key={pack.id}
                      className={`rounded-2xl transition-all duration-200 flex flex-col justify-between relative bg-white ${
                        isPro
                          ? 'border-2 border-sky-600 shadow-xl ring-2 ring-sky-500/25'
                          : isSelected
                          ? 'border-2 border-slate-900 shadow-lg'
                          : 'border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Popular Pill */}
                      {isPro && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 whitespace-nowrap z-10">
                          <Sparkles className="w-3 h-3" />
                          <span>Le plus plébiscité</span>
                        </div>
                      )}

                      <div className="p-4 sm:p-5 flex flex-col flex-1 space-y-3.5">
                        {/* Card Header - Calibrated uniform height for pixel-perfect baseline */}
                        <div className="flex flex-col justify-between h-[104px] sm:h-[108px] shrink-0">
                          <div>
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[9.5px] font-black tracking-wider text-slate-500 uppercase whitespace-nowrap">
                                Formule {pack.shortName}
                              </span>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 whitespace-nowrap shrink-0">
                                {pack.fleetSize}
                              </span>
                            </div>
                            <h4 className="text-base xl:text-[15px] font-black text-slate-900 leading-tight whitespace-nowrap">
                              {pack.name}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-snug line-clamp-3">
                            {pack.description}
                          </p>
                        </div>

                        {/* Pricing Box - Strictly unified height and non-breaking price typography */}
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100/90 flex flex-col justify-between h-[86px] shrink-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                              Tarif Mensuel
                            </span>
                            {isCorporate && (
                              <span className="text-[9px] font-bold text-purple-700 bg-purple-100/80 px-1.5 py-0.2 rounded">
                                À partir de
                              </span>
                            )}
                          </div>

                          <div className="flex items-baseline gap-1 my-0.5 overflow-hidden">
                            <span className="text-lg xl:text-xl font-black text-slate-900 font-mono tracking-tight leading-none truncate">
                              {priceNumericFormatted}
                            </span>
                            <span className="text-[10.5px] xl:text-[11px] font-bold text-slate-500 whitespace-nowrap">
                              <span className="font-normal text-slate-400">/ mois</span>
                            </span>
                          </div>

                          <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between gap-1 text-[10px]">
                            <span className="text-slate-500 whitespace-nowrap shrink-0">Mise en place :</span>
                            <span className="font-bold text-slate-800 font-mono truncate text-right text-[10.5px]">
                              {pack.setupFeeNumeric ? formatCurrencyAmount(pack.setupFeeNumeric, currencyCode) : pack.setupFee}
                            </span>
                          </div>
                        </div>

                        {/* Features / Services list with aligned badge slot */}
                        <div className="flex-1 flex flex-col justify-between space-y-3 pt-1 border-t border-slate-100">
                          <div className="space-y-2.5">
                            {/* Standardized 26px badge slot across all cards */}
                            <div className="h-[26px] flex items-center">
                              {pack.includedBase ? (
                                <div className="w-full text-[10.5px] font-bold text-sky-700 flex items-center gap-1.5 bg-sky-50 px-2 py-1 rounded-md border border-sky-100/80 truncate">
                                  <span className="shrink-0">⚡</span>
                                  <span className="truncate">{pack.includedBase}</span>
                                </div>
                              ) : isCorporate ? (
                                <div className="w-full text-[10.5px] font-bold text-purple-700 flex items-center gap-1.5 bg-purple-50 px-2 py-1 rounded-md border border-purple-100/80 truncate">
                                  <span className="shrink-0">💎</span>
                                  <span className="truncate">Sur-mesure Grands Comptes</span>
                                </div>
                              ) : (
                                <div className="w-full text-[10.5px] font-bold text-slate-600 flex items-center gap-1.5 bg-slate-100/80 px-2 py-1 rounded-md border border-slate-200/60 truncate">
                                  <span className="shrink-0">⭐</span>
                                  <span className="truncate">Formule socle initiale</span>
                                </div>
                              )}
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Services Inclus :
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-600">
                              {pack.services.map((service, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <Check className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5 font-bold" />
                                  <span className="leading-snug text-[11px] text-slate-700">
                                    {service}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {pack.note && (
                            <div className="text-[10px] text-slate-500 italic bg-amber-50/70 p-2 rounded-lg border border-amber-200/60 leading-snug">
                              {pack.note}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* CTA Bottom Button pinned to baseline */}
                      <div className="p-4 sm:p-5 pt-0 space-y-2 mt-auto">
                        <button
                          type="button"
                          onClick={() => handleChoosePack(pack)}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                            isPro
                              ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                          }`}
                        >
                          <span>Choisir ce Pack</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* View 2: Table */}
            {viewMode === 'table' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[760px]">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                        <th className="py-4 px-4 font-bold">Pack</th>
                        <th className="py-4 px-4 font-bold">Taille de Flotte</th>
                        <th className="py-4 px-4 font-bold">Tarif Mensuel</th>
                        <th className="py-4 px-4 font-bold">Frais de Mise en Place</th>
                        <th className="py-4 px-6 font-bold">Services Inclus</th>
                        <th className="py-4 px-4 font-bold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs text-slate-700">
                      {packagesList.map((pack) => {
                        const isPro = pack.isPopular;
                        const isSelected = selectedPackId === pack.id;

                        return (
                          <tr
                            key={pack.id}
                            className={`transition-colors hover:bg-sky-50/50 ${
                              isPro
                                ? 'bg-sky-50/30'
                                : isSelected
                                ? 'bg-slate-50'
                                : ''
                            }`}
                          >
                            <td className="py-4 px-4 align-top font-bold text-slate-900 whitespace-nowrap">
                              <div className="flex items-center gap-2">
                                <span>{pack.name}</span>
                                {isPro && (
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-600 text-white">
                                    Top
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4 align-top font-medium text-slate-800 whitespace-nowrap">
                              <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold">
                                {pack.fleetSize}
                              </span>
                            </td>

                            <td className="py-4 px-4 align-top font-mono font-bold text-slate-900 whitespace-nowrap">
                              <div className="text-sm font-black text-sky-700">
                                {pack.monthlyPriceNumeric ? `${formatCurrencyAmount(pack.monthlyPriceNumeric, currencyCode)} / mois` : pack.monthlyPrice}
                              </div>
                            </td>

                            <td className="py-4 px-4 align-top font-mono text-slate-700 whitespace-nowrap">
                              <span className="font-semibold">
                                {pack.setupFeeNumeric ? formatCurrencyAmount(pack.setupFeeNumeric, currencyCode) : pack.setupFee}
                              </span>
                            </td>

                            <td className="py-4 px-6 align-top space-y-1.5 max-w-md">
                              {pack.includedBase && (
                                <span className="font-bold text-sky-700 block mb-1">
                                  {pack.includedBase}
                                </span>
                              )}
                              <p className="leading-relaxed text-slate-700">
                                {pack.services.join(', ')}.
                              </p>
                              {pack.note && (
                                <p className="text-[11px] text-slate-500 italic">
                                  {pack.note}
                                </p>
                              )}
                            </td>

                            <td className="py-4 px-4 align-top text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleChoosePack(pack)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                                  isPro
                                    ? 'bg-sky-600 hover:bg-sky-500 text-white'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                                }`}
                              >
                                Choisir
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-slate-100/70 border-t border-slate-200 text-center text-xs text-slate-500 sm:hidden">
                  ← Faites défiler le tableau vers la droite pour voir tous les détails →
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: OPTIONS & SERVICES À LA CARTE (AVEC OU SANS PACK) */}
        {/* ======================================================== */}
        {activeTab === 'options' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Banner info */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-indigo-500/10 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Modules Technologiques & Services Indépendants</span>
                </div>
                <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                  Vous avez déjà votre propre organisation ou vous souhaitez cibler uniquement un besoin précis (ex : géolocalisation GPS seule, contrôle carburant, ou vidéo) ? Toutes ces options peuvent être souscrites à la carte sans pack forfaitaire.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('configurator')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 transition-all cursor-pointer shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Combiner plusieurs options</span>
              </button>
            </div>

            {/* Grid of Options Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {FLEET_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  className={`rounded-2xl bg-white border p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-md relative ${
                    opt.highlight
                      ? 'border-sky-500/80 ring-2 ring-sky-500/10 shadow-sm'
                      : 'border-slate-200 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3.5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        {renderOptionIcon(opt.iconName)}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {opt.badge && (
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${opt.badgeColor || 'bg-slate-900 text-white'}`}>
                            {opt.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-semibold text-slate-400">
                          {opt.category}
                        </span>
                      </div>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {opt.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed min-h-[44px]">
                        {opt.description}
                      </p>
                    </div>

                    {/* Price box */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Tarif
                      </div>
                      <div className="text-base font-black text-slate-900 font-mono">
                        {opt.monthlyRatePerVehicleFcfa > 0
                          ? `${formatCurrencyAmount(opt.monthlyRatePerVehicleFcfa, currencyCode)} / véh. / mois`
                          : opt.monthlyRate}
                      </div>
                      <div className="text-[10.5px] text-slate-500 font-medium">
                        Installation : <span className="text-slate-800 font-bold">{opt.setupFee}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Fonctionnalités :
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {opt.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-4 mt-3 border-t border-slate-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => handleChooseOptionStandalone(opt)}
                      className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Souscrire cette option seule</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (!selectedOptionIds.includes(opt.id)) {
                          setSelectedOptionIds((prev) => [...prev, opt.id]);
                        }
                        setActiveTab('configurator');
                      }}
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sliders className="w-3 h-3 text-slate-500" />
                      <span>Ajouter au configurateur</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONFIGURATEUR D'OFFRE SUR-MESURE 360°            */}
        {/* ======================================================== */}
        {activeTab === 'configurator' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider">
                  <Sliders className="w-3 h-3 text-sky-600" />
                  <span>Configurateur Interactif</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  Composez votre solution de gestion de flotte sur-mesure
                </h4>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  Activez un Pack global ou partez de zéro avec uniquement les options technologiques de votre choix. L'estimation s'actualise en temps réel.
                </p>
              </div>

              {/* Fleet size quick picker */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 shrink-0 w-full sm:w-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Taille de votre parc :
                </span>
                <div className="flex items-center gap-2">
                  {[5, 10, 25, 50, 100].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFleetCount(num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        fleetCount === num
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {num} véh.
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 1: Pack Selection (Optional) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                    1
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Pack d'accompagnement forfaitaire (Optionnel)
                  </h5>
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={includePackInConfig}
                    onChange={(e) => setIncludePackInConfig(e.target.checked)}
                    className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                  />
                  <span>Inclure un Pack Global de gestion</span>
                </label>
              </div>

              {includePackInConfig ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {packagesList.map((pack) => {
                    const isSelected = selectedPackId === pack.id;
                    return (
                      <button
                        key={pack.id}
                        type="button"
                        onClick={() => setSelectedPackId(pack.id)}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-sky-50/80 border-sky-600 ring-2 ring-sky-500/20 shadow-sm'
                            : 'bg-slate-50/50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {pack.fleetSize}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                          <div className="font-black text-slate-900 text-xs sm:text-sm">
                            {pack.name}
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-200/60 font-mono text-xs font-black text-sky-700">
                          {pack.monthlyPrice.replace(' / mois', '')}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Mode Options Seules activé :</strong> Aucun pack forfaitaire sélectionné. Vous ne paierez que les modules technologiques choisis ci-dessous.
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Options Selection (A la carte) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-black flex items-center justify-center">
                  2
                </div>
                <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Options Technologiques & Services à la Carte
                </h5>
                <span className="text-xs text-slate-500 font-medium">
                  ({selectedOptionIds.length} sélectionnée{selectedOptionIds.length > 1 ? 's' : ''})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLEET_OPTIONS.map((opt) => {
                  const isChecked = selectedOptionIds.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                        isChecked
                          ? 'bg-sky-50/60 border-sky-600 ring-2 ring-sky-500/20 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}} // handled by parent onClick
                              className="w-4 h-4 text-sky-600 rounded cursor-pointer"
                            />
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              {opt.category}
                            </span>
                          </div>
                          {opt.badge && (
                            <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${opt.badgeColor || 'bg-slate-900 text-white'}`}>
                              {opt.badge}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="text-xs font-black text-slate-900 leading-snug">
                            {opt.name}
                          </div>
                          <p className="text-[10.5px] text-slate-500 mt-1 leading-snug line-clamp-2">
                            {opt.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-500">Tarif :</span>
                        <span className="font-mono font-black text-slate-900">
                          {opt.monthlyRate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Synthesis & Action Bar */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white space-y-6 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-400">
                    Synthèse de votre configuration
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    {includePackInConfig ? currentPack.name : 'Options Technologiques Seules (Sans Pack)'}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                      Flotte : {fleetCount} véhicules
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700">
                      Options : {calculation.selectedOptionsList.length > 0 ? calculation.selectedOptionsList.map((o) => o.shortName).join(', ') : 'Aucune option'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estimation Mensuelle Totale
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight mt-0.5">
                    {calculation.totalMonthly > 0 ? (
                      <>
                        {formatCurrencyAmount(calculation.totalMonthly, currencyCode)}
                        <span className="text-xs font-normal text-slate-400 ml-1">/ mois</span>
                      </>
                    ) : (
                      'Sur Devis'
                    )}
                  </div>
                  {includePackInConfig && currentPack.setupFee && (
                    <div className="text-[11px] text-slate-400 mt-1">
                      Mise en place pack : <span className="text-white font-mono">{currentPack.setupFeeNumeric ? formatCurrencyAmount(currentPack.setupFeeNumeric, currencyCode) : currentPack.setupFee}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleConfirmConfigurator}
                  className="w-full sm:flex-1 py-3 px-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Demander mon devis officiel avec cette configuration</span>
                </button>

                <a
                  href={getWhatsAppMessageForConfig()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-3 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Transmettre sur WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: GRILLE PRO : UTILITAIRES, POIDS LOURDS & ENGINS   */}
        {/* ======================================================== */}
        {activeTab === 'pro_grid' && (
          <div className="animate-in fade-in duration-200">
            <ProfessionalTariffGridSection onSelectOffer={onSelectPackage} />
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTTOM BANNER: AUDIT & CONSEIL DIRECT                    */}
        {/* ======================================================== */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Accompagnement sur-mesure & audit préalable</span>
            </div>
            <h4 className="text-lg font-black text-white">
              Besoin d'un audit personnalisé de votre flotte avant de choisir ?
            </h4>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Nos ingénieurs et consultants mobilité analysent gratuitement la composition de votre parc automobile pour vous orienter vers la formule exacte la plus rentable.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/2290197832121?text=Bonjour%20JMF%20Mobility%20Services,%20je%20souhaite%20obtenir%20des%20conseils%20sur%20les%20Packs%20et%20Options%20de%20Gestion%20de%20Flotte."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Conseil WhatsApp Direct</span>
            </a>

            <button
              type="button"
              onClick={() => {
                const elem = document.getElementById('contact');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4 text-sky-600" />
              <span>Demander un devis détaillé</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CONFIRMATION SÉLECTION PACK                     */}
      {/* ======================================================== */}
      {modalPack && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setModalPack(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalPack(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  Formule Sélectionnée
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  Taille : {modalPack.fleetSize}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {modalPack.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {modalPack.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-slate-50 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Abonnement Mensuel
                  </span>
                  <div className="text-2xl font-black text-sky-700 font-mono">
                    {modalPack.monthlyPrice}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Frais de mise en place
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {modalPack.setupFee}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-sky-200/60 space-y-1.5 text-xs">
                {modalPack.includedBase && (
                  <div className="font-bold text-sky-800 text-[11px] flex items-center gap-1">
                    <span>⚡</span>
                    <span>{modalPack.includedBase}</span>
                  </div>
                )}
                <div className="text-[11px] font-semibold text-slate-700">
                  Services inclus dans ce pack :
                </div>
                <ul className="space-y-1 text-[11.5px] text-slate-600">
                  {modalPack.services.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmQuoteFromPack(modalPack)}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Remplir le formulaire avec cette formule</span>
              </button>

              <a
                href={getWhatsAppMessageForPack(modalPack)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Souscrire / Échanger directement sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setModalPack(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Continuer à comparer les offres
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: CONFIRMATION SÉLECTION OPTION STANDALONE        */}
      {/* ======================================================== */}
      {modalOption && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setModalOption(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOption(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Fermer la fenêtre"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Option à la carte
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  {modalOption.category}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {modalOption.name}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {modalOption.description}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-slate-50 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Tarif Unitaire
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-amber-800 font-mono">
                    {modalOption.monthlyRate}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Installation / Déploiement
                  </span>
                  <div className="text-sm font-bold text-slate-900 font-mono">
                    {modalOption.setupFee}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-amber-200/60 space-y-1.5 text-xs">
                <div className="text-[11px] font-semibold text-slate-700">
                  Avantages et fonctionnalités incluses :
                </div>
                <ul className="space-y-1 text-[11.5px] text-slate-600">
                  {modalOption.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmQuoteFromOption(modalOption)}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Demander un devis pour cette option seule</span>
              </button>

              <a
                href={getWhatsAppMessageForOption(modalOption)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Souscrire cette option via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setModalOption(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
              >
                Retour aux options
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
