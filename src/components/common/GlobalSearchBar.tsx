import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Car,
  User,
  FileText,
  X,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { localDb } from '../../services/localDb.js';

export interface GlobalSearchBarProps {
  onNavigateView?: (view: string) => void;
  onSelectVehicle?: (vehicleId: string) => void;
  placeholder?: string;
  className?: string;
}

export type SearchCategory = 'all' | 'vehicles' | 'drivers' | 'documents';

interface VehicleSearchResult {
  type: 'vehicle';
  id: string;
  title: string; // e.g. Peugeot 3008 Allure
  subtitle: string; // e.g. BJ-1234-CD • VP • 56 780 km
  registration: string;
  status: string;
  driverName?: string;
  siteName?: string;
  category: string;
}

interface DriverSearchResult {
  type: 'driver';
  id: string;
  title: string; // e.g. Pierre DOSSOU
  subtitle: string; // e.g. CHAUF-001 • Permis B, C • Peugeot 3008
  matricule: string;
  phone: string;
  status: string;
  assignedVehicle?: string;
  site: string;
}

interface DocumentSearchResult {
  type: 'document';
  id: string;
  title: string; // e.g. Assurance - BJ-1234-CD
  subtitle: string; // e.g. POL-NSIA-2025-089 • NSIA Assurances
  docType: string;
  docNumber: string;
  vehicleReg: string;
  expiryDate: string;
  daysLeft: number;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
}

type SearchResultItem = VehicleSearchResult | DriverSearchResult | DocumentSearchResult;

// Comprehensive document index for global instant search
const GLOBAL_DOCUMENTS_INDEX = [
  {
    id: 'doc_1',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'ASSURANCE',
    document_number: 'POL-NSIA-2025-089',
    issuer: 'NSIA Assurances Bénin',
    issue_date: '2025-09-30',
    expiry_date: '2026-09-30',
    days_left: 9,
    status: 'EXPIRING_SOON' as const,
  },
  {
    id: 'doc_2',
    vehicle_reg: 'BJ-5678-EF',
    vehicle_model: 'Renault Master Fourgon',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2025-4412',
    issuer: 'Centre de Contrôle Technique Agréé',
    issue_date: '2025-03-15',
    expiry_date: '2026-03-15',
    days_left: -189,
    status: 'EXPIRED' as const,
  },
  {
    id: 'doc_3',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'CARTE_GRISE',
    document_number: 'CG-ANATT-2024-9912',
    issuer: 'ANaTT Bénin (Agence Nationale des Transports Terrestres)',
    issue_date: '2024-01-10',
    expiry_date: '2029-01-10',
    days_left: 842,
    status: 'VALID' as const,
  },
  {
    id: 'doc_4',
    vehicle_reg: 'BJ-3456-IJ',
    vehicle_model: 'Iveco Daily 35S16 Frigo',
    type: 'ASSURANCE',
    document_number: 'POL-SANLAM-2025-612',
    issuer: 'Sanlam Bénin',
    issue_date: '2025-09-18',
    expiry_date: '2026-09-18',
    days_left: -3,
    status: 'EXPIRED' as const,
  },
  {
    id: 'doc_5',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    type: 'TVM',
    document_number: 'TVM-DGI-2026-0045',
    issuer: 'Direction Générale des Impôts (DGI Bénin)',
    issue_date: '2026-01-05',
    expiry_date: '2027-01-05',
    days_left: 106,
    status: 'VALID' as const,
  },
  {
    id: 'doc_6',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'EXTINCTEUR',
    document_number: 'EXT-SIC-2025-110',
    issuer: 'Sécurité Incendie Cotonou (SIC)',
    issue_date: '2025-10-01',
    expiry_date: '2026-10-01',
    days_left: 10,
    status: 'EXPIRING_SOON' as const,
  },
  {
    id: 'doc_7',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'ASSURANCE',
    document_number: 'POL-ATL-2025-778',
    issuer: 'Atlantique Assurances Bénin',
    issue_date: '2025-11-15',
    expiry_date: '2026-11-15',
    days_left: 55,
    status: 'VALID' as const,
  },
  {
    id: 'doc_8',
    vehicle_reg: 'BJ-7890-KL',
    vehicle_model: 'Hyundai Santa Fe 2.2',
    type: 'ASSURANCE',
    document_number: 'POL-NSIA-2025-341',
    issuer: 'NSIA Assurances Bénin',
    issue_date: '2025-12-01',
    expiry_date: '2026-12-01',
    days_left: 71,
    status: 'VALID' as const,
  },
  {
    id: 'doc_9',
    vehicle_reg: 'BJ-1234-CD',
    vehicle_model: 'Peugeot 3008 Allure',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2026-1089',
    issuer: 'Centre de Contrôle Technique Agréé',
    issue_date: '2025-10-10',
    expiry_date: '2026-10-10',
    days_left: 19,
    status: 'EXPIRING_SOON' as const,
  },
  {
    id: 'doc_10',
    vehicle_reg: 'BJ-9012-GH',
    vehicle_model: 'Toyota Hilux 4x4',
    type: 'VISITE_TECHNIQUE',
    document_number: 'CNSR-COT-2026-3021',
    issuer: 'Centre de Contrôle Technique Agréé',
    issue_date: '2025-11-20',
    expiry_date: '2026-11-20',
    days_left: 60,
    status: 'VALID' as const,
  },
];

// Drivers catalog index for global search
const GLOBAL_DRIVERS_INDEX = [
  {
    id: 'drv_1',
    matricule: 'CHAUF-001',
    name: 'Pierre DOSSOU',
    phone: '+229 97 12 34 56',
    email: 'p.dossou@societe-cliente.bj',
    site: 'Siège Administratif (Marina)',
    license_number: 'PC-BEN-2018-9941',
    license_category: 'B, C',
    assigned_vehicle_reg: 'BJ-1234-CD',
    assigned_vehicle_model: 'Peugeot 3008 Allure',
    status: 'ACTIVE',
  },
  {
    id: 'drv_2',
    matricule: 'CHAUF-002',
    name: 'Koffi AMAN',
    phone: '+229 96 23 45 67',
    email: 'k.aman@societe-cliente.bj',
    site: 'Agence Port de Cotonou',
    license_number: 'PC-BEN-2016-4321',
    license_category: 'B, C, D',
    assigned_vehicle_reg: 'BJ-5678-EF',
    assigned_vehicle_model: 'Renault Master Fourgon',
    status: 'ACTIVE',
  },
  {
    id: 'drv_3',
    matricule: 'CHAUF-003',
    name: 'Mathieu KPADONOU',
    phone: '+229 95 34 56 78',
    email: 'm.kpadonou@societe-cliente.bj',
    site: 'Hub Logistique Central',
    license_number: 'PC-BEN-2020-1120',
    license_category: 'B',
    assigned_vehicle_reg: 'BJ-9012-GH',
    assigned_vehicle_model: 'Toyota Hilux 4x4 Légende',
    status: 'ACTIVE',
  },
  {
    id: 'drv_4',
    matricule: 'CHAUF-004',
    name: 'Michel HOUNGBO',
    phone: '+229 97 45 67 89',
    email: 'm.houngbo@societe-cliente.bj',
    site: 'Base Opérationnelle Portuaire',
    license_number: 'PC-BEN-2015-8832',
    license_category: 'B, C, E',
    assigned_vehicle_reg: 'BJ-3456-IJ',
    assigned_vehicle_model: 'Iveco Daily 35S16 Frigo',
    status: 'ACTIVE',
  },
  {
    id: 'drv_5',
    matricule: 'CHAUF-005',
    name: 'Jean KOUASSI',
    phone: '+229 97 00 11 22',
    email: 'j.kouassi@societe-cliente.bj',
    site: 'Direction Générale (Ganhi)',
    license_number: 'PC-BEN-2019-3388',
    license_category: 'B',
    assigned_vehicle_reg: 'BJ-7890-KL',
    assigned_vehicle_model: 'Hyundai Santa Fe 2.2',
    status: 'ACTIVE',
  },
  {
    id: 'drv_6',
    matricule: 'CHAUF-006',
    name: 'Marc ALLAGBE',
    phone: '+229 95 11 22 33',
    email: 'm.allagbe@bollore.bj',
    site: 'Base Portuaire Bolloré',
    license_number: 'PC-BEN-2014-5501',
    license_category: 'C, D, E',
    assigned_vehicle_reg: 'BJ-9999-ZZ',
    assigned_vehicle_model: 'Mercedes-Benz Actros 3340',
    status: 'ACTIVE',
  },
];

export const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  onNavigateView,
  onSelectVehicle,
  placeholder = 'Rechercher un véhicule, conducteur ou document...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey Ctrl+K / Cmd+K to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close results dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live indexed search calculation
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { vehicles: [], drivers: [], documents: [], total: 0, items: [] as SearchResultItem[] };
    }

    // 1. Vehicles
    const vehiclesData = localDb.getVehicles().data;
    const matchedVehicles: VehicleSearchResult[] = vehiclesData
      .filter((v) => {
        return (
          v.registration_number.toLowerCase().includes(trimmed) ||
          v.brand.toLowerCase().includes(trimmed) ||
          v.model.toLowerCase().includes(trimmed) ||
          (v.category && v.category.toLowerCase().includes(trimmed)) ||
          (v.driver && v.driver.name.toLowerCase().includes(trimmed)) ||
          (v.site && v.site.name.toLowerCase().includes(trimmed))
        );
      })
      .slice(0, 6)
      .map((v) => ({
        type: 'vehicle' as const,
        id: v.id,
        title: `${v.brand} ${v.model}`,
        subtitle: `${v.registration_number} • ${v.category || 'Flotte'} • ${v.current_mileage.toLocaleString()} km`,
        registration: v.registration_number,
        status: v.status,
        driverName: v.driver?.name,
        siteName: v.site?.name,
        category: v.category || 'Véhicule',
      }));

    // 2. Drivers
    const matchedDrivers: DriverSearchResult[] = GLOBAL_DRIVERS_INDEX.filter((d) => {
      return (
        d.name.toLowerCase().includes(trimmed) ||
        d.matricule.toLowerCase().includes(trimmed) ||
        d.phone.toLowerCase().includes(trimmed) ||
        d.license_number.toLowerCase().includes(trimmed) ||
        d.assigned_vehicle_reg.toLowerCase().includes(trimmed) ||
        d.assigned_vehicle_model.toLowerCase().includes(trimmed) ||
        d.site.toLowerCase().includes(trimmed)
      );
    })
      .slice(0, 6)
      .map((d) => ({
        type: 'driver' as const,
        id: d.id,
        title: d.name,
        subtitle: `${d.matricule} • Permis ${d.license_category} • ${d.assigned_vehicle_model}`,
        matricule: d.matricule,
        phone: d.phone,
        status: d.status,
        assignedVehicle: `${d.assigned_vehicle_model} (${d.assigned_vehicle_reg})`,
        site: d.site,
      }));

    // 3. Documents
    const matchedDocuments: DocumentSearchResult[] = GLOBAL_DOCUMENTS_INDEX.filter((doc) => {
      const typeLabel = doc.type.replace('_', ' ');
      return (
        doc.document_number.toLowerCase().includes(trimmed) ||
        doc.vehicle_reg.toLowerCase().includes(trimmed) ||
        doc.vehicle_model.toLowerCase().includes(trimmed) ||
        doc.issuer.toLowerCase().includes(trimmed) ||
        typeLabel.toLowerCase().includes(trimmed)
      );
    })
      .slice(0, 6)
      .map((doc) => ({
        type: 'document' as const,
        id: doc.id,
        title: `${doc.type.replace('_', ' ')} • ${doc.vehicle_reg}`,
        subtitle: `${doc.document_number} • ${doc.issuer}`,
        docType: doc.type,
        docNumber: doc.document_number,
        vehicleReg: doc.vehicle_reg,
        expiryDate: doc.expiry_date,
        daysLeft: doc.days_left,
        status: doc.status,
      }));

    // Grouped items based on active category filter
    let items: SearchResultItem[] = [];
    if (selectedCategory === 'all') {
      items = [...matchedVehicles, ...matchedDrivers, ...matchedDocuments];
    } else if (selectedCategory === 'vehicles') {
      items = matchedVehicles;
    } else if (selectedCategory === 'drivers') {
      items = matchedDrivers;
    } else if (selectedCategory === 'documents') {
      items = matchedDocuments;
    }

    const total = matchedVehicles.length + matchedDrivers.length + matchedDocuments.length;

    return {
      vehicles: matchedVehicles,
      drivers: matchedDrivers,
      documents: matchedDocuments,
      total,
      items,
    };
  }, [query, selectedCategory]);

  const handleSelectItem = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');

    if (item.type === 'vehicle') {
      if (onSelectVehicle) {
        onSelectVehicle(item.id);
      } else if (onNavigateView) {
        onNavigateView('fleet_all');
      }
    } else if (item.type === 'driver') {
      if (onNavigateView) {
        onNavigateView('drivers_list');
      }
    } else if (item.type === 'document') {
      if (onNavigateView) {
        onNavigateView('docs_all');
      }
    }
  };

  // Keyboard navigation inside list (ArrowDown, ArrowUp, Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || searchResults.items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < searchResults.items.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.items.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < searchResults.items.length) {
        handleSelectItem(searchResults.items[selectedIndex]);
      } else if (searchResults.items.length > 0) {
        handleSelectItem(searchResults.items[0]);
      }
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-sky-600" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-20 py-2 text-xs bg-slate-50/90 hover:bg-slate-100/90 focus:bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-800 placeholder:text-slate-400 shadow-2xs font-normal"
        />

        {/* Clear query or Hotkey Hint */}
        <div className="absolute right-2.5 flex items-center gap-1.5">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200/60 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white border border-slate-200 rounded shadow-2xs select-none">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      {/* Dropdown Results Overlay */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in duration-150">
          {/* Category Filter Tabs */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-b border-slate-100 text-[11px]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Tout ({searchResults.total})
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('vehicles')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'vehicles'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Car className="w-3 h-3" />
                <span>Véhicules ({searchResults.vehicles.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('drivers')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'drivers'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <User className="w-3 h-3" />
                <span>Conducteurs ({searchResults.drivers.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedCategory('documents')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedCategory === 'documents'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <FileText className="w-3 h-3" />
                <span>Documents ({searchResults.documents.length})</span>
              </button>
            </div>

            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              Entrée pour ouvrir
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-1">
            {searchResults.items.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <Search className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">Aucun résultat trouvé pour « {query} »</p>
                <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                  Essayez une immatriculation (ex: BJ-1234), un nom de chauffeur, une marque (ex: Toyota, Peugeot), ou un type de document (Assurance, Visite).
                </p>
              </div>
            ) : (
              searchResults.items.map((item, index) => {
                const isSelected = index === selectedIndex;

                if (item.type === 'vehicle') {
                  return (
                    <div
                      key={`veh_${item.id}_${index}`}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50 text-sky-900' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                          <Car className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate text-slate-900">{item.title}</span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {item.registration}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                item.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : item.status === 'available'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                            {item.driverName && (
                              <span>Conducteur : <strong>{item.driverName}</strong></span>
                            )}
                            {item.siteName && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
                                  {item.siteName}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pl-3">
                        <span className="text-[10px] font-semibold text-sky-600 hidden sm:inline">
                          Fiche véhicule
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                }

                if (item.type === 'driver') {
                  return (
                    <div
                      key={`drv_${item.id}_${index}`}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                        isSelected ? 'bg-amber-50 text-amber-950' : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold truncate text-slate-900">{item.title}</span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {item.matricule}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {item.phone}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            Affectation : <strong className="text-slate-700">{item.assignedVehicle}</strong> • {item.site}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pl-3">
                        <span className="text-[10px] font-semibold text-amber-700 hidden sm:inline">
                          Fiche conducteur
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  );
                }

                // Document item
                return (
                  <div
                    key={`doc_${item.id}_${index}`}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected ? 'bg-indigo-50 text-indigo-950' : 'hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-200">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold truncate text-slate-900">{item.title}</span>
                          <span className="font-mono text-[10px] text-slate-600">
                            {item.docNumber}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              item.status === 'VALID'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : item.status === 'EXPIRING_SOON'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {item.status === 'VALID'
                              ? 'CONFORME'
                              : item.status === 'EXPIRING_SOON'
                              ? 'ÉCHÉANCE PROCHE'
                              : 'EXPIRÉ'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate mt-0.5">
                          Échéance : <strong>{item.expiryDate}</strong> ({item.daysLeft > 0 ? `dans ${item.daysLeft} jours` : `${Math.abs(item.daysLeft)} jours dépassés`})
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-3">
                      <span className="text-[10px] font-semibold text-indigo-700 hidden sm:inline">
                        Voir conformité
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Access Footer */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateView?.('fleet_all');
                }}
                className="hover:text-sky-700 font-medium cursor-pointer"
              >
                Tous les véhicules →
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateView?.('drivers_list');
                }}
                className="hover:text-sky-700 font-medium cursor-pointer"
              >
                Tous les conducteurs →
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onNavigateView?.('docs_all');
                }}
                className="hover:text-sky-700 font-medium cursor-pointer"
              >
                Conformité & Documents →
              </button>
            </div>
            <span className="text-[10px] text-slate-400">Recherche globale JMF</span>
          </div>
        </div>
      )}
    </div>
  );
};
