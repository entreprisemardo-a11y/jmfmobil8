import { jsPDF } from 'jspdf';
import { formatCurrencyAmount, getCurrency } from '../services/currencyService.js';

export interface RentalQuotePdfData {
  reference: string;
  issueDate?: string;
  vehicle: {
    brand: string;
    model: string;
    plateNumber: string;
    category: string;
    seats: number;
    transmission: string;
    fuelType?: string;
    dailyRateFcfa: number;
    driverDailyFeeFcfa?: number;
    depositFcfa: number;
  };
  dates: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    pickupPlace: string;
    returnPlace?: string;
    baseDays: number;
    totalHours: number;
    extraHours?: number;
    graceHours?: number;
  };
  client: {
    name: string;
    phone: string;
    email?: string;
    clientType?: 'PARTICULIER' | 'ENTREPRISE';
    companyName?: string;
    companyIfu?: string;
    driverLicenseNumber?: string;
  };
  service: {
    withDriver: boolean;
    options: {
      babySeat: boolean;
      wifi: boolean;
      unlimitedKm: boolean;
      secondDriver: boolean;
    };
    paymentMethod?: string;
  };
  pricing: {
    baseDailyRate: number;
    discountPercent: number;
    discountAmount: number;
    discountedVehicleCost: number;
    driverCost: number;
    optionsCost: number;
    penaltyDays: number;
    penaltyDailyRateFcfa: number;
    totalPenaltyFcfa: number;
    subtotalBeforePenalty: number;
    totalAmountFcfa: number;
    depositFcfa: number;
    currencyCode?: string;
  };
}

export function generateRentalQuotePdf(data: RentalQuotePdfData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 8;

  // 1. Top Decorative Brand Banner Strip
  doc.setFillColor(15, 23, 42); // slate 900
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(13, 148, 136); // teal 600
  doc.rect(0, 4, pageWidth, 1.5, 'F');

  // 2. Corporate Header with JMF Logo Badge
  // Logo block
  doc.setFillColor(15, 23, 42); // #0F172A
  doc.roundedRect(margin, y, 22, 13, 2, 2, 'F');
  doc.setFillColor(13, 148, 136); // Teal dot
  doc.circle(margin + 4, y + 4, 1.2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('JMF', margin + 11, y + 6.5, { align: 'center' });
  doc.setFontSize(4.5);
  doc.setTextColor(153, 246, 228); // teal 200
  doc.text('MOBILITY', margin + 11, y + 10.5, { align: 'center' });

  // Company Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('JMF MOBILITY SERVICES S.A.', margin + 26, y + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('LOCATION DE VÉHICULES VIP & GESTION DÉLÉGUÉE DE FLOTTE', margin + 26, y + 8.5);
  doc.text('Bénin : Vodjè lot 1061, Cotonou • Sénégal : SICAP N°6760, Liberté 6, Dakar', margin + 26, y + 12);

  // Right-aligned Header Contact
  doc.setFontSize(7);
  doc.setTextColor(13, 148, 136);
  doc.text('Direction Commerciale & Réservations', pageWidth - margin, y + 4.5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('+229 01 97 83 21 21 • +221 77 598 43 92 • +33 6 50 05 91 61', pageWidth - margin, y + 8.5, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('contact@jmfmobilityservices.com', pageWidth - margin, y + 12, { align: 'right' });

  y += 16;

  // Thin separator
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);
  y += 4;

  // 3. Document Title & Quote Meta Ribbon
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('DEVIS PROFORMA OFFICIEL — LOCATION AUTOMOBILE', margin + 5, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Document contractuel de réservation & tarification officielle', margin + 5, y + 10.5);

  // Quote Metadata on the right
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(13, 148, 136);
  doc.text(`Réf : ${data.reference || 'DEV-BJ-2026-001'}`, pageWidth - margin - 5, y + 5.5, { align: 'right' });

  const dateNow = data.issueDate || new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Émis le : ${dateNow} • Validité de l'offre : 15 jours`, pageWidth - margin - 5, y + 10, { align: 'right' });

  y += 17;

  // 4. Two Columns: Client Information & Vehicle Details
  const colWidth = (contentWidth - 4) / 2;

  // Left Column: Client Details
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, colWidth, 31, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, 31, 2, 2, 'S');

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, colWidth, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DONNEUR D’ORDRE / CLIENT BÉNÉFICIAIRE', margin + 3, y + 4.2);

  let ly = y + 9.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Nom & Prénom :', margin + 3, ly);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.client.name || 'Client Particulier', margin + 26, ly);

  ly += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Téléphone / WhatsApp :', margin + 3, ly);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.client.phone || 'Non renseigné', margin + 34, ly);

  ly += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Email de contact :', margin + 3, ly);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(data.client.email || 'contact@client.com', margin + 27, ly);

  ly += 4.5;
  if (data.client.clientType === 'ENTREPRISE' && data.client.companyName) {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Société / IFU :', margin + 3, ly);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136);
    const ifuStr = data.client.companyIfu ? ` (IFU: ${data.client.companyIfu})` : '';
    doc.text(`${data.client.companyName}${ifuStr}`.slice(0, 36), margin + 22, ly);
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Permis de conduire :', margin + 3, ly);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(data.client.driverLicenseNumber || 'Vérification lors de la prise en charge', margin + 29, ly);
  }

  // Right Column: Vehicle & Service Details
  const rightColX = margin + colWidth + 4;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(rightColX, y, colWidth, 31, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(rightColX, y, colWidth, 31, 2, 2, 'S');

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(rightColX, y, colWidth, 6, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(30, 41, 59);
  doc.text('VÉHICULE & FORMULE SÉLECTIONNÉE', rightColX + 3, y + 4.2);

  let ry = y + 9.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Véhicule assigné :', rightColX + 3, ry);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.vehicle.brand} ${data.vehicle.model} (${data.vehicle.plateNumber})`, rightColX + 27, ry);

  ry += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Spécifications :', rightColX + 3, ry);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const specs = `${data.vehicle.category} • ${data.vehicle.seats} places • ${data.vehicle.transmission} • ${data.vehicle.fuelType || 'Essence / Diesel'}`;
  doc.text(specs, rightColX + 24, ry);

  ry += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Formule conduite :', rightColX + 3, ry);
  doc.setFont('helvetica', 'bold');
  if (data.service.withDriver) {
    doc.setTextColor(13, 148, 136);
    doc.text('Avec Chauffeur Professionnel JMF (+20 000 FCFA/j)', rightColX + 28, ry);
  } else {
    doc.setTextColor(59, 130, 246);
    doc.text('Sans Chauffeur (Autonomie avec caution)', rightColX + 28, ry);
  }

  ry += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Assurance & Sécurité :', rightColX + 3, ry);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129); // emerald 500
  doc.text('Assurance Tous Risques & Assistance 24/7 Incluse', rightColX + 32, ry);

  y += 34;

  // 5. Complete Dates, Hours & Duration Breakdown Table
  doc.setFillColor(240, 253, 250); // teal 50
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  doc.setDrawColor(153, 246, 228); // teal 200
  doc.roundedRect(margin, y, contentWidth, 20, 2, 2, 'S');

  // Title inside dates box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 118, 110); // teal 700
  doc.text('CALENDRIER CONTRACTUEL DE LOCATION & CYCLE HORAIRE', margin + 4, y + 4.8);

  const colDateWidth = contentWidth / 3;

  // Col 1: Prise en charge / Arrivée
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DÉPART / PRISE EN CHARGE (ARRIVÉE) :', margin + 4, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.dates.startDate} à ${data.dates.startTime}`, margin + 4, y + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Lieu : ${data.dates.pickupPlace.slice(0, 32)}`, margin + 4, y + 17.5);

  // Col 2: Restitution / Sortie
  const col2X = margin + colDateWidth;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('RETOUR / RESTITUTION (SORTIE) :', col2X, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.dates.endDate} à ${data.dates.endTime}`, col2X, y + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  const retPlace = data.dates.returnPlace || data.dates.pickupPlace;
  doc.text(`Lieu : ${retPlace.slice(0, 32)}`, col2X, y + 17.5);

  // Col 3: Durée & Franchise
  const col3X = margin + colDateWidth * 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('DURÉE CONTRACTUELLE FACTURÉE :', col3X, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(13, 148, 136);
  doc.text(`${data.dates.baseDays} Jour(s) (Cycle 24h • Total ${data.dates.totalHours}h)`, col3X, y + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Franchise contractuelle accordée : 2 heures', col3X, y + 17.5);

  y += 23;

  // 6. Comprehensive Financial Breakdown Table
  const currencyCode = data.pricing.currencyCode || 'XOF';
  const currInfo = getCurrency(currencyCode);
  const formatMoney = (val: number) => formatCurrencyAmount(val, currencyCode);

  // Table Header
  doc.setFillColor(15, 23, 42); // slate 900
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text('DÉSIGNATION DES PRESTATIONS & SERVICES', margin + 3, y + 4.2);
  doc.text('BASE & QUANTITÉ', margin + 95, y + 4.2);
  doc.text('TARIF UNITAIRE', margin + 130, y + 4.2);
  doc.text(`MONTANT TOTAL (${currInfo.code})`, pageWidth - margin - 3, y + 4.2, { align: 'right' });

  y += 6;

  // Table Rows Helper
  const printRow = (label: string, qty: string, unitPrice: string, amount: string, isDiscount = false, isPenalty = false) => {
    doc.setFillColor(isPenalty ? 254 : isDiscount ? 240 : (y % 10 === 0 ? 250 : 255), isPenalty ? 243 : isDiscount ? 253 : 250, isPenalty ? 199 : isDiscount ? 244 : 252);
    doc.rect(margin, y, contentWidth, 5.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 5.5, pageWidth - margin, y + 5.5);

    doc.setFont('helvetica', isDiscount || isPenalty ? 'bold' : 'normal');
    doc.setFontSize(7);
    if (isPenalty) doc.setTextColor(180, 83, 9); // amber 700
    else if (isDiscount) doc.setTextColor(16, 185, 129); // emerald 600
    else doc.setTextColor(30, 41, 59);

    doc.text(label, margin + 3, y + 3.8);
    doc.text(qty, margin + 95, y + 3.8);
    doc.text(unitPrice, margin + 130, y + 3.8);
    doc.text(amount, pageWidth - margin - 3, y + 3.8, { align: 'right' });

    y += 5.5;
  };

  // Row 1: Vehicle Rental
  const vehicleBaseTotal = data.pricing.baseDailyRate * data.dates.baseDays;
  printRow(
    `Location véhicule ${data.vehicle.brand} ${data.vehicle.model}`,
    `${data.dates.baseDays} jour(s)`,
    `${formatMoney(data.pricing.baseDailyRate)}/j`,
    formatMoney(vehicleBaseTotal)
  );

  // Row 2: Discount if applicable
  if (data.pricing.discountAmount > 0) {
    printRow(
      `Remise commerciale dégressive de durée (-${data.pricing.discountPercent}%)`,
      `Application globale`,
      `-${data.pricing.discountPercent}%`,
      `-${formatMoney(data.pricing.discountAmount)}`,
      true
    );
  }

  // Row 3: Chauffeur Service
  if (data.service.withDriver && data.pricing.driverCost > 0) {
    const driverFee = data.vehicle.driverDailyFeeFcfa || 20000;
    printRow(
      'Mise à disposition Chauffeur Professionnel JMF certifié CNSR',
      `${data.dates.baseDays} jour(s)`,
      `${formatMoney(driverFee)}/j`,
      `+${formatMoney(data.pricing.driverCost)}`
    );
  }

  // Row 4: Add-on Options
  const activeOpts: string[] = [];
  if (data.service.options.babySeat) activeOpts.push('Siège Bébé');
  if (data.service.options.wifi) activeOpts.push('Wi-Fi 4G/5G');
  if (data.service.options.unlimitedKm) activeOpts.push('Kilométrage illimité');
  if (data.service.options.secondDriver) activeOpts.push('2e Conducteur');

  if (activeOpts.length > 0) {
    printRow(
      `Options : ${activeOpts.join(', ').slice(0, 52)}`,
      `${activeOpts.length} option(s)`,
      'Forfaits inclus',
      `+${formatMoney(data.pricing.optionsCost)}`
    );
  }

  // Row 5: Overstay Penalty if declared / simulated
  if (data.pricing.penaltyDays > 0 && data.pricing.totalPenaltyFcfa > 0) {
    printRow(
      `Pénalité de dépassement contractuel / prolongation hors délai (+35%)`,
      `${data.pricing.penaltyDays} jour(s) entamé(s)`,
      `${formatMoney(data.pricing.penaltyDailyRateFcfa)}/j`,
      `+${formatMoney(data.pricing.totalPenaltyFcfa)}`,
      false,
      true
    );
  }

  // Row 6: Insurance & Assistance 24/7
  printRow(
    'Assurance Tous Risques, Bris de glace, Vol & Assistance 24/7 (Afrique & Corridors)',
    'Couverture 100%',
    'Inclus d’office',
    `0 ${currInfo.symbol} (Inclus)`
  );

  y += 2;

  // Subtotal & Total Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(pageWidth - margin - 85, y, 85, 23, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth - margin - 85, y, 85, 23, 2, 2, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Sous-total des prestations :', pageWidth - margin - 80, y + 4.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatMoney(data.pricing.subtotalBeforePenalty), pageWidth - margin - 4, y + 4.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Pénalités de dépassement :', pageWidth - margin - 80, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(data.pricing.totalPenaltyFcfa > 0 ? 180 : 71, data.pricing.totalPenaltyFcfa > 0 ? 83 : 85, data.pricing.totalPenaltyFcfa > 0 ? 9 : 105);
  doc.text(formatMoney(data.pricing.totalPenaltyFcfa), pageWidth - margin - 4, y + 9, { align: 'right' });

  // Thin line
  doc.setDrawColor(203, 213, 225);
  doc.line(pageWidth - margin - 83, y + 11.5, pageWidth - margin - 2, y + 11.5);

  // Total TTC Highlight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL NET TTC :', pageWidth - margin - 80, y + 16.5);
  doc.setFontSize(10.5);
  doc.setTextColor(13, 148, 136); // teal 600
  doc.text(formatMoney(data.pricing.totalAmountFcfa), pageWidth - margin - 4, y + 16.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text(`TVA 18% & taxes incluses • Devise : ${currInfo.code}`, pageWidth - margin - 80, y + 20.5);

  // Left side of Totals: Caution / Dépôt de garantie badge
  doc.setFillColor(254, 243, 199); // amber 100
  doc.roundedRect(margin, y, contentWidth - 89, 23, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11); // amber 500
  doc.roundedRect(margin, y, contentWidth - 89, 23, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(146, 64, 14); // amber 800
  doc.text('CAUTION & DÉPÔT DE GARANTIE SÉQUESTRE', margin + 3.5, y + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 53, 15);
  doc.text(
    `Montant bloqué au départ : ${formatMoney(data.pricing.depositFcfa)} (Non encaissé / Déposé en séquestre).`,
    margin + 3.5,
    y + 9.5
  );
  doc.text(
    'Modalités : Empreinte carte, Mobile Money, chèque ou espèces.',
    margin + 3.5,
    y + 13.5
  );
  doc.text(
    'Restitution intégrale à la remise des clés suite à l’état des lieux contradictoire.',
    margin + 3.5,
    y + 17.5
  );

  y += 27;

  // 7. CONTRACTUAL CLAUSE: OVERSTAY & PENALTY CONDITIONS BOX
  doc.setFillColor(255, 251, 235); // amber 50
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'F');
  doc.setDrawColor(245, 158, 11); // amber 500
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 25, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(146, 64, 14); // amber 800
  doc.text('CLAUSE CONTRACTUELLE STRICTE : HORAIRES DE RESTITUTION & PÉNALITÉS DE DÉPASSEMENT', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(120, 53, 15);

  const clause1 = '1. Franchise de tolérance : Une courtoisie contractuelle de 2 (deux) heures maximum est accordée au client pour la restitution du véhicule au lieu convenu.';
  const clause2 = `2. Dépassement d'horaire journalier : Si l’horaire effectif de restitution dépasse la tolérance de 2h, une journée additionnelle est automatiquement décomptée au tarif standard.`;
  const clause3 = `3. Pénalité de retard non déclaré : Toute non-restitution non signalée à la centrale 24h avant l'échéance fait l'objet d'une majoration contractuelle de plein droit de +35% sur le tarif journalier de base, soit ${formatMoney(data.pricing.penaltyDailyRateFcfa)} par tranche de 24 heures entamée.`;
  const clause4 = '4. Prolongation anticipée : Pour prolonger la location aux tarifs réguliers dégressifs, le client doit contacter la centrale JMF au moins 24 heures avant l’heure de sortie contractuelle.';

  doc.text(clause1, margin + 4, y + 9.5);
  doc.text(clause2, margin + 4, y + 13.5);
  doc.text(clause3, margin + 4, y + 17.5);
  doc.text(clause4, margin + 4, y + 21.5);

  y += 29;

  // 8. Signatures & Approvals Section
  const sigBoxWidth = (contentWidth - 4) / 2;
  const sigBoxHeight = 22;

  // Left: Client Signature Box
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, sigBoxWidth, sigBoxHeight, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, sigBoxWidth, sigBoxHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('ACCORD DU CLIENT (BON POUR ACCORD & DEVIS)', margin + 3.5, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('Mention manuscrite « Bon pour accord, lu et approuvé » & Signature :', margin + 3.5, y + 8.5);

  // Right: JMF Mobility Seal & Validation
  const sig2X = margin + sigBoxWidth + 4;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(sig2X, y, sigBoxWidth, sigBoxHeight, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(sig2X, y, sigBoxWidth, sigBoxHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(15, 23, 42);
  doc.text('VISA & CACHET JMF MOBILITY SERVICES S.A.', sig2X + 3.5, y + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(13, 148, 136);
  doc.text('Réservation certifiée sous réserve de disponibilité au versement de l’acompte.', sig2X + 3.5, y + 8.5);

  // Stamp Simulation Badge
  doc.setFillColor(240, 253, 250);
  doc.roundedRect(sig2X + sigBoxWidth - 34, y + 10, 31, 10, 1, 1, 'F');
  doc.setDrawColor(13, 148, 136);
  doc.roundedRect(sig2X + sigBoxWidth - 34, y + 10, 31, 10, 1, 1, 'S');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(5.5);
  doc.setTextColor(13, 148, 136);
  doc.text('JMF MOBILITY SERVICES', sig2X + sigBoxWidth - 18.5, y + 13.5, { align: 'center' });
  doc.setFontSize(4.5);
  doc.setTextColor(71, 85, 105);
  doc.text('DIRECTION COMMERCIALE', sig2X + sigBoxWidth - 18.5, y + 16.5, { align: 'center' });
  doc.text('SERVICE OPÉRATIONS FLOTTE', sig2X + sigBoxWidth - 18.5, y + 18.8, { align: 'center' });

  // 9. Document Footer
  const footerY = pageHeight - 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(148, 163, 184);
  const footerText = 'JMF Mobility Services • Société par Actions Simplifiée • Hub International de Mobilité & Gestion de Flotte • contact@jmfmobilityservices.com';
  doc.text(footerText, pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Page 1/1 • Réf. Devis : ${data.reference || 'DEV-2026-001'}`, pageWidth - margin, footerY, { align: 'right' });

  // Save / Download PDF file
  const fileName = `Devis_Location_JMF_${(data.reference || 'DEV-2026').replace(/[^a-zA-Z0-9_-]/g, '_')}_${data.vehicle.brand}_${data.vehicle.model}.pdf`;
  doc.save(fileName);
}
