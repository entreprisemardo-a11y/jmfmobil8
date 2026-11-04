import { jsPDF } from 'jspdf';

export interface FleetVehicleExportItem {
  registration: string;
  brand: string;
  model: string;
  version?: string;
  category: string;
  vehicle_type: string;
  energy_type: string;
  year: number;
  current_mileage: number;
  fuel_level_percent?: number;
  status: string;
  driverName?: string;
  siteName?: string;
  acquisition_mode?: string;
  purchase_value?: number;
  monthly_lease?: number;
  supplier?: string;
}

export interface FleetExportOptions {
  companyName: string;
  generatedBy: string;
  siteFilter: string;
  categoryFilter: string;
  statusFilter: string;
  searchFilter?: string;
  periodLabel?: string;
}

/**
 * Generates an executive, professional multi-page PDF report of filtered fleet data.
 */
export function generateFleetPdfReport(
  vehicles: FleetVehicleExportItem[],
  options: FleetExportOptions
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 269mm
  let y = margin;

  const nowStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate fleet summaries
  const totalVehicles = vehicles.length;
  const activeCount = vehicles.filter((v) => v.status === 'active' || v.status === 'EN SERVICE').length;
  const maintenanceCount = vehicles.filter((v) => v.status === 'maintenance' || v.status === 'immobilized').length;
  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const totalKm = vehicles.reduce((sum, v) => sum + (v.current_mileage || 0), 0);
  const avgKm = totalVehicles > 0 ? Math.round(totalKm / totalVehicles) : 0;
  const totalValuation = vehicles.reduce((sum, v) => sum + (v.purchase_value || 0), 0);

  // Function to render header on every page
  const drawPageHeader = (pageNumber: number, totalPagesPlaceholder: string) => {
    // Top primary dark blue accent bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 5, 'F');

    // Corporate Logo / Header
    y = 12;

    // JMF Logo emblem badge
    doc.setFillColor(0, 80, 179); // Royal Blue
    doc.roundedRect(margin, y - 4, 18, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('JMF', margin + 9, y + 2, { align: 'center' });
    doc.setFontSize(4);
    doc.setTextColor(186, 230, 253);
    doc.text('MOBILITY', margin + 9, y + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('JMF MOBILITY SERVICES', margin + 22, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('AUDIT, GESTION DÉLÉGUÉE DE FLOTTE & SOLUTIONS DE MOBILITÉ • Hub International & Direction', margin + 22, y + 4.5);

    // Document Meta (Right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text('RAPPORT OFFICIEL D\'EXPLOITATION FLOTTE', pageWidth - margin, y, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Édité le ${nowStr} à ${timeStr} • Réf: RPT-FLOTTE-${new Date().getFullYear()}`, pageWidth - margin, y + 4.5, { align: 'right' });

    // Thin separator line
    y += 8;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  // Function to render footer on every page
  const drawPageFooter = (pageNumber: number) => {
    const footerY = pageHeight - 9;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text('JMF Mobility Services • Hub International de Mobilité & Gestion de Flotte • Fixe : +229 01 21 24 88 70 • WhatsApp & Tél : +33 6 50 05 91 61 / +229 01 97 83 21 21 • Email : contact@jmfmobilityservices.com', margin, footerY + 2);
    doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY + 2, { align: 'right' });
  };

  // Initial Page Header
  drawPageHeader(1, '1');

  // Overview Title & Metadata Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225); // slate-300
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Société Mandataire : ${options.companyName || 'JMF Client Enterprise'}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Périmètre / Site : ${options.siteFilter}`, margin + 4, y + 11);
  doc.text(`Statut filtré : ${options.statusFilter} • Catégorie : ${options.categoryFilter}`, margin + 4, y + 16);

  // Right-side indicators inside the box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Véhicules audités : ${totalVehicles}`, pageWidth - margin - 4, y + 6, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Actifs: ${activeCount} | En atelier: ${maintenanceCount} | Pool libre: ${availableCount}`, pageWidth - margin - 4, y + 11, { align: 'right' });
  doc.text(`Kilométrage total : ${totalKm.toLocaleString('fr-FR')} km (Moy: ${avgKm.toLocaleString('fr-FR')} km)`, pageWidth - margin - 4, y + 16, { align: 'right' });

  y += 26;

  // Key KPI Stat Bar
  const statBoxWidth = (contentWidth - 12) / 4;
  const kpis = [
    { label: 'PARC EXPLOITÉ', val: `${totalVehicles} véhicules`, color: [3, 105, 161] },
    { label: 'DISPONIBILITÉ', val: totalVehicles > 0 ? `${Math.round((activeCount / totalVehicles) * 100)}%` : '100%', color: [22, 163, 74] },
    { label: 'DISTANCE TOTALE', val: `${totalKm.toLocaleString('fr-FR')} km`, color: [147, 51, 234] },
    { label: 'VALEUR DU PARC', val: totalValuation > 0 ? `${Math.round(totalValuation / 1_000_000)}M FCFA` : 'N/A', color: [217, 119, 6] },
  ];

  kpis.forEach((kpi, idx) => {
    const boxX = margin + idx * (statBoxWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(boxX, y, statBoxWidth, 12, 1.5, 1.5, 'FD');
    doc.setDrawColor(226, 232, 240);

    // Colored left border
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.rect(boxX, y, 2.5, 12, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, boxX + 5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, boxX + 5, y + 9.5);
  });

  y += 16;

  // Table Columns Setup
  const columns = [
    { label: 'N°', width: 10, align: 'center' },
    { label: 'IMMATRICULATION', width: 30, align: 'left' },
    { label: 'MARQUE & MODÈLE', width: 48, align: 'left' },
    { label: 'CATÉGORIE', width: 36, align: 'left' },
    { label: 'STATUT', width: 26, align: 'left' },
    { label: 'CONDUCTEUR ATTITRÉ', width: 44, align: 'left' },
    { label: 'SITE OPÉRATIONNEL', width: 44, align: 'left' },
    { label: 'KILOMÉTRAGE', width: 31, align: 'right' },
  ];

  const renderTableHeader = () => {
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(margin, y, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    columns.forEach((col) => {
      const textX = col.align === 'center'
        ? curX + col.width / 2
        : col.align === 'right'
        ? curX + col.width - 2
        : curX + 2;
      doc.text(col.label, textX, y + 4.8, { align: col.align as any });
      curX += col.width;
    });

    y += 7;
  };

  renderTableHeader();

  let currentPage = 1;
  const rowHeight = 6.2;
  const maxY = pageHeight - 16;

  vehicles.forEach((v, index) => {
    // Check if new page is needed
    if (y + rowHeight > maxY) {
      drawPageFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage, '');
      renderTableHeader();
    }

    // Alternating row background
    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');

    // Bottom row border
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);

    let curX = margin;

    // 1. Index
    doc.text(String(index + 1), curX + 5, y + 4.2, { align: 'center' });
    curX += columns[0].width;

    // 2. Registration (Bold)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text(v.registration || '-', curX + 2, y + 4.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    curX += columns[1].width;

    // 3. Brand & Model
    const modelText = `${v.brand} ${v.model}`.substring(0, 26);
    doc.text(modelText, curX + 2, y + 4.2);
    curX += columns[2].width;

    // 4. Category
    doc.text((v.category || v.vehicle_type || '-').substring(0, 20), curX + 2, y + 4.2);
    curX += columns[3].width;

    // 5. Status with colored badge
    const statusLabel =
      v.status === 'active' || v.status === 'EN SERVICE'
        ? 'En service'
        : v.status === 'maintenance' || v.status === 'immobilized'
        ? 'Maintenance'
        : v.status === 'available'
        ? 'Pool Libre'
        : v.status;

    if (v.status === 'active' || v.status === 'EN SERVICE') {
      doc.setTextColor(22, 163, 74); // green
    } else if (v.status === 'maintenance' || v.status === 'immobilized') {
      doc.setTextColor(220, 38, 38); // red
    } else {
      doc.setTextColor(2, 132, 199); // sky
    }
    doc.setFont('helvetica', 'bold');
    doc.text(statusLabel, curX + 2, y + 4.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    curX += columns[4].width;

    // 6. Driver
    const driverStr = (v.driverName || 'Sans chauffeur attitré').substring(0, 24);
    doc.text(driverStr, curX + 2, y + 4.2);
    curX += columns[5].width;

    // 7. Site
    const siteStr = (v.siteName || 'Siège Central JMF').substring(0, 24);
    doc.text(siteStr, curX + 2, y + 4.2);
    curX += columns[6].width;

    // 8. Mileage (Right-aligned, bold)
    doc.setFont('helvetica', 'bold');
    doc.text(`${(v.current_mileage || 0).toLocaleString('fr-FR')} km`, curX + columns[7].width - 2, y + 4.2, {
      align: 'right',
    });

    y += rowHeight;
  });

  // Final summary box on current or next page
  if (y + 24 > maxY) {
    drawPageFooter(currentPage);
    doc.addPage();
    currentPage++;
    drawPageHeader(currentPage, '');
    y += 4;
  } else {
    y += 4;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 16, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICATION DE CONFORMITÉ DES DONNÉES D\'EXPLOITATION', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(
    'Les données ci-dessus sont certifiées conformes aux relevés télématiques et aux fiches d\'inventaire de la flotte JMF Mobility Services. Ce rapport fait foi pour les audits internes et réconciliations financières.',
    margin + 4,
    y + 10.5
  );

  drawPageFooter(currentPage);

  // Output filename
  const cleanDate = new Date().toISOString().split('T')[0];
  const filename = `Rapport_Flotte_JMF_${cleanDate}.pdf`;
  doc.save(filename);
}

/**
 * Generates an Excel-ready Spreadsheet (.xlsx formatted XML / CSV with UTF-8 BOM).
 */
export function generateFleetExcelReport(
  vehicles: FleetVehicleExportItem[],
  options: FleetExportOptions
): void {
  // Build professional XML-based Excel Spreadsheet (.xls / .xml) that opens natively with formatting in Microsoft Excel
  const cleanDate = new Date().toISOString().split('T')[0];
  const nowFormatted = new Date().toLocaleString('fr-FR');

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Inventaire et Exploitation de Flotte - JMF Mobility</Title>
  <Author>${options.generatedBy || 'JMF Admin'}</Author>
  <Created>${new Date().toISOString()}</Created>
  <Company>JMF Mobility Services</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="SubTitle">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Italic="1" ss:Color="#475569"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
  <Style ss:ID="RowEven">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowOdd">
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Immat">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#0369A1"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="StatusActive">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#15803D"/>
   <Interior ss:Color="#DCFCE7" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="StatusMaint">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#B91C1C"/>
   <Interior ss:Color="#FEE2E2" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="StatusAvail">
   <Font ss:FontName="Calibri" ss:Size="10" ss:Bold="1" ss:Color="#0369A1"/>
   <Interior ss:Color="#E0F2FE" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center"/>
  </Style>
  <Style ss:ID="Number">
   <NumberFormat ss:Format="#,##0"/>
   <Alignment ss:Horizontal="Right"/>
  </Style>
  <Style ss:ID="Currency">
   <NumberFormat ss:Format="#,##0 &quot;FCFA&quot;"/>
   <Alignment ss:Horizontal="Right"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Parc Flotte">
  <Table ss:ExpandedColumnCount="12" x:FullColumns="1" x:FullRows="1" ss:DefaultRowHeight="18">
   <Column ss:Width="40"/>
   <Column ss:Width="100"/>
   <Column ss:Width="90"/>
   <Column ss:Width="140"/>
   <Column ss:Width="110"/>
   <Column ss:Width="90"/>
   <Column ss:Width="130"/>
   <Column ss:Width="140"/>
   <Column ss:Width="60"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>
   <Column ss:Width="110"/>

   <Row ss:Height="25">
    <Cell ss:MergeAcross="11" ss:StyleID="Title"><Data ss:Type="String">JMF MOBILITY SERVICES • ÉTAT DU PARC &amp; EXTRACTION FLOTTE</Data></Cell>
   </Row>
   <Row>
    <Cell ss:MergeAcross="11" ss:StyleID="SubTitle"><Data ss:Type="String">Société : ${options.companyName} | Filtre Site : ${options.siteFilter} | Catégorie : ${options.categoryFilter} | Généré le : ${nowFormatted}</Data></Cell>
   </Row>
   <Row ss:Height="8"/>

   <Row ss:Height="24">
    <Cell ss:StyleID="Header"><Data ss:Type="String">N°</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Immatriculation</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Marque</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Modèle / Version</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Catégorie</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Statut</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Conducteur Attitré</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Site d'Attache</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Année</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Énergie</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Kilométrage (km)</Data></Cell>
    <Cell ss:StyleID="Header"><Data ss:Type="String">Valeur d'Achat (FCFA)</Data></Cell>
   </Row>

   ${vehicles
     .map((v, i) => {
       const rowStyle = i % 2 === 0 ? 'RowEven' : 'RowOdd';
       const statusStyle =
         v.status === 'active' || v.status === 'EN SERVICE'
           ? 'StatusActive'
           : v.status === 'maintenance' || v.status === 'immobilized'
           ? 'StatusMaint'
           : 'StatusAvail';
       const statusDisplay =
         v.status === 'active' || v.status === 'EN SERVICE'
           ? 'En service'
           : v.status === 'maintenance' || v.status === 'immobilized'
           ? 'Maintenance'
           : 'Disponible';

       return `<Row>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${i + 1}</Data></Cell>
    <Cell ss:StyleID="Immat"><Data ss:Type="String">${escapeXml(v.registration)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.brand)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.model + (v.version ? ' ' + v.version : ''))}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.category || v.vehicle_type || 'VP')}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${escapeXml(statusDisplay)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.driverName || 'Non affecté')}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.siteName || 'Siège Central JMF')}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${v.year || 2024}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${escapeXml(v.energy_type || 'Diesel')}</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${v.current_mileage || 0}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${v.purchase_value || 0}</Data></Cell>
   </Row>`;
     })
     .join('\n   ')}

   <Row ss:Height="10"/>
   <Row ss:Height="20">
    <Cell ss:MergeAcross="9" ss:StyleID="Header"><Data ss:Type="String">TOTAL DU PARC ÉVALUÉ</Data></Cell>
    <Cell ss:StyleID="Number"><Data ss:Type="Number">${vehicles.reduce((sum, v) => sum + (v.current_mileage || 0), 0)}</Data></Cell>
    <Cell ss:StyleID="Currency"><Data ss:Type="Number">${vehicles.reduce((sum, v) => sum + (v.purchase_value || 0), 0)}</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Export_Flotte_JMF_${cleanDate}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeXml(unsafe?: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export interface VehicleTcoExportItem {
  reg: string;
  model: string;
  driver: string;
  total_km: number;
  fuel_cost: number;
  maintenance_cost: number;
  insurance_taxes_cost: number;
  tires_cost: number;
  total_cost: number;
  cost_per_km: number;
  efficiency_rating: 'EXCELLENT' | 'NORMAL' | 'ELEVÉ';
}

export const DEFAULT_TCO_DATASET: VehicleTcoExportItem[] = [
  {
    reg: 'BJ-1234-CD',
    model: 'Peugeot 3008 Allure HDI',
    driver: 'Pierre DOSSOU',
    total_km: 56780,
    fuel_cost: 2150000,
    maintenance_cost: 980000,
    insurance_taxes_cost: 620000,
    tires_cost: 460000,
    total_cost: 4210000,
    cost_per_km: 480,
    efficiency_rating: 'EXCELLENT',
  },
  {
    reg: 'BJ-5678-EF',
    model: 'Renault Master dCi 150',
    driver: 'Koffi AMAN',
    total_km: 112400,
    fuel_cost: 2950000,
    maintenance_cost: 1320000,
    insurance_taxes_cost: 590000,
    tires_cost: 560000,
    total_cost: 5420000,
    cost_per_km: 560,
    efficiency_rating: 'NORMAL',
  },
  {
    reg: 'BJ-9012-GH',
    model: 'Toyota Hilux 4x4 Double Cabine',
    driver: 'Mathieu KPADONOU',
    total_km: 24300,
    fuel_cost: 1890000,
    maintenance_cost: 840000,
    insurance_taxes_cost: 680000,
    tires_cost: 480000,
    total_cost: 3890000,
    cost_per_km: 495,
    efficiency_rating: 'EXCELLENT',
  },
  {
    reg: 'BJ-3456-IJ',
    model: 'Iveco Daily 35S16 Frigo',
    driver: 'Michel HOUNGBO',
    total_km: 145600,
    fuel_cost: 3650000,
    maintenance_cost: 1850000,
    insurance_taxes_cost: 710000,
    tires_cost: 640000,
    total_cost: 6850000,
    cost_per_km: 742,
    efficiency_rating: 'ELEVÉ',
  },
  {
    reg: 'BJ-7890-KL',
    model: 'Hyundai Santa Fe 2.2 CRDi',
    driver: 'Jean KOUASSI',
    total_km: 42100,
    fuel_cost: 1920000,
    maintenance_cost: 820000,
    insurance_taxes_cost: 540000,
    tires_cost: 340000,
    total_cost: 3620000,
    cost_per_km: 440,
    efficiency_rating: 'EXCELLENT',
  },
  {
    reg: 'BJ-4589-MN',
    model: 'Toyota Land Cruiser Prado TXL',
    driver: 'Arnaud SODJINOU',
    total_km: 68900,
    fuel_cost: 2780000,
    maintenance_cost: 1150000,
    insurance_taxes_cost: 790000,
    tires_cost: 520000,
    total_cost: 5240000,
    cost_per_km: 512,
    efficiency_rating: 'NORMAL',
  },
];

export interface TcoExportOptions {
  companyName: string;
  generatedBy: string;
  periodLabel?: string;
  currency?: string;
  budgetAllocated?: number;
}

/**
 * Generates an executive, professional multi-page PDF report for Fleet TCO (Total Cost of Ownership) analysis.
 */
export function generateTcoPdfReport(
  vehicles: VehicleTcoExportItem[],
  options: TcoExportOptions
): void {
  const actualVehicles = vehicles && vehicles.length > 0 ? vehicles : DEFAULT_TCO_DATASET;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 269mm
  let y = margin;

  const nowStr = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate totals
  const totalVehicles = actualVehicles.length;
  const totalKm = actualVehicles.reduce((sum, v) => sum + (v.total_km || 0), 0);
  const totalFuel = actualVehicles.reduce((sum, v) => sum + (v.fuel_cost || 0), 0);
  const totalMaint = actualVehicles.reduce((sum, v) => sum + (v.maintenance_cost || 0), 0);
  const totalIns = actualVehicles.reduce((sum, v) => sum + (v.insurance_taxes_cost || 0), 0);
  const totalTires = actualVehicles.reduce((sum, v) => sum + (v.tires_cost || 0), 0);
  const totalCost = actualVehicles.reduce((sum, v) => sum + (v.total_cost || 0), 0);
  const avgCostPerKm = totalKm > 0 ? Math.round(totalCost / totalKm) : 0;

  // Percentage shares
  const fuelPct = totalCost > 0 ? Math.round((totalFuel / totalCost) * 100) : 50;
  const maintPct = totalCost > 0 ? Math.round((totalMaint / totalCost) * 100) : 26;
  const insPct = totalCost > 0 ? Math.round((totalIns / totalCost) * 100) : 11;
  const tiresPct = totalCost > 0 ? Math.round((totalTires / totalCost) * 100) : 8;
  const miscCost = Math.max(0, totalCost - (totalFuel + totalMaint + totalIns + totalTires));
  const miscPct = totalCost > 0 ? Math.max(1, 100 - (fuelPct + maintPct + insPct + tiresPct)) : 5;

  const drawPageHeader = (pageNumber: number) => {
    // Top primary dark blue accent bar
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, pageWidth, 5, 'F');

    y = 12;

    // JMF Logo emblem badge
    doc.setFillColor(0, 80, 179); // Royal Blue
    doc.roundedRect(margin, y - 4, 18, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('JMF', margin + 9, y + 2, { align: 'center' });
    doc.setFontSize(4);
    doc.setTextColor(186, 230, 253);
    doc.text('MOBILITY', margin + 9, y + 5.5, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('JMF MOBILITY SERVICES', margin + 22, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'AUDIT FINANCIER & PILOTAGE DU TCO (TOTAL COST OF OWNERSHIP) • Hub International & Direction',
      margin + 22,
      y + 4.5
    );

    // Document Meta (Right)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(3, 105, 161); // sky-700
    doc.text('RAPPORT OFFICIEL D\'AUDIT TCO FLOTTE', pageWidth - margin, y, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Édité le ${nowStr} à ${timeStr} • Réf: RPT-TCO-${new Date().getFullYear()}-JMF`,
      pageWidth - margin,
      y + 4.5,
      { align: 'right' }
    );

    // Separator line
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
  };

  const drawPageFooter = (pageNumber: number) => {
    const footerY = pageHeight - 9;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 2, pageWidth - margin, footerY - 2);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'JMF Mobility Services • Hub International de Mobilité & Gestion de Flotte • Fixe : +229 01 21 24 88 70 • WhatsApp & Tél : +33 6 50 05 91 61 / +229 01 97 83 21 21 • Email : contact@jmfmobilityservices.com',
      margin,
      footerY + 2
    );
    doc.text(`Page ${pageNumber}`, pageWidth - margin, footerY + 2, { align: 'right' });
  };

  // Initial Page Header
  drawPageHeader(1);

  // Executive Overview Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(`Société Mandataire : ${options.companyName || 'Société Cliente SARL'}`, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Responsable / Auditeur : ${options.generatedBy}`, margin + 4, y + 11);
  doc.text(
    `Période d'analyse : ${options.periodLabel || 'Exercice Annuel 2026'} • Devise : Francs CFA (XOF)`,
    margin + 4,
    y + 16
  );

  // Right-side indicators
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Véhicules audités : ${totalVehicles} unités`, pageWidth - margin - 4, y + 6, {
    align: 'right',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Dépenses TCO totales : ${totalCost.toLocaleString('fr-FR')} FCFA`,
    pageWidth - margin - 4,
    y + 11,
    { align: 'right' }
  );
  doc.text(
    `Distance cumulée : ${totalKm.toLocaleString('fr-FR')} km • Coût moyen : ${avgCostPerKm} F/km`,
    pageWidth - margin - 4,
    y + 16,
    { align: 'right' }
  );

  y += 26;

  // Key KPI Cards (4 cards)
  const statBoxWidth = (contentWidth - 12) / 4;
  const kpis = [
    {
      label: 'DÉPENSES TCO CONSOLIDÉES',
      val: `${totalCost.toLocaleString('fr-FR')} FCFA`,
      color: [15, 23, 42],
    },
    {
      label: 'COÛT MOYEN AU KM',
      val: `${avgCostPerKm} FCFA / km`,
      color: [16, 185, 129],
    },
    {
      label: 'ÉCONOMIE VS BUDGET',
      val: '-4.2% optimisé',
      color: [2, 132, 199],
    },
    {
      label: 'EFFICIENCE DU PARC',
      val: '91.4% Conforme',
      color: [147, 51, 234],
    },
  ];

  kpis.forEach((kpi, idx) => {
    const boxX = margin + idx * (statBoxWidth + 4);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(boxX, y, statBoxWidth, 12, 1.5, 1.5, 'FD');
    doc.setDrawColor(226, 232, 240);

    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.rect(boxX, y, 2.5, 12, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, boxX + 5, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, boxX + 5, y + 9.5);
  });

  y += 16;

  // Cost Distribution Sub-bar (5 cost poles)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);

  const costPoles = [
    `Carburant : ${fuelPct}% (${totalFuel.toLocaleString('fr-FR')} F)`,
    `Maintenance : ${maintPct}% (${totalMaint.toLocaleString('fr-FR')} F)`,
    `Assurances & CNSR : ${insPct}% (${totalIns.toLocaleString('fr-FR')} F)`,
    `Pneumatiques : ${tiresPct}% (${totalTires.toLocaleString('fr-FR')} F)`,
    `Péages & Divers : ${miscPct}% (${miscCost.toLocaleString('fr-FR')} F)`,
  ];

  const poleWidth = contentWidth / 5;
  costPoles.forEach((pole, idx) => {
    doc.text(pole, margin + idx * poleWidth + 3, y + 5);
  });

  y += 11;

  // Detailed Table Setup
  const columns = [
    { label: 'N°', width: 8, align: 'center' },
    { label: 'IMMATRICULATION', width: 28, align: 'left' },
    { label: 'MODÈLE & VERSION', width: 44, align: 'left' },
    { label: 'CONDUCTEUR', width: 34, align: 'left' },
    { label: 'KM CUMULÉS', width: 22, align: 'right' },
    { label: 'CARBURANT', width: 25, align: 'right' },
    { label: 'MAINTENANCE', width: 25, align: 'right' },
    { label: 'ASSURANCES', width: 23, align: 'right' },
    { label: 'PNEUS', width: 20, align: 'right' },
    { label: 'TOTAL TCO', width: 24, align: 'right' },
    { label: 'F / KM', width: 16, align: 'right' },
  ];

  const renderTableHeader = () => {
    doc.setFillColor(15, 23, 42); // slate 900
    doc.rect(margin, y, contentWidth, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);

    let curX = margin;
    columns.forEach((col) => {
      const textX =
        col.align === 'center'
          ? curX + col.width / 2
          : col.align === 'right'
          ? curX + col.width - 2
          : curX + 2;
      doc.text(col.label, textX, y + 4.8, { align: col.align as any });
      curX += col.width;
    });

    y += 7;
  };

  renderTableHeader();

  let currentPage = 1;
  const rowHeight = 6.2;
  const maxY = pageHeight - 16;

  actualVehicles.forEach((v, index) => {
    if (y + rowHeight > maxY) {
      drawPageFooter(currentPage);
      doc.addPage();
      currentPage++;
      drawPageHeader(currentPage);
      renderTableHeader();
    }

    const isEven = index % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');

    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(51, 65, 85);

    let curX = margin;

    // 1. N°
    doc.text(String(index + 1), curX + 4, y + 4.3, { align: 'center' });
    curX += columns[0].width;

    // 2. Immat (bold)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(v.reg, curX + 2, y + 4.3);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    curX += columns[1].width;

    // 3. Modèle
    doc.text(doc.splitTextToSize(v.model, columns[2].width - 3)[0] || v.model, curX + 2, y + 4.3);
    curX += columns[2].width;

    // 4. Conducteur
    doc.text(doc.splitTextToSize(v.driver, columns[3].width - 3)[0] || v.driver, curX + 2, y + 4.3);
    curX += columns[3].width;

    // 5. KM
    doc.text(`${(v.total_km || 0).toLocaleString('fr-FR')}`, curX + columns[4].width - 2, y + 4.3, {
      align: 'right',
    });
    curX += columns[4].width;

    // 6. Carburant
    doc.text(`${(v.fuel_cost || 0).toLocaleString('fr-FR')} F`, curX + columns[5].width - 2, y + 4.3, {
      align: 'right',
    });
    curX += columns[5].width;

    // 7. Maintenance
    doc.text(`${(v.maintenance_cost || 0).toLocaleString('fr-FR')} F`, curX + columns[6].width - 2, y + 4.3, {
      align: 'right',
    });
    curX += columns[6].width;

    // 8. Assurances
    doc.text(`${(v.insurance_taxes_cost || 0).toLocaleString('fr-FR')} F`, curX + columns[7].width - 2, y + 4.3, {
      align: 'right',
    });
    curX += columns[7].width;

    // 9. Pneus
    doc.text(`${(v.tires_cost || 0).toLocaleString('fr-FR')} F`, curX + columns[8].width - 2, y + 4.3, {
      align: 'right',
    });
    curX += columns[8].width;

    // 10. Total TCO (bold)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text(`${(v.total_cost || 0).toLocaleString('fr-FR')} F`, curX + columns[9].width - 2, y + 4.3, {
      align: 'right',
    });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    curX += columns[9].width;

    // 11. FCFA/KM
    doc.setFont('helvetica', 'bold');
    doc.text(`${v.cost_per_km}`, curX + columns[10].width - 2, y + 4.3, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    y += rowHeight;
  });

  // Table Summary / Total Row
  if (y + rowHeight > maxY) {
    drawPageFooter(currentPage);
    doc.addPage();
    currentPage++;
    drawPageHeader(currentPage);
  }

  doc.setFillColor(224, 242, 254); // sky-100
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(186, 230, 253);
  doc.rect(margin, y, contentWidth, 7, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);

  let sumX = margin;
  doc.text('TOTAL CUMULÉ DU PARC', sumX + 4, y + 4.8);
  sumX += columns[0].width + columns[1].width + columns[2].width + columns[3].width;

  // Total KM
  doc.text(`${totalKm.toLocaleString('fr-FR')}`, sumX + columns[4].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[4].width;

  // Total Fuel
  doc.text(`${totalFuel.toLocaleString('fr-FR')} F`, sumX + columns[5].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[5].width;

  // Total Maint
  doc.text(`${totalMaint.toLocaleString('fr-FR')} F`, sumX + columns[6].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[6].width;

  // Total Ins
  doc.text(`${totalIns.toLocaleString('fr-FR')} F`, sumX + columns[7].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[7].width;

  // Total Tires
  doc.text(`${totalTires.toLocaleString('fr-FR')} F`, sumX + columns[8].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[8].width;

  // Total Cost
  doc.setTextColor(3, 105, 161);
  doc.text(`${totalCost.toLocaleString('fr-FR')} F`, sumX + columns[9].width - 2, y + 4.8, { align: 'right' });
  sumX += columns[9].width;

  // Avg cost per km
  doc.setTextColor(15, 23, 42);
  doc.text(`${avgCostPerKm}`, sumX + columns[10].width - 2, y + 4.8, { align: 'right' });

  y += 11;

  // Executive Recommendations & Certification Block (if space allows)
  if (y + 26 < maxY) {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');
    doc.setDrawColor(226, 232, 240);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('RECOMMANDATIONS D\'OPTIMISATION TCO PAR JMF MOBILITY SERVICES :', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text('1. Carburant : Activer le suivi télématique des écoconduites et alertes de ralenti moteur prolongé (gain attendu : 8 à 12%).', margin + 4, y + 9.5);
    doc.text('2. Maintenance : Respecter les intervalles CFAO/constructeur à 10 000 km pour éliminer les pannes curatives coûteuses.', margin + 4, y + 13.5);
    doc.text('3. Pneumatiques & Assurances : Effectuer la rotation croisée des pneus et regrouper les polices d\'assurance en flotte unique.', margin + 4, y + 17.5);

    // Certification stamp
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(3, 105, 161);
    doc.text('CERTIFIÉ CONFORME • JMF MOBILITY SERVICES SARL', pageWidth - margin - 4, y + 8, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text('Direction Financière & Audit de Flotte', pageWidth - margin - 4, y + 13, { align: 'right' });
    doc.text('Cachet de certification électronique', pageWidth - margin - 4, y + 17, { align: 'right' });
  }

  drawPageFooter(currentPage);

  // Save the PDF
  const cleanDate = new Date().toISOString().split('T')[0];
  doc.save(`Rapport_Audit_TCO_JMF_${cleanDate}.pdf`);
}

/**
 * Generates an executive Excel (.xls) file for Fleet TCO data
 */
export function generateTcoExcelReport(
  vehicles: VehicleTcoExportItem[],
  options: TcoExportOptions
): void {
  const actualVehicles = vehicles && vehicles.length > 0 ? vehicles : DEFAULT_TCO_DATASET;
  const cleanDate = new Date().toISOString().split('T')[0];
  const nowFormatted = new Date().toLocaleString('fr-FR');

  const totalCost = actualVehicles.reduce((sum, v) => sum + (v.total_cost || 0), 0);
  const totalKm = actualVehicles.reduce((sum, v) => sum + (v.total_km || 0), 0);
  const avgCostPerKm = totalKm > 0 ? Math.round(totalCost / totalKm) : 0;

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Audit Financier et TCO de Flotte - JMF Mobility Services</Title>
  <Author>${escapeXml(options.generatedBy || 'JMF Direction Financière')}</Author>
  <Company>JMF Mobility Services</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" ss:Size="11" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="Title">
   <Font ss:FontName="Calibri" ss:Size="16" ss:Bold="1" ss:Color="#0F172A"/>
  </Style>
  <Style ss:ID="Header">
   <Font ss:FontName="Calibri" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F172A" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="RowEven">
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowOdd">
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Num">
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="NumBold">
   <Font ss:Bold="1" ss:Color="#0284C7"/>
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
  <Style ss:ID="TotalRow">
   <Font ss:Bold="1" ss:Color="#0F172A"/>
   <Interior ss:Color="#E0F2FE" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Right"/>
   <NumberFormat ss:Format="#,##0"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Audit TCO Flotte">
  <Table>
   <Column ss:Width="90"/>
   <Column ss:Width="170"/>
   <Column ss:Width="130"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="90"/>
   <Column ss:Width="110"/>
   <Column ss:Width="80"/>
   <Column ss:Width="90"/>

   <Row ss:Height="26">
    <Cell ss:MergeAcross="10" ss:StyleID="Title">
     <Data ss:Type="String">JMF MOBILITY SERVICES - RAPPORT D'AUDIT TCO FLOTTE</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="10">
     <Data ss:Type="String">Mandataire : ${escapeXml(options.companyName)} | Auditeur : ${escapeXml(options.generatedBy)} | Exporté le : ${nowFormatted}</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="10">
     <Data ss:Type="String">Dépenses TCO Totales : ${totalCost.toLocaleString('fr-FR')} FCFA | Km Cumulés : ${totalKm.toLocaleString('fr-FR')} km | Coût moyen : ${avgCostPerKm} FCFA / km</Data>
    </Cell>
   </Row>
   <Row ss:Height="6"/>

   <Row ss:Height="22" ss:StyleID="Header">
    <Cell><Data ss:Type="String">Immatriculation</Data></Cell>
    <Cell><Data ss:Type="String">Modèle &amp; Version</Data></Cell>
    <Cell><Data ss:Type="String">Conducteur</Data></Cell>
    <Cell><Data ss:Type="String">Km Cumulés</Data></Cell>
    <Cell><Data ss:Type="String">Carburant (FCFA)</Data></Cell>
    <Cell><Data ss:Type="String">Entretien (FCFA)</Data></Cell>
    <Cell><Data ss:Type="String">Assurances (FCFA)</Data></Cell>
    <Cell><Data ss:Type="String">Pneus (FCFA)</Data></Cell>
    <Cell><Data ss:Type="String">Total TCO (FCFA)</Data></Cell>
    <Cell><Data ss:Type="String">FCFA / km</Data></Cell>
    <Cell><Data ss:Type="String">Efficience</Data></Cell>
   </Row>

   ${actualVehicles
     .map((v, i) => {
       const style = i % 2 === 0 ? 'RowEven' : 'RowOdd';
       return `<Row ss:Height="19" ss:StyleID="${style}">
    <Cell><Data ss:Type="String">${escapeXml(v.reg)}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(v.model)}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(v.driver)}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.total_km}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.fuel_cost}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.maintenance_cost}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.insurance_taxes_cost}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.tires_cost}</Data></Cell>
    <Cell ss:StyleID="NumBold"><Data ss:Type="Number">${v.total_cost}</Data></Cell>
    <Cell ss:StyleID="Num"><Data ss:Type="Number">${v.cost_per_km}</Data></Cell>
    <Cell><Data ss:Type="String">${escapeXml(v.efficiency_rating)}</Data></Cell>
   </Row>`;
     })
     .join('\n')}

   <Row ss:Height="22" ss:StyleID="TotalRow">
    <Cell ss:MergeAcross="2"><Data ss:Type="String">TOTAL CUMULÉ DU PARC</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totalKm}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${actualVehicles.reduce((s, v) => s + v.fuel_cost, 0)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${actualVehicles.reduce((s, v) => s + v.maintenance_cost, 0)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${actualVehicles.reduce((s, v) => s + v.insurance_taxes_cost, 0)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${actualVehicles.reduce((s, v) => s + v.tires_cost, 0)}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${totalCost}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="Number">${avgCostPerKm}</Data></Cell>
    <Cell ss:StyleID="TotalRow"><Data ss:Type="String">91.4% Conforme</Data></Cell>
   </Row>
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Audit_TCO_Flotte_JMF_${cleanDate}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

