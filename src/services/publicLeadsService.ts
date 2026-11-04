export type LeadType = 'DEVIS_FLOTTE' | 'STOCKAGE' | 'RDV_DIAGNOSTIC' | 'QUESTION_FAQ';
export type LeadStatus = 'NOUVEAU' | 'EN_COURS' | 'TRAITE';

export interface PublicLeadRecord {
  id: string;
  ref: string;
  createdAt: string;
  type: LeadType;
  clientName: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  fleetSize?: string;
  currency?: string;
  notes?: string;
  status: LeadStatus;
}

const STORAGE_KEY = 'jmf_public_leads_v1';

const INITIAL_LEADS: PublicLeadRecord[] = [
  {
    id: 'lead-101',
    ref: 'JMF-2026-4812',
    createdAt: '2026-04-06 09:42',
    type: 'DEVIS_FLOTTE',
    clientName: 'M. Kossi Ahouandjinou',
    company: 'Trans-Bénin Logistique SA',
    phone: '+229 01 97 44 12 80',
    email: 'k.ahouandjinou@transbenin.bj',
    service: 'Pack Contrôle Carburant & Jauge Capacitive',
    fleetSize: '15 camions citerne / tracteurs',
    currency: 'FCFA',
    notes: 'Corridor Cotonou – Parakou – Niamey. Souhaite calibration sur site à Vodjè.',
    status: 'NOUVEAU',
  },
  {
    id: 'lead-102',
    ref: 'JMF-2026-3905',
    createdAt: '2026-04-05 16:18',
    type: 'DEVIS_FLOTTE',
    clientName: 'M. Ibrahima Ndiaye',
    company: 'Teranga Fret & Distribution',
    phone: '+221 77 612 90 34',
    email: 'direction@terangafret.sn',
    service: 'Pack Sécurité Avancée + Caméra IA DMS',
    fleetSize: '22 véhicules utilitaires & PL',
    currency: 'FCFA',
    notes: 'Déploiement progressif Dakar – Bamako. Demande proforma et démonstration.',
    status: 'EN_COURS',
  },
  {
    id: 'lead-103',
    ref: 'JMF-STO-2026-119',
    createdAt: '2026-04-04 11:05',
    type: 'STOCKAGE',
    clientName: 'Mme Clarisse Soglo',
    company: 'Cotonou Import-Export',
    phone: '+229 01 96 11 08 55',
    email: 'c.soglo@cotonou-impex.com',
    service: 'Box de stockage sécurisé (Moyen — 8 à 10 m²)',
    fleetSize: 'Durée : 3 mois',
    currency: 'FCFA',
    notes: 'Stockage de pièces détachées et équipements sous vidéosurveillance 24h/24.',
    status: 'TRAITE',
  },
];

export const publicLeadsService = {
  getLeads(): PublicLeadRecord[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
        return INITIAL_LEADS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  },

  addLead(lead: Omit<PublicLeadRecord, 'id' | 'createdAt' | 'status'>): PublicLeadRecord {
    const current = this.getLeads();
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newRecord: PublicLeadRecord = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: formattedDate,
      status: 'NOUVEAU',
    };

    const updated = [newRecord, ...current];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors
    }
    return newRecord;
  },

  updateStatus(id: string, status: LeadStatus): PublicLeadRecord[] {
    const current = this.getLeads();
    const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
    return updated;
  },

  deleteLead(id: string): PublicLeadRecord[] {
    const current = this.getLeads();
    const updated = current.filter((item) => item.id !== id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
    return updated;
  },

  exportToCsv(leads: PublicLeadRecord[]): void {
    const headers = [
      'Reference',
      'Date',
      'Type',
      'Statut',
      'Client / Interlocuteur',
      'Societe',
      'Telephone / WhatsApp',
      'Email',
      'Offre / Formule',
      'Volume / Detail',
      'Devise',
      'Notes',
    ];

    const escapeCsv = (val?: string) => {
      if (!val) return '""';
      const cleaned = String(val).replace(/"/g, '""').replace(/\r?\n/g, ' ');
      return `"${cleaned}"`;
    };

    const rows = leads.map((l) =>
      [
        escapeCsv(l.ref),
        escapeCsv(l.createdAt),
        escapeCsv(l.type),
        escapeCsv(l.status),
        escapeCsv(l.clientName),
        escapeCsv(l.company),
        escapeCsv(l.phone),
        escapeCsv(l.email),
        escapeCsv(l.service),
        escapeCsv(l.fleetSize || ''),
        escapeCsv(l.currency || 'FCFA'),
        escapeCsv(l.notes || ''),
      ].join(';')
    );

    // UTF-8 BOM for direct opening in Microsoft Excel with French accents preserved
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `JMF-Mobility-Demandes-Devis-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  },
};
