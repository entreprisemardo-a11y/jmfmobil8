import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck,
  Car,
  HardHat,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ArrowRight,
  MessageSquare,
  Printer,
  ShieldCheck,
  Layers,
  Sparkles,
  RotateCcw,
  Info,
  X,
} from 'lucide-react';
import {
  pricingService,
  ProTariffGridData,
  ProTariffCategoryPack,
} from '../../services/pricingService';
import {
  formatCurrencyAmount,
  getSelectedCurrencyCode,
} from '../../services/currencyService';

interface ProfessionalTariffGridSectionProps {
  onSelectOffer?: (offerLabel: string, estimatedFleetSize?: string, customNotes?: string) => void;
}

export const ProfessionalTariffGridSection: React.FC<ProfessionalTariffGridSectionProps> = ({
  onSelectOffer,
}) => {
  const [gridData, setGridData] = useState<ProTariffGridData>(() =>
    pricingService.getProTariffGrid()
  );
  const [currencyCode, setCurrencyCode] = useState<string>(getSelectedCurrencyCode());
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'UNIT' | 'UTILITAIRE' | 'POIDS_LOURD' | 'ENGIN' | 'OPTIONS' | 'MIXED'
  >('ALL');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Interactive Mixed Fleet Calculator initialized with Section 8 official example:
  // 5 Utilitaires, 5 Poids lourds, 3 Engins de chantier
  const [mixedUtilCount, setMixedUtilCount] = useState<number>(5);
  const [mixedPlCount, setMixedPlCount] = useState<number>(5);
  const [mixedEnginCount, setMixedEnginCount] = useState<number>(3);
  const [mixedEnginLourdCount, setMixedEnginLourdCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = pricingService.subscribe(() => {
      setGridData(pricingService.getProTariffGrid());
    });
    return () => unsubscribe();
  }, []);

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

  const formatFcfaAndSelected = (amountFcfa: number) => {
    const fcfaStr = `${amountFcfa.toLocaleString('fr-FR')} FCFA`;
    if (currencyCode === 'XOF') return fcfaStr;
    return `${fcfaStr} (${formatCurrencyAmount(amountFcfa, currencyCode)})`;
  };

  // Unit rates lookup
  const unitUtilRate =
    gridData.unitRates.find((u) => u.id === 'unit_utilitaire')?.monthlyRateNumeric || 8000;
  const unitPlRate =
    gridData.unitRates.find((u) => u.id === 'unit_poids_lourd')?.monthlyRateNumeric || 18000;
  const unitEnginRate =
    gridData.unitRates.find((u) => u.id === 'unit_engin_standard')?.monthlyRateNumeric || 30000;
  const unitEnginLourdRate =
    gridData.unitRates.find((u) => u.id === 'unit_engin_lourd')?.monthlyRateNumeric || 40000;

  // Mixed Fleet Calculation
  const mixedCalculation = useMemo(() => {
    const utilTotal = mixedUtilCount * unitUtilRate;
    const plTotal = mixedPlCount * unitPlRate;
    const enginTotal = mixedEnginCount * unitEnginRate;
    const enginLourdTotal = mixedEnginLourdCount * unitEnginLourdRate;
    const monthlyTotal = utilTotal + plTotal + enginTotal + enginLourdTotal;
    const annualTotal = monthlyTotal * 12;
    const annualWith5PercentDiscount = Math.round(annualTotal * 0.95);
    return {
      utilTotal,
      plTotal,
      enginTotal,
      enginLourdTotal,
      monthlyTotal,
      annualTotal,
      annualWith5PercentDiscount,
    };
  }, [
    mixedUtilCount,
    mixedPlCount,
    mixedEnginCount,
    mixedEnginLourdCount,
    unitUtilRate,
    unitPlRate,
    unitEnginRate,
    unitEnginLourdRate,
  ]);

  const utilPacks = useMemo(
    () => gridData.categoryPacks.filter((p) => p.equipmentType === 'UTILITAIRE'),
    [gridData.categoryPacks]
  );
  const plPacks = useMemo(
    () => gridData.categoryPacks.filter((p) => p.equipmentType === 'POIDS_LOURD'),
    [gridData.categoryPacks]
  );
  const enginPacks = useMemo(
    () => gridData.categoryPacks.filter((p) => p.equipmentType === 'ENGIN'),
    [gridData.categoryPacks]
  );

  const handleSelectPack = (pack: ProTariffCategoryPack, categoryTitle: string) => {
    const label = `Grille Pro Bénin - ${categoryTitle} - Pack ${pack.packName} (${pack.fleetScope} • ${pack.monthlyFeeNumeric.toLocaleString('fr-FR')} FCFA/mois)`;
    if (onSelectOffer) {
      onSelectOffer(
        label,
        pack.fleetScope,
        `Demande d'adhésion : ${categoryTitle} — Pack ${pack.packName} (${pack.fleetScope}) à ${pack.monthlyFeeNumeric.toLocaleString('fr-FR')} FCFA / mois. Prestations : ${pack.includedServices}`
      );
    }
  };

  const handleApplyMixedFleetToQuote = () => {
    const summaryParts: string[] = [];
    if (mixedUtilCount > 0)
      summaryParts.push(
        `${mixedUtilCount} Utilitaires (${mixedUtilCount} × ${unitUtilRate.toLocaleString('fr-FR')} = ${mixedCalculation.utilTotal.toLocaleString('fr-FR')} FCFA)`
      );
    if (mixedPlCount > 0)
      summaryParts.push(
        `${mixedPlCount} Poids lourds (${mixedPlCount} × ${unitPlRate.toLocaleString('fr-FR')} = ${mixedCalculation.plTotal.toLocaleString('fr-FR')} FCFA)`
      );
    if (mixedEnginCount > 0)
      summaryParts.push(
        `${mixedEnginCount} Engins de chantier (${mixedEnginCount} × ${unitEnginRate.toLocaleString('fr-FR')} = ${mixedCalculation.enginTotal.toLocaleString('fr-FR')} FCFA)`
      );
    if (mixedEnginLourdCount > 0)
      summaryParts.push(
        `${mixedEnginLourdCount} Engins lourds spécialisés (${mixedEnginLourdCount} × ${unitEnginLourdRate.toLocaleString('fr-FR')} = ${mixedCalculation.enginLourdTotal.toLocaleString('fr-FR')} FCFA)`
      );

    const totalVehicles = mixedUtilCount + mixedPlCount + mixedEnginCount + mixedEnginLourdCount;
    const notes = `Devis Flotte Mixte Bénin : ${summaryParts.join(' + ')}. TOTAL MENSUEL : ${mixedCalculation.monthlyTotal.toLocaleString('fr-FR')} FCFA | TOTAL ANNUEL : ${mixedCalculation.annualTotal.toLocaleString('fr-FR')} FCFA.`;

    if (onSelectOffer) {
      onSelectOffer(
        `Flotte Mixte Bénin (${mixedCalculation.monthlyTotal.toLocaleString('fr-FR')} FCFA/mois)`,
        `${totalVehicles} équipements`,
        notes
      );
    }
  };

  const getWhatsAppMixedUrl = () => {
    const text = `Bonjour JMF MOBILITY SERVICES,\n\nJe souhaite obtenir une proposition confirmée selon la Grille Tarifaire Professionnelle (Bénin) pour une *Flotte Mixte* :\n- Utilitaires : ${mixedUtilCount} × ${unitUtilRate.toLocaleString('fr-FR')} FCFA = ${mixedCalculation.utilTotal.toLocaleString('fr-FR')} FCFA\n- Poids lourds : ${mixedPlCount} × ${unitPlRate.toLocaleString('fr-FR')} FCFA = ${mixedCalculation.plTotal.toLocaleString('fr-FR')} FCFA\n- Engins de chantier : ${mixedEnginCount} × ${unitEnginRate.toLocaleString('fr-FR')} FCFA = ${mixedCalculation.enginTotal.toLocaleString('fr-FR')} FCFA${
      mixedEnginLourdCount > 0
        ? `\n- Engins lourds spécialisés : ${mixedEnginLourdCount} × ${unitEnginLourdRate.toLocaleString('fr-FR')} FCFA = ${mixedCalculation.enginLourdTotal.toLocaleString('fr-FR')} FCFA`
        : ''
    }\n\n*TOTAL MENSUEL INDICATIF :* ${mixedCalculation.monthlyTotal.toLocaleString('fr-FR')} FCFA\n*TOTAL ANNUEL (×12) :* ${mixedCalculation.annualTotal.toLocaleString('fr-FR')} FCFA`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  return (
    <section
      id="grille-tarifaire-pro-benin"
      className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50 to-white border-t border-slate-200 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* =================================================================== */}
        {/* EN-TÊTE OFFICIEL DU DOCUMENT                                        */}
        {/* =================================================================== */}
        <div className="bg-white rounded-3xl border-2 border-teal-800/20 shadow-lg overflow-hidden">
          {/* Top Institutional Strip */}
          <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-teal-600">
            <div className="flex items-center gap-3">
              <span className="text-sm sm:text-base font-black tracking-tight text-white">
                JMF MOBILITY SERVICES
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-[11px] sm:text-xs font-bold tracking-widest uppercase text-teal-400">
                MOBILITÉ • FLOTTE • LOGISTIQUE
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-teal-300" />
                <span>Version Document Officiel / Imprimer</span>
              </button>
              <a
                href="https://wa.me/2290197832121?text=Bonjour%20JMF%20MOBILITY%20SERVICES%2C%20je%20souhaite%20un%20devis%20selon%20votre%20Grille%20Tarifaire%20Professionnelle%20B%C3%A9nin."
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp Bénin</span>
              </a>
            </div>
          </div>

          {/* Document Main Title & Commercial Note */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="text-center max-w-4xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight uppercase">
                GRILLE TARIFAIRE PROFESSIONNELLE
              </h2>
              <p className="text-sm sm:text-base font-extrabold text-teal-700 tracking-wide uppercase">
                GESTION ADMINISTRATIVE &amp; PLANIFICATION DE FLOTTE — BÉNIN
              </p>
              <p className="text-xs sm:text-sm italic font-medium text-slate-600">
                Utilitaires • Poids lourds • Engins de chantier
              </p>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 max-w-5xl mx-auto">
              <p>
                <strong className="text-slate-900">Objet :</strong> proposition de tarifs pour les
                entreprises de transport, de logistique, de BTP, de travaux publics et les sociétés
                minières.
              </p>
            </div>

            {/* Commercial Note Box */}
            <div className="max-w-5xl mx-auto bg-teal-50/70 border-l-4 border-teal-700 p-4 rounded-r-xl text-xs sm:text-sm text-slate-800 leading-relaxed">
              <strong className="text-slate-950 font-black">NOTE COMMERCIALE — </strong>
              Les montants ci-dessous sont des tarifs proposés par{' '}
              <strong>JMF MOBILITY SERVICES</strong> pour son offre de lancement au Bénin. Ils sont
              indicatifs et doivent être confirmés selon le nombre de véhicules, les sites, la
              fréquence du reporting et le niveau de suivi demandé.
            </div>

            {/* Quick Section Filter Pills */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 max-w-5xl mx-auto">
              {[
                { id: 'ALL', label: 'Grille Complète (Sections 1 à 8)', icon: Layers },
                { id: 'UNIT', label: '1. Tarification unitaire', icon: FileText },
                { id: 'UTILITAIRE', label: '2. Packs Utilitaires', icon: Car },
                { id: 'POIDS_LOURD', label: '3. Packs Poids lourds', icon: Truck },
                { id: 'ENGIN', label: '4. Packs Engins de chantier', icon: HardHat },
                { id: 'OPTIONS', label: '5–7. Options & Conditions', icon: ShieldCheck },
                { id: 'MIXED', label: '8. Flotte Mixte & Simulateur', icon: Calculator },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilter(tab.id as any)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      tab.id === 'ALL' ? 'sm:col-span-2 lg:col-span-2' : ''
                    } ${
                      active
                        ? 'bg-teal-800 text-white shadow-sm ring-2 ring-teal-700/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 1. TARIFICATION UNITAIRE MENSUELLE                                  */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'UNIT') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                1. Tarification unitaire mensuelle
              </h3>
              <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                Facturation à l&apos;unité ou en flotte mixte
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-5 font-bold">Catégorie d’équipement</th>
                    <th className="py-3.5 px-5 font-bold">Tarif mensuel proposé</th>
                    <th className="py-3.5 px-5 font-bold">Observations</th>
                    <th className="py-3.5 px-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {gridData.unitRates.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={idx % 2 === 1 ? 'bg-teal-50/40' : 'bg-white'}
                    >
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {item.category}
                      </td>
                      <td className="py-3.5 px-5 font-extrabold text-slate-900 whitespace-nowrap">
                        {item.isStartingFrom ? 'À partir de ' : ''}
                        {formatFcfaAndSelected(item.monthlyRateNumeric)} / {item.unitLabel}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700">{item.observations}</td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectOffer) {
                              onSelectOffer(
                                `Tarif unitaire - ${item.category} (${item.monthlyRateNumeric.toLocaleString('fr-FR')} FCFA/${item.unitLabel})`,
                                '1-10',
                                `Tarification unitaire mensuelle : ${item.category} (${item.observations}) à ${item.monthlyRateNumeric.toLocaleString('fr-FR')} FCFA / ${item.unitLabel}.`
                              );
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Choisir</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 2. PACKS POUR VÉHICULES UTILITAIRES                                 */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'UTILITAIRE') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Car className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  2. Packs pour véhicules utilitaires
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Fourgonnettes, camionnettes, pickups (1 à 30 véhicules)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-5 font-bold w-36">Pack</th>
                    <th className="py-3.5 px-5 font-bold w-44">Flotte concernée</th>
                    <th className="py-3.5 px-5 font-bold w-48">Forfait mensuel</th>
                    <th className="py-3.5 px-5 font-bold">Prestations incluses</th>
                    <th className="py-3.5 px-5 font-bold text-right w-36">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {utilPacks.map((pack, idx) => (
                    <tr
                      key={pack.id}
                      className={idx % 2 === 0 ? 'bg-teal-50/35' : 'bg-white'}
                    >
                      <td className="py-4 px-5 font-black text-slate-900 align-middle">
                        {pack.packName}
                      </td>
                      <td className="py-4 px-5 text-slate-800 font-medium align-middle">
                        {pack.fleetScope}
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 whitespace-nowrap align-middle">
                        {formatFcfaAndSelected(pack.monthlyFeeNumeric)}
                      </td>
                      <td className="py-4 px-5 text-slate-700 leading-relaxed">
                        {pack.includedServices}
                      </td>
                      <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSelectPack(pack, 'Véhicules Utilitaires')}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Demander ce pack</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              Au-delà de 30 utilitaires : devis personnalisé selon la taille de la flotte, le
              nombre de sites et la fréquence des rapports.
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. PACKS POUR POIDS LOURDS                                          */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'POIDS_LOURD') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Truck className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  3. Packs pour poids lourds
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Camions-bennes, tracteurs routiers, citernes, porteurs (1 à 20 camions)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-5 font-bold w-36">Pack</th>
                    <th className="py-3.5 px-5 font-bold w-44">Flotte concernée</th>
                    <th className="py-3.5 px-5 font-bold w-48">Forfait mensuel</th>
                    <th className="py-3.5 px-5 font-bold">Prestations incluses</th>
                    <th className="py-3.5 px-5 font-bold text-right w-36">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {plPacks.map((pack, idx) => (
                    <tr
                      key={pack.id}
                      className={idx % 2 === 0 ? 'bg-teal-50/35' : 'bg-white'}
                    >
                      <td className="py-4 px-5 font-black text-slate-900 align-middle">
                        {pack.packName}
                      </td>
                      <td className="py-4 px-5 text-slate-800 font-medium align-middle">
                        {pack.fleetScope}
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 whitespace-nowrap align-middle">
                        {formatFcfaAndSelected(pack.monthlyFeeNumeric)}
                      </td>
                      <td className="py-4 px-5 text-slate-700 leading-relaxed">
                        {pack.includedServices}
                      </td>
                      <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSelectPack(pack, 'Poids Lourds')}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Demander ce pack</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              Au-delà de 20 camions : devis personnalisé, notamment pour le transport minier ou le
              transport de marchandises.
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 4. PACKS POUR ENGINS DE CHANTIER                                    */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'ENGIN') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <HardHat className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  4. Packs pour engins de chantier
                </h3>
              </div>
              <span className="text-xs font-medium text-slate-600">
                Pelles, chargeuses, compacteurs, niveleuses, engins miniers (1 à 10 engins)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-5 font-bold w-36">Pack</th>
                    <th className="py-3.5 px-5 font-bold w-44">Parc concerné</th>
                    <th className="py-3.5 px-5 font-bold w-48">Forfait mensuel</th>
                    <th className="py-3.5 px-5 font-bold">Prestations incluses</th>
                    <th className="py-3.5 px-5 font-bold text-right w-36">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {enginPacks.map((pack, idx) => (
                    <tr
                      key={pack.id}
                      className={idx % 2 === 0 ? 'bg-teal-50/35' : 'bg-white'}
                    >
                      <td className="py-4 px-5 font-black text-slate-900 align-middle">
                        {pack.packName}
                      </td>
                      <td className="py-4 px-5 text-slate-800 font-medium align-middle">
                        {pack.fleetScope}
                      </td>
                      <td className="py-4 px-5 font-black text-slate-900 whitespace-nowrap align-middle">
                        {formatFcfaAndSelected(pack.monthlyFeeNumeric)}
                      </td>
                      <td className="py-4 px-5 text-slate-700 leading-relaxed">
                        {pack.includedServices}
                      </td>
                      <td className="py-4 px-5 text-right align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleSelectPack(pack, 'Engins de Chantier')}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-teal-800 text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <span>Demander ce pack</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
              Au-delà de 10 engins : devis personnalisé selon le type d’équipement, le nombre de
              sites et le niveau de reporting.
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 5. OPTIONS ET PRESTATIONS COMPLÉMENTAIRES                           */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'OPTIONS') && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/60">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                5. Options et prestations complémentaires
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-5 font-bold">Prestation complémentaire</th>
                    <th className="py-3.5 px-5 font-bold">Tarif indicatif</th>
                    <th className="py-3.5 px-5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                  {gridData.complementaryOptions.map((opt, idx) => (
                    <tr
                      key={opt.id}
                      className={idx % 2 === 1 ? 'bg-teal-50/40' : 'bg-white'}
                    >
                      <td className="py-3.5 px-5 text-slate-800 font-medium">{opt.name}</td>
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        {opt.indicativeRate}
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectOffer) {
                              onSelectOffer(
                                `Prestation complémentaire - ${opt.name}`,
                                '1-10',
                                `Demande de prestation complémentaire : ${opt.name} (Tarif indicatif : ${opt.indicativeRate}).`
                              );
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-teal-700 hover:text-white text-slate-800 text-xs font-bold transition-all cursor-pointer"
                        >
                          Ajouter au devis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 6. PRESTATIONS INCLUSES ET LIMITES DE SERVICE                       */}
        {/* 7. CONDITIONS COMMERCIALES RECOMMANDÉES                             */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'OPTIONS') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Section 6 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  6. Prestations incluses et limites de service
                </h3>

                {/* Comprises */}
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-teal-800">
                    Prestations comprises dans les packs
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>Gestion documentaire et alertes relatives aux échéances.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        Planification des entretiens, visites techniques et renouvellements.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        Mise à jour des fiches véhicules/engins à partir des informations
                        transmises par le client.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        Suivi administratif des interventions et production d’un rapport mensuel.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        Coordination administrative avec les interlocuteurs désignés par le client.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Non comprises */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-sm font-black text-teal-800">Prestations non comprises</h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Carburant, pièces, pneus, consommables, réparations, main-d’œuvre mécanique
                        et dépannage.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Primes d’assurance, frais de visite technique et autres frais
                        réglementaires.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Achat ou abonnement GPS, cartes SIM, logiciels et services de prestataires
                        tiers.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        Transport des véhicules, conduite, fourniture de chauffeurs et présence
                        permanente sur chantier ou en mine.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
                Le client demeure responsable de l’exactitude et de la transmission des données, de
                la validation des dépenses et de l’exécution des travaux techniques. JMF MOBILITY
                SERVICES assure la planification et le suivi administratif; ce service ne constitue
                pas une garantie d’absence de panne.
              </div>
            </div>

            {/* Section 7 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  7. Conditions commerciales recommandées
                </h3>

                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50 w-44">
                          Durée initiale
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          3 mois, renouvelable d’un commun accord.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50">
                          Facturation
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Mensuelle et payable d’avance.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50">
                          Mise en service
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Frais éventuels facturés séparément après inventaire initial du parc.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50">
                          Engagement annuel
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Remise pouvant aller jusqu’à 5 % en cas de paiement annuel anticipé, sous
                          réserve de validation.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50">
                          Fiscalité
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Tarifs en FCFA; taxes applicables à confirmer selon le régime fiscal de
                          JMF MOBILITY SERVICES.
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-teal-50/50">
                          Flotte mixte
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          Un devis global peut être établi pour regrouper utilitaires, poids lourds
                          et engins.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 flex items-center justify-between gap-3">
                <div className="text-xs text-teal-950">
                  <span className="font-bold block">Besoin d&apos;une convention sur-mesure ?</span>
                  <span>Nos équipes établissent votre contrat multi-sites sous 24h.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectOffer) {
                      onSelectOffer(
                        'Audit administratif initial de la flotte (75 000 à 200 000 FCFA)',
                        '15-30',
                        'Demande d’inventaire initial du parc et proposition de contrat de gestion administrative.'
                      );
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Demander un inventaire
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* 8. EXEMPLE DE FACTURATION — FLOTTE MIXTE (+ SIMULATEUR INTERACTIF)   */}
        {/* =================================================================== */}
        {(activeFilter === 'ALL' || activeFilter === 'MIXED') && (
          <div className="bg-white rounded-2xl border-2 border-teal-700/30 shadow-md overflow-hidden">
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-teal-300 text-xs font-bold uppercase tracking-wider">
                  <Calculator className="w-4 h-4" />
                  <span>Exemple officiel &amp; Simulateur interactif</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black">
                  8. Exemple de facturation — flotte mixte
                </h3>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMixedUtilCount(5);
                  setMixedPlCount(5);
                  setMixedEnginCount(3);
                  setMixedEnginLourdCount(0);
                }}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rétablir l&apos;exemple officiel (5 / 5 / 3)</span>
              </button>
            </div>

            <div className="p-5 sm:p-6 space-y-6">
              {/* Interactive Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Utilitaires ({unitUtilRate.toLocaleString('fr-FR')} FCFA/u)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={mixedUtilCount}
                    onChange={(e) => setMixedUtilCount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Poids lourds ({unitPlRate.toLocaleString('fr-FR')} FCFA/u)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={mixedPlCount}
                    onChange={(e) => setMixedPlCount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engins de chantier ({unitEnginRate.toLocaleString('fr-FR')} FCFA/u)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={mixedEnginCount}
                    onChange={(e) => setMixedEnginCount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Engins lourds spéc. ({unitEnginLourdRate.toLocaleString('fr-FR')} FCFA/u)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={mixedEnginLourdCount}
                    onChange={(e) => setMixedEnginLourdCount(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900 text-sm"
                  />
                </div>
              </div>

              {/* Official Table Format */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-5 font-bold">Équipement</th>
                      <th className="py-3.5 px-5 font-bold">Calcul unitaire</th>
                      <th className="py-3.5 px-5 font-bold">Montant mensuel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <td className="py-3.5 px-5 font-medium text-slate-800">Utilitaires</td>
                      <td className="py-3.5 px-5 font-mono text-slate-700">
                        {mixedUtilCount} × {unitUtilRate.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        {formatFcfaAndSelected(mixedCalculation.utilTotal)}
                      </td>
                    </tr>
                    <tr className="bg-teal-50/40">
                      <td className="py-3.5 px-5 font-medium text-slate-800">Poids lourds</td>
                      <td className="py-3.5 px-5 font-mono text-slate-700">
                        {mixedPlCount} × {unitPlRate.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        {formatFcfaAndSelected(mixedCalculation.plTotal)}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3.5 px-5 font-medium text-slate-800">
                        Engins de chantier
                      </td>
                      <td className="py-3.5 px-5 font-mono text-slate-700">
                        {mixedEnginCount} × {unitEnginRate.toLocaleString('fr-FR')} FCFA
                      </td>
                      <td className="py-3.5 px-5 font-black text-slate-900">
                        {formatFcfaAndSelected(mixedCalculation.enginTotal)}
                      </td>
                    </tr>
                    {mixedEnginLourdCount > 0 && (
                      <tr className="bg-teal-50/40">
                        <td className="py-3.5 px-5 font-medium text-slate-800">
                          Engins lourds spécialisés
                        </td>
                        <td className="py-3.5 px-5 font-mono text-slate-700">
                          {mixedEnginLourdCount} × {unitEnginLourdRate.toLocaleString('fr-FR')}{' '}
                          FCFA
                        </td>
                        <td className="py-3.5 px-5 font-black text-slate-900">
                          {formatFcfaAndSelected(mixedCalculation.enginLourdTotal)}
                        </td>
                      </tr>
                    )}
                    <tr className="bg-teal-50/80 border-t-2 border-teal-700">
                      <td className="py-4 px-5 font-black text-slate-950 uppercase">
                        TOTAL MENSUEL
                      </td>
                      <td className="py-4 px-5 font-mono text-slate-600"></td>
                      <td className="py-4 px-5 font-black text-teal-900 text-base">
                        {formatFcfaAndSelected(mixedCalculation.monthlyTotal)}
                      </td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-4 px-5 font-black text-slate-950 uppercase">
                        TOTAL ANNUEL
                      </td>
                      <td className="py-4 px-5 font-mono font-bold text-slate-800">
                        {mixedCalculation.monthlyTotal.toLocaleString('fr-FR')} × 12
                      </td>
                      <td className="py-4 px-5 font-black text-slate-950 text-base">
                        {formatFcfaAndSelected(mixedCalculation.annualTotal)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Bar for Mixed Fleet */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-600 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>
                    Avec remise d&apos;engagement annuel anticipé (jusqu&apos;à -5%) :{' '}
                    <strong className="text-teal-900">
                      {formatFcfaAndSelected(mixedCalculation.annualWith5PercentDiscount)} / an
                    </strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={getWhatsAppMixedUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Envoyer ce calcul sur WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleApplyMixedFleetToQuote}
                    className="px-5 py-2.5 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    <span>Demander ce devis Flotte Mixte</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Institutional Footer matching the PDF */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 text-center text-[11px] sm:text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">
                JMF MOBILITY SERVICES | contact@jmfmobilityservices.com |{' '}
                www.jmfmobilityservices.com
              </p>
              <p>
                WhatsApp Bénin : +229 0197 832 121 • WhatsApp France : +33 6 500 591 61
              </p>
              <p className="text-slate-500">
                Carré n°1016 VODJE, Cotonou (République du Bénin) | IFU : 0202677316566 | RCCM :
                RB/COT/26 A 119066
              </p>
            </div>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* MODAL : VERSION DOCUMENT OFFICIEL IMPRIMABLE                        */}
      {/* =================================================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-400" />
                <span className="text-xs sm:text-sm font-bold">
                  Grille Tarifaire Professionnelle — Document Officiel JMF Mobility Services
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-900">
              <div className="border-b-2 border-teal-800 pb-3 flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-lg font-black text-slate-900">JMF MOBILITY SERVICES</span>
                <span className="text-xs font-bold text-teal-700 uppercase">
                  MOBILITÉ • FLOTTE • LOGISTIQUE
                </span>
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black">
                  GRILLE TARIFAIRE PROFESSIONNELLE
                </h2>
                <p className="font-bold text-teal-800">
                  GESTION ADMINISTRATIVE &amp; PLANIFICATION DE FLOTTE — BÉNIN
                </p>
                <p className="italic text-slate-600">
                  Utilitaires • Poids lourds • Engins de chantier
                </p>
              </div>

              <p>
                <strong>Objet :</strong> proposition de tarifs pour les entreprises de transport, de
                logistique, de BTP, de travaux publics et les sociétés minières.
              </p>

              <div className="bg-teal-50 border-l-4 border-teal-800 p-3 text-xs leading-relaxed">
                <strong>NOTE COMMERCIALE —</strong> Les montants ci-dessous sont des tarifs proposés
                par JMF MOBILITY SERVICES pour son offre de lancement au Bénin. Ils sont indicatifs
                et doivent être confirmés selon le nombre de véhicules, les sites, la fréquence du
                reporting et le niveau de suivi demandé.
              </div>

              <div>
                <h3 className="font-black text-base mb-2">1. Tarification unitaire mensuelle</h3>
                <table className="w-full border border-slate-300 text-xs">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-2 text-left">Catégorie d’équipement</th>
                      <th className="p-2 text-left">Tarif mensuel proposé</th>
                      <th className="p-2 text-left">Observations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {gridData.unitRates.map((u) => (
                      <tr key={u.id}>
                        <td className="p-2 font-medium">{u.category}</td>
                        <td className="p-2 font-bold">
                          {u.isStartingFrom ? 'À partir de ' : ''}
                          {u.monthlyRateNumeric.toLocaleString('fr-FR')} FCFA / {u.unitLabel}
                        </td>
                        <td className="p-2">{u.observations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h3 className="font-black text-base mb-2">2. Packs pour véhicules utilitaires</h3>
                <table className="w-full border border-slate-300 text-xs">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-2 text-left">Pack</th>
                      <th className="p-2 text-left">Flotte concernée</th>
                      <th className="p-2 text-left">Forfait mensuel</th>
                      <th className="p-2 text-left">Prestations incluses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {utilPacks.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold">{p.packName}</td>
                        <td className="p-2">{p.fleetScope}</td>
                        <td className="p-2 font-bold">
                          {p.monthlyFeeNumeric.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="p-2">{p.includedServices}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs mt-1">
                  Au-delà de 30 utilitaires : devis personnalisé selon la taille de la flotte, le
                  nombre de sites et la fréquence des rapports.
                </p>
              </div>

              <div>
                <h3 className="font-black text-base mb-2">3. Packs pour poids lourds</h3>
                <table className="w-full border border-slate-300 text-xs">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-2 text-left">Pack</th>
                      <th className="p-2 text-left">Flotte concernée</th>
                      <th className="p-2 text-left">Forfait mensuel</th>
                      <th className="p-2 text-left">Prestations incluses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {plPacks.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold">{p.packName}</td>
                        <td className="p-2">{p.fleetScope}</td>
                        <td className="p-2 font-bold">
                          {p.monthlyFeeNumeric.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="p-2">{p.includedServices}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs mt-1">
                  Au-delà de 20 camions : devis personnalisé, notamment pour le transport minier ou
                  le transport de marchandises.
                </p>
              </div>

              <div>
                <h3 className="font-black text-base mb-2">4. Packs pour engins de chantier</h3>
                <table className="w-full border border-slate-300 text-xs">
                  <thead className="bg-slate-900 text-white">
                    <tr>
                      <th className="p-2 text-left">Pack</th>
                      <th className="p-2 text-left">Parc concerné</th>
                      <th className="p-2 text-left">Forfait mensuel</th>
                      <th className="p-2 text-left">Prestations incluses</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {enginPacks.map((p) => (
                      <tr key={p.id}>
                        <td className="p-2 font-bold">{p.packName}</td>
                        <td className="p-2">{p.fleetScope}</td>
                        <td className="p-2 font-bold">
                          {p.monthlyFeeNumeric.toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="p-2">{p.includedServices}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-xs mt-1">
                  Au-delà de 10 engins : devis personnalisé selon le type d’équipement, le nombre de
                  sites et le niveau de reporting.
                </p>
              </div>

              <div className="border-t border-slate-300 pt-4 text-center text-xs text-slate-600">
                <p className="font-bold text-slate-900">
                  JMF MOBILITY SERVICES | contact@jmfmobilityservices.com |
                  www.jmfmobilityservices.com
                </p>
                <p>WhatsApp Bénin : +229 0197 832 121 • WhatsApp France : +33 6 500 591 61</p>
                <p>
                  Carré n°1016 VODJE, Cotonou (République du Bénin) | IFU : 0202677316566 | RCCM :
                  RB/COT/26 A 119066
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
