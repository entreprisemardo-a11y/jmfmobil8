import React, { useState, useEffect } from 'react';
import {
  Tag,
  Car,
  Warehouse,
  AlertTriangle,
  CheckCircle2,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  DollarSign,
  FileText,
  Search,
  ExternalLink,
  History,
  Sliders,
  Check,
  Info,
  Calendar,
  Sparkles,
  Key,
} from 'lucide-react';
import {
  pricingService,
  StorageCategoryPricing,
  RentalVehiclePricing,
  StorageGeneralSettings,
  PricingAuditLog,
  FleetPackagePricing,
  ProTariffGridData,
} from '../../services/pricingService.js';
import { useAuth } from '../../context/AuthContext.js';

interface PricingManagementSectionProps {
  onGoToPublic?: () => void;
  onGoToRental?: () => void;
}

export const PricingManagementSection: React.FC<PricingManagementSectionProps> = ({
  onGoToPublic,
  onGoToRental,
}) => {
  const { user } = useAuth();
  const adminName = user ? `${user.first_name} ${user.last_name}` : 'Super Administrateur JMF';

  const [activeSubTab, setActiveSubTab] = useState<
    'storage' | 'rental' | 'fleet360' | 'proGrid' | 'settings' | 'audit'
  >('storage');
  
  // Data states
  const [storageCategories, setStorageCategories] = useState<StorageCategoryPricing[]>([]);
  const [rentalFleet, setRentalFleet] = useState<RentalVehiclePricing[]>([]);
  const [fleetPackages, setFleetPackages] = useState<FleetPackagePricing[]>([]);
  const [proTariffGrid, setProTariffGrid] = useState<ProTariffGridData>(() =>
    pricingService.getProTariffGrid()
  );
  const [generalSettings, setGeneralSettings] = useState<StorageGeneralSettings>(pricingService.getStorageGeneralSettings());
  const [auditLogs, setAuditLogs] = useState<PricingAuditLog[]>([]);

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('');

  // UI Feedback
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetTarget, setResetTarget] = useState<'storage' | 'rental' | 'fleet' | 'proGrid' | 'all'>('storage');

  // New storage category modal
  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [newCat, setNewCat] = useState<Partial<StorageCategoryPricing>>({
    name: '',
    surface: '20 m²',
    dailyRate: 6000,
    overstayRate: 8500,
    description: '',
    enabled: true,
  });

  const loadData = () => {
    setStorageCategories(pricingService.getStorageCategories());
    setRentalFleet(pricingService.getRentalFleetPricing());
    setFleetPackages(pricingService.getFleetPackages());
    setProTariffGrid(pricingService.getProTariffGrid());
    setGeneralSettings(pricingService.getStorageGeneralSettings());
    setAuditLogs(pricingService.getPricingAuditLogs());
  };

  useEffect(() => {
    loadData();
    const unsubscribe = pricingService.subscribe(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  const showSuccessNotice = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => {
      setSaveSuccessMessage(null);
    }, 4000);
  };

  // --- Handlers: Storage Categories ---
  const handleStorageFieldChange = (id: string, field: keyof StorageCategoryPricing, value: any) => {
    setStorageCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat))
    );
  };

  const handleSaveStorageCategory = (cat: StorageCategoryPricing) => {
    pricingService.saveStorageCategory(cat, adminName);
    showSuccessNotice(`Tarifs pour "${cat.name}" sauvegardés avec succès !`);
  };

  const handleSaveAllStorage = () => {
    pricingService.saveAllStorageCategories(storageCategories, adminName);
    showSuccessNotice('L’ensemble de la grille de stockage et des pénalités de dépassement a été enregistrée.');
  };

  const handleToggleCategoryEnabled = (id: string) => {
    const updated = storageCategories.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    setStorageCategories(updated);
    pricingService.saveAllStorageCategories(updated, adminName);
    showSuccessNotice('Visibilité de l’emplacement mise à jour.');
  };

  const handleCreateNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name?.trim()) return;

    const id = 'cat_custom_' + Date.now().toString(36);
    const completeCategory: StorageCategoryPricing = {
      id,
      name: newCat.name.trim(),
      surface: newCat.surface || '20 m²',
      dailyRate: Number(newCat.dailyRate) || 5000,
      overstayRate: Number(newCat.overstayRate) || 7500,
      description: newCat.description?.trim() || 'Emplacement spécial avec gardiennage 24/7',
      enabled: true,
    };

    pricingService.saveStorageCategory(completeCategory, adminName);
    setIsNewCategoryModalOpen(false);
    setNewCat({
      name: '',
      surface: '20 m²',
      dailyRate: 6000,
      overstayRate: 8500,
      description: '',
      enabled: true,
    });
    showSuccessNotice(`Nouvelle catégorie "${completeCategory.name}" créée et active.`);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${name}" ?`)) {
      const filtered = storageCategories.filter((c) => c.id !== id);
      pricingService.saveAllStorageCategories(filtered, adminName);
      showSuccessNotice(`Catégorie "${name}" supprimée.`);
    }
  };

  // --- Handlers: Rental Fleet ---
  const handleRentalFieldChange = (id: string, field: keyof RentalVehiclePricing, value: any) => {
    setRentalFleet((prev) =>
      prev.map((veh) => (veh.id === id ? { ...veh, [field]: value } : veh))
    );
  };

  const handleSaveRentalVehicle = (veh: RentalVehiclePricing) => {
    pricingService.saveRentalVehiclePricing(veh, adminName);
    showSuccessNotice(`Tarifs pour ${veh.brand} ${veh.model} (${veh.plateNumber}) enregistrés !`);
  };

  const handleSaveAllRental = () => {
    pricingService.saveAllRentalFleetPricing(rentalFleet, adminName);
    showSuccessNotice('Toute la grille tarifaire de la flotte automobile a été mise à jour.');
  };

  // --- Handlers: Fleet 360 Packages ---
  const handleFleetFieldChange = (id: string, field: keyof FleetPackagePricing, value: any) => {
    setFleetPackages((prev) =>
      prev.map((pack) => (pack.id === id ? { ...pack, [field]: value } : pack))
    );
  };

  const handleSaveFleetPackage = (pack: FleetPackagePricing) => {
    pricingService.saveFleetPackage(pack, adminName);
    showSuccessNotice(`Tarifs pour "${pack.name}" sauvegardés avec succès !`);
  };

  const handleSaveAllFleet = () => {
    pricingService.saveAllFleetPackages(fleetPackages, adminName);
    showSuccessNotice('Toutes les formules de Gestion de Flotte 360° ont été mises à jour.');
  };

  const handleToggleFleetPackEnabled = (id: string) => {
    const updated = fleetPackages.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    );
    setFleetPackages(updated);
    pricingService.saveAllFleetPackages(updated, adminName);
    showSuccessNotice('Visibilité de la formule flotte mise à jour.');
  };

  // --- Handlers: Pro Tariff Grid (Bénin: Utilitaires, Poids Lourds, Engins) ---
  const handleProUnitRateChange = (id: string, value: number) => {
    setProTariffGrid((prev) => ({
      ...prev,
      unitRates: prev.unitRates.map((u) =>
        u.id === id ? { ...u, monthlyRateNumeric: value } : u
      ),
    }));
  };

  const handleProPackFeeChange = (id: string, value: number) => {
    setProTariffGrid((prev) => ({
      ...prev,
      categoryPacks: prev.categoryPacks.map((p) =>
        p.id === id ? { ...p, monthlyFeeNumeric: value } : p
      ),
    }));
  };

  const handleProOptionRateChange = (id: string, value: string) => {
    setProTariffGrid((prev) => ({
      ...prev,
      complementaryOptions: prev.complementaryOptions.map((o) =>
        o.id === id ? { ...o, indicativeRate: value } : o
      ),
    }));
  };

  const handleSaveProTariffGrid = () => {
    pricingService.saveProTariffGrid(proTariffGrid, adminName);
    showSuccessNotice('La Grille Tarifaire Professionnelle (Utilitaires, Poids Lourds, Engins) a été enregistrée.');
  };

  // --- Handlers: Settings ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    pricingService.saveStorageGeneralSettings(generalSettings, adminName);
    showSuccessNotice('Paramètres généraux et options de dépassement enregistrés.');
  };

  // --- Reset Handlers ---
  const handleConfirmReset = () => {
    if (resetTarget === 'storage' || resetTarget === 'all') {
      pricingService.resetStorageCategories(adminName);
    }
    if (resetTarget === 'rental' || resetTarget === 'all') {
      pricingService.resetRentalFleetPricing(adminName);
    }
    if (resetTarget === 'fleet' || resetTarget === 'all') {
      pricingService.resetFleetPackages(adminName);
    }
    if (resetTarget === 'proGrid' || resetTarget === 'all') {
      pricingService.resetProTariffGrid(adminName);
    }
    setIsResetModalOpen(false);
    showSuccessNotice('Barèmes d’origine réinitialisés avec succès.');
  };

  // Filtered lists
  const filteredStorage = storageCategories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.surface.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRental = rentalFleet.filter((veh) =>
    `${veh.brand} ${veh.model} ${veh.plateNumber} ${veh.category}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const filteredFleetPackages = fleetPackages.filter((pack) =>
    `${pack.name} ${pack.shortName} ${pack.fleetSize} ${pack.description}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {saveSuccessMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs sm:text-sm font-bold">{saveSuccessMessage}</span>
          </div>
          <span className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
            Sync Instantanée Active
          </span>
        </div>
      )}

      {/* Main Stats Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>GESTIONNAIRE DE TARIFS & RÉSERVATIONS</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
            Édition des Grilles & Tarifications Officielles
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Modifiez en temps réel les tarifs journaliers de location de véhicules, les prix d’emplacements de stockage sécurisé, ainsi que les <strong>clauses et facturations journalières de dépassement (Overstay Policy)</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setResetTarget('all');
              setIsResetModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Rétablir les montants par défaut"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Réinitialiser par défaut</span>
          </button>

          {onGoToRental && (
            <button
              onClick={onGoToRental}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Tester les tarifs sur la page de location"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Tester Page Location</span>
            </button>
          )}

          {onGoToPublic && (
            <button
              onClick={onGoToPublic}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Tester le devis d’emplacement en direct"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tester Formulaire Public</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('storage')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'storage'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            <span>Emplacements & Dépassement Stockage ({storageCategories.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('rental')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'rental'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Flotte Location Véhicules ({rentalFleet.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fleet360')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'fleet360'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Packs Flotte 360° ({fleetPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('proGrid')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'proGrid'
                ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-700/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Grille Pro Bénin : Utilitaires, Poids Lourds &amp; Engins</span>
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Options & Paramètres Overstay</span>
          </button>

          <button
            onClick={() => setActiveSubTab('audit')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'audit'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-600/30'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historique des Tarifs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrer un gabarit ou véhicule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: STORAGE & OVERSTAY PRICING */}
      {/* ========================================================================= */}
      {activeSubTab === 'storage' && (
        <div className="space-y-4">
          {/* Header Action Bar */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="text-xs text-amber-950">
                <span className="font-bold text-amber-900 block text-sm">
                  Tarification des Emplacements & Pénalités Contractuelles de Dépassement
                </span>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Toute modification apportée ici met immédiatement à jour les montants du <strong>formulaire de devis proforma en ligne</strong> et la clause contractuelle d'acceptation obligatoire.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsNewCategoryModalOpen(true)}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Gabarit</span>
              </button>
              <button
                onClick={handleSaveAllStorage}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer Tout</span>
              </button>
            </div>
          </div>

          {/* Storage Pricing Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-72">Gabarit d'Engin / Catégorie</th>
                    <th className="py-3 px-3 w-32">Surface Allouée</th>
                    <th className="py-3 px-4 w-44">
                      Tarif Normal / Jour (FCFA)
                    </th>
                    <th className="py-3 px-4 w-48 text-amber-800 bg-amber-50/50">
                      Tarif Dépassement / Jour (FCFA)
                    </th>
                    <th className="py-3 px-3">Statut</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStorage.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{cat.name}</div>
                        <input
                          type="text"
                          value={cat.description}
                          onChange={(e) => handleStorageFieldChange(cat.id, 'description', e.target.value)}
                          placeholder="Description commerciale..."
                          className="w-full mt-1 p-1.5 text-[11px] bg-slate-50 border border-slate-200 rounded text-slate-600 focus:bg-white focus:border-indigo-500"
                        />
                      </td>

                      <td className="py-3.5 px-3">
                        <input
                          type="text"
                          value={cat.surface}
                          onChange={(e) => handleStorageFieldChange(cat.id, 'surface', e.target.value)}
                          className="w-full p-1.5 text-xs font-mono font-semibold bg-white border border-slate-200 rounded text-slate-800"
                        />
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="relative">
                          <input
                            type="number"
                            step="500"
                            min="500"
                            value={cat.dailyRate}
                            onChange={(e) => handleStorageFieldChange(cat.id, 'dailyRate', Number(e.target.value))}
                            className="w-full pr-12 p-2 text-xs font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            FCFA
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">
                          TTC / 24h convenue
                        </span>
                      </td>

                      <td className="py-3.5 px-4 bg-amber-50/30">
                        <div className="relative">
                          <input
                            type="number"
                            step="500"
                            min="500"
                            value={cat.overstayRate}
                            onChange={(e) => handleStorageFieldChange(cat.id, 'overstayRate', Number(e.target.value))}
                            className="w-full pr-12 p-2 text-xs font-mono font-extrabold text-amber-900 bg-amber-50/70 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-amber-700">
                            FCFA
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-amber-800 font-semibold mt-0.5">
                          <span>+{(cat.overstayRate - cat.dailyRate).toLocaleString('fr-FR')} FCFA</span>
                          <span className="text-amber-600">
                            (+{Math.round(((cat.overstayRate - cat.dailyRate) / (cat.dailyRate || 1)) * 100)}%)
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleCategoryEnabled(cat.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            cat.enabled
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {cat.enabled ? 'Actif' : 'Désactivé'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveStorageCategory(cat)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-indigo-200"
                            title="Sauvegarder ce tarif"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Sauver</span>
                          </button>
                          {cat.id.startsWith('cat_custom_') && (
                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer cette catégorie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: RENTAL VEHICLE PRICING */}
      {/* ========================================================================= */}
      {activeSubTab === 'rental' && (
        <div className="space-y-4">
          <div className="bg-teal-50/80 border border-teal-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
                <Car className="w-5 h-5" />
              </div>
              <div className="text-xs text-teal-950">
                <span className="font-bold text-teal-900 block text-sm">
                  Tarification Flotte Automobile de Location JMF
                </span>
                <p className="mt-0.5 text-teal-800 leading-relaxed">
                  Modifiez les tarifs jour, semaine, mois, la caution obligatoire (Franchise) et le forfait chauffeur dédié. Les calculatrices de la page de location s'ajustent automatiquement.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveAllRental}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Flotte</span>
              </button>
            </div>
          </div>

          {/* Rental Fleet Pricing Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-60">Véhicule & Immatriculation</th>
                    <th className="py-3 px-3">Catégorie</th>
                    <th className="py-3 px-3 w-36">Tarif Jour (FCFA)</th>
                    <th className="py-3 px-3 w-36">Tarif Semaine (FCFA)</th>
                    <th className="py-3 px-3 w-36">Tarif Mois (FCFA)</th>
                    <th className="py-3 px-3 w-32">Caution (FCFA)</th>
                    <th className="py-3 px-3 w-32">Chauffeur/j (FCFA)</th>
                    <th className="py-3 px-3">Disponibilité</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRental.map((veh) => (
                    <tr key={veh.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {veh.brand} {veh.model}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1 mt-0.5">
                          <span className="px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 border border-slate-200">
                            {veh.plateNumber}
                          </span>
                          <span>• {veh.year}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {veh.category}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="1000"
                          value={veh.dailyRateFcfa}
                          onChange={(e) => handleRentalFieldChange(veh.id, 'dailyRateFcfa', Number(e.target.value))}
                          className="w-full p-1.5 font-mono font-bold text-slate-900 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="5000"
                          value={veh.weeklyRateFcfa}
                          onChange={(e) => handleRentalFieldChange(veh.id, 'weeklyRateFcfa', Number(e.target.value))}
                          className="w-full p-1.5 font-mono text-slate-800 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="10000"
                          value={veh.monthlyRateFcfa}
                          onChange={(e) => handleRentalFieldChange(veh.id, 'monthlyRateFcfa', Number(e.target.value))}
                          className="w-full p-1.5 font-mono text-slate-800 bg-white border border-slate-200 rounded-lg text-xs"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="10000"
                          value={veh.depositFcfa}
                          onChange={(e) => handleRentalFieldChange(veh.id, 'depositFcfa', Number(e.target.value))}
                          className="w-full p-1.5 font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <input
                          type="number"
                          step="1000"
                          value={veh.driverDailyFeeFcfa}
                          onChange={(e) => handleRentalFieldChange(veh.id, 'driverDailyFeeFcfa', Number(e.target.value))}
                          className="w-full p-1.5 font-mono text-slate-800 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </td>

                      <td className="py-3 px-3">
                        <button
                          onClick={() => {
                            const updated = { ...veh, isAvailable: !veh.isAvailable };
                            handleSaveRentalVehicle(updated);
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                            veh.isAvailable
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {veh.isAvailable ? 'Disponible' : 'Indisponible'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleSaveRentalVehicle(veh)}
                          className="px-2.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-teal-200 ml-auto"
                          title="Enregistrer ce véhicule"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Sauver</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2.5: FORMULES GESTION DE FLOTTE 360°                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'fleet360' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-sky-100 text-sky-800 rounded-lg shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs text-sky-950">
                <span className="font-bold text-sky-900 block text-sm">
                  Grille des 5 Formules de Gestion de Flotte 360°
                </span>
                Modifiez les tarifs mensuels et frais d'installation. Les montants s'ajustent automatiquement sur le comparateur public, le configurateur et le formulaire de devis.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResetTarget('fleet');
                  setIsResetModalOpen(true);
                }}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Rétablir les tarifs officiels des packs flotte"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Rétablir Défaut</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAllFleet}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                title="Enregistrer toutes les formules"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer Tout ({fleetPackages.length})</span>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFleetPackages.map((pack) => (
              <div
                key={pack.id}
                className={`bg-white rounded-2xl border transition-all shadow-xs flex flex-col justify-between overflow-hidden ${
                  pack.isPopular
                    ? 'border-sky-500 ring-2 ring-sky-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header with gradient strip */}
                <div className={`p-4 bg-gradient-to-r ${pack.accentColor} text-white`}>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold bg-black/20 px-2 py-0.5 rounded">
                      {pack.shortName}
                    </span>
                    {pack.badge && (
                      <span className="text-[10px] font-bold bg-white text-slate-900 px-2 py-0.5 rounded-full shadow-xs">
                        {pack.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black tracking-tight">{pack.name}</h3>
                  <p className="text-xs text-white/80 mt-1 line-clamp-2">{pack.description}</p>
                </div>

                {/* Form fields */}
                <div className="p-4 space-y-3.5 flex-1 text-xs">
                  {/* Monthly price */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tarif Mensuel (FCFA / mois) :
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={pack.monthlyPriceNumeric}
                        onChange={(e) =>
                          handleFleetFieldChange(pack.id, 'monthlyPriceNumeric', Number(e.target.value))
                        }
                        className="w-full pr-12 p-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-sky-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Setup fee */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Frais de mise en service / Setup (FCFA) :
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="5000"
                        min="0"
                        value={pack.setupFeeNumeric || 0}
                        onChange={(e) =>
                          handleFleetFieldChange(pack.id, 'setupFeeNumeric', Number(e.target.value))
                        }
                        className="w-full pr-12 p-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-sky-500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        FCFA
                      </span>
                    </div>
                  </div>

                  {/* Fleet size */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tranche de flotte recommandée :
                    </label>
                    <input
                      type="text"
                      value={pack.fleetSize}
                      onChange={(e) =>
                        handleFleetFieldChange(pack.id, 'fleetSize', e.target.value)
                      }
                      className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-sky-500"
                    />
                  </div>

                  {/* Services list (read-only) */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Services inclus :
                    </span>
                    <ul className="space-y-1">
                      {pack.services.map((svc, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{svc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card footer actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFleetPackEnabled(pack.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                      pack.enabled !== false
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {pack.enabled !== false ? '● Visible' : '○ Masqué'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveFleetPackage(pack)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs shadow-xs"
                    title="Enregistrer cette formule"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Sauvegarder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2.8: GRILLE TARIFAIRE PRO BÉNIN (UTILITAIRES, PL, ENGINS)         */}
      {/* ========================================================================= */}
      {activeSubTab === 'proGrid' && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-teal-50/80 border border-teal-200 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 text-teal-800 rounded-lg shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="text-xs text-teal-950">
                <span className="font-bold text-teal-900 block text-sm">
                  Grille Tarifaire Professionnelle — Gestion Administrative &amp; Planification de Flotte (Bénin)
                </span>
                Modifiez les tarifs unitaires mensuels, les packs (Starter, Business, Premium) pour Utilitaires, Poids lourds et Engins de chantier, ainsi que les prestations complémentaires.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setResetTarget('proGrid');
                  setIsResetModalOpen(true);
                }}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Rétablir Défaut</span>
              </button>

              <button
                type="button"
                onClick={handleSaveProTariffGrid}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Enregistrer la Grille Pro</span>
              </button>
            </div>
          </div>

          {/* 1. Tarification unitaire mensuelle */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              1. Tarification unitaire mensuelle (FCFA)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {proTariffGrid.unitRates.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                >
                  <div className="font-bold text-slate-900">{u.category}</div>
                  <div className="text-[11px] text-slate-500">{u.observations}</div>
                  <div className="relative">
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={u.monthlyRateNumeric}
                      onChange={(e) => handleProUnitRateChange(u.id, Number(e.target.value))}
                      className="w-full pr-20 p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                      FCFA/{u.unitLabel}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2, 3, 4. Packs par catégorie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[
              { type: 'UTILITAIRE', title: '2. Packs Véhicules Utilitaires' },
              { type: 'POIDS_LOURD', title: '3. Packs Poids Lourds' },
              { type: 'ENGIN', title: '4. Packs Engins de Chantier' },
            ].map((group) => (
              <div
                key={group.type}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4"
              >
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">
                  {group.title}
                </h3>
                <div className="space-y-3">
                  {proTariffGrid.categoryPacks
                    .filter((p) => p.equipmentType === group.type)
                    .map((pack) => (
                      <div
                        key={pack.id}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-teal-800">{pack.packName}</span>
                          <span className="text-[11px] font-medium text-slate-600">
                            {pack.fleetScope}
                          </span>
                        </div>
                        <div className="relative">
                          <input
                            type="number"
                            step="5000"
                            min="0"
                            value={pack.monthlyFeeNumeric}
                            onChange={(e) =>
                              handleProPackFeeChange(pack.id, Number(e.target.value))
                            }
                            className="w-full pr-20 p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            FCFA / mois
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {pack.includedServices}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* 5. Options et prestations complémentaires */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              5. Options et prestations complémentaires
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {proTariffGrid.complementaryOptions.map((opt) => (
                <div
                  key={opt.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <span className="font-bold text-slate-800">{opt.name}</span>
                  <input
                    type="text"
                    value={opt.indicativeRate}
                    onChange={(e) => handleProOptionRateChange(opt.id, e.target.value)}
                    className="sm:w-64 p-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: OPTIONS & OVERSTAY SETTINGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Options de stockage */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
                <Sliders className="w-4 h-4" />
                <span>Tarifs des Prestations Annexes (Centre de Stockage)</span>
              </div>
              <p className="text-xs text-slate-500">
                Services additionnels proposés aux clients lors de la soumission de la demande d'emplacement.
              </p>

              <div className="space-y-3.5 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Option Lavage Haute Pression (Forfait / unité) :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="500"
                      value={generalSettings.washOptionRateFcfa}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, washOptionRateFcfa: Number(e.target.value) })}
                      className="w-full pr-12 p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      FCFA
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Option Maintien de Charge Batterie (Par tranche de 7 jours) :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="500"
                      value={generalSettings.batteryOptionRateFcfa}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, batteryOptionRateFcfa: Number(e.target.value) })}
                      className="w-full pr-12 p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      FCFA
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Option Bâchage Respirant Intégral (Forfait / séjour) :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="500"
                      value={generalSettings.tarpOptionRateFcfa}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, tarpOptionRateFcfa: Number(e.target.value) })}
                      className="w-full pr-12 p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      FCFA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Règles de Dépassement Contractuel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Règles de Franchise & Tolérance de Dépassement</span>
              </div>
              <p className="text-xs text-slate-500">
                Paramétrage juridique et opérationnel appliqué dès l'expiration de la date et heure de sortie convenue.
              </p>

              <div className="space-y-3.5 pt-2 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Délai de Grâce / Tolérance après l'heure de sortie :
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={generalSettings.graceHours}
                      onChange={(e) => setGeneralSettings({ ...generalSettings, graceHours: Number(e.target.value) })}
                      className="w-full pr-16 p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      Heure(s)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Ex: 2 heures de tolérance avant que le premier jour supplémentaire ne soit déclenché.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    WhatsApp Exploitation pour Alertes Retards / Devis :
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.managerWhatsApp}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, managerWhatsApp: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-bold"
                    placeholder="+229 01 97 83 21 21"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Email Direction Opérationnelle :
                  </label>
                  <input
                    type="email"
                    value={generalSettings.managerNoticeEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, managerNoticeEmail: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono font-semibold"
                    placeholder="direction@jmf-mobility.com"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Sauvegarder les Paramètres Généraux</span>
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 4: PRICING AUDIT LOGS */}
      {/* ========================================================================= */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-slate-900 block text-sm">
                Traçabilité & Historique des Mises à Jour Tarifaires
              </span>
              <span className="text-slate-500">
                Conforme aux normes ISO 9001 et aux politiques internes de contrôle de gestion JMF Mobility.
              </span>
            </div>
            <button
              onClick={() => pricingService.clearAuditLogs()}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-rose-200 font-bold"
            >
              Effacer l'historique
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-44">Date & Heure</th>
                    <th className="py-3 px-4 w-52">Auteur / Administrateur</th>
                    <th className="py-3 px-3 w-32">Élément Modifié</th>
                    <th className="py-3 px-4">Détail des Changements</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.user}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {log.itemName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                        {log.changeDescription}
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        Aucun historique de modification pour l'instant.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL : CREATE NEW STORAGE CATEGORY */}
      {isNewCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Warehouse className="w-4 h-4 text-amber-400" />
                <span>Nouveau Gabarit d'Emplacement de Stockage</span>
              </div>
              <button
                onClick={() => setIsNewCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewCategory} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Nom du Gabarit / Type d'Engin *
                </label>
                <input
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                  placeholder="Ex: Porte-Engin & Machinerie Minière"
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Surface allouée</label>
                  <input
                    type="text"
                    value={newCat.surface}
                    onChange={(e) => setNewCat({ ...newCat, surface: e.target.value })}
                    placeholder="Ex: 40 m²"
                    className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tarif Normal / Jour (FCFA) *</label>
                  <input
                    type="number"
                    step="500"
                    required
                    value={newCat.dailyRate}
                    onChange={(e) => setNewCat({ ...newCat, dailyRate: Number(e.target.value) })}
                    className="w-full p-2.5 border border-slate-200 rounded-lg font-mono focus:border-indigo-600 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-900 font-bold mb-1">
                  Tarif Dépassement Journalier / Retard (FCFA) *
                </label>
                <input
                  type="number"
                  step="500"
                  required
                  value={newCat.overstayRate}
                  onChange={(e) => setNewCat({ ...newCat, overstayRate: Number(e.target.value) })}
                  className="w-full p-2.5 border border-amber-300 bg-amber-50 rounded-lg font-mono font-bold focus:border-amber-600 focus:outline-hidden"
                />
                <span className="text-[11px] text-amber-800 mt-0.5 block">
                  Facturation journalière contractuelle supplémentaire en cas de non-retrait.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description technique & sécurité</label>
                <textarea
                  rows={2}
                  value={newCat.description}
                  onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                  placeholder="Ex: Emplacement renforcé avec zone d'amarrage et vigile dédié..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:border-indigo-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  Ajouter à la grille
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL : RESET CONFIRMATION */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600 font-bold text-sm">
              <RotateCcw className="w-5 h-5" />
              <span>Confirmer la réinitialisation des tarifs</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voulez-vous rétablir les tarifs d'origine certifiés pour les emplacements de stockage, la flotte de location et les formules de gestion de flotte 360° ? Vos personnalisations actuelles seront remplacées par le barème standard certifié JMF Mobility.
            </p>
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 text-xs cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-sm text-xs cursor-pointer"
              >
                Oui, réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
