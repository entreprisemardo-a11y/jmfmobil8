import React, { useState } from 'react';
import {
  Globe2,
  ShieldCheck,
  Clock,
  Lock,
  ArrowRight,
  MapPin,
  ExternalLink,
  Smartphone,
  MessageSquare,
  Share2,
  CheckCircle2,
  Radio,
  Phone,
  Mail,
  Download,
  Headphones,
  Check,
  Calendar,
  AlertCircle,
  Sparkles,
  Navigation,
  Compass,
  ChevronRight,
  ShieldAlert,
  Car,
  Layers,
  Wrench,
  KeyRound,
  Truck,
} from 'lucide-react';
import { JmfLogo } from '../common/JmfLogo.js';
import { QRCodeDisplay, getApkDownloadUrl } from '../common/QRCodeDisplay.js';

interface PublicFooterProps {
  onGoToApp: (tab?: 'login' | 'register') => void;
  setActivePublicPage: (page: 'home' | 'convoyage' | 'pieces-auto') => void;
  onGoToRental?: (isPro?: boolean) => void;
  setIsBrochureModalOpen: (open: boolean) => void;
  setIsLocationMapModalOpen: (open: boolean) => void;
  setIsAppDownloadModalOpen: (open: boolean) => void;
  setFaqCategory: (category: 'PARTICULIERS' | 'PRO' | 'ALL') => void;
  setOpenFaqIds: (ids: string[]) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({
  onGoToApp,
  setActivePublicPage,
  onGoToRental,
  setIsBrochureModalOpen,
  setIsLocationMapModalOpen,
  setIsAppDownloadModalOpen,
  setFaqCategory,
  setOpenFaqIds,
}) => {
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(phone);
    setTimeout(() => setCopiedPhone(null), 2500);
  };

  return (
    <footer className="bg-[#030712] text-slate-400 py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 relative overflow-hidden">
      {/* Background ambient subtle gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">

        {/* 1. Bandeau VIP : Ligne d'Urgence & Hub Connectivité 24/7 */}
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-900 border border-slate-800 p-5 sm:p-6 shadow-2xl backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ligne d'astreinte & Urgence Dépannage */}
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Permanence Opérationnelle 24/7</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Une urgence sur route ou un besoin d'assistance immédiate ?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Nos équipes mobiles d'intervention et nos coordinateurs de flotte sont mobilisables 24h/24, 7j/7 pour sécuriser vos conducteurs et vos véhicules.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="tel:+2290197832121"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-950 cursor-pointer"
                >
                  <Phone className="w-4 h-4 animate-bounce" />
                  <span>Appel d'Urgence : +229 01 97 83 21 21</span>
                </a>
                
                <a
                  href="https://wa.me/2290197832121?text=Bonjour%20JMF%20Mobility,%20j'ai%20besoin%20d'une%20assistance%20urgente%20ou%20d'un%20renseignement%20immediat."
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp 24/7</span>
                </a>
              </div>
            </div>

            {/* Quick App Scan & Direct Access */}
            <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setIsAppDownloadModalOpen(true)}
                className="p-1.5 bg-white rounded-xl hover:ring-2 hover:ring-sky-400 transition-all shrink-0 cursor-pointer shadow-md group relative"
                title="Agrandir le QR Code pour télécharger l'APK"
                aria-label="Agrandir le QR Code de l'application"
              >
                <QRCodeDisplay size={64} url={getApkDownloadUrl('driver')} />
                <span className="absolute -bottom-1 -right-1 bg-sky-600 text-white rounded-full p-1 shadow-xs">
                  <Download className="w-3 h-3" />
                </span>
              </button>

              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="text-xs font-bold text-white truncate">App Mobile & PWA Conducteur</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Scannez pour installer l'application JMF sur votre téléphone (iOS ou Android) sans téléchargement lourd.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAppDownloadModalOpen(true)}
                    className="text-[11px] font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Installer l'application</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    type="button"
                    onClick={() => onGoToApp('login')}
                    className="text-[11px] font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Espace Web
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2. Cartes des Hubs & Présence Internationale VIP */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-400" />
              <h4 className="text-sm font-black text-white uppercase tracking-wider">
                Nos Hubs & Présence Opérationnelle
              </h4>
            </div>
            <span className="text-xs text-slate-400">
              Couverture directe Bénin • Sénégal • Corridors Ouest-Africains
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
            
            {/* Hub 1 : Siège & Hub Opérationnel Bénin */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-sky-500/40 p-5 flex flex-col justify-between gap-3 h-full transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇧🇯</span>
                  <div>
                    <h5 className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors">
                      Siège & Direction Générale Afrique
                    </h5>
                    <p className="text-[11px] text-slate-400">Cotonou, Bénin</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Ouvert 24/7
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3 flex-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span>Vodjè lot 1061, Cotonou, République du Bénin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href="tel:+2290197832121" className="font-mono hover:text-white transition-colors">
                    +229 01 97 83 21 21
                  </a>
                  <span className="text-slate-600">/</span>
                  <a href="tel:+2290121248870" className="font-mono hover:text-white transition-colors">
                    +229 01 21 24 88 70
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <a href="mailto:contact@jmfmobilityservices.com" className="hover:text-white transition-colors truncate font-mono">
                    contact@jmfmobilityservices.com
                  </a>
                </div>
              </div>

              <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsLocationMapModalOpen(true)}
                  className="text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Voir le Plan d'Accès GPS</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('+229 01 97 83 21 21')}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedPhone === '+229 01 97 83 21 21' ? 'Copié ✓' : 'Copier numéro'}
                </button>
              </div>
            </div>

            {/* Hub 2 : Antenne Sénégal (Dakar) & Corridors Régionaux UEMOA */}
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/40 p-5 flex flex-col justify-between gap-3 h-full transition-all group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🇸🇳</span>
                  <div>
                    <h5 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                      Antenne Sénégal & Corridors UEMOA
                    </h5>
                    <p className="text-[11px] text-slate-400">Dakar, Sénégal & Réseau Sous-Régional</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  Hub Dakar 24/7
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3 flex-1">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="font-semibold text-white">SICAP N°6760, Liberté 6, Dakar, Sénégal</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>🇸🇳 Sénégal (Appel & WhatsApp) :</span>
                  <a href="tel:+221775984392" className="font-mono hover:text-white transition-colors">
                    +221 77 598 43 92
                  </a>
                  <span className="text-slate-600">•</span>
                  <a
                    href="https://wa.me/221775984392"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                </div>
                <div className="flex items-start gap-2 text-[11px] text-slate-400">
                  <Truck className="w-3.5 h-3.5 text-amber-400/80 shrink-0 mt-0.5" />
                  <span>Corridors Dakar-Bamako, Abidjan, Cotonou-Lomé-Ouaga & Niamey</span>
                </div>
              </div>

              <div className="pt-3 mt-auto flex items-center justify-between border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setIsLocationMapModalOpen(true)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Localisation & Plan d'Accès</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCopyPhone('+221 77 598 43 92')}
                  className="text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copiedPhone === '+221 77 598 43 92' ? 'Copié ✓' : 'Copier numéro'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Main 4-Column Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-4">
          
          {/* Colonne 1 : Identité & Hub Régional (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <JmfLogo variant="dark" className="h-11" />
            <p className="text-xs text-slate-400 leading-relaxed">
              JMF Mobility Services — Plateforme intégrée de gestion de flotte automobile, conciergerie logistique, maintenance multimarque, convoyage certifié et centres de stockage sécurisés 24/7 partout en Afrique.
            </p>

            {/* Badges de Réassurance & Couverture */}
            <div className="space-y-2 pt-1 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Globe2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-medium">Hub & Couverture Régionale</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-medium">Télématique 4G, Conformité CNSR, TVM & Visites</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-medium">Centre Opérationnel & Gardiennage 24/7</span>
              </div>
            </div>

            {/* Accès rapide Plateforme */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => onGoToApp('login')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                <span>Espace Client Sécurisé</span>
              </button>
              <button
                type="button"
                onClick={() => onGoToApp('register')}
                className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-sky-950"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Créer un compte</span>
              </button>
            </div>
          </div>

          {/* Colonne 2 : Solutions & Pôles Métiers (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3.5 text-xs">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
              <span>Nos Solutions & Métiers</span>
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#solutions" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Gestion de Flotte 360° (10 Pôles Clés)</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePublicPage('convoyage');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-slate-300 font-medium"
                >
                  <span className="text-amber-400">›</span>
                  <span>Convoyage Automobile Certifié</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    if (onGoToRental) {
                      onGoToRental(false);
                    } else {
                      window.open('?page=rental', '_blank');
                    }
                  }}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-slate-300 font-medium"
                >
                  <span className="text-teal-400">›</span>
                  <span>Location de Véhicules (Courte & Longue Durée)</span>
                </button>
              </li>
              <li>
                <a href="#gardiennage" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Centre de Stockage Sécurisé 24/7 (Cotonou)</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setActivePublicPage('pieces-auto');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-teal-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 text-slate-300 font-medium"
                >
                  <span className="text-teal-400">›</span>
                  <span>Pièces Détachées OEM & Rechanges d'Origine</span>
                </button>
              </li>
              <li>
                <a href="#mines" onClick={() => setActivePublicPage('home')} className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <span className="text-amber-400">›</span>
                  <span>Flottes Minières & BTP (Pistes & Chantiers)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : L'Entreprise & Outils (Col 8-9) */}
          <div className="lg:col-span-2 space-y-3.5 text-xs">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Outils & Ressources</span>
            </div>
            <ul className="space-y-2.5">
              <li>
                <a href="#quisommesnous" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Présentation & Vision JMF</span>
                </a>
              </li>
              <li>
                <a href="#pourquoi-nous-choisir" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Nos 4 Piliers d'Excellence</span>
                </a>
              </li>
              <li>
                <a href="#simulateur" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Simulateur de Coût TCO</span>
                </a>
              </li>
              <li>
                <a href="#packs" onClick={() => setActivePublicPage('home')} className="hover:text-sky-400 transition-colors flex items-center gap-1.5">
                  <span className="text-slate-600">›</span>
                  <span>Packs de Gestion Globale</span>
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={() => {
                    setActivePublicPage('home');
                    setFaqCategory('ALL');
                  }}
                  className="hover:text-teal-300 text-teal-400 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span className="text-teal-400">›</span>
                  <span>Foire Aux Questions (FAQ)</span>
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsBrochureModalOpen(true)}
                  className="hover:text-sky-400 transition-colors cursor-pointer text-left flex items-center gap-1.5 font-bold text-sky-400"
                >
                  <span className="text-sky-400">›</span>
                  <span>Plaquette Officielle (PDF)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Réseaux & Communauté (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3.5 text-xs">
            <div className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Communauté & Réseaux</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Suivez nos actualités, nos livraisons de flottes et nos innovations sur nos réseaux officiels :
            </p>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 hover:bg-[#0A66C2]/20 border border-slate-800 hover:border-[#0A66C2]/50 transition-all text-white group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold truncate">LinkedIn</span>
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 hover:bg-[#1877F2]/20 border border-slate-800 hover:border-[#1877F2]/50 transition-all text-white group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold truncate">Facebook</span>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 hover:bg-[#E4405F]/20 border border-slate-800 hover:border-[#E4405F]/50 transition-all text-white group"
              >
                <div className="w-6 h-6 rounded-lg bg-[#E4405F]/20 text-[#E4405F] flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold truncate">Instagram</span>
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 transition-all text-white group"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                  <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <span className="text-[11px] font-bold truncate">X (Twitter)</span>
              </a>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Audit Gratuit de Flotte
              </span>
              <p className="text-[11px] text-slate-300">
                Diagnostic préliminaire offert pour toute entreprise à partir de 3 véhicules.
              </p>
            </div>
          </div>

        </div>

        {/* 4. Sub-footer Bar : Copyright, Mentions, ISO & Statut Opérationnel */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-400 font-medium">
            © 2026 JMF Mobility Services. Tous droits réservés.
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[11px]">
            <a href="#quisommesnous" onClick={() => setActivePublicPage('home')} className="hover:text-slate-200 transition-colors">
              Mentions Légales
            </a>
            <span>·</span>
            <a href="#approche" onClick={() => setActivePublicPage('home')} className="hover:text-slate-200 transition-colors">
              Politique de Confidentialité
            </a>
            <span>·</span>
            <a href="#solutions" onClick={() => setActivePublicPage('home')} className="hover:text-slate-200 transition-colors">
              Conditions Générales (CGU / CGV)
            </a>
            <span>·</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Agrément Transport & Télématique
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Systèmes Opérationnels 24/7</span>
            <span>•</span>
            <span>Serveur Sécurisé</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
