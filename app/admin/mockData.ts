export const mockUserReports = [
  {
    id: '1',
    created_at: '2025-03-15T10:30:00Z',
    start_year: 2020,
    retirement_year: 2055,
    gender: 'M',
    salary: 6500,
    pension_amount: 3250,
    replacement_rate: 50,
    pdf_downloaded: true,
  },
  {
    id: '2',
    created_at: '2025-03-14T14:20:00Z',
    start_year: 2018,
    retirement_year: 2053,
    gender: 'K',
    salary: 5800,
    pension_amount: 2900,
    replacement_rate: 50,
    pdf_downloaded: false,
  },
  {
    id: '3',
    created_at: '2025-03-13T09:15:00Z',
    start_year: 2015,
    retirement_year: 2060,
    gender: 'M',
    salary: 7200,
    pension_amount: 3600,
    replacement_rate: 50,
    pdf_downloaded: true,
  },
  {
    id: '4',
    created_at: '2025-03-12T16:45:00Z',
    start_year: 2022,
    retirement_year: 2057,
    gender: 'K',
    salary: 4900,
    pension_amount: 2450,
    replacement_rate: 50,
    pdf_downloaded: true,
  },
  {
    id: '5',
    created_at: '2025-03-11T11:00:00Z',
    start_year: 2019,
    retirement_year: 2054,
    gender: 'M',
    salary: 8100,
    pension_amount: 4050,
    replacement_rate: 50,
    pdf_downloaded: false,
  },
  {
    id: '6',
    created_at: '2025-02-28T08:30:00Z',
    start_year: 2017,
    retirement_year: 2052,
    gender: 'K',
    salary: 5200,
    pension_amount: 2600,
    replacement_rate: 50,
    pdf_downloaded: true,
  },
  {
    id: '7',
    created_at: '2025-02-25T13:20:00Z',
    start_year: 2021,
    retirement_year: 2056,
    gender: 'M',
    salary: 9500,
    pension_amount: 4750,
    replacement_rate: 50,
    pdf_downloaded: true,
  },
  {
    id: '8',
    created_at: '2025-02-20T15:10:00Z',
    start_year: 2016,
    retirement_year: 2051,
    gender: 'K',
    salary: 6800,
    pension_amount: 3400,
    replacement_rate: 50,
    pdf_downloaded: false,
  },
];

export const mockEconomicIndicators = [
  { id: '1', indicator_type: 'wage_growth', year: 2024, value: 7.5, source: 'GUS', gender: null, updated_at: '2025-03-01' },
  { id: '2', indicator_type: 'wage_growth', year: 2023, value: 12.8, source: 'GUS', gender: null, updated_at: '2024-03-01' },
  { id: '3', indicator_type: 'wage_growth', year: 2022, value: 14.2, source: 'GUS', gender: null, updated_at: '2023-03-01' },
  { id: '4', indicator_type: 'inflation', year: 2024, value: 3.6, source: 'NBP', gender: null, updated_at: '2025-03-01' },
  { id: '5', indicator_type: 'inflation', year: 2023, value: 11.4, source: 'NBP', gender: null, updated_at: '2024-03-01' },
  { id: '6', indicator_type: 'inflation', year: 2022, value: 14.4, source: 'NBP', gender: null, updated_at: '2023-03-01' },
  { id: '7', indicator_type: 'pension_valorization', year: 2024, value: 12.3, source: 'ZUS', gender: null, updated_at: '2024-03-01' },
  { id: '8', indicator_type: 'pension_valorization', year: 2023, value: 14.8, source: 'ZUS', gender: null, updated_at: '2023-03-01' },
  { id: '9', indicator_type: 'life_expectancy', year: 2024, value: 74.5, source: 'GUS', gender: 'M', updated_at: '2025-01-01' },
  { id: '10', indicator_type: 'life_expectancy', year: 2024, value: 82.3, source: 'GUS', gender: 'K', updated_at: '2025-01-01' },
];

interface SystemError extends Record<string, unknown> {
  id: string;
  created_at: string;
  error_type: string;
  message: string;
  module: string;
  user_id: string | null;
  resolved: boolean;
  resolved_at: string | null;
}

export const mockSystemErrors: SystemError[] = [
  {
    id: '1',
    created_at: '2025-03-15T12:45:00Z',
    error_type: 'pdf_error',
    message: 'Błąd generowania PDF - brak czcionki',
    module: 'PDF Generator',
    user_id: 'user_123',
    resolved: false,
    resolved_at: null,
  },
  {
    id: '2',
    created_at: '2025-03-14T09:20:00Z',
    error_type: 'api_error',
    message: 'Timeout połączenia z API ZUS',
    module: 'API Integration',
    user_id: null,
    resolved: true,
    resolved_at: '2025-03-14T10:00:00Z',
  },
  {
    id: '3',
    created_at: '2025-03-13T16:30:00Z',
    error_type: 'data_missing',
    message: 'Brak danych dla wskaźnika waloryzacji za 2023',
    module: 'Data Loader',
    user_id: null,
    resolved: true,
    resolved_at: '2025-03-13T17:15:00Z',
  },
  {
    id: '4',
    created_at: '2025-03-12T11:10:00Z',
    error_type: 'calculation_error',
    message: 'Nieprawidłowa wartość stopy zastąpienia',
    module: 'Pension Calculator',
    user_id: 'user_456',
    resolved: false,
    resolved_at: null,
  },
  {
    id: '5',
    created_at: '2025-03-10T14:55:00Z',
    error_type: 'pdf_error',
    message: 'Błąd renderowania wykresu w PDF',
    module: 'PDF Generator',
    user_id: 'user_789',
    resolved: false,
    resolved_at: null,
  },
];

export const mockMonthlyReports = [
  {
    id: '1',
    month: '2025-03-01',
    avg_pension: 3280,
    avg_replacement_rate: 50.2,
    report_count: 156,
    generated_at: '2025-03-15',
  },
  {
    id: '2',
    month: '2025-02-01',
    avg_pension: 3150,
    avg_replacement_rate: 49.8,
    report_count: 142,
    generated_at: '2025-03-01',
  },
  {
    id: '3',
    month: '2025-01-01',
    avg_pension: 3050,
    avg_replacement_rate: 49.5,
    report_count: 128,
    generated_at: '2025-02-01',
  },
  {
    id: '4',
    month: '2024-12-01',
    avg_pension: 2980,
    avg_replacement_rate: 49.2,
    report_count: 135,
    generated_at: '2025-01-01',
  },
];

export const mockDashboardStats = {
  totalReports: 567,
  avgPension: 3180,
  avgReplacementRate: 50.1,
  pdfDownloads: 423,
  systemErrors: 12,
  lastUpdate: '2025-03-15T14:30:00Z',
};

export const mockChartData = {
  wageVsInflation: [
    { year: 2020, wzrostPlac: 5.2, inflacja: 3.4 },
    { year: 2021, wzrostPlac: 9.8, inflacja: 5.1 },
    { year: 2022, wzrostPlac: 14.2, inflacja: 14.4 },
    { year: 2023, wzrostPlac: 12.8, inflacja: 11.4 },
    { year: 2024, wzrostPlac: 7.5, inflacja: 3.6 },
  ],
  reportsPerMonth: [
    { month: 'Sty', count: 128 },
    { month: 'Lut', count: 142 },
    { month: 'Mar', count: 156 },
    { month: 'Kwi', count: 135 },
    { month: 'Maj', count: 148 },
    { month: 'Cze', count: 162 },
  ],
};
