import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Copy, MessageSquare, Calculator, Globe } from 'lucide-react';
import {
  SUPPORTED_CURRENCIES,
  getSelectedCurrencyCode,
  setSelectedCurrencyCode,
  formatCurrencyAmount,
  getCurrency,
} from '../../services/currencyService';

interface TcoSimulatorSectionProps {
  onApplyToQuote?: (fleetSize: number, monthlyKm: number, annualSavings: number, currencyCode: string) => void;
}

export const TcoSimulatorSection: React.FC<TcoSimulatorSectionProps> = ({
  onApplyToQuote,
}) => {
  const [fleetSize, setFleetSize] = useState<number>(25);
  const [monthlyKm, setMonthlyKm] = useState<number>(2500);
  const [copied, setCopied] = useState(false);
  const [currencyCode, setCurrencyCode] = useState<string>(getSelectedCurrencyCode());

  // Listen to external currency change events
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

  const handleCurrencyChange = (newCode: string) => {
    setCurrencyCode(newCode);
    setSelectedCurrencyCode(newCode);
  };

  // Base calculation in FCFA
  const estimatedAnnualExpenseFcfa = fleetSize * monthlyKm * 12 * 450;
  const estimatedSavingsPercent = 21.5;
  const annualSavingsFcfa = Math.round(estimatedAnnualExpenseFcfa * (estimatedSavingsPercent / 100));
  const optimizedAnnualExpenseFcfa = estimatedAnnualExpenseFcfa - annualSavingsFcfa;

  const currentCurrency = getCurrency(currencyCode);

  const handleApply = () => {
    if (onApplyToQuote) {
      onApplyToQuote(fleetSize, monthlyKm, annualSavingsFcfa, currencyCode);
    }
  };

  const shareText = `*Simulation TCO & Économies Flotte - JMF Mobility Services* :
• Taille du parc : ${fleetSize} véhicules
• Kilométrage moyen : ${monthlyKm.toLocaleString('fr-FR')} km/véhicule/mois
• Dépense annuelle sans optimisation : ${formatCurrencyAmount(estimatedAnnualExpenseFcfa, currencyCode)}
• Économie annuelle estimée : *${formatCurrencyAmount(annualSavingsFcfa, currencyCode)}* (-${estimatedSavingsPercent}%)
• Budget optimisé JMF : ${formatCurrencyAmount(optimizedAnnualExpenseFcfa, currencyCode)}
Devise sélectionnée : ${currentCurrency.label} (${currentCurrency.symbol})
Demande générée depuis le simulateur en ligne JMF Mobility.`;

  const handleCopySummary = () => {
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://wa.me/2290197832121?text=${encodeURIComponent(
    `Bonjour JMF Mobility Services, voici le résultat de ma simulation de flotte automobile :\n\n${shareText}`
  )}`;

  return (
    <section id="simulateur" className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-extrabold uppercase tracking-wider">
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span>Simulateur d'Économies & TCO Flotte</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Calculez le ROI de votre flotte automobile
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Découvrez en temps réel les économies annuelles générées par JMF Mobility sur le carburant, la maintenance et la sinistralité pour votre flotte en Afrique.
          </p>

          {/* Interactive Multi-Currency Switcher */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 mr-1">
              <Globe className="w-3.5 h-3.5 text-sky-600" /> Devise :
            </span>
            {SUPPORTED_CURRENCIES.map((curr) => {
              const active = curr.code === currencyCode;
              return (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => handleCurrencyChange(curr.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                    active
                      ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:bg-sky-50/50'
                  }`}
                  title={`${curr.label} (${curr.countryOrRegion})`}
                >
                  <span>{curr.flag}</span>
                  <span>{curr.symbol}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Compact, rectangular card container */}
        <div className="max-w-2xl mx-auto mt-6 bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-md grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Controls (Left: 7 cols) */}
          <div className="sm:col-span-7 flex flex-col justify-between space-y-3.5">
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                <span>Taille de votre parc :</span>
                <span className="text-sky-600 font-mono text-xs font-black bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {fleetSize} véhicules
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={fleetSize}
                onChange={(e) => setFleetSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-medium">
                <span>5 véh.</span>
                <span>75 véh.</span>
                <span>150+ véh.</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold text-slate-800 mb-1.5">
                <span>Kilométrage moyen mensuel :</span>
                <span className="text-sky-600 font-mono text-xs font-black bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {monthlyKm.toLocaleString('fr-FR')} km/véh.
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="6000"
                step="250"
                value={monthlyKm}
                onChange={(e) => setMonthlyKm(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5 font-medium">
                <span>1 000 km (Urbain)</span>
                <span>6 000 km (Longue distance / Corridors)</span>
              </div>
            </div>

            <div className="p-2.5 bg-sky-50/80 rounded-lg border border-sky-100 text-[11px] text-sky-950 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-sky-900">Méthode certifiée : </span>
                <span className="text-sky-800 text-[10.5px]">
                  -12% trajets superflus • -15% carburant • -25% pannes par maintenance préventive.
                </span>
              </div>
            </div>
          </div>

          {/* Results card (Right: 5 cols) */}
          <div className="sm:col-span-5 bg-gradient-to-br from-slate-900 via-[#0A1628] to-slate-950 text-white p-4 sm:p-4.5 rounded-xl shadow-lg flex flex-col justify-between space-y-3 text-center">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Économie Annuelle Estimée
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tabular-nums mt-0.5">
                {formatCurrencyAmount(annualSavingsFcfa, currencyCode)}
              </div>
            </div>

            {/* Visual Bar Comparison */}
            <div className="space-y-1.5 text-left text-xs bg-white/5 p-2 rounded-lg border border-white/5">
              <div className="flex justify-between text-slate-400 text-[10px]">
                <span>Sans JMF</span>
                <span className="font-mono">{formatCurrencyAmount(estimatedAnnualExpenseFcfa, currencyCode)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500/80 rounded-full w-full"></div>
              </div>

              <div className="flex justify-between text-emerald-400 text-[10px] pt-0.5">
                <span>Optimisé JMF</span>
                <span className="font-mono font-bold">{formatCurrencyAmount(optimizedAnnualExpenseFcfa, currencyCode)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${100 - estimatedSavingsPercent}%` }}></div>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800/80 flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Gain moyen :</span>
              <span className="text-emerald-400 font-black text-sm">- {estimatedSavingsPercent}%</span>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
              >
                <span>Appliquer au devis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-colors"
                  title="Échanger sur WhatsApp avec notre conseiller"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="py-1.5 px-2 rounded-md bg-white/10 hover:bg-white/20 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Copier le résumé chiffré"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Copié ✓</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
