import React, { useState, useMemo } from 'react';
import {
  FileSearch,
  Car,
  ShieldCheck,
  Radio,
  TrendingDown,
  Wrench,
  Truck,
  Key,
  ShoppingCart,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  Shield,
  Clock,
  Layers,
  FileText,
  X,
  Search,
  Calculator,
  LayoutGrid,
  Table,
  ChevronRight,
  Gauge,
  Zap,
  Sliders,
  Award,
  ExternalLink,
} from 'lucide-react';

interface TenSolutionsSectionProps {
  onSelectSolution: (solutionName: string) => void;
}

export const TenSolutionsSection: React.FC<TenSolutionsSectionProps> = ({ onSelectSolution }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'strategy' | 'operations' | 'tech' | 'mobility'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showSimulator, setShowSimulator] = useState(false);
  const [fleetSize, setFleetSize] = useState(15);
  const [selectedSolutionForModal, setSelectedSolutionForModal] = useState<any | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les solutions', count: 10 },
    { id: 'strategy', label: 'Stratégie & TCO', count: 2 },
    { id: 'operations', label: 'Gestion & Entretien', count: 2 },
    { id: 'tech', label: 'Sécurité & Télématique', count: 2 },
    { id: 'mobility', label: 'Convoyage & Location', count: 4 },
  ];

  const solutions = [
    {
      num: '01',
      category: 'strategy',
      categoryLabel: 'Audit & Stratégie',
      kpiImpact: '-20% TCO Réduit',
      title: 'Études, Audit & Conseil aux entreprises',
      icon: FileSearch,
      accentColor: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
      badgeColor: 'border-sky-500 text-sky-600 bg-sky-50',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: "Nous analysons votre parc automobile et vos besoins afin d'identifier les leviers d'amélioration concrets et les gisements d'économies.",
      keyBenefit: 'Matrice d’économies réelles & Car Policy conforme aux standards internationaux.',
      guarantee: 'Rapport d’audit stratégique remis sous 15 jours ouvrés.',
      points: [
        'Audit et diagnostic complet de flotte automobile',
        'Études approfondies des flux de mobilité et trajets',
        'Optimisation des coûts d\'exploitation globaux (TCO)',
        'Élaboration de politiques de flotte sur-mesure (Car Policy)',
        'Accompagnement à la transition énergétique',
        'Mise en place d\'outils de gestion et suivi opérationnel',
        'Conseil en organisation et performance de parc',
      ],
      tagline: '« Diagnostic clair, décisions éclairées. »',
      deliverables: [
        'Rapport d\'audit complet avec matrice des coûts réels',
        'Livre blanc Car Policy sur-mesure adapté à votre entreprise',
        'Feuille de route de réduction des dépenses à 12 et 24 mois',
      ],
    },
    {
      num: '02',
      category: 'operations',
      categoryLabel: 'Fleet Management',
      kpiImpact: '98.5% Disponibilité',
      title: 'Gestionnaire de flotte — Fleet Management',
      icon: Car,
      accentColor: 'from-blue-600 to-indigo-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'border-blue-500 text-blue-600 bg-blue-50',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Confiez le pilotage complet de votre parc à des gestionnaires certifiés et éliminez les immobilisations imprévues.',
      keyBenefit: 'Prise en charge intégrale de la vie du véhicule : du carburant aux révisions.',
      guarantee: 'Gestionnaire de compte dédié et astreinte d’urgence 24h/24.',
      points: [
        'Gestion des véhicules particuliers, utilitaires et poids lourds',
        'Approche orientée disponibilité maximale et maîtrise du TCO',
        'Planification rigoureuse des remplacements et rotations',
        'Contrôle préventif des cycles de maintenance constructeur',
        'Gestion intégrale des formalités administratives et renouvellements',
      ],
      tagline: '« Moins de contraintes, plus de disponibilité. »',
      deliverables: [
        'Gestionnaire de flotte dédié à votre compte',
        'Tableau de bord mensuel de disponibilité et d\'utilisation',
        'Supervision intégrale des révisions constructeurs et visites',
      ],
    },
    {
      num: '03',
      category: 'tech',
      categoryLabel: 'Sécurité & Humain',
      kpiImpact: '-18% Conso Carburant',
      title: 'Formation à la sécurité routière & Éco-conduite',
      icon: ShieldCheck,
      accentColor: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      badgeColor: 'border-emerald-500 text-emerald-600 bg-emerald-50',
      image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Parce que la sécurité de vos collaborateurs et la réduction des sinistres sont la première priorité de toute flotte moderne.',
      keyBenefit: 'Conduite défensive certifiée CNSR et réduction drastique de la sinistralité.',
      guarantee: 'Certificats de formation nominatifs valables pour les assurances.',
      points: [
        'Développement des bonnes pratiques de conduite préventive',
        'Réduction concrète des risques d\'accidents et des sinistres',
        'Éco-conduite : jusqu\'à -18% de consommation de carburant',
        'Sessions adaptées : Entreprises, Conducteurs et Particuliers',
        'Sensibilisation au code de la route et premiers secours',
      ],
      tagline: '« Des conducteurs formés, une entreprise protégée. »',
      deliverables: [
        'Certificats nominatifs de formation à la conduite défensive',
        'Baisse immédiate de la sinistralité et des primes d\'assurance',
        'Suivi continu des comportements et classements d\'éco-score',
      ],
    },
    {
      num: '04',
      category: 'tech',
      categoryLabel: 'Télématique IoT',
      kpiImpact: 'Traçabilité 24/7',
      title: 'Services digitaux & Télématique avancée',
      icon: Radio,
      accentColor: 'from-indigo-500 to-purple-600',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      badgeColor: 'border-indigo-500 text-indigo-600 bg-indigo-50',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Transformez les données GPS et capteurs IoT de vos véhicules en leviers d’arbitrage et de protection active.',
      keyBenefit: 'Géolocalisation en temps réel, coupure moteur antivol et détection de siphonnage.',
      guarantee: 'Plateforme accessible web & mobile avec archivage 12 mois.',
      points: [
        'Géolocalisation GPS 4G haute précision avec carte interactive',
        'Suivi des véhicules en temps réel avec historique complet',
        'Alertes automatiques (sorties de zone, excès de vitesse, chocs)',
        'Suivi précis des comportements de conduite et éco-score',
        'Tableaux de bord d\'aide à la décision sur-mesure pour DSI & DAF',
        'Analyse fine des coûts kilométriques réels par véhicule',
      ],
      tagline: '« Vos véhicules connectés, vos décisions simplifiées. »',
      deliverables: [
        'Boîtiers GPS 4G sécurisés avec coupure moteur à distance',
        'Accès plateforme web & mobile en temps réel',
        'Rapports d\'activité et d\'éco-conduite automatisés',
      ],
    },
    {
      num: '05',
      category: 'strategy',
      categoryLabel: 'Rentabilité & Finance',
      kpiImpact: 'TCO & ROI Mesurés',
      title: 'Conseil financier & Optimisation des coûts',
      icon: TrendingDown,
      accentColor: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      badgeColor: 'border-amber-500 text-amber-600 bg-amber-50',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Maîtrisez votre coût global de détention (TCO) et dégagez des marges de rentabilité supplémentaires dès le premier trimestre.',
      keyBenefit: 'Arbitrage précis Achat vs Crédit-bail vs LLD selon votre profil fiscal.',
      guarantee: 'Calcul rigoureux du TCO poste par poste avec plan de trésorerie.',
      points: [
        'Analyse approfondie de la structure des coûts automobiles',
        'Identification précise des postes de surcoûts et déperditions',
        'Stratégies concrètes d\'économies d\'échelle à court et moyen terme',
        'Optimisation fiscale et comptable de votre parc',
        'Modélisation prévisionnelle du renouvellement de vos véhicules',
      ],
      tagline: '« Maîtrisez votre TCO. Améliorez votre rentabilité. »',
      deliverables: [
        'Audit d\'amortissement financier complet',
        'Scénarios comparatifs Achat comptant vs Crédit-bail vs LLD',
        'Plan d\'optimisation fiscale et d\'assurance flotte',
      ],
    },
    {
      num: '06',
      category: 'operations',
      categoryLabel: 'Conciergerie Flotte',
      kpiImpact: 'Zéro Arrêt Chantier',
      title: 'Conciergerie & Services opérationnels',
      icon: Wrench,
      accentColor: 'from-teal-500 to-emerald-600',
      badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
      badgeColor: 'border-teal-500 text-teal-600 bg-teal-50',
      image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Nous prenons en charge toutes les opérations qui permettent à vos véhicules de rester immédiatement opérationnels.',
      keyBenefit: 'Maintenance préventive, gestion pneumatiques, carburant et visite technique sans friction.',
      guarantee: 'Véhicule de relais garanti pour assurer la continuité d’activité.',
      points: [
        'Entretien courant & maintenance préventive programmée',
        'Gestion complète des pneumatiques (permutation, équilibrage)',
        'Suivi rigoureux du carburant et lutte contre la fraude',
        'Assistance et dépannage prioritaire 24h/24 et 7j/7',
        'Gestion administrative des sinistres et suivi carrosserie',
        'Prise en charge intégrale des visites de contrôle technique',
      ],
      tagline: '« Votre flotte roule. Nous nous occupons du reste. »',
      deliverables: [
        'Réseau de garages et concessions agréés partenaires',
        'Facturation mensuelle centralisée et contrôlée',
        'Véhicule de remplacement garanti en cas d\'immobilisation',
      ],
    },
    {
      num: '07',
      category: 'mobility',
      categoryLabel: 'Convoyage Sécurisé',
      kpiImpact: 'Zéro Km Fantôme',
      title: 'Services de convoyage de véhicules',
      icon: Truck,
      accentColor: 'from-blue-500 to-sky-600',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      badgeColor: 'border-blue-500 text-blue-600 bg-blue-50',
      image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: "Déplacez votre flotte partout sur le continent en toute sérénité.\nUn service de convoyage de véhicules sécurisé, traçable et clé en main à travers toute l'Afrique.",
      keyBenefit: 'Chauffeurs professionnels habilités ou transport sur plateau porte-voiture dédié.',
      guarantee: 'Assurance transport tous risques incluse et état des lieux horodaté.',
      points: [
        'Convoyage par la route avec chauffeurs certifiés et expérimentés',
        'Transport sur camion plateau porte-voiture pour véhicules neufs ou non roulants',
        'Couverture et corridors transfrontaliers (Togo, Niger, Burkina, CI)',
        'Rapidité d\'exécution, respect strict des horaires et ponctualité',
        'Traçabilité GPS continue tout au long du trajet',
      ],
      tagline: '« Déplacez vos véhicules en toute confiance. »',
      deliverables: [
        'Chauffeurs professionnels habilités et soumis à charte stricte',
        'Protocole d\'état des lieux photographique horodaté',
        'Assurance transport tous risques incluse',
      ],
    },
    {
      num: '08',
      category: 'mobility',
      categoryLabel: 'Location Professionnelle',
      kpiImpact: 'Parc Récent Garanti',
      title: 'Location de véhicules avec ou sans chauffeur',
      icon: Key,
      accentColor: 'from-cyan-500 to-blue-600',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      badgeColor: 'border-cyan-500 text-cyan-600 bg-cyan-50',
      image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Une solution de location souple et clé en main pour vos missions professionnelles, délégations et besoins de chantier.',
      keyBenefit: 'Flotte récente de Hilux 4x4, SUV exécutifs, berlines et minibus avec entretien compris.',
      guarantee: 'Disponibilité rapide et remplacement immédiat en cas d’aléa.',
      points: [
        'Location courte durée (missions ponctuelles, délégations, salons)',
        'Location moyenne et longue durée avec formules modulables',
        'Véhicules récents, climatisés et rigoureusement entretenus',
        'Mise à disposition avec ou sans chauffeur professionnel bilingue',
        'Véhicule relais garanti en cas d\'immobilisation technique',
      ],
      tagline: '« La liberté de rouler avec des véhicules irréprochables. »',
      deliverables: [
        'Parc varié : berlines, SUV 4x4, pick-up de chantier, minibus',
        'Formules tout inclus (assurance, entretien, assistance)',
        'Contrats flexibles ajustables selon vos pics d\'activité',
      ],
    },
    {
      num: '09',
      category: 'mobility',
      categoryLabel: 'Achat & Vente',
      kpiImpact: 'Négociation Flotte',
      title: 'Achat & Vente de véhicules',
      icon: ShoppingCart,
      accentColor: 'from-rose-500 to-pink-600',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      badgeColor: 'border-rose-500 text-rose-600 bg-rose-50',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Nous vous accompagnons de bout en bout dans vos arbitrages d’acquisition, d’importation et de revente de parc réformé.',
      keyBenefit: 'Tarifs constructeurs négociés, contrôle d’état en 120 points et immatriculation clé en main.',
      guarantee: 'Inspection technique certifiée et valorisation maximale de revente.',
      points: [
        'Recherche personnalisée selon votre cahier des charges précis',
        'Acquisition et négociation tarifaire privilégiée constructeurs',
        'Inspection technique rigoureuse avant tout achat',
        'Gestion intégrale des formalités de livraison et immatriculation',
        'Vente et renouvellement de parc au meilleur prix du marché',
      ],
      tagline: '« Faire le bon choix au meilleur coût. »',
      deliverables: [
        'Sélection impartiale des marques les plus robustes et rentables',
        'Gestion clé en main des procédures d\'importation et dédouanement',
        'Reprise ou vente optimisée de vos véhicules réformés',
      ],
    },
    {
      num: '10',
      category: 'mobility',
      categoryLabel: 'Prestations Sur-Mesure',
      kpiImpact: '100% Adapté',
      title: 'Prestations sur demande & Sur-mesure',
      icon: SlidersHorizontal,
      accentColor: 'from-purple-600 to-indigo-700',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      badgeColor: 'border-purple-500 text-purple-600 bg-purple-50',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&fm=webp&q=75&w=640',
      desc: 'Chaque entreprise possède des spécificités et des défis logistiques uniques exigeant un accompagnement sur mesure.',
      keyBenefit: 'Ingénierie de mobilité dédiée, déploiement de chauffeurs formés et protocole opérationnel sur site.',
      guarantee: 'Cahier des charges sur-mesure et SLA contractuel garanti.',
      points: [
        'Solutions hautement personnalisées adaptées à votre activité',
        'Accompagnement spécifique pour flottes mixtes et engins lourds',
        'Prise en compte de vos contraintes opérationnelles et de site',
        'Délégation totale ou partielle selon vos priorités managériales',
      ],
      tagline: '« Parlons de votre besoin spécifique. »',
      deliverables: [
        'Cahier des charges co-construit avec vos équipes de direction',
        'Dimensionnement technique et financier sur-mesure',
        'Accord de niveau de service (SLA) contractuel garanti',
      ],
    },
  ];

  // Filter solutions by category AND search query
  const filteredSolutions = useMemo(() => {
    return solutions.filter((s) => {
      const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        s.title.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q) ||
        s.points.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [activeCategory, searchQuery]);

  const standardSolutions = filteredSolutions.filter((s) => s.num !== '10');
  const solution10 = filteredSolutions.find((s) => s.num === '10');

  // Simulator calculations
  const estimatedAnnualSavingsFCFA = useMemo(() => {
    return (fleetSize * 450000).toLocaleString('fr-FR');
  }, [fleetSize]);

  const estimatedFuelLitres = useMemo(() => {
    return (fleetSize * 380).toLocaleString('fr-FR');
  }, [fleetSize]);

  return (
    <section id="solutions" className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200 relative overflow-hidden">
      {/* Ambient watermark grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#0284c7_0.75px,transparent_0.75px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-black uppercase tracking-wider border border-sky-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Catalogue Intégral • Expertise & Multi-Marques</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-tight">
            Nos 10 Solutions Mobilité Clés en Main
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            De la stratégie de flotte aux opérations de terrain quotidiennes, découvrez l'ensemble des expertises déployées par <strong>JMF Mobility Services</strong> pour rationaliser vos coûts et sécuriser vos déplacements.
          </p>

          {/* Quick simulator toggle pill */}
          <div className="pt-2 flex items-center justify-center">
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-xs"
            >
              <Calculator className="w-4 h-4 text-sky-600" />
              <span>{showSimulator ? 'Masquer le simulateur d’économies TCO' : 'Estimer vos économies potentielles (Simulateur TCO)'}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">-20% TCO</span>
            </button>
          </div>
        </div>

        {/* Embedded Interactive TCO Simulator Drawer */}
        {showSimulator && (
          <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-sky-800/60 shadow-xl max-w-4xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400">
                  <Calculator className="w-4 h-4 text-sky-400" />
                  <span>SIMULATEUR TCO & RENTABILITÉ FLOTTE</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">
                  Quelle économie pour votre entreprise ?
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-md">
                  Ajustez la taille actuelle de votre parc automobile pour visualiser le gain direct estimé sur vos frais de carburant et de maintenance.
                </p>
              </div>

              {/* Slider Controller */}
              <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 min-w-[260px] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Taille de votre flotte :</span>
                  <span className="font-mono font-black text-sky-400 text-base">{fleetSize} véhicules</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="100"
                  step="1"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>2 véh.</span>
                  <span>50 véh.</span>
                  <span>100+ véh.</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Économie TCO Annuelle</span>
                <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
                  ~ {estimatedAnnualSavingsFCFA} <span className="text-xs text-emerald-300 font-bold">FCFA / an</span>
                </div>
                <p className="text-[11px] text-slate-300">Sur la maintenance préventive et la négociation pièces OEM.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Carburant Économisé</span>
                <div className="text-2xl font-black text-sky-400 font-mono tracking-tight">
                  ~ {estimatedFuelLitres} <span className="text-xs text-sky-300 font-bold">Litres / an</span>
                </div>
                <p className="text-[11px] text-slate-300">Grâce à l’éco-conduite et au contrôle des trajets via GPS.</p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wider block">Audit Personnalisé Gratuit</span>
                  <p className="text-xs text-slate-200 mt-1 font-medium">Bénéficiez d'une étude d'opportunité chiffrée sous 48h.</p>
                </div>
                <button
                  onClick={() => onSelectSolution('Études, Audit & Conseil aux entreprises')}
                  className="w-full py-2.5 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <span>Demander l'audit complet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 360° Value Metrics Strip - Soft, Balanced & Airy */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl bg-white/90 border border-slate-200/70 shadow-xs">
          <div className="flex items-center gap-3 p-1.5">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100/60 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">Approche 360° Intégrée</div>
              <div className="text-[11px] text-slate-500 font-normal">10 pôles d'expertise synergiques</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100/60 shadow-xs">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">Maîtrise du TCO</div>
              <div className="text-[11px] text-slate-500 font-normal">Jusqu'à -20% d'économies mesurées</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/60 shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">Sécurité & CNSR</div>
              <div className="text-[11px] text-slate-500 font-normal">100% conformité légale & HSE</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-1.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/60 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 tracking-tight">Disponibilité du Parc</div>
              <div className="text-[11px] text-slate-500 font-normal">98.5% taux d'uptime garanti</div>
            </div>
          </div>
        </div>

        {/* Filter bar: Segmented Category Tabs (Top) + Search & View switcher (Sub-bar) */}
        <div className="space-y-4 pt-2">
          {/* Centered Segmented Control */}
          <div className="flex items-center justify-center">
            <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200 shadow-xs max-w-full overflow-x-auto scrollbar-none">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap ${
                      isActive
                        ? 'bg-white text-sky-900 shadow-sm ring-1 ring-slate-200 font-black'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                        isActive ? 'bg-sky-100 text-sky-700 font-bold' : 'bg-slate-200/80 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-bar: Search Input + Result Count + View Switcher */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto px-1">
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>
                Affichage de <strong>{filteredSolutions.length}</strong> solution{filteredSolutions.length > 1 ? 's' : ''} {activeCategory !== 'all' ? `(filtre actif)` : ''}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Search Input */}
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher (ex: TCO, GPS, chauffeur...)"
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none placeholder:text-slate-400 shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    title="Effacer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* View Mode Switcher */}
              <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0 shadow-xs">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    viewMode === 'grid' ? 'bg-white text-sky-800 shadow-xs ring-1 ring-slate-200/80' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Vue Cartes Détaillées"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Cartes</span>
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                    viewMode === 'table' ? 'bg-white text-sky-800 shadow-xs ring-1 ring-slate-200/80' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Vue Tableau de Synthèse"
                >
                  <Table className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tableau</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Notice if filtered */}
        {searchQuery && (
          <div className="text-xs text-slate-500 flex items-center justify-between bg-sky-50/60 p-2.5 rounded-xl border border-sky-100 max-w-5xl mx-auto">
            <span>
              {filteredSolutions.length} solution{filteredSolutions.length > 1 ? 's' : ''} trouvée{filteredSolutions.length > 1 ? 's' : ''} pour « <strong>{searchQuery}</strong> »
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-sky-700 hover:underline font-semibold cursor-pointer"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* View Mode 1: Modern 3-Column Visual Grid */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {standardSolutions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Top Image & Visual Header */}
                  <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                    {/* Top Overlay Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
                      {/* Monospace Number Pill */}
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-white font-mono font-black text-xs border border-white/20 shadow-sm">
                        N° {item.num}
                      </span>

                      {/* KPI Impact Pill */}
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 backdrop-blur-md text-slate-950 font-black text-[11px] shadow-sm">
                        {item.kpiImpact}
                      </span>
                    </div>

                    {/* Floating Icon Badge on Image Bottom */}
                    <div className="absolute -bottom-3 left-6 z-10 flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.accentColor} text-white flex items-center justify-center font-bold shadow-md ring-4 ring-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/95 text-slate-800 shadow-xs border border-slate-200">
                        {item.categoryLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card Core Content */}
                  <div className="p-6 pt-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                        {item.desc}
                      </p>

                      {/* Key Value Promise Box */}
                      {item.keyBenefit && (
                        <div className="p-2.5 rounded-xl bg-sky-50/80 border border-sky-100 text-[11px] text-sky-950 font-medium flex items-start gap-2">
                          <Zap className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item.keyBenefit}</span>
                        </div>
                      )}

                      {/* Bullet points */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        {item.points.slice(0, 4).map((pt, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug text-[11.5px]">{pt}</span>
                          </div>
                        ))}
                        {item.points.length > 4 && (
                          <div className="text-[11px] text-sky-600 font-bold pl-5">
                            + {item.points.length - 4} autres prestations incluses
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Guarantee & Action Footer */}
                    <div className="pt-4 mt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{item.guarantee}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2.5 pt-1">
                        <button
                          onClick={() => setSelectedSolutionForModal(item)}
                          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors py-2 px-1"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Détails</span>
                        </button>

                        <button
                          onClick={() => onSelectSolution(item.title)}
                          className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:shadow-md"
                        >
                          <span>Demander un devis</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View Mode 2: Executive Matrix Table View */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4 w-12 text-center">N°</th>
                    <th className="p-4">Pôle & Solution</th>
                    <th className="p-4">Objectif Opérationnel</th>
                    <th className="p-4">Impact Clé</th>
                    <th className="p-4">Livrable Garanti</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSolutions.map((item) => {
                    const Icon = item.icon;
                    return (
                      <tr key={item.num} className="hover:bg-sky-50/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-slate-400 text-center">{item.num}</td>
                        <td className="p-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.accentColor} text-white flex items-center justify-center shrink-0`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-slate-900 font-bold">{item.title}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{item.categoryLabel}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600 max-w-xs">{item.desc}</td>
                        <td className="p-4">
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">
                            {item.kpiImpact}
                          </span>
                        </td>
                        <td className="p-4 text-slate-600 text-[11px]">
                          {item.deliverables ? item.deliverables[0] : 'SLA garanti'}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => onSelectSolution(item.title)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-1 shadow-xs cursor-pointer"
                          >
                            <span>Devis</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Solution 10 : Featured Executive Full-Width Card */}
        {solution10 && (
          <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-[#0A182F] to-slate-900 text-white p-8 sm:p-10 border border-slate-700/80 shadow-2xl overflow-hidden group">
            {/* Ambient pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column info */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-sky-500 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-500/20">
                    <SlidersHorizontal className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-black text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                        SOLUTION 10
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        100% Personnalisable
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                      Prestations sur demande & Solutions Sur-Mesure
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
                  Chaque entreprise possède des contraintes opérationnelles, des tournées particulières ou des types de véhicules spécifiques. <strong>JMF Mobility Services</strong> conçoit des dispositifs sur-mesure (flottes de liaison, missions spéciales, détachement de personnel qualifié, logistique combinée).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {solution10.points.map((pt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="text-xs font-semibold text-sky-300 italic pt-1">
                  « Parlons de vos besoins spécifiques : nous adaptons nos process à votre réalité opérationnelle. »
                </div>
              </div>

              {/* Right Column actions */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-slate-700">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Étude personnalisée sous 48h
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Un interlocuteur dédié JMF analyse votre cahier des charges et vous transmet une recommandation technique et financière.
                </p>

                <button
                  onClick={() => onSelectSolution('Prestations sur demande & Sur-mesure')}
                  className="w-full py-3.5 px-5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Étudier mon projet sur-mesure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-2 gap-2.5 w-full items-stretch">
                  <a
                    href="https://wa.me/2290197832121"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl flex flex-col items-center justify-center text-center transition-all group shadow-sm min-h-[64px] h-full"
                    title="WhatsApp & Appel direct : +229 01 97 83 21 21"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp (Bénin)</span>
                    </span>
                    <span className="font-mono font-bold text-white text-xs whitespace-nowrap mt-1 tracking-tight group-hover:text-emerald-300 transition-colors">
                      +229 01 97 83 21 21
                    </span>
                  </a>
                  <a
                    href="https://wa.me/221775984392"
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl flex flex-col items-center justify-center text-center transition-all group shadow-sm min-h-[64px] h-full"
                    title="WhatsApp & Appel direct : +221 77 598 43 92"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp (Sénégal)</span>
                    </span>
                    <span className="font-mono font-bold text-white text-xs whitespace-nowrap mt-1 tracking-tight group-hover:text-emerald-300 transition-colors">
                      +221 77 598 43 92
                    </span>
                  </a>
                  <a
                    href="https://wa.me/33650059161"
                    target="_blank"
                    rel="noreferrer"
                    className="sm:col-span-1 lg:col-span-2 py-3 px-2.5 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 hover:border-emerald-500/50 rounded-xl flex flex-col items-center justify-center text-center transition-all group shadow-sm min-h-[64px] h-full"
                    title="WhatsApp & Appel direct : +33 6 50 05 91 61"
                  >
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>WhatsApp (France)</span>
                    </span>
                    <span className="font-mono font-bold text-white text-xs whitespace-nowrap mt-1 tracking-tight group-hover:text-emerald-300 transition-colors">
                      +33 6 50 05 91 61
                    </span>
                  </a>
                </div>
                <div className="text-[10px] text-slate-300 text-center space-y-1">
                  <div className="font-bold text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/40 py-1 px-2 rounded-lg border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Les trois numéros sont joignables sur WhatsApp 24h/24 & 7j/7</span>
                  </div>
                  <div className="text-slate-400">
                    Fixe : <a href="tel:+2290121248870" className="text-sky-300 font-mono hover:underline">+229 01 21 24 88 70</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Detail Modal */}
      {selectedSolutionForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Image Header */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-900">
              <img
                src={selectedSolutionForModal.image}
                alt={selectedSolutionForModal.title}
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>

              {/* Close button */}
              <button
                onClick={() => setSelectedSolutionForModal(null)}
                className="absolute top-4 right-4 p-2 text-white bg-slate-950/60 hover:bg-slate-900 rounded-full transition-colors cursor-pointer z-10"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Badges & Title */}
              <div className="absolute bottom-4 left-6 right-6 z-10 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                    Solution {selectedSolutionForModal.num}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white/90 text-slate-900">
                    {selectedSolutionForModal.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950">
                    {selectedSolutionForModal.kpiImpact}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                  {selectedSolutionForModal.title}
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Présentation Opérationnelle</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                  {selectedSolutionForModal.desc}
                </p>
              </div>

              {selectedSolutionForModal.keyBenefit && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 space-y-1">
                  <div className="text-[11px] font-black text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-sky-600" />
                    <span>Bénéfice Stratégique Clé</span>
                  </div>
                  <p className="text-xs text-sky-950 font-medium">
                    {selectedSolutionForModal.keyBenefit}
                  </p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Prestations Incluses au Contrat</h4>
                <div className="space-y-2">
                  {selectedSolutionForModal.points.map((pt: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSolutionForModal.deliverables && (
                <div>
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">Livrables & Engagements Contractuels</h4>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-800 font-medium">
                    {selectedSolutionForModal.deliverables.map((deliv: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        <span>{deliv}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 italic">
                {selectedSolutionForModal.tagline}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50">
              <button
                onClick={() => setSelectedSolutionForModal(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Fermer
              </button>

              <button
                onClick={() => {
                  const title = selectedSolutionForModal.title;
                  setSelectedSolutionForModal(null);
                  onSelectSolution(title);
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <span>Demander un devis pour cette solution</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
