import React from 'react';
import {
  Ear,
  Search,
  Lightbulb,
  Rocket,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

interface MethodologySectionProps {
  onRequestAudit: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ onRequestAudit }) => {
  const steps = [
    {
      num: '1',
      title: 'ÉCOUTER',
      icon: Ear,
      desc: 'Nous comprenons votre activité, vos contraintes métiers et les besoins spécifiques de vos collaborateurs.',
    },
    {
      num: '2',
      title: 'ANALYSER',
      icon: Search,
      desc: 'Nous évaluons en détail votre flotte existante, vos coûts réels (TCO) et vos processus opérationnels.',
    },
    {
      num: '3',
      title: 'PROPOSER',
      icon: Lightbulb,
      desc: 'Nous construisons une solution sur mesure, chiffrée et parfaitement dimensionnée pour votre organisation.',
    },
    {
      num: '4',
      title: 'DÉPLOYER',
      icon: Rocket,
      desc: 'Nous mettons en œuvre les solutions retenues (technologie, formation, conciergerie) avec rigueur terrain.',
    },
    {
      num: '5',
      title: 'OPTIMISER',
      icon: TrendingUp,
      desc: 'Nous suivons les performances en continu et identifions régulièrement de nouveaux leviers de gains.',
    },
  ];

  return (
    <section id="approche" className="py-20 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-sky-400">
            Méthodologie Éprouvée
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Notre Approche en 5 Étapes
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            « Nous ne gérons pas simplement des véhicules. Nous construisons des solutions de mobilité. »
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-sky-500/60 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-black text-sm flex items-center justify-center border border-sky-500/30">
                      {st.num}
                    </span>
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                  </div>
                  <h3 className="text-base font-black text-white tracking-wide">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-r from-sky-900 to-indigo-950 border border-sky-700/60 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center lg:text-left">
            <h3 className="text-lg font-black text-white">
              Vous avez une flotte ? Nous avons les solutions.
            </h3>
            <p className="text-xs text-slate-300">
              Que vous disposiez de 5, 20, 50, 100 ou plusieurs centaines de véhicules, nous vous accompagnons vers l'excellence.
            </p>
          </div>
          <button
            onClick={onRequestAudit}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2 shrink-0"
          >
            <span>Demander un audit gratuit de flotte</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
