const BASE_URL = 'https://jmfmobilityservices.com';

export interface PageSeoConfig {
  title: string;
  description: string;
  canonicalPath?: string;
  keywords?: string;
}

export const SEO_CONFIGS: Record<'home' | 'convoyage' | 'pieces-auto' | 'rental' | 'platform', PageSeoConfig> = {
  home: {
    title: 'JMF Fleet & Mobility — Gestion de flotte & Mobilité',
    description:
      "Plateforme SaaS professionnelle de gestion de flotte automobile, mobilité d'entreprise et services JMF Mobility Services.",
    canonicalPath: '/',
    keywords:
      'gestion de flotte automobile Afrique, télématique GPS 4G Afrique, convoyage de véhicules Afrique, location de véhicules B2B Bénin Sénégal, pièces détachées OEM Afrique, JMF Mobility Services',
  },
  convoyage: {
    title: 'Convoyage de Véhicules Sécurisé en Afrique — JMF Mobility Services',
    description:
      "Déplacez votre flotte partout sur le continent en toute sérénité. Un service de convoyage de véhicules sécurisé, traçable par GPS 4G et clé en main à travers toute l'Afrique.",
    canonicalPath: '/?page=convoyage',
    keywords:
      'convoyage de véhicules Afrique, transport véhicule Bénin Sénégal Côte d’Ivoire Togo, convoyeur professionnel Afrique, livraison flotte automobile Afrique',
  },
  'pieces-auto': {
    title: "Pièces Détachées Auto OEM d'Origine en Afrique — JMF Mobility Services",
    description:
      "Fourniture express de pièces détachées automobiles OEM 100% d'origine constructeur (Toyota, Peugeot, Mitsubishi, Renault, Poids Lourds) avec livraison sur site en Afrique.",
    canonicalPath: '/?page=pieces-auto',
    keywords:
      'pièces détachées OEM Afrique, pièces d’origine Toyota Hilux Prado Afrique, maintenance flotte automobile Bénin Sénégal, pièces auto certifiées Cotonou Dakar',
  },
  rental: {
    title: 'Location de Véhicules B2B, 4x4 & SUV en Afrique — JMF Mobility Services',
    description:
      "Location courte et longue durée (LLD) de véhicules 4x4, SUV, pick-up et berlines VIP avec ou sans chauffeur pour entreprises, ONG et particuliers en Afrique.",
    canonicalPath: '/?page=rental',
    keywords:
      'location 4x4 Afrique, location voiture entreprise Bénin Sénégal, location longue durée flotte automobile, location SUV avec chauffeur Cotonou Dakar',
  },
  platform: {
    title: 'Espace Client & Supervision Flotte SaaS — JMF Fleet & Mobility',
    description:
      'Accédez à votre tableau de bord JMF Fleet & Mobility : suivi télématique GPS temps réel, contrôle carburant, maintenance préventive et gestion TCO.',
    canonicalPath: '/?page=platform',
  },
};

function setMetaTag(selector: string, attribute: string, value: string) {
  if (typeof document === 'undefined') return;
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute(attribute, value);
  }
}

export function applyPageSeo(pageKey: keyof typeof SEO_CONFIGS) {
  if (typeof document === 'undefined') return;
  const config = SEO_CONFIGS[pageKey] || SEO_CONFIGS.home;

  document.title = config.title;
  setMetaTag('meta[name="description"]', 'content', config.description);
  setMetaTag('meta[property="og:title"]', 'content', config.title);
  setMetaTag('meta[property="og:description"]', 'content', config.description);
  setMetaTag('meta[name="twitter:title"]', 'content', config.title);
  setMetaTag('meta[name="twitter:description"]', 'content', config.description);

  if (config.keywords) {
    setMetaTag('meta[name="keywords"]', 'content', config.keywords);
  }

  const fullUrl = `${BASE_URL}${config.canonicalPath || '/'}`;
  setMetaTag('link#canonical-url', 'href', fullUrl);
  setMetaTag('meta[property="og:url"]', 'content', fullUrl);
}
