import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Car,
  Search,
  ShieldCheck,
  Wrench,
  TrendingDown,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  CheckCircle2,
  Clock,
  Radio,
  Building2,
  Calculator,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  Star,
  Sparkles,
  Send,
  Truck,
  Lock,
  UserPlus,
  GraduationCap,
  Leaf,
  Briefcase,
  Target,
  Award,
  Users,
  Zap,
  Globe2,
  Compass,
  Layers,
  X,
  Menu,
  Activity,
  Gauge,
  Shield,
  Check,
  MessageSquare,
  HardHat,
  Smartphone,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  UserCheck,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  Filter,
  Share2,
  RefreshCw,
  Tag,
  Key,
  Calendar,
  AlertTriangle,
  Printer,
  Info,
} from 'lucide-react';
import faqsData from '../../data/faqs.json';
import { JmfLogo } from '../common/JmfLogo.js';
import jmfHeroBannerAsset from '../../assets/brand/jmf-hero-banner.jpeg';
import { publicLeadsService } from '../../services/publicLeadsService.js';
import { ConvoyPublicFormView } from '../convoy/ConvoyPublicFormView.js';
import { TenSolutionsSection } from './TenSolutionsSection.js';
import { MiningSolutionsSection } from './MiningSolutionsSection.js';
import { SectorsSection } from './SectorsSection.js';
import { MethodologySection } from './MethodologySection.js';
import { TestimonialsCarouselSection } from './TestimonialsCarouselSection.js';
import { GlobalSearchBar } from '../common/GlobalSearchBar.js';
import { InteractiveLocationsMap } from './InteractiveLocationsMap.js';
import { TcoSimulatorSection } from './TcoSimulatorSection.js';
import { FleetPackagesSection } from './FleetPackagesSection.js';
import { ProfessionalTariffGridSection } from './ProfessionalTariffGridSection.js';
import { SparePartsSection } from './SparePartsSection.js';
import { PublicFooter } from './PublicFooter.js';
import { QRCodeDisplay, getScanAppUrl } from '../common/QRCodeDisplay.js';
import { pricingService, StorageCategoryPricing } from '../../services/pricingService.js';
import {
  SUPPORTED_CURRENCIES,
  getSelectedCurrencyCode,
  setSelectedCurrencyCode,
  formatCurrencyAmount,
  getCurrency,
} from '../../services/currencyService.js';
import { CurrencySelector } from '../common/CurrencySelector.js';
import { ExecutiveCredentialsAndSlaSection } from './ExecutiveCredentialsAndSlaSection.js';
import {
  PublicDossierTrackerModal,
  FloatingMultiHubConcierge,
} from './PublicDossierTrackerModal.js';
import { AppDownloadModal } from '../common/AppDownloadModal.js';
import { applyPageSeo } from '../../utils/seoManager.js';

export interface FaqItem {
  id: string;
  category: 'PARTICULIERS' | 'PRO';
  q: string;
  a: string;
  tag: string;
  badge?: string;
}

interface PublicWebsiteViewProps {
  onGoToApp: (tab?: 'login' | 'register') => void;
  initialPublicPage?: 'home' | 'convoyage' | 'pieces-auto';
  onGoToRental?: (openInNewTab?: boolean) => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  onGoToApp,
  initialPublicPage = 'home',
  onGoToRental,
}) => {
  const [activePublicPage, setActivePublicPage] = useState<'home' | 'convoyage' | 'pieces-auto'>(() => {
    if (initialPublicPage && initialPublicPage !== 'home') return initialPublicPage;
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const p = params.get('page');
      if (p === 'convoyage') return 'convoyage';
      if (p === 'pieces-auto' || p === 'pieces' || p === 'spare-parts') return 'pieces-auto';
    }
    return 'home';
  });

  // Sync browser URL and SEO metadata with active page
  useEffect(() => {
    applyPageSeo(activePublicPage);
    try {
      const url = new URL(window.location.href);
      if (activePublicPage === 'home') {
        if (url.searchParams.get('page') === 'convoyage' || url.searchParams.get('page') === 'pieces-auto') {
          url.searchParams.delete('page');
          window.history.pushState({}, '', url.pathname + (url.search ? url.search : ''));
        }
      } else {
        if (url.searchParams.get('page') !== activePublicPage) {
          url.searchParams.set('page', activePublicPage);
          window.history.pushState({}, '', url.toString());
        }
      }
    } catch {}
  }, [activePublicPage]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const params = new URLSearchParams(window.location.search);
      const p = params.get('page');
      if (p === 'convoyage') {
        setActivePublicPage('convoyage');
      } else if (p === 'pieces-auto' || p === 'pieces' || p === 'spare-parts') {
        setActivePublicPage('pieces-auto');
      } else {
        setActivePublicPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isBrochureModalOpen, setIsBrochureModalOpen] = useState(false);
  const [activeBrochureSlide, setActiveBrochureSlide] = useState(1);
  const [brochureViewMode, setBrochureViewMode] = useState<'slides' | 'visuals'>('slides');
  const [selectedVisualPreview, setSelectedVisualPreview] = useState<'affiche' | 'visuel'>('affiche');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAppDownloadModalOpen, setIsAppDownloadModalOpen] = useState(false);
  const [appModalTarget, setAppModalTarget] = useState<'all' | 'driver' | 'rental'>('all');
  const [isLocationMapModalOpen, setIsLocationMapModalOpen] = useState(false);
  const [isDossierTrackerOpen, setIsDossierTrackerOpen] = useState(false);
  const [dossierTrackerInitialRef, setDossierTrackerInitialRef] = useState('');
  const [tariffViewTab, setTariffViewTab] = useState<'global_packs' | 'specialized_grid' | 'all'>('global_packs');
  const [appModalCopied, setAppModalCopied] = useState(false);
  const [solutionsMenuOpen, setSolutionsMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const solutionsTimeoutRef = useRef<any>(null);
  const aboutTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setSolutionsMenuOpen(false);
      }
      if (aboutRef.current && !aboutRef.current.contains(event.target as Node)) {
        setAboutMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLocationMapModalOpen(false);
        setIsAppDownloadModalOpen(false);
        setIsSearchModalOpen(false);
        setIsBrochureModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
      if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
      if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    };
  }, []);

  const handleOpenSolutions = () => {
    if (solutionsTimeoutRef.current) clearTimeout(solutionsTimeoutRef.current);
    setSolutionsMenuOpen(true);
  };
  const handleCloseSolutions = () => {
    solutionsTimeoutRef.current = setTimeout(() => {
      setSolutionsMenuOpen(false);
    }, 200);
  };

  const handleOpenAbout = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setAboutMenuOpen(true);
  };
  const handleCloseAbout = () => {
    aboutTimeoutRef.current = setTimeout(() => {
      setAboutMenuOpen(false);
    }, 200);
  };
  const navigateToSection = (sectionId: string) => {
    if (activePublicPage !== 'home') {
      setActivePublicPage('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [heroFleetTab, setHeroFleetTab] = useState<'brand' | 'parts' | 'siege' | 'hilux' | 'suv' | 'logistics' | 'storage'>('brand');
  const [brandImageStyle, setBrandImageStyle] = useState<'photo' | 'signature' | 'affiche' | 'visuel'>('photo');

  // FAQ Dynamic States (JSON Data Source & Interactive Filters)
  const [openFaqIds, setOpenFaqIds] = useState<string[]>(['part-1']);
  const [faqCategory, setFaqCategory] = useState<'PARTICULIERS' | 'PRO' | 'ALL'>('PARTICULIERS');
  const [selectedFaqTag, setSelectedFaqTag] = useState<string>('ALL');
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqVotes, setFaqVotes] = useState<Record<string, 'UP' | 'DOWN'>>({});
  const [faqCopiedId, setFaqCopiedId] = useState<string | null>(null);
  const [faqList, setFaqList] = useState<FaqItem[]>(faqsData as FaqItem[]);
  const [faqLoading, setFaqLoading] = useState<boolean>(false);
  const [faqLoadedSource, setFaqLoadedSource] = useState<string>('/data/faqs.json');

  // Chargement asynchrone des données FAQ depuis le fichier JSON
  useEffect(() => {
    let isMounted = true;
    const fetchFaqsFromJson = async () => {
      try {
        setFaqLoading(true);
        const res = await fetch('/data/faqs.json');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && Array.isArray(json) && json.length > 0) {
            setFaqList(json as FaqItem[]);
            setFaqLoadedSource('/data/faqs.json');
          }
        }
      } catch (err) {
        console.warn('Utilisation du fallback initial pour faqs.json:', err);
      } finally {
        if (isMounted) {
          setFaqLoading(false);
        }
      }
    };

    fetchFaqsFromJson();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleReloadFaqs = async () => {
    setFaqLoading(true);
    try {
      const res = await fetch(`/data/faqs.json?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json) && json.length > 0) {
          setFaqList(json as FaqItem[]);
          setFaqLoadedSource('/data/faqs.json');
        }
      } else {
        setFaqList(faqsData as FaqItem[]);
      }
    } catch {
      setFaqList(faqsData as FaqItem[]);
    } finally {
      setFaqLoading(false);
    }
  };

  // Dynamic Custom Question Form State
  const [askQuestionOpen, setAskQuestionOpen] = useState<boolean>(false);
  const [askQuestionText, setAskQuestionText] = useState<string>('');
  const [askQuestionCategory, setAskQuestionCategory] = useState<'PARTICULIERS' | 'PRO'>('PARTICULIERS');
  const [askQuestionName, setAskQuestionName] = useState<string>('');
  const [askQuestionPhone, setAskQuestionPhone] = useState<string>('');
  const [askQuestionSubmitted, setAskQuestionSubmitted] = useState<boolean>(false);

  // Storage / Emplacements Dynamic Categories synced from Administration
  const [storageCategories, setStorageCategories] = useState<StorageCategoryPricing[]>(() =>
    pricingService.getStorageCategories().filter((c) => c.enabled !== false)
  );
  const [fleetPackages, setFleetPackages] = useState(() =>
    pricingService.getFleetPackages()
  );

  useEffect(() => {
    const handlePricingUpdate = () => {
      setStorageCategories(
        pricingService.getStorageCategories().filter((c) => c.enabled !== false)
      );
      setFleetPackages(pricingService.getFleetPackages());
    };
    const unsubscribe = pricingService.subscribe(handlePricingUpdate);
    return () => unsubscribe();
  }, []);

  const STORAGE_CATEGORIES = storageCategories;

  const getInitialStorageDates = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDay = new Date(tomorrow);
    returnDay.setDate(returnDay.getDate() + 7);
    return {
      arrival: tomorrow.toISOString().split('T')[0],
      departure: returnDay.toISOString().split('T')[0],
    };
  };

  const initialStorageDates = getInitialStorageDates();

  // Quote Form State
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    fleetSize: '15-30',
    service: 'Flotte complète & Maintenance',
    preferredContact: 'whatsapp' as 'whatsapp' | 'phone' | 'email',
    paymentPreference: 'monthly' as 'monthly' | 'deposit30' | 'annual',
    notes: '',
    // Emplacements / Centre de Stockage Spécifiques
    storageArrivalDate: initialStorageDates.arrival,
    storageArrivalTime: '08:00',
    storageDepartureDate: initialStorageDates.departure,
    storageDepartureTime: '18:00',
    storageCategory: 'suv_pickup',
    storageSpots: 1,
    storageWash: false,
    storageBattery: false,
    storageTarp: false,
    storageOverstayAcknowledged: false,
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteRefNumber, setQuoteRefNumber] = useState('');
  const [quoteValidationWarning, setQuoteValidationWarning] = useState<string | null>(null);

  // Express 15-Minute Diagnostic / Callback Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    channel: 'whatsapp' as 'whatsapp' | 'phone' | 'meet' | 'office',
    topic: 'Optimisation & Gestion de Flotte',
    slot: 'Demain matin (10h - 12h)',
    name: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const storageDays = useMemo(() => {
    if (!quoteForm.storageArrivalDate || !quoteForm.storageDepartureDate) return 1;
    const start = new Date(quoteForm.storageArrivalDate + 'T' + (quoteForm.storageArrivalTime || '00:00'));
    const end = new Date(quoteForm.storageDepartureDate + 'T' + (quoteForm.storageDepartureTime || '00:00'));
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return isNaN(diffDays) ? 1 : Math.max(1, diffDays);
  }, [quoteForm.storageArrivalDate, quoteForm.storageArrivalTime, quoteForm.storageDepartureDate, quoteForm.storageDepartureTime]);

  const selectedStorageCat = useMemo(() => {
    return STORAGE_CATEGORIES.find((c) => c.id === quoteForm.storageCategory) || STORAGE_CATEGORIES[1];
  }, [quoteForm.storageCategory]);

  const storageCalculation = useMemo(() => {
    const spots = Math.max(1, Number(quoteForm.storageSpots) || 1);
    const baseDailyTotal = selectedStorageCat.dailyRate * storageDays * spots;
    let extrasTotal = 0;
    if (quoteForm.storageWash) extrasTotal += 3500 * spots;
    if (quoteForm.storageBattery) extrasTotal += 1500 * Math.ceil(storageDays / 7) * spots;
    if (quoteForm.storageTarp) extrasTotal += 2500 * spots;
    const totalTtc = baseDailyTotal + extrasTotal;
    const overstayCostPerDay = selectedStorageCat.overstayRate * spots;

    return {
      spots,
      days: storageDays,
      dailyRate: selectedStorageCat.dailyRate,
      overstayRateUnit: selectedStorageCat.overstayRate,
      overstayCostPerDay,
      baseDailyTotal,
      extrasTotal,
      totalTtc,
    };
  }, [selectedStorageCat, storageDays, quoteForm.storageSpots, quoteForm.storageWash, quoteForm.storageBattery, quoteForm.storageTarp]);

  // Dynamic Package Pricing & Deposit Estimation
  const packageEstimate = useMemo(() => {
    const s = quoteForm.service;
    let monthlyBaseFcfa = 0;
    let packName = '';
    const findPack = (id: string) => fleetPackages.find((p) => p.id === id);

    if (s.includes('ESSENTIEL')) {
      monthlyBaseFcfa = findPack('essentiel')?.monthlyPriceNumeric || 75000;
      packName = 'Pack Essentiel (1 à 10 véh.)';
    } else if (s.includes('BUSINESS')) {
      monthlyBaseFcfa = findPack('business')?.monthlyPriceNumeric || 150000;
      packName = 'Pack Business (11 à 25 véh.)';
    } else if (s.includes('PRO')) {
      monthlyBaseFcfa = findPack('pro')?.monthlyPriceNumeric || 300000;
      packName = 'Pack Pro (26 à 50 véh.)';
    } else if (s.includes('ENTREPRISE')) {
      monthlyBaseFcfa = findPack('entreprise')?.monthlyPriceNumeric || 550000;
      packName = 'Pack Entreprise (51 à 100 véh.)';
    } else if (s.includes('CORPORATE')) {
      monthlyBaseFcfa = findPack('corporate')?.monthlyPriceNumeric || 900000;
      packName = 'Pack Corporate (+100 véh.)';
    } else if (s.includes('Télématique & GPS')) {
      monthlyBaseFcfa = 45000;
      packName = 'Télématique & GPS seul';
    } else if (s.includes('Gestion Flotte Particulier')) {
      monthlyBaseFcfa = 25000;
      packName = 'Flotte Particulier';
    } else if (s.includes('Flotte complète')) {
      monthlyBaseFcfa = 120000;
      packName = 'Flotte Complète & Maintenance';
    }

    if (!monthlyBaseFcfa) return null;

    const deposit30 = Math.round(monthlyBaseFcfa * 0.3);
    const annualWithDiscount = Math.round(monthlyBaseFcfa * 12 * 0.9);
    return {
      packName,
      monthlyBaseFcfa,
      deposit30,
      annualWithDiscount,
    };
  }, [quoteForm.service, fleetPackages]);

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteValidationWarning(null);

    if (quoteForm.service === 'Centre de stockage') {
      const start = new Date(quoteForm.storageArrivalDate + 'T' + quoteForm.storageArrivalTime);
      const end = new Date(quoteForm.storageDepartureDate + 'T' + quoteForm.storageDepartureTime);
      if (end <= start) {
        setQuoteValidationWarning('La date et heure de départ doivent être strictement postérieures à la date et heure d’arrivée.');
        return;
      }
      if (!quoteForm.storageOverstayAcknowledged) {
        setQuoteValidationWarning('Veuillez cocher la case d’acceptation des conditions de dépassement journalier (Overstay Policy).');
        return;
      }
    }

    const ref = (quoteForm.service === 'Centre de stockage' ? 'DEV-STK-' : 'DEV-FLT-') + Math.floor(100000 + Math.random() * 900000);
    setQuoteRefNumber(ref);
    publicLeadsService.addLead({
      ref,
      type: quoteForm.service === 'Centre de stockage' ? 'STOCKAGE' : 'DEVIS_FLOTTE',
      clientName: quoteForm.name || 'Client Web',
      company: quoteForm.company || 'Particulier / Direct',
      phone: quoteForm.phone,
      email: quoteForm.email,
      service: quoteForm.service,
      fleetSize:
        quoteForm.service === 'Centre de stockage'
          ? `${storageCalculation.spots} empl. • ${storageCalculation.days} j.`
          : `${quoteForm.fleetSize} véhicules`,
      currency: activeCurrencyCode,
      notes: quoteForm.notes,
    });
    setQuoteSubmitted(true);
  };

  const getWhatsAppStorageMessage = () => {
    const text = `Bonjour JMF Mobility Services,
Je souhaite confirmer ma demande de devis pour la réservation d'emplacement au Centre de Stockage :

📋 Réf. Devis : ${quoteRefNumber}
👤 Client : ${quoteForm.name}
🏢 Entreprise : ${quoteForm.company || 'Particulier'}
📞 Téléphone : ${quoteForm.phone}
📧 Email : ${quoteForm.email}

📍 Site : Hub Logistique & Stockage Sécurisé JMF
🚗 Gabarit : ${selectedStorageCat.name}
🔢 Nombre d'emplacements : ${storageCalculation.spots}
📅 Date & Heure d'Arrivée : ${quoteForm.storageArrivalDate} à ${quoteForm.storageArrivalTime}
🏁 Date & Heure de Sortie : ${quoteForm.storageDepartureDate} à ${quoteForm.storageDepartureTime}
⏱️ Durée de stationnement : ${storageCalculation.days} jour(s)
💰 Montant Devis Prévisionnel : ${formatCurrencyAmount(storageCalculation.totalTtc, activeCurrencyCode)} TTC

⚠️ Engagement Dépassement : Accord donné pour la facturation journalière supplémentaire de ${formatCurrencyAmount(storageCalculation.overstayCostPerDay, activeCurrencyCode)}/jour entamé en cas de non-retrait à l'échéance convenue.

Merci de bien vouloir me confirmer la réservation et les formalités d'accueil.`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = 'RDV-JMF-' + Math.floor(10000 + Math.random() * 90000);
    setBookingRef(ref);
    publicLeadsService.addLead({
      ref,
      type: 'RDV_DIAGNOSTIC',
      clientName: bookingForm.name || 'Visiteur Web',
      company: `Canal : ${bookingForm.channel.toUpperCase()}`,
      phone: bookingForm.phone,
      email: bookingForm.email || 'Non renseigné',
      service: bookingForm.topic,
      fleetSize: `Créneau : ${bookingForm.slot}`,
      currency: activeCurrencyCode,
      notes: bookingForm.notes,
    });
    setBookingSubmitted(true);
  };

  const getWhatsAppBookingUrl = () => {
    const channelLabel =
      bookingForm.channel === 'whatsapp'
        ? 'Discussion WhatsApp Prioritaire'
        : bookingForm.channel === 'phone'
        ? 'Appel Téléphonique Direct'
        : bookingForm.channel === 'meet'
        ? 'Visioconférence Google Meet'
        : 'Rendez-vous au Siège (Vodjè, Cotonou)';
    const text = `Bonjour JMF Mobility Services,
Je confirme ma demande de rendez-vous diagnostic (Réf : ${bookingRef}) :
- Nom : ${bookingForm.name}
- Téléphone : ${bookingForm.phone}
${bookingForm.email ? `- Email : ${bookingForm.email}\n` : ''}- Sujet : ${bookingForm.topic}
- Canal souhaité : ${channelLabel}
- Créneau choisi : ${bookingForm.slot}
${bookingForm.notes ? `- Précisions : ${bookingForm.notes}\n` : ''}
Merci de me confirmer la prise en compte de mon créneau.`;
    return `https://wa.me/2290197832121?text=${encodeURIComponent(text)}`;
  };

  const handleSelectPackage = (serviceName: string, fleetSize?: string, details?: string) => {
    setQuoteSubmitted(false);
    setQuoteValidationWarning(null);
    setQuoteForm((prev) => ({
      ...prev,
      service: serviceName,
      ...(fleetSize ? { fleetSize } : {}),
      ...(details ? { notes: details } : {}),
    }));
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Multi-currency handling
  const [activeCurrencyCode, setActiveCurrencyCode] = useState<string>(getSelectedCurrencyCode());

  useEffect(() => {
    const handleCurrencyEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ code: string }>;
      if (customEvent.detail?.code) {
        setActiveCurrencyCode(customEvent.detail.code);
      }
    };
    window.addEventListener('jmf-currency-change', handleCurrencyEvent);
    return () => window.removeEventListener('jmf-currency-change', handleCurrencyEvent);
  }, []);

  const handleCurrencyChange = (newCode: string) => {
    setActiveCurrencyCode(newCode);
    setSelectedCurrencyCode(newCode);
  };

  const handleApplySimulatorToQuote = (size: number, km: number, savings: number, currencyCode: string = 'FCFA') => {
    let sizeBracket = '15-30';
    if (size <= 15) sizeBracket = '5-15';
    else if (size <= 30) sizeBracket = '15-30';
    else if (size <= 75) sizeBracket = '30-75';
    else sizeBracket = '75+';

    const formattedSavings = formatCurrencyAmount(savings, currencyCode);

    setQuoteForm((prev) => ({
      ...prev,
      fleetSize: sizeBracket,
      notes: `Estimation simulateur TCO : Parc de ${size} véhicules, ${km.toLocaleString('fr-FR')} km/mois. Économie annuelle ciblée : ${formattedSavings} (${currencyCode}).`,
    }));

    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extraction dynamique des sous-catégories / thématiques pour le filtrage
  const availableFaqTags = useMemo(() => {
    const relevant = faqCategory === 'ALL'
      ? faqList
      : faqList.filter((f) => f.category === faqCategory);
    return Array.from(new Set(relevant.map((f) => f.tag).filter(Boolean)));
  }, [faqList, faqCategory]);

  // Filtrage dynamique multi-critères : Catégorie (Particuliers / Pro), Thème (tag), et Recherche plein texte
  const faqs = useMemo(() => {
    return faqList.filter((item) => {
      // 1. Filtre Catégorie principale
      if (faqCategory !== 'ALL' && item.category !== faqCategory) {
        return false;
      }
      // 2. Filtre Thématique spécifique
      if (selectedFaqTag !== 'ALL' && item.tag !== selectedFaqTag) {
        return false;
      }
      // 3. Recherche plein texte (question, réponse, tag, badge)
      if (faqSearchQuery.trim()) {
        const query = faqSearchQuery.toLowerCase().trim();
        const matchQ = item.q.toLowerCase().includes(query);
        const matchA = item.a.toLowerCase().includes(query);
        const matchTag = item.tag ? item.tag.toLowerCase().includes(query) : false;
        const matchBadge = item.badge ? item.badge.toLowerCase().includes(query) : false;
        return matchQ || matchA || matchTag || matchBadge;
      }
      return true;
    });
  }, [faqList, faqCategory, selectedFaqTag, faqSearchQuery]);

  const handleSelectFaqCategory = (cat: 'PARTICULIERS' | 'PRO' | 'ALL') => {
    setFaqCategory(cat);
    setSelectedFaqTag('ALL');
    const firstOfCat = cat === 'ALL'
      ? faqList[0]?.id
      : faqList.find((f) => f.category === cat)?.id;
    if (firstOfCat) {
      setOpenFaqIds([firstOfCat]);
    }
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAllFaqs = () => {
    setOpenFaqIds(faqs.map((f) => f.id));
  };

  const handleCollapseAllFaqs = () => {
    setOpenFaqIds([]);
  };

  const handleVoteFaq = (id: string, vote: 'UP' | 'DOWN') => {
    setFaqVotes((prev) => ({ ...prev, [id]: vote }));
  };

  const handleCopyFaq = (faq: FaqItem) => {
    const text = `Q : ${faq.q}\nR : ${faq.a}\n(JMF Mobility Services — https://jmf-mobility.com/#faq)`;
    navigator.clipboard?.writeText(text);
    setFaqCopiedId(faq.id);
    setTimeout(() => setFaqCopiedId(null), 2500);
  };

  const handleAskQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!askQuestionText.trim()) return;

    const newQuestionId = `custom-faq-${Date.now()}`;
    publicLeadsService.addLead({
      ref: `FAQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'QUESTION_FAQ',
      clientName: askQuestionName.trim() || 'Visiteur FAQ',
      company: askQuestionCategory === 'PARTICULIERS' ? 'Particulier' : 'Professionnel / Flotte',
      phone: askQuestionPhone.trim() || 'Non renseigné',
      email: 'Direct FAQ',
      service: 'Question en direct (FAQ)',
      fleetSize: askQuestionCategory,
      currency: activeCurrencyCode,
      notes: askQuestionText.trim(),
    });
    const newFaq: FaqItem = {
      id: newQuestionId,
      category: askQuestionCategory,
      q: askQuestionText.trim(),
      a: `Merci ${askQuestionName.trim() || 'cher utilisateur'}. Votre question a été enregistrée et transmise à notre centrale technique JMF. Un conseiller vous contactera sous 15 minutes au ${askQuestionPhone.trim() || '+229 01 97 83 21 21'}. Réponse préliminaire certifiée : nos formules télématiques, alertes SMS de maintenance, conciergerie et solutions de mobilité sont calibrées sur mesure pour vos flottes et véhicules en Afrique.`,
      tag: askQuestionCategory === 'PARTICULIERS' ? 'Usage personnel & Famille' : 'Déploiement Pro',
      badge: 'Posée en Direct • Réponse Prioritaire',
    };

    setFaqList((prev) => [newFaq, ...prev]);
    setOpenFaqIds((prev) => [newQuestionId, ...prev]);
    setFaqCategory(askQuestionCategory);
    setSelectedFaqTag('ALL');
    setAskQuestionSubmitted(true);
  };

  const brochureSlides = [
    {
      id: 1,
      title: 'JMF Mobility Services — Présentation Officielle',
      subtitle: 'La référence en gestion de flotte et mobilité durable',
      content: (
        <div className="space-y-6">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-white">
            <img
              src="/brand/jmf-hero-banner.webp"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src.endsWith('/brand/jmf-hero-banner.webp')) {
                  target.src = '/brand/jmf-hero-banner.jpeg';
                } else if (target.src !== jmfHeroBannerAsset) {
                  target.src = jmfHeroBannerAsset;
                }
              }}
              alt="JMF Mobility Services — L'Excellence en Gestion de Flotte & Mobilité"
              decoding="async"
              className="w-full h-auto object-contain block"
            />
          </div>
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-900 to-slate-900 text-white space-y-2.5">
            <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">Slide 01 · Couverture & Vision</span>
            <h3 className="text-xl font-black">L'Excellence Opérationnelle au service de votre mobilité</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              JMF Mobility Services combine expertise terrain, outils télématiques de pointe et accompagnement personnalisé pour optimiser les performances, maîtriser les dépenses et garantir la conformité des parcs automobiles en Afrique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-2xl font-black text-sky-600 font-mono">500+</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Véhicules supervisés</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-2xl font-black text-emerald-600 font-mono">98.4%</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Disponibilité garantie</div>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
              <div className="text-2xl font-black text-slate-900 font-mono">24/7</div>
              <div className="text-xs text-slate-600 font-medium mt-1">Centre de stockage & assistance</div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-14 rounded-lg bg-slate-950 border border-slate-700 overflow-hidden shrink-0 shadow-xs flex items-center justify-center">
                <img src="/assets/jmf-affiche-vodje.svg" alt="Aperçu Affiche" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">Visuels & Plaquette Officielle</span>
                <div className="text-xs font-bold text-slate-900 mt-1 truncate">🇧🇯 Vodjè lot 1061, Cotonou • 🇸🇳 SICAP N°6760, Liberté 6, Dakar</div>
                <div className="text-[11px] text-slate-600 truncate">Supports vectoriels et affiches haute résolution disponibles</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setBrochureViewMode('visuals');
                setSelectedVisualPreview('affiche');
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5"
            >
              <span>Consulter les Visuels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Qui Sommes-Nous ? — Mission, Vision & Valeurs',
      subtitle: 'Notre ADN et nos engagements stratégiques',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Notre Mission</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimiser la mobilité de nos clients avec des solutions innovantes, sécurisées et durables, générant un gain mesurable sur le coût global de possession (TCO).
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Notre Vision</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Être le partenaire de référence en gestion de flotte & mobilité d'entreprise en Afrique de l'Ouest, réputé pour sa rigueur et ses innovations.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-base">Nos 4 Valeurs</h4>
              <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
                <li>• <strong>Excellence :</strong> Qualité de service continue</li>
                <li>• <strong>Intégrité :</strong> Transparence et éthique</li>
                <li>• <strong>Innovation :</strong> Outils digitaux temps réel</li>
                <li>• <strong>Responsabilité :</strong> Sécurité et durabilité</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Pôle 01 — Gestion Complète de Flotte Automobile',
      subtitle: 'Délégation opérationnelle et optimisation du TCO',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nous prenons en charge la gestion complète de votre parc automobile pour vous faire gagner du temps et réduire les coûts d'exploitation :
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Acquisition & Renouvellement</h5>
              <p className="text-xs text-slate-600">Conseil dans le choix des véhicules, négociation concessionnaires et négociation des conditions d'achat ou de leasing.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Entretien & Maintenance Préventive</h5>
              <p className="text-xs text-slate-600">Planification rigoureuse des révisions, audits d'usure, contrôle systématique des devis d'ateliers partenaires.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Gestion Administrative & Réglementaire</h5>
              <p className="text-xs text-slate-600">Visites techniques CNSR, vignettes TVM, attestations d'assurance et cartes grises ANaTT sans interruption de service.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Suivi des Coûts & Reporting Financier</h5>
              <p className="text-xs text-slate-600">Tableaux de bord mensuels consolidés par véhicule, centre de coût et conducteur pour une parfaite visibilité.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Pôle 02 — Formation & Perfectionnement des Conducteurs',
      subtitle: 'Sécurité routière, éco-conduite et professionnalisme',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Des conducteurs formés représentent la première garantie d'un parc durable, d'un carburant maîtrisé et d'une accidentologie réduite au minimum :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 space-y-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              <h5 className="text-xs font-bold text-emerald-950">Recyclage & Perfectionnement</h5>
              <p className="text-[11px] text-emerald-800 leading-relaxed">Remise à niveau sur le code de la route, réflexes d'urgence et gestion du stress au volant.</p>
            </div>
            <div className="p-4 rounded-xl bg-teal-50 border border-teal-100 space-y-2">
              <Leaf className="w-5 h-5 text-teal-600" />
              <h5 className="text-xs font-bold text-teal-950">Éco-Conduite Économique</h5>
              <p className="text-[11px] text-teal-800 leading-relaxed">Techniques d'anticipation et gestion des régimes moteur permettant jusqu'à -18% de consommation.</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 space-y-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              <h5 className="text-xs font-bold text-amber-950">Secourisme & Gestes Premiers</h5>
              <p className="text-[11px] text-amber-800 leading-relaxed">Formation aux premiers secours en cas d'incident et utilisation du kit d'urgence embarqué.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Pôle 03 — Services Digitaux & Télématiques IoT',
      subtitle: 'Suivi GPS 4G temps réel et réconciliation intelligente',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            La technologie connectée JMF Fleet offre une transparence totale sur les déplacements, les consommations et le comportement des véhicules :
          </p>
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Balises 4G haute précision avec capteurs de tension et détection de choc</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Détection instantanée des vidanges suspectes et écarts de carburant</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Géofencing et alertes de sortie de corridors autorisés</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Application mobile conducteurs avec carnets de bord numériques</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Pôle 04 — Études, Appui & Conseils Stratégiques',
      subtitle: 'Audit de flotte, politique de mobilité et optimisation des coûts',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nos consultants seniors accompagnent les directions générales et financières dans la définition d'une politique automobile performante et rentable :
          </p>
          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold">Audit complet de parc (TCO, kilométrage, vétusté)</span>
              <span className="text-sky-600 font-mono font-bold">Rapport sous 10j</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold">Élaboration de la Car Policy interne (règlement véhicule)</span>
              <span className="text-sky-600 font-mono font-bold">Sur mesure</span>
            </div>
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="font-semibold">Conseil en fiscalité automobile (TVM, amortissement)</span>
              <span className="text-sky-600 font-mono font-bold">Expertise fiscale</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Pôle 05 — Mobilité Durable & Transition Énergétique',
      subtitle: 'Verdissement de parc et réduction d’empreinte carbone',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Engagez votre entreprise dans la transition écologique sans compromis sur la productivité de vos équipes :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
              <Leaf className="w-5 h-5 text-teal-600" />
              <h5 className="text-xs font-bold text-teal-950">Véhicules Hybrides & Faibles Émissions</h5>
              <p className="text-[11px] text-teal-800">Accompagnement au choix des motorisations adaptées aux conditions locales et calcul du gain carbone.</p>
            </div>
            <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/50 space-y-2">
              <Zap className="w-5 h-5 text-teal-600" />
              <h5 className="text-xs font-bold text-teal-950">Plan d’Éco-Conduite Certifié</h5>
              <p className="text-[11px] text-teal-800">Suivi individuel des émissions CO2 par trajet et challenge conducteurs pour stimuler la sobriété.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Centre de stockage Sécurisé & Hubs Logistiques',
      subtitle: 'Des Parcs Sécurisés & des Centres de Gestion partout en Afrique',
      content: (
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Nos sites logistiques accueillent les flottes d'entreprises, véhicules de transit, engins industriels et parcs concessionnaires en toute sécurité :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Surveillance 24/7 & Clôture :</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Caméras HD infrarouges, gardiennage permanent et rondes journalières.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Wrench className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong>Lavage & Baie d'Inspection :</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Nettoyage haute pression et inspection mécanique visuelle à chaque passage.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Radio className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong>Contrôle par QR Code :</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Traçabilité numérique instantanée des entrées et sorties des chauffeurs.</p>
              </div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Accueil Multi-Engins :</strong>
                <p className="text-[11px] text-slate-500 mt-0.5">Véhicules légers, 4x4, minibus, camions porte-conteneurs et engins de chantier.</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 9,
      title: 'Bénéfices & Prise de Contact Directe',
      subtitle: 'Votre mobilité, notre performance',
      content: (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white space-y-3">
            <h4 className="text-xl font-black">Prêt à transformer la gestion de votre flotte ?</h4>
            <p className="text-xs text-sky-100 leading-relaxed">
              Bénéficiez d'un audit personnalisé sans engagement de votre parc avec l'un de nos directeurs de clientèle.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setIsBrochureModalOpen(false);
                  const contactElem = document.getElementById('contact');
                  if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-black shadow-md hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Demander un devis express
              </button>
              <button
                onClick={() => {
                  setIsBrochureModalOpen(false);
                  onGoToApp('register');
                }}
                className="px-5 py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 text-white text-xs font-black border border-white/20 transition-colors cursor-pointer"
              >
                Créer un compte entreprise
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Phone className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900">+229 01 21 24 88 70 (Fixe)</div>
              <div className="text-[10px] text-slate-500 font-medium">
                WhatsApp & Direct : 🇧🇯 +229 01 97 83 21 21 • 🇸🇳 +221 77 598 43 92
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <Mail className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900">contact@jmfmobilityservices.com</div>
              <div className="text-[10px] text-slate-500">Réponse sous 2 heures</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="font-bold text-slate-900">Hubs Opérationnels Afrique</div>
              <div className="text-[10px] text-slate-700 font-semibold">🇧🇯 Vodjè lot 1061, Cotonou, Bénin</div>
              <div className="text-[10px] text-slate-700 font-semibold">🇸🇳 SICAP N°6760, Liberté 6, Dakar, Sénégal</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* 1. Executive Utility Strip - Soft & Refined (International) */}
      <div className="bg-[#0B1325] text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-slate-800/80">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          {/* Support status & Direct Hotlines */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px]">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Service Client 24/7
            </span>
            <a
              href="https://wa.me/2290197832121"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Assistance Hub Afrique (Bénin & Région)"
            >
              <Phone className="w-3 h-3 text-sky-400" />
              <span className="text-slate-400">Bénin :</span>
              <span className="font-semibold text-white font-mono">🇧🇯 +229 01 97 83 21 21</span>
            </a>
            <span className="text-slate-700 hidden lg:inline">·</span>
            <a
              href="tel:+2290121248870"
              className="hidden lg:flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
              title="Standard Fixe Cotonou"
            >
              <Phone className="w-3 h-3 text-amber-400/90" />
              <span>Fixe : +229 01 21 24 88 70</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <a
              href="https://wa.me/221775984392"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              title="Sénégal (Appel & WhatsApp)"
            >
              <Phone className="w-3 h-3 text-emerald-400" />
              <span className="text-slate-400">Sénégal :</span>
              <span className="font-semibold text-white font-mono">🇸🇳 +221 77 598 43 92</span>
            </a>
          </div>

          {/* Devise interactive & Contact direct WhatsApp */}
          <div className="flex items-center gap-3 text-[11px]">
            {/* Multi-Currency Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/80 transition-colors">
              <Globe2 className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">Devise :</span>
              <select
                value={activeCurrencyCode}
                onChange={(e) => handleCurrencyChange(e.target.value)}
                className="bg-transparent text-[11px] font-semibold text-white border-none focus:outline-none cursor-pointer pr-1"
                aria-label="Sélectionner la devise d'affichage"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.flag} {c.code}{c.symbol !== c.code ? ` (${c.symbol})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                setDossierTrackerInitialRef(quoteRefNumber || '');
                setIsDossierTrackerOpen(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 hover:text-sky-200 font-semibold border border-sky-500/30 transition-colors cursor-pointer"
              title="Suivre l'état d'un devis, d'une réservation ou d'un dossier technique"
            >
              <CheckCircle2 className="w-3 h-3 text-sky-400" />
              <span>Suivi Dossier</span>
            </button>

            <a
              href="https://wa.me/2290197832121"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 hover:text-emerald-200 font-semibold border border-emerald-500/30 transition-colors"
              title="Échanger sur WhatsApp avec notre conseiller 24/7"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp 24/7</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Clean 3-Zone Architecture) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-[1520px] mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between gap-3">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActivePublicPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer text-left focus:outline-none flex items-center"
              aria-label="Accueil JMF Mobility Services"
            >
              <JmfLogo variant="light" className="h-13 sm:h-15 xl:h-16" />
            </button>
          </div>

          {/* Zone 2: Navigation Centrale Épurée (5 entrées claires) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700">
            {/* 1. Accueil */}
            <button
              onClick={() => {
                setActivePublicPage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-xl hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                activePublicPage === 'home' ? 'text-sky-600 font-bold bg-sky-50/60' : ''
              }`}
            >
              Accueil
            </button>

            {/* 2. Mega-Menu Nos Solutions */}
            <div
              ref={solutionsRef}
              className="relative"
              onMouseEnter={handleOpenSolutions}
              onMouseLeave={handleCloseSolutions}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setSolutionsMenuOpen(prev => !prev);
                  setAboutMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                  solutionsMenuOpen ? 'text-sky-600 bg-slate-50 font-bold' : ''
                }`}
                aria-expanded={solutionsMenuOpen}
              >
                <span>Solutions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsMenuOpen ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
              </button>

              {/* Hover Hit Bridge */}
              <div className="absolute top-full left-0 right-0 h-2 -mt-1 pointer-events-auto" />

              {/* Mega-Menu Container */}
              {solutionsMenuOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 xl:left-0 xl:translate-x-0 w-[680px] pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 overflow-hidden">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Colonne 1 : Flottes & Mobilité */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-2 flex items-center gap-1.5">
                          <Car className="w-3 h-3 text-sky-500" />
                          <span>Flottes & Entreprise</span>
                        </div>
                        <div className="space-y-1">
                          <a
                            href="#solutions"
                            onClick={() => {
                              navigateToSection('solutions');
                              setSolutionsMenuOpen(false);
                            }}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Layers className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-1.5">
                                <span>Gestion de Flotte 360°</span>
                                <span className="text-[9px] font-bold bg-sky-100 text-sky-700 px-1.5 py-0.2 rounded">10 Pôles</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">Audit, maintenance, carburant, télématique</div>
                            </div>
                          </a>

                          <a
                            href="#mines"
                            onClick={() => {
                              navigateToSection('mines');
                              setSolutionsMenuOpen(false);
                            }}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <HardHat className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800 flex items-center gap-1.5">
                                <span>Flottes Minières & BTP</span>
                                <span className="text-[9px] font-bold uppercase bg-amber-200/60 text-amber-900 px-1.5 py-0.2 rounded">Chantiers</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">4x4 renforcés, ateliers base-vie & astreinte</div>
                            </div>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setSolutionsMenuOpen(false);
                              if (onGoToRental) {
                                onGoToRental(false);
                              } else {
                                window.open('?page=rental', '_blank');
                              }
                            }}
                            className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Key className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 flex items-center gap-1.5">
                                <span>Location de Véhicules</span>
                                <span className="text-[9px] font-bold bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded">B2B & B2C</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">Berlines, SUV, 4x4 & minibus récents</div>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Colonne 2 : Logistique & Services Spécialisés */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2.5 mb-2 flex items-center gap-1.5">
                          <Truck className="w-3 h-3 text-emerald-500" />
                          <span>Logistique & Technique</span>
                        </div>
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePublicPage('convoyage');
                              setSolutionsMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Truck className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 flex items-center gap-1.5">
                                <span>Convoyage</span>
                                <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Sécurisé</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">Transferts régionaux par chauffeurs certifiés ou plateau</div>
                            </div>
                          </button>

                          <a
                            href="#gardiennage"
                            onClick={() => {
                              navigateToSection('gardiennage');
                              setSolutionsMenuOpen(false);
                            }}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-indigo-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 flex items-center gap-1.5">
                                <span>Centre de Stockage Sécurisé</span>
                                <span className="text-[9px] font-bold bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded">Hub 24/7</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">Parc clôturé, vidéosurveillance & conciergerie</div>
                            </div>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setActivePublicPage('pieces-auto');
                              setSolutionsMenuOpen(false);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/80 transition-colors group cursor-pointer"
                          >
                            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                              <Wrench className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-1.5">
                                <span>Pièces Détachées OEM</span>
                                <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">Catalogue</span>
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1">Demande de devis avec photo & carte grise</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bannière d'accompagnement bas de méga-menu */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
                      <div className="text-xs text-slate-600">
                        <span className="font-bold text-slate-900">Besoin d'un audit de flotte ?</span> Nos experts analysent votre parc gratuitement.
                      </div>
                      <button
                        onClick={() => {
                          setSolutionsMenuOpen(false);
                          navigateToSection('contact');
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                      >
                        Demander une étude
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Secteurs */}
            <button
              onClick={() => navigateToSection('secteurs')}
              className="px-3 py-2 rounded-xl hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Secteurs
            </button>

            {/* 4. Simulateur TCO */}
            <button
              onClick={() => navigateToSection('simulateur')}
              className="px-3 py-2 rounded-xl hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <Calculator className="w-3.5 h-3.5 text-slate-400" />
              <span>Simulateur TCO</span>
            </button>

            {/* 5. Pourquoi JMF (Dropdown) */}
            <div
              ref={aboutRef}
              className="relative"
              onMouseEnter={handleOpenAbout}
              onMouseLeave={handleCloseAbout}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setAboutMenuOpen(prev => !prev);
                  setSolutionsMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-xl flex items-center gap-1.5 hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap ${
                  aboutMenuOpen ? 'text-sky-600 bg-slate-50 font-bold' : ''
                }`}
                aria-expanded={aboutMenuOpen}
              >
                <span>Pourquoi JMF</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${aboutMenuOpen ? 'rotate-180 text-sky-600' : 'text-slate-400'}`} />
              </button>

              {/* Invisible Hover Hit Bridge */}
              <div className="absolute top-full left-0 right-0 h-2 -mt-1 pointer-events-auto" />

              {/* Dropdown Menu */}
              {aboutMenuOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-2.5 space-y-1">
                    <a
                      href="#pourquoi-nous-choisir"
                      onClick={() => {
                        navigateToSection('pourquoi-nous-choisir');
                        setAboutMenuOpen(false);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Award className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-amber-800">Nos 4 Piliers d'Excellence</div>
                        <div className="text-[11px] text-slate-500 font-normal">Performance, maîtrise TCO, sécurité & sérénité</div>
                      </div>
                    </a>

                    <a
                      href="#quisommesnous"
                      onClick={() => {
                        navigateToSection('quisommesnous');
                        setAboutMenuOpen(false);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700">Présentation & Vision</div>
                        <div className="text-[11px] text-slate-500 font-normal">Qui sommes-nous, nos missions et ancrage</div>
                      </div>
                    </a>

                    <a
                      href="#approche"
                      onClick={() => {
                        navigateToSection('approche');
                        setAboutMenuOpen(false);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition-colors group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Target className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Démarche & Méthodologie</div>
                        <div className="text-[11px] text-slate-500 font-normal">Notre méthode en 5 étapes d'optimisation de parc</div>
                      </div>
                    </a>

                    <a
                      href="#faq"
                      onClick={() => {
                        navigateToSection('faq');
                        setAboutMenuOpen(false);
                        setFaqCategory('PARTICULIERS');
                        setOpenFaqIds(['part-1']);
                      }}
                      className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/80 transition-colors group border-t border-slate-100 cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-teal-700 flex items-center gap-1.5">
                          <span>FAQ & Questions Fréquentes</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">Réponses claires pour particuliers & professionnels</div>
                      </div>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        setIsBrochureModalOpen(true);
                        setAboutMenuOpen(false);
                      }}
                      className="w-full text-left flex items-start gap-3 p-2.5 rounded-xl hover:bg-sky-50 transition-colors group cursor-pointer border-t border-slate-100"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-1.5">
                          <span>Plaquette Corporate</span>
                          <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded">PDF</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">Consulter la plaquette officielle de l'entreprise</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Contact */}
            <button
              onClick={() => navigateToSection('contact')}
              className="px-3 py-2 rounded-xl hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Zone 3: Actions Clés (Épurées & Hiérarchisées) */}
          <div className="flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Bouton Location de Véhicules */}
            <button
              onClick={() => {
                if (onGoToRental) {
                  onGoToRental(false);
                } else {
                  window.open('?page=rental', '_blank');
                }
              }}
              className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-teal-900 bg-teal-50 hover:bg-teal-100/90 border border-teal-200/90 transition-all hover:shadow-xs cursor-pointer whitespace-nowrap"
              title="Accéder à la location de véhicules (Citadines, SUV, 4x4, Minibus)"
            >
              <Key className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Location de Véhicules</span>
            </button>

            {/* Bouton Espace Client */}
            <button
              onClick={() => onGoToApp('login')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200/90 whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Espace Client</span>
            </button>

            {/* CTA Principal : Demander un Devis */}
            <button
              onClick={() => navigateToSection('contact')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-xs hover:shadow-md hover:shadow-sky-600/20 transition-all hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span>Demander un Devis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl lg:hidden transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in fade-in duration-200">
            {/* Multi-Currency (USD, EUR, XOF) */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700">Devise d'affichage :</span>
              <CurrencySelector variant="compact" />
            </div>

            {/* Groupe 1 : Accès Rapides */}
            <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
              <button
                onClick={() => {
                  setActivePublicPage('home');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 text-center rounded-xl transition-colors flex flex-col items-center justify-center gap-1 ${
                  activePublicPage === 'home' ? 'bg-sky-50 text-sky-700 font-black' : 'bg-slate-50 text-slate-800 hover:bg-sky-50'
                }`}
              >
                <span>Accueil</span>
              </button>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onGoToRental) {
                    onGoToRental(false);
                  } else {
                    window.open('?page=rental', '_blank');
                  }
                }}
                className="p-2 text-center rounded-xl transition-colors bg-teal-50 text-teal-900 hover:bg-teal-100 font-bold flex flex-col items-center justify-center gap-1 cursor-pointer"
              >
                <Key className="w-3.5 h-3.5 text-teal-600" />
                <span>Location</span>
              </button>
              <button
                onClick={() => {
                  setActivePublicPage('convoyage');
                  setIsMobileMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`p-2 text-center rounded-xl transition-colors flex flex-col items-center justify-center gap-1 ${
                  activePublicPage === 'convoyage' ? 'bg-sky-600 text-white font-black' : 'bg-amber-100 text-amber-950 hover:bg-amber-200 font-bold'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                <span>Convoyage</span>
              </button>
              <button
                onClick={() => {
                  setActivePublicPage('home');
                  setIsMobileMenuOpen(false);
                  setTimeout(() => {
                    const el = document.getElementById('stockage') || document.getElementById('gardiennage');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }, 80);
                }}
                className="p-2 text-center rounded-xl transition-colors bg-indigo-50 text-indigo-900 hover:bg-indigo-100 font-bold flex flex-col items-center justify-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Stockage</span>
              </button>
            </div>

            {/* Groupe 2 : Nos Solutions */}
            <div className="space-y-1.5 pt-1 border-t border-slate-100">
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-2">
                Nos Solutions & Flotte
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('solutions');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-sky-50 text-slate-800 hover:text-sky-700 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold text-sky-900">Solutions Flotte 360°</span>
                  <span className="text-[10px] font-mono bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded">10 Pôles</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('mines');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-amber-50 text-slate-800 hover:text-amber-800 flex items-center justify-between cursor-pointer"
                >
                  <span className="font-bold text-amber-900">Secteur Minier & BTP</span>
                  <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">Chantiers</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('gardiennage');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 cursor-pointer"
                >
                  Centre de Stockage Sécurisé
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActivePublicPage('pieces-auto');
                    setIsMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full text-left p-2.5 rounded-lg font-bold flex items-center justify-between cursor-pointer ${
                    activePublicPage === 'pieces-auto'
                      ? 'bg-sky-600 text-white'
                      : 'hover:bg-sky-50 text-sky-800'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Wrench className={`w-3.5 h-3.5 ${activePublicPage === 'pieces-auto' ? 'text-white' : 'text-sky-600'}`} />
                    <span>Pièces Détachées Auto</span>
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${activePublicPage === 'pieces-auto' ? 'bg-sky-700 text-white' : 'bg-sky-100 text-sky-800'}`}>
                    Page Dédiée
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('simulateur');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5 text-slate-400" />
                  <span>Simulateur d'Économies TCO</span>
                </button>
              </div>
            </div>

            {/* Groupe 3 : L'Entreprise */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="text-[10px] uppercase font-black text-slate-400 tracking-wider px-2">
                L'Entreprise JMF
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-slate-700 font-medium">
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('quisommesnous');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 cursor-pointer"
                >
                  Présentation & Vision
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('pourquoi-nous-choisir');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 cursor-pointer"
                >
                  Pourquoi Nous Choisir
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigateToSection('approche');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 text-slate-800 cursor-pointer"
                >
                  Démarche & Engagements
                </button>
              </div>
            </div>

            {/* Groupe 4 : Secteurs, FAQ & Contact */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-bold px-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  navigateToSection('secteurs');
                  setIsMobileMenuOpen(false);
                }}
                className="text-slate-700 hover:text-sky-600 cursor-pointer"
              >
                Secteurs
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateToSection('faq');
                  setIsMobileMenuOpen(false);
                  setFaqCategory('PARTICULIERS');
                  setOpenFaqIds(['part-1']);
                }}
                className="text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FAQ Particuliers</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateToSection('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="text-sky-600 hover:text-sky-700 font-bold cursor-pointer"
              >
                Contact & Devis
              </button>
            </div>

            {/* Actions Auth & CTA Devis */}
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateToSection('contact');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 cursor-pointer"
              >
                <span>Demander un Devis en Ligne</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsBrochureModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Consulter la Plaquette Officielle</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onGoToApp('login')}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Connexion</span>
                </button>
                <button
                  onClick={() => onGoToApp('register')}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Créer un compte</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main View Router: Convoyage, Pièces Auto, or Full Homepage */}
      {activePublicPage === 'convoyage' ? (
        <main className="flex-1 bg-slate-50/50 py-8">
          <ConvoyPublicFormView onBack={() => setActivePublicPage('home')} />
        </main>
      ) : activePublicPage === 'pieces-auto' ? (
        <main className="flex-1 bg-slate-900 py-4">
          <SparePartsSection onBack={() => setActivePublicPage('home')} />
        </main>
      ) : (
        <>
          {/* 3. Hero Section (High Impact, Clear Value Proposition & Refined Command Center) */}
          <section id="accueil" className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 bg-gradient-to-b from-[#070D1B] via-[#0B152A] to-[#080E1E] text-white">
            {/* Soft Ambient Diffused Lighting */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Column: Core Value Proposition & CTAs */}
                <div className="lg:col-span-7 space-y-6">
                  {/* Clean Kicker Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-xs font-semibold text-sky-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Hub de Mobilité & Gestion de Flotte 360°</span>
                    <span className="text-slate-500 hidden sm:inline">·</span>
                    <span className="text-slate-300 hidden sm:inline font-normal">Bénin, Afrique & International</span>
                  </div>

                  {/* Impactful Headline */}
                  <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white tracking-tight leading-[1.2] text-balance">
                    Pilotez, optimisez et sécurisez{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-200 to-emerald-300">
                      votre flotte automobile
                    </span>{' '}
                    partout en Afrique.
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-2xl font-normal">
                    Télématique IoT en temps réel, maintenance proactive, fourniture express de pièces OEM d’origine, convoyage sécurisé et stockage gardé 24/7. JMF Mobility Services allie rigueur opérationnelle et technologies pour réduire durablement vos coûts de gestion.
                  </p>

                  {/* Direct CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => navigateToSection('contact')}
                      className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 transition-all hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
                    >
                      <span>Demander un Devis Gratuit</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => navigateToSection('simulateur')}
                      className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm border border-white/15 flex items-center gap-2 transition-all hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Calculator className="w-4 h-4 text-emerald-400" />
                      <span>Simuler mes Économies TCO</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsBrochureModalOpen(true)}
                      className="px-3.5 py-3 text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-sky-400" />
                      <span>Plaquette PDF</span>
                    </button>
                  </div>

                  {/* High-Impact Proof & Key Performance Indicators (KPIs) */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tabular-nums">-20%</div>
                        <div className="text-xs font-bold text-white mt-1">TCO Réduit</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Carburant & révisions</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">98.4%</div>
                        <div className="text-xs font-bold text-white mt-1">Disponibilité</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Zéro immobilisation imprévue</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tabular-nums">500+</div>
                        <div className="text-xs font-bold text-white mt-1">Véhicules Gérés</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Sous-région & Hubs</div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <div className="text-2xl sm:text-3xl font-extrabold text-indigo-300 font-mono tabular-nums">24/7</div>
                        <div className="text-xs font-bold text-white mt-1">IoT & Sécurité</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Assistance & Gardiennage</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Refined Interactive Command Center Live Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl p-4 space-y-3">
                    {/* Streamlined 3-View Segmented Control */}
                    <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-white/10 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setHeroFleetTab('brand')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          heroFleetTab === 'brand' || heroFleetTab === 'hilux' || heroFleetTab === 'suv'
                            ? 'bg-sky-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Car className="w-3.5 h-3.5" />
                        <span className="truncate">Flotte 360°</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroFleetTab('parts')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          heroFleetTab === 'parts'
                            ? 'bg-amber-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span className="truncate">Pièces OEM</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroFleetTab('siege')}
                        className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          heroFleetTab === 'siege' || heroFleetTab === 'storage'
                            ? 'bg-emerald-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="truncate">Siège Vodjè</span>
                      </button>
                    </div>

                    {/* Sub-selector for Flotte 360° models */}
                    {(heroFleetTab === 'brand' || heroFleetTab === 'hilux' || heroFleetTab === 'suv') && (
                      <div className="flex items-center justify-between gap-2 px-2 text-[11px] text-slate-400">
                        <span>Modèles opérationnels supervisés :</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setHeroFleetTab('brand')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              heroFleetTab === 'brand'
                                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Flotte Globale
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroFleetTab('hilux')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              heroFleetTab === 'hilux'
                                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Hilux 4x4
                          </button>
                          <button
                            type="button"
                            onClick={() => setHeroFleetTab('suv')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              heroFleetTab === 'suv'
                                ? 'bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Prado VIP
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Sub-selector for Siège Vodjè visuals */}
                    {(heroFleetTab === 'siege' || heroFleetTab === 'storage') && (
                      <div className="flex items-center justify-between gap-2 px-2 text-[11px] text-slate-400">
                        <span>Documents officiels du siège :</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setBrandImageStyle('visuel')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              brandImageStyle === 'visuel'
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Fiche Siège
                          </button>
                          <button
                            type="button"
                            onClick={() => setBrandImageStyle('affiche')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                              brandImageStyle === 'affiche'
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Affiche Officielle
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Image Showcase Container */}
                    <div className="space-y-2.5">
                        {/* Top Badges (Live Status Header) */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="px-3 py-1.5 rounded-lg bg-slate-950/90 border border-white/15 text-[11px] text-white flex items-center gap-2 shadow-sm min-w-0">
                            {heroFleetTab === 'parts' ? (
                              <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : heroFleetTab === 'siege' ? (
                              <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Shield className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span className="font-semibold truncate">
                              {heroFleetTab === 'parts'
                                ? 'Atelier Technique & Pièces OEM'
                                : heroFleetTab === 'siege'
                                ? 'Siège : Vodjè lot 1061, Cotonou'
                                : heroFleetTab === 'hilux'
                                ? 'Toyota Hilux 4x4 · #BJ-4501-RB'
                                : heroFleetTab === 'suv'
                                ? 'Toyota Land Cruiser Prado VIP'
                                : 'Flotte Automobile JMF · Hub Afrique'}
                            </span>
                          </div>

                          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-white/15 text-[11px] font-mono flex items-center gap-1.5 shadow-sm shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span className="text-emerald-400 font-semibold">
                              {heroFleetTab === 'parts' ? 'OEM d’Origine' : 'IoT 4G Connecté'}
                            </span>
                          </div>
                        </div>

                        {/* Visual Frame */}
                        <div
                          className={`relative rounded-xl overflow-hidden border border-white/15 group ${
                            heroFleetTab === 'brand'
                              ? 'bg-white shadow-lg'
                              : 'bg-slate-950 aspect-[16/10]'
                          }`}
                        >
                          <img
                            src={
                              heroFleetTab === 'parts'
                                ? 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&fm=webp&q=75&w=800'
                                : heroFleetTab === 'siege' || heroFleetTab === 'storage'
                                ? (brandImageStyle === 'affiche'
                                    ? '/assets/jmf-affiche-vodje.svg'
                                    : '/assets/jmf-visuel-siege-vodje.svg')
                                : heroFleetTab === 'hilux'
                                ? 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&fm=webp&q=75&w=800'
                                : heroFleetTab === 'suv'
                                ? 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&fm=webp&q=75&w=800'
                                : '/brand/jmf-hero-banner.webp'
                            }
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (heroFleetTab === 'brand') {
                                if (target.src.endsWith('/brand/jmf-hero-banner.webp')) {
                                  target.src = '/brand/jmf-hero-banner.jpeg';
                                } else if (target.src !== jmfHeroBannerAsset) {
                                  target.src = jmfHeroBannerAsset;
                                }
                              }
                            }}
                            fetchPriority="high"
                            decoding="async"
                            alt="JMF Mobility Services — L'Excellence en Gestion de Flotte & Mobilité"
                            className={`w-full ${
                              heroFleetTab === 'brand'
                                ? 'h-auto object-contain block'
                                : heroFleetTab === 'siege'
                                ? 'h-full object-contain p-2 bg-slate-950'
                                : 'h-full object-cover'
                            } transition-all duration-300`}
                          />

                          {/* Center Action Overlay for Pièces Détachées */}
                          {heroFleetTab === 'parts' && (
                            <div className="absolute inset-0 flex items-center justify-center p-4 bg-slate-950/40">
                              <button
                                type="button"
                                onClick={() => {
                                  setActivePublicPage('pieces-auto');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-slate-950/90 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-transform hover:scale-105 group cursor-pointer"
                              >
                                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                                  <Wrench className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                  <div className="text-white font-extrabold text-xs sm:text-sm flex items-center gap-1.5">
                                    <span>Demander une Pièce Détachée</span>
                                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                                  </div>
                                  <div className="text-amber-300 text-[10px] font-medium">Devis express avec photo ou carte grise</div>
                                </div>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Bottom Live Telemetry HUD Bar */}
                        <div className="p-3 bg-slate-950/90 backdrop-blur-md rounded-xl border border-white/10 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="p-1.5 bg-sky-500/20 text-sky-400 rounded-lg shrink-0">
                                {heroFleetTab === 'parts' ? (
                                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                                ) : heroFleetTab === 'siege' ? (
                                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Activity className="w-3.5 h-3.5" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white truncate">
                                  {heroFleetTab === 'parts'
                                    ? 'Catalogue Pièces Détachées Certifiées OEM'
                                    : heroFleetTab === 'siege'
                                    ? 'Siège Social Officiel JMF Mobility Services'
                                    : heroFleetTab === 'hilux'
                                    ? 'Hilux 4x4 Heavy Duty - Supervision Active'
                                    : heroFleetTab === 'suv'
                                    ? 'Land Cruiser Prado Executive VIP'
                                    : 'Supervision Globale de Flotte 24/7'}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono truncate">
                                  {heroFleetTab === 'parts'
                                    ? 'Toyota, Nissan, Mitsubishi, Bosch • Garantie constructeur'
                                    : heroFleetTab === 'siege'
                                    ? 'Vodjè lot 1061, Cotonou, Bénin • Gardiennage & Atelier'
                                    : 'Télématique GPS temps réel & diagnostic embarqué'}
                                </div>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-medium text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800/60 shrink-0">
                              {heroFleetTab === 'parts' ? 'OEM' : heroFleetTab === 'siege' ? 'COTONOU' : 'LIVE'}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-white/10 grid grid-cols-3 gap-2 text-[10px] text-slate-300 font-mono">
                            <div>
                              {heroFleetTab === 'parts' ? 'Dispo : ' : heroFleetTab === 'siege' ? 'Accès : ' : 'Vitesse : '}
                              <span className="text-white font-semibold">
                                {heroFleetTab === 'parts'
                                  ? 'En stock / 48h'
                                  : heroFleetTab === 'siege'
                                  ? 'Sécurisé 24/7'
                                  : heroFleetTab === 'suv'
                                  ? '65 km/h'
                                  : '42 km/h'}
                              </span>
                            </div>
                            <div>
                              {heroFleetTab === 'parts' ? 'Garantie : ' : heroFleetTab === 'siege' ? 'Atelier : ' : 'Carburant : '}
                              <span className="text-emerald-400 font-semibold">
                                {heroFleetTab === 'parts'
                                  ? 'Constructeur'
                                  : heroFleetTab === 'siege'
                                  ? 'Opérationnel'
                                  : '92% Conforme'}
                              </span>
                            </div>
                            <div>
                              {heroFleetTab === 'parts' ? (
                                <>
                                  Devis : <span className="text-sky-400 font-semibold">Sous 24h</span>
                                </>
                              ) : heroFleetTab === 'siege' ? (
                                <>
                                  Plan : <span className="text-sky-400 font-semibold">Accessible</span>
                                </>
                              ) : (
                                <>
                                  CNSR : <span className="text-sky-400 font-semibold">À jour</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Partner & Institutional Trust Bar - Compact Zero-Empty-Space Layout */}
          <div className="bg-slate-900 text-white border-y border-slate-800 py-3.5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold uppercase tracking-wider text-slate-200 text-[11px]">
                    Partenaires d'Affaires & Confiance Institutionnelle
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agrément Transport Réglementé</span>
                  </span>
                  <span className="inline-flex items-center gap-1 hidden sm:inline-flex">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                    <span>Conformité CNSR & Assurances</span>
                  </span>
                </div>
              </div>

              {/* Compact Partner Initial Badges - Zero wasted horizontal space */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  {
                    abbr: 'ACD',
                    color: 'from-sky-500 to-blue-600',
                  },
                  {
                    abbr: 'MIG',
                    color: 'from-amber-500 to-orange-600',
                  },
                  {
                    abbr: 'ATT',
                    color: 'from-indigo-500 to-purple-600',
                  },
                  {
                    abbr: 'SICA',
                    color: 'from-emerald-500 to-teal-600',
                  },
                  {
                    abbr: 'DKY',
                    color: 'from-rose-500 to-pink-600',
                  },
                ].map((partner, pIdx) => (
                  <div
                    key={pIdx}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all duration-200 inline-flex items-center gap-2 group"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg bg-gradient-to-br ${partner.color} text-white font-black text-[10px] flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}
                    >
                      {partner.abbr}
                    </div>
                    <span className="text-xs font-black text-white group-hover:text-sky-300 transition-colors">
                      {partner.abbr}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. Section : Pourquoi Choisir JMF Mobility Services - Soft & Compact */}
          <section id="pourquoi-nous-choisir" className="py-12 bg-slate-50/60 border-b border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 block">
                  Nos 5 Piliers d'Excellence
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Pourquoi Choisir JMF Mobility Services ?
                </h2>
                <p className="text-sm sm:text-base text-slate-500 font-normal leading-relaxed">
                  Parce que votre mobilité mérite mieux qu'une simple gestion de véhicules.
                </p>
              </div>

              {/* 5 Pillars Grid - Soft, Balanced Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {/* 1. Performance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Performance</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Nous recherchons en permanence les solutions permettant d'améliorer l'efficacité et la disponibilité continue de votre flotte.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-sky-600 pt-3 border-t border-slate-50">
                    Disponibilité 98.4%
                  </div>
                </div>

                {/* 2. Maîtrise des coûts */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <TrendingDown className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Maîtrise des coûts</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Notre approche TCO rigoureuse vous aide à mieux comprendre, anticiper et contrôler chaque poste de coût lié à votre mobilité.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-600 pt-3 border-t border-slate-50">
                    Jusqu'à -21.5% TCO
                  </div>
                </div>

                {/* 3. Sécurité */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Sécurité</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Nous plaçons la sécurité des conducteurs, des collaborateurs et des véhicules au cœur absolu de chacune de nos interventions.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-indigo-600 pt-3 border-t border-slate-50">
                    Protocoles CNSR & HSE
                  </div>
                </div>

                {/* 4. Durabilité */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <Leaf className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Durabilité</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Nous favorisons des solutions de mobilité plus responsables, l'éco-conduite et la transition progressive de votre parc automobile.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 pt-3 border-t border-slate-50">
                    Éco-mobilité responsable
                  </div>
                </div>

                {/* 5. Sérénité */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-slate-200 hover:shadow-md transition-all space-y-4 flex flex-col justify-between group">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">Sérénité</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      Nous vous accompagnons dans la gestion opérationnelle quotidienne afin que vous puissiez vous concentrer sur votre cœur de métier.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-teal-600 pt-3 border-t border-slate-50">
                    Support expert 24/7
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 6. Section : Solutions 360° (Études, Gestion, Sécurité, etc.) */}
          <TenSolutionsSection onSelectSolution={handleSelectPackage} />

          {/* Section Spéciale : Solutions Minières & Chantiers BTP */}
          <MiningSolutionsSection onSelectService={handleSelectPackage} />

          {/* 7. Section : Présentation de l'Entreprise (À Propos de JMF Mobility Services) */}
          <section id="quisommesnous" className="py-12 sm:py-14 bg-white border-b border-slate-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-sky-600" />
                  <span>Présentation de l'Entreprise</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Une nouvelle vision de la mobilité professionnelle
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <strong>JMF Mobility Services</strong> est un partenaire spécialisé dans la gestion de flotte automobile et les solutions de mobilité. Notre ambition est simple : proposer aux entreprises des solutions fiables, flexibles et adaptées à leurs réalités opérationnelles. Nous combinons conseil, technologie, services opérationnels et expertise automobile pour construire une mobilité plus performante.
                </p>
              </div>

              {/* Vision & Mission - Balanced and Constrained Width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
                {/* Notre Vision */}
                <div className="bg-slate-50/90 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-xs">
                      <Globe2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">Notre Vision</h3>
                      <p className="text-[11px] text-sky-700 font-bold mt-0.5">Levier de performance stratégique</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Faire de la mobilité un véritable levier de performance stratégique, de croissance et de compétitivité pour les entreprises et les institutions.
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-200/80">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span><strong>Conseil stratégique :</strong> Optimisation continue de flotte</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span><strong>Technologie :</strong> Pilotage et visibilité en temps réel</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span><strong>Sérénité :</strong> Continuité opérationnelle garantie</span>
                    </div>
                  </div>
                </div>

                {/* Notre Mission */}
                <div className="bg-slate-50/90 p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-xs">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wide">Notre Mission</h3>
                      <p className="text-[11px] text-indigo-700 font-bold mt-0.5">Excellence opérationnelle au quotidien</p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      Permettre à nos clients de disposer d'une mobilité professionnelle clé en main :
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-200/80">
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                      <span><strong>Plus performante :</strong> Disponibilité maximale des véhicules</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Plus économique :</strong> TCO maîtrisé et suppression des gaspillages</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span><strong>Plus sûre :</strong> Sécurité absolue et conformité HSE</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span><strong>Plus responsable :</strong> Éco-mobilité et transition énergétique</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Highlight - Compacted */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white text-center space-y-1.5 border border-slate-800 shadow-md max-w-3xl mx-auto">
                <p className="text-sm sm:text-base font-bold text-sky-200 italic leading-snug">
                  « Nous ne gérons pas simplement des véhicules. Nous construisons des solutions de mobilité. »
                </p>
                <p className="text-[11px] text-slate-400">
                  JMF Mobility Services — Votre mobilité, notre engagement.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Section : Secteurs d'Intervention */}
          <SectorsSection />

          {/* 9. Section : Nos Engagements & Notre Approche Méthodologique en 5 Étapes */}
          <MethodologySection onRequestAudit={() => handleSelectPackage('Audit et diagnostic de flotte')} />

          {/* 7. Section : Centre de stockage & Hubs Sécurisés (Plaquette Slide 8 & User Request 4) */}
          <div id="stockage" className="scroll-mt-24" />
          <section id="gardiennage" className="scroll-mt-24 py-12 sm:py-14 bg-slate-900 text-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                {/* Left Text */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
                    <Building2 className="w-4 h-4" />
                    <span>Centre de stockage & Hubs Opérationnels</span>
                  </div>

                  {/* Title strictly adhering to user request */}
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                    Des Parcs Sécurisés & des Centres de Gestion partout en Afrique
                  </h2>

                  {/* Description strictly adhering to user request */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Nos sites logistiques accueillent les flottes d'entreprises, véhicules de transit, engins industriels et parcs concessionnaires en toute sécurité.
                  </p>

                  <div className="space-y-3.5 pt-2">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-200">
                        <span className="font-bold text-white">Surveillance 24/7 & Gardiennage :</span> Clôture électrifiée périmétrique, caméras infrarouges haute définition et rondes de sécurité continues.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-200">
                        <span className="font-bold text-white">Lavage & Baie d'Inspection :</span> Nettoyage régulier des véhicules de fonction et contrôle d'état d'arrivée et départ.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-200">
                        <span className="font-bold text-white">Gestion Dématérialisée :</span> Enregistrement instantané des mouvements par scan QR Code et badge RFID chauffeur.
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-200">
                        <span className="font-bold text-white">Capacité Multi-Engins :</span> Emplacements dédiés pour véhicules légers, SUV, pick-up, bus et poids lourds de transit portuaire.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleSelectPackage('Centre de stockage')}
                      className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Réserver des emplacements
                    </button>
                    <button
                      onClick={() => setIsBrochureModalOpen(true)}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Détails techniques du centre
                    </button>
                  </div>
                </div>

                {/* Right Image Showcase */}
                <div className="lg:col-span-6">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl group">
                    <img
                      src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&fm=webp&q=75&w=800"
                      alt="Centre de stockage et parcs sécurisés en Afrique"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-88 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex items-end p-5">
                      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-4 py-3 text-xs text-white flex items-center gap-2 shadow-lg">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="font-bold">Centre de stockage opérationnel 24h/24 & 7j/7</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 8. Interactive TCO Simulator Section (Modularisé, Partage WhatsApp & Copie Synthèse) */}
          <TcoSimulatorSection onApplyToQuote={handleApplySimulatorToQuote} />

          {/* 9. Comparateur Tarifaire Unifié à Onglets (Packs Globaux & Grille Spécialisée Pro) */}
          <div className="bg-slate-900 border-t border-slate-800 pt-8 pb-3 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                  Offres & Tarification Transparente Multi-Devises
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  Choisissez la grille adaptée à la typologie de votre parc
                </h2>
              </div>

              <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTariffViewTab('global_packs')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    tariffViewTab === 'global_packs'
                      ? 'bg-sky-500 text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Packs Flotte 360° (1 à +100 véh.)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTariffViewTab('specialized_grid')}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    tariffViewTab === 'specialized_grid'
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Utilitaires, Poids Lourds & Engins</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTariffViewTab('all')}
                  className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    tariffViewTab === 'all'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  Tout afficher
                </button>
              </div>
            </div>
          </div>

          {(tariffViewTab === 'global_packs' || tariffViewTab === 'all') && (
            <FleetPackagesSection onSelectPackage={handleSelectPackage} />
          )}

          {(tariffViewTab === 'specialized_grid' || tariffViewTab === 'all') && (
            <ProfessionalTariffGridSection onSelectOffer={handleSelectPackage} />
          )}

          {/* 9c. Engagements Contractuels SLA & Études de Cas Chiffrées (« Avant / Après JMF ») */}
          <ExecutiveCredentialsAndSlaSection onSelectOffer={handleSelectPackage} />

          {/* 10. Interactive Customer Testimonials Carousel Section */}
          <TestimonialsCarouselSection
            onRequestAudit={(serviceName) => handleSelectPackage(serviceName || 'Audit et diagnostic de flotte')}
          />

          {/* 11. FAQ Accordion Section Dynamique (Particuliers & Entreprises) */}
          <section id="faq" className="py-12 sm:py-14 bg-white border-t border-slate-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                  <span>Questions Fréquentes • Particuliers & Entreprises</span>
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                  Tout savoir sur les solutions JMF Mobility
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Consultez nos réponses certifiées ou filtrez instantanément pour votre véhicule personnel ou votre flotte d'entreprise.
                </p>
              </div>

              {/* Category Selector Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectFaqCategory('PARTICULIERS')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                    faqCategory === 'PARTICULIERS'
                      ? 'bg-teal-600 text-white shadow-teal-600/25 ring-2 ring-teal-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Pour les Particuliers & Familles</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    faqCategory === 'PARTICULIERS' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                  }`}>
                    {faqList.filter((f) => f.category === 'PARTICULIERS').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectFaqCategory('PRO')}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                    faqCategory === 'PRO'
                      ? 'bg-sky-600 text-white shadow-sky-600/25 ring-2 ring-sky-600/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  <span>Entreprises & Gestionnaires Pro</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                    faqCategory === 'PRO' ? 'bg-white/20 text-white' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {faqList.filter((f) => f.category === 'PRO').length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectFaqCategory('ALL')}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                    faqCategory === 'ALL'
                      ? 'bg-slate-900 text-white shadow-slate-900/25'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Toutes les questions ({faqList.length})</span>
                </button>
              </div>

              {/* Barre de Recherche Épurée & Contrôles Rapides */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 pb-2 border-b border-slate-100 text-xs">
                {/* Champ de recherche direct */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={faqSearchQuery}
                    onChange={(e) => setFaqSearchQuery(e.target.value)}
                    placeholder="Rechercher une question (ex: antivol, vidange, SMS, tarifs...)..."
                    className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                  />
                  {faqSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setFaqSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
                      title="Effacer la recherche"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Toolbar actions & Contrôles rapides */}
                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <span className="text-slate-500 font-semibold text-xs">
                    <strong className="text-slate-900">{faqs.length}</strong> question{faqs.length > 1 ? 's' : ''} affichée{faqs.length > 1 ? 's' : ''}
                  </span>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <button
                    type="button"
                    onClick={handleExpandAllFaqs}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Tout déplier
                  </button>
                  <button
                    type="button"
                    onClick={handleCollapseAllFaqs}
                    className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Tout replier
                  </button>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingSubmitted(false);
                      setIsBookingModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-extrabold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-sky-600" />
                    <span>RDV Expert (15 min)</span>
                  </button>
                </div>
              </div>

              {/* Accordéon FAQ Dynamique */}
              {faqs.length === 0 ? (
                /* État vide si aucun résultat */
                <div className="text-center py-12 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900">
                    Aucune question ne correspond à votre recherche « {faqSearchQuery} »
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Essayez d'autres mots-clés ou réinitialisez la recherche pour parcourir toutes les questions disponibles.
                  </p>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setFaqSearchQuery('');
                        setFaqCategory('ALL');
                      }}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Afficher toutes les questions
                    </button>
                    <button
                      type="button"
                      onClick={() => setAskQuestionOpen(true)}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Poser ma question à un conseiller</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {faqs.map((faq) => {
                    const isOpen = openFaqIds.includes(faq.id);
                    const userVote = faqVotes[faq.id];
                    const isCopied = faqCopiedId === faq.id;

                    return (
                      <div
                        key={faq.id}
                        className={`rounded-2xl border transition-all overflow-hidden ${
                          isOpen
                            ? 'border-sky-300 bg-white shadow-md shadow-sky-900/5 ring-1 ring-sky-200'
                            : 'border-slate-200 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer"
                        >
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  faq.category === 'PARTICULIERS'
                                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                                    : 'bg-sky-100 text-sky-800 border border-sky-200'
                                }`}
                              >
                                {faq.tag}
                              </span>
                              {faq.badge && (
                                <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                  {faq.badge}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-medium">
                                • {faq.category === 'PARTICULIERS' ? 'Particuliers' : 'Entreprises'}
                              </span>
                            </div>
                            <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {faq.q}
                            </div>
                          </div>
                          <div className="shrink-0 mt-0.5">
                            {isOpen ? (
                              <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center transition-transform duration-200">
                                <ChevronUp className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-slate-200/80 text-slate-600 flex items-center justify-center transition-transform duration-200">
                                <ChevronDown className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </button>

                        {isOpen && (
                          <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white space-y-4 animate-in fade-in duration-150">
                            <div className="pt-3.5 leading-relaxed whitespace-pre-line">
                              {faq.a}
                            </div>

                            {/* Barre d'interaction dynamique sous chaque réponse */}
                            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50/50 -mx-4 sm:-mx-5 -mb-5 p-3.5 sm:px-5">
                              {/* Vote d'utilité interactif */}
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-slate-500 font-medium">Cette réponse vous a-t-elle aidé ?</span>
                                {userVote ? (
                                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    <span>Merci pour votre avis !</span>
                                  </span>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleVoteFaq(faq.id, 'UP')}
                                      className="p-1.5 px-2 rounded-md bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                                      title="Oui, très utile"
                                    >
                                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>Oui</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleVoteFaq(faq.id, 'DOWN')}
                                      className="p-1.5 px-2 rounded-md bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                                      title="Non, pas assez clair"
                                    >
                                      <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                                      <span>Non</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Actions rapides : Copier la réponse & Poser une question */}
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleCopyFaq(faq)}
                                  className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1"
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span className="text-emerald-700">Copié ✓</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3 text-slate-500" />
                                      <span>Copier la réponse</span>
                                    </>
                                  )}
                                </button>

                                <a
                                  href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                                    `Bonjour JMF Mobility, j'ai une question concernant : ${faq.q}`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp direct</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Module interactif : « Poser une question personnalisée en direct » (Soft, Light & Cohesive) */}
              <div className="mt-10 p-6 sm:p-7 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-slate-800 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-sky-600" />
                        <span>Support Client & Mobilité JMF Afrique</span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Conseiller en Ligne
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Vous ne trouvez pas la réponse à votre situation ?
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                      Posez directement votre question. Notre équipe technique et nos conseillers vous répondent sous 15 minutes.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setAskQuestionOpen(!askQuestionOpen);
                      setAskQuestionSubmitted(false);
                    }}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{askQuestionOpen ? 'Fermer le formulaire' : 'Poser ma question'}</span>
                  </button>
                </div>

                {askQuestionOpen && (
                  <div className="pt-4 border-t border-slate-200/80 animate-in fade-in duration-200">
                    {askQuestionSubmitted ? (
                      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-emerald-900">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>Votre question a été ajoutée en direct dans la FAQ !</span>
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          Elle apparaît désormais en tête de la liste ci-dessus avec le statut prioritaire pour le profil <strong>{askQuestionCategory === 'PARTICULIERS' ? 'Particulier & Famille' : 'Entreprise & Pro'}</strong>. Notre centrale d'intervention vous recontactera sous 15 minutes.
                        </p>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              const elem = document.getElementById('faq');
                              if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                            <span>Voir ma question dans la FAQ</span>
                          </button>

                          <a
                            href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                              `Bonjour JMF Mobility, je suis ${askQuestionName || 'un client'}. J'ai posé la question suivante en direct : "${askQuestionText}"`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Confirmer par WhatsApp</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => {
                              setAskQuestionText('');
                              setAskQuestionSubmitted(false);
                            }}
                            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                          >
                            Poser une autre question
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleAskQuestionSubmit} className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre profil :</label>
                            <select
                              value={askQuestionCategory}
                              onChange={(e) => setAskQuestionCategory(e.target.value as any)}
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            >
                              <option value="PARTICULIERS">Particulier (1 à 4 véhicules)</option>
                              <option value="PRO">Entreprise / Flotte commerciale</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre nom ou société :</label>
                            <input
                              type="text"
                              value={askQuestionName}
                              onChange={(e) => setAskQuestionName(e.target.value)}
                              placeholder="Ex: M. Mensah ou Société SICA"
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Téléphone / WhatsApp :</label>
                            <input
                              type="tel"
                              value={askQuestionPhone}
                              onChange={(e) => setAskQuestionPhone(e.target.value)}
                              placeholder="+229 / +225 / +221 ..."
                              className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Votre question :</label>
                          <textarea
                            rows={3}
                            value={askQuestionText}
                            onChange={(e) => setAskQuestionText(e.target.value)}
                            placeholder="Décrivez précisément votre interrogation (ex: compatibilité avec véhicule hybride, tarification selon le pays, délai d'activation des alertes SMS, etc.)..."
                            className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                            required
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <span className="text-[11px] text-slate-500">
                            Réponse garantie par nos experts JMF Mobility.
                          </span>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Transmettre ma question</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 11b. Section : Notre Promesse (Soft, Elegant & Airy) */}
          <section className="py-10 sm:py-12 bg-gradient-to-b from-slate-900 via-[#0e172a] to-slate-900 text-white relative overflow-hidden border-t border-slate-800">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-semibold tracking-wider border border-sky-500/20">
                <Zap className="w-3.5 h-3.5 text-sky-400" />
                <span>NOTRE PROMESSE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Vous avez une flotte. Nous avons les solutions.
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-normal">
                Que vous disposiez de 1, 5, 20, 50 ou plusieurs centaines de véhicules, JMF Mobility Services vous accompagne dans l'organisation et l'optimisation de votre mobilité avec rigueur et bienveillance.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleSelectPackage('Audit et diagnostic de flotte')}
                  className="px-5 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Demander un audit de flotte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSelectPackage('Devis Personnalisé')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/15 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* 12. Contact & Quote Request Form - Clean, Soft & Structured */}
          <section id="contact" className="py-12 sm:py-14 bg-slate-900 text-white border-t border-slate-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                {/* Left Column: Reassuring Pillars & Direct Contacts */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-semibold border border-sky-500/20">
                      <Send className="w-3 h-3" />
                      <span>CONTACT & CONSEIL</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Parlons de votre projet</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Nos experts en mobilité et gestion de flotte vous répondent et vous conseillent avec des solutions adaptées à votre quotidien et vos opérations en Afrique.
                    </p>
                  </div>
                  
                  {/* 3 Reassuring Value Pillars (Replacing noisy 8-line checklist) */}
                  <div className="space-y-3.5 pt-1">
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Car className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Accompagnement Sur-Mesure</div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">Dès 1 véhicule pour les particuliers jusqu'aux parcs de plus de 150 unités.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Devis Chiffré sous 2 Heures</div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">Tarification transparente et multi-devises, forfait mensuel ou annuel sans surprise.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Atelier Central & Support Technique</div>
                        <div className="text-[11px] text-slate-300 leading-relaxed">Techniciens certifiés, équipes mobiles et assistance 24/7 pour l'ensemble de vos parcs.</div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Links */}
                  <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">Siège & Hubs Opérationnels :</div>
                        <div className="text-slate-300">🇧🇯 Vodjè lot 1061, Cotonou, Bénin</div>
                        <div className="text-slate-300 mt-0.5">🇸🇳 SICAP N°6760, Liberté 6, Dakar, Sénégal</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">
                          🇧🇯 Numéro Bénin (Appel & WhatsApp) :{' '}
                          <a href="tel:+2290197832121" className="hover:text-sky-300 font-mono">
                            +229 01 97 83 21 21
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Standard Fixe Siège : <span className="font-mono text-slate-300">+229 01 21 24 88 70</span>
                        </div>
                        <a
                          href="https://wa.me/2290197832121"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <MessageSquare className="w-3 h-3" /> Appel & WhatsApp disponible 24/7
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-white">
                          🇸🇳 Numéro Sénégal (Appel & WhatsApp) :{' '}
                          <a href="tel:+221775984392" className="hover:text-sky-300 font-mono">
                            +221 77 598 43 92
                          </a>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Adresse Dakar : <span className="text-slate-300">SICAP N°6760, Liberté 6, Dakar, Sénégal</span>
                        </div>
                        <a
                          href="https://wa.me/221775984392"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <MessageSquare className="w-3 h-3" /> Appel & WhatsApp disponible 24/7
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                      <a href="mailto:contact@jmfmobilityservices.com" className="font-mono text-sky-300 hover:underline">
                        contact@jmfmobilityservices.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column: Quote Form / Storage Emplacements Wizard */}
                <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-100">
                  {quoteSubmitted ? (
                    quoteForm.service === 'Centre de stockage' ? (
                      /* Official Storage Reservation Proforma Quote */
                      <div className="space-y-6">
                        {/* Official Brand Letterhead for Proforma Print */}
                        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
                          <JmfLogo variant="light" className="h-12 sm:h-14" />
                          <div className="text-right text-[10px] text-slate-500 leading-tight">
                            <div className="font-bold text-slate-800">JMF Mobility Services</div>
                            <div>🇧🇯 Vodjè lot 1061, Cotonou, Bénin</div>
                            <div>🇸🇳 SICAP N°6760, Liberté 6, Dakar, Sénégal</div>
                            <div className="font-mono">🇧🇯 +229 01 97 83 21 21 • 🇸🇳 +221 77 598 43 92</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Devis Proforma Émis
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-500">
                                  N° {quoteRefNumber}
                                </span>
                              </div>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                                Réservation d'Emplacement Confirmée
                              </h4>
                            </div>
                          </div>
                          <button
                            onClick={() => window.print()}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimer / PDF</span>
                          </button>
                        </div>

                        {/* Customer & Location Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Bénéficiaire / Client :</span>
                            <span className="font-bold text-slate-900 text-sm">{quoteForm.name}</span>
                            <span className="text-slate-600 block">{quoteForm.company || 'Client Particulier'}</span>
                            <span className="text-slate-500 font-mono text-[11px] block mt-1">{quoteForm.phone} • {quoteForm.email}</span>
                          </div>
                          <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                            <span className="text-slate-400 font-semibold block text-[11px]">Site & Gardiennage :</span>
                            <span className="font-bold text-slate-900">Centre Logistique & Stockage Sécurisé JMF</span>
                            <span className="text-emerald-700 font-semibold text-[11px] block">Surveillance & Caméras HD 24/7</span>
                            <span className="text-slate-500 text-[11px] block mt-1">Accès sécurisé par badge & scan QR</span>
                          </div>
                        </div>

                        {/* Period & Pricing Table */}
                        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                          <div className="bg-slate-900 text-white p-3 font-bold flex items-center justify-between">
                            <span>Détail de la réservation d'emplacement</span>
                            <span className="font-mono text-sky-400">{storageCalculation.days} Jour(s) réservé(s)</span>
                          </div>
                          <div className="divide-y divide-slate-100 bg-white">
                            <div className="p-3 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-900 block">{selectedStorageCat.name}</span>
                                <span className="text-[11px] text-slate-500">
                                  {storageCalculation.spots} emplacement(s) • Surface : {selectedStorageCat.surface}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-slate-900">
                                {formatCurrencyAmount(storageCalculation.baseDailyTotal, activeCurrencyCode)}
                              </span>
                            </div>

                            <div className="p-3 flex items-center justify-between bg-slate-50/50">
                              <div>
                                <span className="font-semibold text-slate-700 block">Dates d'occupation prévues :</span>
                                <span className="text-[11px] text-slate-600 font-mono">
                                  Arrivée : {quoteForm.storageArrivalDate} ({quoteForm.storageArrivalTime}) ➔ Sortie : {quoteForm.storageDepartureDate} ({quoteForm.storageDepartureTime})
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-500 font-medium">
                                {formatCurrencyAmount(selectedStorageCat.dailyRate, activeCurrencyCode)}/j/unité
                              </span>
                            </div>

                            {storageCalculation.extrasTotal > 0 && (
                              <div className="p-3 flex items-center justify-between bg-slate-50/50">
                                <div>
                                  <span className="font-semibold text-slate-700 block">Services & Options d'entretien :</span>
                                  <span className="text-[11px] text-slate-500">
                                    {[
                                      quoteForm.storageWash ? 'Lavage haute pression' : null,
                                      quoteForm.storageBattery ? 'Maintien de batterie' : null,
                                      quoteForm.storageTarp ? 'Bâchage respirant' : null,
                                    ].filter(Boolean).join(' • ')}
                                  </span>
                                </div>
                                <span className="font-mono font-bold text-slate-900">
                                  +{formatCurrencyAmount(storageCalculation.extrasTotal, activeCurrencyCode)}
                                </span>
                              </div>
                            )}

                            <div className="p-4 bg-sky-50 flex items-center justify-between">
                              <div>
                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                  Total Devis Estimatif Proforma
                                </span>
                                <span className="text-[11px] text-sky-700">TTC • Montant exprimé en {getCurrency(activeCurrencyCode).label}</span>
                              </div>
                              <div className="text-xl font-black text-sky-700 font-mono">
                                {formatCurrencyAmount(storageCalculation.totalTtc, activeCurrencyCode)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Overstay Acknowledged Legal Banner */}
                        <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-xs space-y-1.5 text-amber-950">
                          <div className="flex items-center gap-2 font-bold text-amber-900">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Clause de Dépassement Contractuelle Enregistrée</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-amber-900">
                            En accord avec les conditions générales, tout jour supplémentaire de stationnement au-delà du{' '}
                            <strong>{quoteForm.storageDepartureDate} à {quoteForm.storageDepartureTime}</strong> sans prolongation
                            déclarée 24h à l'avance fera l'objet d'une facturation journalière supplémentaire automatique de{' '}
                            <strong className="font-mono font-bold text-amber-950">
                              {formatCurrencyAmount(storageCalculation.overstayCostPerDay, activeCurrencyCode)} / jour entamé
                            </strong>{' '}
                            ({formatCurrencyAmount(selectedStorageCat.overstayRate, activeCurrencyCode)} / jour / emplacement).
                          </p>
                        </div>

                        {/* CTA Actions: WhatsApp & Reset */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                          <a
                            href={getWhatsAppStorageMessage()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center shadow-md text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Transmettre & Confirmer sur WhatsApp</span>
                          </a>
                          <button
                            onClick={() => setQuoteSubmitted(false)}
                            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                          >
                            Modifier / Autre demande
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Standard Quote Confirmation with Full Recap & Ability to Edit/Change Quote */
                      <div className="space-y-5">
                        {/* Official Brand Letterhead for Proforma Print */}
                        <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200/80">
                          <JmfLogo variant="light" className="h-12 sm:h-14" />
                          <div className="text-right text-[10px] text-slate-500 leading-tight">
                            <div className="font-bold text-slate-800">JMF Mobility Services</div>
                            <div>🇧🇯 Vodjè lot 1061, Cotonou, Bénin</div>
                            <div>🇸🇳 SICAP N°6760, Liberté 6, Dakar, Sénégal</div>
                            <div className="font-mono">🇧🇯 +229 01 97 83 21 21 • 🇸🇳 +221 77 598 43 92</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Devis Enregistré
                                </span>
                                <span className="text-xs font-mono font-bold text-slate-500">
                                  Réf. {quoteRefNumber}
                                </span>
                              </div>
                              <h4 className="text-lg font-black text-slate-900 mt-0.5">
                                Demande de Devis Prise en Compte
                              </h4>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => window.print()}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Imprimer / PDF</span>
                          </button>
                        </div>

                        {/* Customer & Quote Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                          <div>
                            <span className="text-slate-400 font-semibold block text-[11px]">Bénéficiaire :</span>
                            <span className="font-bold text-slate-900 text-sm">{quoteForm.name}</span>
                            <span className="text-slate-600 block">{quoteForm.company || 'Entreprise / Particulier'}</span>
                            <span className="text-slate-500 font-mono text-[11px] block mt-1">{quoteForm.phone} • {quoteForm.email}</span>
                          </div>
                          <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                            <span className="text-slate-400 font-semibold block text-[11px]">Formule & Prestation :</span>
                            <span className="font-bold text-slate-900">{quoteForm.service}</span>
                            <span className="text-sky-700 font-semibold text-[11px] block">
                              Flotte : {quoteForm.fleetSize} véhicules
                            </span>
                            <span className="text-slate-500 text-[11px] block mt-1">
                              Devise : <strong>{getCurrency(activeCurrencyCode).label} ({getCurrency(activeCurrencyCode).symbol})</strong>
                            </span>
                          </div>
                        </div>

                        {quoteForm.notes && (
                          <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100 text-xs text-slate-700">
                            <span className="font-bold text-sky-900">Notes / Besoins spécifiques : </span>
                            {quoteForm.notes}
                          </div>
                        )}

                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold">Transmission immédiate à nos conseillers</div>
                            <div className="text-[11px] text-emerald-800">
                              Votre estimation tarifaire a été initialisée en {getCurrency(activeCurrencyCode).label}. Un expert vous recontacte sous 2 heures avec la proposition contractuelle détaillée.
                            </div>
                          </div>
                        </div>

                        {/* Actions: Edit quote and WhatsApp (Bénin & Sénégal) */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 pt-2">
                          <a
                            href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                              `Bonjour JMF Mobility, voici ma demande de devis (Réf: ${quoteRefNumber}) :\n- Client : ${quoteForm.name} (${quoteForm.company || 'Direct'})\n- Prestation : ${quoteForm.service}\n- Flotte : ${quoteForm.fleetSize} véhicules\n- Devise : ${getCurrency(activeCurrencyCode).label}\n${quoteForm.notes ? `- Notes : ${quoteForm.notes}` : ''}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center shadow-md text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp Bénin (🇧🇯 +229)</span>
                          </a>
                          <a
                            href={`https://wa.me/221775984392?text=${encodeURIComponent(
                              `Bonjour JMF Mobility Sénégal, voici ma demande de devis (Réf: ${quoteRefNumber}) :\n- Client : ${quoteForm.name} (${quoteForm.company || 'Direct'})\n- Prestation : ${quoteForm.service}\n- Flotte : ${quoteForm.fleetSize} véhicules\n- Devise : ${getCurrency(activeCurrencyCode).label}\n${quoteForm.notes ? `- Notes : ${quoteForm.notes}` : ''}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-center shadow-md text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>WhatsApp Sénégal (🇸🇳 +221)</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => setQuoteSubmitted(false)}
                            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition-colors cursor-pointer border border-slate-200"
                          >
                            ✏️ Modifier
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
                      {/* Interactive Step Indicator */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-sky-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                            1
                          </span>
                          <span className="text-[11px] font-bold text-slate-800">
                            Prestation & Flotte
                          </span>
                        </div>
                        <span className="text-slate-300">➔</span>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                            2
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            Coordonnées & Préférences
                          </span>
                        </div>
                        <span className="text-slate-300">➔</span>
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-[11px] flex items-center justify-center shrink-0">
                            3
                          </span>
                          <span className="text-[11px] font-semibold text-slate-600">
                            Devis & WhatsApp
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-sky-600 shrink-0" />
                            <h4 className="text-base font-bold text-slate-900">
                              {quoteForm.service === 'Centre de stockage'
                                ? "Demande de Devis & Réservation d'Emplacements"
                                : 'Demande de Devis Personnalisé Express'}
                            </h4>
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            {quoteForm.service === 'Centre de stockage'
                              ? "Calcul instantané de la période, devis proforma multi-devises et clause contractuelle de dépassement journalier."
                              : 'Gratuit, sans engagement et calculé en temps réel dans votre devise.'}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setBookingSubmitted(false);
                            setIsBookingModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[11px] font-bold flex items-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5 text-sky-600" />
                          <span>Prendre RDV (15 min)</span>
                        </button>
                      </div>

                      {/* Multi-Currency & Regional Selector */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sky-50/70 p-3 rounded-xl border border-sky-100/90 text-xs">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                            <Globe2 className="w-3.5 h-3.5 text-sky-600" />
                            <span>Devise souhaitée pour le devis :</span>
                          </label>
                          <div className="relative">
                            <select
                              value={activeCurrencyCode}
                              onChange={(e) => handleCurrencyChange(e.target.value)}
                              className="w-full bg-white border border-sky-200 rounded-lg px-2.5 py-1.5 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs cursor-pointer appearance-none"
                            >
                              {SUPPORTED_CURRENCIES.map((cur) => (
                                <option key={cur.code} value={cur.code}>
                                  {cur.flag} {cur.code} — {cur.label} ({cur.symbol})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-sky-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-end">
                          <span className="text-[10px] text-slate-500 font-medium mb-1">
                            Zone d'application & Tarification :
                          </span>
                          <div className="text-xs font-bold text-sky-950 bg-white/90 py-1.5 px-2.5 rounded-lg border border-sky-100 flex items-center justify-between">
                            <span>🌍 {getCurrency(activeCurrencyCode).countryOrRegion}</span>
                            <span className="text-[10px] text-emerald-600 font-mono font-semibold">Taux actif</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Identity Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Votre Nom & Prénom *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Jean KOUASSI"
                            value={quoteForm.name}
                            onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Entreprise ou Nom personnel *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ex: Entreprise SARL, Groupe ou Particulier"
                            value={quoteForm.company}
                            onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          />
                        </div>
                      </div>

                      {/* Phone & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Téléphone / WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+229 / +225 / +221 / +33 ..."
                            value={quoteForm.phone}
                            onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1">Email *</label>
                          <input
                            type="email"
                            required
                            placeholder="contact@societe.com"
                            value={quoteForm.email}
                            onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                            className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          />
                        </div>
                      </div>

                      {/* Service Selection with prominent selector icon & formula chips */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-slate-700 font-semibold flex items-center gap-1.5">
                            <span className="p-1 rounded-md bg-sky-100 text-sky-700">
                              <FileText className="w-3.5 h-3.5" />
                            </span>
                            <span>Formule de Devis / Prestation recherchée *</span>
                          </label>
                          <span className="text-[10px] text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                            Sélection active : {quoteForm.service}
                          </span>
                        </div>

                        {/* Quick category shortcut chips */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {[
                            { label: '🏢 Packs Flotte', value: 'PACK ESSENTIEL' },
                            { label: '🅿️ Centre de Stockage', value: 'Centre de stockage' },
                            { label: '🔧 Flotte & Maintenance', value: 'Flotte complète & Maintenance' },
                            { label: '📡 Télématique & GPS', value: 'Télématique & GPS seul' },
                            { label: '👤 Particulier', value: 'Gestion Flotte Particulier' },
                          ].map((chip) => (
                            <button
                              key={chip.value}
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, service: chip.value })}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                quoteForm.service === chip.value || (chip.value === 'PACK ESSENTIEL' && quoteForm.service.startsWith('PACK'))
                                  ? 'bg-sky-600 text-white shadow-xs'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                              }`}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-sky-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <select
                            value={quoteForm.service}
                            onChange={(e) => setQuoteForm({ ...quoteForm, service: e.target.value })}
                            className="w-full pl-9.5 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 appearance-none cursor-pointer"
                          >
                            <optgroup label="Packs de Gestion Globale (Abonnement Mensuel)">
                              <option value="PACK ESSENTIEL">
                                PACK ESSENTIEL (1 à 10 véh. • {formatCurrencyAmount(fleetPackages.find((p) => p.id === 'essentiel')?.monthlyPriceNumeric || 75000, activeCurrencyCode)}/mois)
                              </option>
                              <option value="PACK BUSINESS">
                                PACK BUSINESS (11 à 25 véh. • {formatCurrencyAmount(fleetPackages.find((p) => p.id === 'business')?.monthlyPriceNumeric || 150000, activeCurrencyCode)}/mois)
                              </option>
                              <option value="PACK PRO">
                                PACK PRO (26 à 50 véh. • {formatCurrencyAmount(fleetPackages.find((p) => p.id === 'pro')?.monthlyPriceNumeric || 300000, activeCurrencyCode)}/mois)
                              </option>
                              <option value="PACK ENTREPRISE">
                                PACK ENTREPRISE (51 à 100 véh. • {formatCurrencyAmount(fleetPackages.find((p) => p.id === 'entreprise')?.monthlyPriceNumeric || 550000, activeCurrencyCode)}/mois)
                              </option>
                              <option value="PACK CORPORATE">
                                PACK CORPORATE (+ de 100 véh. • Dès {formatCurrencyAmount(fleetPackages.find((p) => p.id === 'corporate')?.monthlyPriceNumeric || 900000, activeCurrencyCode)}/mois)
                              </option>
                            </optgroup>
                            <optgroup label="Grille Tarifaire Pro Bénin (Utilitaires • Poids Lourds • Engins)">
                              <option value="Utilitaires - Pack STARTER (1 à 5 véh. • 40 000 FCFA/mois)">
                                Utilitaires — Pack STARTER (1 à 5 véh. • 40 000 FCFA/mois)
                              </option>
                              <option value="Utilitaires - Pack BUSINESS (6 à 15 véh. • 100 000 FCFA/mois)">
                                Utilitaires — Pack BUSINESS (6 à 15 véh. • 100 000 FCFA/mois)
                              </option>
                              <option value="Utilitaires - Pack PREMIUM (16 à 30 véh. • 200 000 FCFA/mois)">
                                Utilitaires — Pack PREMIUM (16 à 30 véh. • 200 000 FCFA/mois)
                              </option>
                              <option value="Poids Lourds - Pack STARTER (1 à 3 camions • 75 000 FCFA/mois)">
                                Poids Lourds — Pack STARTER (1 à 3 camions • 75 000 FCFA/mois)
                              </option>
                              <option value="Poids Lourds - Pack BUSINESS (4 à 10 camions • 150 000 FCFA/mois)">
                                Poids Lourds — Pack BUSINESS (4 à 10 camions • 150 000 FCFA/mois)
                              </option>
                              <option value="Poids Lourds - Pack PREMIUM (11 à 20 camions • 300 000 FCFA/mois)">
                                Poids Lourds — Pack PREMIUM (11 à 20 camions • 300 000 FCFA/mois)
                              </option>
                              <option value="Engins de Chantier - Pack STARTER (1 à 2 engins • 100 000 FCFA/mois)">
                                Engins de Chantier — Pack STARTER (1 à 2 engins • 100 000 FCFA/mois)
                              </option>
                              <option value="Engins de Chantier - Pack BUSINESS (3 à 5 engins • 200 000 FCFA/mois)">
                                Engins de Chantier — Pack BUSINESS (3 à 5 engins • 200 000 FCFA/mois)
                              </option>
                              <option value="Engins de Chantier - Pack PREMIUM (6 à 10 engins • 350 000 FCFA/mois)">
                                Engins de Chantier — Pack PREMIUM (6 à 10 engins • 350 000 FCFA/mois)
                              </option>
                              <option value="Flotte Mixte Bénin (Utilitaires + Poids lourds + Engins)">
                                Flotte Mixte Bénin (Utilitaires + Poids lourds + Engins)
                              </option>
                            </optgroup>
                            <optgroup label="Autres Services & Modules Spécialisés">
                              <option value="Centre de stockage">Centre de stockage sécurisé (Gardiennage & Emplacements)</option>
                              <option value="Flotte complète & Maintenance">Flotte complète & Maintenance</option>
                              <option value="Gestion Flotte Particulier">Gestion Flotte Particulier (Télématique & Entretien)</option>
                              <option value="Télématique & GPS seul">Télématique & GPS seul</option>
                              <option value="Délégation complète Outsourcing">Délégation totale (Full Outsourcing)</option>
                              <option value="Formation & Conduite">Formation & Perfectionnement</option>
                              <option value="Audit & Conseil Flotte">Audit & Conseil Flotte</option>
                              {quoteForm.service &&
                                ![
                                  'PACK ESSENTIEL',
                                  'PACK BUSINESS',
                                  'PACK PRO',
                                  'PACK ENTREPRISE',
                                  'PACK CORPORATE',
                                  'Centre de stockage',
                                  'Flotte complète & Maintenance',
                                  'Gestion Flotte Particulier',
                                  'Télématique & GPS seul',
                                  'Délégation complète Outsourcing',
                                  'Formation & Conduite',
                                  'Audit & Conseil Flotte',
                                ].includes(quoteForm.service) && (
                                  <option value={quoteForm.service}>{quoteForm.service}</option>
                                )}
                            </optgroup>
                          </select>
                          <ChevronDown className="w-4 h-4 text-sky-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>

                        {/* Dynamic Package Pre-qualification & Deposit Box */}
                        {quoteForm.service !== 'Centre de stockage' && packageEstimate && (
                          <div className="mt-2.5 p-3.5 rounded-xl bg-gradient-to-r from-sky-50 to-indigo-50/60 border border-sky-200/90 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                                <span className="font-bold text-slate-900 text-xs">
                                  Pré-qualification : {packageEstimate.packName}
                                </span>
                              </div>
                              <span className="font-mono font-black text-sky-800 text-sm">
                                {formatCurrencyAmount(packageEstimate.monthlyBaseFcfa, activeCurrencyCode)} / mois
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-sky-200/60 text-[11px]">
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span>
                                  Acompte indicatif :{' '}
                                  <strong className="font-mono text-emerald-800">
                                    {formatCurrencyAmount(packageEstimate.deposit30, activeCurrencyCode)}
                                  </strong>{' '}
                                  (30%)
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-700">
                                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>Installation traceur 4G + Paramétrage inclus</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* DEDICATED STORAGE & PARKING SPOTS MODULE */}
                      {quoteForm.service === 'Centre de stockage' ? (
                        <div className="space-y-4 pt-1">
                          {/* Vehicle Type & Spots Count */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-slate-700 font-semibold mb-1">
                                Gabarit d'engin / Type d'emplacement *
                              </label>
                              <div className="relative">
                                <select
                                  value={quoteForm.storageCategory}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, storageCategory: e.target.value })}
                                  className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-xs appearance-none cursor-pointer"
                                >
                                  {STORAGE_CATEGORIES.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                      {cat.name} — {formatCurrencyAmount(cat.dailyRate, activeCurrencyCode)} / jour
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                              <p className="text-[11px] text-slate-500 mt-1">
                                {selectedStorageCat.description} ({selectedStorageCat.surface})
                              </p>
                            </div>
                            <div>
                              <label className="block text-slate-700 font-semibold mb-1">
                                Nb. d'emplacements *
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={50}
                                required
                                value={quoteForm.storageSpots}
                                onChange={(e) => setQuoteForm({ ...quoteForm, storageSpots: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                              />
                            </div>
                          </div>

                          {/* Arrival and Departure Dates with Time Pickers */}
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-sky-600" />
                                <span className="font-bold text-slate-800 text-xs">Période de stationnement demandée</span>
                              </div>
                              <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-full">
                                {storageDays} jour{storageDays > 1 ? 's' : ''} calculé{storageDays > 1 ? 's' : ''}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {/* Arrival */}
                              <div>
                                <label className="block text-slate-600 font-semibold text-[11px] mb-1">
                                  Date & Heure d'Arrivée (Check-in) *
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <input
                                    type="date"
                                    required
                                    value={quoteForm.storageArrivalDate}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, storageArrivalDate: e.target.value })}
                                    className="col-span-2 p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                  />
                                  <input
                                    type="time"
                                    required
                                    value={quoteForm.storageArrivalTime}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, storageArrivalTime: e.target.value })}
                                    className="col-span-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                  />
                                </div>
                              </div>

                              {/* Departure */}
                              <div>
                                <label className="block text-slate-600 font-semibold text-[11px] mb-1">
                                  Date & Heure de Sortie (Check-out) *
                                </label>
                                <div className="grid grid-cols-3 gap-1.5">
                                  <input
                                    type="date"
                                    required
                                    min={quoteForm.storageArrivalDate}
                                    value={quoteForm.storageDepartureDate}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, storageDepartureDate: e.target.value })}
                                    className="col-span-2 p-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                  />
                                  <input
                                    type="time"
                                    required
                                    value={quoteForm.storageDepartureTime}
                                    onChange={(e) => setQuoteForm({ ...quoteForm, storageDepartureTime: e.target.value })}
                                    className="col-span-1 p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-center focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Additional Storage Services Options */}
                          <div className="space-y-1.5">
                            <span className="block text-slate-700 font-semibold text-[11px]">Options & Soins Véhicule :</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={quoteForm.storageWash}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, storageWash: e.target.checked })}
                                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                                />
                                <span className="text-[11px] text-slate-700">
                                  Lavage complet (+{formatCurrencyAmount(3500, activeCurrencyCode)})
                                </span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={quoteForm.storageBattery}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, storageBattery: e.target.checked })}
                                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                                />
                                <span className="text-[11px] text-slate-700">
                                  Maintien batterie (+{formatCurrencyAmount(1500, activeCurrencyCode)}/sem)
                                </span>
                              </label>

                              <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 bg-white cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={quoteForm.storageTarp}
                                  onChange={(e) => setQuoteForm({ ...quoteForm, storageTarp: e.target.checked })}
                                  className="w-4 h-4 text-sky-600 rounded border-slate-300"
                                />
                                <span className="text-[11px] text-slate-700">
                                  Bâche respirante (+{formatCurrencyAmount(2500, activeCurrencyCode)})
                                </span>
                              </label>
                            </div>
                          </div>

                          {/* Live Dynamic Proforma Cost Summary */}
                          <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/90 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-sky-900">
                                Synthèse Devis Emplacement ({storageDays} j × {storageCalculation.spots} unité{storageCalculation.spots > 1 ? 's' : ''})
                              </div>
                              <div className="text-[10px] text-sky-700">
                                Tarif standard : {formatCurrencyAmount(selectedStorageCat.dailyRate, activeCurrencyCode)} / jour / emplacement
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Estimé TTC</span>
                              <span className="text-lg font-black font-mono text-sky-700">
                                {formatCurrencyAmount(storageCalculation.totalTtc, activeCurrencyCode)}
                              </span>
                            </div>
                          </div>

                          {/* CONTRACTUAL OVERSTAY POLICY & DAILY PENALTY CLAUSE */}
                          <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-300 space-y-2.5">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                <span className="font-bold text-amber-950 text-xs block">
                                  Politique Contractuelle de Dépassement de Délai (Overstay Policy)
                                </span>
                                <p className="text-[11px] text-amber-900 leading-relaxed">
                                  Tout maintien d'un véhicule au-delà de la date et heure de sortie stipulées au devis ({quoteForm.storageDepartureDate} à {quoteForm.storageDepartureTime}) sans prolongation déclarée au moins 24h à l'avance entraînera une{' '}
                                  <strong>
                                    facturation journalière supplémentaire automatique de{' '}
                                    <span className="font-mono font-bold text-amber-950">
                                      {formatCurrencyAmount(storageCalculation.overstayCostPerDay, activeCurrencyCode)} / jour entamé
                                    </span>
                                  </strong>{' '}
                                  ({formatCurrencyAmount(selectedStorageCat.overstayRate, activeCurrencyCode)} / jour / emplacement) ajoutée à la facture de clôture.
                                </p>
                              </div>
                            </div>

                            <label className="flex items-start gap-2.5 pt-1 border-t border-amber-200/80 cursor-pointer">
                              <input
                                type="checkbox"
                                required
                                checked={quoteForm.storageOverstayAcknowledged}
                                onChange={(e) => setQuoteForm({ ...quoteForm, storageOverstayAcknowledged: e.target.checked })}
                                className="w-4 h-4 mt-0.5 text-amber-600 rounded border-amber-400 focus:ring-amber-500"
                              />
                              <span className="text-[11px] font-semibold text-amber-950 leading-snug">
                                J'accepte expressément les conditions générales de gardiennage et la facturation journalière supplémentaire automatique en cas de dépassement de la date de départ convenue. *
                              </span>
                            </label>
                          </div>
                        </div>
                      ) : (
                        /* Standard Fleet Size Selection for other services */
                        <div>
                          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-sky-600" />
                            <span>Taille du parc / Volume de véhicules :</span>
                          </label>
                          <div className="relative">
                            <select
                              value={quoteForm.fleetSize}
                              onChange={(e) => setQuoteForm({ ...quoteForm, fleetSize: e.target.value })}
                              className="w-full p-2.5 pr-10 border border-slate-200 rounded-xl bg-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 appearance-none cursor-pointer"
                            >
                              <option value="1-4">1 à 4 véhicules (Particulier / Flotte privée)</option>
                              <option value="5-15">5 à 15 véhicules (PME / Flotte légère)</option>
                              <option value="15-30">15 à 30 véhicules</option>
                              <option value="30-75">30 à 75 véhicules</option>
                              <option value="75+">Plus de 75 véhicules</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">
                          Précisions éventuelles ou instructions particulières
                        </label>
                        <textarea
                          rows={2}
                          placeholder={
                            quoteForm.service === 'Centre de stockage'
                              ? "Ex: Immatriculations des véhicules, transit portuaire, besoin de déchargement..."
                              : "Indiquez vos besoins particuliers, types de véhicules..."
                          }
                          value={quoteForm.notes}
                          onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                          className="w-full p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                      </div>

                      {/* Preferred Contact Mode & Onboarding */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                        <div>
                          <label className="block text-slate-700 font-semibold text-[11px] mb-1">
                            Canal de retour sous 2h :
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, preferredContact: 'whatsapp' })}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                quoteForm.preferredContact === 'whatsapp'
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[10px]">WhatsApp</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, preferredContact: 'phone' })}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                quoteForm.preferredContact === 'phone'
                                  ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-500/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <Phone className="w-3.5 h-3.5 text-sky-600" />
                              <span className="text-[10px]">Appel Direct</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, preferredContact: 'email' })}
                              className={`p-2 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                                quoteForm.preferredContact === 'email'
                                  ? 'bg-slate-900 border-slate-900 text-white font-bold'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span className="text-[10px]">Email PDF</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-semibold text-[11px] mb-1">
                            Formule de règlement envisagée :
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, paymentPreference: 'monthly' })}
                              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                quoteForm.paymentPreference === 'monthly'
                                  ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-500/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="text-[10px] font-bold">Mensuel Standard</div>
                              <div className="text-[9px] text-slate-500">Sans engagement</div>
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuoteForm({ ...quoteForm, paymentPreference: 'deposit30' })}
                              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                quoteForm.paymentPreference === 'deposit30'
                                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="text-[10px] font-bold">Acompte 30%</div>
                              <div className="text-[9px] text-slate-500">Solde à livraison</div>
                            </button>
                          </div>
                        </div>
                      </div>

                      {quoteValidationWarning && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                          <span>{quoteValidationWarning}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-xs transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {quoteForm.service === 'Centre de stockage'
                            ? "Générer mon devis d'emplacement proforma"
                            : "Recevoir mon devis gratuit sous 2h"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 12b. Signature Finale Épurée (Soft Brand Closing) */}
          <section className="py-10 bg-slate-950 text-white border-t border-slate-800 text-center">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-3">
              <div className="text-[11px] font-bold tracking-widest uppercase text-sky-400">
                JMF MOBILITY SERVICES
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Votre mobilité. Notre expertise.
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-300">
                <span className="flex items-center gap-1 text-sky-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" /> Performance
                </span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1 text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Durabilité
                </span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1 text-indigo-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Sécurité
                </span>
                <span className="text-slate-700">·</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Sérénité
                </span>
              </div>
              <p className="text-xs text-sky-200/80 italic pt-1">
                « Ensemble, allons plus loin. »
              </p>
            </div>
          </section>
        </>
      )}

      {/* 13. Interactive Official Brochure Modal (9 Slides) */}
      {isBrochureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header with View Mode Switcher */}
            <div className="p-4 sm:px-6 sm:py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Plaquette & Supports Officiels — JMF Mobility Services
                  </h3>
                  <p className="text-xs text-slate-500">
                    {brochureViewMode === 'slides'
                      ? `Diapositive ${activeBrochureSlide} sur ${brochureSlides.length} : ${brochureSlides[activeBrochureSlide - 1].title}`
                      : 'Visuels officiels haute résolution • Siège : Vodjè lot 1061, Cotonou, Bénin'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                {/* View Mode Toggle */}
                <div className="flex items-center p-0.5 bg-slate-200/80 rounded-xl text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setBrochureViewMode('slides')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      brochureViewMode === 'slides'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    📑 Diapositives (9)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrochureViewMode('visuals')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      brochureViewMode === 'visuals'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    🖼️ Affiches & Visuels (Vodjè)
                  </button>
                </div>

                <button
                  onClick={() => setIsBrochureModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                  aria-label="Fermer la plaquette"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {brochureViewMode === 'visuals' ? (
              /* Dedicated Visuals Tab (Affiche & Visuel Siège with Vodjè lot 1061) */
              <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-950 text-white">
                <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <h4 className="text-sm font-black text-white">
                        Supports Visuels Officiels — Siège JMF Mobility Services
                      </h4>
                    </div>
                    <p className="text-xs text-sky-300 mt-1">
                      Adresses officielles : <strong>🇧🇯 Vodjè lot 1061, Cotonou, Bénin</strong> • <strong>🇸🇳 SICAP N°6760, Liberté 6, Dakar, Sénégal</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedVisualPreview('affiche')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedVisualPreview === 'affiche'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      📜 Affiche / Plaquette Flyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedVisualPreview('visuel')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedVisualPreview === 'visuel'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      🏛️ Fiche & Bannière Siège
                    </button>
                  </div>
                </div>

                {/* Display Current Selected Visual */}
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="w-full max-w-2xl bg-slate-900/90 rounded-2xl border border-slate-800 p-3 shadow-2xl flex items-center justify-center overflow-hidden">
                    <img
                      src={
                        selectedVisualPreview === 'affiche'
                          ? '/assets/jmf-affiche-vodje.svg'
                          : '/assets/jmf-visuel-siege-vodje.svg'
                      }
                      alt={
                        selectedVisualPreview === 'affiche'
                          ? 'Affiche officielle JMF Mobility Services - Siège Vodjè lot 1061 Cotonou Bénin'
                          : 'Carte d’identité du siège social JMF Mobility Services - Vodjè lot 1061 Cotonou Bénin'
                      }
                      className="w-full max-h-[600px] object-contain rounded-xl"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={
                        selectedVisualPreview === 'affiche'
                          ? '/assets/jmf-affiche-vodje.svg'
                          : '/assets/jmf-visuel-siege-vodje.svg'
                      }
                      download={
                        selectedVisualPreview === 'affiche'
                          ? 'jmf-affiche-officielle-vodje.svg'
                          : 'jmf-visuel-siege-vodje.svg'
                      }
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2"
                    >
                      <span>Télécharger le support vectoriel (SVG)</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={
                        selectedVisualPreview === 'affiche'
                          ? '/assets/jmf-affiche-vodje.svg'
                          : '/assets/jmf-visuel-siege-vodje.svg'
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
                    >
                      <span>Ouvrir en taille réelle</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              /* Standard Slides Mode */
              <>
                {/* Slide Navigation Strip */}
                <div className="bg-slate-100/80 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
                  {brochureSlides.map((slide) => (
                    <button
                      key={slide.id}
                      onClick={() => setActiveBrochureSlide(slide.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                        activeBrochureSlide === slide.id
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Slide {slide.id}
                    </button>
                  ))}
                </div>

                {/* Modal Body */}
                <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-900">
                      {brochureSlides[activeBrochureSlide - 1].title}
                    </h4>
                    <p className="text-xs text-sky-700 font-semibold mt-0.5">
                      {brochureSlides[activeBrochureSlide - 1].subtitle}
                    </p>
                  </div>

                  <div>{brochureSlides[activeBrochureSlide - 1].content}</div>
                </div>

                {/* Modal Footer Controls */}
                <div className="p-4 sm:p-6 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                  <button
                    disabled={activeBrochureSlide === 1}
                    onClick={() => setActiveBrochureSlide((prev) => Math.max(1, prev - 1))}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Précédent</span>
                  </button>

                  <div className="text-xs font-mono font-bold text-slate-500">
                    {activeBrochureSlide} / {brochureSlides.length}
                  </div>

                  {activeBrochureSlide < brochureSlides.length ? (
                    <button
                      onClick={() => setActiveBrochureSlide((prev) => Math.min(brochureSlides.length, prev + 1))}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Suivant</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsBrochureModalOpen(false);
                        onGoToApp('register');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Créer un compte</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* 14. Footer Réorganisé & Ergonomique */}
      <PublicFooter
        onGoToApp={onGoToApp}
        setActivePublicPage={setActivePublicPage}
        onGoToRental={onGoToRental}
        setIsBrochureModalOpen={setIsBrochureModalOpen}
        setIsLocationMapModalOpen={setIsLocationMapModalOpen}
        setIsAppDownloadModalOpen={setIsAppDownloadModalOpen}
        setFaqCategory={setFaqCategory}
        setOpenFaqIds={setOpenFaqIds}
      />

      {/* Global Search Modal for Public Website */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-slate-900">Recherche Rapide Multi-Entités JMF</h3>
              </div>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Fermer la recherche"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <GlobalSearchBar
              onNavigateView={() => {
                setIsSearchModalOpen(false);
                onGoToApp('login');
              }}
              onSelectVehicle={() => {
                setIsSearchModalOpen(false);
                onGoToApp('login');
              }}
              placeholder="Rechercher par plaque, nom de chauffeur, document..."
            />

            <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-between">
              <span>Connectez-vous pour accéder directement à la gestion complète.</span>
              <button
                onClick={() => {
                  setIsSearchModalOpen(false);
                  onGoToApp('login');
                }}
                className="text-sky-600 font-bold hover:underline"
              >
                Accéder à l'application →
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Interactive Mobile App Download & QR Code Modal */}
      <AppDownloadModal
        isOpen={isAppDownloadModalOpen}
        onClose={() => setIsAppDownloadModalOpen(false)}
        defaultPart={appModalTarget}
      />

      {/* Interactive Location Map Pop-up Modal */}
      {isLocationMapModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsLocationMapModalOpen(false)}
        >
          <div
            className="bg-slate-900 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-slate-700/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      Localisation du Siège Social — JMF Mobility Services
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                      Siège Officiel
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Hub Opérationnel • Accessible 24/7 pour vos besoins de mobilité
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLocationMapModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Fermer la carte"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: InteractiveLocationsMap */}
            <div className="p-2 sm:p-4 overflow-y-auto flex-1 bg-slate-950/60">
              <InteractiveLocationsMap />
            </div>
          </div>
        </div>
      )}
      {/* Interactive 15-Minute Diagnostic & Appointment Modal */}
      {isBookingModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                    Rendez-vous Diagnostic Express (15 min)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Gratuit et sans engagement • Conseiller dédié JMF Mobility
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {bookingSubmitted ? (
                <div className="space-y-4 text-center py-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      Réf. Rendez-vous : {bookingRef}
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      Votre demande de rendez-vous est confirmée !
                    </h4>
                    <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                      Notre conseiller technique vous contactera au créneau sélectionné (
                      <strong className="text-slate-900">{bookingForm.slot}</strong>) via{' '}
                      <strong className="text-sky-700">
                        {bookingForm.channel === 'whatsapp'
                          ? 'WhatsApp'
                          : bookingForm.channel === 'phone'
                          ? 'Appel Téléphonique'
                          : bookingForm.channel === 'meet'
                          ? 'Google Meet'
                          : 'Rendez-vous au Siège'}
                      </strong>
                      .
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-1 text-[11px] max-w-md mx-auto">
                    <div>
                      <span className="text-slate-500">Contact : </span>
                      <strong className="text-slate-800">{bookingForm.name} ({bookingForm.phone})</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Sujet abordé : </span>
                      <strong className="text-slate-800">{bookingForm.topic}</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={getWhatsAppBookingUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Synchroniser & Confirmer sur WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsBookingModalOpen(false)}
                      className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Step 1: Channel selection */}
                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                      1. Canal de communication souhaité :
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, sub: 'Direct 24/7' },
                        { id: 'phone', label: 'Téléphone', icon: Phone, sub: 'Appel vocal' },
                        { id: 'meet', label: 'Google Meet', icon: Globe2, sub: 'Visio screen' },
                        { id: 'office', label: 'Au Siège', icon: Building2, sub: 'Vodjè Cotonou' },
                      ].map((c) => {
                        const Icon = c.icon;
                        const isSelected = bookingForm.channel === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setBookingForm({ ...bookingForm, channel: c.id as any })}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-sky-50 border-sky-500 text-sky-950 font-bold ring-2 ring-sky-500/20'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-sky-600' : 'text-slate-500'}`} />
                            <div className="text-[11px] leading-tight">{c.label}</div>
                            <div className="text-[9px] text-slate-400">{c.sub}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Subject & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Sujet de votre échange :
                      </label>
                      <select
                        value={bookingForm.topic}
                        onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                      >
                        <option value="Optimisation & Gestion de Flotte">Optimisation & Gestion de Flotte (Packs)</option>
                        <option value="Audit & Réduction TCO">Audit & Réduction TCO (-28% ciblés)</option>
                        <option value="Télématique 4G, Capteurs Carburant & GPS">Télématique 4G, Capteurs Carburant & GPS</option>
                        <option value="Convoyage Automobile Inter-États">Convoyage Automobile Inter-États</option>
                        <option value="Réservation Centre de Stockage">Réservation Centre de Stockage (Gardiennage)</option>
                        <option value="Pièces Détachées OEM & Ateliers">Pièces Détachées OEM & Ateliers</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Créneau horaire préféré :
                      </label>
                      <select
                        value={bookingForm.slot}
                        onChange={(e) => setBookingForm({ ...bookingForm, slot: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-white font-medium focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                      >
                        <option value="Aujourd'hui à 15h00">Aujourd'hui à 15h00</option>
                        <option value="Aujourd'hui à 17h00">Aujourd'hui à 17h00</option>
                        <option value="Demain matin (10h - 12h)">Demain matin (10h - 12h)</option>
                        <option value="Demain après-midi (15h - 17h)">Demain après-midi (15h - 17h)</option>
                        <option value="Sous 48h ouvrées">Sous 48h ouvrées (Au choix)</option>
                      </select>
                    </div>
                  </div>

                  {/* Step 3: Identity & Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Votre Nom & Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Paul MENSAH"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Téléphone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+229 / +225 / +33 ..."
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Email (Optionnel, pour invitation agenda)
                    </label>
                    <input
                      type="email"
                      placeholder="nom@entreprise.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Valider mon créneau de 15 minutes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Suivi Public de Dossier / Devis en Temps Réel */}
      <PublicDossierTrackerModal
        isOpen={isDossierTrackerOpen}
        onClose={() => setIsDossierTrackerOpen(false)}
        initialRef={dossierTrackerInitialRef || quoteRefNumber}
        onOpenQuoteSection={() => navigateToSection('contact')}
      />

      {/* Bouton Flottant Multi-Hub Bénin 🇧🇯 & Sénégal 🇸🇳 */}
      <FloatingMultiHubConcierge
        onOpenTracker={() => {
          setDossierTrackerInitialRef(quoteRefNumber || '');
          setIsDossierTrackerOpen(true);
        }}
        onOpenQuote={() => navigateToSection('contact')}
      />
    </div>
  );
};
