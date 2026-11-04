import React from 'react';
import {
  Pickaxe,
  HardHat,
  Truck,
  Building2,
  Landmark,
  HeartPulse,
  Globe2,
  Building,
  Fuel,
  Package,
} from 'lucide-react';

export const SectorsSection: React.FC = () => {
  const sectors = [
    { title: 'Mines & industries extractives', icon: Pickaxe, desc: 'Flottes tout-terrain, convois lourds et navettes équipes' },
    { title: 'BTP & travaux publics', icon: HardHat, desc: 'Engins de chantier, camions bennes et véhicules de liaison' },
    { title: 'Transport & logistique', icon: Truck, desc: 'Transit portuaire, porte-conteneurs et corridors régionaux' },
    { title: 'Entreprises & groupes privés', icon: Building2, desc: 'Véhicules de fonction, parcs commerciaux et flottes de direction' },
    { title: 'Banques & institutions financières', icon: Landmark, desc: 'Sécurité renforcée, géolocalisation et transport de fonds/courriers' },
    { title: 'Organisations & structures de santé', icon: HeartPulse, desc: 'Ambulances, véhicules d’urgence et approvisionnement médical' },
    { title: 'ONG & organisations internationales', icon: Globe2, desc: 'Mobilité humanitaire, missions terrain et conformité d’audit' },
    { title: 'Administrations & institutions', icon: Building, desc: 'Parcs publics, protocoles officiels et gestion réglementaire' },
    { title: 'Énergie & hydrocarbures', icon: Fuel, desc: 'Cisternes sécurisées, raffineries et distribution de carburant' },
    { title: 'Distribution & commerce', icon: Package, desc: 'Livraison du dernier kilomètre et tournées urbaines optimisées' },
  ];

  return (
    <section id="secteurs" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-sky-600">
            Adaptabilité & Expertise Métier
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Nos Secteurs d'Intervention
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Nos solutions s’adaptent avec précision aux contraintes opérationnelles, réglementaires et sécuritaires de chaque industrie.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {sectors.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:bg-white hover:shadow-md transition-all text-center space-y-3 group"
              >
                <div className="w-12 h-12 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center mx-auto group-hover:bg-sky-600 group-hover:text-white transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {sec.title}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed hidden sm:block">
                  {sec.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
