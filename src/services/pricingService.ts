/**
 * Service de Gestion Centralisée des Tarifs & Réservations JMF Mobility
 * 
 * Permet l'édition, la persistance et la synchronisation en temps réel :
 * - Des tarifs journaliers et pénalités de dépassement (Overstay) pour le stockage sécurisé
 * - Des tarifs journaliers, hebdomadaires, mensuels et cautions pour la location de véhicules
 * - Des options additionnelles (lavage, maintien charge batterie, bâchage)
 * - De l'historique d'audit des modifications de prix pour traçabilité administrative
 */

export interface StorageCategoryPricing {
  id: string;
  name: string;
  surface: string;
  dailyRate: number;      // FCFA / jour
  overstayRate: number;   // FCFA / jour de dépassement au-delà de la date convenue
  description: string;
  enabled: boolean;
}

export interface RentalVehiclePricing {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: 'CITADINE' | 'BERLINE' | 'SUV_4X4' | 'PICKUP' | 'MINIBUS' | 'PRESTIGE';
  plateNumber: string;
  dailyRateFcfa: number;
  weeklyRateFcfa: number;
  monthlyRateFcfa: number;
  depositFcfa: number;
  driverDailyFeeFcfa: number;
  isAvailable: boolean;
  currentLocation: string;
}

export interface StorageGeneralSettings {
  graceHours: number;            // Heures de tolérance avant décompte jour de dépassement (défaut: 2h)
  washOptionRateFcfa: number;    // Tarif unitaire option Lavage
  batteryOptionRateFcfa: number; // Tarif unitaire option Maintien batterie / semaine
  tarpOptionRateFcfa: number;    // Tarif unitaire option Bâchage respirant
  vatRatePercent: number;        // TVA (0 si exonéré / export)
  currency: string;
  managerNoticeEmail: string;
  managerWhatsApp: string;
}

export interface FleetPackagePricing {
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
  enabled: boolean;
}

export interface ProTariffUnitRate {
  id: string;
  category: string;
  unitLabel: string;
  monthlyRateNumeric: number;
  isStartingFrom?: boolean;
  observations: string;
}

export interface ProTariffCategoryPack {
  id: string;
  equipmentType: 'UTILITAIRE' | 'POIDS_LOURD' | 'ENGIN';
  packName: 'STARTER' | 'BUSINESS' | 'PREMIUM';
  fleetScope: string;
  monthlyFeeNumeric: number;
  includedServices: string;
}

export interface ProTariffComplementaryOption {
  id: string;
  name: string;
  indicativeRate: string;
}

export interface ProTariffGridData {
  unitRates: ProTariffUnitRate[];
  categoryPacks: ProTariffCategoryPack[];
  complementaryOptions: ProTariffComplementaryOption[];
}

export interface PricingAuditLog {
  id: string;
  timestamp: string;
  user: string;
  itemType: 'STORAGE' | 'VEHICLE' | 'SETTING' | 'FLEET_PACK';
  itemName: string;
  changeDescription: string;
}

export interface RentalBookingRecord {
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
  status: 'CONFIRMÉE' | 'EN_COURS' | 'TERMINÉE' | 'EN_ATTENTE_ACOMPTE' | 'ANNULÉE';
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY_CATEGORIES = 'jmf_pricing_storage_categories_v1';
const STORAGE_KEY_FLEET = 'jmf_pricing_rental_fleet_v1';
const STORAGE_KEY_FLEET_PACKAGES = 'jmf_pricing_fleet_packages_v1';
const STORAGE_KEY_PRO_TARIFF_GRID = 'jmf_pricing_pro_tariff_grid_v1';
const STORAGE_KEY_SETTINGS = 'jmf_pricing_storage_settings_v1';
const STORAGE_KEY_AUDIT = 'jmf_pricing_audit_logs_v1';
const STORAGE_KEY_BOOKINGS = 'jmf_pricing_rental_bookings_v1';
const EVENT_NAME = 'jmf_pricing_updated';

export const DEFAULT_PRO_TARIFF_GRID: ProTariffGridData = {
  unitRates: [
    {
      id: 'unit_utilitaire',
      category: 'Véhicule utilitaire léger',
      unitLabel: 'véhicule',
      monthlyRateNumeric: 8000,
      observations: 'Fourgonnette, camionnette, pickup',
    },
    {
      id: 'unit_poids_lourd',
      category: 'Poids lourd',
      unitLabel: 'camion',
      monthlyRateNumeric: 18000,
      observations: 'Camion-benne, tracteur routier, citerne, porteur',
    },
    {
      id: 'unit_engin_standard',
      category: 'Engin de chantier standard',
      unitLabel: 'engin',
      monthlyRateNumeric: 30000,
      observations: 'Pelle, chargeuse, compacteur, niveleuse',
    },
    {
      id: 'unit_engin_lourd',
      category: 'Engin lourd spécialisé',
      unitLabel: 'engin',
      monthlyRateNumeric: 40000,
      isStartingFrom: true,
      observations: 'Gros engin minier ou suivi complexe',
    },
  ],
  categoryPacks: [
    // 2. Packs pour véhicules utilitaires
    {
      id: 'pack_util_starter',
      equipmentType: 'UTILITAIRE',
      packName: 'STARTER',
      fleetScope: '1 à 5 véhicules',
      monthlyFeeNumeric: 40000,
      includedServices:
        'Dossiers administratifs; suivi des assurances et visites techniques; calendrier des échéances; planning d’entretien; rapport synthétique.',
    },
    {
      id: 'pack_util_business',
      equipmentType: 'UTILITAIRE',
      packName: 'BUSINESS',
      fleetScope: '6 à 15 véhicules',
      monthlyFeeNumeric: 100000,
      includedServices:
        'Starter + kilométrages déclarés; planning des réparations; suivi des dépenses communiquées; rapport par véhicule.',
    },
    {
      id: 'pack_util_premium',
      equipmentType: 'UTILITAIRE',
      packName: 'PREMIUM',
      fleetScope: '16 à 30 véhicules',
      monthlyFeeNumeric: 200000,
      includedServices:
        'Business + tableau de bord consolidé; planning préventif; suivi des immobilisations déclarées; rapport détaillé.',
    },
    // 3. Packs pour poids lourds
    {
      id: 'pack_pl_starter',
      equipmentType: 'POIDS_LOURD',
      packName: 'STARTER',
      fleetScope: '1 à 3 camions',
      monthlyFeeNumeric: 75000,
      includedServices:
        'Dossiers et échéances; planning des contrôles et entretiens; kilométrage déclaré; historique des interventions communiquées; rapport mensuel.',
    },
    {
      id: 'pack_pl_business',
      equipmentType: 'POIDS_LOURD',
      packName: 'BUSINESS',
      fleetScope: '4 à 10 camions',
      monthlyFeeNumeric: 150000,
      includedServices:
        'Starter + planification des immobilisations; suivi du carburant déclaré; planning des pneus et réparations; synthèse des coûts par camion.',
    },
    {
      id: 'pack_pl_premium',
      equipmentType: 'POIDS_LOURD',
      packName: 'PREMIUM',
      fleetScope: '11 à 20 camions',
      monthlyFeeNumeric: 300000,
      includedServices:
        'Business + tableau de bord consolidé; suivi des échéances; analyse des coûts communiqués; réunion mensuelle de suivi.',
    },
    // 4. Packs pour engins de chantier
    {
      id: 'pack_engin_starter',
      equipmentType: 'ENGIN',
      packName: 'STARTER',
      fleetScope: '1 à 2 engins',
      monthlyFeeNumeric: 100000,
      includedServices:
        'Fiches administratives et techniques; heures moteur déclarées; calendrier d’entretien; échéances documentaires; rapport d’utilisation déclarée.',
    },
    {
      id: 'pack_engin_business',
      equipmentType: 'ENGIN',
      packName: 'BUSINESS',
      fleetScope: '3 à 5 engins',
      monthlyFeeNumeric: 200000,
      includedServices:
        'Starter + planning de maintenance préventive; suivi des pannes et interventions signalées; historique des pièces et dépenses déclarées; immobilisations.',
    },
    {
      id: 'pack_engin_premium',
      equipmentType: 'ENGIN',
      packName: 'PREMIUM',
      fleetScope: '6 à 10 engins',
      monthlyFeeNumeric: 350000,
      includedServices:
        'Business + tableau de bord par engin; planification consolidée; analyse des dépenses communiquées; rapport de disponibilité déclarée.',
    },
  ],
  complementaryOptions: [
    {
      id: 'opt_audit_initial',
      name: 'Audit administratif initial de la flotte',
      indicativeRate: '75 000 à 200 000 FCFA',
    },
    {
      id: 'opt_dossier_vehicule',
      name: 'Constitution du dossier de chaque véhicule',
      indicativeRate: '3 000 à 5 000 FCFA / unité',
    },
    {
      id: 'opt_dossier_engin',
      name: 'Constitution du dossier de chaque engin',
      indicativeRate: '10 000 à 20 000 FCFA / unité',
    },
    {
      id: 'opt_visite_inspection',
      name: 'Visite physique d’inspection au Bénin',
      indicativeRate: '15 000 à 50 000 FCFA / visite',
    },
    {
      id: 'opt_sinistre',
      name: 'Gestion renforcée d’un dossier de sinistre',
      indicativeRate: '10 000 à 30 000 FCFA / dossier',
    },
    {
      id: 'opt_rapport_audit',
      name: 'Rapport exceptionnel ou audit approfondi',
      indicativeRate: 'Sur devis',
    },
    {
      id: 'opt_gestionnaire_site',
      name: 'Gestionnaire présent régulièrement sur site',
      indicativeRate: 'Sur devis',
    },
    {
      id: 'opt_gps_telematique',
      name: 'Installation GPS / télématique',
      indicativeRate: 'Matériel, installation et abonnement sur devis',
    },
  ],
};

export const DEFAULT_FLEET_PACKAGES: FleetPackagePricing[] = [
  {
    id: 'essentiel',
    name: 'PACK ESSENTIEL',
    shortName: 'Essentiel',
    fleetSize: '1 à 10 véhicules',
    fleetRange: '1-10',
    monthlyPrice: '75 000 Francs / mois',
    monthlyPriceNumeric: 75000,
    setupFee: '100 000 Francs',
    setupFeeNumeric: 100000,
    accentColor: 'from-sky-500 to-blue-600',
    description: 'Gestion administrative, conformité documentaire et suivi des entretiens courants pour petites flottes.',
    services: [
      'Suivi administratif',
      'Gestion des documents et échéances',
      "Planning d'entretien",
      'Suivi des réparations courantes',
      'Rapport mensuel de flotte',
      'Assistance téléphonique',
    ],
    enabled: true,
  },
  {
    id: 'business',
    name: 'PACK BUSINESS',
    shortName: 'Business',
    fleetSize: '11 à 25 véhicules',
    fleetRange: '11-25',
    monthlyPrice: '150 000 Francs / mois',
    monthlyPriceNumeric: 150000,
    setupFee: '200 000 Francs',
    setupFeeNumeric: 200000,
    accentColor: 'from-blue-600 to-indigo-600',
    includedBase: 'Inclus Pack Essentiel +',
    description: 'Suivi rigoureux du carburant, kilométrage et gestion opérationnelle des conducteurs.',
    services: [
      'Suivi carburant',
      'Suivi kilométrique',
      'Planning préventif',
      'Gestion immobilisations',
      'Suivi conducteurs',
      'Tableau de bord mensuel',
    ],
    enabled: true,
  },
  {
    id: 'pro',
    name: 'PACK PRO',
    shortName: 'Pro',
    fleetSize: '26 à 50 véhicules',
    fleetRange: '26-50',
    monthlyPrice: '300 000 Francs / mois',
    monthlyPriceNumeric: 300000,
    setupFee: '300 000 Francs',
    setupFeeNumeric: 300000,
    isPopular: true,
    badge: 'Recommandé • Le plus plébiscité',
    badgeColor: 'bg-sky-600 text-white',
    accentColor: 'from-sky-600 to-indigo-700',
    includedBase: 'Inclus Pack Business +',
    description: 'Suivi analytique approfondi des coûts par véhicule, gestion des sinistres et revue mensuelle.',
    services: [
      'Suivi coûts par véhicule',
      'Gestion sinistres',
      'Analyse performances',
      'Réunion mensuelle',
    ],
    enabled: true,
  },
  {
    id: 'entreprise',
    name: 'PACK ENTREPRISE',
    shortName: 'Entreprise',
    fleetSize: '51 à 100 véhicules',
    fleetRange: '51-100',
    monthlyPrice: '550 000 Francs / mois',
    monthlyPriceNumeric: 550000,
    setupFee: '500 000 Francs',
    setupFeeNumeric: 500000,
    accentColor: 'from-indigo-700 to-purple-800',
    includedBase: 'Inclus Pack Pro +',
    description: 'Supervision d’envergure avec audits réguliers, contrôle budgétaire et responsable de compte dédié.',
    services: [
      'Audit de flotte régulier',
      'Contrôle des coûts',
      'Responsable de compte dédié',
    ],
    enabled: true,
  },
  {
    id: 'corporate',
    name: 'PACK CORPORATE',
    shortName: 'Corporate',
    fleetSize: '+ de 100 véhicules',
    fleetRange: '100+',
    monthlyPrice: 'À partir de 900 000 Francs / mois',
    monthlyPriceNumeric: 900000,
    setupFee: 'Sur devis',
    setupFeeNumeric: 750000,
    badge: 'Grands Comptes',
    badgeColor: 'bg-purple-900 text-purple-200',
    accentColor: 'from-purple-900 to-slate-900',
    description: 'Solution sur-mesure d’externalisation globale pour grands groupes, institutions et multinationales.',
    services: [
      'Destiné aux grandes entreprises',
      'Gestion sur-mesure et équipe dédiée sur site possible',
    ],
    note: 'Note : Tarification dégressive au véhicule possible sur demande.',
    enabled: true,
  },
];

export const DEFAULT_STORAGE_CATEGORIES: StorageCategoryPricing[] = [
  {
    id: 'light',
    name: 'Véhicule Léger (VP, Citadine, Berline)',
    surface: '12 m²',
    dailyRate: 3500,
    overstayRate: 5000,
    description: 'Emplacement individuel sécurisé sous hangar ou allée bitumée',
    enabled: true,
  },
  {
    id: 'suv_pickup',
    name: 'SUV, 4x4 & Pick-up Double Cabine',
    surface: '18 m²',
    dailyRate: 5000,
    overstayRate: 7000,
    description: 'Emplacement spacieux, garde au sol adaptée, surveillance continue 24/7',
    enabled: true,
  },
  {
    id: 'utility_van',
    name: 'Fourgon tôlé & Utilitaire léger (VUL)',
    surface: '25 m²',
    dailyRate: 7000,
    overstayRate: 9500,
    description: 'Hauteur sous plafond 3.5m, manœuvre aisée et baie de contrôle',
    enabled: true,
  },
  {
    id: 'bus_minibus',
    name: 'Minibus & Autocar de transport',
    surface: '35 m²',
    dailyRate: 9000,
    overstayRate: 12500,
    description: 'Accès voies larges, contrôle d’état carrosserie et baie d’inspection',
    enabled: true,
  },
  {
    id: 'heavy_truck',
    name: 'Poids Lourd, Camion Plateau & Transit Portuaire',
    surface: 'Plateforme Stabilisée',
    dailyRate: 15000,
    overstayRate: 20000,
    description: 'Accès convois industriels, sécurité 24/7 & proximité portuaire',
    enabled: true,
  },
  {
    id: 'container_trailer',
    name: 'Semi-Remorque & Conteneur (20ft / 40ft)',
    surface: 'Gros Tonnage',
    dailyRate: 20000,
    overstayRate: 28000,
    description: 'Zone sécurisée sous vidéo HD infrarouge et traçabilité par QR code',
    enabled: true,
  },
];

export const DEFAULT_RENTAL_FLEET_PRICING: RentalVehiclePricing[] = [
  {
    id: 'rent_veh_1',
    brand: 'Suzuki',
    model: 'Swift GLX Dualjet',
    year: 2024,
    category: 'CITADINE',
    plateNumber: 'BJ-4589-RB',
    dailyRateFcfa: 25000,
    weeklyRateFcfa: 155000,
    monthlyRateFcfa: 550000,
    depositFcfa: 100000,
    driverDailyFeeFcfa: 12000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
  },
  {
    id: 'rent_veh_2',
    brand: 'Toyota',
    model: 'Yaris Cross Hybride E-Four',
    year: 2023,
    category: 'CITADINE',
    plateNumber: 'BJ-8891-RB',
    dailyRateFcfa: 35000,
    weeklyRateFcfa: 215000,
    monthlyRateFcfa: 750000,
    depositFcfa: 120000,
    driverDailyFeeFcfa: 12000,
    isAvailable: true,
    currentLocation: 'Aéroport International (Accueil VIP)',
  },
  {
    id: 'rent_veh_3',
    brand: 'Toyota',
    model: 'Corolla Prestige Executive',
    year: 2023,
    category: 'BERLINE',
    plateNumber: 'BJ-3304-RB',
    dailyRateFcfa: 45000,
    weeklyRateFcfa: 275000,
    monthlyRateFcfa: 950000,
    depositFcfa: 150000,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
  },
  {
    id: 'rent_veh_4',
    brand: 'Toyota',
    model: 'Land Cruiser Prado TX-L V6',
    year: 2024,
    category: 'SUV_4X4',
    plateNumber: 'BJ-1122-PT',
    dailyRateFcfa: 85000,
    weeklyRateFcfa: 520000,
    monthlyRateFcfa: 1850000,
    depositFcfa: 250000,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Hub VIP & Centre d’Affaires',
  },
  {
    id: 'rent_veh_5',
    brand: 'Hyundai',
    model: 'Tucson N-Line Executive',
    year: 2023,
    category: 'SUV_4X4',
    plateNumber: 'BJ-3344-PT',
    dailyRateFcfa: 55000,
    weeklyRateFcfa: 340000,
    monthlyRateFcfa: 1190000,
    depositFcfa: 180000,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
  },
  {
    id: 'rent_veh_6',
    brand: 'Toyota',
    model: 'Hilux Double Cabine 4x4 Heavy Duty',
    year: 2023,
    category: 'PICKUP',
    plateNumber: 'BJ-7762-RB',
    dailyRateFcfa: 65000,
    weeklyRateFcfa: 390000,
    monthlyRateFcfa: 1390000,
    depositFcfa: 200000,
    driverDailyFeeFcfa: 15000,
    isAvailable: true,
    currentLocation: 'Hub Régional / Corridors Nord',
  },
  {
    id: 'rent_veh_7',
    brand: 'Toyota',
    model: 'HiAce VIP Minibus 15 Places',
    year: 2024,
    category: 'MINIBUS',
    plateNumber: 'BJ-5511-RB',
    dailyRateFcfa: 95000,
    weeklyRateFcfa: 580000,
    monthlyRateFcfa: 2100000,
    depositFcfa: 200000,
    driverDailyFeeFcfa: 0,
    isAvailable: true,
    currentLocation: 'Agence Centrale & Hub Urbain',
  },
  {
    id: 'rent_veh_8',
    brand: 'Mercedes-Benz',
    model: 'Classe E 200 Exclusive VIP',
    year: 2023,
    category: 'PRESTIGE',
    plateNumber: 'BJ-9900-RB',
    dailyRateFcfa: 120000,
    weeklyRateFcfa: 750000,
    monthlyRateFcfa: 2600000,
    depositFcfa: 350000,
    driverDailyFeeFcfa: 0,
    isAvailable: true,
    currentLocation: 'Hub VIP & Centre d’Affaires',
  },
];

export const DEFAULT_STORAGE_SETTINGS: StorageGeneralSettings = {
  graceHours: 2,
  washOptionRateFcfa: 3500,
  batteryOptionRateFcfa: 1500,
  tarpOptionRateFcfa: 2500,
  vatRatePercent: 0,
  currency: 'FCFA',
  managerNoticeEmail: 'direction@jmf-mobility.com',
  managerWhatsApp: '+229 01 97 83 21 21',
};

export const DEFAULT_RENTAL_BOOKINGS: RentalBookingRecord[] = [
  {
    id: 'book_pending_1',
    reference: 'LOC-BJ-2026-0902',
    vehicleId: 'rent_veh_2',
    vehicleName: 'Peugeot 3008 GT Line Allure',
    vehicleCategory: 'SUV_4X4',
    plateNumber: 'BJ-8831-RB',
    clientName: 'M. Fabrice DOSSOU-YOVO',
    clientType: 'PARTICULIER',
    clientPhone: '+229 97 45 67 89',
    clientEmail: 'f.dossou@africamail.bj',
    driverLicenseNumber: 'BJ-2019-1204-PC',
    startDate: '2026-10-12',
    startTime: '09:00',
    endDate: '2026-10-16',
    endTime: '18:00',
    daysCount: 4,
    withDriver: true,
    pickupLocation: 'Agence Centrale & Hub Urbain',
    returnLocation: 'Aéroport International (Accueil VIP)',
    optionsSelected: ['Routeur Wi-Fi 4G nomade'],
    baseDailyRateFcfa: 55000,
    vehicleCostFcfa: 202400,
    driverCostFcfa: 60000,
    optionsCostFcfa: 20000,
    discountFcfa: 17600,
    penaltyDays: 0,
    penaltyDailyRateFcfa: 74250,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 282400,
    depositFcfa: 200000,
    paymentMethod: 'MOMO',
    status: 'EN_ATTENTE_ACOMPTE',
    createdAt: 'Il y a 14 min',
    notes: 'Demande soumise en ligne, attente validation et confirmation acompte',
  },
  {
    id: 'book_pending_2',
    reference: 'LOC-BJ-2026-0905',
    vehicleId: 'rent_veh_6',
    vehicleName: 'Toyota Hilux Double Cabine 4x4',
    vehicleCategory: 'PICKUP',
    plateNumber: 'BJ-7762-RB',
    clientName: 'Société Béninoise d’Infrastructures (SBI)',
    clientType: 'ENTREPRISE',
    companyName: 'Société Béninoise d’Infrastructures (SBI)',
    companyIfu: '3202200981456',
    clientPhone: '+229 96 44 22 11',
    clientEmail: 'logistique@sbi-benin.bj',
    startDate: '2026-10-15',
    startTime: '07:30',
    endDate: '2026-10-22',
    endTime: '18:00',
    daysCount: 7,
    withDriver: false,
    pickupLocation: 'Antenne Parakou / Corridors Nord',
    returnLocation: 'Antenne Parakou / Corridors Nord',
    optionsSelected: ['Forfait Kilométrage Illimité'],
    baseDailyRateFcfa: 65000,
    vehicleCostFcfa: 386750,
    driverCostFcfa: 0,
    optionsCostFcfa: 70000,
    discountFcfa: 68250,
    penaltyDays: 0,
    penaltyDailyRateFcfa: 87750,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 456750,
    depositFcfa: 200000,
    paymentMethod: 'TRANSFER',
    status: 'EN_ATTENTE_ACOMPTE',
    createdAt: 'Il y a 32 min',
    notes: 'Devis proforma généré, en attente de bon de commande officiel',
  },
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
    penaltyDays: 0,
    penaltyDailyRateFcfa: 114750,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 392800,
    depositFcfa: 250000,
    paymentMethod: 'TRANSFER',
    status: 'CONFIRMÉE',
    createdAt: '2026-10-06 14:20',
    notes: 'Vol Air France AF804 arrivée 19h15. Accueil VIP.',
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
    penaltyDays: 0,
    penaltyDailyRateFcfa: 60750,
    totalPenaltyFcfa: 0,
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
    clientName: 'Consortium BTP Bénin-Nord',
    clientType: 'ENTREPRISE',
    companyName: 'Consortium BTP Bénin-Nord',
    companyIfu: '3202100874519',
    clientPhone: '+229 96 12 34 56',
    clientEmail: 'logistique@btp-benin.bj',
    startDate: '2026-09-20',
    startTime: '08:00',
    endDate: '2026-09-30',
    endTime: '18:00',
    daysCount: 10,
    withDriver: true,
    driverName: 'Koffi AGBOHOUN (Certifié JMF)',
    pickupLocation: 'Antenne Parakou / Corridors Nord',
    returnLocation: 'Antenne Parakou / Corridors Nord',
    optionsSelected: ['Kit Outillage Pistes & Dépannage'],
    baseDailyRateFcfa: 65000,
    vehicleCostFcfa: 552500,
    driverCostFcfa: 150000,
    optionsCostFcfa: 0,
    discountFcfa: 97500,
    penaltyDays: 0,
    penaltyDailyRateFcfa: 87750,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 702500,
    depositFcfa: 200000,
    paymentMethod: 'AGENCY',
    status: 'TERMINÉE',
    createdAt: '2026-09-18 09:30',
  },
  {
    id: 'book_4',
    reference: 'LOC-BJ-2026-0865',
    vehicleId: 'rent_veh_1',
    vehicleName: 'Suzuki Swift GLX Dualjet',
    vehicleCategory: 'CITADINE',
    plateNumber: 'BJ-4589-RB',
    clientName: 'Mme Sandrine HOUNGBEDJI',
    clientType: 'PARTICULIER',
    clientPhone: '+229 97 11 22 33',
    clientEmail: 'sandrine.houng@gmail.com',
    driverLicenseNumber: 'BJ-2021-0811-PC',
    startDate: '2026-10-06',
    startTime: '10:00',
    endDate: '2026-10-09',
    endTime: '18:00',
    daysCount: 3,
    withDriver: false,
    pickupLocation: 'Agence Centrale & Hub Urbain',
    returnLocation: 'Agence Centrale & Hub Urbain',
    optionsSelected: ['Routeur Wi-Fi 4G nomade'],
    baseDailyRateFcfa: 25000,
    vehicleCostFcfa: 69000,
    driverCostFcfa: 0,
    optionsCostFcfa: 15000,
    discountFcfa: 6000,
    penaltyDays: 1,
    penaltyDailyRateFcfa: 33750,
    totalPenaltyFcfa: 33750,
    totalAmountFcfa: 117750,
    depositFcfa: 100000,
    paymentMethod: 'CARD',
    status: 'EN_COURS',
    createdAt: '2026-10-05 16:45',
    notes: 'Prolongation de 1 jour convenue avec pénalité forfaitaire.',
  },
  {
    id: 'book_5',
    reference: 'LOC-BJ-2026-0855',
    vehicleId: 'rent_veh_8',
    vehicleName: 'Mercedes-Benz Classe E 200 VIP',
    vehicleCategory: 'PRESTIGE',
    plateNumber: 'BJ-9900-RB',
    clientName: 'Banque Ouest-Africaine de Développement',
    clientType: 'ENTREPRISE',
    companyName: 'BOAD Régionale',
    companyIfu: '3201900142851',
    clientPhone: '+229 95 00 11 22',
    clientEmail: 'protocole@boad-afrique.org',
    startDate: '2026-10-10',
    startTime: '08:00',
    endDate: '2026-10-15',
    endTime: '20:00',
    daysCount: 5,
    withDriver: true,
    driverName: 'Chauffeur VIP JMF Protocol',
    pickupLocation: 'Aéroport International (Accueil VIP)',
    returnLocation: 'Hub VIP & Centre d’Affaires',
    optionsSelected: ['Assurance Tous Risques Prestige', 'Chauffeur VIP inclus'],
    baseDailyRateFcfa: 120000,
    vehicleCostFcfa: 552000,
    driverCostFcfa: 0,
    optionsCostFcfa: 0,
    discountFcfa: 48000,
    penaltyDays: 0,
    penaltyDailyRateFcfa: 162000,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 552000,
    depositFcfa: 350000,
    paymentMethod: 'TRANSFER',
    status: 'CONFIRMÉE',
    createdAt: '2026-10-06 18:00',
    notes: 'Accueil délégation officielle sommet régional.',
  },
  {
    id: 'book_6',
    reference: 'LOC-BJ-2026-0840',
    vehicleId: 'rent_veh_7',
    vehicleName: 'Toyota HiAce Minibus 15 Places',
    vehicleCategory: 'MINIBUS',
    plateNumber: 'BJ-5541-RB',
    clientName: 'Délégation Institutionnelle & Ministères',
    clientType: 'ENTREPRISE',
    companyName: 'Direction de la Logistique Gouvernementale',
    companyIfu: '3201800001452',
    clientPhone: '+229 97 00 33 44',
    clientEmail: 'dg-logistique@institution-afrique.org',
    startDate: '2026-09-10',
    startTime: '07:30',
    endDate: '2026-09-17',
    endTime: '19:00',
    daysCount: 7,
    withDriver: true,
    driverName: 'Chauffeur Minibus Agréé JMF',
    pickupLocation: 'Agence Centrale & Hub Urbain',
    returnLocation: 'Agence Centrale & Hub Urbain',
    optionsSelected: ['Chauffeur VIP inclus'],
    baseDailyRateFcfa: 75000,
    vehicleCostFcfa: 446250,
    driverCostFcfa: 0,
    optionsCostFcfa: 0,
    discountFcfa: 78750,
    penaltyDays: 0,
    penaltyDailyRateFcfa: 101250,
    totalPenaltyFcfa: 0,
    totalAmountFcfa: 446250,
    depositFcfa: 200000,
    paymentMethod: 'TRANSFER',
    status: 'TERMINÉE',
    createdAt: '2026-09-08 10:30',
  },
];

class PricingService {
  private notify() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(EVENT_NAME));
    }
  }

  // --- STORAGE CATEGORIES ---
  getStorageCategories(): StorageCategoryPricing[] {
    if (typeof window === 'undefined') return DEFAULT_STORAGE_CATEGORIES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CATEGORIES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_STORAGE_CATEGORIES;
  }

  saveStorageCategory(category: StorageCategoryPricing, adminUser = 'Administrateur JMF'): void {
    const list = this.getStorageCategories();
    const index = list.findIndex((c) => c.id === category.id);
    let oldDesc = '';
    if (index >= 0) {
      oldDesc = `Tarif: ${list[index].dailyRate} ➔ ${category.dailyRate} FCFA, Dépassement: ${list[index].overstayRate} ➔ ${category.overstayRate} FCFA`;
      list[index] = category;
    } else {
      oldDesc = `Nouvelle catégorie créée : ${category.name} (${category.dailyRate} FCFA/j)`;
      list.push(category);
    }
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(list));
      this.addAuditLog({
        user: adminUser,
        itemType: 'STORAGE',
        itemName: category.name,
        changeDescription: oldDesc,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde catégorie stockage', e);
    }
  }

  saveAllStorageCategories(categories: StorageCategoryPricing[], adminUser = 'Administrateur JMF'): void {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
      this.addAuditLog({
        user: adminUser,
        itemType: 'STORAGE',
        itemName: 'Grille Tarifs Emplacements & Dépassements',
        changeDescription: `Mise à jour globale de ${categories.length} catégories de stockage`,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde catégories', e);
    }
  }

  resetStorageCategories(adminUser = 'Administrateur JMF'): StorageCategoryPricing[] {
    try {
      localStorage.removeItem(STORAGE_KEY_CATEGORIES);
      this.addAuditLog({
        user: adminUser,
        itemType: 'STORAGE',
        itemName: 'Grille Tarifs Emplacements',
        changeDescription: 'Rétablissement des tarifs d’origine standardisés',
      });
      this.notify();
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_STORAGE_CATEGORIES;
  }

  // --- RENTAL FLEET ---
  getRentalFleetPricing(): RentalVehiclePricing[] {
    if (typeof window === 'undefined') return DEFAULT_RENTAL_FLEET_PRICING;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FLEET);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_RENTAL_FLEET_PRICING;
  }

  saveRentalVehiclePricing(vehicle: RentalVehiclePricing, adminUser = 'Administrateur JMF'): void {
    const list = this.getRentalFleetPricing();
    const index = list.findIndex((v) => v.id === vehicle.id);
    let desc = '';
    if (index >= 0) {
      desc = `Jour: ${list[index].dailyRateFcfa} ➔ ${vehicle.dailyRateFcfa} FCFA, Caution: ${list[index].depositFcfa} ➔ ${vehicle.depositFcfa} FCFA`;
      list[index] = vehicle;
    } else {
      desc = `Ajout véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.dailyRateFcfa} FCFA/j)`;
      list.push(vehicle);
    }
    try {
      localStorage.setItem(STORAGE_KEY_FLEET, JSON.stringify(list));
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: `${vehicle.brand} ${vehicle.model} (${vehicle.plateNumber})`,
        changeDescription: desc,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde véhicule location', e);
    }
  }

  saveAllRentalFleetPricing(fleet: RentalVehiclePricing[], adminUser = 'Administrateur JMF'): void {
    try {
      localStorage.setItem(STORAGE_KEY_FLEET, JSON.stringify(fleet));
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: 'Grille Tarifaire Flotte Location',
        changeDescription: `Mise à jour en bloc de ${fleet.length} véhicules`,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde flotte location', e);
    }
  }

  resetRentalFleetPricing(adminUser = 'Administrateur JMF'): RentalVehiclePricing[] {
    try {
      localStorage.removeItem(STORAGE_KEY_FLEET);
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: 'Grille Tarifaire Flotte Location',
        changeDescription: 'Rétablissement des forfaits par défaut',
      });
      this.notify();
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_RENTAL_FLEET_PRICING;
  }

  // --- FLEET 360 PACKAGES ---
  getFleetPackages(): FleetPackagePricing[] {
    if (typeof window === 'undefined') return DEFAULT_FLEET_PACKAGES;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_FLEET_PACKAGES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_FLEET_PACKAGES;
  }

  saveFleetPackage(pack: FleetPackagePricing, adminUser = 'Administrateur JMF'): void {
    const list = this.getFleetPackages();
    const index = list.findIndex((p) => p.id === pack.id);
    let oldDesc = '';
    // Format monthlyPrice string to match numerical value
    const formattedMonthly = pack.id === 'corporate'
      ? `À partir de ${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} Francs / mois`
      : `${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} Francs / mois`;
    const formattedSetup = pack.setupFeeNumeric && pack.setupFeeNumeric > 0
      ? `${pack.setupFeeNumeric.toLocaleString('fr-FR')} Francs`
      : pack.setupFee || 'Sur devis';

    const updatedPack: FleetPackagePricing = {
      ...pack,
      monthlyPrice: formattedMonthly,
      setupFee: formattedSetup,
    };

    if (index >= 0) {
      oldDesc = `Prix mensuel : ${list[index].monthlyPriceNumeric.toLocaleString('fr-FR')} ➔ ${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} FCFA, Setup : ${list[index].setupFeeNumeric || 0} ➔ ${pack.setupFeeNumeric || 0} FCFA`;
      list[index] = updatedPack;
    } else {
      oldDesc = `Nouvelle formule flotte : ${pack.name} (${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} FCFA/mois)`;
      list.push(updatedPack);
    }
    try {
      localStorage.setItem(STORAGE_KEY_FLEET_PACKAGES, JSON.stringify(list));
      this.addAuditLog({
        user: adminUser,
        itemType: 'FLEET_PACK',
        itemName: pack.name,
        changeDescription: oldDesc,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde formule flotte', e);
    }
  }

  saveAllFleetPackages(packs: FleetPackagePricing[], adminUser = 'Administrateur JMF'): void {
    const normalized = packs.map((pack) => {
      const formattedMonthly = pack.id === 'corporate'
        ? `À partir de ${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} Francs / mois`
        : `${pack.monthlyPriceNumeric.toLocaleString('fr-FR')} Francs / mois`;
      const formattedSetup = pack.setupFeeNumeric && pack.setupFeeNumeric > 0
        ? `${pack.setupFeeNumeric.toLocaleString('fr-FR')} Francs`
        : pack.setupFee || 'Sur devis';
      return {
        ...pack,
        monthlyPrice: formattedMonthly,
        setupFee: formattedSetup,
      };
    });
    try {
      localStorage.setItem(STORAGE_KEY_FLEET_PACKAGES, JSON.stringify(normalized));
      this.addAuditLog({
        user: adminUser,
        itemType: 'FLEET_PACK',
        itemName: 'Grille Formules Gestion de Flotte 360°',
        changeDescription: `Mise à jour globale de ${packs.length} formules de gestion de flotte`,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde globale formules flotte', e);
    }
  }

  resetFleetPackages(adminUser = 'Administrateur JMF'): FleetPackagePricing[] {
    try {
      localStorage.removeItem(STORAGE_KEY_FLEET_PACKAGES);
      this.addAuditLog({
        user: adminUser,
        itemType: 'FLEET_PACK',
        itemName: 'Grille Formules Gestion de Flotte 360°',
        changeDescription: 'Rétablissement des tarifs d’origine certifiés JMF',
      });
      this.notify();
    } catch (e) {
      console.error('Erreur réinitialisation formules flotte', e);
    }
    return DEFAULT_FLEET_PACKAGES;
  }

  // --- PRO TARIFF GRID (BÉNIN : UTILITAIRES, POIDS LOURDS, ENGINS) ---
  getProTariffGrid(): ProTariffGridData {
    if (typeof window === 'undefined') return DEFAULT_PRO_TARIFF_GRID;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRO_TARIFF_GRID);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.unitRates) && Array.isArray(parsed.categoryPacks)) {
          return {
            unitRates: parsed.unitRates,
            categoryPacks: parsed.categoryPacks,
            complementaryOptions: parsed.complementaryOptions || DEFAULT_PRO_TARIFF_GRID.complementaryOptions,
          };
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_PRO_TARIFF_GRID;
  }

  saveProTariffGrid(grid: ProTariffGridData, adminUser = 'Administrateur JMF'): void {
    try {
      localStorage.setItem(STORAGE_KEY_PRO_TARIFF_GRID, JSON.stringify(grid));
      this.addAuditLog({
        user: adminUser,
        itemType: 'FLEET_PACK',
        itemName: 'Grille Tarifaire Professionnelle (Utilitaires, Poids Lourds, Engins)',
        changeDescription: 'Mise à jour des tarifs unitaires, packs par équipement et options complémentaires',
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde grille tarifaire professionnelle', e);
    }
  }

  resetProTariffGrid(adminUser = 'Administrateur JMF'): ProTariffGridData {
    try {
      localStorage.removeItem(STORAGE_KEY_PRO_TARIFF_GRID);
      this.addAuditLog({
        user: adminUser,
        itemType: 'FLEET_PACK',
        itemName: 'Grille Tarifaire Professionnelle (Utilitaires, Poids Lourds, Engins)',
        changeDescription: 'Rétablissement de la grille officielle Bénin par défaut',
      });
      this.notify();
    } catch (e) {
      console.error('Erreur réinitialisation grille tarifaire professionnelle', e);
    }
    return DEFAULT_PRO_TARIFF_GRID;
  }

  // --- GENERAL SETTINGS ---
  getStorageGeneralSettings(): StorageGeneralSettings {
    if (typeof window === 'undefined') return DEFAULT_STORAGE_SETTINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_STORAGE_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignore
    }
    return DEFAULT_STORAGE_SETTINGS;
  }

  saveStorageGeneralSettings(settings: StorageGeneralSettings, adminUser = 'Administrateur JMF'): void {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
      this.addAuditLog({
        user: adminUser,
        itemType: 'SETTING',
        itemName: 'Paramètres Généraux Tarifs & Overstay',
        changeDescription: `Franchise tolérance: ${settings.graceHours}h, Lavage: ${settings.washOptionRateFcfa} FCFA`,
      });
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  // --- RENTAL BOOKINGS ---
  getRentalBookings(): RentalBookingRecord[] {
    if (typeof window === 'undefined') return DEFAULT_RENTAL_BOOKINGS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_BOOKINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore
    }
    return DEFAULT_RENTAL_BOOKINGS;
  }

  saveRentalBooking(booking: RentalBookingRecord, adminUser = 'Administrateur JMF'): void {
    const list = this.getRentalBookings();
    const index = list.findIndex((b) => b.id === booking.id || b.reference === booking.reference);
    let desc = '';
    if (index >= 0) {
      desc = `Mise à jour contrat ${booking.reference} (${booking.clientName}) : Statut ${booking.status}`;
      list[index] = booking;
    } else {
      desc = `Nouveau contrat ${booking.reference} (${booking.clientName}) : ${booking.totalAmountFcfa} FCFA`;
      list.unshift(booking);
    }
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: `Contrat ${booking.reference}`,
        changeDescription: desc,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde contrat location', e);
    }
  }

  saveAllRentalBookings(bookings: RentalBookingRecord[], adminUser = 'Administrateur JMF'): void {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: 'Base Contrats Location',
        changeDescription: `Synchronisation de ${bookings.length} dossiers`,
      });
      this.notify();
    } catch (e) {
      console.error('Erreur sauvegarde globale contrats', e);
    }
  }

  updateRentalBookingStatus(id: string, newStatus: RentalBookingRecord['status'], adminUser = 'Administrateur JMF'): boolean {
    const list = this.getRentalBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index >= 0) {
      const prevStatus = list[index].status;
      list[index].status = newStatus;
      try {
        localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(list));
        this.addAuditLog({
          user: adminUser,
          itemType: 'VEHICLE',
          itemName: `Contrat ${list[index].reference}`,
          changeDescription: `Changement de statut : ${prevStatus} ➔ ${newStatus}`,
        });
        this.notify();
        return true;
      } catch (e) {
        console.error(e);
      }
    }
    return false;
  }

  deleteRentalBooking(id: string, adminUser = 'Administrateur JMF'): boolean {
    const list = this.getRentalBookings();
    const target = list.find((b) => b.id === id);
    if (!target) return false;
    const filtered = list.filter((b) => b.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(filtered));
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: `Contrat ${target.reference}`,
        changeDescription: `Suppression du dossier ${target.reference} (${target.clientName})`,
      });
      this.notify();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  resetRentalBookings(adminUser = 'Administrateur JMF'): RentalBookingRecord[] {
    try {
      localStorage.removeItem(STORAGE_KEY_BOOKINGS);
      this.addAuditLog({
        user: adminUser,
        itemType: 'VEHICLE',
        itemName: 'Base Contrats Location',
        changeDescription: 'Rétablissement des dossiers de démonstration certifiés',
      });
      this.notify();
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_RENTAL_BOOKINGS;
  }

  // --- AUDIT LOGS ---
  getPricingAuditLogs(): PricingAuditLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY_AUDIT);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignore
    }
    return [
      {
        id: 'audit-init-1',
        timestamp: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR'),
        user: 'Super Administrateur JMF',
        itemType: 'SETTING',
        itemName: 'Initialisation Grille Tarifaire',
        changeDescription: 'Synchronisation des barèmes officiels et grilles tarifaires flotte',
      },
    ];
  }

  addAuditLog(entry: Omit<PricingAuditLog, 'id' | 'timestamp'>): void {
    try {
      const list = this.getPricingAuditLogs();
      const newEntry: PricingAuditLog = {
        id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleDateString('fr-FR') + ' à ' + new Date().toLocaleTimeString('fr-FR'),
        ...entry,
      };
      const updated = [newEntry, ...list].slice(0, 50); // Garder les 50 dernières entrées
      localStorage.setItem(STORAGE_KEY_AUDIT, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  clearAuditLogs(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_AUDIT);
      this.notify();
    } catch {
      // Ignore
    }
  }

  // --- SUBSCRIPTION ---
  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const handler = () => callback();
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }
}

export const pricingService = new PricingService();
