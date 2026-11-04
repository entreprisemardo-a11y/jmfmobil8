import { useState, useEffect } from 'react';

/**
 * Currency Service for Pan-African and International Fleet Management
 * Supports seamless real-time conversion and formatting across African currencies, EUR, and USD.
 * Reference exchange rates applied for pan-African compatibility:
 * - 1 EUR = 655.957 XOF (taux fixe de parité BCEAO / BEAC)
 * - 1 USD = 615.000 XOF (taux de référence international moyen)
 * - 1 XOF = 1 XOF (Monnaie de base)
 */

export interface CurrencyInfo {
  code: string;
  label: string;
  symbol: string;
  rateFromFcfa: number; // 1 XOF/FCFA = rateFromFcfa units
  decimals: number;
  flag: string;
  countryOrRegion: string;
}

export const REFERENCE_RATES = {
  baseCurrency: 'XOF',
  rates: {
    XOF: 1,
    EUR: 655.957, // 1 EUR = 655.957 XOF
    USD: 615.0,   // 1 USD = 615 XOF
  },
  descriptions: {
    XOF: 'Monnaie de base (UEMOA / CEMAC)',
    EUR: '1 EUR = 655,957 XOF (Parité officielle fixe BCEAO / BEAC)',
    USD: '1 USD = 615,00 XOF (Taux de conversion international de référence)',
  },
};

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  {
    code: 'XOF',
    label: 'Franc CFA (UEMOA)',
    symbol: 'XOF',
    rateFromFcfa: 1,
    decimals: 0,
    flag: '🌍',
    countryOrRegion: 'Afrique de l’Ouest & Centrale',
  },
  {
    code: 'EUR',
    label: 'Euro (€)',
    symbol: '€',
    rateFromFcfa: 1 / 655.957,
    decimals: 2,
    flag: '🇪🇺',
    countryOrRegion: 'Zone Euro & International',
  },
  {
    code: 'USD',
    label: 'Dollar US ($)',
    symbol: '$',
    rateFromFcfa: 1 / 615.0,
    decimals: 2,
    flag: '🇺🇸',
    countryOrRegion: 'International',
  },
  {
    code: 'NGN',
    label: 'Naira Nigérian (₦)',
    symbol: '₦',
    rateFromFcfa: 2.38,
    decimals: 0,
    flag: '🇳🇬',
    countryOrRegion: 'Nigeria',
  },
  {
    code: 'GHS',
    label: 'Cedi Ghanéen (GH₵)',
    symbol: 'GH₵',
    rateFromFcfa: 0.024,
    decimals: 2,
    flag: '🇬🇭',
    countryOrRegion: 'Ghana',
  },
  {
    code: 'MAD',
    label: 'Dirham Marocain (DH)',
    symbol: 'DH',
    rateFromFcfa: 0.0163,
    decimals: 2,
    flag: '🇲🇦',
    countryOrRegion: 'Maroc & Maghreb',
  },
  {
    code: 'GNF',
    label: 'Franc Guinéen (FG)',
    symbol: 'FG',
    rateFromFcfa: 14.2,
    decimals: 0,
    flag: '🇬🇳',
    countryOrRegion: 'Guinée',
  },
];

const STORAGE_KEY = 'jmf_selected_currency';

export function normalizeCurrencyCode(code?: string): string {
  if (!code) return 'XOF';
  const c = code.toUpperCase();
  if (c === 'FCFA') return 'XOF';
  return c;
}

export function getSelectedCurrencyCode(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const normalized = normalizeCurrencyCode(saved);
      if (SUPPORTED_CURRENCIES.some((c) => c.code === normalized)) {
        return normalized;
      }
    }
  } catch (e) {
    // ignore
  }
  return 'XOF';
}

export function setSelectedCurrencyCode(code: string): void {
  try {
    const normalized = normalizeCurrencyCode(code);
    localStorage.setItem(STORAGE_KEY, normalized);
    window.dispatchEvent(new CustomEvent('jmf-currency-change', { detail: { code: normalized } }));
  } catch (e) {
    // ignore
  }
}

export function getCurrency(code: string = 'XOF'): CurrencyInfo {
  const normalized = normalizeCurrencyCode(code);
  return SUPPORTED_CURRENCIES.find((c) => c.code === normalized) || SUPPORTED_CURRENCIES[0];
}

export function convertFromFcfa(amountFcfa: number, currencyCode: string = 'XOF'): number {
  const currency = getCurrency(currencyCode);
  return amountFcfa * currency.rateFromFcfa;
}

export function convertToFcfa(amount: number, currencyCode: string = 'XOF'): number {
  const currency = getCurrency(currencyCode);
  if (!currency.rateFromFcfa) return amount;
  return amount / currency.rateFromFcfa;
}

export function formatCurrencyAmount(amountFcfa: number, currencyCode: string = 'XOF'): string {
  const currency = getCurrency(currencyCode);
  const converted = amountFcfa * currency.rateFromFcfa;
  const rounded = currency.decimals === 0 ? Math.round(converted) : Math.round(converted * 100) / 100;
  
  const formattedNumber = rounded.toLocaleString('fr-FR', {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  });

  // USD prefix formatting for natural look ($ 120 or 120 $)
  if (currency.code === 'USD') {
    return `$ ${formattedNumber}`;
  }
  return `${formattedNumber} ${currency.symbol}`;
}

/**
 * Custom React Hook for Reactive Currency Management across Components
 */
export function useCurrency() {
  const [currencyCode, setCurrencyCodeState] = useState<string>(() => getSelectedCurrencyCode());

  useEffect(() => {
    const handleCurrencyChange = (e: any) => {
      const newCode = normalizeCurrencyCode(e.detail?.code || getSelectedCurrencyCode());
      setCurrencyCodeState(newCode);
    };
    window.addEventListener('jmf-currency-change', handleCurrencyChange);
    return () => window.removeEventListener('jmf-currency-change', handleCurrencyChange);
  }, []);

  const changeCurrency = (code: string) => {
    setSelectedCurrencyCode(code);
    setCurrencyCodeState(normalizeCurrencyCode(code));
  };

  const currency = getCurrency(currencyCode);

  const format = (amountFcfa: number) => formatCurrencyAmount(amountFcfa, currencyCode);
  const convert = (amountFcfa: number) => convertFromFcfa(amountFcfa, currencyCode);

  return {
    currencyCode,
    currency,
    changeCurrency,
    format,
    convert,
    referenceRates: REFERENCE_RATES,
  };
}
