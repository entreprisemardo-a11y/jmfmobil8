import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Car,
  Key,
  Calendar,
  Clock,
  MapPin,
  Shield,
  ShieldCheck,
  User,
  Users,
  CheckCircle2,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Phone,
  MessageSquare,
  FileText,
  Fuel,
  Gauge,
  SlidersHorizontal,
  X,
  Check,
  Building2,
  Download,
  AlertCircle,
  ExternalLink,
  Maximize2,
  Globe,
  LayoutDashboard,
  Printer,
  Share2,
  CreditCard,
  HelpCircle,
  Info,
  Briefcase,
  Wifi,
  Baby,
  FileCheck,
  BadgePercent,
  ThumbsUp,
  Star,
  Award,
  ChevronDown,
  Mail,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';
import { pricingService, RentalVehiclePricing } from '../../services/pricingService.js';
import { RentalAdminDashboardView } from '../admin/RentalAdminDashboardView.js';
import { generateRentalQuotePdf } from '../../utils/pdfRentalQuoteGenerator.js';
import { ModularOfferSelector, ModularSummary } from './ModularOfferSelector.js';
import { CurrencySelector } from '../common/CurrencySelector.js';
import { useCurrency } from '../../services/currencyService.js';

export interface RentalVehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'CITADINE' | 'BERLINE' | 'SUV_4X4' | 'PICKUP' | 'MINIBUS' | 'PRESTIGE';
  transmission: 'Automatique' | 'Manuelle';
  fuelType: 'Essence' | 'Diesel' | 'Hybride';
  seats: number;
  doors: number;
  luggageCapacity: string;
  airConditioning: boolean;
  dailyRateFcfa: number;
  weeklyRateFcfa: number;
  monthlyRateFcfa: number;
  depositFcfa: number;
  withDriverAvailable: boolean;
  driverDailyFeeFcfa: number;
  isAvailable: boolean;
  currentLocation: string;
  plateNumber: string;
  mileageKm: number;
  consumptionPer100Km: string;
  rating: number;
  reviewsCount: number;
  features: string[];
  includedServices: string[];
  imageUrl: string;
  galleryUrls?: string[];
}

export interface RentalBooking {
  id: string;
  reference: string;
  vehicleId: string;
  vehicleName: string;
  vehicleCategory: string;
  plateNumber: string;
  clientName: string;
  clientType: 'PARTICULIER' | 'ENTREPRISE';
  companyName?: string;
  companyIfu?: string;
  clientPhone: string;
  clientEmail: string;
  driverLicenseNumber?: string;
  flightNumber?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  daysCount: number;
  withDriver: boolean;
  driverName?: string;
  pickupLocation: string;
  returnLocation: string;
  optionsSelected: string[];
  baseDailyRateFcfa: number;
  vehicleCostFcfa: number;
  driverCostFcfa: number;
  optionsCostFcfa: number;
  discountFcfa: number;
  penaltyDays?: number;
  penaltyDailyRateFcfa?: number;
  totalPenaltyFcfa?: number;
  overstayAcknowledged?: boolean;
  totalAmountFcfa: number;
  depositFcfa: number;
  paymentMethod: 'MOMO' | 'CARD' | 'TRANSFER' | 'AGENCY';
  status: 'CONFIRMÉE' | 'EN_COURS' | 'TERMINÉE' | 'EN_ATTENTE_ACOMPTE';
  createdAt: string;
  notes?: string;
}

const MOCK_RENTAL_FLEET: RentalVehicle[] = [
  {
    id: 'rent_veh_1',
    brand: 'Suzuki',
    model: 'Swift GLX Dualjet',
    year: 2024,
    category: 'CITADINE',
    transmission: 'Automatique',
    fuelType: 'Essence',
    seats: 5,
    doors: 5,
    luggageCapacity: '2 valises moyennes + 1 sac',
    airConditioning: true,
    dailyRateFcfa: 25000,
    weeklyRateFcfa: 155000,
    monthlyRateFcfa: 550000,
    depositFcfa: 100000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 12000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
    plateNumber: 'BJ-4589-RB',
    mileageKm: 18400,
    consumptionPer100Km: '5.2 L / 100 km',
    rating: 4.9,
    reviewsCount: 38,
    features: [
      'Climatisation A/C renforcée grand chaud',
      'Écran tactile 7" avec Apple CarPlay & Android Auto',
      'Caméra de recul & radars de stationnement',
      'Direction assistée ultra maniable en ville',
      'Double port USB & Bluetooth mains libres',
    ],
    includedServices: [
      'Assurance tous risques (Franchise tiers 0 FCFA)',
      'Assistance dépannage 24/7 en zone urbaine et corridors',
      'Kilométrage 250 km / jour inclus',
      'Véhicule relais garanti sous 2h',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_2',
    brand: 'Toyota',
    model: 'Yaris Cross Hybride E-Four',
    year: 2023,
    category: 'CITADINE',
    transmission: 'Automatique',
    fuelType: 'Hybride',
    seats: 5,
    doors: 5,
    luggageCapacity: '3 valises moyennes',
    airConditioning: true,
    dailyRateFcfa: 35000,
    weeklyRateFcfa: 215000,
    monthlyRateFcfa: 750000,
    depositFcfa: 120000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 12000,
    isAvailable: true,
    currentLocation: 'Aéroport International (Accueil VIP)',
    plateNumber: 'BJ-8891-RB',
    mileageKm: 24500,
    consumptionPer100Km: '4.4 L / 100 km (Éco)',
    rating: 4.8,
    reviewsCount: 46,
    features: [
      'Garde au sol surélevée idéale voiries urbaines',
      'Technologie Hybride Toyota auto-rechargeable',
      'Cockpit digital 9" avec GPS Afrique & Cartographie pré-chargée',
      'Freinage automatique d’urgence & régulateur adaptatif',
      'Démarrage sans clé Smart Entry & Push Start',
    ],
    includedServices: [
      'Accueil personnalisé avec pancarte nominative à l\'arrivée',
      'Assurance tous risques conducteur et passagers',
      'Assistance panne & crevaison 24h/24',
      'Kit de secours & extincteur certifié',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_3',
    brand: 'Toyota',
    model: 'Corolla Prestige Executive',
    year: 2023,
    category: 'BERLINE',
    transmission: 'Automatique',
    fuelType: 'Essence',
    seats: 5,
    doors: 4,
    luggageCapacity: '4 grandes valises (coffre 471L)',
    airConditioning: true,
    dailyRateFcfa: 45000,
    weeklyRateFcfa: 275000,
    monthlyRateFcfa: 950000,
    depositFcfa: 150000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
    plateNumber: 'BJ-3304-RB',
    mileageKm: 31200,
    consumptionPer100Km: '6.5 L / 100 km',
    rating: 4.9,
    reviewsCount: 54,
    features: [
      'Sellerie cuir noir grand confort & insonorisation acoustique',
      'Climatisation automatique bizone avec aérateurs arrière',
      'Volume de coffre très généreux pour valises de voyage',
      'Suspension prévenante sur chaussée dégradée',
      'Éclairage Full LED & vitres teintées anti-chaleur',
    ],
    includedServices: [
      'Assurance tous risques tous déplacements professionnels',
      'Plein d’essence au départ (politique plein/plein)',
      'Assistance géolocalisée 24/7 par balise connectée',
      'Facturation déductible avec IFU entreprise',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_4',
    brand: 'Toyota',
    model: 'Land Cruiser Prado TX-L V6',
    year: 2024,
    category: 'SUV_4X4',
    transmission: 'Automatique',
    fuelType: 'Diesel',
    seats: 7,
    doors: 5,
    luggageCapacity: '5 valises + modularité 7 places',
    airConditioning: true,
    dailyRateFcfa: 85000,
    weeklyRateFcfa: 520000,
    monthlyRateFcfa: 1850000,
    depositFcfa: 250000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Hub Affaires VIP',
    plateNumber: 'BJ-1122-PT',
    mileageKm: 29400,
    consumptionPer100Km: '9.8 L / 100 km',
    rating: 5.0,
    reviewsCount: 72,
    features: [
      'Véritable 4x4 permanent avec boîte de transfert & blocage',
      '7 vraies places spacieuses en cuir haute qualité',
      'Double réservoir carburant grande autonomie 150L',
      'Climatisation tri-zone avec commandes aux 3 rangées',
      'Suspension renforcée tout-terrain pistes et corridors',
    ],
    includedServices: [
      'Autorisation de circulation corridors régionaux et transfrontaliers',
      'Assurance tous risques Premium 0 franchise',
      'Chauffeur de haute expérience certifié missions officielles',
      'Suivi télématique par satellite en direct',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_5',
    brand: 'Hyundai',
    model: 'Tucson N-Line Executive',
    year: 2023,
    category: 'SUV_4X4',
    transmission: 'Automatique',
    fuelType: 'Essence',
    seats: 5,
    doors: 5,
    luggageCapacity: '4 valises moyennes',
    airConditioning: true,
    dailyRateFcfa: 55000,
    weeklyRateFcfa: 340000,
    monthlyRateFcfa: 1190000,
    depositFcfa: 180000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
    plateNumber: 'BJ-3344-PT',
    mileageKm: 14750,
    consumptionPer100Km: '7.4 L / 100 km',
    rating: 4.8,
    reviewsCount: 29,
    features: [
      'Design futuriste avec signature lumineuse LED paramétrique',
      'Cockpit 100% numérique 10.25" & son surround haut de gamme',
      'Toit panoramique ouvrant avec velum électrique',
      'Caméras de vision 360° pour stationnement aisé',
      'Système de surveillance des angles morts sur écran',
    ],
    includedServices: [
      'Assurance complète tous risques JMF Mobility',
      'Mise à disposition avec câble de recharge smartphone multi-embouts',
      'Assistance rapide 24/7 en zone urbaine et corridors',
      'Option restitution à l’aéroport sans surcoût',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_6',
    brand: 'Toyota',
    model: 'Hilux Double Cabine 4x4 Heavy Duty',
    year: 2023,
    category: 'PICKUP',
    transmission: 'Manuelle',
    fuelType: 'Diesel',
    seats: 5,
    doors: 4,
    luggageCapacity: 'Benne protégée grande capacité 1 000 kg',
    airConditioning: true,
    dailyRateFcfa: 65000,
    weeklyRateFcfa: 390000,
    monthlyRateFcfa: 1390000,
    depositFcfa: 200000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Hub Régional & Corridors',
    plateNumber: 'BJ-7762-RB',
    mileageKm: 42100,
    consumptionPer100Km: '8.6 L / 100 km',
    rating: 4.9,
    reviewsCount: 39,
    features: [
      'Transmission 4x4 enclenchable avec blocage de différentiel',
      'Arceau de sécurité inox & bac de benne renforcé anti-rayures',
      'Pneus All-Terrain renforcés anti-crevaison',
      'Snorkel et filtre à air cyclonique spécial poussières',
      'Climatisation tropicalisée haute capacité',
    ],
    includedServices: [
      'Parfait pour missions de terrain, chantiers BTP, mines & carrières',
      'Balise 4G temps réel avec alertes zones et chocs',
      'Atelier mobile et pièce détachée de secours pré-positionnée',
      'Assurance tout-terrain professionnelle',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_7',
    brand: 'Toyota',
    model: 'HiAce VIP Minibus 15 Places',
    year: 2024,
    category: 'MINIBUS',
    transmission: 'Manuelle',
    fuelType: 'Diesel',
    seats: 15,
    doors: 4,
    luggageCapacity: 'Compartiment bagages grand volume',
    airConditioning: true,
    dailyRateFcfa: 95000,
    weeklyRateFcfa: 580000,
    monthlyRateFcfa: 2100000,
    depositFcfa: 200000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 0, // Chauffeur pro déjà inclus dans le tarif
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
    plateNumber: 'BJ-5511-RB',
    mileageKm: 19800,
    consumptionPer100Km: '10.2 L / 100 km',
    rating: 4.9,
    reviewsCount: 31,
    features: [
      '15 sièges individuels confortables avec ceintures de sécurité 3 points',
      'Chauffeur professionnel JMF dédié et inclus dans la formule',
      'Double climatisation puissante avant et diffuseurs arrière',
      'Microphone guide et sonorisation complète pour séminaires',
      'Porte latérale à ouverture large avec marchepied escamotable',
    ],
    includedServices: [
      'Chauffeur certifié JMF inclus avec prise en charge de ses repas',
      'Assurance transport de personnes professionnelle illimitée',
      'Idéal délégations officielles, ONG, entreprises et cérémonies',
      'Prise en charge aéroport, transferts hôtels et excursions',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
  {
    id: 'rent_veh_8',
    brand: 'Mercedes-Benz',
    model: 'Classe E 200 Exclusive VIP',
    year: 2023,
    category: 'PRESTIGE',
    transmission: 'Automatique',
    fuelType: 'Essence',
    seats: 5,
    doors: 4,
    luggageCapacity: '3 grandes valises rigides',
    airConditioning: true,
    dailyRateFcfa: 120000,
    weeklyRateFcfa: 750000,
    monthlyRateFcfa: 2600000,
    depositFcfa: 350000,
    withDriverAvailable: true,
    driverDailyFeeFcfa: 0, // Chauffeur de maître inclus
    isAvailable: true,
    currentLocation: 'Hub Affaires VIP',
    plateNumber: 'BJ-9900-RB',
    mileageKm: 12300,
    consumptionPer100Km: '7.8 L / 100 km',
    rating: 5.0,
    reviewsCount: 24,
    features: [
      'Chauffeur protocolaire en tenue officielle JMF inclus',
      'Suspension pneumatique Airmatic au confort exceptionnel',
      'Sellerie cuir Nappa étendu & boiseries nobles',
      'Connexion Wi-Fi 4G embarquée & chargeurs induction rapides',
      'Bouteilles d’eau minérale fraîche & lingettes à bord',
    ],
    includedServices: [
      'Accueil tapis rouge avec pancarte personnalisée au salon VIP',
      'Service VIP discret et disponibilité chauffeur 12h/jour',
      'Assurance Tous Risques Prestige',
      'Idéal chefs d’entreprise, personnalités et mariages haut de gamme',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&fm=webp&w=720&q=75',
  },
];

const INITIAL_BOOKINGS: RentalBooking[] = [
  {
    id: 'book_1',
    reference: 'LOC-BJ-2026-0891',
    vehicleId: 'rent_veh_4',
    vehicleName: 'Toyota Land Cruiser Prado TX-L',
    vehicleCategory: 'SUV_4X4',
    plateNumber: 'BJ-1122-PT',
    clientName: 'Cabinet d’Audit Conseil Afrique',
    clientType: 'ENTREPRISE',
    companyName: 'Cabinet d’Audit Conseil Afrique SAS',
    companyIfu: '3202314589712',
    clientPhone: '+229 97 88 44 22',
    clientEmail: 'contact@audit-afrique.com',
    startDate: '2026-10-08',
    startTime: '08:30',
    endDate: '2026-10-12',
    endTime: '18:00',
    daysCount: 4,
    withDriver: true,
    driverName: 'Sébastien KPANOU (Certifié JMF)',
    pickupLocation: 'Aéroport International (Accueil VIP)',
    returnLocation: 'Aéroport International (Accueil VIP)',
    optionsSelected: ['Routeur Wi-Fi 4G nomade', 'Assurance Tous Risques 0 Franchise'],
    baseDailyRateFcfa: 85000,
    vehicleCostFcfa: 312800,
    driverCostFcfa: 60000,
    optionsCostFcfa: 20000,
    discountFcfa: 27200,
    totalAmountFcfa: 392800,
    depositFcfa: 250000,
    paymentMethod: 'TRANSFER',
    status: 'CONFIRMÉE',
    createdAt: '2026-10-06 14:20',
    notes: 'Vol international arrivée 19h15. Accueil VIP.',
  },
  {
    id: 'book_2',
    reference: 'LOC-BJ-2026-0885',
    vehicleId: 'rent_veh_3',
    vehicleName: 'Toyota Corolla Prestige Executive',
    vehicleCategory: 'BERLINE',
    plateNumber: 'BJ-3304-RB',
    clientName: 'Dr. Aimé TOSSOU',
    clientType: 'PARTICULIER',
    clientPhone: '+229 97 88 99 00',
    clientEmail: 'aime.tossou@gmail.com',
    driverLicenseNumber: 'BJ-2018-0914-PC',
    startDate: '2026-10-05',
    startTime: '09:00',
    endDate: '2026-10-09',
    endTime: '19:00',
    daysCount: 4,
    withDriver: false,
    pickupLocation: 'Agence Centrale & Hub Urbain',
    returnLocation: 'Agence Centrale & Hub Urbain',
    optionsSelected: ['Forfait Kilométrage Illimité'],
    baseDailyRateFcfa: 45000,
    vehicleCostFcfa: 165600,
    driverCostFcfa: 0,
    optionsCostFcfa: 40000,
    discountFcfa: 14400,
    totalAmountFcfa: 205600,
    depositFcfa: 150000,
    paymentMethod: 'MOMO',
    status: 'EN_COURS',
    createdAt: '2026-10-04 11:15',
  },
  {
    id: 'book_3',
    reference: 'LOC-BJ-2026-0870',
    vehicleId: 'rent_veh_6',
    vehicleName: 'Toyota Hilux Double Cabine 4x4',
    vehicleCategory: 'PICKUP',
    plateNumber: 'BJ-7762-RB',
    clientName: 'Consortium BTP & Mines',
    clientType: 'ENTREPRISE',
    companyName: 'Consortium BTP & Mines',
    companyIfu: '3202100874519',
    clientPhone: '+229 96 12 34 56',
    clientEmail: 'logistique@btp-afrique.com',
    startDate: '2026-09-20',
    startTime: '08:00',
    endDate: '2026-09-30',
    endTime: '18:00',
    daysCount: 10,
    withDriver: true,
    driverName: 'Koffi AGBOHOUN (Certifié JMF)',
    pickupLocation: 'Hub Régional & Corridors',
    returnLocation: 'Hub Régional & Corridors',
    optionsSelected: ['Kit Outillage Pistes & Dépannage'],
    baseDailyRateFcfa: 65000,
    vehicleCostFcfa: 552500,
    driverCostFcfa: 150000,
    optionsCostFcfa: 0,
    discountFcfa: 97500,
    totalAmountFcfa: 702500,
    depositFcfa: 200000,
    paymentMethod: 'AGENCY',
    status: 'TERMINÉE',
    createdAt: '2026-09-18 09:30',
  },
];

export interface RentalViewProps {
  onBackToDashboard?: () => void;
  onNavigateView?: (view: string) => void;
  isStandalone?: boolean;
  onOpenNewTab?: () => void;
  onToggleFullscreen?: () => void;
  onGoToPublicWebsite?: () => void;
}

export const RentalView: React.FC<RentalViewProps> = ({
  onBackToDashboard,
  onNavigateView,
  isStandalone = false,
  onOpenNewTab,
  onToggleFullscreen,
  onGoToPublicWebsite,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'catalogue' | 'modular_offers' | 'bookings' | 'simulator' | 'faq_terms' | 'admin_dashboard'>('catalogue');

  // Reactive Multi-Currency (USD, EUR, XOF)
  const { currencyCode, currency, format: formatCurrency } = useCurrency();

  // Filter States
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [transmissionFilter, setTransmissionFilter] = useState<string>('ALL');
  const [fuelFilter, setFuelFilter] = useState<string>('ALL');
  const [driverFilter, setDriverFilter] = useState<'ALL' | 'WITH_DRIVER' | 'WITHOUT_DRIVER'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'PRICE_ASC' | 'PRICE_DESC' | 'RATING' | 'POPULAR'>('POPULAR');

  // Modal & Selection States
  const [selectedVehicle, setSelectedVehicle] = useState<RentalVehicle | null>(null);
  const [detailVehicle, setDetailVehicle] = useState<RentalVehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingsList, setBookingsList] = useState<RentalBooking[]>(INITIAL_BOOKINGS);

  // Stepper Form States (1 = Dates & Prise en charge, 2 = Conduite & Options, 3 = Conducteur & Société, 4 = Devis & Règlement)
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Dates & Places & Services
  const [pickupPlace, setPickupPlace] = useState<string>('Agence Centrale & Hub Urbain');
  const [differentReturnPlace, setDifferentReturnPlace] = useState<boolean>(false);
  const [returnPlace, setReturnPlace] = useState<string>('Agence Centrale & Hub Urbain');
  const [startDate, setStartDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10)
  );
  const [endTime, setEndTime] = useState<string>('18:00');
  const [withDriverOption, setWithDriverOption] = useState<boolean>(true);
  const [overstayDays, setOverstayDays] = useState<number>(0);
  const [overstayPolicyAccepted, setOverstayPolicyAccepted] = useState<boolean>(true);

  // Step 1: Addon Options
  const [optBabySeat, setOptBabySeat] = useState<boolean>(false);
  const [optWifi, setOptWifi] = useState<boolean>(false);
  const [optUnlimitedKm, setOptUnlimitedKm] = useState<boolean>(false);
  const [optSecondDriver, setOptSecondDriver] = useState<boolean>(false);

  // Step 2: Client & Company Information
  const [clientType, setClientType] = useState<'PARTICULIER' | 'ENTREPRISE'>('PARTICULIER');
  const [clientName, setClientName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [companyIfu, setCompanyIfu] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+229 ');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState<string>('');
  const [flightNumber, setFlightNumber] = useState<string>('');
  const [specialNotes, setSpecialNotes] = useState<string>('');

  // Step 3: Payment & Terms
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'CARD' | 'TRANSFER' | 'AGENCY'>('MOMO');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);
  const [bookingSuccessBooking, setBookingSuccessBooking] = useState<RentalBooking | null>(null);

  // Dynamic calculation of days and delay from Arrival & Departure date and time
  const durationInfo = useMemo(() => {
    const start = new Date(`${startDate}T${startTime || '09:00'}`);
    const end = new Date(`${endDate}T${endTime || '18:00'}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const isDateValid = !isNaN(diffMs) && diffMs > 0;

    let baseDays = 1;
    let extraHours = 0;
    let gracePeriodExceeded = false;
    const graceHours = 2; // Franchise de tolérance contractuelle JMF de 2h

    if (isDateValid) {
      const fullDays = Math.floor(diffHours / 24);
      extraHours = Math.round((diffHours % 24) * 10) / 10;
      if (fullDays === 0) {
        baseDays = 1; // Facturation minimale 24h
      } else {
        if (extraHours > graceHours) {
          // Si le retour dépasse la tolérance de 2h, une journée additionnelle est facturée
          baseDays = fullDays + 1;
          gracePeriodExceeded = true;
        } else {
          baseDays = fullDays;
        }
      }
    }

    return {
      isDateValid,
      totalHours: Math.max(0, Math.round(diffHours * 10) / 10),
      baseDays: Math.max(1, baseDays),
      extraHours,
      gracePeriodExceeded,
      penaltyDays: Math.max(0, overstayDays),
    };
  }, [startDate, startTime, endDate, endTime, overstayDays]);

  const bookingDays = durationInfo.baseDays;

  // Handlers for Arrival & Departure dates
  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    const start = new Date(`${val}T${startTime}`).getTime();
    const end = new Date(`${endDate}T${endTime}`).getTime();
    if (end <= start) {
      const nextEnd = new Date(start + 3 * 86400000).toISOString().slice(0, 10);
      setEndDate(nextEnd);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
  };

  // Pricing calculation helper including daily rates, driver fee, options, and automatic penalty calculation
  const calculateDetailedEstimate = (
    vehicle: RentalVehicle,
    days: number,
    withDriver: boolean,
    opts: { babySeat: boolean; wifi: boolean; unlimitedKm: boolean; secondDriver: boolean },
    penaltiesDays: number = 0
  ) => {
    const baseDaily = vehicle.dailyRateFcfa;
    let discountPercent = 0;
    if (days >= 30) discountPercent = 25;
    else if (days >= 7) discountPercent = 15;
    else if (days >= 3) discountPercent = 8;

    const baseVehicleFull = baseDaily * days;
    const discountAmount = Math.round((baseVehicleFull * discountPercent) / 100);
    const discountedVehicleCost = baseVehicleFull - discountAmount;
    const discountedDailyRate = Math.round(discountedVehicleCost / days);

    // Chauffeur fee
    const driverCost = withDriver ? vehicle.driverDailyFeeFcfa * days : 0;

    // Addon options
    let optionsCost = 0;
    if (opts.babySeat) optionsCost += 3000 * days;
    if (opts.wifi) optionsCost += 5000 * days;
    if (opts.unlimitedKm) optionsCost += 10000 * days;
    if (opts.secondDriver) optionsCost += 5000; // forfait unique

    // Barème de pénalité de dépassement journalier (Overstay / Retard de restitution) :
    // Tarif journalier majoré de 35% pour restitution hors délai contractuel
    const penaltyDailyRateFcfa = Math.round(baseDaily * 1.35);
    const totalPenaltyFcfa = penaltiesDays > 0 ? penaltiesDays * penaltyDailyRateFcfa : 0;

    const subtotalBeforePenalty = discountedVehicleCost + driverCost + optionsCost;
    const total = subtotalBeforePenalty + totalPenaltyFcfa;

    return {
      baseDaily,
      discountedDailyRate,
      discountPercent,
      discountAmount,
      baseVehicleFull,
      discountedVehicleCost,
      driverCost,
      optionsCost,
      penaltyDailyRateFcfa,
      penaltyDays: penaltiesDays,
      totalPenaltyFcfa,
      subtotalBeforePenalty,
      total,
      depositFcfa: vehicle.depositFcfa,
    };
  };

  // Dynamic Rental Fleet Pricing synced from Administration Console
  const [fleetPricing, setFleetPricing] = useState<RentalVehiclePricing[]>(() =>
    pricingService.getRentalFleetPricing()
  );

  useEffect(() => {
    const handleUpdate = () => {
      setFleetPricing(pricingService.getRentalFleetPricing());
    };
    const unsubscribe = pricingService.subscribe(handleUpdate);
    return () => unsubscribe();
  }, []);

  const activeVehicles = useMemo(() => {
    return MOCK_RENTAL_FLEET.map((veh) => {
      const customPrice = fleetPricing.find((p) => p.id === veh.id);
      if (customPrice) {
        return {
          ...veh,
          dailyRateFcfa: customPrice.dailyRateFcfa,
          weeklyRateFcfa: customPrice.weeklyRateFcfa,
          monthlyRateFcfa: customPrice.monthlyRateFcfa,
          depositFcfa: customPrice.depositFcfa,
          driverDailyFeeFcfa: customPrice.driverDailyFeeFcfa,
          isAvailable: customPrice.isAvailable,
        };
      }
      return veh;
    });
  }, [fleetPricing]);

  // Filtered & Sorted Vehicles
  const filteredVehicles = useMemo(() => {
    const list = activeVehicles.filter((v) => {
      if (categoryFilter !== 'ALL' && v.category !== categoryFilter) return false;
      if (transmissionFilter !== 'ALL' && v.transmission !== transmissionFilter) return false;
      if (fuelFilter !== 'ALL' && v.fuelType !== fuelFilter) return false;
      if (driverFilter === 'WITH_DRIVER' && !v.withDriverAvailable) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBrand = v.brand.toLowerCase().includes(q);
        const matchesModel = v.model.toLowerCase().includes(q);
        const matchesLoc = v.currentLocation.toLowerCase().includes(q);
        const matchesCategory = v.category.toLowerCase().includes(q);
        const matchesFeature = v.features.some((f) => f.toLowerCase().includes(q));
        return matchesBrand || matchesModel || matchesLoc || matchesCategory || matchesFeature;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'PRICE_ASC') return a.dailyRateFcfa - b.dailyRateFcfa;
      if (sortBy === 'PRICE_DESC') return b.dailyRateFcfa - a.dailyRateFcfa;
      if (sortBy === 'RATING') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }, [activeVehicles, categoryFilter, transmissionFilter, fuelFilter, driverFilter, searchQuery, sortBy]);

  // Open booking modal
  const handleOpenBooking = (vehicle: RentalVehicle) => {
    setSelectedVehicle(vehicle);
    setBookingStep(1);
    setBookingSuccessBooking(null);
    setIsBookingModalOpen(true);
  };

  // Open detail modal
  const handleOpenDetailModal = (vehicle: RentalVehicle) => {
    setDetailVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  // Submit complete booking
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicle) return;

    if (!durationInfo.isDateValid) {
      alert("La date et heure de restitution doivent être strictement postérieures à la date et heure de prise en charge.");
      return;
    }

    const reference = `LOC-BJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const pricing = calculateDetailedEstimate(selectedVehicle, durationInfo.baseDays, withDriverOption, {
      babySeat: optBabySeat,
      wifi: optWifi,
      unlimitedKm: optUnlimitedKm,
      secondDriver: optSecondDriver,
    }, overstayDays);

    const activeOpts: string[] = [];
    if (optBabySeat) activeOpts.push('Siège Bébé / Enfant');
    if (optWifi) activeOpts.push('Routeur Wi-Fi 4G');
    if (optUnlimitedKm) activeOpts.push('Kilométrage Illimité');
    if (optSecondDriver) activeOpts.push('Deuxième Conducteur Agréé');

    const newBooking: RentalBooking = {
      id: `book_${Date.now()}`,
      reference,
      vehicleId: selectedVehicle.id,
      vehicleName: `${selectedVehicle.brand} ${selectedVehicle.model}`,
      vehicleCategory: selectedVehicle.category,
      plateNumber: selectedVehicle.plateNumber,
      clientName: clientName.trim() || (clientType === 'ENTREPRISE' ? companyName.trim() || 'Client Société' : 'Client JMF Mobility'),
      clientType,
      companyName: clientType === 'ENTREPRISE' ? companyName.trim() : undefined,
      companyIfu: clientType === 'ENTREPRISE' ? companyIfu.trim() : undefined,
      clientPhone: clientPhone.trim() || '+229 01 97 83 21 21',
      clientEmail: clientEmail.trim() || 'client@jmf-mobility.com',
      driverLicenseNumber: driverLicenseNumber.trim() || undefined,
      flightNumber: flightNumber.trim() || undefined,
      startDate,
      startTime,
      endDate,
      endTime,
      daysCount: durationInfo.baseDays,
      withDriver: withDriverOption,
      driverName: withDriverOption ? 'Chauffeur Professionnel JMF Assigné' : undefined,
      pickupLocation: pickupPlace,
      returnLocation: returnPlace,
      optionsSelected: activeOpts,
      baseDailyRateFcfa: selectedVehicle.dailyRateFcfa,
      vehicleCostFcfa: pricing.discountedVehicleCost,
      driverCostFcfa: pricing.driverCost,
      optionsCostFcfa: pricing.optionsCost,
      discountFcfa: pricing.discountAmount,
      penaltyDays: overstayDays,
      penaltyDailyRateFcfa: pricing.penaltyDailyRateFcfa,
      totalPenaltyFcfa: pricing.totalPenaltyFcfa,
      overstayAcknowledged: overstayPolicyAccepted,
      totalAmountFcfa: pricing.total,
      depositFcfa: selectedVehicle.depositFcfa,
      paymentMethod,
      status: paymentMethod === 'CARD' ? 'CONFIRMÉE' : 'EN_ATTENTE_ACOMPTE',
      createdAt: 'À l’instant',
      notes: specialNotes.trim() || undefined,
    };

    // Synchronize globally with pricingService so Admin & TopBar get notified immediately
    pricingService.saveRentalBooking(newBooking as any);

    setBookingsList((prev) => [newBooking, ...prev]);
    setBookingSuccessBooking(newBooking);
  };

  // Printable contract voucher
  const handlePrintVoucher = () => {
    window.print();
  };

  // Download Official PDF Quote
  const handleDownloadQuotePdf = (overrideVehicle?: RentalVehicle, overrideRef?: string) => {
    const vehicle = overrideVehicle || selectedVehicle;
    if (!vehicle) return;

    const pricing = calculateDetailedEstimate(
      vehicle,
      durationInfo.baseDays,
      withDriverOption,
      {
        babySeat: optBabySeat,
        wifi: optWifi,
        unlimitedKm: optUnlimitedKm,
        secondDriver: optSecondDriver,
      },
      overstayDays
    );

    const quoteRef = overrideRef || `DEV-BJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    generateRentalQuotePdf({
      reference: quoteRef,
      issueDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      vehicle: {
        brand: vehicle.brand,
        model: vehicle.model,
        plateNumber: vehicle.plateNumber,
        category: vehicle.category,
        seats: vehicle.seats,
        transmission: vehicle.transmission,
        fuelType: vehicle.fuelType,
        dailyRateFcfa: vehicle.dailyRateFcfa,
        driverDailyFeeFcfa: vehicle.driverDailyFeeFcfa,
        depositFcfa: vehicle.depositFcfa,
      },
      dates: {
        startDate,
        startTime,
        endDate,
        endTime,
        pickupPlace,
        returnPlace: differentReturnPlace ? returnPlace : pickupPlace,
        baseDays: durationInfo.baseDays,
        totalHours: durationInfo.totalHours,
        extraHours: durationInfo.extraHours,
        graceHours: 2,
      },
      client: {
        name: clientName.trim() || (clientType === 'ENTREPRISE' ? companyName.trim() || 'Client Entreprise' : 'Client JMF Mobility'),
        phone: clientPhone.trim() || '+229 01 97 83 21 21',
        email: clientEmail.trim() || 'contact@client.com',
        clientType,
        companyName: clientType === 'ENTREPRISE' ? companyName.trim() : undefined,
        companyIfu: clientType === 'ENTREPRISE' ? companyIfu.trim() : undefined,
        driverLicenseNumber: driverLicenseNumber.trim() || undefined,
      },
      service: {
        withDriver: withDriverOption,
        options: {
          babySeat: optBabySeat,
          wifi: optWifi,
          unlimitedKm: optUnlimitedKm,
          secondDriver: optSecondDriver,
        },
        paymentMethod,
      },
      pricing: {
        baseDailyRate: pricing.baseDaily,
        discountPercent: pricing.discountPercent,
        discountAmount: pricing.discountAmount,
        discountedVehicleCost: pricing.discountedVehicleCost,
        driverCost: pricing.driverCost,
        optionsCost: pricing.optionsCost,
        penaltyDays: overstayDays,
        penaltyDailyRateFcfa: pricing.penaltyDailyRateFcfa,
        totalPenaltyFcfa: pricing.totalPenaltyFcfa,
        subtotalBeforePenalty: pricing.subtotalBeforePenalty,
        totalAmountFcfa: pricing.total,
        depositFcfa: vehicle.depositFcfa,
        currencyCode,
      },
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Reorganized Header & Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs relative z-30">
        {/* Top Header Card: Title, Breadcrumbs, Actions */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Top Row: Breadcrumb & Utility Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
              <button
                type="button"
                onClick={onBackToDashboard}
                className="hover:text-teal-600 transition-colors flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal-600" />
                <span>Tableau de bord</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="text-slate-900 font-bold">Location de Véhicules</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isStandalone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                {isStandalone ? 'Page Dédiée Autonome' : 'Module Navigation'}
              </span>
            </div>

            {/* Quick Action Utilities */}
            <div className="flex items-center gap-2">
              <CurrencySelector variant="header" className="shrink-0" />

              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                {onToggleFullscreen && !isStandalone && (
                  <button
                    type="button"
                    onClick={onToggleFullscreen}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    title="Afficher en mode page complète dédiée (sans sidebar)"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-sky-600" />
                    <span className="hidden md:inline">Plein Écran</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onOpenNewTab ? onOpenNewTab : () => window.open('?page=rental', '_blank')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  title="Ouvrir la page de location dans un nouvel onglet de navigateur"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden sm:inline">Nouvel onglet</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Title Banner - Full width and spacious */}
          <div className="flex items-start gap-3.5 pt-1">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0 shadow-2xs">
              <Key className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Location de Véhicules & Mise à Disposition
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                  Flotte Premium
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Courte, moyenne et longue durée • Berlines, SUV 4x4, Pick-ups et Minibus • Avec ou sans chauffeur certifié • Tarification transparente multi-devises
              </p>
            </div>
          </div>
        </div>

        {/* Dedicated Full-Width Navigation Tabs Row */}
        <div className="border-t border-slate-100 bg-slate-50/80 rounded-b-2xl px-4 sm:px-6 py-2.5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 overflow-x-auto">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('catalogue')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'catalogue'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-teal-600" />
              <span>Catalogue</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-mono">
                {MOCK_RENTAL_FLEET.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('modular_offers')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'modular_offers'
                  ? 'bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${activeTab === 'modular_offers' ? 'text-amber-300' : 'text-teal-600'}`} />
              <span>Offres Modulaires (Packs & Tech)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                activeTab === 'modular_offers' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
              }`}>
                Nouveau
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('bookings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'bookings'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Réservations</span>
              <span className="px-1.5 py-0.2 rounded-full bg-teal-100 text-teal-800 text-[10px] font-mono">
                {bookingsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-slate-500" />
              <span>Simulateur & Devis</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('faq_terms')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                activeTab === 'faq_terms'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Garanties & FAQ</span>
            </button>
          </div>

          {/* Prominent Admin Dashboard Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('admin_dashboard')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                activeTab === 'admin_dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'text-indigo-700 bg-indigo-50/90 hover:bg-indigo-100 border border-indigo-200'
              }`}
              title="Accéder au tableau de bord administrateur avec KPIs réels de location"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Tableau de bord Admin (KPIs)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trust Highlights Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Assurance Tous Risques</div>
            <div className="text-[11px] text-slate-500">Franchise 0 FCFA sur tiers</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Assistance 24/7</div>
            <div className="text-[11px] text-slate-500">Capitales, aéroports & corridors régionaux</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Chauffeurs Certifiés</div>
            <div className="text-[11px] text-slate-500">Ponctuels, bilingues et courtois</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 flex items-center gap-3 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <BadgePercent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-900">Tarifs Dégressifs</div>
            <div className="text-[11px] text-slate-500">-8% dès 3j, -15% dès 7j, -25% mois</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TAB 1: VEHICLE CATALOGUE */}
      {/* ======================================================== */}
      {activeTab === 'catalogue' && (
        <div className="space-y-6">
          {/* Modular Offers Callout Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-teal-950 text-white rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-800/60 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-teal-300 flex items-center gap-2">
                  <span>Offres Flottes & Entreprises 360°</span>
                  <span className="text-[10px] bg-indigo-500/30 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30">
                    Sélecteur Modulaire
                  </span>
                </div>
                <p className="text-xs text-slate-200">
                  Combinez nos <strong>Packs d'accompagnement forfaitaires</strong> (Essentiel, Business, Pro...) avec nos <strong>options technologiques à la carte</strong> (GPS 4G, coupure moteur, sonde carburant, dashcam IA, véhicule relais) avec calcul du coût en temps réel.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('modular_offers')}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0 self-start md:self-auto"
            >
              <span>Composer mon Offre Modulaire</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Executive Quick-Booking & Estimation Console */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    <span>Planifiez votre Location & Calculez votre Tarif</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Barème Officiel 2026
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300">
                    Ajustez vos dates et formules ci-dessous : les prix de tous les véhicules s'actualisent en direct.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-teal-200 font-bold font-mono">
                  Durée : {bookingDays} jour{bookingDays > 1 ? 's' : ''}
                </span>
                {bookingDays >= 30 ? (
                  <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
                    Remise LLD -25%
                  </span>
                ) : bookingDays >= 7 ? (
                  <span className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
                    Remise Semaine -15%
                  </span>
                ) : bookingDays >= 3 ? (
                  <span className="px-2.5 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold text-[11px]">
                    Remise -8%
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-xs">
              {/* Agence Prise en charge */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>Agence de départ</span>
                </label>
                <select
                  value={pickupPlace}
                  onChange={(e) => setPickupPlace(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                >
                  <option value="Agence Centrale & Hub Urbain">Agence Centrale & Hub Urbain</option>
                  <option value="Aéroport International (Accueil VIP)">Aéroport International (Accueil VIP)</option>
                  <option value="Livraison Hôtel / Domicile / Entreprise">Livraison Hôtel / Domicile / Entreprise</option>
                  <option value="Hub Régional & Corridors">Hub Régional & Corridors</option>
                </select>
              </div>

              {/* Date & Heure Début */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Départ prévu</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-24 p-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                </div>
              </div>

              {/* Date & Heure Retour */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Restitution prévue</span>
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-24 p-2.5 rounded-xl bg-slate-800/90 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                </div>
              </div>

              {/* Formule Chauffeur */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-teal-400" />
                  <span>Option chauffeur</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWithDriverOption(true)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                      withDriverOption
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    Avec chauffeur
                  </button>
                  <button
                    type="button"
                    onClick={() => setWithDriverOption(false)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                      !withDriverOption
                        ? 'bg-teal-500 text-slate-950 border-teal-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-white/10 hover:bg-slate-700'
                    }`}
                  >
                    Sans chauffeur
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Reorganized Catalogue Filter & Control Center */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Top Row: Category Navigation (Full Width Dedicated Row) */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <span>Catégorie :</span>
                </span>
                {[
                  { id: 'ALL', label: 'Tous les véhicules' },
                  { id: 'CITADINE', label: 'Citadines & Éco' },
                  { id: 'BERLINE', label: 'Berlines Affaires' },
                  { id: 'SUV_4X4', label: 'SUV & 4x4' },
                  { id: 'PICKUP', label: 'Pick-ups 4x4' },
                  { id: 'MINIBUS', label: 'Minibus 15 Pl.' },
                  { id: 'PRESTIGE', label: 'Prestige VIP' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      categoryFilter === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-semibold text-slate-500 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 font-mono text-slate-700">
                  <strong className="text-slate-900">{filteredVehicles.length}</strong> véhicule{filteredVehicles.length > 1 ? 's' : ''} disponible{filteredVehicles.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Bottom Row: Search, Secondary Filter Dropdowns & Sort */}
            <div className="p-3.5 sm:p-4 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
              {/* Left: Search Bar with proper width */}
              <div className="relative flex-1 min-w-[240px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher marque, modèle, agence..."
                  className="w-full h-10 pl-9 pr-8 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Right: Refined Filter Dropdowns Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Boîte */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs">
                  <span className="text-slate-400 text-[11px] font-bold">Boîte :</span>
                  <select
                    value={transmissionFilter}
                    onChange={(e) => setTransmissionFilter(e.target.value)}
                    className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Toutes</option>
                    <option value="Automatique">Automatique</option>
                    <option value="Manuelle">Manuelle</option>
                  </select>
                </div>

                {/* Énergie */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs">
                  <span className="text-slate-400 text-[11px] font-bold">Énergie :</span>
                  <select
                    value={fuelFilter}
                    onChange={(e) => setFuelFilter(e.target.value)}
                    className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Tous carburants</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                  </select>
                </div>

                {/* Formule */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs">
                  <span className="text-slate-400 text-[11px] font-bold">Formule :</span>
                  <select
                    value={driverFilter}
                    onChange={(e) => setDriverFilter(e.target.value as any)}
                    className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">Toutes formules</option>
                    <option value="WITH_DRIVER">Avec chauffeur</option>
                    <option value="WITHOUT_DRIVER">Sans chauffeur</option>
                  </select>
                </div>

                {/* Tri */}
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 h-10 rounded-xl shadow-2xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="POPULAR">Tri : Popularité</option>
                    <option value="PRICE_ASC">Prix croissant</option>
                    <option value="PRICE_DESC">Prix décroissant</option>
                    <option value="RATING">Meilleures notes</option>
                  </select>
                </div>

                {/* Réinitialiser les filtres */}
                {(categoryFilter !== 'ALL' || transmissionFilter !== 'ALL' || fuelFilter !== 'ALL' || driverFilter !== 'ALL' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryFilter('ALL');
                      setTransmissionFilter('ALL');
                      setFuelFilter('ALL');
                      setDriverFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="h-10 px-3 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                    title="Réinitialiser tous les filtres"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Effacer filtres</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredVehicles.map((vehicle) => {
              const liveEstimate = calculateDetailedEstimate(vehicle, bookingDays, withDriverOption, {
                babySeat: optBabySeat,
                wifi: optWifi,
                unlimitedKm: optUnlimitedKm,
                secondDriver: optSecondDriver,
              }, overstayDays);

              return (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Vehicle Photo Banner */}
                    <div className="relative h-48 bg-slate-900 overflow-hidden">
                      <img
                        src={vehicle.imageUrl}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/10">
                          {vehicle.category.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="absolute top-2.5 right-2.5">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black shadow-xs">
                          Disponible
                        </span>
                      </div>

                      {/* Bottom Banner Details */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between text-white">
                        <div>
                          <h3 className="font-black text-sm text-white leading-tight">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <div className="text-[10px] text-slate-300 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate">{vehicle.currentLocation}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-amber-300 flex items-center gap-0.5 justify-end">
                            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                            <span>{vehicle.rating}</span>
                          </div>
                          <span className="text-[9px] text-slate-300">({vehicle.reviewsCount} avis)</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Pill Row */}
                    <div className="p-4 space-y-3">
                      <div className="grid grid-cols-3 gap-1.5 py-2 bg-slate-50 rounded-xl text-center text-[10px] text-slate-600 font-medium border border-slate-100">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Boîte</span>
                          <strong className="text-slate-800">{vehicle.transmission}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Énergie</span>
                          <strong className="text-slate-800">{vehicle.fuelType}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Places</span>
                          <strong className="text-slate-800">{vehicle.seats} sièges</strong>
                        </div>
                      </div>

                      {/* Feature Bullet List */}
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {vehicle.features.slice(0, 3).map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Deposit Notice */}
                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                        <span>Caution remboursable :</span>
                        <span className="font-mono font-bold text-slate-700">
                          {formatCurrency(vehicle.depositFcfa)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Booking Footer */}
                  <div className="p-4 pt-0 border-t border-slate-100/80 space-y-3 mt-auto">
                    <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-500 font-semibold">Tarif standard :</span>
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {formatCurrency(vehicle.dailyRateFcfa)} / jour
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                        <div>
                          <span className="text-[11px] font-bold text-slate-900 block">
                            Estimation {bookingDays}j :
                          </span>
                          {liveEstimate.discountPercent > 0 && (
                            <span className="text-[9px] text-emerald-700 font-extrabold">
                              Remise -{liveEstimate.discountPercent}% incluse
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-base font-black text-teal-700 font-mono">
                            {formatCurrency(liveEstimate.total)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(vehicle)}
                        className="col-span-2 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm hover:shadow-teal-500/20"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Réserver</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(vehicle)}
                        className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center"
                        title="Fiche technique complète"
                      >
                        <span>Fiche</span>
                      </button>
                    </div>

                    <a
                      href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                        `Bonjour JMF Mobility, je souhaite louer le véhicule : ${vehicle.brand} ${vehicle.model} (${bookingDays} jours, total ${formatCurrency(liveEstimate.total)}). Est-il disponible ?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-1.5 rounded-lg text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/80 cursor-pointer"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>Vérifier en direct sur WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2.5 TAB: MODULAR OFFER SELECTOR (PACKS + TECH OPTIONS) */}
      {/* ======================================================== */}
      {activeTab === 'modular_offers' && (
        <ModularOfferSelector
          initialFleetSize={5}
          onApplyToBooking={(_modSummary: ModularSummary) => {
            if (MOCK_RENTAL_FLEET.length > 0) {
              setSelectedVehicle(MOCK_RENTAL_FLEET[0]);
              setIsBookingModalOpen(true);
            }
          }}
        />
      )}

      {/* ======================================================== */}
      {/* 3. TAB 2: ACTIVE & PAST BOOKINGS */}
      {/* ======================================================== */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Dossiers de Location & Contrats Enregistrés</span>
                <span className="text-[10px] font-mono bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
                  {bookingsList.length} contrats
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Suivi du cycle de vie des véhicules loués, fiches de mise à disposition et décharges de caution.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('catalogue')}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 self-start cursor-pointer shadow-xs"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Nouvelle Location</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-y border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-3">Réf. Contrat</th>
                  <th className="py-3 px-3">Véhicule</th>
                  <th className="py-3 px-3">Client / Société</th>
                  <th className="py-3 px-3">Période & Durée</th>
                  <th className="py-3 px-3">Chauffeur</th>
                  <th className="py-3 px-3">Montant Net</th>
                  <th className="py-3 px-3">Statut</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookingsList.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {book.reference}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">{book.createdAt}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <strong className="text-slate-900 block">{book.vehicleName}</strong>
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
                        {book.totalPenaltyFcfa && book.totalPenaltyFcfa > 0 && (
                          <span className="text-[9px] text-amber-800 font-bold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded" title="Pénalité de dépassement">
                            +{book.totalPenaltyFcfa.toLocaleString('fr-FR')} F dép. ({book.penaltyDays}j)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {book.withDriver ? (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          {book.driverName || 'Chauffeur JMF'}
                        </span>
                      ) : (
                        <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] font-medium">
                          Sans chauffeur
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {formatCurrency(book.totalAmountFcfa)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          book.status === 'CONFIRMÉE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : book.status === 'EN_COURS'
                            ? 'bg-sky-100 text-sky-800'
                            : book.status === 'TERMINÉE'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setBookingSuccessBooking(book)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Voir le bon de réservation officiel"
                        >
                          <FileText className="w-4 h-4 text-sky-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const veh = MOCK_RENTAL_FLEET.find((v) => v.id === book.vehicleId) || {
                              id: book.vehicleId,
                              brand: book.vehicleName.split(' ')[0] || 'Véhicule',
                              model: book.vehicleName.split(' ').slice(1).join(' ') || 'JMF',
                              year: 2024,
                              category: book.vehicleCategory,
                              plateNumber: book.plateNumber,
                              dailyRateFcfa: book.baseDailyRateFcfa,
                              driverDailyFeeFcfa: 20000,
                              depositFcfa: book.depositFcfa,
                              seats: 5,
                              transmission: 'Automatique',
                              fuelType: 'Essence',
                            } as RentalVehicle;

                            generateRentalQuotePdf({
                              reference: book.reference,
                              issueDate: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                              vehicle: {
                                brand: veh.brand,
                                model: veh.model,
                                plateNumber: book.plateNumber,
                                category: book.vehicleCategory,
                                seats: veh.seats || 5,
                                transmission: veh.transmission || 'Automatique',
                                fuelType: veh.fuelType || 'Essence',
                                dailyRateFcfa: book.baseDailyRateFcfa,
                                driverDailyFeeFcfa: 20000,
                                depositFcfa: book.depositFcfa,
                              },
                              dates: {
                                startDate: book.startDate,
                                startTime: book.startTime || '09:00',
                                endDate: book.endDate,
                                endTime: book.endTime || '18:00',
                                pickupPlace: book.pickupLocation,
                                returnPlace: book.returnLocation || book.pickupLocation,
                                baseDays: book.daysCount,
                                totalHours: book.daysCount * 24,
                                extraHours: 0,
                                graceHours: 2,
                              },
                              client: {
                                name: book.clientName,
                                phone: book.clientPhone,
                                email: book.clientEmail,
                                clientType: book.clientType,
                                companyName: book.companyName,
                                companyIfu: book.companyIfu,
                                driverLicenseNumber: book.driverLicenseNumber,
                              },
                              service: {
                                withDriver: book.withDriver,
                                options: {
                                  babySeat: book.optionsSelected?.some((o) => o.includes('Bébé')) || false,
                                  wifi: book.optionsSelected?.some((o) => o.includes('Wi-Fi')) || false,
                                  unlimitedKm: book.optionsSelected?.some((o) => o.includes('Illimité')) || false,
                                  secondDriver: book.optionsSelected?.some((o) => o.includes('Conducteur')) || false,
                                },
                                paymentMethod: book.paymentMethod,
                              },
                              pricing: {
                                baseDailyRate: book.baseDailyRateFcfa,
                                discountPercent: book.daysCount >= 30 ? 25 : book.daysCount >= 7 ? 15 : book.daysCount >= 3 ? 8 : 0,
                                discountAmount: book.discountFcfa || 0,
                                discountedVehicleCost: book.vehicleCostFcfa,
                                driverCost: book.driverCostFcfa || 0,
                                optionsCost: book.optionsCostFcfa || 0,
                                penaltyDays: book.penaltyDays || 0,
                                penaltyDailyRateFcfa: book.penaltyDailyRateFcfa || Math.round(book.baseDailyRateFcfa * 1.35),
                                totalPenaltyFcfa: book.totalPenaltyFcfa || 0,
                                subtotalBeforePenalty: book.vehicleCostFcfa + (book.driverCostFcfa || 0) + (book.optionsCostFcfa || 0),
                                totalAmountFcfa: book.totalAmountFcfa,
                                depositFcfa: book.depositFcfa,
                              },
                            });
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Télécharger le devis / contrat PDF officiel"
                        >
                          <Download className="w-4 h-4 text-teal-600" />
                        </button>
                        <a
                          href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                            `Dossier location ${book.reference} pour ${book.vehicleName} (${book.clientName}) - Montant: ${book.totalAmountFcfa.toLocaleString('fr-FR')} FCFA.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="WhatsApp direct"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. TAB 3: SIMULATOR & INSTANT QUOTE */}
      {/* ======================================================== */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Simulateur Tarifaire & Devis Instantané en Ligne
            </h2>
            <p className="text-xs text-slate-500 max-w-lg mx-auto">
              Estimez le tarif exact pour votre séjour ou mission d'entreprise en Afrique avec application automatique des barèmes dégressifs.
            </p>
          </div>

          {/* Quick Switch to Modular Offer Selector */}
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-teal-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-indigo-950 font-semibold">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Besoin d'une formule combinée Flotte + Télématique (GPS, Coupure, Vidéo IA, Gardiennage) ?</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('modular_offers')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors cursor-pointer shrink-0"
            >
              Ouvrir le Sélecteur Modulaire 360°
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Modèle de véhicule souhaité :</label>
                <select
                  value={selectedVehicle?.id || MOCK_RENTAL_FLEET[0].id}
                  onChange={(e) => {
                    const found = MOCK_RENTAL_FLEET.find((v) => v.id === e.target.value);
                    if (found) setSelectedVehicle(found);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  {MOCK_RENTAL_FLEET.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.category.replace('_', ' ')}) — {v.dailyRateFcfa.toLocaleString('fr-FR')} FCFA/j
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                  <span>Durée prévisionnelle :</span>
                  <span className="text-teal-600 font-mono text-sm font-black">
                    {bookingDays} jour{bookingDays > 1 ? 's' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={bookingDays}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    const start = new Date(startDate).getTime();
                    setEndDate(new Date(start + days * 86400000).toISOString().slice(0, 10));
                  }}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>1 jour (Standard)</span>
                  <span className="text-teal-700 font-bold">3+ j (-8%)</span>
                  <span className="text-emerald-700 font-bold">7+ j (-15%)</span>
                  <span className="text-indigo-700 font-bold">30+ j (-25%)</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={withDriverOption}
                    onChange={(e) => setWithDriverOption(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded accent-teal-600 cursor-pointer"
                  />
                  <span>Option Chauffeur professionnel certifié JMF</span>
                </label>
                <p className="text-[11px] text-slate-500 pl-6 leading-relaxed">
                  Conducteur expérimenté, ponctuel et bilingue, maîtrisant les liaisons urbaines, interurbaines et corridors régionaux.
                </p>
              </div>

              {/* Options additionnelles */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optWifi}
                    onChange={(e) => setOptWifi(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Routeur Wi-Fi 4G (+5 000 F/j)</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optUnlimitedKm}
                    onChange={(e) => setOptUnlimitedKm(e.target.checked)}
                    className="accent-teal-600 rounded"
                  />
                  <span>Km illimité (+10 000 F/j)</span>
                </label>
              </div>
            </div>

            {/* Live Calculation Preview Card */}
            {(() => {
              const activeVeh = selectedVehicle || MOCK_RENTAL_FLEET[0];
              const pricing = calculateDetailedEstimate(activeVeh, bookingDays, withDriverOption, {
                babySeat: optBabySeat,
                wifi: optWifi,
                unlimitedKm: optUnlimitedKm,
                secondDriver: optSecondDriver,
              }, overstayDays);

              return (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0B1828] to-slate-950 text-white space-y-4 shadow-xl border border-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                      <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Devis En Ligne</div>
                      <div className="text-sm font-black text-white">{activeVeh.brand} {activeVeh.model}</div>
                    </div>
                    {pricing.discountPercent > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        Remise dégressive -{pricing.discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span>Tarif de base ({bookingDays} jours) :</span>
                      <span className="font-mono">{formatCurrency(pricing.baseVehicleFull)}</span>
                    </div>

                    {pricing.discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Économie dégressive appliquée :</span>
                        <span className="font-mono font-bold">-{formatCurrency(pricing.discountAmount)}</span>
                      </div>
                    )}

                    {pricing.driverCost > 0 && (
                      <div className="flex justify-between text-teal-300">
                        <span>Prestation Chauffeur certifié ({bookingDays}j) :</span>
                        <span className="font-mono">+{formatCurrency(pricing.driverCost)}</span>
                      </div>
                    )}

                    {pricing.optionsCost > 0 && (
                      <div className="flex justify-between text-sky-300">
                        <span>Options d'équipement :</span>
                        <span className="font-mono">+{formatCurrency(pricing.optionsCost)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                      <span>Assurance tous risques :</span>
                      <span className="text-emerald-400 font-bold">Incluse ✓</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                    <span className="text-xs text-slate-400 font-bold">Montant Total TTC :</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      {formatCurrency(pricing.total)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadQuotePdf(activeVeh)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-700 shadow-sm"
                      title="Télécharger ce devis complet au format PDF officiel"
                    >
                      <Download className="w-4 h-4 text-teal-400" />
                      <span>Télécharger le Devis (PDF)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenBooking(activeVeh)}
                      className="flex-1 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-teal-500/20"
                    >
                      <span>Réserver avec ce devis</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB 4: GUARANTEES & FAQ */}
      {/* ======================================================== */}
      {activeTab === 'faq_terms' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Conditions Générales & Engagements de Service JMF
            </h2>
            <p className="text-xs text-slate-500">
              Toutes les règles transparentes applicables à nos locations pour les particuliers et les délégations d'entreprises.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>1. Pièces à fournir</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pour les particuliers : Pièce d’identité (CNI ou Passeport valide), Permis de conduire de plus de 2 ans. Pour les sociétés : Bon de commande officiel, copie IFU et identité du signataire.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <CreditCard className="w-4 h-4 text-teal-600" />
                  <span>2. Dépôt de garantie & Caution</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Le dépôt de garantie (100 000 à 350 000 FCFA selon catégorie) est bloqué au départ (chèque, empreinte carte, Mobile Money ou espèces) et intégralement restitué au retour du véhicule en conformité.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Fuel className="w-4 h-4 text-teal-600" />
                  <span>3. Politique Carburant</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Politique Plein/Plein : Le véhicule vous est remis avec le réservoir plein et doit être restitué au même niveau, évitant ainsi toute refacturation superflue.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Car className="w-4 h-4 text-teal-600" />
                  <span>4. Véhicule Relais Garanti</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  En cas d’aléa mécanique, d'incident ou de crevaison, notre équipe d’assistance intervient 24/7 et garantit un véhicule de catégorie équivalente dans les 2 heures en zone métropolitaine.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. TAB 5: DEDICATED ADMIN DASHBOARD & REAL KPIS */}
      {/* ======================================================== */}
      {activeTab === 'admin_dashboard' && (
        <div className="space-y-6">
          <RentalAdminDashboardView
            onBackToDashboard={onBackToDashboard}
            onNavigateView={onNavigateView}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: DETAILED VEHICLE INSPECTION */}
      {/* ======================================================== */}
      {isDetailModalOpen && detailVehicle && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  {detailVehicle.category.replace('_', ' ')}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {detailVehicle.brand} {detailVehicle.model} ({detailVehicle.year})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-56 rounded-xl overflow-hidden bg-slate-900">
              <img
                src={detailVehicle.imageUrl}
                alt={detailVehicle.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2.5 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-mono">
                Plaque : {detailVehicle.plateNumber} • {detailVehicle.currentLocation}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Transmission</span>
                <strong className="text-slate-800">{detailVehicle.transmission}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Motorisation</span>
                <strong className="text-slate-800">{detailVehicle.fuelType}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Capacité</span>
                <strong className="text-slate-800">{detailVehicle.seats} places</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Consommation</span>
                <strong className="text-slate-800">{detailVehicle.consumptionPer100Km}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Équipements inclus :</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                {detailVehicle.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Services et garanties JMF :</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                {detailVehicle.includedServices.map((s, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tarif standard</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {formatCurrency(detailVehicle.dailyRateFcfa)} / jour
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenBooking(detailVehicle);
                }}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-sm shadow-teal-600/20"
              >
                <Key className="w-4 h-4" />
                <span>Passer à la réservation</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. MODAL: STEP-BY-STEP PROFESSIONAL BOOKING FORM */}
      {/* ======================================================== */}
      {isBookingModalOpen && selectedVehicle && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-slate-950/80 backdrop-blur-xs p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl lg:max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header (Always Visible at Top) */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-7 sm:py-5 border-b border-slate-200 bg-white shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0 shadow-xs">
                  <img
                    src={selectedVehicle.imageUrl}
                    alt={selectedVehicle.model}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                      {selectedVehicle.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {selectedVehicle.plateNumber}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight mt-0.5">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </h3>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-teal-600 shrink-0" />
                    <span>Agence : {selectedVehicle.currentLocation}</span>
                    <span>•</span>
                    <span>{selectedVehicle.seats} places</span>
                    <span>•</span>
                    <span>{selectedVehicle.transmission}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right pr-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tarif de base</span>
                  <span className="text-sm font-black font-mono text-teal-800">
                    {formatCurrency(selectedVehicle.dailyRateFcfa)} <span className="text-[10px] font-normal text-slate-500">/j</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                  title="Fermer la fenêtre"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* If Confirmation Success, show Official Voucher */}
            {bookingSuccessBooking ? (
              <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-4">
                {/* Success Banner */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold">Votre réservation a été validée avec succès !</h4>
                    <p className="text-xs text-emerald-800">
                      Un accusé de réception automatique a été généré. Le véhicule est bloqué à votre nom.
                    </p>
                  </div>
                </div>

                {/* Printable Official Voucher Box */}
                <div
                  id="printable-rental-voucher"
                  className="p-6 rounded-2xl bg-white border-2 border-slate-800 shadow-md space-y-5 print:p-0 print:border-none"
                >
                  {/* Voucher Header with JMF Logo */}
                  <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
                    <div>
                      <JmfLogo variant="light" className="h-9" />
                      <div className="text-[10px] text-slate-500 mt-1">
                        JMF Mobility Services • Hub Opérationnel Afrique • Agrément CNSR N° 2024-B-089
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Bon de Réservation & Mise à Disposition
                      </span>
                      <span className="text-base sm:text-lg font-black font-mono text-teal-700">
                        {bookingSuccessBooking.reference}
                      </span>
                      <span className="block text-[10px] text-slate-400">Émis le {bookingSuccessBooking.createdAt}</span>
                    </div>
                  </div>

                  {/* Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Véhicule</span>
                      <strong className="text-slate-900 block font-bold">{bookingSuccessBooking.vehicleName}</strong>
                      <span className="text-slate-500 font-mono text-[10px]">{bookingSuccessBooking.plateNumber}</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Client / Titulaire</span>
                      <strong className="text-slate-900 block font-bold">{bookingSuccessBooking.clientName}</strong>
                      <span className="text-slate-500 text-[10px]">{bookingSuccessBooking.clientPhone}</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Période ({bookingSuccessBooking.daysCount} jours)</span>
                      <strong className="text-slate-900 block text-[11px]">
                        Du {bookingSuccessBooking.startDate} ({bookingSuccessBooking.startTime})
                      </strong>
                      <span className="text-slate-500 block text-[10px]">
                        Au {bookingSuccessBooking.endDate} ({bookingSuccessBooking.endTime})
                      </span>
                    </div>
                  </div>

                  {/* Places & Chauffeur */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Lieu de prise en charge :</span>
                      <strong className="text-slate-800">{bookingSuccessBooking.pickupLocation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Prestation Chauffeur :</span>
                      <strong className="text-slate-800">
                        {bookingSuccessBooking.withDriver ? 'Chauffeur professionnel JMF inclus' : 'Sans chauffeur (Autonomie client)'}
                      </strong>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="space-y-1.5 text-xs pt-2 border-t border-slate-200">
                    <div className="flex justify-between text-slate-600">
                      <span>Location véhicule ({bookingSuccessBooking.daysCount} jours) :</span>
                      <span className="font-mono">{formatCurrency(bookingSuccessBooking.vehicleCostFcfa)}</span>
                    </div>
                    {bookingSuccessBooking.driverCostFcfa > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Prestation chauffeur :</span>
                        <span className="font-mono">+{formatCurrency(bookingSuccessBooking.driverCostFcfa)}</span>
                      </div>
                    )}
                    {bookingSuccessBooking.optionsCostFcfa > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Options d'équipement :</span>
                        <span className="font-mono">+{formatCurrency(bookingSuccessBooking.optionsCostFcfa)}</span>
                      </div>
                    )}
                    {bookingSuccessBooking.totalPenaltyFcfa && bookingSuccessBooking.totalPenaltyFcfa > 0 ? (
                      <div className="flex justify-between text-amber-800 bg-amber-50 p-2 rounded-lg font-bold border border-amber-200">
                        <span>Pénalité de dépassement ({bookingSuccessBooking.penaltyDays}j x {formatCurrency(bookingSuccessBooking.penaltyDailyRateFcfa || 0)}/j) :</span>
                        <span className="font-mono">+{formatCurrency(bookingSuccessBooking.totalPenaltyFcfa)}</span>
                      </div>
                    ) : (
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Barème pénalité dépassement contractuel :</span>
                        <span className="font-mono">{formatCurrency(bookingSuccessBooking.penaltyDailyRateFcfa || Math.round(bookingSuccessBooking.baseDailyRateFcfa * 1.35))}/j (franchise 2h)</span>
                      </div>
                    )}
                    <div className="flex justify-between items-baseline pt-2 border-t-2 border-slate-900 font-bold text-slate-900">
                      <span className="text-sm">Total Général TTC :</span>
                      <span className="text-lg font-black font-mono text-emerald-700">
                        {formatCurrency(bookingSuccessBooking.totalAmountFcfa)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                      <span>Dépôt de garantie restitué à l'état des lieux retour :</span>
                      <span className="font-mono">{formatCurrency(bookingSuccessBooking.depositFcfa)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrintVoucher}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Imprimer le Bon / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadQuotePdf(undefined, bookingSuccessBooking.reference)}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      title="Télécharger le contrat et devis officiel au format PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger Devis PDF</span>
                    </button>
                    <a
                      href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                        `Bonjour JMF Mobility, je confirme ma réservation ${bookingSuccessBooking.reference} pour le véhicule ${bookingSuccessBooking.vehicleName} (${bookingSuccessBooking.daysCount} jours du ${bookingSuccessBooking.startDate} au ${bookingSuccessBooking.endDate}, Total: ${formatCurrency(bookingSuccessBooking.totalAmountFcfa)}${bookingSuccessBooking.totalPenaltyFcfa && bookingSuccessBooking.totalPenaltyFcfa > 0 ? ` dont ${formatCurrency(bookingSuccessBooking.totalPenaltyFcfa)} de pénalité de dépassement` : ''}). Clause de retard acceptée (${formatCurrency(bookingSuccessBooking.penaltyDailyRateFcfa || Math.round(bookingSuccessBooking.baseDailyRateFcfa * 1.35))}/j). Merci de me transmettre les formalités.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Transmettre sur WhatsApp (+229 01 97 83 21 21)</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBookingModalOpen(false);
                      setActiveTab('bookings');
                    }}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              /* Step-by-Step Reorganized Interactive Booking Wizard */
              (() => {
                const livePricing = calculateDetailedEstimate(selectedVehicle, bookingDays, withDriverOption, {
                  babySeat: optBabySeat,
                  wifi: optWifi,
                  unlimitedKm: optUnlimitedKm,
                  secondDriver: optSecondDriver,
                }, overstayDays);

                return (
                  <form onSubmit={handleConfirmBooking} className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-5">
                      {/* Currency Selector (USD, EUR, XOF) for Booking Form */}
                      <div className="p-3 bg-gradient-to-r from-teal-50/80 via-slate-50 to-indigo-50/70 rounded-2xl border border-teal-200/70 shadow-2xs">
                        <CurrencySelector variant="form" />
                      </div>

                    {/* Stepper Progress Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold border-b border-slate-100 pb-3">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 cursor-pointer ${
                          bookingStep === 1
                            ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                            : bookingStep > 1
                            ? 'text-teal-700 bg-slate-50 hover:bg-teal-50/50'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                            bookingStep === 1
                              ? 'bg-teal-600 text-white'
                              : bookingStep > 1
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          1
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[11px] sm:text-xs font-bold">1. Période & Retrait</span>
                          <span className="block text-[10px] text-slate-400 font-normal truncate">Dates & Agence</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingStep(2)}
                        className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 cursor-pointer ${
                          bookingStep === 2
                            ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                            : bookingStep > 2
                            ? 'text-teal-700 bg-slate-50 hover:bg-teal-50/50'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                            bookingStep === 2
                              ? 'bg-teal-600 text-white'
                              : bookingStep > 2
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          2
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[11px] sm:text-xs font-bold">2. Formule & Options</span>
                          <span className="block text-[10px] text-slate-400 font-normal truncate">Chauffeur & Confort</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingStep(3)}
                        className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 cursor-pointer ${
                          bookingStep === 3
                            ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                            : bookingStep > 3
                            ? 'text-teal-700 bg-slate-50 hover:bg-teal-50/50'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                            bookingStep === 3
                              ? 'bg-teal-600 text-white'
                              : bookingStep > 3
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          3
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[11px] sm:text-xs font-bold">3. Conducteur & Contact</span>
                          <span className="block text-[10px] text-slate-400 font-normal truncate">Identité & Facturation</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingStep(4)}
                        className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2 cursor-pointer ${
                          bookingStep === 4
                            ? 'bg-teal-50 text-teal-900 border border-teal-200 shadow-2xs'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold ${
                            bookingStep === 4 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          4
                        </span>
                        <div className="min-w-0">
                          <span className="block truncate text-[11px] sm:text-xs font-bold">4. Devis & Règlement</span>
                          <span className="block text-[10px] text-slate-400 font-normal truncate">Validation finale</span>
                        </div>
                      </button>
                    </div>

                    {/* ======================================================== */}
                    {/* STEP 1: PÉRIODE, DATES & AGENCES */}
                    {/* ======================================================== */}
                    {bookingStep === 1 && (
                      <div className="space-y-4 text-xs">
                        {/* Validation Alert if Dates are invalid */}
                        {!durationInfo.isDateValid && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-center gap-2.5 text-xs animate-in fade-in">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>
                              <strong>Dates invalides :</strong> La date et heure de restitution doivent être strictement postérieures à la date et heure de prise en charge.
                            </span>
                          </div>
                        )}

                        {/* Dates & Horaires Box */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                              <Calendar className="w-4 h-4 text-teal-600" />
                              <span>Dates d’Arrivée & de Sortie (Prise en charge & Restitution)</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-medium">Cycle 24h • Tolérance 2h</span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Prise en charge / Arrivée */}
                            <div className="space-y-1.5">
                              <label className="block font-bold text-slate-800 text-xs">
                                Date & Heure d'arrivée (Prise en charge) <span className="text-red-500">*</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  value={startDate}
                                  onChange={(e) => handleStartDateChange(e.target.value)}
                                  className="flex-1 h-11 px-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                  required
                                />
                                <input
                                  type="time"
                                  value={startTime}
                                  onChange={(e) => setStartTime(e.target.value)}
                                  className="w-28 h-11 px-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                />
                              </div>
                            </div>

                            {/* Restitution / Sortie */}
                            <div className="space-y-1.5">
                              <label className="block font-bold text-slate-800 text-xs">
                                Date & Heure de sortie (Restitution) <span className="text-red-500">*</span>
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  value={endDate}
                                  onChange={(e) => handleEndDateChange(e.target.value)}
                                  className={`flex-1 h-11 px-3 border rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 text-xs ${
                                    !durationInfo.isDateValid
                                      ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                                      : 'border-slate-200 focus:ring-teal-500/20'
                                  }`}
                                  required
                                />
                                <input
                                  type="time"
                                  value={endTime}
                                  onChange={(e) => setEndTime(e.target.value)}
                                  className={`w-28 h-11 px-3 border rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 text-xs ${
                                    !durationInfo.isDateValid
                                      ? 'border-rose-400 focus:ring-rose-500/20 bg-rose-50/20'
                                      : 'border-slate-200 focus:ring-teal-500/20'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Duration Banner */}
                          <div className="p-3 bg-white rounded-xl border border-slate-200/70 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                                <span className="text-slate-600 text-xs">Durée contractuelle calculée :</span>
                                <strong className="text-slate-900 font-black text-xs font-mono">
                                  {durationInfo.baseDays} jour{durationInfo.baseDays > 1 ? 's' : ''} ({durationInfo.totalHours}h au total)
                                </strong>
                              </div>
                              {durationInfo.baseDays >= 30 ? (
                                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                                  Remise Mensuelle LLD -25%
                                </span>
                              ) : durationInfo.baseDays >= 7 ? (
                                <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                                  Remise Semaine -15%
                                </span>
                              ) : durationInfo.baseDays >= 3 ? (
                                <span className="text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                                  Remise Séjour -8%
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[11px]">Tarif journalier standard</span>
                              )}
                            </div>

                            {/* Informative notice on hours overflow / grace period */}
                            {durationInfo.gracePeriodExceeded && (
                              <div className="text-[11px] text-teal-800 bg-teal-50/70 p-2 rounded-lg border border-teal-200 flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                <span>
                                  L'horaire de sortie dépasse l'horaire de prise en charge de <strong>+{durationInfo.extraHours}h</strong> (au-delà de la franchise de 2h) : 1 journée supplémentaire est automatiquement décomptée au tarif journalier.
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Overstay & Late Return Penalty Policy & Simulation Box */}
                        <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span>Barème & Simulation de Dépassement de Délai (Overstay)</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
                              Majoration contractuelle +35%
                            </span>
                          </div>

                          <p className="text-[11px] text-amber-900 leading-relaxed">
                            Conformément à la charte JMF Mobility, une tolérance de courtoisie de <strong>2 heures</strong> est accordée à la restitution. Si le véhicule n’est pas restitué à l’échéance convenue, chaque journée supplémentaire non déclarée est facturée au tarif journalier majoré de 35% soit <strong>{formatCurrency(livePricing.penaltyDailyRateFcfa)} / jour entamé</strong>. Vous pouvez simuler ou intégrer un dépassement prévisible dès maintenant :
                          </p>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-amber-200">
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold text-slate-900 block">
                                Jours de dépassement / prolongation hors délai :
                              </span>
                              <span className="text-[10px] text-slate-500">
                                {overstayDays === 0
                                  ? '0 jour (Restitution normale à la date et heure de sortie convenue)'
                                  : `${overstayDays} jour(s) de dépassement soumis à la facturation de pénalité`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() => setOverstayDays((prev) => Math.max(0, prev - 1))}
                                  disabled={overstayDays === 0}
                                  className="px-3 py-1.5 text-xs font-bold hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                                  title="Diminuer les jours de dépassement"
                                >
                                  -
                                </button>
                                <span className="px-3 py-1.5 text-xs font-mono font-bold bg-white min-w-8 text-center text-slate-900">
                                  {overstayDays}j
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setOverstayDays((prev) => Math.min(14, prev + 1))}
                                  className="px-3 py-1.5 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                                  title="Ajouter un jour de dépassement"
                                >
                                  +
                                </button>
                              </div>

                              {overstayDays > 0 ? (
                                <span className="text-xs font-mono font-black text-amber-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg">
                                  +{formatCurrency(livePricing.totalPenaltyFcfa)}
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-medium">0 {currency.symbol} pénalité</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Lieux & Agences Box */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
                          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                            <MapPin className="w-4 h-4 text-teal-600" />
                            <span>Agences & Points de remise</span>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                                Lieu de prise en charge <span className="text-red-500">*</span>
                              </label>
                              <select
                                value={pickupPlace}
                                onChange={(e) => setPickupPlace(e.target.value)}
                                className="w-full h-11 px-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                              >
                                <option value="Agence Centrale & Hub Urbain">Agence Centrale & Hub Urbain</option>
                                <option value="Aéroport International (Accueil VIP)">Aéroport International (Accueil VIP)</option>
                                <option value="Livraison Hôtel / Domicile / Siège d'entreprise">
                                  Livraison Hôtel / Domicile / Siège d'entreprise
                                </option>
                                <option value="Hub Régional & Corridors Sous-régionaux">Hub Régional & Corridors Sous-régionaux</option>
                              </select>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <input
                                type="checkbox"
                                id="diffReturn"
                                checked={differentReturnPlace}
                                onChange={(e) => setDifferentReturnPlace(e.target.checked)}
                                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                              />
                              <label htmlFor="diffReturn" className="text-slate-700 text-xs cursor-pointer select-none font-medium">
                                Restituer le véhicule dans un lieu ou une agence différente (Trajet simple / One-way)
                              </label>
                            </div>

                            {differentReturnPlace && (
                              <div>
                                <label className="block font-bold text-slate-800 mb-1.5 text-xs">
                                  Lieu de restitution <span className="text-red-500">*</span>
                                </label>
                                <select
                                  value={returnPlace}
                                  onChange={(e) => setReturnPlace(e.target.value)}
                                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                >
                                  <option value="Agence Centrale & Hub Urbain">Agence Centrale & Hub Urbain</option>
                                  <option value="Aéroport International (Accueil VIP)">Aéroport International (Accueil VIP)</option>
                                  <option value="Livraison Hôtel / Domicile / Siège d'entreprise">
                                    Livraison Hôtel / Domicile / Siège d'entreprise
                                  </option>
                                  <option value="Hub Régional & Corridors Sous-régionaux">Hub Régional & Corridors Sous-régionaux</option>
                                </select>
                              </div>
                            )}

                            {pickupPlace.includes('Aéroport') && (
                              <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-200">
                                <label className="block font-bold text-slate-900 mb-1.5 text-xs">
                                  Numéro de Vol d'arrivée (Accueil nominatif en zone VIP) :
                                </label>
                                <input
                                  type="text"
                                  value={flightNumber}
                                  onChange={(e) => setFlightNumber(e.target.value)}
                                  placeholder="Ex: Air France AF804, Corsair SS920, Brussels Airlines SN231..."
                                  className="w-full h-11 px-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none text-xs"
                                />
                                <p className="text-[11px] text-slate-500 mt-1">
                                  Notre agent ou chauffeur surveillera l'atterrissage en direct et vous attendra avec un panneau nominatif personnalisé.
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 2: FORMULE CHAUFFEUR & OPTIONS DE BORD */}
                    {/* ======================================================== */}
                    {bookingStep === 2 && (
                      <div className="space-y-4 text-xs">
                        {/* Formule de conduite */}
                        <div className="space-y-2">
                          <label className="block font-bold text-slate-800 text-xs">
                            Sélectionnez votre formule de conduite :
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setWithDriverOption(true)}
                              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                withDriverOption
                                  ? 'border-teal-500 bg-teal-50/70 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                                    <User className="w-4 h-4" />
                                  </div>
                                  <span className="font-black text-slate-900 text-sm">Avec Chauffeur JMF</span>
                                </div>
                                <span className="text-[10px] font-black text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full">
                                  Recommandé
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-normal mt-2.5 leading-relaxed">
                                Chauffeur professionnel certifié, bilingue, courtois et ponctuel. Prise en charge de ses repas incluse. Zéro tracas d'itinéraires et sécurité totale.
                              </p>
                              <div className="text-xs text-teal-800 font-bold mt-2.5 pt-2 border-t border-teal-200/60 font-mono">
                                {selectedVehicle.driverDailyFeeFcfa > 0
                                  ? `+${formatCurrency(selectedVehicle.driverDailyFeeFcfa)} / jour`
                                  : 'Chauffeur VIP inclus dans la formule'}
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setWithDriverOption(false)}
                              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                                !withDriverOption
                                  ? 'border-teal-500 bg-teal-50/70 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                                    <Key className="w-4 h-4" />
                                  </div>
                                  <span className="font-black text-slate-900 text-sm">Sans Chauffeur</span>
                                </div>
                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                                  Autonomie
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 font-normal mt-2.5 leading-relaxed">
                                Conduite libre par vos soins. Permis de conduire valide de plus de 2 ans requis et dépôt de garantie bloqué au départ.
                              </p>
                              <div className="text-xs text-slate-600 font-bold mt-2.5 pt-2 border-t border-slate-200 font-mono">
                                Caution remboursable : {formatCurrency(selectedVehicle.depositFcfa)}
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Options d'équipements */}
                        <div className="space-y-2 pt-2">
                          <label className="block font-bold text-slate-800 text-xs">
                            Options & Équipements de confort additionnels :
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <Wifi className="w-4 h-4 text-teal-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs">Routeur Wi-Fi 4G nomade</span>
                                  <span className="text-[10px] text-slate-500 font-mono">+{formatCurrency(5000)} / jour</span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={optWifi}
                                onChange={(e) => setOptWifi(e.target.checked)}
                                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <Baby className="w-4 h-4 text-teal-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs">Siège Bébé / Enfant ISOFIX</span>
                                  <span className="text-[10px] text-slate-500 font-mono">+{formatCurrency(3000)} / jour</span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={optBabySeat}
                                onChange={(e) => setOptBabySeat(e.target.checked)}
                                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <Gauge className="w-4 h-4 text-teal-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs">Kilométrage illimité</span>
                                  <span className="text-[10px] text-slate-500 font-mono">+{formatCurrency(10000)} / jour</span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={optUnlimitedKm}
                                onChange={(e) => setOptUnlimitedKm(e.target.checked)}
                                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                              />
                            </label>

                            <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100/80 cursor-pointer">
                              <div className="flex items-center gap-2.5">
                                <Users className="w-4 h-4 text-teal-600 shrink-0" />
                                <div>
                                  <span className="font-bold text-slate-900 block text-xs">Deuxième Conducteur agréé</span>
                                  <span className="text-[10px] text-slate-500 font-mono">+{formatCurrency(5000)} unique</span>
                                </div>
                              </div>
                              <input
                                type="checkbox"
                                checked={optSecondDriver}
                                onChange={(e) => setOptSecondDriver(e.target.checked)}
                                className="accent-teal-600 w-4 h-4 rounded cursor-pointer"
                              />
                            </label>
                          </div>
                        </div>

                        {/* Assurance tous risques banner */}
                        <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                          <div className="text-xs">
                            <strong className="font-bold">Assurance Tous Risques incluse d'office :</strong> Franchise 0 FCFA sur tiers, bris de glace et vol avec assistance 24/7 sur tout le territoire et les corridors inter-États.
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 3: CONDUCTEUR & FACTURATION (PARFAIT ALIGNEMENT) */}
                    {/* ======================================================== */}
                    {bookingStep === 3 && (
                      <div className="space-y-4 text-xs">
                        {/* Profil Client : Particulier vs Entreprise */}
                        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setClientType('PARTICULIER')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                              clientType === 'PARTICULIER' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Particulier / Tourisme / Famille
                          </button>
                          <button
                            type="button"
                            onClick={() => setClientType('ENTREPRISE')}
                            className={`flex-1 py-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                              clientType === 'ENTREPRISE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Entreprise / Organisation / ONG
                          </button>
                        </div>

                        {/* Section Entreprise (si sélectionnée) */}
                        {clientType === 'ENTREPRISE' && (
                          <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200 space-y-3">
                            <div className="flex items-center gap-2 text-teal-900 font-bold text-xs">
                              <Building2 className="w-4 h-4 text-teal-700" />
                              <span>Informations de Facturation Entreprise</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                  Raison sociale / Société <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Ex: TotalEnergies Marketing"
                                    className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                    required={clientType === 'ENTREPRISE'}
                                  />
                                </div>
                              </div>

                              <div className="space-y-1.5">
                                <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                  Numéro IFU officiel (Facture déductible)
                                </label>
                                <div className="relative">
                                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  <input
                                    type="text"
                                    value={companyIfu}
                                    onChange={(e) => setCompanyIfu(e.target.value)}
                                    placeholder="Ex: 3202314589712"
                                    className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Coordonnées Conducteur Principal */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4">
                          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                            <User className="w-4 h-4 text-teal-600" />
                            <span>Coordonnées du titulaire de la réservation</span>
                          </div>

                          {/* Row 1 : Nom et Téléphone */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                Nom & Prénom du conducteur <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={clientName}
                                  onChange={(e) => setClientName(e.target.value)}
                                  placeholder="Ex: M. Jean KOUASSI"
                                  className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                Téléphone / WhatsApp <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="tel"
                                  value={clientPhone}
                                  onChange={(e) => setClientPhone(e.target.value)}
                                  placeholder="+229 97 88 00 00"
                                  className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs font-mono"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          {/* Row 2 : Email et Permis */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                Adresse Email de confirmation <span className="text-red-500">*</span>
                              </label>
                              <div className="relative">
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="email"
                                  value={clientEmail}
                                  onChange={(e) => setClientEmail(e.target.value)}
                                  placeholder="direction@entreprise.bj"
                                  className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                  required
                                />
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                                N° Permis de conduire {!withDriverOption ? <span className="text-red-500">*</span> : <span className="text-slate-400 font-normal text-[11px]">(Optionnel)</span>}
                              </label>
                              <div className="relative">
                                <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                <input
                                  type="text"
                                  value={driverLicenseNumber}
                                  onChange={(e) => setDriverLicenseNumber(e.target.value)}
                                  placeholder="Ex: BJ-2020-0451-PC ou à la livraison"
                                  className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                                  required={!withDriverOption}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Row 3 : Remarques */}
                          <div className="space-y-1.5">
                            <label className="block h-5 text-xs font-bold text-slate-800 leading-5">
                              Remarques & Instructions particulières <span className="text-slate-400 font-normal text-[11px]">(Optionnel)</span>
                            </label>
                            <div className="relative">
                              <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              <input
                                type="text"
                                value={specialNotes}
                                onChange={(e) => setSpecialNotes(e.target.value)}
                                placeholder="Ex: Arrivée tardive, siège bébé à l'arrière droit, adresse exacte de livraison..."
                                className="w-full h-11 pl-9 pr-3 border border-slate-200 rounded-xl font-medium bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ======================================================== */}
                    {/* STEP 4: DEVIS PROFORMA RÉCAPITULATIF & RÈGLEMENT */}
                    {/* ======================================================== */}
                    {bookingStep === 4 && (
                      <div className="space-y-5 text-xs">
                        {/* Proforma Quote Summary Box */}
                        <div className="p-5 bg-gradient-to-br from-[#0B1828] to-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                            <div>
                              <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400 font-bold block">
                                Récapitulatif Devis Proforma
                              </span>
                              <h4 className="text-base font-black text-white">
                                {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.plateNumber})
                              </h4>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                {bookingDays} jour{bookingDays > 1 ? 's' : ''} de location
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDownloadQuotePdf()}
                                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer border border-teal-400/40"
                                title="Télécharger le devis proforma officiel au format PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Télécharger le Devis (PDF)</span>
                              </button>
                            </div>
                          </div>

                          {/* Overview details grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Période</span>
                              <div className="font-bold text-white text-[11px]">
                                Du {startDate} ({startTime})
                              </div>
                              <div className="text-slate-300 text-[11px]">
                                Au {endDate} ({endTime})
                              </div>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Prise en charge</span>
                              <div className="font-bold text-white text-[11px] truncate">{pickupPlace}</div>
                              {differentReturnPlace && (
                                <div className="text-slate-300 text-[10px] truncate">Retour : {returnPlace}</div>
                              )}
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Formule Conduite</span>
                              <div className="font-bold text-teal-300 text-[11px]">
                                {withDriverOption ? 'Avec Chauffeur JMF' : 'Sans Chauffeur (Autonomie)'}
                              </div>
                              <div className="text-slate-400 text-[10px]">Assurance tous risques incluse</div>
                            </div>
                          </div>

                          {/* Line-by-line financial calculation */}
                          <div className="space-y-2 text-xs text-slate-300 pt-1">
                            <div className="flex justify-between">
                              <span>Location véhicule ({bookingDays} jours à {formatCurrency(selectedVehicle.dailyRateFcfa)}/j) :</span>
                              <span className="font-mono text-white">{formatCurrency(livePricing.baseVehicleFull)}</span>
                            </div>

                            {livePricing.discountAmount > 0 && (
                              <div className="flex justify-between text-emerald-400 font-semibold">
                                <span>Remise dégressive appliquée (-{livePricing.discountPercent}%) :</span>
                                <span className="font-mono">-{formatCurrency(livePricing.discountAmount)}</span>
                              </div>
                            )}

                            {livePricing.driverCost > 0 && (
                              <div className="flex justify-between text-teal-300">
                                <span>Prestation Chauffeur certifié JMF ({bookingDays}j) :</span>
                                <span className="font-mono">+{formatCurrency(livePricing.driverCost)}</span>
                              </div>
                            )}

                            {livePricing.optionsCost > 0 && (
                              <div className="flex justify-between text-sky-300">
                                <span>Options d'équipement additionnelles :</span>
                                <span className="font-mono">+{formatCurrency(livePricing.optionsCost)}</span>
                              </div>
                            )}

                            {/* Overstay Penalty Line Item */}
                            {livePricing.totalPenaltyFcfa > 0 ? (
                              <div className="flex justify-between text-amber-300 font-bold bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30">
                                <span className="flex items-center gap-1.5">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                  <span>Pénalité de dépassement ({livePricing.penaltyDays}j x {formatCurrency(livePricing.penaltyDailyRateFcfa)}/j) :</span>
                                </span>
                                <span className="font-mono">+{formatCurrency(livePricing.totalPenaltyFcfa)}</span>
                              </div>
                            ) : (
                              <div className="flex justify-between text-slate-400 text-[11px] pt-0.5">
                                <span>Pénalité de dépassement / retard contractuel :</span>
                                <span className="font-mono text-slate-300">0 {currency.symbol} ({formatCurrency(livePricing.penaltyDailyRateFcfa)}/j garanti si &gt; 2h de dépassement)</span>
                              </div>
                            )}

                            <div className="flex justify-between text-slate-400 text-[11px] pt-1.5 border-t border-white/10">
                              <span>Assurance Tous Risques & Assistance 24/7 :</span>
                              <span className="text-emerald-400 font-bold">Incluse (0 {currency.symbol}) ✓</span>
                            </div>

                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>Dépôt de garantie / Caution remboursable à la restitution :</span>
                              <span className="font-mono font-bold text-slate-200">
                                {formatCurrency(selectedVehicle.depositFcfa)}
                              </span>
                            </div>

                            {/* Total Net TTC */}
                            <div className="pt-3 border-t-2 border-white/15 flex justify-between items-baseline">
                              <div>
                                <span className="text-sm font-bold text-white block">Montant Total Net TTC :</span>
                                <span className="text-[10px] text-slate-400">TVA & taxes incluses • Carburant départ plein • Taux référence actif</span>
                              </div>
                              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                                {formatCurrency(livePricing.total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Choix Mode de Règlement */}
                        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3">
                          <label className="block font-bold text-slate-800 text-xs">
                            Modalités de règlement de l'acompte :
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setPaymentMethod('MOMO')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                paymentMethod === 'MOMO'
                                  ? 'border-teal-500 bg-teal-50 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="font-bold text-xs">Mobile Money</div>
                              <div className="text-[10px] text-slate-500">Orange / MTN / Wave / Moov</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentMethod('CARD')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                paymentMethod === 'CARD'
                                  ? 'border-teal-500 bg-teal-50 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="font-bold text-xs">Carte Bancaire</div>
                              <div className="text-[10px] text-slate-500">Visa / Mastercard</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentMethod('TRANSFER')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                paymentMethod === 'TRANSFER'
                                  ? 'border-teal-500 bg-teal-50 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="font-bold text-xs">Virement Pro</div>
                              <div className="text-[10px] text-slate-500">Facture avec IFU</div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setPaymentMethod('AGENCY')}
                              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                                paymentMethod === 'AGENCY'
                                  ? 'border-teal-500 bg-teal-50 text-teal-950 font-bold shadow-xs ring-1 ring-teal-500/30'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className="font-bold text-xs">En Agence</div>
                              <div className="text-[10px] text-slate-500">À la prise des clés</div>
                            </button>
                          </div>
                        </div>

                        {/* Conditions d'utilisation checkbox & Overstay Policy checkbox */}
                        <div className="space-y-2.5">
                          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={acceptedTerms}
                              onChange={(e) => setAcceptedTerms(e.target.checked)}
                              className="mt-0.5 accent-teal-600 w-4 h-4 rounded cursor-pointer shrink-0"
                              required
                            />
                            <span className="leading-relaxed">
                              J’accepte les conditions générales de location de JMF Mobility Services, la politique carburant plein/plein et le principe du dépôt de garantie restituable à l'état des lieux contradictoire au retour.
                            </span>
                          </label>

                          <label className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={overstayPolicyAccepted}
                              onChange={(e) => setOverstayPolicyAccepted(e.target.checked)}
                              className="mt-0.5 accent-amber-600 w-4 h-4 rounded cursor-pointer shrink-0"
                              required
                            />
                            <span className="leading-relaxed">
                              <strong>Clause d'acceptation des pénalités de dépassement :</strong> J’accepte expressément que toute non-restitution du véhicule à la date et heure convenue (au-delà de la franchise de 2 heures) soit soumise à la facturation supplémentaire journalière de <strong>{livePricing.penaltyDailyRateFcfa.toLocaleString('fr-FR')} FCFA / jour entamé</strong>.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                    </div>

                    {/* ======================================================== */}
                    {/* PERSISTENT FOOTER: LIVE SUMMARY & STEP NAVIGATION */}
                    {/* ======================================================== */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 sm:px-7 border-t border-slate-200 bg-slate-50/90 shrink-0">
                      {/* Left: Live Summary Pill */}
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span className="font-bold text-slate-900">{selectedVehicle.brand} {selectedVehicle.model}</span>
                          <span className="text-slate-400">•</span>
                          <span>{durationInfo.baseDays}j{overstayDays > 0 ? ` (+${overstayDays}j dép.)` : ''}</span>
                          <span className="text-slate-400">•</span>
                          <span className="font-mono font-bold text-teal-800">
                            {livePricing.total.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                      </div>

                      {/* Right: Navigation Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {bookingStep === 1 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setIsBookingModalOpen(false)}
                              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer text-xs transition-colors"
                            >
                              Annuler
                            </button>
                            <button
                              type="button"
                              disabled={!durationInfo.isDateValid}
                              onClick={() => setBookingStep(2)}
                              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                            >
                              <span>Étape suivante : Formule & Options</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {bookingStep === 2 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setBookingStep(1)}
                              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Précédent</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setBookingStep(3)}
                              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                            >
                              <span>Étape suivante : Conducteur & Facturation</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {bookingStep === 3 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setBookingStep(2)}
                              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Précédent</span>
                            </button>
                            <button
                              type="button"
                              disabled={!clientName.trim() || !clientPhone.trim() || clientPhone.length < 6}
                              onClick={() => setBookingStep(4)}
                              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                            >
                              <span>Étape finale : Devis & Paiement</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {bookingStep === 4 && (
                          <>
                            <button
                              type="button"
                              onClick={() => setBookingStep(3)}
                              className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 cursor-pointer text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <ArrowLeft className="w-3.5 h-3.5" />
                              <span>Précédent</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadQuotePdf()}
                              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5 transition-all border border-slate-700"
                              title="Générer et télécharger le devis officiel complet au format PDF"
                            >
                              <Download className="w-3.5 h-3.5 text-teal-400" />
                              <span>Télécharger Devis (PDF)</span>
                            </button>
                            <button
                              type="submit"
                              disabled={!acceptedTerms || !overstayPolicyAccepted}
                              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl font-black text-xs shadow-md shadow-teal-600/20 cursor-pointer flex items-center gap-2 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Confirmer & Émettre le Bon de Réservation</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </form>
                );
              })()
            )}
          </div>
        </div>
      )}
    </div>
  );
};
