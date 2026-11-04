import React, { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Building2,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Crosshair,
  MessageSquare,
} from 'lucide-react';

export const JMF_HEADQUARTERS = {
  id: 'cotonou' as const,
  flag: '🇧🇯',
  name: 'JMF Mobility Services — Bénin',
  designation: 'Siège Social & Direction Générale',
  badge: 'Direction Opérationnelle',
  address: 'Vodjè lot 1061',
  city: 'Cotonou',
  country: 'Bénin',
  position: { lat: 6.3620, lng: 2.3920 },
  defaultZoom: 16,
  phoneLandline: '+229 01 21 24 88 70',
  phoneDirect: '+229 01 97 83 21 21',
  whatsappUrl: 'https://wa.me/2290197832121',
  email: 'contact@jmfmobilityservices.com',
  hours: 'Lun - Ven : 08h00 - 19h00 | Sam : 09h00 - 14h00',
};

export const JMF_DAKAR_HUB = {
  id: 'dakar' as const,
  flag: '🇸🇳',
  name: 'JMF Mobility Services — Sénégal',
  designation: 'Antenne & Hub Opérationnel Sénégal',
  badge: 'Hub Dakar',
  address: 'SICAP N°6760, Liberté 6',
  city: 'Dakar',
  country: 'Sénégal',
  position: { lat: 14.7247, lng: -17.4576 },
  defaultZoom: 16,
  phoneLandline: '+221 77 598 43 92',
  phoneDirect: '+221 77 598 43 92',
  whatsappUrl: 'https://wa.me/221775984392',
  email: 'contact@jmfmobilityservices.com',
  hours: 'Lun - Ven : 08h00 - 19h00 | Sam : 09h00 - 14h00',
};

export const JMF_LOCATIONS = {
  cotonou: JMF_HEADQUARTERS,
  dakar: JMF_DAKAR_HUB,
};

// Map camera recentering controller
function MapController({
  triggerRecenter,
  targetPosition,
  targetZoom,
}: {
  triggerRecenter: number;
  targetPosition: { lat: number; lng: number };
  targetZoom: number;
}) {
  const map = useMap();

  React.useEffect(() => {
    if (!map) return;
    map.panTo(targetPosition);
    map.setZoom(targetZoom);
  }, [map, triggerRecenter, targetPosition, targetZoom]);

  return null;
}

export const InteractiveLocationsMap: React.FC = () => {
  const apiKey =
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
    'AIzaSyDgbtraX547mkuziWj1wBvnEBc5T6cHC8Y';

  const [selectedHub, setSelectedHub] = useState<'cotonou' | 'dakar'>('cotonou');
  const [activeView, setActiveView] = useState<'map' | 'visual'>('map');
  const [infoWindowOpen, setInfoWindowOpen] = useState(true);
  const [recenterCount, setRecenterCount] = useState(0);

  const currentLocation = JMF_LOCATIONS[selectedHub];

  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${currentLocation.position.lat},${currentLocation.position.lng}`;
  };

  const handleRecenter = () => {
    setRecenterCount((prev) => prev + 1);
    setInfoWindowOpen(true);
  };

  const handleSelectHub = (hub: 'cotonou' | 'dakar') => {
    setSelectedHub(hub);
    setInfoWindowOpen(true);
    setRecenterCount((prev) => prev + 1);
  };

  return (
    <div id="carte-siege-jmf" className="w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-100">
      {/* Top Rectangular Header Strip with Hub & View Toggles */}
      <div className="px-4 sm:px-6 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/15 border border-sky-400/30 text-sky-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {currentLocation.flag} {currentLocation.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  {currentLocation.badge}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="font-semibold text-white">
                  {currentLocation.address}, {currentLocation.city}, {currentLocation.country}
                </span>
              </div>
            </div>
          </div>

          {/* Hub Selector + View Switcher & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto shrink-0">
            {/* Hub Switcher (Cotonou / Dakar) */}
            <div className="flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-700/80">
              <button
                type="button"
                onClick={() => handleSelectHub('cotonou')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedHub === 'cotonou'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇧🇯 Cotonou (Bénin)
              </button>
              <button
                type="button"
                onClick={() => handleSelectHub('dakar')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedHub === 'dakar'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🇸🇳 Dakar (Sénégal)
              </button>
            </div>

            <div className="flex items-center p-0.5 bg-slate-900 rounded-xl border border-slate-700/80">
              <button
                type="button"
                onClick={() => setActiveView('map')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'map'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🗺️ Carte GPS
              </button>
              <button
                type="button"
                onClick={() => setActiveView('visual')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeView === 'visual'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🖼️ Visuel Officiel
              </button>
            </div>

            {activeView === 'map' ? (
              <>
                <button
                  type="button"
                  onClick={handleRecenter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Recentrer sur l'adresse sélectionnée"
                >
                  <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Recentrer</span>
                </button>

                <a
                  href={getDirectionsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Itinéraire</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </a>
              </>
            ) : (
              <a
                href="/assets/jmf-visuel-siege-vodje.svg"
                download="jmf-visuel-siege-vodje.svg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <span>Télécharger le Visuel SVG</span>
              </a>
            )}
          </div>
        </div>

        {/* Dual Address Summary Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <div
            onClick={() => handleSelectHub('cotonou')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedHub === 'cotonou'
                ? 'bg-sky-500/10 border-sky-500/40 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span>🇧🇯</span>
              <span className="truncate">
                <strong className="text-sky-300">Siège Bénin :</strong> Vodjè lot 1061, Cotonou, Bénin
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">+229 01 97 83 21 21</span>
          </div>

          <div
            onClick={() => handleSelectHub('dakar')}
            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
              selectedHub === 'dakar'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span>🇸🇳</span>
              <span className="truncate">
                <strong className="text-emerald-300">Hub Sénégal :</strong> SICAP N°6760, Liberté 6, Dakar, Sénégal
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 shrink-0">+221 77 598 43 92</span>
          </div>
        </div>
      </div>

      {/* Main Viewport: Google Map OR Vector Graphic Visual */}
      {activeView === 'visual' ? (
        <div className="w-full min-h-[360px] bg-slate-950 p-4 flex flex-col items-center justify-center gap-3">
          <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-sky-500/30 shadow-2xl bg-slate-900">
            <img
              src="/assets/jmf-visuel-siege-vodje.svg"
              alt="Carte d'Identité Officielle & Adresses JMF Mobility Services"
              className="w-full h-auto object-contain"
            />
          </div>
          <div className="text-center text-xs text-slate-400">
            <span className="text-sky-400 font-bold">🇧🇯 Siège Bénin :</span> Vodjè lot 1061, Cotonou, Bénin •{' '}
            <span className="text-emerald-400 font-bold">🇸🇳 Hub Sénégal :</span> SICAP N°6760, Liberté 6, Dakar, Sénégal
          </div>
        </div>
      ) : (
        <div className="w-full h-[320px] sm:h-[380px] md:h-[420px] relative bg-slate-950">
          <APIProvider apiKey={apiKey} solutionChannel="gmp_mcp_codeassist_v1_aistudio">
            <div className="w-full h-full relative">
              <Map
                mapId="DEMO_MAP_ID"
                defaultCenter={currentLocation.position}
                defaultZoom={currentLocation.defaultZoom}
                gestureHandling="cooperative"
                disableDefaultUI={false}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                className="w-full h-full"
                style={{ width: '100%', height: '100%', minHeight: '320px' }}
              >
                <MapController
                  triggerRecenter={recenterCount}
                  targetPosition={currentLocation.position}
                  targetZoom={currentLocation.defaultZoom}
                />

                {/* Pinpoint marker on selected hub */}
                <AdvancedMarker
                  position={currentLocation.position}
                  onClick={() => setInfoWindowOpen((prev) => !prev)}
                  title={`${currentLocation.name} - ${currentLocation.address}, ${currentLocation.city}`}
                >
                  <Pin
                    background="#0284C7"
                    borderColor="#FFFFFF"
                    glyphColor="#FFFFFF"
                    scale={1.2}
                  />
                </AdvancedMarker>

                {/* InfoWindow on Marker */}
                {infoWindowOpen && (
                  <InfoWindow
                    position={currentLocation.position}
                    onCloseClick={() => setInfoWindowOpen(false)}
                    pixelOffset={[0, -34]}
                  >
                    <div className="text-slate-900 p-1.5 max-w-[260px] space-y-1.5 text-xs font-sans">
                      <div className="border-b border-slate-100 pb-1">
                        <span className="font-extrabold text-[12px] text-slate-900 block leading-tight">
                          {currentLocation.flag} {currentLocation.name}
                        </span>
                        <span className="text-[10px] text-sky-700 font-semibold block">
                          {currentLocation.designation}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>
                          {currentLocation.address}, {currentLocation.city}, {currentLocation.country}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[10.5px] text-slate-500">
                        <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>{currentLocation.hours}</span>
                      </div>

                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href={`tel:${currentLocation.phoneDirect.replace(/\s+/g, '')}`}
                          className="text-[10.5px] font-bold text-slate-700 hover:text-sky-700 inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-sky-600" />
                          <span>Appeler</span>
                        </a>

                        <a
                          href={getDirectionsUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10.5px] font-bold px-2 py-0.5 rounded bg-sky-600 hover:bg-sky-500 text-white transition-colors"
                        >
                          <span>Itinéraire</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>

              {/* Subtle floating badge in map viewport */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg px-2.5 py-1 text-[11px] text-white shadow-md pointer-events-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold text-slate-200">
                  {currentLocation.flag} {currentLocation.address}, {currentLocation.city}
                </span>
              </div>
            </div>
          </APIProvider>
        </div>
      )}

      {/* Bottom Compact Info Strip */}
      <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Horaires d'accueil : {currentLocation.hours}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-slate-500">Tél :</span>
            <a
              href={`tel:${currentLocation.phoneLandline.replace(/\s+/g, '')}`}
              className="text-slate-200 hover:text-sky-300 font-mono transition-colors"
            >
              {currentLocation.phoneLandline}
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-slate-500">WhatsApp :</span>
            <a
              href={currentLocation.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 font-mono transition-colors"
            >
              {currentLocation.phoneDirect}
            </a>
          </div>

          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <a
              href={`mailto:${currentLocation.email}`}
              className="text-slate-300 hover:text-sky-300 transition-colors"
            >
              {currentLocation.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
