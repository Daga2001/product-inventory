import type { Product, Zone } from '../api/types';

interface ReportInput {
  zones: Zone[];
  products: Product[];
}

const sanitizeSheetName = (name: string) => {
  const cleaned = name.replace(/[\\/?*:[\]]/g, '').trim();
  return cleaned.length ? cleaned.slice(0, 31) : 'Zone';
};

const uniqueSheetName = (base: string, used: Map<string, number>) => {
  const baseName = sanitizeSheetName(base);
  const current = used.get(baseName) ?? 0;
  if (current === 0) {
    used.set(baseName, 1);
    return baseName;
  }
  const next = current + 1;
  used.set(baseName, next);
  const suffix = ` (${next})`;
  return `${baseName.slice(0, 31 - suffix.length)}${suffix}`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toISOString().slice(0, 10);
};

const buildSheet = (workbook: any, title: string, products: Product[], tabColor: string) => {
  const sheet = workbook.addWorksheet(title, {
    properties: { tabColor: { argb: tabColor } }
  });

  sheet.columns = [
    { key: 'name', width: 30 },
    { key: 'batch', width: 18 },
    { key: 'qty', width: 10, style: { alignment: { horizontal: 'center' } } },
    { key: 'expiry', width: 16, style: { alignment: { horizontal: 'center' } } },
    { key: 'created', width: 18, style: { alignment: { horizontal: 'center' } } }
  ];

  sheet.addRow([`Zone: ${title}`]);
  sheet.mergeCells('A1:E1');
  sheet.getRow(1).height = 24;
  sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1F2937' }
  };

  sheet.addRow([`Generated: ${formatDate(new Date().toISOString())}`]);
  sheet.mergeCells('A2:E2');
  sheet.getRow(2).height = 18;
  sheet.getRow(2).font = { size: 11, color: { argb: 'FFE2E8F0' } };
  sheet.getRow(2).alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(2).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF334155' }
  };

  const headerRow = sheet.addRow(['Product', 'Batch', 'Qty', 'Expiration', 'Date Added']);
  headerRow.height = 20;
  headerRow.font = { bold: true, color: { argb: 'FF3B2F23' } };
  headerRow.alignment = { horizontal: 'left', vertical: 'middle' };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF2DEC1' }
  };
  sheet.autoFilter = { from: 'A3', to: 'E3' };

  if (products.length === 0) {
    const emptyRow = sheet.addRow(['No products in this zone.']);
    sheet.mergeCells(`A${emptyRow.number}:E${emptyRow.number}`);
    emptyRow.height = 22;
    emptyRow.font = { italic: true, color: { argb: 'FF6B4E33' } };
    emptyRow.alignment = { horizontal: 'center', vertical: 'middle' };
  } else {
    products.forEach((product, index) => {
      const row = sheet.addRow([
        product.name,
        product.batch_number,
        product.quantity,
        formatDate(product.expiration_date),
        formatDate(product.created_at)
      ]);
      row.height = 20;
      row.alignment = { vertical: 'middle' };
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: index % 2 === 0 ? 'FFFDF7EF' : 'FFF7EAD9' }
      };
    });

    const dataStartRow = 4;
    const dataEndRow = sheet.lastRow?.number ?? dataStartRow;
    const totalRow = sheet.addRow(['Total Quantity', '', { formula: `SUM(C${dataStartRow}:C${dataEndRow})` }, '', '']);
    totalRow.height = 20;
    totalRow.font = { bold: true, color: { argb: 'FF3B2F23' } };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE9D5B7' }
    };
    totalRow.alignment = { vertical: 'middle' };
  }

  sheet.views = [{ state: 'frozen', ySplit: 3 }];
  sheet.eachRow((row: any, rowNumber: number) => {
    if (rowNumber <= 2) return;
    row.eachCell((cell: any) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE5D2B8' } },
        left: { style: 'thin', color: { argb: 'FFE5D2B8' } },
        bottom: { style: 'thin', color: { argb: 'FFE5D2B8' } },
        right: { style: 'thin', color: { argb: 'FFE5D2B8' } }
      };
    });
  });
};

export const downloadInventoryReport = async ({ zones, products }: ReportInput) => {
  const ExcelJSImport = await import('exceljs');
  const ExcelJS = (ExcelJSImport as any).default ?? ExcelJSImport;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Inventory Cupboard Manager';
  workbook.created = new Date();

  const sortedZones = [...zones].sort((a, b) => {
    if (a.position_y !== b.position_y) return a.position_y - b.position_y;
    return a.position_x - b.position_x;
  });

  const productsByZone = new Map<string, Product[]>();
  products.forEach((product) => {
    const key = product.zone_id ?? 'unassigned';
    const existing = productsByZone.get(key) ?? [];
    existing.push(product);
    productsByZone.set(key, existing);
  });

  const usedNames = new Map<string, number>();
  const tabColors = ['FFB4823B', 'FF9C6B3F', 'FFBD8B5C', 'FF8F5F3A', 'FFA97447'];

  sortedZones.forEach((zone, index) => {
    const sheetName = uniqueSheetName(zone.name, usedNames);
    const zoneProducts = productsByZone.get(zone.id) ?? [];
    buildSheet(workbook, sheetName, zoneProducts, tabColors[index % tabColors.length]);
  });

  const unassigned = productsByZone.get('unassigned') ?? [];
  if (unassigned.length > 0) {
    const sheetName = uniqueSheetName('Unassigned', usedNames);
    buildSheet(workbook, sheetName, unassigned, 'FF64748B');
  }

  if (workbook.worksheets.length === 0) {
    const sheet = workbook.addWorksheet('Summary');
    sheet.columns = [{ key: 'message', width: 60 }];
    sheet.addRow(['No zones or products available to report yet.']);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-report-${formatDate(new Date().toISOString())}.xlsx`;
  link.click();
  URL.revokeObjectURL(url);
};
