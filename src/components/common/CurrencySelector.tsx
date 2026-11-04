import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Coins, Info, Globe2 } from 'lucide-react';
import {
  useCurrency,
  SUPPORTED_CURRENCIES,
  REFERENCE_RATES,
  CurrencyInfo,
} from '../../services/currencyService.js';

interface CurrencySelectorProps {
  variant?: 'header' | 'dark' | 'form' | 'compact';
  showRateNote?: boolean;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  variant = 'header',
  showRateNote = false,
  className = '',
}) => {
  const { currencyCode, currency, changeCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary 3 currencies as requested by user
  const primaryCurrencies = ['XOF', 'EUR', 'USD'];
  const otherCurrencies = SUPPORTED_CURRENCIES.filter(
    (c) => !primaryCurrencies.includes(c.code)
  );

  // Segmented inline form control for reservation modal
  if (variant === 'form') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-teal-600" />
            <span>Devise d'affichage & facturation :</span>
          </label>
          <span className="text-[10px] font-semibold text-slate-500">
            Taux de référence
          </span>
        </div>

        {/* 3 Main Currency Pills */}
        <div className="grid grid-cols-3 gap-2">
          {primaryCurrencies.map((code) => {
            const curr = SUPPORTED_CURRENCIES.find((c) => c.code === code)!;
            const isSelected = currencyCode === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => changeCurrency(code)}
                className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/90 text-teal-950 font-black shadow-xs ring-2 ring-teal-500/20'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-sm">{curr.flag}</span>
                  <span className="font-bold">{curr.code}</span>
                  {curr.symbol !== curr.code && (
                    <span className="text-[10px] text-slate-500 font-mono">({curr.symbol})</span>
                  )}
                </div>
                <div className="text-[9.5px] text-slate-500 font-normal mt-0.5">
                  {code === 'XOF' && 'Base'}
                  {code === 'EUR' && '1 € = 655,957 XOF'}
                  {code === 'USD' && '1 $ = 615 XOF'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic reference rate feedback strip */}
        <div className="flex items-center justify-between text-[10.5px] px-3 py-1.5 rounded-lg bg-teal-50/60 border border-teal-200/60 text-teal-900">
          <div className="flex items-center gap-1.5">
            <Info className="w-3 h-3 text-teal-600 shrink-0" />
            <span>
              {currencyCode === 'XOF' && (
                <>Devise de référence directe : <strong>Franc CFA (XOF)</strong>.</>
              )}
              {currencyCode === 'EUR' && (
                <>Parité fixe appliquée : <strong>1 € = 655,957 XOF</strong> (BCEAO / BEAC).</>
              )}
              {currencyCode === 'USD' && (
                <>Taux de référence appliqué : <strong>1 $ = 615,00 XOF</strong>.</>
              )}
            </span>
          </div>
          <span className="font-mono font-bold text-[10px] text-teal-700">
            {currency.code}
          </span>
        </div>
      </div>
    );
  }

  // Dark variant for dark headers (e.g. standalone rental header)
  const isDark = variant === 'dark';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
          isDark
            ? 'bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 focus:ring-2 focus:ring-teal-400/30'
            : 'bg-white hover:bg-slate-50 text-slate-800 hover:text-slate-900 border border-slate-200 focus:ring-2 focus:ring-sky-500/20'
        }`}
        aria-label="Sélectionner la devise"
        title="Changer la devise d'affichage (USD, EUR, XOF)"
      >
        <span className="text-sm leading-none">{currency.flag}</span>
        <span className="font-extrabold font-mono tracking-tight">{currency.code}</span>
        {currency.symbol !== currency.code && (
          <span
            className={`text-[10px] font-mono hidden sm:inline ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            ({currency.symbol})
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-teal-500' : isDark ? 'text-slate-400' : 'text-slate-400'
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 overflow-hidden text-slate-800">
          {/* Header */}
          <div className="px-3.5 pt-2 pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-900">
              <Globe2 className="w-3.5 h-3.5 text-sky-600" />
              <span>Devise & Taux</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-sky-50 text-sky-700 border border-sky-200 px-1.5 py-0.2 rounded">
              Actif: {currency.code}
            </span>
          </div>

          {/* Primary Currencies Section (USD, EUR, XOF) */}
          <div className="p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Devises Principales
            </div>
            {primaryCurrencies.map((code) => {
              const item = SUPPORTED_CURRENCIES.find((c) => c.code === code)!;
              const isSelected = currencyCode === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    changeCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer group ${
                    isSelected
                      ? 'bg-teal-50 border border-teal-200/80 text-teal-950 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl leading-none">{item.flag}</span>
                    <div>
                      <div className="text-xs font-bold flex items-center gap-1.5">
                        <span className={isSelected ? 'text-teal-900 font-extrabold' : 'text-slate-900'}>
                          {item.code}
                        </span>
                        <span className="text-[11px] font-normal text-slate-500">
                          — {item.label}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {code === 'XOF' && 'Base de calcul • 1 XOF = 1 XOF'}
                        {code === 'EUR' && 'Taux fixe : 1 EUR = 655,957 XOF'}
                        {code === 'USD' && 'Taux de référence : 1 USD = 615 XOF'}
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary African Currencies (collapsible or listed cleanly) */}
          <div className="border-t border-slate-100 p-2 space-y-1">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Autres Devises Régionales
            </div>
            <div className="grid grid-cols-2 gap-1">
              {otherCurrencies.map((item) => {
                const isSelected = currencyCode === item.code;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      changeCurrency(item.code);
                      setIsOpen(false);
                    }}
                    className={`text-left p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm">{item.flag}</span>
                      <span className="text-xs font-bold font-mono truncate">{item.code}</span>
                    </div>
                    {isSelected && <Check className="w-3 h-3 text-teal-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informational Footer Strip */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 leading-tight">
            Les tarifs de toute la plateforme sont recalculés en temps réel avec le taux officiel.
          </div>
        </div>
      )}
    </div>
  );
};
