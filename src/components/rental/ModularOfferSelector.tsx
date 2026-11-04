import React, { useState, useMemo, useEffect } from 'react';
import { pricingService } from '../../services/pricingService';
import {
  Check,
  CheckCircle2,
  Sparkles,
  Car,
  ShieldCheck,
  Zap,
  Cpu,
  Radio,
  Video,
  Key,
  Users,
  Warehouse,
  Shield,
  FileText,
  MessageSquare,
  Printer,
  Sliders,
  Info,
  ChevronRight,
  X,
  BadgePercent,
  Download,
  Phone,
  Building2,
  Calculator,
  RotateCcw,
  Plus,
  Minus,
  Layers,
  ArrowRight
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { JmfLogo } from '../common/JmfLogo.js';

export interface ModularPack {
  id: string;
  name: string;
  shortName: string;
  recommendedFleet: string;
  minVehicles: number;
  maxVehicles: number;
  monthlyPrice: number; // in FCFA
  setupFee: number; // in FCFA
  isPopular?: boolean;
  accentGradient: string;
  tagline: string;
  includedServices: string[];
}

export interface ModularTechOption {
  id: string;
  name: string;
  shortName: string;
  category: 'Télématique & IoT' | 'Sécurité & Contrôle' | 'Chauffeurs & RH' | 'Continuité & Logistique';
  monthlyRatePerVehicle: number; // FCFA / veh / month (or flat per driver/session)
  setupFeePerVehicle: number; // FCFA setup/installation
  isFlatRate?: boolean; // if flat (e.g. training per driver)
  flatLabel?: string;
  badge?: string;
  badgeColor?: string;
  iconName: 'radio' | 'cpu' | 'video' | 'key' | 'users' | 'car' | 'warehouse' | 'shield';
  description: string;
  keyBenefits: string[];
}

export const MODULAR_PACKS: ModularPack[] = [
  {
    id: 'essentiel',
    name: "PACK ESSENTIEL",
    shortName: "Essentiel",
    recommendedFleet: "1 à 10 véhicules",
    minVehicles: 1,
    maxVehicles: 10,
    monthlyPrice: 75000,
    setupFee: 100000,
    accentGradient: "from-sky-500 to-blue-600",
    tagline: "Gestion administrative, conformité documentaire et suivi des entretiens courants pour petites flottes.",
    includedServices: [
      "Suivi administratif & documents de bord",
      "Gestion des échéances (visites, assurances)",
      "Planning d'entretien régulier",
      "Suivi des réparations courantes",
      "Rapport mensuel de gestion de flotte",
      "Assistance téléphonique prioritaire"
    ]
  },
  {
    id: 'business',
    name: "PACK BUSINESS",
    shortName: "Business",
    recommendedFleet: "11 à 25 véhicules",
    minVehicles: 11,
    maxVehicles: 25,
    monthlyPrice: 150000,
    setupFee: 200000,
    accentGradient: "from-blue-600 to-indigo-600",
    tagline: "Suivi rigoureux du carburant, kilométrage et gestion opérationnelle des conducteurs.",
    includedServices: [
      "Tous les services du Pack Essentiel",
      "Suivi analytique du carburant",
      "Suivi kilométrique périodique",
      "Planning de maintenance préventive",
      "Gestion & réduction des immobilisations",
      "Suivi comportemental des conducteurs",
      "Tableau de bord de synthèse mensuel"
    ]
  },
  {
    id: 'pro',
    name: "PACK PRO",
    shortName: "Pro",
    recommendedFleet: "26 à 50 véhicules",
    minVehicles: 26,
    maxVehicles: 50,
    monthlyPrice: 300000,
    setupFee: 300000,
    isPopular: true,
    accentGradient: "from-sky-600 to-indigo-700",
    tagline: "Suivi analytique approfondi des coûts par véhicule, gestion des sinistres et revue mensuelle.",
    includedServices: [
      "Tous les services du Pack Business",
      "Suivi du TCO / coût de revient par véhicule",
      "Gestion complète des sinistres & assurances",
      "Analyse avancée des performances de la flotte",
      "Réunion mensuelle de pilotage stratégique",
      "Plans d'actions correctives personnalisés"
    ]
  },
  {
    id: 'entreprise',
    name: "PACK ENTREPRISE",
    shortName: "Entreprise",
    recommendedFleet: "51 à 100 véhicules",
    minVehicles: 51,
    maxVehicles: 100,
    monthlyPrice: 550000,
    setupFee: 500000,
    accentGradient: "from-indigo-700 to-purple-800",
    tagline: "Supervision d'envergure avec audits réguliers, contrôle budgétaire et responsable de compte dédié.",
    includedServices: [
      "Tous les services du Pack Pro",
      "Audit régulier de conformité de l'ensemble du parc",
      "Contrôle budgétaire strict et optimisation des dépenses",
      "Responsable de compte dédié JMF Mobility 24/7",
      "Astreinte opérationnelle prioritaire"
    ]
  },
  {
    id: 'corporate',
    name: "PACK CORPORATE",
    shortName: "Corporate",
    recommendedFleet: "+ de 100 véhicules",
    minVehicles: 101,
    maxVehicles: 500,
    monthlyPrice: 900000,
    setupFee: 750000,
    accentGradient: "from-purple-900 to-slate-900",
    tagline: "Solution sur-mesure d'externalisation globale pour grands groupes, institutions et multinationales.",
    includedServices: [
      "Externalisation intégrale de la gestion de flotte",
      "Équipe technique et logistique dédiée sur site",
      "SLA garanti et reporting sur-mesure pour direction",
      "Tarification dégressive au véhicule sur demande"
    ]
  }
];

export const MODULAR_TECH_OPTIONS: ModularTechOption[] = [
  {
    id: 'gps-4g',
    name: "Balises GPS 4G & Télématique Temps Réel",
    shortName: "Balises GPS 4G",
    category: "Télématique & IoT",
    monthlyRatePerVehicle: 12500,
    setupFeePerVehicle: 15000, // Inclus dès 5 véh.
    badge: "Incontournable",
    badgeColor: "bg-emerald-600 text-white",
    iconName: "radio",
    description: "Géolocalisation haute précision 24/7, historique des trajets, alertes excès de vitesse et sorties de zone.",
    keyBenefits: [
      "Boîtier GPS 4G étanche & anti-brouillage",
      "Carte SIM data multi-opérateur (Afrique & Roaming)",
      "Plateforme web & application mobile en direct",
      "Frais de pose offerts dès 5 véhicules"
    ]
  },
  {
    id: 'coupure-moteur',
    name: "Coupure Moteur à Distance & Anti-Démarrage",
    shortName: "Coupure Moteur",
    category: "Sécurité & Contrôle",
    monthlyRatePerVehicle: 3500,
    setupFeePerVehicle: 25000,
    badge: "Antivol certifié",
    badgeColor: "bg-red-600 text-white",
    iconName: "cpu",
    description: "Immobilisation sécurisée du véhicule par commande mobile ou SMS en cas de vol, détournement ou hors horaire autorisé.",
    keyBenefits: [
      "Relais sécurisé certifié sans impact garantie",
      "Activation instantanée par SMS / application",
      "Immobilisation progressive sans risque routier",
      "Déverrouillage crypté réservé au gestionnaire"
    ]
  },
  {
    id: 'sonde-carburant',
    name: "Sonde Carburant Capacitive Anti-Siphonnage",
    shortName: "Sonde Carburant",
    category: "Sécurité & Contrôle",
    monthlyRatePerVehicle: 15000,
    setupFeePerVehicle: 40000,
    badge: "Anti-Fraude",
    badgeColor: "bg-amber-600 text-white",
    iconName: "shield",
    description: "Mesure en temps réel du volume de carburant au litre près avec alerte immédiate lors des baisses brutales.",
    keyBenefits: [
      "Sonde de haute précision ±1% dans le réservoir",
      "Alerte push et SMS immédiate en cas de siphonnage",
      "Élimination constatée de 15% à 25% des pertes",
      "Rapprochement automatique tickets / litrages réels"
    ]
  },
  {
    id: 'dashcam-ia',
    name: "Dashcam IA Vidéosurveillance Embarquée",
    shortName: "Dashcam Vidéo IA",
    category: "Sécurité & Contrôle",
    monthlyRatePerVehicle: 20000,
    setupFeePerVehicle: 35000,
    badge: "Sécurité IA",
    badgeColor: "bg-indigo-600 text-white",
    iconName: "video",
    description: "Double caméra connectée 4G (route + habitacle) avec levée de doute en direct et détection de somnolence.",
    keyBenefits: [
      "Caméra route Full HD + habitacle infrarouge nuit",
      "Alertes d'inattention, téléphone au volant et fatigue",
      "Preuve vidéo irréfutable pour assureurs et police",
      "Sauvegarde cloud sécurisée des événements clés"
    ]
  },
  {
    id: 'badge-rfid',
    name: "Lecteur de Badge RFID Conducteur & Éco-Score",
    shortName: "Badge RFID Conducteur",
    category: "Chauffeurs & RH",
    monthlyRatePerVehicle: 5000,
    setupFeePerVehicle: 15000,
    badge: "Comportement",
    badgeColor: "bg-blue-600 text-white",
    iconName: "key",
    description: "Identification nominative du chauffeur avant démarrage, attribution automatique des trajets et analyse d'éco-conduite.",
    keyBenefits: [
      "Badges nominatifs individuels infalsifiables",
      "Attribution automatique des trajets au chauffeur",
      "Score de conduite (freinages, virages, accélérations)",
      "Préservation mécanique du véhicule"
    ]
  },
  {
    id: 'formation-securite',
    name: "Formation Sécurité Routière & Conduite Défensive",
    shortName: "Formation Chauffeurs",
    category: "Chauffeurs & RH",
    monthlyRatePerVehicle: 0,
    setupFeePerVehicle: 60000,
    isFlatRate: true,
    flatLabel: "60 000 Francs / session par chauffeur",
    badge: "Certifiante",
    badgeColor: "bg-teal-600 text-white",
    iconName: "users",
    description: "Programme certifiant dispensé en entreprise : réflexes d'urgence, conduite défensive et éco-conduite.",
    keyBenefits: [
      "Formateurs certifiés et ingénieurs transport",
      "Attestations individuelles de conduite préventive",
      "Baisse mesurée de 40% des accrochages et sinistres",
      "Ateliers pratiques sur route et évaluation écrite"
    ]
  },
  {
    id: 'vehicule-relais',
    name: "Véhicule Relais Garanti (< 2h en zone urbaine)",
    shortName: "Véhicule Relais VIP",
    category: "Continuité & Logistique",
    monthlyRatePerVehicle: 35000,
    setupFeePerVehicle: 0,
    badge: "Disponibilité 100%",
    badgeColor: "bg-purple-600 text-white",
    iconName: "car",
    description: "Mise à disposition immédiate sous 2 heures d'un véhicule de remplacement équivalent en cas d'immobilisation.",
    keyBenefits: [
      "Garantie absolue de continuité de service",
      "Parc de remplacement diversifié (berlines, pick-up, SUV)",
      "Véhicules récents, assurés tous risques et climatisés",
      "Gestion intégrale de la permutation par JMF"
    ]
  },
  {
    id: 'stockage-gardiennage',
    name: "Stockage Sécurisé de Parc & Gardiennage 24/7",
    shortName: "Stockage & Gardiennage",
    category: "Continuité & Logistique",
    monthlyRatePerVehicle: 45000,
    setupFeePerVehicle: 0,
    badge: "Haute Sécurité",
    badgeColor: "bg-slate-700 text-white",
    iconName: "warehouse",
    description: "Stationnement sécurisé sous surveillance physique et vidéo 24/7 en centre logistique avec maintien de charge.",
    keyBenefits: [
      "Site clos, éclairé et vidéosurveillé 24h/24 et 7j/7",
      "Contrôle d'accès biométrique et registre horodaté",
      "Maintien de charge de batterie hebdomadaire inclus",
      "Lavage haute pression avant restitution"
    ]
  }
];

export interface ModularOfferSelectorProps {
  onQuoteRequested?: (summary: ModularSummary) => void;
  onApplyToBooking?: (summary: ModularSummary) => void;
  initialFleetSize?: number;
}

export interface ModularSummary {
  selectedPack: ModularPack | null;
  selectedOptionIds: string[];
  vehicleCount: number;
  durationMonths: number;
  packMonthlyPrice: number;
  optionsMonthlyPrice: number;
  grossMonthlyPrice: number;
  discountPercent: number;
  discountAmount: number;
  netMonthlyPrice: number;
  setupFeeTotal: number;
  grandTotalProjected: number;
  averageMonthlyPerVehicle: number;
}

export const ModularOfferSelector: React.FC<ModularOfferSelectorProps> = ({
  onQuoteRequested,
  onApplyToBooking,
  initialFleetSize = 5
}) => {
  // 1. Pack selection: pack id or 'none' (standalone / à la carte)
  const [selectedPackId, setSelectedPackId] = useState<string>('business');

  // 2. Fleet size (number of vehicles)
  const [vehicleCount, setVehicleCount] = useState<number>(initialFleetSize);

  // 3. Selected options (multi-select IDs)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([
    'gps-4g',
    'coupure-moteur'
  ]);

  // 4. Contract commitment duration (months)
  const [durationMonths, setDurationMonths] = useState<number>(6);

  // 5. Active category filter for options tab
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // 6. Modal quote request state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [quoteSuccess, setQuoteSuccess] = useState<boolean>(false);
  const [clientForm, setClientForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: '',
    notes: ''
  });

  const [adminFleetPacks, setAdminFleetPacks] = useState(() => pricingService.getFleetPackages());

  useEffect(() => {
    const unsubscribe = pricingService.subscribe(() => {
      setAdminFleetPacks(pricingService.getFleetPackages());
    });
    return () => unsubscribe();
  }, []);

  const modularPacksList = useMemo(() => {
    return MODULAR_PACKS.map((pack) => {
      const match = adminFleetPacks.find((p) => p.id === pack.id);
      if (match) {
        return {
          ...pack,
          monthlyPrice: match.monthlyPriceNumeric,
          setupFee: match.setupFeeNumeric !== undefined ? match.setupFeeNumeric : pack.setupFee,
          recommendedFleet: match.fleetSize || pack.recommendedFleet,
        };
      }
      return pack;
    });
  }, [adminFleetPacks]);

  // Calculate pack object
  const currentPack = useMemo(() => {
    if (selectedPackId === 'none') return null;
    return modularPacksList.find((p) => p.id === selectedPackId) || null;
  }, [selectedPackId, modularPacksList]);

  // Suggest optimal pack based on vehicleCount
  const recommendedPackForCount = useMemo(() => {
    if (vehicleCount <= 10) return 'essentiel';
    if (vehicleCount <= 25) return 'business';
    if (vehicleCount <= 50) return 'pro';
    if (vehicleCount <= 100) return 'entreprise';
    return 'corporate';
  }, [vehicleCount]);

  // Calculate options details
  const selectedOptions = useMemo(() => {
    return MODULAR_TECH_OPTIONS.filter((opt) => selectedOptionIds.includes(opt.id));
  }, [selectedOptionIds]);

  // Financial calculations
  const summary: ModularSummary = useMemo(() => {
    const packMonthly = currentPack ? currentPack.monthlyPrice : 0;

    // Options monthly:
    let optionsMonthly = 0;
    let setupFeeTotal = 0;

    // Pack setup fee
    if (currentPack) {
      setupFeeTotal += currentPack.setupFee;
    }

    selectedOptions.forEach((opt) => {
      if (opt.isFlatRate) {
        // Flat rate (like training sessions, estimated 1 session per vehicle or flat setup fee)
        setupFeeTotal += opt.setupFeePerVehicle * Math.min(vehicleCount, 5);
      } else {
        // Monthly rate multiplied by vehicle count
        optionsMonthly += opt.monthlyRatePerVehicle * vehicleCount;

        // Setup fee: special promotion for GPS 4G (free setup if 5+ vehicles)
        if (opt.id === 'gps-4g' && vehicleCount >= 5) {
          setupFeeTotal += 0;
        } else {
          setupFeeTotal += opt.setupFeePerVehicle * vehicleCount;
        }
      }
    });

    const grossMonthly = packMonthly + optionsMonthly;

    // Commitment discounts: 3 months = 5%, 6 months = 10%, 12 months = 15%
    let discountPct = 0;
    if (durationMonths >= 12) discountPct = 15;
    else if (durationMonths >= 6) discountPct = 10;
    else if (durationMonths >= 3) discountPct = 5;

    const discountAmount = Math.round((grossMonthly * discountPct) / 100);
    const netMonthly = grossMonthly - discountAmount;
    const grandTotalProjected = netMonthly * durationMonths + setupFeeTotal;
    const avgPerVeh = vehicleCount > 0 ? Math.round(netMonthly / vehicleCount) : 0;

    return {
      selectedPack: currentPack,
      selectedOptionIds,
      vehicleCount,
      durationMonths,
      packMonthlyPrice: packMonthly,
      optionsMonthlyPrice: optionsMonthly,
      grossMonthlyPrice: grossMonthly,
      discountPercent: discountPct,
      discountAmount,
      netMonthlyPrice: netMonthly,
      setupFeeTotal,
      grandTotalProjected,
      averageMonthlyPerVehicle: avgPerVeh
    };
  }, [currentPack, selectedOptions, vehicleCount, durationMonths, selectedOptionIds]);

  // Toggle option selection
  const toggleOption = (id: string) => {
    setSelectedOptionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Select all tech options
  const selectAllOptions = () => {
    setSelectedOptionIds(MODULAR_TECH_OPTIONS.map((o) => o.id));
  };

  // Clear all options
  const clearOptions = () => {
    setSelectedOptionIds([]);
  };

  // Pre-configured packs shortcuts
  const applyPreset = (preset: 'standard' | 'security' | 'complete') => {
    if (preset === 'standard') {
      setSelectedPackId('business');
      setSelectedOptionIds(['gps-4g']);
    } else if (preset === 'security') {
      setSelectedPackId('pro');
      setSelectedOptionIds(['gps-4g', 'coupure-moteur', 'sonde-carburant']);
    } else if (preset === 'complete') {
      setSelectedPackId('entreprise');
      setSelectedOptionIds([
        'gps-4g',
        'coupure-moteur',
        'sonde-carburant',
        'dashcam-ia',
        'badge-rfid',
        'vehicule-relais'
      ]);
    }
  };

  // Generate WhatsApp text
  const getWhatsAppMessage = () => {
    const packName = currentPack ? currentPack.name : 'Options à la carte uniquement (Sans pack)';
    const optionsNames =
      selectedOptions.length > 0
        ? selectedOptions.map((o) => `• ${o.name}`).join('\n')
        : 'Aucune option additionnelle';

    const text = `*DEMANDE DE DEVIS — OFFRE MODULAIRE JMF MOBILITY*
━━━━━━━━━━━━━━━━━━━━━━━━━━
• *Pack d'accompagnement :* ${packName}
• *Taille de la flotte :* ${vehicleCount} véhicule(s)
• *Durée d'engagement :* ${durationMonths} mois (${summary.discountPercent}% de remise)

*OPTIONS TECHNOLOGIQUES SÉLECTIONNÉES :*
${optionsNames}

*RÉCAPITULATIF FINANCIER ESTIMATIF :*
• Forfait Pack : ${summary.packMonthlyPrice.toLocaleString('fr-FR')} Francs / mois
• Options à la carte : ${summary.optionsMonthlyPrice.toLocaleString('fr-FR')} Francs / mois
• Remise engagement : -${summary.discountAmount.toLocaleString('fr-FR')} Francs / mois
• *Total mensuel net :* ${summary.netMonthlyPrice.toLocaleString('fr-FR')} Francs / mois
• *Frais de mise en service :* ${summary.setupFeeTotal.toLocaleString('fr-FR')} Francs (unique)
• *Coût moyen par véhicule :* ${summary.averageMonthlyPerVehicle.toLocaleString('fr-FR')} Francs / mois

Merci de me recontacter pour finaliser la proposition personnalisée.`;

    return encodeURIComponent(text);
  };

  // Download PDF summary
  const downloadSummaryPdf = () => {
    try {
      const doc = new jsPDF();
      const ref = `DEV-MOD-${Date.now().toString().slice(-6)}`;

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('JMF MOBILITY SERVICES', 14, 16);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Gestion de Flotte 360° & Solutions Technologiques Mobilité', 14, 23);
      doc.text('Hub Mobilité Afrique | WhatsApp : +229 01 97 83 21 21 / +33 6 50 05 91 61', 14, 29);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`RÉF : ${ref}`, 150, 16);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 150, 22);
      doc.text('Validité : 30 jours', 150, 28);

      // Title
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text("DEVIS MODULAIRE — PACKS D'ACCOMPAGNEMENT & OPTIONS TECH", 14, 48);

      // Section 1: Flotte & Paramètres
      doc.setFillColor(241, 245, 249);
      doc.rect(14, 53, 182, 22, 'F');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`Taille de la flotte : ${vehicleCount} véhicule(s)`, 20, 61);
      doc.text(
        `Formule de base : ${currentPack ? currentPack.name : 'À la carte uniquement (Sans pack)'}`,
        20,
        68
      );
      doc.text(`Engagement : ${durationMonths} mois`, 120, 61);
      doc.text(`Remise appliquée : ${summary.discountPercent}%`, 120, 68);

      // Section 2: Tableau des composantes
      let y = 84;
      doc.setFillColor(13, 148, 136); // teal-600
      doc.rect(14, y, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Composante / Service', 18, y + 5.5);
      doc.text('Qté', 115, y + 5.5);
      doc.text('Tarif Mensuel', 135, y + 5.5);
      doc.text('Frais Initiaux', 170, y + 5.5);

      y += 12;
      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'normal');

      // Pack row
      if (currentPack) {
        doc.setFont('helvetica', 'bold');
        doc.text(currentPack.name, 18, y);
        doc.setFont('helvetica', 'normal');
        doc.text('Forfait', 115, y);
        doc.text(`${currentPack.monthlyPrice.toLocaleString('fr-FR')} F`, 135, y);
        doc.text(`${currentPack.setupFee.toLocaleString('fr-FR')} F`, 170, y);
        y += 8;
      }

      // Options rows
      selectedOptions.forEach((opt) => {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFont('helvetica', 'bold');
        doc.text(opt.name.length > 40 ? opt.name.substring(0, 38) + '...' : opt.name, 18, y);
        doc.setFont('helvetica', 'normal');

        const optQty = opt.isFlatRate ? '1 sess.' : `${vehicleCount} véh.`;
        const optMonthly = opt.isFlatRate
          ? '0 F'
          : `${(opt.monthlyRatePerVehicle * vehicleCount).toLocaleString('fr-FR')} F`;
        const optSetup =
          opt.id === 'gps-4g' && vehicleCount >= 5
            ? 'Inclus (0 F)'
            : `${(opt.setupFeePerVehicle * (opt.isFlatRate ? 1 : vehicleCount)).toLocaleString(
                'fr-FR'
              )} F`;

        doc.text(optQty, 115, y);
        doc.text(optMonthly, 135, y);
        doc.text(optSetup, 170, y);
        y += 7;
      });

      // Total Box
      y += 8;
      doc.setDrawColor(203, 213, 225);
      doc.line(14, y, 196, y);
      y += 8;

      doc.setFont('helvetica', 'normal');
      doc.text('Sous-total mensuel brut :', 110, y);
      doc.text(`${summary.grossMonthlyPrice.toLocaleString('fr-FR')} Francs`, 165, y);
      y += 6;

      if (summary.discountPercent > 0) {
        doc.setTextColor(16, 185, 129);
        doc.text(`Remise engagement (-${summary.discountPercent}%) :`, 110, y);
        doc.text(`-${summary.discountAmount.toLocaleString('fr-FR')} Francs`, 165, y);
        y += 6;
        doc.setTextColor(30, 41, 59);
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('TOTAL MENSUEL RÉCURRENT :', 95, y + 2);
      doc.setTextColor(13, 148, 136);
      doc.text(`${summary.netMonthlyPrice.toLocaleString('fr-FR')} Francs / mois`, 155, y + 2);
      y += 9;

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Frais de mise en service (unique) :', 110, y);
      doc.text(`${summary.setupFeeTotal.toLocaleString('fr-FR')} Francs`, 165, y);
      y += 6;

      doc.text('Coût moyen unitaire par véhicule :', 110, y);
      doc.text(`${summary.averageMonthlyPerVehicle.toLocaleString('fr-FR')} Francs / mois`, 165, y);
      y += 6;

      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL PROJETÉ (${durationMonths} MOIS) :`, 100, y + 2);
      doc.text(`${summary.grandTotalProjected.toLocaleString('fr-FR')} Francs`, 160, y + 2);

      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Ce document est une simulation indicative. Les tarifs définitifs sont confirmés lors de la signature contractuelle.',
        14,
        280
      );
      doc.text('JMF Mobility Services - Solutions de Mobilité', 14, 285);

      doc.save(`Devis-Modulaire-JMF-${ref}.pdf`);
    } catch (e) {
      console.error('Erreur génération PDF:', e);
    }
  };

  // Render icon helper
  const renderOptionIcon = (iconName: string) => {
    switch (iconName) {
      case 'radio':
        return <Radio className="w-5 h-5" />;
      case 'cpu':
        return <Cpu className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'key':
        return <Key className="w-5 h-5" />;
      case 'users':
        return <Users className="w-5 h-5" />;
      case 'warehouse':
        return <Warehouse className="w-5 h-5" />;
      case 'car':
        return <Car className="w-5 h-5" />;
      case 'shield':
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  // Filtered tech options
  const filteredOptions = useMemo(() => {
    if (activeCategory === 'ALL') return MODULAR_TECH_OPTIONS;
    return MODULAR_TECH_OPTIONS.filter((o) => o.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              SÉLECTEUR MODULAIRE D'OFFRES 360°
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Combinez Packs d'Accompagnement & Options Technologiques
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Composez en temps réel la formule sur-mesure pour votre entreprise. Choisissez votre
              pack forfaitaire de gestion ou sélectionnez directement vos options technologiques à la carte
              avec récapitulatif financier instantané.
            </p>
          </div>

          {/* Quick Presets Buttons */}
          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-3 border border-slate-700/80 flex flex-col gap-2 shrink-0">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Configurations recommandées :
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
              >
                Standard (Business + GPS)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('security')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-600/80 hover:bg-teal-600 text-white transition-colors cursor-pointer"
              >
                Sécurité (Pro + GPS + Coupure + Sonde)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('complete')}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
              >
                Intégrale 360°
              </button>
            </div>
          </div>
        </div>

        {/* Global Controls: Fleet Size & Commitment */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. Fleet Size Slider */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-teal-400" />
                Taille du parc à équiper :
              </span>
              <span className="font-mono text-sm font-black text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-500/30">
                {vehicleCount} véhicule{vehicleCount > 1 ? 's' : ''}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={vehicleCount}
              onChange={(e) => setVehicleCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 véh.</span>
              <span className="text-sky-300 font-semibold">10</span>
              <span className="text-indigo-300 font-semibold">25</span>
              <span className="text-purple-300 font-semibold">50</span>
              <span>100+</span>
            </div>
          </div>

          {/* 2. Commitment duration */}
          <div className="bg-slate-800/60 rounded-xl p-3.5 border border-slate-700/60 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <BadgePercent className="w-4 h-4 text-emerald-400" />
                Durée d'engagement :
              </span>
              <span className="text-[11px] font-bold text-emerald-300">
                {summary.discountPercent > 0 ? `-${summary.discountPercent}% appliquée` : 'Sans engagement'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[
                { months: 1, label: '1 mois', discount: '0%' },
                { months: 3, label: '3 mois', discount: '-5%' },
                { months: 6, label: '6 mois', discount: '-10%' },
                { months: 12, label: '1 an', discount: '-15%' }
              ].map((dur) => (
                <button
                  key={dur.months}
                  type="button"
                  onClick={() => setDurationMonths(dur.months)}
                  className={`py-1.5 px-1 rounded-lg text-center text-xs font-bold transition-all cursor-pointer ${
                    durationMonths === dur.months
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-slate-700/60 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div>{dur.label}</div>
                  <div className="text-[9px] opacity-80">{dur.discount}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Live Metrics Flash */}
          <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="text-[10px] uppercase font-bold text-teal-300">Total Mensuel Estimé</div>
              <div className="text-xl sm:text-2xl font-black text-white font-mono">
                {summary.netMonthlyPrice.toLocaleString('fr-FR')}{' '}
                <span className="text-xs font-normal text-teal-200">Francs/m</span>
              </div>
              <div className="text-[10px] text-slate-300">
                Soit ~{summary.averageMonthlyPerVehicle.toLocaleString('fr-FR')} Francs/véhicule/mois
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-md shrink-0"
            >
              <span>Valider</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Configurator (Left) + Real-Time Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Packs & Tech Options */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          {/* STEP 1: PACKS D'ACCOMPAGNEMENT FORFAITAIRES */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Packs d'Accompagnement Forfaitaires
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Formule socle de supervision mensuelle de votre flotte (ou choisissez "Options à la carte seules").
                </p>
              </div>

              {/* Recommended Pack indicator */}
              <div className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-indigo-600" />
                Conseillé pour {vehicleCount} véh. :{' '}
                <span className="font-bold text-indigo-700 capitalize">
                  {recommendedPackForCount}
                </span>
              </div>
            </div>

            {/* Standalone Choice (No Pack) */}
            <div
              onClick={() => setSelectedPackId('none')}
              className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-4 ${
                selectedPackId === 'none'
                  ? 'border-teal-600 bg-teal-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPackId === 'none'
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {selectedPackId === 'none' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                    <span>Aucun Pack Forfaitaire (À la carte uniquement)</span>
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-semibold">
                      0 Francs / mois
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Idéal si vous souhaitez uniquement équiper vos véhicules d'options technologiques (GPS, Coupure, Sonde...) sans contrat d'accompagnement global.
                  </p>
                </div>
              </div>
            </div>

            {/* Grid of Official Packs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {modularPacksList.map((pack) => {
                const isSelected = selectedPackId === pack.id;
                const isRecommended = recommendedPackForCount === pack.id;

                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPackId(pack.id)}
                    className={`relative rounded-xl border-2 p-4 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-600'
                        : 'border-slate-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    {/* Top Badges */}
                    <div className="flex items-start justify-between gap-2 mb-2 min-h-[38px]">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-slate-900">{pack.name}</span>
                          {pack.isPopular && (
                            <span className="text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.2 rounded-md">
                              Populaire
                            </span>
                          )}
                          {isRecommended && (
                            <span className="text-[9px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-md">
                              Adapté ({pack.recommendedFleet})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {pack.recommendedFleet}
                        </div>
                      </div>

                      {/* Radio Circle */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Price Tag */}
                    <div className="my-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-baseline justify-between min-h-[58px]">
                      <div>
                        <div className="text-base font-black text-indigo-700 font-mono">
                          {pack.monthlyPrice.toLocaleString('fr-FR')}{' '}
                          <span className="text-xs font-medium text-slate-600">Francs/mois</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Frais mise en service : {pack.setupFee.toLocaleString('fr-FR')} Francs
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        Forfait fixe
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3 h-[32px]">
                      {pack.tagline}
                    </p>

                    {/* Services Included */}
                    <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      {pack.includedServices.slice(0, 3).map((serv, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{serv}</span>
                        </div>
                      ))}
                      {pack.includedServices.length > 3 && (
                        <div className="text-[10px] text-indigo-600 font-semibold pl-4">
                          + {pack.includedServices.length - 3} autres services inclus
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: OPTIONS TECHNOLOGIQUES & SERVICES À LA CARTE */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Options Technologiques à la Carte
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1 pl-8">
                  Activez ou désactivez les équipements et services selon vos besoins réels.
                </p>
              </div>

              {/* Multi-select helpers */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={selectAllOptions}
                  className="px-2.5 py-1 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                >
                  Tout cocher
                </button>
                <button
                  type="button"
                  onClick={clearOptions}
                  className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Tout effacer
                </button>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'ALL', label: 'Toutes les options (8)' },
                { id: 'Télématique & IoT', label: 'Télématique & IoT' },
                { id: 'Sécurité & Contrôle', label: 'Sécurité & Contrôle' },
                { id: 'Chauffeurs & RH', label: 'Chauffeurs & RH' },
                { id: 'Continuité & Logistique', label: 'Continuité & Logistique' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of Tech Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredOptions.map((opt) => {
                const isChecked = selectedOptionIds.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    className={`rounded-xl border-2 p-4 transition-all cursor-pointer flex flex-col justify-between ${
                      isChecked
                        ? 'border-teal-600 bg-teal-50/30 shadow-xs ring-1 ring-teal-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      {/* Header with Icon, Title and Checkbox */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isChecked
                                ? 'bg-teal-600 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {renderOptionIcon(opt.iconName)}
                          </div>
                          <div>
                            <div className="text-xs font-black text-slate-900 leading-tight">
                              {opt.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">
                              {opt.category}
                            </div>
                          </div>
                        </div>

                        {/* Checkbox button */}
                        <div
                          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'border-teal-600 bg-teal-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-slate-600 leading-relaxed my-2">
                        {opt.description}
                      </p>
                    </div>

                    {/* Pricing Pill */}
                    <div className="pt-2 border-t border-slate-100/80 mt-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div>
                          {opt.isFlatRate ? (
                            <span className="font-bold text-slate-800">
                              {opt.flatLabel || `${opt.setupFeePerVehicle.toLocaleString('fr-FR')} F / session`}
                            </span>
                          ) : (
                            <span className="font-black text-teal-700">
                              {opt.monthlyRatePerVehicle.toLocaleString('fr-FR')} F
                              <span className="text-[10px] font-normal text-slate-500"> / véh. / mois</span>
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-semibold text-slate-500">
                          Pose :{' '}
                          {opt.id === 'gps-4g' && vehicleCount >= 5
                            ? 'Offerte'
                            : opt.setupFeePerVehicle > 0
                            ? `${opt.setupFeePerVehicle.toLocaleString('fr-FR')} F`
                            : 'Inclus'}
                        </span>
                      </div>

                      {/* Total for this option based on vehicleCount */}
                      {isChecked && !opt.isFlatRate && (
                        <div className="mt-1.5 text-[10px] text-teal-800 bg-teal-100/70 font-semibold px-2 py-0.5 rounded flex justify-between">
                          <span>Sous-total option ({vehicleCount} véh.) :</span>
                          <span className="font-mono font-bold">
                            {(opt.monthlyRatePerVehicle * vehicleCount).toLocaleString('fr-FR')} Francs/m
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Real-Time Total Cost Summary (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-6 space-y-4">
          <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg p-5 sm:p-6 space-y-5">
            {/* Header */}
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Récapitulatif en Temps Réel
                </h3>
              </div>
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                Mise à jour en direct
              </span>
            </div>

            {/* Selected Pack Summary */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Formule Socle d'Accompagnement
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800">
                  {currentPack ? currentPack.name : 'Options seules (Sans pack)'}
                </span>
                <span className="font-mono text-xs font-bold text-indigo-700">
                  {summary.packMonthlyPrice.toLocaleString('fr-FR')} Francs/m
                </span>
              </div>
              {currentPack && (
                <div className="text-[10px] text-slate-500">
                  Frais paramétrage : {currentPack.setupFee.toLocaleString('fr-FR')} Francs
                </div>
              )}
            </div>

            {/* Options Breakdown List */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>Options technologiques ({selectedOptions.length}) :</span>
                <span className="font-mono text-slate-700">
                  {summary.optionsMonthlyPrice.toLocaleString('fr-FR')} Francs/m
                </span>
              </div>

              {selectedOptions.length === 0 ? (
                <div className="p-3 rounded-lg border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                  Aucune option sélectionnée
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {selectedOptions.map((opt) => (
                    <div
                      key={opt.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <button
                          type="button"
                          onClick={() => toggleOption(opt.id)}
                          className="text-slate-400 hover:text-red-500 cursor-pointer"
                          title="Supprimer l'option"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-semibold text-slate-800 truncate">{opt.shortName}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-700 text-[10px]">
                        {opt.isFlatRate
                          ? 'Session'
                          : `${(opt.monthlyRatePerVehicle * vehicleCount).toLocaleString('fr-FR')} F/m`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Financial Calculation */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Sous-total mensuel brut :</span>
                <span className="font-mono font-bold">
                  {summary.grossMonthlyPrice.toLocaleString('fr-FR')} Francs
                </span>
              </div>

              {summary.discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Remise engagement ({summary.discountPercent}%) :</span>
                  <span className="font-mono">
                    -{summary.discountAmount.toLocaleString('fr-FR')} Francs
                  </span>
                </div>
              )}

              {/* NET MONTHLY TOTAL */}
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-1">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Total Mensuel Récurrent :
                  </span>
                  <span className="text-xl font-black font-mono text-teal-300">
                    {summary.netMonthlyPrice.toLocaleString('fr-FR')}{' '}
                    <span className="text-xs font-normal text-white">Francs</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-300 flex justify-between">
                  <span>Ramené par véhicule :</span>
                  <span className="font-mono font-bold text-emerald-300">
                    ~{summary.averageMonthlyPerVehicle.toLocaleString('fr-FR')} Francs / véh. / mois
                  </span>
                </div>
              </div>

              {/* SETUP / ONE OFF FEES */}
              <div className="flex justify-between text-slate-600 pt-1">
                <span className="text-[11px]">Frais initiaux (mise en service & pose) :</span>
                <span className="font-mono font-bold text-[11px] text-slate-900">
                  {summary.setupFeeTotal.toLocaleString('fr-FR')} Francs
                </span>
              </div>

              {/* PROJECTED CONTRACT SUM */}
              <div className="flex justify-between text-slate-500 text-[10px] pt-1">
                <span>Projection totale ({durationMonths} mois d'engagement) :</span>
                <span className="font-mono font-semibold text-slate-700">
                  {summary.grandTotalProjected.toLocaleString('fr-FR')} Francs
                </span>
              </div>
            </div>

            {/* Direct Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(true)}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <FileText className="w-4 h-4" />
                <span>Demander ce Devis Officiel</span>
              </button>

              <a
                href={`https://wa.me/2290197832121?text=${getWhatsAppMessage()}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Transmettre sur WhatsApp (+229)</span>
              </a>

              <button
                type="button"
                onClick={downloadSummaryPdf}
                className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Télécharger la simulation en PDF</span>
              </button>

              {onApplyToBooking && (
                <button
                  type="button"
                  onClick={() => onApplyToBooking(summary)}
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-indigo-200"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>Associer à ma réservation de véhicule</span>
                </button>
              )}
            </div>

            {/* Support Notice */}
            <div className="text-[10px] text-slate-400 text-center leading-relaxed">
              Besoin d'un audit physique gratuit de votre parc avant souscription ?
              <br />
              Contactez le responsable flotte :{' '}
              <a href="tel:+2290197832121" className="text-teal-600 font-bold hover:underline">
                +229 01 97 83 21 21
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Confirmation Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-black text-slate-900">
                  Demande de Devis — Formule Modulaire
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {quoteSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-black text-slate-900">Votre devis a été préparé avec succès !</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Un conseiller JMF Mobility vous contactera sous 2 heures avec la proposition contractuelle complète.
                  </p>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button
                    type="button"
                    onClick={downloadSummaryPdf}
                    className="px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-500 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le PDF</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setQuoteSuccess(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuoteSuccess(true);
                  if (onQuoteRequested) onQuoteRequested(summary);
                }}
                className="space-y-4"
              >
                {/* Summary reminder in modal */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Pack : {currentPack ? currentPack.name : 'Options seules'}</span>
                    <span className="text-teal-700 font-mono">
                      {summary.netMonthlyPrice.toLocaleString('fr-FR')} Francs/mois
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {vehicleCount} véhicule(s) • {selectedOptions.length} option(s) tech •{' '}
                    {durationMonths} mois
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du contact *</label>
                    <input
                      type="text"
                      required
                      value={clientForm.name}
                      onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                      placeholder="M. / Mme Nom & Prénom"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Entreprise / Organisation</label>
                    <input
                      type="text"
                      value={clientForm.company}
                      onChange={(e) => setClientForm({ ...clientForm, company: e.target.value })}
                      placeholder="Nom de la société"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      placeholder="+229 01 XX XX XX XX"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email professionnel</label>
                    <input
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      placeholder="contact@entreprise.bj"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">Remarques ou exigences spécifiques</label>
                  <textarea
                    rows={2}
                    value={clientForm.notes}
                    onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                    placeholder="Types de véhicules, implantation géographique, calendrier d'installation souhaité..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsQuoteModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-md"
                  >
                    Envoyer ma demande de devis
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
