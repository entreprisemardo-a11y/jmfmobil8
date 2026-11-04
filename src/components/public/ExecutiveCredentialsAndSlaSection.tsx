import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  Award,
  CheckCircle2,
  ArrowRight,
  Wrench,
  FileCheck2,
  Truck,
  Building2,
  HardHat,
  BarChart3,
  AlertTriangle,
} from 'lucide-react';

interface ExecutiveCredentialsAndSlaSectionProps {
  onSelectOffer: (serviceName: string, fleetSize?: string, details?: string) => void;
}

export const ExecutiveCredentialsAndSlaSection: React.FC<ExecutiveCredentialsAndSlaSectionProps> = ({
  onSelectOffer,
}) => {
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(0);

  const slaCommitments = [
    {
      badge: 'SLA < 4 Heures',
      title: 'Continuité & Véhicule de Relais',
      desc: "Intervention d'assistance ou mise à disposition d'un véhicule de remplacement sous 4h ouvrées en cas d'immobilisation technique.",
      metric: '98,4% dispo garantie',
      icon: Clock,
      color: 'text-sky-600 bg-sky-50 border-sky-200',
    },
    {
      badge: 'SLA < 2 Heures',
      title: 'Cotation Pièces OEM & Devis Atelier',
      desc: "Chiffrage contradictoire et sourçage de pièces d'origine certifiées (Toyota, Mitsubishi, Bosch) en moins de 2 heures.",
      metric: '100% traçabilité OEM',
      icon: Wrench,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      badge: 'SLA J-30 Anticipé',
      title: 'Zéro Défaut Réglementaire',
      desc: 'Alertes automatiques et renouvellement anticipé des visites techniques CNSR, TVM, assurances et cartes grises ANaTT.',
      metric: '0 pénalité routière',
      icon: FileCheck2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      badge: 'SLA 24h/24 • 7j/7',
      title: 'Supervision IoT & Astreinte Route',
      desc: 'Surveillance GPS 4G temps réel, détection de siphonnage carburant et coordination dépannage sur les corridors UEMOA.',
      metric: 'Bénin 🇧🇯 • Sénégal 🇸🇳',
      icon: ShieldCheck,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
  ];

  const caseStudies = [
    {
      id: 'btp-mines',
      sector: 'BTP, Génie Civil & Chantiers',
      shortTab: 'BTP & Chantiers',
      icon: HardHat,
      fleetProfile: '28 Pick-up 4x4 & Camions Benne',
      location: 'Corridor Cotonou – Parakou & Sous-région',
      metricFigure: '-22,4%',
      metricTitle: 'Budget Carburant',
      annualSavingLabel: 'Économie nette auditée sur 12 mois',
      beforeItems: [
        {
          label: 'Carburant',
          text: 'Surconsommations & écarts de pleins fréquents (+19% de dérive budgétaire)',
        },
        {
          label: 'Disponibilité',
          text: '4 à 6 jours d’arrêt par mois pour pannes correctives non anticipées',
        },
        {
          label: 'Pilotage TCO',
          text: 'Suivi sur fichiers Excel dispersés sans visibilité temps réel par chantier',
        },
      ],
      beforeImpact: 'Impact initial : Surcoûts d’exploitation & retards chantiers',
      afterItems: [
        {
          label: 'Carburant',
          text: '-22,4% sur le budget gasoil dès le 5e mois (sondes 4G + contrôle tickets)',
        },
        {
          label: 'Disponibilité',
          text: '98,8% de disponibilité grâce au planning préventif automatisé',
        },
        {
          label: 'Pilotage TCO',
          text: 'Reporting mensuel consolidé par véhicule, conducteur et chantier',
        },
      ],
      afterImpact: 'Bilan JMF : Rentabilité chantier restaurée dès le 1er trimestre',
      recommendedService: 'PACK PRO',
      recommendedSize: '15-30',
    },
    {
      id: 'institution-banque',
      sector: 'Institution Financière & Réseau d’Agences',
      shortTab: 'Banques & Institutions',
      icon: Building2,
      fleetProfile: '42 Berlines, SUV & Véhicules de Liaison',
      location: 'Cotonou, Porto-Novo & Dakar',
      metricFigure: '99,1%',
      metricTitle: 'Disponibilité Parc',
      annualSavingLabel: 'Zéro immobilisation réglementaire sur 18 mois',
      beforeItems: [
        {
          label: 'Usage & Trajets',
          text: 'Kilométrages hors-heures de service et détours non maîtrisés',
        },
        {
          label: 'Conformité',
          text: 'Retards de renouvellement visites techniques CNSR, TVM et assurances',
        },
        {
          label: 'Administration',
          text: 'Forte charge opérationnelle sur les équipes logistiques internes',
        },
      ],
      beforeImpact: 'Impact initial : Risques réglementaires & immobilisations imprévues',
      afterItems: [
        {
          label: 'Usage & Trajets',
          text: 'Géofencing horaire et éco-conduite (-16% de consommation moyenne)',
        },
        {
          label: 'Conformité',
          text: 'Zéro immobilisation administrative (renouvellement anticipé à J-30)',
        },
        {
          label: 'Administration',
          text: 'Délégation 360° avec interlocuteur unique JMF Mobility Services',
        },
      ],
      afterImpact: 'Bilan JMF : Conformité CNSR/ANaTT à 100% & continuité garantie',
      recommendedService: 'PACK PRO',
      recommendedSize: '30-75',
    },
    {
      id: 'logistique-transit',
      sector: 'Distribution, Agro-Industrie & Transit',
      shortTab: 'Distribution & Transit',
      icon: Truck,
      fleetProfile: '18 Utilitaires Frigorifiques & Poids Lourds',
      location: 'Port de Cotonou • Corridors UEMOA',
      metricFigure: '-31%',
      metricTitle: 'Coûts Maintenance',
      annualSavingLabel: 'Pièces OEM garanties & contrôle strict des devis',
      beforeItems: [
        {
          label: 'Atelier & Pièces',
          text: 'Facturations ateliers disparates et pièces de rechange non certifiées',
        },
        {
          label: 'Stationnement',
          text: 'Stationnements non sécurisés entre deux rotations portuaires',
        },
        {
          label: 'Convoyage',
          text: 'Absence de traçabilité contradictoire lors des transferts inter-États',
        },
      ],
      beforeImpact: 'Impact initial : Factures mécaniques gonflées & risques marchandises',
      afterItems: [
        {
          label: 'Atelier & Pièces',
          text: '-31% sur le poste maintenance avec pièces détachées OEM certifiées',
        },
        {
          label: 'Stationnement',
          text: 'Accueil au Centre de Stockage JMF gardé 24/7 sous vidéosurveillance HD',
        },
        {
          label: 'Convoyage',
          text: 'Inspection numérique contradictoire au départ et à l’arrivée',
        },
      ],
      afterImpact: 'Bilan JMF : Zéro sinistre parking & maîtrise totale des coûts OEM',
      recommendedService: 'Flotte Mixte Bénin (Utilitaires + Poids lourds + Engins)',
      recommendedSize: '15-30',
    },
  ];

  const activeCase = caseStudies[activeCaseIndex];

  return (
    <section className="py-12 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Part 1: Contractual SLA Commitments */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-sky-300 text-[11px] font-bold uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-sky-400" />
                <span>Engagements de Niveau de Service (SLA Contractuels)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Des garanties opérationnelles chiffrées et vérifiables
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Chaque contrat de gestion JMF Mobility Services intègre des indicateurs de performance (KPI) stricts conformément aux standards OHADA et UEMOA.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {slaCommitments.map((sla, idx) => {
              const Icon = sla.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/60 hover:bg-white hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${sla.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-slate-900 text-white font-mono text-[10px] font-bold">
                        {sla.badge}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                      {sla.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {sla.desc}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {sla.metric}
                    </span>
                    <span className="text-slate-400 font-mono">Contrat Pro</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Part 2: Concrete Before / After Case Studies */}
        <div className="rounded-3xl bg-[#081020] text-white p-5 sm:p-7 border border-slate-800 shadow-xl space-y-6">
          {/* Header & Single-Row Segmented Tabs */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-800/90 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                <BarChart3 className="w-4 h-4 shrink-0" />
                <span>Études de Cas Réelles • Avant / Après JMF Mobility</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Résultats mesurés sur les flottes de nos partenaires
              </h3>
            </div>

            {/* Balanced 3-Button Single-Row Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              {caseStudies.map((cs, index) => {
                const Icon = cs.icon;
                const isSelected = activeCaseIndex === index;
                return (
                  <button
                    key={cs.id}
                    type="button"
                    onClick={() => setActiveCaseIndex(index)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 font-extrabold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{cs.sector}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Case Study Comparison Grid — Equal Height Columns (items-stretch) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left Info & Result Highlight */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-4 h-full">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-bold block">
                  Profil du Parc Audité
                </span>
                <h4 className="text-base font-extrabold text-white leading-snug">
                  {activeCase.fleetProfile}
                </h4>
                <p className="text-xs text-slate-400">{activeCase.location}</p>
              </div>

              {/* Clean Single-Line Metric Figure + Subtitle */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    {activeCase.metricFigure}
                  </span>
                  <span className="text-sm sm:text-base font-extrabold text-white">
                    {activeCase.metricTitle}
                  </span>
                </div>
                <div className="text-xs text-emerald-200/90 font-medium">
                  {activeCase.annualSavingLabel}
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onSelectOffer(
                    activeCase.recommendedService,
                    activeCase.recommendedSize,
                    `Demande d'audit similaire au cas client : ${activeCase.sector} (${activeCase.fleetProfile})`
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Demander un audit similaire</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Avant vs Après — Stretched to match Left Card height */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
              {/* Avant JMF */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/25 flex flex-col justify-between gap-4 h-full">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-rose-500/15">
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-extrabold uppercase tracking-wider">
                      Avant JMF Mobility
                    </span>
                    <span className="text-[11px] text-rose-400 font-mono">Gestion classique</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-300">
                    {activeCase.beforeItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <span className="text-rose-400 font-bold mt-0.5 shrink-0">✕</span>
                        <span>
                          <strong className="text-white">{item.label} :</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-rose-500/15 flex items-center gap-2 text-[11px] text-rose-300 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span>{activeCase.beforeImpact}</span>
                </div>
              </div>

              {/* Après JMF */}
              <div className="p-5 rounded-2xl bg-emerald-950/25 border border-emerald-500/30 flex flex-col justify-between gap-4 h-full">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-emerald-500/15">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider">
                      Après Déploiement JMF 360°
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">Sous SLA</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-200">
                    {activeCase.afterItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-white">{item.label} :</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-emerald-500/15 flex items-center gap-2 text-[11px] text-emerald-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{activeCase.afterImpact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
