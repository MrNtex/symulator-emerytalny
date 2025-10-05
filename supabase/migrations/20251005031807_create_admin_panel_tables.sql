/*
  # Panel Administratora - Schemat Bazy Danych

  ## Nowe Tabele

  ### 1. `user_reports`
  Przechowuje raporty wygenerowane przez użytkowników symulatora emerytalnego.
  - `id` (uuid, primary key)
  - `created_at` (timestamptz) - data wygenerowania raportu
  - `start_year` (integer) - rok rozpoczęcia pracy
  - `retirement_year` (integer) - rok przejścia na emeryturę
  - `gender` (text) - płeć użytkownika (M/K)
  - `salary` (numeric) - wynagrodzenie użytkownika
  - `pension_amount` (numeric) - kwota emerytury (urealniona)
  - `replacement_rate` (numeric) - stopa zastąpienia (w %)
  - `pdf_downloaded` (boolean) - czy pobrano PDF

  ### 2. `economic_indicators`
  Przechowuje wskaźniki makroekonomiczne używane w kalkulacjach.
  - `id` (uuid, primary key)
  - `indicator_type` (text) - typ wskaźnika (wage_growth, inflation, pension_valorization, life_expectancy)
  - `year` (integer) - rok wskaźnika
  - `value` (numeric) - wartość wskaźnika
  - `source` (text) - źródło danych
  - `gender` (text, nullable) - płeć (dla tablicy trwania życia)
  - `updated_at` (timestamptz) - data ostatniej aktualizacji

  ### 3. `system_errors`
  Logi błędów systemowych.
  - `id` (uuid, primary key)
  - `created_at` (timestamptz) - data wystąpienia błędu
  - `error_type` (text) - typ błędu (api_error, pdf_error, data_missing)
  - `message` (text) - komunikat błędu
  - `module` (text) - moduł, w którym wystąpił błąd
  - `user_id` (text, nullable) - identyfikator użytkownika (jeśli dotyczy)
  - `resolved` (boolean) - czy błąd został rozwiązany
  - `resolved_at` (timestamptz, nullable) - data rozwiązania

  ### 4. `monthly_reports`
  Raporty zbiorcze miesięczne.
  - `id` (uuid, primary key)
  - `month` (date) - miesiąc raportu
  - `avg_pension` (numeric) - średnia emerytura (urealniona)
  - `avg_replacement_rate` (numeric) - średnia stopa zastąpienia
  - `report_count` (integer) - liczba raportów w miesiącu
  - `generated_at` (timestamptz) - data wygenerowania

  ## Bezpieczeństwo
  - RLS włączony dla wszystkich tabel
  - Dostęp tylko dla administratorów (TODO: dodać role po implementacji auth)
*/

-- Tworzenie tabeli raportów użytkowników
CREATE TABLE IF NOT EXISTS user_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  start_year integer NOT NULL,
  retirement_year integer NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'K')),
  salary numeric NOT NULL,
  pension_amount numeric NOT NULL,
  replacement_rate numeric NOT NULL,
  pdf_downloaded boolean DEFAULT false
);

ALTER TABLE user_reports ENABLE ROW LEVEL SECURITY;

-- Tworzenie tabeli wskaźników ekonomicznych
CREATE TABLE IF NOT EXISTS economic_indicators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  indicator_type text NOT NULL CHECK (indicator_type IN ('wage_growth', 'inflation', 'pension_valorization', 'life_expectancy')),
  year integer NOT NULL,
  value numeric NOT NULL,
  source text DEFAULT 'ZUS',
  gender text CHECK (gender IN ('M', 'K', NULL)),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(indicator_type, year, gender)
);

ALTER TABLE economic_indicators ENABLE ROW LEVEL SECURITY;

-- Tworzenie tabeli błędów systemowych
CREATE TABLE IF NOT EXISTS system_errors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  error_type text NOT NULL CHECK (error_type IN ('api_error', 'pdf_error', 'data_missing', 'calculation_error')),
  message text NOT NULL,
  module text NOT NULL,
  user_id text,
  resolved boolean DEFAULT false,
  resolved_at timestamptz
);

ALTER TABLE system_errors ENABLE ROW LEVEL SECURITY;

-- Tworzenie tabeli raportów miesięcznych
CREATE TABLE IF NOT EXISTS monthly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month date NOT NULL UNIQUE,
  avg_pension numeric NOT NULL,
  avg_replacement_rate numeric NOT NULL,
  report_count integer NOT NULL,
  generated_at timestamptz DEFAULT now()
);

ALTER TABLE monthly_reports ENABLE ROW LEVEL SECURITY;

-- Indeksy dla lepszej wydajności zapytań
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON user_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_reports_gender ON user_reports(gender);
CREATE INDEX IF NOT EXISTS idx_economic_indicators_type_year ON economic_indicators(indicator_type, year);
CREATE INDEX IF NOT EXISTS idx_system_errors_type ON system_errors(error_type);
CREATE INDEX IF NOT EXISTS idx_system_errors_resolved ON system_errors(resolved);

-- Polityki RLS (tymczasowo pozwalające na wszystko - do zmiany po dodaniu auth)
CREATE POLICY "Allow all access to user_reports"
  ON user_reports
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to economic_indicators"
  ON economic_indicators
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to system_errors"
  ON system_errors
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to monthly_reports"
  ON monthly_reports
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);