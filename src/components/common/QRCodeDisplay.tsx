import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface QRCodeDisplayProps {
  url?: string;
  size?: number;
  className?: string;
  showControls?: boolean;
  darkColor?: string;
  lightColor?: string;
  label?: string;
  downloadFilename?: string;
}

export const OFFICIAL_APP_DOMAIN = 'https://jmfmobilityservices.com';

export const getScanAppUrl = (suffix: string = '/apk/jmf-mobility.apk'): string => {
  if (typeof window === 'undefined') {
    return `${OFFICIAL_APP_DOMAIN}${suffix}`;
  }
  const hostname = window.location.hostname;
  const isPreviewOrLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.includes('192.168.') ||
    hostname.endsWith('.run.app') ||
    hostname.includes('aistudio');

  const base = isPreviewOrLocal ? OFFICIAL_APP_DOMAIN : window.location.origin;
  const normalizedSuffix = suffix.startsWith('/') ? suffix : `/${suffix}`;

  return `${base}${normalizedSuffix}`;
};

export const getApkDownloadUrl = (moduleId: string = 'all'): string => {
  switch (moduleId) {
    case 'driver':
      return getScanAppUrl('/apk/jmf-mobility-driver.apk');
    case 'rental':
      return getScanAppUrl('/apk/jmf-mobility-rental.apk');
    case 'client':
      return getScanAppUrl('/apk/jmf-mobility-client.apk');
    default:
      return getScanAppUrl('/apk/jmf-mobility.apk');
  }
};

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  url,
  size = 200,
  className = '',
  showControls = false,
  darkColor = '#0F172A',
  lightColor = '#FFFFFF',
  label,
  downloadFilename = 'qrcode-jmf-fleet.png',
}) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const targetUrl = url || getApkDownloadUrl('driver');

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: Math.max(size * 2, 280), // Generate at 2x resolution for retina/phone displays
      color: {
        dark: darkColor,
        light: lightColor,
      },
    })
      .then((generatedUrl) => {
        if (isMounted) {
          setDataUrl(generatedUrl);
          setError(null);
        }
      })
      .catch((err) => {
        console.error('Failed to generate QR Code:', err);
        if (isMounted) setError('Erreur de génération');
      });

    return () => {
      isMounted = false;
    };
  }, [targetUrl, size, darkColor, lightColor]);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(targetUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      {/* QR Code Container */}
      <div
        className="relative bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-block overflow-hidden"
        style={{ width: size, height: size }}
      >
        {dataUrl ? (
          <img
            src={dataUrl}
            alt={`QR Code vers ${targetUrl}`}
            width={size - 16}
            height={size - 16}
            className="w-full h-full object-contain select-none"
            loading="lazy"
          />
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-2 text-xs">
            <QrIcon className="w-8 h-8 mb-1 text-slate-300" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-sky-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {label && <p className="text-xs font-semibold text-slate-700 mt-2">{label}</p>}

      {/* Controls & URL preview */}
      {showControls && (
        <div className="w-full max-w-sm mt-3 space-y-2">
          {/* Target URL with Copy Button */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <input
              type="text"
              readOnly
              value={targetUrl}
              className="bg-transparent text-slate-700 px-2 py-1 text-[11px] font-mono flex-1 truncate outline-none select-all"
              title="Lien encodé dans le QR Code"
            />
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 border border-slate-300 shadow-2xs transition-colors shrink-0 cursor-pointer"
              title="Copier le lien"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-700">Copié</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-slate-500" />
                  <span>Copier</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Actions: Download PNG & Open Link */}
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleDownload}
              disabled={!dataUrl}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Télécharger PNG</span>
            </button>
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tester le lien</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
