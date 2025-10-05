export interface UsageReport {
    date: string;                         // Data użycia
    time: string;                         // Godzina użycia
    expectedPension: number;              // Emerytura oczekiwana
    age: number;                          // Wiek użytkownika
    gender: 'Kobieta' | 'Mężczyzna';      // Płeć
    salary: number;                       // Wysokość wynagrodzenia
    includedSickPeriods: boolean;         // Czy uwzględniono okresy choroby
    accountFunds: number;                 // Środki zgromadzone na koncie i subkoncie
    realPension: number;                  // Emerytura rzeczywista
    adjustedPension: number;              // Emerytura urealniona
    postalCode: string;                   // Kod pocztowy
  }
  