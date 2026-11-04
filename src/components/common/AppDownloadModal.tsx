import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Check,
  Info,
  Sparkles,
  QrCode,
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall.js';
import { QRCodeDisplay, getScanAppUrl, getApkDownloadUrl } from './QRCodeDisplay.js';

export type AppPartType = 'all' | 'driver' | 'manager' | 'client' | 'rental';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPart?: AppPartType;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  defaultPart = 'driver',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [selectedPart, setSelectedPart] = useState<AppPartType>(defaultPart);
  const [activePlatform, setActivePlatform] = useState<'qrcode' | 'android' | 'ios' | 'desktop'>('qrcode');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const appParts = [
    {
      id: 'driver' as AppPartType,
      title: 'App Conducteur (JMF Driver)',
      shortTitle: 'Conducteur',
      badge: 'Relevé km, Pleins & SOS',
      color: 'from-sky-500 to-blue-600',
      description: 'Interface allégée pour chauffeurs et conducteurs : saisie du compteur km, scan tickets carburant, déclaration de pannes et assistance 24/7.',
      icon: '🚗',
      apkUrl: getApkDownloadUrl('driver'),
      apkFilename: 'jmf-mobility-driver.apk',
      standaloneUrl: getScanAppUrl('/?app=driver'),
    },
    {
      id: 'all' as AppPartType,
      title: 'Plateforme Complète JMF Fleet',
      shortTitle: 'Plateforme Globale',
      badge: 'Admin, Suivi & Flotte',
      color: 'from-indigo-600 to-purple-600',
      description: 'Application complète tout-en-un avec tableau de bord, géolocalisation en temps réel, télématique et gestion des véhicules.',
      icon: '🏢',
      apkUrl: getApkDownloadUrl('all'),
      apkFilename: 'jmf-mobility.apk',
      standaloneUrl: getScanAppUrl('/?page=platform'),
    },
    {
      id: 'rental' as AppPartType,
      title: 'Module Location & Réservation',
      shortTitle: 'Location',
      badge: 'Devis PDF & Réservation',
      color: 'from-teal-500 to-emerald-600',
      description: 'Catalogue de location de véhicules avec calculateur de devis instantané, téléchargement PDF officiel et réservation directe.',
      icon: '🔑',
      apkUrl: getApkDownloadUrl('rental'),
      apkFilename: 'jmf-mobility-rental.apk',
      standaloneUrl: getScanAppUrl('/?view=rental'),
    },
    {
      id: 'client' as AppPartType,
      title: 'Portail Client & Particulier',
      shortTitle: 'Client Particulier',
      badge: 'Alertes SMS & Véhicule',
      color: 'from-amber-500 to-orange-600',
      description: 'Espace dédié aux propriétaires particuliers et clients entreprises : alertes d’entretien SMS, suivi des contrats et pièces.',
      icon: '👤',
      apkUrl: getApkDownloadUrl('client'),
      apkFilename: 'jmf-mobility-client.apk',
      standaloneUrl: getScanAppUrl('/?view=maintenance_sms'),
    },
  ];

  const currentPartInfo = appParts.find((p) => p.id === selectedPart) || appParts[0];

  const handleNativePWAInstall = async () => {
    if (isInstallable) {
      const res = await install();
      if (res) {
        setDownloadSuccess('Application installée avec succès sur votre appareil !');
        setTimeout(() => setDownloadSuccess(null), 4000);
      }
    }
  };

  const handleDownloadApk = (part: typeof appParts[0]) => {
    const a = document.createElement('a');
    a.href = `/apk/${part.apkFilename}`;
    a.download = part.apkFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setDownloadSuccess(`Téléchargement de « ${part.apkFilename} » lancé ! Ouvrez le fichier APK sur votre appareil Android pour l'installer.`);
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-2xl shadow-inner">
              📥
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-300 border border-sky-400/30">
                  Installation & Téléchargement PWA
                </span>
                {isInstalled && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    Déjà installée
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Télécharger l'Application JMF Fleet
              </h2>
              <p className="text-xs text-slate-300">
                Chaque module peut être installé séparément sur smartphone (Android & iOS) ou ordinateur.
              </p>
            </div>
          </div>
        </div>

        {/* Success toast inside modal */}
        {downloadSuccess && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 px-6 animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Step 1: Select Application Part */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              1. Choisissez le module à installer / télécharger :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {appParts.map((part) => {
                const isSelected = selectedPart === part.id;
                return (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => setSelectedPart(part.id)}
                    className={`p-3 rounded-2xl text-left border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/30 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/60'
                    }`}
                  >
                    <div>
                      <span className="text-2xl block mb-1">{part.icon}</span>
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {part.shortTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {part.badge}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Description of active part */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">{currentPartInfo.title} : </span>
                <span>{currentPartInfo.description}</span>
              </div>
            </div>
          </div>

          {/* Step 2: Choose Platform / Direct Install */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                2. Méthode d'installation par appareil :
              </label>
              <div className="flex flex-wrap gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActivePlatform('qrcode')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                    activePlatform === 'qrcode'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatform('android')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activePlatform === 'android'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Android
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatform('ios')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activePlatform === 'ios'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  iPhone / iOS
                </button>
                <button
                  type="button"
                  onClick={() => setActivePlatform('desktop')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    activePlatform === 'desktop'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  PC / Mac
                </button>
              </div>
            </div>

            {/* Platform Guides */}
            {activePlatform === 'qrcode' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 via-white to-slate-50 border border-sky-200/90 flex flex-col items-center text-center space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-sky-600" />
                  <span>Scannez ce QR Code pour télécharger l'APK ({currentPartInfo.apkFilename})</span>
                </div>
                <p className="text-[11px] text-slate-500 max-w-md">
                  Télécharge directement le fichier APK <strong className="text-slate-800">{currentPartInfo.title}</strong> sur votre smartphone.
                </p>
                <QRCodeDisplay
                  url={currentPartInfo.apkUrl}
                  size={190}
                  showControls={true}
                  downloadFilename={`qrcode-jmf-${currentPartInfo.id}.png`}
                />
              </div>
            )}

            {activePlatform === 'android' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-sky-50/70 border border-emerald-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    Installation Directe Android (APK / PWA)
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Sans Google Play requis
                  </span>
                </div>

                {/* Primary 1-Click Install Action */}
                <button
                  type="button"
                  onClick={async () => {
                    if (isInstallable) {
                      await handleNativePWAInstall();
                    } else {
                      handleDownloadApk(currentPartInfo);
                    }
                  }}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isInstallable
                      ? `Installer ${currentPartInfo.shortTitle} sur cet appareil Android (1 clic)`
                      : `Télécharger l'APK Android (${currentPartInfo.apkFilename})`}
                  </span>
                </button>

                <div className="space-y-2 text-xs text-slate-700 pt-1">
                  <div className="text-[11px] font-bold text-slate-800">
                    Ou depuis Google Chrome sur votre téléphone Android :
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <span>Ouvrez le site dans Chrome puis appuyez sur les </span>
                      <strong>trois points (⋮)</strong> en haut à droite.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Appuyez sur <strong>« Installer l'application »</strong> (ou <strong>« Ajouter à l'écran d'accueil »</strong>).
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      L'application <strong>JMF Fleet</strong> s'installe comme une vraie application Android native avec son icône sur votre téléphone.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'ios' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/70 to-indigo-50/70 border border-sky-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-sky-600" />
                    Installation Apple iOS (iPhone & iPad Safari)
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                    iOS 14+
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      Dans Safari, touchez le bouton <strong>Partager (carré avec flèche vers le haut)</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Faites défiler la liste vers le bas et appuyez sur <strong>« Sur l'écran d'accueil »</strong>.
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      Validez avec <strong>« Ajouter »</strong> en haut à droite. L'icône de l'app est immédiatement prête.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'desktop' && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-slate-100 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4 text-indigo-600" />
                    Installation Ordinateur (Chrome, Edge & Brave)
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    Desktop App
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      Cliquez sur l'icône <strong>« Installer » (écran avec flèche)</strong> située dans la barre d'adresse de votre navigateur (tout à droite).
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Confirmez l'installation. L'application s'ouvre dans sa propre fenêtre indépendante avec raccourci sur le Bureau.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions & APK file download */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <button
              type="button"
              onClick={() => handleDownloadApk(currentPartInfo)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>Télécharger l'APK ({currentPartInfo.apkFilename})</span>
            </button>

            <a
              href={currentPartInfo.apkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lien direct APK</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Norme PWA Progressive Web App • Cache hors-ligne certifié
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
