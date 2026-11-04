import React, { useState } from 'react';
import {
  UserCheck,
  UserPlus,
  Shield,
  Smartphone,
  Car,
  Briefcase,
  X,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { localDb } from '../../services/localDb.js';
import { RoleId } from '../../types/index.js';

interface TestAccountCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreatedAndLogin?: (email: string, pass: string) => void;
}

interface TestRoleOption {
  role: RoleId;
  label: string;
  category: string;
  badge: string;
  badgeColor: string;
  defaultFirstName: string;
  defaultLastName: string;
  defaultEmailPrefix: string;
  description: string;
  icon: string;
}

const TEST_ROLES: TestRoleOption[] = [
  {
    role: 'DRIVER',
    label: 'Conducteur / Chauffeur',
    category: 'Terrain & Mobile',
    badge: 'App Mobile Conducteur',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    defaultFirstName: 'Pierre',
    defaultLastName: 'Dossou',
    defaultEmailPrefix: 'conducteur.test',
    description: 'Accès direct à l’application mobile JMF Driver : saisie des kilomètres réels, pleins de carburant, signalement de pannes.',
    icon: '🚗',
  },
  {
    role: 'FLEET_MANAGER',
    label: 'Gestionnaire de Flotte (Fleet Manager)',
    category: 'Opérationnel',
    badge: 'Opérations & Télématique',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
    defaultFirstName: 'Koffi',
    defaultLastName: 'Aman',
    defaultEmailPrefix: 'manager.flotte',
    description: 'Gestion des missions de véhicules, planification d’entretiens, suivi carburant et géolocalisation de la flotte.',
    icon: '📊',
  },
  {
    role: 'COMPANY_ADMIN',
    label: 'Administrateur Entreprise (SARL Client)',
    category: 'Direction Flotte',
    badge: 'Gestion Client Globale',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    defaultFirstName: 'Jean',
    defaultLastName: 'Kouassi',
    defaultEmailPrefix: 'admin.entreprise',
    description: 'Supervision complète de l’entreprise cliente : factures, contrats, conducteurs, inventaire véhicules et devis.',
    icon: '🏢',
  },
  {
    role: 'CLIENT',
    label: 'Client Particulier / Entreprise Loueur',
    category: 'Client & Particulier',
    badge: 'Location & SMS',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    defaultFirstName: 'Martin',
    defaultLastName: 'Adjovi',
    defaultEmailPrefix: 'client.test',
    description: 'Consultation du catalogue de location, génération de devis PDF avec calcul des acomptes et suivi SMS personnalisé.',
    icon: '👤',
  },
  {
    role: 'SUPER_ADMIN_JMF',
    label: 'Super Administrateur JMF Mobility (Global)',
    category: 'Gouvernance JMF',
    badge: 'Droits Total & Multi-Tenant',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    defaultFirstName: 'Admin',
    defaultLastName: 'Superviseur',
    defaultEmailPrefix: 'superadmin.test',
    description: 'Accès total à toute la plateforme : console d’administration, validation des réservations, gestion de tous les clients.',
    icon: '⚡',
  },
];

export const TestAccountCreatorModal: React.FC<TestAccountCreatorModalProps> = ({
  isOpen,
  onClose,
  onAccountCreatedAndLogin,
}) => {
  const [selectedRoleIndex, setSelectedRoleIndex] = useState<number>(0);
  const [firstName, setFirstName] = useState<string>(TEST_ROLES[0].defaultFirstName);
  const [lastName, setLastName] = useState<string>(TEST_ROLES[0].defaultLastName);
  const [companyName, setCompanyName] = useState<string>('Test SARL & Partenaires');
  const [phone, setPhone] = useState<string>('+229 97 00 12 34');
  const [customEmail, setCustomEmail] = useState<string>(
    `${TEST_ROLES[0].defaultEmailPrefix}.${Math.floor(Math.random() * 900 + 100)}@test-jmf.com`
  );
  const [password, setPassword] = useState<string>('test2026');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAccount, setCreatedAccount] = useState<{ email: string; pass: string; role: RoleId } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentRole = TEST_ROLES[selectedRoleIndex];

  const handleSelectRole = (index: number) => {
    setSelectedRoleIndex(index);
    const r = TEST_ROLES[index];
    setFirstName(r.defaultFirstName);
    setLastName(r.defaultLastName);
    const randNum = Math.floor(Math.random() * 900 + 100);
    setCustomEmail(`${r.defaultEmailPrefix}.${randNum}@test-jmf.com`);
  };

  const handleGenerateRandom = () => {
    const randNum = Math.floor(Math.random() * 900 + 100);
    setCustomEmail(`${currentRole.defaultEmailPrefix}.${randNum}@test-jmf.com`);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const emailToRegister = customEmail.trim().toLowerCase();
      // Use localDb directly to register the user with selected role
      await localDb.register({
        email: emailToRegister,
        password: password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        company_name: companyName.trim(),
        phone: phone.trim(),
        role: currentRole.role,
      });

      setCreatedAccount({
        email: emailToRegister,
        pass: password,
        role: currentRole.role,
      });
    } catch (err: any) {
      // If user already exists, generate a fresh random suffix and retry
      const randNum = Math.floor(Math.random() * 9000 + 1000);
      const fallbackEmail = `${currentRole.defaultEmailPrefix}.${randNum}@test-jmf.com`;
      try {
        await localDb.register({
          email: fallbackEmail,
          password: password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          company_name: companyName.trim(),
          phone: phone.trim(),
          role: currentRole.role,
        });
        setCreatedAccount({
          email: fallbackEmail,
          pass: password,
          role: currentRole.role,
        });
      } catch (retryErr) {
        alert('Erreur lors de la création du compte test. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdAccount) return;
    navigator.clipboard.writeText(`Email: ${createdAccount.email}\nMot de passe: ${createdAccount.pass}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectNow = () => {
    if (createdAccount && onAccountCreatedAndLogin) {
      onAccountCreatedAndLogin(createdAccount.email, createdAccount.pass);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-2xl shadow-inner">
              🧪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/30">
                  Créateur de Comptes Test & Sandbox
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Créer un Compte Test Personnalisé
              </h2>
              <p className="text-xs text-slate-300">
                Créez vous-même des comptes tests sur-mesure (Conducteur, Client, Manager, Admin) pour explorer toutes les fonctionnalités.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
          {createdAccount ? (
            /* Success confirmation screen */
            <div className="space-y-5 text-center py-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                🎉
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Compte Test Créé avec Succès !</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Votre compte de test est prêt et persistant. Vous pouvez vous y connecter dès maintenant.
                </p>
              </div>

              {/* Account summary card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2.5 max-w-md mx-auto text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">Rôle assigné :</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${currentRole.badgeColor}`}>
                    {currentRole.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Email identifiant :</span>
                  <span className="font-mono font-bold text-slate-900">{createdAccount.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Mot de passe :</span>
                  <span className="font-mono font-bold text-slate-900">{createdAccount.pass}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copié dans le presse-papier !' : 'Copier les identifiants'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleConnectNow}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/25 transition flex items-center justify-center gap-1.5"
                >
                  <span>Se connecter immédiatement avec ce compte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleCreateAccount} className="space-y-4">
              {/* Step 1: Select Role */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  1. Choisissez le rôle à tester :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {TEST_ROLES.map((r, idx) => {
                    const isSelected = selectedRoleIndex === idx;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => handleSelectRole(idx)}
                        className={`p-3 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-2.5 relative ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50/80 ring-2 ring-sky-500/30'
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">{r.icon}</span>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {r.label}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {r.badge}
                          </div>
                        </div>
                        {isSelected && (
                          <span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Role Details callout */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Mission du rôle : </span>
                  <span>{currentRole.description}</span>
                </div>
              </div>

              {/* Step 2: Account Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  2. Informations d'identification :
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Prénom</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-semibold focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Nom de famille</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-semibold focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-600">Adresse e-mail du compte test</label>
                    <button
                      type="button"
                      onClick={handleGenerateRandom}
                      className="text-[10px] text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Régénérer
                    </button>
                  </div>
                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Mot de passe de test</label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-mono font-semibold focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Entreprise rattachée</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-xs font-semibold focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-sky-600/25 transition flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Création du compte test en cours...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Créer ce compte test et générer les accès</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Stockage local persistant garanti (localStorage)
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
