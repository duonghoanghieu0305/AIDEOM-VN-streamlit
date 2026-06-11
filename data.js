// =============================================================
// AIDEOM-VN · Shared data (macro, sectors, regions)
// =============================================================

const VN_MACRO = [
  { year: 2020, gdp: 8044.4, growth: 2.91, fdi: 19.98, exports: 282.6, digital_share: 12.0 },
  { year: 2021, gdp: 8487.5, growth: 2.58, fdi: 19.74, exports: 336.3, digital_share: 12.7 },
  { year: 2022, gdp: 9513.3, growth: 8.02, fdi: 22.40, exports: 371.3, digital_share: 14.3 },
  { year: 2023, gdp: 10221.8, growth: 5.05, fdi: 23.18, exports: 355.5, digital_share: 16.5 },
  { year: 2024, gdp: 11511.9, growth: 7.09, fdi: 25.35, exports: 405.5, digital_share: 18.3 },
  { year: 2025, gdp: 12847.6, growth: 8.02, fdi: 27.60, exports: 475.0, digital_share: 19.5 },
];

const VN_SECTORS = [
  { id: 1,  name: 'Nông nghiệp',          short: 'NN',  share: 11.86, growth: 3.27, ai_exposure: 23.7, color: '#65a30d' },
  { id: 2,  name: 'Sản xuất chế biến',    short: 'SX',  share: 24.50, growth: 8.24, ai_exposure: 42.9, color: '#f97316' },
  { id: 3,  name: 'Xây dựng',             short: 'XD',  share: 6.40,  growth: 7.50, ai_exposure: 18.5, color: '#a855f7' },
  { id: 4,  name: 'Bán lẻ & DV',          short: 'BL',  share: 10.20, growth: 6.50, ai_exposure: 26.9, color: '#ec4899' },
  { id: 5,  name: 'Vận tải',              short: 'VT',  share: 5.30,  growth: 6.80, ai_exposure: 23.8, color: '#22d3ee' },
  { id: 6,  name: 'Tài chính - NH',       short: 'TC',  share: 5.20,  growth: 7.20, ai_exposure: 31.3, color: '#a855f7' },
  { id: 7,  name: 'CNTT - Số',            short: 'IT',  share: 4.80,  growth: 12.5, ai_exposure: 27.3, color: '#06b6d4' },
  { id: 8,  name: 'Giáo dục',             short: 'GD',  share: 4.50,  growth: 5.00, ai_exposure: 22.2, color: '#10b981' },
  { id: 9,  name: 'Y tế',                 short: 'YT',  share: 3.50,  growth: 6.20, ai_exposure: 35.7, color: '#ef4444' },
  { id: 10, name: 'Khác',                 short: 'KH',  share: 23.74, growth: 5.30, ai_exposure: 20.0, color: '#94a3b8' }
];

const VN_REGIONS = [
  { id: 1, name: 'Trung du miền núi phía Bắc', short: 'TDMNPB', grdp_pc: 57.0, fdi: 3.5,  digital: 38, ai: 22, labor: 21.5, rd: 0.18, internet: 72, gini: 0.405 },
  { id: 2, name: 'Đồng bằng sông Hồng',         short: 'ĐBSH',   grdp_pc: 152.3, fdi: 20.0, digital: 78, ai: 68, labor: 36.8, rd: 0.85, internet: 92, gini: 0.358 },
  { id: 3, name: 'Bắc Trung Bộ + DH miền Trung', short: 'BTB+DH', grdp_pc: 87.5, fdi: 8.2,  digital: 55, ai: 40, labor: 27.5, rd: 0.32, internet: 84, gini: 0.372 },
  { id: 4, name: 'Tây Nguyên',                   short: 'TN',     grdp_pc: 68.9, fdi: 0.8,  digital: 32, ai: 18, labor: 18.2, rd: 0.15, internet: 68, gini: 0.412 },
  { id: 5, name: 'Đông Nam Bộ',                  short: 'ĐNB',    grdp_pc: 158.9, fdi: 18.5, digital: 82, ai: 75, labor: 42.5, rd: 0.78, internet: 94, gini: 0.385 },
  { id: 6, name: 'Đồng bằng sông Cửu Long',      short: 'ĐBSCL',  grdp_pc: 80.5, fdi: 2.1,  digital: 48, ai: 30, labor: 16.8, rd: 0.22, internet: 78, gini: 0.392 }
];
