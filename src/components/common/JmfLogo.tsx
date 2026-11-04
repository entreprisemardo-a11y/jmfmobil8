import React, { useState } from 'react';
import jmfLogoAsset from '../../assets/brand/jmf-logo-transparent.png';

interface JmfLogoProps {
  className?: string;
  variant?: 'light' | 'dark';
  collapsed?: boolean;
}

export const JmfLogo: React.FC<JmfLogoProps> = ({
  className = 'h-12',
  variant = 'dark',
  collapsed = false,
}) => {
  const isDark = variant === 'dark';
  const [imgSrc, setImgSrc] = useState<string>('/brand/jmf-logo-transparent.png');

  const handleImgError = () => {
    if (imgSrc === '/brand/jmf-logo-transparent.png' && jmfLogoAsset !== '/brand/jmf-logo-transparent.png') {
      setImgSrc(jmfLogoAsset);
    } else if (imgSrc !== '/jmf-logo.svg') {
      setImgSrc('/jmf-logo.svg');
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${
        isDark ? 'bg-white/95 px-1.5 py-0.5 rounded-lg shadow-xs' : ''
      } ${className}`}
    >
      <img
        src={imgSrc}
        onError={handleImgError}
        alt="JMF Mobility Services"
        fetchPriority="high"
        decoding="async"
        className={`h-full w-auto object-contain block ${collapsed ? 'max-w-[44px]' : ''}`}
      />
    </div>
  );
};
