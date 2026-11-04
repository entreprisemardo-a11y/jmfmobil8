import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Building2,
  MapPin,
  TrendingDown,
  CheckCircle2,
  Play,
  Pause,
  ArrowRight,
  Car,
  Award,
  Sparkles,
  Users,
  LayoutGrid,
  Layers,
  Fuel,
  Wrench,
  Clock,
  FileCheck,
  Check,
  Maximize2,
  X,
  PhoneCall,
  SlidersHorizontal,
} from 'lucide-react';

export interface ClientTestimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  city: string;
  country: string;
  flag: string;
  sector: 'ALL' | 'DISTRIBUTION' | 'MINING_BTP' | 'TRANSIT' | 'CORPORATE' | 'HEALTHCARE_TELECOM';
  sectorLabel: string;
  serviceBadge: string;
  fleetSize: string;
  fleetComposition: string;
  metricHighlight: string;
  metricLabel: string;
  metricTrend?: string;
  rating: number;
  quote: string;
  challenge: string;
  solution: string;
  results: string[];
  verified: boolean;
  avatarInitials: string;
  avatarBg: string;
}

const TESTIMONIALS_DATA: ClientTestimonial[] = [
  {
    id: 'test_1',
    name: 'Marc-Aurèle KOFFI',
    title: 'Directeur Supply Chain & Flotte',
    company: 'Société de Boissons & Agro-Distribution',
    city: 'Cotonou & Corridors Régionaux',
    country: 'Bénin',
    flag: '🇧🇯',
    sector: 'DISTRIBUTION',
    sectorLabel: 'Distribution & Boissons',
    serviceBadge: 'Gestion Flotte 360° & Carburant',
    fleetSize: '125 véhicules en circulation',
    fleetComposition: 'Camions porteurs, fourgons isothermes, pick-ups de supervision',
    metricHighlight: '-18% Carburant',
    metricLabel: 'Économie nette dès le 1er trimestre',
    metricTrend: 'ROI immédiat',
    rating: 5,
    quote:
      'Avec plus de 120 véhicules en circulation quotidienne sur les axes interurbains et corridors régionaux, le suivi télématique JMF et le contrôle rigoureux du carburant ont éliminé les anomalies de consommation. La maintenance préventive a divisé par trois nos pannes imprévues.',
    challenge:
      'Surconsommation inexpliquée de carburant, pannes répétées bloquant les livraisons en pleine tournée commerciale et manque de visibilité en temps réel sur les tournées.',
    solution:
      'Installation de balises GPS avec sondes niveau carburant de haute précision, paramétrage de seuils d’alerte siphonnage et calendrier de révisions préventives strictes orchestré par JMF.',
    results: [
      '-18% de facture carburant globale dès 90 jours',
      'Division par 3 des pannes immobilisantes sur route',
      'Ponctualité des livraisons portée à 98.4%',
    ],
    verified: true,
    avatarInitials: 'MK',
    avatarBg: 'bg-gradient-to-br from-sky-600 to-blue-700',
  },
  {
    id: 'test_2',
    name: 'Elhadj Idrissou CHABI',
    title: 'Coordinateur Matériel Roulant & Projets',
    company: 'West Africa Mining & Infrastructures (WAMI)',
    city: 'Sites d’Extraction & Pistes',
    country: 'Afrique de l’Ouest',
    flag: '🌍',
    sector: 'MINING_BTP',
    sectorLabel: 'Mines & Chantiers BTP',
    serviceBadge: 'Flotte Spéciale Mines & Ateliers Mobiles',
    fleetSize: '42 pick-ups 4x4 renforcés & camions',
    fleetComposition: 'Pick-ups Hilux ROPS, bennes 8x4 et véhicules de secours',
    metricHighlight: '99.6% Disponibilité',
    metricLabel: 'Zéro jour d’arrêt chantier imprévu',
    metricTrend: 'Continuité totale',
    rating: 5,
    quote:
      'Nos chantiers d’extraction imposent des contraintes extrêmes aux châssis et trains de roulement. Les pick-ups préparés mines par JMF avec arceaux ROPS et filtration renforcée, appuyés par leurs ateliers mobiles en moins de 30 minutes, garantissent notre productivité.',
    challenge:
      'Poussière abrasive extrême, pistes cassantes, usure prématurée des suspensions et risque financier majeur en cas d’arrêt d’un convoi d’extraction.',
    solution:
      'Préparation technique certifiée mines (arceau ROPS, pré-filtres cycloniques, suspensions Ironman lourdes charges) et astreinte d’un atelier mobile JMF dédié.',
    results: [
      'Taux de disponibilité opérationnelle maintenu à 99.6%',
      'Zéro incident corporel grâce aux arceaux de sécurité homologués',
      'Intervention technique d’urgence en moins de 30 minutes sur site',
    ],
    verified: true,
    avatarInitials: 'IC',
    avatarBg: 'bg-gradient-to-br from-amber-600 to-orange-700',
  },
  {
    id: 'test_3',
    name: 'Christelle ADJIBODOU',
    title: 'Responsable Opérations Transit Maritime',
    company: 'Multimodal Logistics & Transit',
    city: 'Zone Portuaire de Cotonou',
    country: 'Bénin',
    flag: '🇧🇯',
    sector: 'TRANSIT',
    sectorLabel: 'Transit & Portuaire',
    serviceBadge: 'Centre de Stockage & Convoyage Sécurisé',
    fleetSize: '60 véhicules sous douane & transit',
    fleetComposition: 'Véhicules neufs importés, utilitaires et engins spéciaux',
    metricHighlight: '45 min Gagnées',
    metricLabel: 'Par rotation grâce aux formalités digitalisées',
    metricTrend: 'Flux ultra-fluide',
    rating: 5,
    quote:
      'Le centre de stockage logistique JMF proche du port est devenu notre base stratégique. Nos véhicules y stationnent sous vidéosurveillance 24/7 avec un protocole numérique certifié. Le convoyage par chauffeurs habilités sur les corridors sous-régionaux se fait en toute confiance.',
    challenge:
      'Risques de dégradations ou vols lors des stationnements prolongés sous douane, encombrement de l’enceinte portuaire et retards fréquents d’acheminement.',
    solution:
      'Mise à disposition d’un parc de stockage sécurisé clos (gardiennage armé, vidéosurveillance IA, protocole d’inspection photographique d’entrée/sortie) et convoyage par chauffeurs JMF certifiés.',
    results: [
      'Zéro perte, vol ou contestation d’état des lieux depuis 14 mois',
      '45 minutes gagnées par convoi grâce à l’émission des badges instantanés',
      'Escorte et traçabilité GPS temps réel vers les pays de l’hinterland',
    ],
    verified: true,
    avatarInitials: 'CA',
    avatarBg: 'bg-gradient-to-br from-indigo-600 to-purple-700',
  },
  {
    id: 'test_4',
    name: 'Bertin SOSSOU',
    title: 'Directeur Administratif & Financier',
    company: 'Groupe de Services Financiers',
    city: 'Afrique de l’Ouest & France',
    country: 'Bénin / France',
    flag: '🇫🇷',
    sector: 'CORPORATE',
    sectorLabel: 'Banques & Institutions',
    serviceBadge: 'Audit TCO & Conformité Réglementaire',
    fleetSize: '38 berlines & SUV de fonction',
    fleetComposition: 'Véhicules de direction et utilitaires des agences',
    metricHighlight: '-24% Coûts TCO',
    metricLabel: 'Zéro pénalité réglementaire depuis 18 mois',
    metricTrend: 'Budget maîtrisé',
    rating: 5,
    quote:
      'Fini les pénalités pour visites techniques ou polices d’assurance expirées ! Le module d’alertes préventives JMF à 30 jours et le carnet d’entretien numérique nous apportent une conformité totale et ont allégé drastiquement la charge de nos services généraux.',
    challenge:
      'Gestion éparpillée des cartes grises, oublis de visites techniques CNSR causant des immobilisations de véhicules de cadres dirigeants et manque de visibilité sur le coût de revient kilométrique.',
    solution:
      'Audit financier TCO complet, restructuration des contrats d’assurance flotte et digitalisation intégrale de la conformité avec conciergerie administrative JMF.',
    results: [
      '-24% sur le Total Cost of Ownership (TCO) annuel global',
      '100% de conformité administrative : zéro amende CNSR ou défaut d’assurance',
      'Gain de 15h de travail par mois pour l’équipe des services généraux',
    ],
    verified: true,
    avatarInitials: 'BS',
    avatarBg: 'bg-gradient-to-br from-emerald-600 to-teal-700',
  },
  {
    id: 'test_5',
    name: 'Dr. Agnès D’ALMEIDA',
    title: 'Directrice Générale Déléguée',
    company: 'Centrale Pharmaceutique Pharma-Distri Afrique',
    city: 'Hubs de Santé & Distribution Régionale',
    country: 'Bénin',
    flag: '🇧🇯',
    sector: 'HEALTHCARE_TELECOM',
    sectorLabel: 'Santé & Transport Froid',
    serviceBadge: 'Transport Réfrigéré & Télématique Thermique',
    fleetSize: '18 fourgons isothermes frigorifiques',
    fleetComposition: 'Fourgons certifiés ATP avec groupes Carrier / Thermo King',
    metricHighlight: '100% Respect Froid',
    metricLabel: 'Zéro rupture de température thermologique',
    metricTrend: 'Sécurité absolue',
    rating: 5,
    quote:
      'Dans le transport de produits thermosensibles et vaccins, la moindre dérive thermique est proscrite. Les véhicules équipés de groupes froids suivis par JMF et l’alerte immédiate en cas d’anomalie nous assurent une homologation sans faille auprès des autorités sanitaires.',
    challenge:
      'Nécessité de garantir une température constante (+2°C à +8°C) sur des trajets de 600+ km sous forte chaleur tropicale, avec traçabilité auditable pour les inspections de santé publique.',
    solution:
      'Maintenance préventive certifiée des compresseurs frigorifiques et intégration d’enregistreurs thermiques connectés avec rapport numérique délivré à chaque déchargement.',
    results: [
      '100% de conformité aux normes sanitaires internationales',
      'Alerte automatique par SMS et WhatsApp si la température oscille de ±0.5°C',
      'Validation systématique des audits des laboratoires partenaires',
    ],
    verified: true,
    avatarInitials: 'AD',
    avatarBg: 'bg-gradient-to-br from-rose-600 to-pink-700',
  },
  {
    id: 'test_6',
    name: 'Mamadou TRAORÉ',
    title: 'Responsable Opérations Réseaux & Maintenance',
    company: 'West Africa Tower & Telecom Services',
    city: 'Réseau National & Pistes Isolées',
    country: 'Bénin & Région',
    flag: '🌍',
    sector: 'HEALTHCARE_TELECOM',
    sectorLabel: 'Télécoms & Infrastructures',
    serviceBadge: 'Maintenance Flotte & Pneumatiques Tout-Terrain',
    fleetSize: '85 véhicules d’intervention technique',
    fleetComposition: '4x4 tout-terrain double cabine et fourgonnettes ateliers',
    metricHighlight: '+38% Durée Pneus',
    metricLabel: 'Pneumatiques préservés par rotation & gonflage',
    metricTrend: 'Résistance prouvée',
    rating: 5,
    quote:
      'Nos techniciens parcourent plus de 150 000 km chaque mois pour maintenir les relais télécoms. La gestion rigoureuse des pneumatiques, le bridage préventif des vitesses et la réactivité du service de dépannage 24/7 font de JMF un partenaire stratégique de premier plan.',
    challenge:
      'Crevaisons répétées sur pistes de terre isolées, indisponibilité prolongée des équipes de maintenance réseau et surcoûts d’achat de pièces détachées de qualité médiocre.',
    solution:
      'Fourniture de pneumatiques tout-terrain de grandes marques homologuées, kit anti-crevaison renforcé par véhicule et contrat de rotation préventive tous les 10 000 km.',
    results: [
      '+38% de durée de vie moyenne par train de pneus',
      '-32% d’accidents et sorties de route grâce aux modules d’éco-conduite',
      'Assistance mécanique mobile opérationnelle 24h/24 y compris les week-ends',
    ],
    verified: true,
    avatarInitials: 'MT',
    avatarBg: 'bg-gradient-to-br from-cyan-600 to-blue-800',
  },
];

interface TestimonialsCarouselSectionProps {
  onRequestAudit?: (serviceName?: string) => void;
}

export const TestimonialsCarouselSection: React.FC<TestimonialsCarouselSectionProps> = ({
  onRequestAudit,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'CAROUSEL' | 'GRID'>('CAROUSEL');
  const [activeCaseStudyModal, setActiveCaseStudyModal] = useState<ClientTestimonial | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Filtered testimonials
  const filteredTestimonials = useMemo(() => {
    if (selectedSector === 'ALL') return TESTIMONIALS_DATA;
    return TESTIMONIALS_DATA.filter((item) => item.sector === selectedSector);
  }, [selectedSector]);

  const totalSlides = filteredTestimonials.length;

  // Next / Prev slide handlers
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleSelectDot = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedSector]);

  // Autoplay effect (7 seconds per slide in carousel mode)
  useEffect(() => {
    if (viewMode === 'CAROUSEL' && isPlaying && totalSlides > 1) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 7000);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPlaying, totalSlides, currentIndex, viewMode]);

  const currentItem = filteredTestimonials[currentIndex] || filteredTestimonials[0];

  const handleApplySimilarMethod = (testimonial: ClientTestimonial) => {
    if (onRequestAudit) {
      onRequestAudit(`Audit inspiré du cas ${testimonial.company} (${testimonial.serviceBadge})`);
    }
  };

  return (
    <section
      id="temoignages"
      className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* Decorative background grid & radial light accents */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-8 sm:space-y-12">
        {/* 1. Header Section with clear Badges & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200/80 shadow-xs">
            <Award className="w-3.5 h-3.5 text-sky-600" />
            <span>Retours d'Expérience & Preuves Métier B2B</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            Ils nous confient la performance et la sécurité de leur flotte
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
            Découvrez comment directeurs logistiques, DAF et coordinateurs de matériel roulant réduisent leurs coûts TCO et éliminent les pannes grâce aux solutions JMF.
          </p>

          {/* View Mode Toggle (Carousel vs Grid) */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600">
              <button
                onClick={() => setViewMode('CAROUSEL')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'CAROUSEL'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Vue Carrousel Animé</span>
              </button>
              <button
                onClick={() => setViewMode('GRID')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'GRID'
                    ? 'bg-white text-slate-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Toutes les Études de Cas ({TESTIMONIALS_DATA.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Sector Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: 'ALL', label: 'Tous les secteurs' },
            { id: 'DISTRIBUTION', label: 'Distribution & Boissons' },
            { id: 'MINING_BTP', label: 'Mines & Chantiers BTP' },
            { id: 'TRANSIT', label: 'Transit & Portuaire' },
            { id: 'CORPORATE', label: 'Banques & Institutions' },
            { id: 'HEALTHCARE_TELECOM', label: 'Santé, Froid & Télécoms' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSector(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedSector === tab.id
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/20'
                  : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3. CAROUSEL MODE */}
        {viewMode === 'CAROUSEL' && currentItem && (
          <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPlaying(false)}
            onMouseLeave={() => setIsPlaying(true)}
          >
            {/* Main Interactive Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-8 transition-all duration-300 relative overflow-hidden">
              {/* Corner Watermark */}
              <Quote className="w-28 h-28 text-slate-100/80 absolute -top-4 -right-4 pointer-events-none rotate-12" />

              {/* Top Bar: Sector, Flag, Rating & Verified */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 relative z-10">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 border border-sky-100">
                    <Building2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{currentItem.sectorLabel}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Prestation :{' '}
                    <strong className="text-slate-800 font-bold">{currentItem.serviceBadge}</strong>
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(currentItem.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-black text-slate-800 ml-1">5.0/5</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Partenaire Vérifié
                  </span>
                </div>
              </div>

              {/* Body: Quote & ROI Highlights */}
              <div className="my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
                {/* Left side: Quote & Details */}
                <div className="lg:col-span-8 space-y-4">
                  <blockquote className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic">
                    « {currentItem.quote} »
                  </blockquote>

                  {/* Fleet details bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1 font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                      <Car className="w-3.5 h-3.5 text-slate-700" />
                      {currentItem.fleetSize}
                    </span>
                    <span className="text-slate-500 font-medium hidden sm:inline">
                      ({currentItem.fleetComposition})
                    </span>
                  </div>
                </div>

                {/* Right side: Key KPI Metric Callout Box */}
                <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-2xl p-5 shadow-lg border border-slate-700/60 flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      {currentItem.metricTrend || 'Impact Mesuré'}
                    </span>
                    <TrendingDown className="w-5 h-5 text-emerald-400" />
                  </div>

                  <div>
                    <div className="text-3xl font-black text-white tracking-tight">
                      {currentItem.metricHighlight}
                    </div>
                    <div className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                      {currentItem.metricLabel}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveCaseStudyModal(currentItem)}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
                  >
                    <span>Voir l'étude de cas (Avant / Après)</span>
                    <Maximize2 className="w-3.5 h-3.5 text-sky-300" />
                  </button>
                </div>
              </div>

              {/* Bottom Bar: Author info & Action CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                {/* Author Info */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl ${currentItem.avatarBg} text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0`}
                  >
                    {currentItem.avatarInitials}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <span>{currentItem.name}</span>
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                      <span className="text-base" title={currentItem.country}>
                        {currentItem.flag}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 leading-tight">
                      {currentItem.title} •{' '}
                      <span className="font-bold text-slate-700">{currentItem.company}</span>{' '}
                      <span className="text-slate-400">({currentItem.city})</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <button
                  onClick={() => handleApplySimilarMethod(currentItem)}
                  className="px-4 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200/80 transition-all cursor-pointer flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
                >
                  <span>Appliquer cette méthode à ma flotte</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sky-600" />
                </button>
              </div>
            </div>

            {/* Carousel Navigation Arrows */}
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-20 focus:outline-none"
              aria-label="Témoignage précédent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer z-20 focus:outline-none"
              aria-label="Témoignage suivant"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Pagination Dots & Play/Pause Controls */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer text-xs flex items-center gap-1"
                title={isPlaying ? 'Mettre en pause' : 'Reprendre la lecture'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-medium">{isPlaying ? 'Pause' : 'Lecture'}</span>
              </button>

              <div className="flex items-center gap-2">
                {filteredTestimonials.map((_, idx) => {
                  const isActive = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectDot(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        isActive ? 'w-8 bg-sky-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                      }`}
                      aria-label={`Aller au témoignage ${idx + 1}`}
                    />
                  );
                })}
              </div>

              <div className="text-xs font-mono font-bold text-slate-500">
                {currentIndex + 1} / {totalSlides}
              </div>
            </div>
          </div>
        )}

        {/* 4. GRID MODE (Toutes les études de cas affichées simultanément) */}
        {viewMode === 'GRID' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-5 hover:-translate-y-1 relative"
              >
                <div className="space-y-4">
                  {/* Top Badge & Metric */}
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-100 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-sky-600" />
                      {item.sectorLabel}
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-emerald-400 font-black text-xs">
                      {item.metricHighlight}
                    </span>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    « {item.quote} »
                  </blockquote>

                  {/* Quick Results Bullet points */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Bénéfice principal :</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      {item.metricLabel} • {item.fleetSize}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  {/* Author */}
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl ${item.avatarBg} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                    >
                      {item.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                        <span>{item.name}</span>
                        <span>{item.flag}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {item.title} • <span className="font-semibold text-slate-700">{item.company}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveCaseStudyModal(item)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Détail Avant/Après</span>
                      <Maximize2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleApplySimilarMethod(item)}
                      className="flex-1 py-2 px-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Auditer ma flotte</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. Trust Metrics & Social Proof Highlights Strip (Animated feel with authoritative numbers) */}
        <div className="pt-6 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Indicateurs de Performance Certifiés • Flottes sous supervision JMF
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-1 group">
              <div className="w-10 h-10 mx-auto rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">250+</div>
              <div className="text-xs font-black text-slate-800">Véhicules supervisés 24/7</div>
              <div className="text-[11px] text-slate-500">Parcs d’entreprises et corridors régionaux</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-1 group">
              <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">99.2%</div>
              <div className="text-xs font-black text-slate-800">Disponibilité Opérationnelle</div>
              <div className="text-[11px] text-slate-500">Taux de maintien en service continu</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-1 group">
              <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-600 tracking-tight">&lt; 30 min</div>
              <div className="text-xs font-black text-slate-800">Assistance & Dépannage</div>
              <div className="text-[11px] text-slate-500">Ateliers mobiles & dépanneuses d’astreinte</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow text-center space-y-1 group">
              <div className="w-10 h-10 mx-auto rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform mb-2">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 tracking-tight">0 Amende</div>
              <div className="text-xs font-black text-slate-800">Conformité Réglementaire</div>
              <div className="text-[11px] text-slate-500">Alertes J-30 CNSR, TVM et polices d’assurance</div>
            </div>
          </div>
        </div>

        {/* 6. Bottom Call to Action: Audit sans engagement */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center md:text-left relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Diagnostic Sans Engagement • Sous 24h</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight">
              Prêt à obtenir les mêmes résultats pour votre entreprise ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Nos consultants analysent votre flotte (taille, consommations, historiques d'entretien) et vous remettent une feuille de route chiffrée avec vos gains TCO potentiels.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => onRequestAudit && onRequestAudit('Audit et diagnostic de flotte')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Demander un audit personnalisé</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/2290197832121?text=Bonjour%20JMF,%20je%20souhaite%20un%20diagnostic%20pour%20ma%20flotte."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <PhoneCall className="w-4 h-4" />
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* 7. MODAL: Detailed Case Study (Avant / Après) */}
      {activeCaseStudyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 relative my-8">
            <button
              onClick={() => setActiveCaseStudyModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-sky-100 text-sky-800">
                  {activeCaseStudyModal.sectorLabel}
                </span>
                <span className="text-xs text-slate-500">
                  {activeCaseStudyModal.company} • {activeCaseStudyModal.city}
                </span>
                <span className="text-base">{activeCaseStudyModal.flag}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Étude de Cas : {activeCaseStudyModal.company}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Profil : {activeCaseStudyModal.fleetSize} ({activeCaseStudyModal.fleetComposition})
              </p>
            </div>

            {/* Challenge & Solution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 uppercase">
                  <Wrench className="w-4 h-4 text-amber-700" />
                  <span>Le Défi Initial</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  {activeCaseStudyModal.challenge}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black text-sky-900 uppercase">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  <span>La Solution JMF</span>
                </div>
                <p className="text-xs text-sky-950 leading-relaxed font-medium">
                  {activeCaseStudyModal.solution}
                </p>
              </div>
            </div>

            {/* Quantified Results */}
            <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-emerald-900 uppercase">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Résultats Mesurés</span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {activeCaseStudyModal.metricHighlight}
                </span>
              </div>
              <ul className="space-y-1.5">
                {activeCaseStudyModal.results.map((res, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-emerald-950 font-medium">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{res}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quote recall */}
            <blockquote className="text-xs text-slate-600 italic border-l-2 border-sky-500 pl-3">
              « {activeCaseStudyModal.quote} » —{' '}
              <strong className="text-slate-800 font-bold">{activeCaseStudyModal.name}</strong>,{' '}
              {activeCaseStudyModal.title}
            </blockquote>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveCaseStudyModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  const m = activeCaseStudyModal;
                  setActiveCaseStudyModal(null);
                  handleApplySimilarMethod(m);
                }}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Demander un audit similaire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
