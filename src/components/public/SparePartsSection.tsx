import React, { useState } from 'react';
import {
  Wrench,
  Car,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
  ShieldCheck,
  Package,
  Phone,
  MessageSquare,
  Sparkles,
  Search,
  Check,
  X,
  FileCheck,
  HelpCircle,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export interface SparePartsSectionProps {
  onBack?: () => void;
}

export interface SparePartRequest {
  id: string;
  reference: string;
  createdAt: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientCity: string;
  clientCountry: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleVin: string; // Numéro de châssis / VIN
  engineType: string; // Essence / Diesel / Hybride / Électrique
  partName: string; // Nom de la pièce
  partCategory: string; // Freinage, Moteur, Suspension, Carrosserie, Électricité, etc.
  partQuantity: number;
  partConditionPreference: 'ORIGINE_NEUF' | 'ADAPTABLE_PREMIUM' | 'OCCASION_TESTEE' | 'INDIFFERENT';
  partUrgency: 'URGENT_48H' | 'STANDARD_SEMAINE' | 'SUR_COMMANDE';
  notes: string;
  partPhotoName?: string;
  partPhotoDataUrl?: string;
  registrationDocName?: string; // Carte grise
  registrationDocDataUrl?: string;
  status: 'REÇUE' | 'EN_COURS_CHIFFRAGE' | 'DEVIS_ENVOYÉ' | 'EXPÉDIÉE';
}

const STORAGE_KEY_SPARE_PARTS = 'jmf_spare_parts_requests';

// Sauvegarde dans le localStorage partagé pour notification & administration
export const saveSparePartRequest = (req: SparePartRequest) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SPARE_PARTS);
    const list: SparePartRequest[] = raw ? JSON.parse(raw) : [];
    // Sauvegarder avec métadonnées allégées dans le localStorage pour éviter tout QuotaExceededError
    const reqToStore: SparePartRequest = {
      ...req,
      partPhotoDataUrl: req.partPhotoDataUrl ? 'ATTACHED_PHOTO' : undefined,
      registrationDocDataUrl: req.registrationDocDataUrl ? 'ATTACHED_DOC' : undefined,
    };
    list.unshift(reqToStore);
    localStorage.setItem(STORAGE_KEY_SPARE_PARTS, JSON.stringify(list));
    // Dispatch un événement personnalisé au cas où l'administration écoute
    window.dispatchEvent(new CustomEvent('jmf-spare-part-request-created', { detail: req }));
  } catch (e) {
    console.error('Erreur sauvegarde demande pièces:', e);
  }
};

export const SparePartsSection: React.FC<SparePartsSectionProps> = ({ onBack }) => {
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientCountry, setClientCountry] = useState('Bénin');

  const [vehicleBrand, setVehicleBrand] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [vehicleVin, setVehicleVin] = useState('');
  const [engineType, setEngineType] = useState('Essence');

  const [partName, setPartName] = useState('');
  const [partCategory, setPartCategory] = useState('Freinage & Sécurité');
  const [partQuantity, setPartQuantity] = useState(1);
  const [partConditionPreference, setPartConditionPreference] = useState<'ORIGINE_NEUF' | 'ADAPTABLE_PREMIUM' | 'OCCASION_TESTEE' | 'INDIFFERENT'>('ORIGINE_NEUF');
  const [partUrgency, setPartUrgency] = useState<'URGENT_48H' | 'STANDARD_SEMAINE' | 'SUR_COMMANDE'>('STANDARD_SEMAINE');
  const [notes, setNotes] = useState('');

  // File Upload States
  const [partPhoto, setPartPhoto] = useState<{ name: string; dataUrl: string; size: string } | null>(null);
  const [registrationDoc, setRegistrationDoc] = useState<{ name: string; dataUrl: string; size: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SparePartRequest | null>(null);

  // Common Popular Brands in West Africa
  const popularBrands = ['Toyota', 'Iveco', 'Mitsubishi', 'Nissan', 'Hyundai', 'Kia', 'Ford', 'Renault', 'Peugeot', 'Mercedes-Benz'];

  // Handle file uploads (Convert to DataURL for preview & storage)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'partPhoto' | 'registrationDoc'
  ) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Le fichier sélectionné dépasse la taille maximale autorisée de 5 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} Mo`;
      if (type === 'partPhoto') {
        setPartPhoto({ name: file.name, dataUrl: result, size: sizeStr });
      } else {
        setRegistrationDoc({ name: file.name, dataUrl: result, size: sizeStr });
      }
    };
    reader.onerror = () => {
      setUploadError('Erreur lors de la lecture du fichier. Veuillez réessayer.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim() || !vehicleBrand.trim() || !vehicleModel.trim() || !partName.trim()) {
      setUploadError('Veuillez renseigner tous les champs obligatoires marqués d’un astérisque (*).');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    const ref = `PIECE-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: SparePartRequest = {
      id: `req_part_${Date.now()}`,
      reference: ref,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      clientCity: clientCity.trim() || 'Cotonou',
      clientCountry,
      vehicleBrand: vehicleBrand.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      vehicleVin: vehicleVin.trim().toUpperCase(),
      engineType,
      partName: partName.trim(),
      partCategory,
      partQuantity: Math.max(1, partQuantity),
      partConditionPreference,
      partUrgency,
      notes: notes.trim(),
      partPhotoName: partPhoto?.name,
      partPhotoDataUrl: partPhoto?.dataUrl,
      registrationDocName: registrationDoc?.name,
      registrationDocDataUrl: registrationDoc?.dataUrl,
      status: 'REÇUE',
    };

    setTimeout(() => {
      saveSparePartRequest(newRequest);
      setSubmittedRequest(newRequest);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setSubmittedRequest(null);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setVehicleBrand('');
    setVehicleModel('');
    setVehicleYear('');
    setVehicleVin('');
    setPartName('');
    setNotes('');
    setPartPhoto(null);
    setRegistrationDoc(null);
    setUploadError(null);
  };

  return (
    <section id="pieces-detachees" className="py-16 sm:py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Subtle Background Glow & Accent Grid */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        {onBack && (
          <div className="flex items-center justify-between pb-2">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer shadow-sm"
              title="Retourner à la page d'accueil"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span>← Retour au Site Public (Accueil)</span>
            </button>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-3 py-1 rounded-full">
              <Wrench className="w-3.5 h-3.5" />
              Page Dédiée • Pièces Détachées OEM
            </span>
          </div>
        )}

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 text-sky-300 text-xs font-bold tracking-wider border border-sky-500/25">
            <Wrench className="w-3.5 h-3.5 text-sky-400" />
            <span>VENTE & SOURCING DE PIÈCES DÉTACHÉES AUTOMOBILES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Commandez vos Pièces de Rechange d'Origine & Certifiées
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Trouvez rapidement la pièce exacte pour votre véhicule (Particulier, 4x4, Utilitaire ou Poids Lourd). Transmettez les informations de votre voiture, la photo de la pièce et votre carte grise pour une identification sans erreur par notre équipe technique.
          </p>
        </div>

        {/* 4 Trust Highlights Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Zéro Erreur</strong>
              <span className="text-[11px] text-slate-400">Vérification par carte grise / châssis VIN</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Pièces Certifiées</strong>
              <span className="text-[11px] text-slate-400">Origine constructeur (OEM) & Adaptable</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Réponse sous 2h</strong>
              <span className="text-[11px] text-slate-400">Chiffrage immédiat & disponibilité stock</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start gap-2.5">
            <Package className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-bold">Livraison & Pose</strong>
              <span className="text-[11px] text-slate-400">Retrait hub ou montage en atelier agréé</span>
            </div>
          </div>
        </div>

        {/* Success Confirmation Card OR Interactive Form */}
        {submittedRequest ? (
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3.5 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                    Demande Transmise à l'Administration JMF
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Réf. {submittedRequest.reference}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  Votre demande de pièce détachée a été enregistrée avec succès !
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Nos magasiniers et experts techniques vérifient immédiatement la compatibilité avec votre référence et préparent votre devis.
                </p>
              </div>
            </div>

            {/* Request Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Véhicule concerné</span>
                <strong className="text-slate-900 text-sm block">
                  {submittedRequest.vehicleBrand} {submittedRequest.vehicleModel} ({submittedRequest.vehicleYear || 'Année N/C'})
                </strong>
                <span className="text-slate-600 font-mono text-[11px] block mt-0.5">
                  Motorisation : {submittedRequest.engineType}
                  {submittedRequest.vehicleVin && ` • Châssis/VIN : ${submittedRequest.vehicleVin}`}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pièce demandée</span>
                <strong className="text-teal-700 text-sm block">
                  {submittedRequest.partName} (x{submittedRequest.partQuantity})
                </strong>
                <span className="text-slate-600 text-[11px] block mt-0.5">
                  Catégorie : {submittedRequest.partCategory}
                </span>
                <span className="text-slate-500 text-[10px] block">
                  Qualité : {submittedRequest.partConditionPreference.replace('_', ' ')}
                </span>
              </div>

              <div className="sm:col-span-2 pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-500 block">Contact client :</span>
                  <strong className="text-slate-800">{submittedRequest.clientName}</strong> • {submittedRequest.clientPhone}
                  {submittedRequest.clientEmail && ` • ${submittedRequest.clientEmail}`}
                </div>
                <div className="text-[11px] text-slate-500">
                  Documents joints :{' '}
                  <span className="font-semibold text-slate-700">
                    {submittedRequest.partPhotoName ? '1 photo pièce' : 'Aucune photo'} •{' '}
                    {submittedRequest.registrationDocName ? '1 carte grise' : 'Sans carte grise'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fast WhatsApp Bridge */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                  `Bonjour JMF Mobility, je viens d'enregistrer ma demande de pièce détachée réf. ${submittedRequest.reference} pour mon véhicule ${submittedRequest.vehicleBrand} ${submittedRequest.vehicleModel} (${submittedRequest.partName}, qté: ${submittedRequest.partQuantity}). Pourriez-vous me confirmer le prix et le délai de mise à disposition ?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                title="WhatsApp & Appel direct Afrique (+229 01 97 83 21 21)"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp & Direct (+229 01 97 83 21 21)</span>
              </a>

              <a
                href={`https://wa.me/33650059161?text=${encodeURIComponent(
                  `Bonjour JMF Mobility, je viens d'enregistrer ma demande de pièce détachée réf. ${submittedRequest.reference} pour mon véhicule ${submittedRequest.vehicleBrand} ${submittedRequest.vehicleModel} (${submittedRequest.partName}, qté: ${submittedRequest.partQuantity}). Pourriez-vous me confirmer le prix et le délai de mise à disposition ?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                title="WhatsApp & Appel direct France (+33 6 50 05 91 61)"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp & Direct (+33 6 50 05 91 61)</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              >
                Nouvelle demande
              </button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="py-3 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                >
                  Retour à l'accueil
                </button>
              )}
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-8"
          >
            {/* Step 1 : Client Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-extrabold">
                  1
                </div>
                <span>Vos Coordonnées de Contact</span>
                <span className="text-[10px] font-normal text-slate-400 ml-auto">Pour l'envoi du devis chiffré</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nom et Prénom (ou Entreprise) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean Paul MENSAH / Société Alpha"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Numéro de Téléphone (WhatsApp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +229 01 97 00 00 00"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Adresse Email (Optionnelle)
                  </label>
                  <input
                    type="email"
                    placeholder="Ex: client@entreprise.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 : Vehicle Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-extrabold">
                  2
                </div>
                <span>Informations du Véhicule</span>
                <span className="text-[10px] font-normal text-slate-400 ml-auto">Garantit la compatibilité exacte de la pièce</span>
              </div>

              {/* Quick Brand Selector Pills */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                  Marques courantes :
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {popularBrands.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setVehicleBrand(b)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        vehicleBrand === b
                          ? 'bg-sky-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Marque du Véhicule <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Toyota, Iveco, Nissan..."
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Modèle / Finition <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Hilux 2.8 D-4D, RAV4, Daily..."
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Année de fabrication
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2020, 2018..."
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Motorisation
                  </label>
                  <select
                    value={engineType}
                    onChange={(e) => setEngineType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Diesel">Diesel / Turbo-Diesel</option>
                    <option value="Essence">Essence</option>
                    <option value="Hybride">Hybride / Hybride Rechargeable</option>
                    <option value="Électrique">100% Électrique</option>
                  </select>
                </div>
              </div>

              {/* VIN / Châssis input */}
              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  Numéro de Châssis / VIN (17 caractères figurant sur la carte grise) :
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={17}
                    placeholder="Ex: AHTFR22G901234567 (Idéal pour cibler la référence catalogue exacte)"
                    value={vehicleVin}
                    onChange={(e) => setVehicleVin(e.target.value.toUpperCase())}
                    className="w-full h-10 px-3 font-mono rounded-xl border border-slate-200 text-xs uppercase focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono">
                    {vehicleVin.length}/17
                  </span>
                </div>
              </div>
            </div>

            {/* Step 3 : Part Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-extrabold">
                  3
                </div>
                <span>Détail de la Pièce Souhaitée</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Désignation de la pièce souhaitée <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Kit plaquettes de frein avant, Amortisseurs arrière, Alternateur, Filtre à gasoil..."
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Quantité souhaitée
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={partQuantity}
                    onChange={(e) => setPartQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full h-10 px-3 text-center font-bold rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Famille / Système
                  </label>
                  <select
                    value={partCategory}
                    onChange={(e) => setPartCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Freinage & Sécurité">Freinage (Plaquettes, disques, étriers)</option>
                    <option value="Filtration & Vidange">Filtration (Huile, air, gasoil, habitacle)</option>
                    <option value="Suspension & Direction">Suspension, direction & rotules</option>
                    <option value="Moteur & Distribution">Moteur, courroies & distribution</option>
                    <option value="Refroidissement & Climatisation">Refroidissement & compresseur clim</option>
                    <option value="Électricité & Démarrage">Batterie, alternateur, démarreur</option>
                    <option value="Carrosserie & Éclairage">Phares, optiques, rétroviseurs, pare-chocs</option>
                    <option value="Embrayage & Transmission">Boîte de vitesses, embrayage, cardans</option>
                    <option value="Pneumatiques & Jantes">Pneumatiques tout-terrain ou route</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Préférence de qualité
                  </label>
                  <select
                    value={partConditionPreference}
                    onChange={(e) => setPartConditionPreference(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="ORIGINE_NEUF">Origine Constructeur Neuf (OEM)</option>
                    <option value="ADAPTABLE_PREMIUM">Adaptable Qualité Équivalente Premium</option>
                    <option value="OCCASION_TESTEE">Occasion Certifiée & Testée</option>
                    <option value="INDIFFERENT">Indifférent (Meilleur rapport qualité/prix)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Délai souhaité
                  </label>
                  <select
                    value={partUrgency}
                    onChange={(e) => setPartUrgency(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
                  >
                    <option value="URGENT_48H">Urgence dépannage (Sous 24h - 48h)</option>
                    <option value="STANDARD_SEMAINE">Standard (Cette semaine)</option>
                    <option value="SUR_COMMANDE">Approvisionnement / Sur commande</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 text-xs">
                  Précisions complémentaires (Symptôme de panne, côté gauche/droit, dimensions...) :
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Côté conducteur avant, référence gravée sur l'ancienne pièce si visible..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Step 4 : Document Uploads (Photo of Part + Carte Grise) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-900 font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-extrabold">
                  4
                </div>
                <span>Photos & Documents Justificatifs</span>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded ml-auto">
                  Accélère le traitement à 100%
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload 1: Photo de la pièce souhaitée */}
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-sky-400 transition-colors bg-slate-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-sky-600" />
                      <span>Photo de la pièce souhaitée</span>
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Max 5Mo)</span>
                  </div>

                  {partPhoto ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-4 h-4 text-sky-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-sky-950 block truncate">{partPhoto.name}</span>
                          <span className="text-[10px] text-sky-700">{partPhoto.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPartPhoto(null)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Supprimer la photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block p-4 text-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-sky-700 block">
                          Télécharger la photo de la pièce
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Ancienne pièce démontée ou schéma
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'partPhoto')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Upload 2: Carte Grise du Véhicule */}
                <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors bg-slate-50/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Carte Grise du véhicule (Recommandé)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, PDF (Max 5Mo)</span>
                  </div>

                  {registrationDoc ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-emerald-950 block truncate">{registrationDoc.name}</span>
                          <span className="text-[10px] text-emerald-700">{registrationDoc.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRegistrationDoc(null)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Supprimer la carte grise"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label className="block p-4 text-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                        <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                        <span className="text-xs font-semibold text-emerald-700 block">
                          Télécharger la carte grise
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Pour extraction directe du code VIN & Type Mines
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={(e) => handleFileUpload(e, 'registrationDoc')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Submit Action Strip */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Transmission cryptée & sécurisée directement à l'administration JMF</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer self-stretch sm:self-auto"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Transmission en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer ma demande à l'Administration</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
