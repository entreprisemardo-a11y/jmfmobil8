import React, { useState } from 'react';
import {
  Smartphone,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  ShieldCheck,
  Calendar,
  Car,
  Phone,
  RefreshCw,
  Sliders,
  Bell,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  X,
  ExternalLink,
  Info,
  ChevronRight,
  Zap,
} from 'lucide-react';

export interface MaintenanceSmsAlert {
  id: string;
  vehicle_id: string;
  vehicle_reg: string;
  vehicle_model: string;
  owner_name: string;
  owner_phone: string;
  operation_type: string;
  due_date: string;
  due_km: number;
  current_km: number;
  remaining_km: number;
  urgency: 'CRITIQUE' | 'IMMINENT' | 'ANTICIPÉ';
  estimated_cost_fcfa: number;
  workshop_recommended: string;
  sms_status: 'EN_ATTENTE' | 'ENVOYÉ_DÉLIVRÉ' | 'CONFIRMÉ_CLIENT' | 'REPORTÉ';
  last_sent_at?: string;
  custom_note?: string;
}

export interface SmsDispatchLogItem {
  id: string;
  timestamp: string;
  vehicle_reg: string;
  operation: string;
  recipient_name: string;
  recipient_phone: string;
  operator: 'MTN Bénin' | 'Moov Africa' | 'Celtiis';
  status: 'DÉLIVRÉ' | 'REÇU' | 'TRANSMIS';
  message_text: string;
  dlr_code: string;
}

const INITIAL_ALERTS: MaintenanceSmsAlert[] = [
  {
    id: 'sms_alt_1',
    vehicle_id: 'veh_particulier_prado',
    vehicle_reg: 'BJ-1122-PT',
    vehicle_model: 'Toyota Land Cruiser Prado TX-L',
    owner_name: 'Propriétaire Particulier',
    owner_phone: '+229 97 88 99 00',
    operation_type: 'Vidange moteur 5W30 synthèse + Remplacement filtre à huile & gasoil',
    due_date: '2026-09-28',
    due_km: 30000,
    current_km: 29400,
    remaining_km: 600,
    urgency: 'IMMINENT',
    estimated_cost_fcfa: 75000,
    workshop_recommended: 'Atelier Central JMF ou Intervention Domicile',
    sms_status: 'ENVOYÉ_DÉLIVRÉ',
    last_sent_at: 'Aujourd’hui à 08:30 (Délivré)',
  },
  {
    id: 'sms_alt_2',
    vehicle_id: 'veh_particulier_tucson',
    vehicle_reg: 'BJ-3344-PT',
    vehicle_model: 'Hyundai Tucson Executive 1.6',
    owner_name: 'Propriétaire Particulier',
    owner_phone: '+229 97 88 99 00',
    operation_type: 'Révision constructeur des 15 000 km + Remplacement filtre habitacle & purge freins',
    due_date: '2026-09-26',
    due_km: 15000,
    current_km: 14750,
    remaining_km: 250,
    urgency: 'CRITIQUE',
    estimated_cost_fcfa: 62000,
    workshop_recommended: 'Atelier Central JMF',
    sms_status: 'EN_ATTENTE',
  },
  {
    id: 'sms_alt_3',
    vehicle_id: 'veh_particulier_prado',
    vehicle_reg: 'BJ-1122-PT',
    vehicle_model: 'Toyota Land Cruiser Prado TX-L',
    owner_name: 'Propriétaire Particulier',
    owner_phone: '+229 97 88 99 00',
    operation_type: 'Contrôle plaquettes de frein avant & permutation des 4 pneumatiques tout-terrain',
    due_date: '2026-10-15',
    due_km: 35000,
    current_km: 29400,
    remaining_km: 5600,
    urgency: 'ANTICIPÉ',
    estimated_cost_fcfa: 48000,
    workshop_recommended: 'Hub Atelier Central JMF',
    sms_status: 'EN_ATTENTE',
  },
  {
    id: 'sms_alt_4',
    vehicle_id: 'veh_particulier_tucson',
    vehicle_reg: 'BJ-3344-PT',
    vehicle_model: 'Hyundai Tucson Executive 1.6',
    owner_name: 'Propriétaire Particulier',
    owner_phone: '+229 97 88 99 00',
    operation_type: 'Test de décharge batterie & contrôle géométrie du train roulant',
    due_date: '2026-10-25',
    due_km: 18000,
    current_km: 14750,
    remaining_km: 3250,
    urgency: 'ANTICIPÉ',
    estimated_cost_fcfa: 25000,
    workshop_recommended: 'Atelier Mobile Agréé',
    sms_status: 'EN_ATTENTE',
  },
];

const INITIAL_LOGS: SmsDispatchLogItem[] = [
  {
    id: 'log_1',
    timestamp: '25/09/2026 à 08:30:14',
    vehicle_reg: 'BJ-1122-PT',
    operation: 'Vidange moteur 5W30 + filtres (reste 600 km)',
    recipient_name: 'Propriétaire Particulier',
    recipient_phone: '+229 97 88 99 00',
    operator: 'MTN Bénin',
    status: 'DÉLIVRÉ',
    message_text:
      'JMF ALERT 🔔 Bonjour cher client. Échéance de maintenance sur votre Toyota Prado (BJ-1122-PT) : Vidange moteur 5W30 + filtres requise dans 600 km (Échéance: 28/09/2026). Pour réserver votre créneau sans attendre, répondez 1 ou appelez le +229 01 21 24 88 70.',
    dlr_code: 'DLR_MTN_200_OK_DELIVERED',
  },
  {
    id: 'log_2',
    timestamp: '20/09/2026 à 10:15:02',
    vehicle_reg: 'BJ-3344-PT',
    operation: 'Alerte anticipée Révision 15 000 km (reste 800 km)',
    recipient_name: 'Propriétaire Particulier',
    recipient_phone: '+229 97 88 99 00',
    operator: 'MTN Bénin',
    status: 'REÇU',
    message_text:
      'JMF FLEET: Rappel révision périodique pour votre Hyundai Tucson (BJ-3344-PT). Compteur actuel: 14 200 km. Révision recommandée avant le 26/09/2026. Équipe mobile JMF disponible à domicile.',
    dlr_code: 'DLR_MTN_200_OK_READ',
  },
  {
    id: 'log_3',
    timestamp: '15/09/2026 à 14:02:45',
    vehicle_reg: 'BJ-1122-PT',
    operation: 'Confirmation RDV atelier programmé',
    recipient_name: 'Propriétaire Particulier',
    recipient_phone: '+229 97 88 99 00',
    operator: 'MTN Bénin',
    status: 'DÉLIVRÉ',
    message_text:
      'JMF SERVICES: Votre intervention mécanique pour Prado BJ-1122-PT est confirmée pour le 28/09 à 09h00 (Atelier Central JMF). Véhicule de courtoisie réservé.',
    dlr_code: 'DLR_MTN_200_OK_DELIVERED',
  },
];

export const ParticulierMaintenanceSmsView: React.FC = () => {
  const [alerts, setAlerts] = useState<MaintenanceSmsAlert[]>(INITIAL_ALERTS);
  const [logs, setLogs] = useState<SmsDispatchLogItem[]>(INITIAL_LOGS);
  const [selectedAlert, setSelectedAlert] = useState<MaintenanceSmsAlert>(INITIAL_ALERTS[0]);

  // SMS Gateway Settings State
  const [isGatewayActive, setIsGatewayActive] = useState<boolean>(true);
  const [primaryPhone, setPrimaryPhone] = useState<string>('+229 97 88 99 00');
  const [secondaryPhone, setSecondaryPhone] = useState<string>('+229 95 11 22 33');
  const [operator, setOperator] = useState<'MTN Bénin' | 'Moov Africa' | 'Celtiis'>('MTN Bénin');
  const [anticipationKm, setAnticipationKm] = useState<number>(1000);
  const [anticipationDays, setAnticipationDays] = useState<number>(7);
  const [whatsappCopy, setWhatsappCopy] = useState<boolean>(true);
  const [quietHours, setQuietHours] = useState<boolean>(true);

  // Live dispatch state & feedback
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'simulator' | 'history' | 'settings'>('overview');
  const [bookingModalAlert, setBookingModalAlert] = useState<MaintenanceSmsAlert | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('2026-09-28');
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string>('08h30 - 10h30 (Matin)');
  const [bookingLocation, setBookingLocation] = useState<'ATELIER_CENTRAL' | 'DOMICILE' | 'BUREAU'>('ATELIER_CENTRAL');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Generate realistic SMS text for a given alert
  const generateSmsText = (alert: MaintenanceSmsAlert) => {
    return (
      `JMF ALERT 🔔 Bonjour ${alert.owner_name}. Échéance de maintenance sur votre ${alert.vehicle_model} (${alert.vehicle_reg}) :\n` +
      `▶ ${alert.operation_type}\n` +
      `⏳ Reste : ${alert.remaining_km} km (Échéance max : ${alert.due_date})\n` +
      `📍 ${alert.workshop_recommended}\n` +
      `Pour réserver votre créneau atelier ou demander une intervention à domicile, répondez OUI ou appelez le +229 01 21 24 88 70.`
    );
  };

  // Dispatch real-time SMS
  const handleTriggerRealtimeSms = (alert: MaintenanceSmsAlert) => {
    setIsDispatching(true);
    setSelectedAlert(alert);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `Aujourd’hui à ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

      const newLog: SmsDispatchLogItem = {
        id: `log_${Date.now()}`,
        timestamp: timeStr,
        vehicle_reg: alert.vehicle_reg,
        operation: alert.operation_type,
        recipient_name: alert.owner_name,
        recipient_phone: primaryPhone,
        operator: operator,
        status: 'DÉLIVRÉ',
        message_text: generateSmsText(alert),
        dlr_code: `DLR_${operator.replace(/\s+/g, '_').toUpperCase()}_200_OK_DELIVERED`,
      };

      setLogs((prev) => [newLog, ...prev]);
      setAlerts((prev) =>
        prev.map((a) =>
          a.id === alert.id ? { ...a, sms_status: 'ENVOYÉ_DÉLIVRÉ', last_sent_at: `${timeStr} (Délivré)` } : a
        )
      );

      setIsDispatching(false);
      showToast(`📲 Alerte SMS expédiée en direct à ${primaryPhone} (${operator}) avec accusé de réception DLR 200 OK !`);
    }, 1200);
  };

  // Confirm booking via SMS response
  const handleConfirmBookingFromSms = () => {
    if (!bookingModalAlert) return;

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === bookingModalAlert.id
          ? { ...a, sms_status: 'CONFIRMÉ_CLIENT', custom_note: `RDV confirmé pour le ${bookingDate} (${bookingLocation})` }
          : a
      )
    );

    const confirmationLog: SmsDispatchLogItem = {
      id: `log_confirm_${Date.now()}`,
      timestamp: 'À l’instant',
      vehicle_reg: bookingModalAlert.vehicle_reg,
      operation: `RDV Confirmé : ${bookingModalAlert.operation_type}`,
      recipient_name: bookingModalAlert.owner_name,
      recipient_phone: primaryPhone,
      operator: operator,
      status: 'DÉLIVRÉ',
      message_text: `JMF SERVICES: Prise en charge validée pour votre ${bookingModalAlert.vehicle_reg} le ${bookingDate}. Lieu: ${bookingLocation.replace(/_/g, ' ')}. Votre technicien certifié est réservé.`,
      dlr_code: 'DLR_CONFIRM_OK',
    };

    setLogs((prev) => [confirmationLog, ...prev]);
    setBookingModalAlert(null);
    showToast('✅ Rendez-vous de maintenance confirmé ! SMS de validation transmis au client.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-teal-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 animate-pulse" />
          </div>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 p-6 sm:p-7 rounded-2xl text-white border border-teal-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Système SMS Temps Réel Particuliers</span>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Passerelle GSM Active (Latence 0.8s)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Alertes SMS Automatiques sur les Échéances de Maintenance
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervision proactive de vos véhicules personnels. Déclenchement automatique et manuel d'alertes SMS prioritaires sur les seuils de vidange, freins, révisions et pneumatiques.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => handleTriggerRealtimeSms(selectedAlert)}
              disabled={isDispatching}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white rounded-xl font-black text-xs shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] cursor-pointer flex items-center gap-2"
            >
              <Send className={`w-4 h-4 ${isDispatching ? 'animate-spin' : ''}`} />
              <span>{isDispatching ? 'Transmission GSM...' : 'Envoyer Alerte SMS en Direct'}</span>
            </button>
            <button
              onClick={() => {
                const alertToTest = alerts[1] || alerts[0];
                handleTriggerRealtimeSms(alertToTest);
              }}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Alerte Critique (Tucson)</span>
            </button>
          </div>
        </div>

        {/* 4 KPIs Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Téléphone Certifié</div>
            <div className="text-sm font-black text-white mt-1 font-mono">{primaryPhone}</div>
            <div className="text-[10px] text-teal-400 font-semibold mt-0.5">{operator} • Validé</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Véhicules Supervisés</div>
            <div className="text-sm font-black text-white mt-1">2 Véhicules Privés</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Prado BJ-1122 & Tucson BJ-3344</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Échéances sous Alerte</div>
            <div className="text-sm font-black text-amber-400 mt-1">{alerts.length} Interventions</div>
            <div className="text-[10px] text-rose-300 mt-0.5">1 Critique (&lt; 300 km)</div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Taux Délivrabilité SMS</div>
            <div className="text-sm font-black text-emerald-400 mt-1">99.8% (DLR OK)</div>
            <div className="text-[10px] text-slate-300 mt-0.5">Routage prioritaire GSM</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'overview'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Échéances Particuliers ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('simulator')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'simulator'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Aperçu Réception Smartphone en Direct</span>
        </button>

        <button
          onClick={() => setActiveTabSub('history')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'history'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Journal des Envois SMS ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveTabSub('settings')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'settings'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configuration & Numéros d'Alerte</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW & ACTIVE ALERTS TABLE                     */}
      {/* ======================================================== */}
      {activeTabSub === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Table: Échéances des Véhicules Particuliers */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Échéances Sous Surveillance SMS</h3>
                  <p className="text-xs text-slate-500">
                    Chaque échéance déclenche un SMS instantané sur le téléphone du propriétaire dès l'atteinte du seuil.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-500">Destinataire par défaut :</span>
                  <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {primaryPhone}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {alerts.map((alt) => {
                  const isSelected = selectedAlert.id === alt.id;
                  return (
                    <div
                      key={alt.id}
                      onClick={() => setSelectedAlert(alt)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/40 ring-1 ring-teal-400 shadow-sm'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl shrink-0 ${
                            alt.urgency === 'CRITIQUE'
                              ? 'bg-rose-100 text-rose-700'
                              : alt.urgency === 'IMMINENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-teal-100 text-teal-800'
                          }`}>
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{alt.vehicle_reg}</span>
                              <span className="text-[11px] text-slate-500 font-medium">({alt.vehicle_model})</span>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                alt.urgency === 'CRITIQUE'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : alt.urgency === 'IMMINENT'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {alt.urgency}
                              </span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 mt-1">
                              {alt.operation_type}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mt-1.5">
                              <span className="flex items-center gap-1 font-mono font-medium text-slate-700">
                                <Clock className="w-3 h-3 text-slate-400" />
                                Reste : {alt.remaining_km.toLocaleString('fr-FR')} km
                              </span>
                              <span>•</span>
                              <span>Date limite : {alt.due_date}</span>
                              <span>•</span>
                              <span className="font-semibold text-slate-700">{alt.estimated_cost_fcfa.toLocaleString('fr-FR')} Francs</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          {alt.sms_status === 'ENVOYÉ_DÉLIVRÉ' && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              SMS Délivré
                            </span>
                          )}
                          {alt.sms_status === 'CONFIRMÉ_CLIENT' && (
                            <span className="text-[10px] font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-1 rounded-lg flex items-center gap-1">
                              <Check className="w-3 h-3 text-sky-600" />
                              RDV Validé
                            </span>
                          )}
                          {alt.sms_status === 'EN_ATTENTE' && (
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-lg">
                              En attente
                            </span>
                          )}

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAlert(alt);
                                setBookingModalAlert(alt);
                              }}
                              className="px-2.5 py-1.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 hover:border-teal-300 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              title="Planifier l'intervention en atelier ou à domicile"
                            >
                              <Calendar className="w-3 h-3 text-teal-600" />
                              <span>Planifier RDV</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTriggerRealtimeSms(alt);
                              }}
                              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                              title="Envoyer une alerte SMS maintenant"
                            >
                              <Send className="w-3 h-3" />
                              <span>Envoyer SMS</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guide d'intervention JMF pour Particuliers */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Pourquoi le SMS en temps réel pour vos véhicules personnels ?</strong>
                <p className="mt-0.5 leading-relaxed">
                  Contrairement aux emails qui finissent en spam, l'alerte SMS JMF est reçue en moins de 2 secondes sur votre téléphone portable même sans connexion 4G. Elle vous avertit à l'avance pour éviter la casse moteur, planifier le passage en atelier ou demander le déplacement du technicien certifié à votre domicile sans perte de temps.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Phone Mockup Preview */}
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl border-4 border-slate-800 shadow-2xl p-4 text-white relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-slate-300">Réception Smartphone en Direct</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">4G LTE</span>
              </div>

              {/* Smartphone Inner Screen */}
              <div className="my-3 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 min-h-[380px] flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="text-center text-[10px] text-slate-500 font-medium">
                    Expéditeur certifié • JMF-ALERT
                  </div>

                  {/* SMS Message Bubble */}
                  <div className="p-3.5 rounded-2xl rounded-tl-xs bg-teal-900/40 border border-teal-500/40 text-xs text-slate-200 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between text-[10px] text-teal-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Bell className="w-3 h-3" />
                        JMF-ALERT • MAINTENANCE
                      </span>
                      <span>À l'instant</span>
                    </div>

                    <div className="text-xs text-white leading-relaxed font-sans">
                      {generateSmsText(selectedAlert)}
                    </div>

                    <div className="text-[9.5px] text-teal-300/80 pt-1 border-t border-teal-800/60 font-mono flex items-center justify-between">
                      <span>Réf : SMS-{selectedAlert.vehicle_reg}</span>
                      <span className="text-emerald-400 font-bold">Délivré ✓✓</span>
                    </div>
                  </div>
                </div>

                {/* Interactive SMS Quick Reply Actions */}
                <div className="space-y-2 pt-3 border-t border-slate-800/80">
                  <div className="text-[10px] uppercase font-bold text-slate-400 text-center tracking-wider">
                    Actions rapides depuis le SMS :
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    <button
                      onClick={() => setBookingModalAlert(selectedAlert)}
                      className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>1. Confirmer RDV Atelier Central</span>
                    </button>
                    <button
                      onClick={() => {
                        showToast(`⏳ Alerte reportée de 7 jours pour ${selectedAlert.vehicle_reg}`);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer text-center"
                    >
                      2. Décaler le rappel de 7 jours
                    </button>
                    <a
                      href="tel:+2290121248870"
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Phone className="w-3 h-3 text-sky-400" />
                      <span>3. Appeler le Chef d'Atelier (+229 01 21 24 88 70)</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-500">
                Numéro abonné : {primaryPhone} • Réseau : {operator}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: DETAILED SMARTPHONE SIMULATOR                      */}
      {/* ======================================================== */}
      {activeTabSub === 'simulator' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Simulateur Télécom GSM & Test de Réception SMS</h3>
              <p className="text-xs text-slate-500">
                Testez en condition réelle la réception des alertes d'entretien telles qu'elles parviennent sur les téléphones de vos conducteurs et membres du foyer.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              Passerelle SMS 4G Connectée
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Control Panel */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Choisir le véhicule du particulier :</label>
                <select
                  value={selectedAlert.id}
                  onChange={(e) => {
                    const found = alerts.find((a) => a.id === e.target.value);
                    if (found) setSelectedAlert(found);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  {alerts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.vehicle_reg} - {a.vehicle_model} ({a.operation_type.substring(0, 40)}...)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Numéro de téléphone destinataire :</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as any)}
                    className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="MTN Bénin">MTN Bénin</option>
                    <option value="Moov Africa">Moov Africa</option>
                    <option value="Celtiis">Celtiis</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900">Aperçu du texte GSM qui sera expédié :</div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 whitespace-pre-line">
                  {generateSmsText(selectedAlert)}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Longueur : 160 caractères (1 SMS GSM standard)</span>
                  <span className="text-teal-700 font-bold">Sans surcoût</span>
                </div>
              </div>

              <button
                onClick={() => handleTriggerRealtimeSms(selectedAlert)}
                disabled={isDispatching}
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className={`w-4 h-4 ${isDispatching ? 'animate-spin' : ''}`} />
                <span>{isDispatching ? 'Transmission en cours...' : 'Déclencher l’envoi de ce SMS maintenant'}</span>
              </button>
            </div>

            {/* Smartphone Graphic View */}
            <div className="flex justify-center">
              <div className="w-full max-w-[340px] bg-slate-900 rounded-[36px] p-3 shadow-2xl border-4 border-slate-700 ring-1 ring-slate-800">
                {/* Notch */}
                <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

                <div className="bg-slate-950 rounded-[28px] p-4 text-white min-h-[460px] flex flex-col justify-between border border-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-bold text-emerald-400">JMF-ALERT</span>
                      <span className="font-mono">100% 🔋</span>
                    </div>

                    <div className="bg-teal-950/70 border border-teal-500/50 p-3.5 rounded-2xl text-xs space-y-2 shadow-lg">
                      <div className="flex items-center justify-between text-[10px] text-teal-300 font-bold">
                        <span>Alerte Entretien Flotte</span>
                        <span>08:30</span>
                      </div>
                      <div className="text-[11.5px] text-slate-100 leading-relaxed font-sans">
                        {generateSmsText(selectedAlert)}
                      </div>
                      <div className="text-[9px] text-teal-400/80 font-mono text-right">
                        Délivré ✓✓
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setBookingModalAlert(selectedAlert)}
                      className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Réserver mon créneau atelier
                    </button>
                    <button
                      onClick={() => showToast('Rappel décalé de 7 jours')}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      Reporter à la semaine prochaine
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: SMS DISPATCH LOG & AUDIT                           */}
      {/* ======================================================== */}
      {activeTabSub === 'history' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Journal d'Audit des SMS Expédiés (Temps Réel)</h3>
              <p className="text-xs text-slate-500">
                Historique certifié des messages SMS transmis via les passerelles télécoms partenaires avec accusé de réception (DLR).
              </p>
            </div>
            <button
              onClick={() => showToast('Journal synchronisé avec la passerelle')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="pb-2.5">Date & Heure</th>
                  <th className="pb-2.5">Véhicule</th>
                  <th className="pb-2.5">Opération</th>
                  <th className="pb-2.5">Destinataire</th>
                  <th className="pb-2.5">Opérateur</th>
                  <th className="pb-2.5">Statut DLR</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-mono font-medium text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 font-bold text-sky-700">{log.vehicle_reg}</td>
                    <td className="py-3 font-medium text-slate-800">{log.operation}</td>
                    <td className="py-3 font-mono font-medium">{log.recipient_phone}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.operator}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {log.status} (200 OK)
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          showToast(`Texte réexpédié à ${log.recipient_phone}`);
                        }}
                        className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer"
                      >
                        Renvoyer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: CONFIGURATION & NOTIFICATION SETTINGS              */}
      {/* ======================================================== */}
      {activeTabSub === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Paramétrage des Alertes SMS Particuliers</h3>
            <p className="text-xs text-slate-500">
              Définissez les numéros de téléphone et règles d'anticipation pour ne manquer aucune vidange ou contrôle technique.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
                Numéros de Téléphone & Contacts Directs
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro Principal (Propriétaire) * :
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg shrink-0">
                    Actif
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Format international : +(Indicatif) Numéro mobile direct</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Numéro Secondaire (Chauffeur ou Famille) :
                </label>
                <input
                  type="text"
                  value={secondaryPhone}
                  onChange={(e) => setSecondaryPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  placeholder="+..."
                />
              </div>

              <div className="pt-2 space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={whatsappCopy}
                    onChange={(e) => setWhatsappCopy(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>Recevoir également une copie WhatsApp instantanée</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={quietHours}
                    onChange={(e) => setQuietHours(e.target.checked)}
                    className="rounded text-teal-600"
                  />
                  <span>Respecter les heures calmes (pas de SMS non critique entre 21h et 07h)</span>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
                Délais d'Anticipation des Alertes
              </h4>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seuil kilométrique d'alerte :
                </label>
                <select
                  value={anticipationKm}
                  onChange={(e) => setAnticipationKm(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value={1500}>1 500 km avant l'échéance (Recommandé gros rouleurs)</option>
                  <option value={1000}>1 000 km avant l'échéance (Standard)</option>
                  <option value={500}>500 km avant l'échéance (Dernière minute)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seuil calendaire d'anticipation :
                </label>
                <select
                  value={anticipationDays}
                  onChange={(e) => setAnticipationDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value={15}>15 jours avant la date limite</option>
                  <option value={7}>7 jours avant la date limite (Recommandé)</option>
                  <option value={3}>3 jours avant la date limite</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Garantie de Sérénité JMF</span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed">
                  En activant ce service, votre véhicule ne dépassera jamais ses limites de vidange ou d'usure des freins. Nos ateliers réservent automatiquement les pièces et lubrifiants adaptés à votre modèle (Toyota Prado / Hyundai Tucson).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => showToast('Paramètres SMS sauvegardés avec succès !')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-teal-600/20 cursor-pointer"
            >
              Enregistrer les Préférences
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: RDV BOOKING CONFIRMATION                           */}
      {/* ======================================================== */}
      {bookingModalAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-100 text-teal-700 rounded-xl">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Confirmer la Prise de Rendez-vous</h3>
                  <p className="text-xs text-slate-500">{bookingModalAlert.vehicle_reg} • {bookingModalAlert.vehicle_model}</p>
                </div>
              </div>
              <button
                onClick={() => setBookingModalAlert(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">{bookingModalAlert.operation_type}</div>
                <div className="text-slate-500 mt-1">Estimation : {bookingModalAlert.estimated_cost_fcfa.toLocaleString('fr-FR')} Francs</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date souhaitée :</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-xs bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Créneau horaire :</label>
                  <select
                    value={bookingTimeSlot}
                    onChange={(e) => setBookingTimeSlot(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-xs bg-slate-50 focus:bg-white"
                  >
                    <option value="08h30 - 10h30 (Matinée)">08h30 - 10h30 (Matinée)</option>
                    <option value="11h00 - 13h00 (Midi)">11h00 - 13h00 (Midi)</option>
                    <option value="14h30 - 16h30 (Après-midi)">14h30 - 16h30 (Après-midi)</option>
                    <option value="16h30 - 18h30 (Fin de journée)">16h30 - 18h30 (Fin de journée)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lieu d'intervention :</label>
                <select
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl font-medium text-xs bg-slate-50 focus:bg-white"
                >
                  <option value="ATELIER_CENTRAL">Atelier Central JMF</option>
                  <option value="DOMICILE">À Domicile (Unité mobile d'intervention rapide)</option>
                  <option value="BUREAU">Sur votre lieu de travail / Bureau</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 text-[11px] leading-relaxed flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>
                  Un SMS de confirmation avec le nom et contact direct du technicien certifié sera transmis immédiatement à <strong>{primaryPhone}</strong> ({operator}).
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
              <a
                href={`https://wa.me/2290197832121?text=${encodeURIComponent(
                  `Bonjour JMF Mobility Services, je souhaite réserver une prise en charge pour mon véhicule ${bookingModalAlert.vehicle_reg} (${bookingModalAlert.vehicle_model}) :\n• Opération : ${bookingModalAlert.operation_type}\n• Date : ${bookingDate}\n• Créneau : ${bookingTimeSlot}\n• Lieu : ${bookingLocation === 'ATELIER_CENTRAL' ? 'Atelier Central JMF' : bookingLocation === 'DOMICILE' ? 'À Domicile' : 'Au Bureau'}\n• Contact : ${primaryPhone}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Réserver par WhatsApp</span>
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setBookingModalAlert(null)}
                  className="px-3.5 py-2 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmBookingFromSms}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  Valider & Notifier par SMS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
