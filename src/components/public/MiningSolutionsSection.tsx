import React, { useState } from 'react';
import {
  HardHat,
  Truck,
  Users,
  Radio,
  Wrench,
  ShieldAlert,
  Key,
  TrendingDown,
  ArrowRight,
  CheckCircle2,
  Phone,
  Shield,
  Clock,
  Zap,
  Activity,
  FileText,
  X,
  Compass,
  AlertTriangle,
  MapPin,
  Settings,
  Check,
  Table,
  Grid3X3,
  SlidersHorizontal,
  ChevronRight,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface MiningSolutionsSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const MiningSolutionsSection: React.FC<MiningSolutionsSectionProps> = ({ onSelectService }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'matrix' | 'diagnostic'>('grid');
  const [activeCategory, setActiveCategory] = useState<'all' | 'vehicles' | 'safety' | 'operations'>('all');
  const [selectedFeatureModal, setSelectedFeatureModal] = useState<any | null>(null);

  // Diagnostic State
  const [diagSiteType, setDiagSiteType] = useState<'mine' | 'btp' | 'quarry'>('mine');
  const [diagChallenge, setDiagChallenge] = useState<'satellite' | 'tires' | 'maintenance' | 'safety'>('satellite');

  const miningPillars = [
    {
      num: '01',
      category: 'vehicles',
      categoryLabel: 'Matériel Renforcé',
      title: 'Flottes de Pick-up 4x4 Spécifiques Site Minier',
      icon: Truck,
      highlight: 'Arceaux ROPS & Blindage 6mm',
      specSheet: {
        veh: 'Pick-up 4x4 Double Cabine (Toyota Hilux Heavy-Duty / Land Cruiser série 79 / Isuzu D-Max)',
        chassis: 'Châssis renforcé, suspension lames arrière Heavy-Duty, surélévation garde au sol +50mm',
        safety: 'Arceau de sécurité intérieur/extérieur certifié ROPS anti-écrasement (normes minières)',
        protection: 'Blindage intégral sous caisse (ski carter moteur alu/acier 6mm, boîte de transfert, réservoir)',
        signaling: 'Gyrophare LED orange flash, drapeau de sécurité flexible 3m, bandes rétro-réfléchissantes classe 2',
      },
      desc: 'Pick-up 4x4 lourdement préparés pour les environnements abrasifs, pistes latéritiques et fronts de taille.',
      points: [
        'Arceaux de sécurité intérieurs et extérieurs certifiés ROPS anti-tonneaux',
        'Ski de protection carter moteur, boîte de transfert et réservoirs en acier/alu 6 mm',
        'Suspensions tout-terrain renforcées et filtration d’air désertique cyclonique',
        'Gyrophare LED orange, canne télescopique avec fanion 3 m et extincteurs de bord',
      ],
      tagline: 'Robustesse maximale sur pistes dégradées et sécurité d’équipage certifiée.',
    },
    {
      num: '02',
      category: 'safety',
      categoryLabel: 'Transport des Équipes',
      title: 'Navettes Sécurisées & Transport du Personnel',
      icon: Users,
      highlight: 'Ceintures 3 points & Alcootest',
      specSheet: {
        veh: 'Minibus 15 à 30 places climatisés (Toyota Coaster / Hiace Commuter 4x4)',
        safety: 'Ceintures de sécurité 3 points à enrouleur sur l\'intégralité des sièges passagers',
        protocols: 'Contrôle éthylotest obligatoire à zéro tolérance avant chaque départ de rotation',
        dispatch: 'Planning de rotations automatisé adapté aux cycles miniers 3x8 et 2x12',
        equipment: 'Trousse de secours grands chantiers, marteaux brise-vitres et coupe-ceintures',
      },
      desc: 'Organisation quotidienne des transferts base-vie vers front d’extraction en minibus climatisés renforcés.',
      points: [
        'Minibus 15 à 30 places climatisés, équipés de suspensions pistes renforcées',
        'Ceinture 3 points à enrouleur sur 100% des places assises',
        'Protocole éthylotest électronique systématique avant chaque prise de service',
        'Planification rigoureuse synchronisée avec les relèves d’équipes 3x8 ou 2x12',
      ],
      tagline: 'Zéro compromis sur la sécurité et le confort des travailleurs de site.',
    },
    {
      num: '03',
      category: 'vehicles',
      categoryLabel: 'Poids Lourds & Engins',
      title: 'Supervision & Maintenance Utilitaires Lourds',
      icon: Truck,
      highlight: 'Horamètres & Double Filtration',
      specSheet: {
        veh: 'Camions bennes 6x4, 8x4 et porte-chars pour transfert d\'engins lourds',
        monitoring: 'Suivi télématique direct des horamètres moteur et cycles de chauffe',
        filtration: 'Double filtration cyclonique et préfiltres centrifuges pour poussières siliceuses',
        tires: 'Pneumatiques profil roche renforcés anti-coupures et anti-arrachement',
        maintenance: 'Programme d\'analyse spectrographique des huiles moteur pour détection prédictive',
      },
      desc: 'Gestion opérationnelle des camions bennes, citernes d’arrosage et porte-engins avec suivi des heures moteur.',
      points: [
        'Suivi rigoureux des heures de fonctionnement réelles (horamètres télématiques)',
        'Programme strict de graissage haute pression et contrôle des organes hydrauliques',
        'Filtration d’air à bain d’huile et cyclonique contre l’abrasion de la poussière minière',
        'Audit d’usure et permutations régulières des trains de pneumatiques carrières',
      ],
      tagline: 'Disponibilité continue sur la chaîne d’extraction et de transport lourd.',
    },
    {
      num: '04',
      category: 'operations',
      categoryLabel: 'Télématique Satellitaire',
      title: 'Géolocalisation Hybride 4G & Satellite Iridium',
      icon: Radio,
      highlight: 'Couverture 100% Hors Réseau GSM',
      specSheet: {
        connectivity: 'Transmission double flux : Cellulaire 4G + Constellation satellite mondiale Iridium',
        emergency: 'Bouton SOS physique déporté avec alerte instantanée vers le PC Sécurité 24/7',
        sensors: 'Accéléromètre 3D industriel : détection de choc violent, retournement ou tonneau',
        geofence: 'Zones d\'exclusion virtuelles automatisées autour des tirs de mines et zones à risque',
        reports: 'Tableaux de bord d\'excès de vitesse sur pistes et infractions de zone en temps réel',
      },
      desc: 'Balises télématiques bi-modes garantissant un suivi temps réel sans rupture, même au cœur des zones blanches.',
      points: [
        'Basculement automatique 4G / Satellite Iridium dès la perte du signal GSM',
        'Bouton SOS d’urgence au tableau de bord relié à la cellule de veille JMF 24/7',
        'Détection instantanée de retournement de véhicule (capteur gyroscopique 3 axes)',
        'Barriérage virtuel (Geofencing) autour des périmètres de tirs de mine et zones interdites',
      ],
      tagline: 'Visibilité permanente sur vos véhicules, même en zone totalement isolée.',
    },
    {
      num: '05',
      category: 'operations',
      categoryLabel: 'Atelier Base-Vie',
      title: 'Ateliers Mobiles Tout-Terrain sur Base-Vie',
      icon: Wrench,
      highlight: 'Intervention < 30 minutes garantie',
      specSheet: {
        unit: 'Fourgon atelier 4x4 tout-terrain avec treuil avant 6T et compresseur thermique 10 bars',
        power: 'Groupe électrogène insonorisé 15 kVA et poste de soudure multi-procédés autonome',
        inventory: 'Stock tampon de pièces d\'usure critiques hébergé sur site (filtres, plaquettes, durites)',
        staff: 'Mécaniciens diésélistes et électromécaniciens chevronnés résidant sur base-vie',
        sla: 'Délai d\'intervention d\'urgence garanti sous 30 minutes sur la zone concédée',
      },
      desc: 'Unités mobiles autonomes d’intervention rapide et mécaniciens résidents déployés au cœur de votre site.',
      points: [
        'Fourgons ateliers 4x4 autonomes (compresseur d’air, groupe électrogène, poste à souder)',
        'Mécaniciens certifiés basés sur site pour entretien préventif et dépannage lourd',
        'Stock déporté de pièces d’usure critiques pour éliminer les délais d’approvisionnement',
        'Intervention d’urgence garantie sous 30 minutes sur l’ensemble du périmètre minier',
      ],
      tagline: 'L’atelier mécanique de pointe directement implanté à pied d’œuvre.',
    },
    {
      num: '06',
      category: 'safety',
      categoryLabel: 'Personnel Qualifié',
      title: 'Chauffeurs Certifiés Conduite Hors-Piste & HSE',
      icon: HardHat,
      highlight: 'Formation Conduite Défensive 4x4',
      specSheet: {
        training: 'Certificat de conduite défensive hors-piste et franchissement 4x4 validé',
        protocols: 'Formation approfondie aux angles morts des tombereaux et dumpers de 100 tonnes',
        medical: 'Visites médicales semestrielles d\'aptitude physique et acuité visuelle',
        monitoring: 'Suivi télématique direct de l\'éco-score et détection des signes de somnolence',
        charter: 'Adhésion formelle à la charte Tolérance Zéro alcool et stupéfiants',
      },
      desc: 'Conducteurs professionnels formés aux protocoles de carrières, respect des règles HSE et angles morts des dumpers.',
      points: [
        'Formation certifiante Conduite Défensive 4x4 et franchissement sur sols meubles',
        'Sensibilisation aux angles morts des tombereaux et dumpers de grande capacité',
        'Respect strict des règles HSE du maître d’ouvrage et protocoles de priorité de piste',
        'Suivi continu par télématique (Eco-Score, freinages brusques, vitesse adaptée)',
      ],
      tagline: 'Des chauffeurs rigoureux formés aux réalités extrêmes du terrain industriel.',
    },
    {
      num: '07',
      category: 'safety',
      categoryLabel: 'Conformité HSE',
      title: 'Sécurité Routière & Protocoles Réglementaires',
      icon: ShieldAlert,
      highlight: 'Normes ICMM, ISO 39001 & OHSAS',
      specSheet: {
        standards: 'Alignement rigoureux sur les normes internationales (ICMM, ISO 39001, OHSAS 18001)',
        inspections: 'Contrôle quotidien de pré-démarrage (Check-list numérique avant chaque rotation)',
        environment: 'Kits anti-pollution hydrocarbures et bacs de rétention pour huiles usagées',
        equipment: 'EPI complets normalisés : casque avec jugulaire, gilet haute visibilité, chaussures S3',
        reporting: 'Tableau mensuel de suivi des quasi-accidents (Near Miss) et plan d\'action correctif',
      },
      desc: 'Alignement sur les normes internationales de santé, sécurité et environnement des majors de l’industrie.',
      points: [
        'Conformité stricte aux standards des grands groupes miniers et chantiers BTP',
        'Check-list quotidienne de pré-démarrage dématérialisée sur smartphone/tablette',
        'Kits anti-déversement d’hydrocarbures et bacs de rétention pour la protection environnementale',
        'Port des Équipements de Protection Individuelle (EPI) complets et certifiés',
      ],
      tagline: 'Un cadre d’intervention audité pour viser l’Objectif Zéro Accident.',
    },
    {
      num: '08',
      category: 'vehicles',
      categoryLabel: 'Location Spécifique',
      title: 'Location Longue Durée Tout-Terrain Clé en Main',
      icon: Key,
      highlight: 'Véhicule Relais sous 24h sur Site',
      specSheet: {
        flexibility: 'Contrats de 1 mois à 48 mois synchronisés avec le phasage de vos chantiers',
        readiness: 'Véhicules livrés rodés, homologués et prêts pour entrée immédiate sur site',
        replacement: 'Véhicule de remplacement de gabarit équivalent garanti sous 24h sur base-vie',
        allInclusive: 'Assurance tous risques industrielle, maintenance intégrale et pneumatiques inclus',
        reporting: 'Facturation unifiée par centre de coût ou par tranche de travaux',
      },
      desc: 'Formules LLD et LCD calquées sur la durée de vos tranches de travaux, avec remplacement garanti.',
      points: [
        'Contrats souples et modulables selon l’avancement et le calendrier de votre chantier',
        'Flotte livrée pré-équipée selon le cahier des charges spécifique du site minier',
        'Véhicule de remplacement équivalent garanti sous 24h en cas d’aléa mécanique',
        'Gestion intégrée des assurances industrielles, pneumatiques et entretiens majeurs',
      ],
      tagline: 'Maîtrisez votre trésorerie sans alourdir votre bilan en immobilisations.',
    },
    {
      num: '09',
      category: 'operations',
      categoryLabel: 'TCO Conditions Sévères',
      title: 'Optimisation du TCO & Gestion des Pneus Piste',
      icon: TrendingDown,
      highlight: 'Gain de 15% à 22% sur les Coûts',
      specSheet: {
        methodology: 'Surveillance fine des coûts kilométriques sur sol latéritique et rocailleux',
        tires: 'Gestion informatisée du train de pneus (permutation dynamique et gonflage à l\'azote)',
        fuel: 'Contrôle volumétrique des pleins sur cuve chantier et télédétection des siphonnages',
        longevity: 'Prolongation de la durée de vie utile du parc de 25% grâce au préventif rigoureux',
        cfoReport: 'Rapports synthétiques pour directeurs administratifs et financiers (TCO par heure de fonctionnement)',
      },
      desc: 'Programme d’allongement de la durée de vie des pneumatiques et de réduction des coûts en milieu abrasif.',
      points: [
        'Surveillance télématique de la surconsommation de carburant sur pistes latéritiques',
        'Programme informatisé de permutation et contrôle de pression des pneus tout-terrain',
        'Réduction démontrée de 15% à 22% sur l’usure prématurée des organes de liaison au sol',
        'Rapports financiers périodiques de rentabilité et de coût de revient horaire/kilométrique',
      ],
      tagline: 'Le contrôle rigoureux de chaque franc CFA engagé sur vos pistes d’exploitation.',
    },
  ];

  const filteredPillars = activeCategory === 'all'
    ? miningPillars
    : miningPillars.filter(p => p.category === activeCategory);

  // Diagnostic recommendation helper
  const getDiagnosticRecommendation = () => {
    if (diagChallenge === 'satellite') {
      return {
        title: 'Pack Télématique Hybride Iridium + Cellulaire 4G',
        desc: 'Équipement de vos véhicules avec balises bi-mode 4G/Satellite avec bouton SOS et géolocalisation continue sans coupure hors couverture GSM.',
        sla: 'Visibilité 100% garantie temps réel • Alerte de choc en < 5 secondes',
        action: 'Intégrer le pack Télématique Satellite au devis',
      };
    }
    if (diagChallenge === 'tires') {
      return {
        title: 'Pack Gestion Pneumatiques Piste & Pression Active',
        desc: 'Sélection de profils mixtes/roche renforcés kevlar, stations de gonflage azote sur base-vie et permutations programmées.',
        sla: 'Gain démontré de +30% sur la longévité des trains de pneus',
        action: 'Intégrer le pack Optimisation Pneumatiques au devis',
      };
    }
    if (diagChallenge === 'maintenance') {
      return {
        title: 'Pack Unité Mobile Atelier & Stock Tampon Base-Vie',
        desc: 'Déploiement d\'un fourgon atelier 4x4 et mécanicien dédié logé sur votre base-vie avec pièces d\'usure courantes.',
        sla: 'Intervention sous 30 minutes garantie • Zéro arrêt extraction',
        action: 'Intégrer l\'Atelier Mobile Base-Vie au devis',
      };
    }
    return {
      title: 'Pack Chauffeurs Certifiés Hors-Piste & Audit HSE',
      desc: 'Mise à disposition de chauffeurs expérimentés formés aux angles morts et à la conduite défensive 4x4 en carrière.',
      sla: 'Contrôles alcootest quotidiens • Conformité ICMM/ISO 39001',
      action: 'Intégrer les Chauffeurs Minier au devis',
    };
  };

  const currentRecommendation = getDiagnosticRecommendation();

  return (
    <section id="mines" className="py-20 sm:py-24 bg-gradient-to-b from-slate-950 via-[#0B1527] to-slate-950 text-white relative overflow-hidden border-b border-slate-800">
      {/* Heavy-duty technical grid background */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute top-1/4 -right-40 w-[24rem] h-[24rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-[24rem] h-[24rem] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Professional constrained container (max-w-6xl for optimal readability and proportion) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-10 sm:space-y-12">
        {/* ================= HEADER SECTION ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 border-b border-slate-800/80 pb-8 sm:pb-10">
          <div className="space-y-3.5 max-w-2xl">
            {/* Unboxed Metadata Header (Anti-slop discipline) */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-amber-300">
                <HardHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Offre Spéciale · Secteur Minier & BTP</span>
              </span>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-slate-300">Afrique de l'Ouest</span>
              <span className="text-slate-600 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-emerald-400">Normes ICMM & HSE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Solutions pour les Entreprises Minières & Chantiers
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Une infrastructure opérationnelle complète dimensionnée pour les exigences sévères des concessions minières, carrières de granulats et corridors d’infrastructures lourdes : véhicules préparés, sécurité d'équipage, ateliers base-vie et télématique satellitaire.
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectService('Solutions Minières & BTP')}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Demander un audit de site</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:+2290197832121"
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Hotline Chantiers (+229)</span>
            </a>
          </div>
        </div>

        {/* ================= KEY PERFORMANCE METRICS BAR ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800/90 shadow-xl backdrop-blur-md">
          <div className="p-3 border-l-2 border-amber-500 space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-white">0 Incident</div>
            <div className="text-[11px] sm:text-xs text-amber-400 font-bold uppercase tracking-wide">Zéro Accident</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Protocoles HSE & Alcootest</div>
          </div>

          <div className="p-3 border-l-2 border-sky-500 space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-white">&lt; 30 min</div>
            <div className="text-[11px] sm:text-xs text-sky-400 font-bold uppercase tracking-wide">Délai d'intervention</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Ateliers mobiles sur base-vie</div>
          </div>

          <div className="p-3 border-l-2 border-emerald-500 space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-white">100% Hybride</div>
            <div className="text-[11px] sm:text-xs text-emerald-400 font-bold uppercase tracking-wide">Suivi Satellite</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Visibilité continue hors GSM</div>
          </div>

          <div className="p-3 border-l-2 border-purple-500 space-y-1">
            <div className="text-xl sm:text-2xl font-black font-mono text-white">-18%</div>
            <div className="text-[11px] sm:text-xs text-purple-400 font-bold uppercase tracking-wide">Coûts d'usure piste</div>
            <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal">Pneus & carburant maîtrisés</div>
          </div>
        </div>

        {/* ================= EXECUTIVE VIEW MODE TOGGLE & CATEGORY CONTROLS ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2 bg-slate-900/90 border border-slate-800 rounded-2xl">
          {/* Segmented View Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>Cartes des Pôles ({miningPillars.length})</span>
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Tableau de Synthèse</span>
            </button>
            <button
              onClick={() => setViewMode('diagnostic')}
              className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'diagnostic'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Diagnostic Chantier</span>
            </button>
          </div>

          {/* Category Filter (only for grid view) */}
          {viewMode === 'grid' && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Tous (9)
              </button>
              <button
                onClick={() => setActiveCategory('vehicles')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'vehicles'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Flotte 4x4 & Poids Lourds
              </button>
              <button
                onClick={() => setActiveCategory('safety')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'safety'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Sécurité HSE & Chauffeurs
              </button>
              <button
                onClick={() => setActiveCategory('operations')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                  activeCategory === 'operations'
                    ? 'bg-slate-800 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Atelier Base-Vie & Télématique
              </button>
            </div>
          )}
        </div>

        {/* ================= VIEW 1 : GRID VIEW (CARDS DES PÔLES) ================= */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-in fade-in duration-200">
            {filteredPillars.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="group relative bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-amber-500/70 hover:bg-slate-850 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 p-6 flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle corner watermark number */}
                  <div className="absolute top-3 right-3 text-3xl font-black font-mono text-slate-800/60 group-hover:text-amber-500/10 transition-colors pointer-events-none select-none">
                    {item.num}
                  </div>

                  <div className="space-y-4 relative z-10">
                    {/* Header: Icon + Category + Badge */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-amber-500/20 transition-all duration-200 shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase block">
                            PÔLE {item.num}
                          </span>
                          <span className="text-xs font-semibold text-slate-300 block">
                            {item.categoryLabel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Technical Highlight Badge */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/30 text-amber-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {item.highlight}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div className="space-y-1.5">
                      <h3 className="text-base font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>

                    {/* 3 Key Deliverables */}
                    <div className="pt-3 border-t border-slate-800/60 space-y-2">
                      {item.points.slice(0, 3).map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>

                    {/* Professional Tagline */}
                    {item.tagline && (
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] font-medium text-slate-300 italic">
                        « {item.tagline} »
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 mt-5 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                    <button
                      onClick={() => setSelectedFeatureModal(item)}
                      className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-800/60"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>Fiche technique</span>
                    </button>

                    <button
                      onClick={() => onSelectService(item.title)}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-amber-500/20"
                    >
                      <span>Ajouter au devis</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ================= VIEW 2 : EXECUTIVE MATRIX VIEW ================= */}
        {viewMode === 'matrix' && (
          <div className="bg-slate-900/95 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-5">Pôle Industriel</th>
                    <th className="py-4 px-5">Spécification Technique Clé</th>
                    <th className="py-4 px-5">Norme / Exigence HSE</th>
                    <th className="py-4 px-5">Engagement SLA / Délai</th>
                    <th className="py-4 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {miningPillars.map((p) => (
                    <tr key={p.num} className="hover:bg-slate-850/80 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-white flex items-center gap-2.5">
                        <span className="font-mono text-amber-400">{p.num}</span>
                        <span>{p.title}</span>
                      </td>
                      <td className="py-3.5 px-5 font-mono text-amber-300/90">{p.highlight}</td>
                      <td className="py-3.5 px-5 text-slate-300">
                        {p.category === 'safety' ? 'Normes ICMM & ISO 39001' : p.category === 'vehicles' ? 'ROPS / Protection carter 6mm' : 'Balises Iridium bi-modes'}
                      </td>
                      <td className="py-3.5 px-5 text-slate-300 font-mono">
                        {p.category === 'operations' ? '< 30 min sur base-vie' : 'Disponibilité 24/7'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => setSelectedFeatureModal(p)}
                            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                            title="Voir la fiche technique"
                          >
                            <FileText className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() => onSelectService(p.title)}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-sans text-xs transition-colors"
                          >
                            Devis
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= VIEW 3 : INTERACTIVE DIAGNOSTIC ================= */}
        {viewMode === 'diagnostic' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 shadow-2xl animate-in fade-in duration-200">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Diagnostic Express de Chantier</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Identifiez la configuration adaptée à vos contraintes de site
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Recommandation technique immédiate & dimensionnement
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Step 1: Site Type */}
              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  1. Type d'exploitation
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'mine', label: 'Site Minier & Extraction isolée', desc: 'Carrières or, fer, phosphate, lithium' },
                    { id: 'btp', label: 'Grands Chantiers Routiers & BTP', desc: 'Corridors, ponts, terrassement lourd' },
                    { id: 'quarry', label: 'Carrière de Granulats & Cimenterie', desc: 'Concassage, rotations continues de bennes' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDiagSiteType(item.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        diagSiteType === item.id
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Major Challenge */}
              <div className="lg:col-span-4 space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
                  2. Défi opérationnel prioritaire
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'satellite', label: 'Zones Blanches sans couverture GSM', desc: 'Besoin de visibilité continue et bouton SOS par satellite' },
                    { id: 'tires', label: 'Usure prématurée pneus & suspensions', desc: 'Pistes latéritiques abrasives et sol rocailleux' },
                    { id: 'maintenance', label: 'Indisponibilité d\'engins & pièces', desc: 'Éloignement des concessionnaires agréés de la capitale' },
                    { id: 'safety', label: 'Discipline des chauffeurs & HSE', desc: 'Conformité stricte aux standards ICMM et alcootest' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setDiagChallenge(item.id as any)}
                      className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        diagChallenge === item.id
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                          : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Instant JMF Recommendation */}
              <div className="lg:col-span-4 bg-slate-950 p-5 rounded-2xl border border-amber-500/40 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Recommandation JMF</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                    {currentRecommendation.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentRecommendation.desc}
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-mono">
                    {currentRecommendation.sla}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <button
                    onClick={() => onSelectService(currentRecommendation.title)}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <span>{currentRecommendation.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TECHNICAL SHOWCASE: MINING VEHICLE PREPARATION ================= */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Technical specifications & equipment checklist */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Cahier des Charges Minier & Chantier JMF</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Préparation Technique Renforcée des Véhicules de Site
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Tous les véhicules et engins affectés aux bases-vie et fronts de taille sont équipés selon les normes internationales HSE les plus rigoureuses :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Arceaux ROPS certifiés</span>
                    <span className="text-[11px] text-slate-400">Protection habitacle anti-écrasement</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Balises Iridium Satellite</span>
                    <span className="text-[11px] text-slate-400">Bouton SOS d'urgence et suivi hors GSM</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Blindage & Suspensions</span>
                    <span className="text-[11px] text-slate-400">Ski de carter 6mm et lames heavy-duty</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block">Sécurité Incendie & Signal</span>
                    <span className="text-[11px] text-slate-400">Double extincteur 6kg et gyrophares LED</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectService('Solutions Minières & BTP')}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  Configurer ma flotte de site
                </button>
                <a
                  href="#contact"
                  className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-colors"
                >
                  Contacter l'ingénieur d'affaires
                </a>
              </div>
            </div>

            {/* Right: Operational Photo with Technical Overlay */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&fm=webp&q=75&w=800"
                  alt="Supervision engins et véhicules miniers en exploitation industrielle"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-84 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex items-end p-5">
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/90 rounded-xl p-4 text-xs text-white w-full space-y-2 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold">Cellule Opérationnelle Minière JMF active</span>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        HSE CONFORME
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Supervision des corridors, ateliers mobiles base-vie et rotations chauffeurs 24h/24 et 7j/7.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BOTTOM EXECUTIVE ENGAGEMENT BANNER ================= */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/40 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase text-amber-400 tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Engagement Terrain JMF Mobility Services</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white max-w-2xl leading-snug">
              « Disponibilité maximale de vos engins et sécurité zéro compromis sur vos pistes d’exploitation. »
            </div>
            <div className="text-xs text-slate-400 font-normal">
              Partenaire opérationnel des majors de l'industrie extractive et des grands travaux de génie civil en Afrique de l'Ouest.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectService('Solutions Minières & BTP')}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
            >
              Obtenir un devis site minier
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODAL FICHE TECHNIQUE APPROFONDIE ================= */}
      {selectedFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-2xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                  {React.createElement(selectedFeatureModal.icon, { className: 'w-5 h-5' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Pilier Minier {selectedFeatureModal.num}
                    </span>
                    <span className="text-slate-500" aria-hidden="true">·</span>
                    <span className="text-[11px] font-bold text-slate-300">
                      {selectedFeatureModal.categoryLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-white mt-0.5">
                    {selectedFeatureModal.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedFeatureModal(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-2">
                  Descriptif & Objectifs Opérationnels
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  {selectedFeatureModal.desc}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider mb-3">
                  Prestations & Équipements Inclus
                </h4>
                <div className="space-y-2">
                  {selectedFeatureModal.points.map((pt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fiche Technique Détaillée */}
              {selectedFeatureModal.specSheet && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
                    Spécifications Techniques et Normes HSE
                  </h4>
                  <div className="space-y-2 text-xs">
                    {Object.entries(selectedFeatureModal.specSheet).map(([key, val]) => (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-900 gap-1">
                        <span className="font-mono text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')} :</span>
                        <span className="font-bold text-slate-200 sm:text-right max-w-sm">{val as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                SLA Garanti · Normes ICMM & HSE
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setSelectedFeatureModal(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    onSelectService(selectedFeatureModal.title);
                    setSelectedFeatureModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <span>Inclure au devis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
