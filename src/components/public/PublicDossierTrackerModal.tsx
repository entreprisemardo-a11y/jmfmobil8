import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageSquare,
  Phone,
  FileText,
  ArrowRight,
  Building2,
  ClipboardCheck,
} from 'lucide-react';
import { publicLeadsService, PublicLeadRecord } from '../../services/publicLeadsService.js';

interface PublicDossierTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRef?: string;
  onOpenQuoteSection: () => void;
}

export const PublicDossierTrackerModal: React.FC<PublicDossierTrackerModalProps> = ({
  isOpen,
  onClose,
  initialRef = '',
  onOpenQuoteSection,
}) => {
  const [query, setQuery] = useState<string>(initialRef);

  const allLeads = useMemo(() => {
    if (!isOpen) return [];
    return publicLeadsService.getLeads();
  }, [isOpen]);

  const matchedLead: PublicLeadRecord | null = useMemo(() => {
    const clean = query.trim().toLowerCase();
    if (!clean) return allLeads[0] || null;
    return (
      allLeads.find(
        (l) =>
          l.ref.toLowerCase().includes(clean) ||
          l.clientName.toLowerCase().includes(clean) ||
          l.company.toLowerCase().includes(clean) ||
          l.phone.toLowerCase().includes(clean)
      ) || null
    );
  }, [query, allLeads]);

  if (!isOpen) return null;

  const getStepProgress = (status: PublicLeadRecord['status']) => {
    if (status === 'TRAITE') return 4;
    if (status === 'EN_COURS') return 3;
    return 2;
  };

  const activeStep = matchedLead ? getStepProgress(matchedLead.status) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                Suivi de Dossier, Devis & Réservation en Temps Réel
              </h3>
              <p className="text-[11px] text-slate-300">
                Vérifiez l'avancement de votre demande (Flotte, Stockage, Location, Convoyage)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
          {/* Search Input & Quick Reference Chips */}
          <div className="space-y-2.5">
            <label className="block font-bold text-slate-700">
              Numéro de référence, téléphone ou nom de société :
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex : DEV-FLT-..., JMF-2026-4812, +229..., Trans-Bénin..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Recent / Demo References */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium">Dossiers récents :</span>
              {allLeads.slice(0, 4).map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setQuery(lead.ref)}
                  className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold transition-all cursor-pointer ${
                    matchedLead?.id === lead.id
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {lead.ref}
                </button>
              ))}
            </div>
          </div>

          {matchedLead ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5 space-y-5">
              {/* Top Dossier Identity */}
              <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-md border border-sky-200">
                      {matchedLead.ref}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        matchedLead.status === 'TRAITE'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : matchedLead.status === 'EN_COURS'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}
                    >
                      {matchedLead.status === 'TRAITE'
                        ? 'Dossier Validé & Actif'
                        : matchedLead.status === 'EN_COURS'
                        ? 'En cours de traitement'
                        : 'Instruction Technique (SLA < 2h)'}
                    </span>
                  </div>
                  <h4 className="text-base font-black text-slate-900 mt-1.5">
                    {matchedLead.service}
                  </h4>
                  <p className="text-slate-600 text-xs mt-0.5">
                    {matchedLead.clientName} • <strong>{matchedLead.company}</strong>
                  </p>
                </div>

                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <div>Créé le : {matchedLead.createdAt}</div>
                  <div className="text-slate-700 font-bold mt-0.5">
                    Volume : {matchedLead.fleetSize || 'Sur mesure'}
                  </div>
                </div>
              </div>

              {/* 4-Stage Visual Progress Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                {[
                  {
                    step: 1,
                    title: 'Réception & Réf.',
                    sub: 'Enregistré au Hub JMF',
                  },
                  {
                    step: 2,
                    title: 'Étude & Cotation',
                    sub: 'Chiffrage TCO / SLA',
                  },
                  {
                    step: 3,
                    title: 'Validation Expert',
                    sub: 'Conseiller dédié assigné',
                  },
                  {
                    step: 4,
                    title: 'Déploiement',
                    sub: 'Mise en service',
                  },
                ].map((item) => {
                  const isDone = activeStep >= item.step;
                  const isCurrent = activeStep === item.step;
                  return (
                    <div
                      key={item.step}
                      className={`p-3 rounded-xl border transition-all ${
                        isCurrent
                          ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-500/15'
                          : isDone
                          ? 'bg-white border-emerald-200'
                          : 'bg-slate-100/70 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                            isDone
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {isDone ? '✓' : item.step}
                        </span>
                        {isCurrent && (
                          <span className="text-[9px] font-extrabold uppercase text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                            En cours
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-slate-900 text-xs">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.sub}</div>
                    </div>
                  );
                })}
              </div>

              {/* Direct Escalation to Bénin or Sénégal Hub */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Accélérer le traitement avec un conseiller en direct
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Mentionnez la référence <strong className="font-mono">{matchedLead.ref}</strong> sur WhatsApp
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                      `Bonjour JMF Mobility Bénin, je souhaite suivre l'avancement de mon dossier Réf : ${matchedLead.ref} (${matchedLead.company}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>🇧🇯 Hub Bénin</span>
                  </a>
                  <a
                    href={`https://wa.me/221775984392?text=${encodeURIComponent(
                      `Bonjour JMF Mobility Sénégal, je souhaite suivre l'avancement de mon dossier Réf : ${matchedLead.ref} (${matchedLead.company}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>🇸🇳 Hub Sénégal</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
              <p className="text-sm font-bold text-slate-800">
                Aucun dossier trouvé pour « {query} »
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Vérifiez votre numéro de référence (ex: DEV-FLT-...) ou créez une nouvelle demande de devis gratuite.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenQuoteSection();
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Créer une demande de devis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface FloatingMultiHubConciergeProps {
  onOpenTracker: () => void;
  onOpenQuote: () => void;
}

export const FloatingMultiHubConcierge: React.FC<FloatingMultiHubConciergeProps> = ({
  onOpenTracker,
  onOpenQuote,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2 print:hidden">
      {isOpen && (
        <div className="w-80 rounded-2xl bg-slate-900 text-white border border-slate-700/90 shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-extrabold tracking-tight">
                Assistance Directe JMF 24/7
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Hub Bénin */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇧🇯</span>
                  <span>Direction Bénin (Cotonou)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">+229 01 97 83 21 21</span>
              </div>
              <div className="text-[10px] text-slate-400">
                📍 Vodjè lot 1061, Cotonou, Bénin
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href="https://wa.me/2290197832121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+2290197832121"
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3 h-3 text-sky-400" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>

            {/* Hub Sénégal */}
            <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span>🇸🇳</span>
                  <span>Antenne Sénégal (Dakar)</span>
                </span>
                <span className="text-[10px] text-sky-400 font-mono">+221 77 598 43 92</span>
              </div>
              <div className="text-[10px] text-slate-300 font-medium">
                📍 SICAP N°6760, Liberté 6, Dakar, Sénégal
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <a
                  href="https://wa.me/221775984392"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-[11px] flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href="tel:+221775984392"
                  className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>Appeler</span>
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenTracker();
              }}
              className="py-2 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Suivi Dossier</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenQuote();
              }}
              className="py-2 px-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Devis Express</span>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-900 text-white border border-sky-500/40 shadow-xl shadow-slate-950/40 flex items-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5"
        title="Assistance Directe Bénin & Sénégal / Suivi Dossier"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <MessageSquare className="w-4 h-4 text-emerald-400" />
        <span className="text-xs font-extrabold tracking-tight">
          Direct 🇧🇯 🇸🇳 & Suivi
        </span>
      </button>
    </div>
  );
};
