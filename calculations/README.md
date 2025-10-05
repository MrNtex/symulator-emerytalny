# Funkcje Kalkulacji Prognoz Emerytalnych ZUS

Ten folder zawiera funkcje do obliczania prognoz emerytalnych i zapisywania danych do pliku JSON.

## Jak używać funkcji do generowania prognoz

### 1. Podstawowe obliczenia emerytury

```typescript
import { calculatePension, calculateRealPension } from './calculateRent';

const params = {
  monthlyIncome: 5000,      // miesięczne wynagrodzenie brutto
  yearWorkStart: 2020,      // rok rozpoczęcia pracy
  yearRetirement: 2060,     // rok przejścia na emeryturę
  gender: 'male' as const   // płeć: 'male' lub 'female'
};

// Obliczenie emerytury rzeczywistej (nominalna wartość)
const pension = calculatePension(params);

// Obliczenie emerytury urealnionej (z uwzględnieniem wzrostu wynagrodzeń)
const realPension = calculateRealPension(params);
```

### 2. Uwzględnienie chorób i zwolnień

```typescript
import { calculateSickDaysImpact } from './calculateRent';

// Obliczenie emerytury z uwzględnieniem średnio 34 dni chorobowych rocznie
const pensionWithSickDays = calculateSickDaysImpact(params, 34);
```

### 3. Opóźnienie przejścia na emeryturę

```typescript
import { calculateDelayedRetirementRent } from './calculateRent';

// Obliczenie emerytury przy opóźnionym przejściu na emeryturę (np. 70 lat)
const delayedPension = calculateDelayedRetirementRent(
  params,
  70,           // wiek przejścia na emeryturę
  false,        // czy uwzględnić choroby
  34            // średnia liczba dni chorobowych rocznie (opcjonalnie)
);
```

### 4. Obliczenia dla subkonta

```typescript
import { calculateInterestRate } from './interestRateCalc';

const interestParams = {
  initialAmount: 10000,         // początkowa kwota
  interestRate: 0.05,           // stopa procentowa (5%)
  yearStart: 2020,              // rok rozpoczęcia
  yearEnd: 2060,                // rok zakończenia
  annualCapitalization: true    // true = roczna, false = kwartalna
};

const finalAmount = calculateInterestRate(interestParams);
```

### 5. Dodatkowe funkcje pomocnicze

```typescript
import {
  calculateMonthlyPension,
  calculateRetirementStep,
  calculateFutureAveragePension,
  calculateFinalSalary,
  calculateDifference
} from './calculateRent';

// Miesięczna emerytura na podstawie całkowitej emerytury
const monthly = calculateMonthlyPension(totalPension, 67);

// Stopa zastąpienia (% ostatniej pensji)
const replacementRate = calculateRetirementStep(params, false, false, 0);

// Przyszła średnia emerytura w kraju
const futureAvg = calculateFutureAveragePension(3500, 30, 2024);

// Końcowa pensja po latach pracy
const finalSalary = calculateFinalSalary(5000, 2020, 40);

// Ile lat opóźnienia potrzeba do osiągnięcia docelowej emerytury
const yearsNeeded = calculateDifference(params, false, 4000);
```

## Zapisywanie danych do JSON

Funkcje automatycznie zapisują dane do `shared/data/balance.json`:

- `updateMainBalanceAndExportJson()` - aktualizuje saldo główne
- `updateSubBalanceAndExportJson()` - aktualizuje subsaldo

**Uwaga:** Funkcje zapisu działają tylko w środowisku Node.js (np. w skryptach testowych). W przeglądarce zwracają ostrzeżenie i nie wykonują zapisu.

## Pliki danych

- `wskaznik_wzrostu_wynagrodzenia.json` - historyczne wskaźniki wzrostu wynagrodzeń
- `life_expectancy_gus.json` - dane o oczekiwanej długości życia (GUS)
- `average_salary.json` - średnie wynagrodzenia w poszczególnych latach
- `shared/data/balance.json` - wygenerowane dane sald (główne i sub)

## Przykład: Generowanie pełnej prognozy

```typescript
// Przykładowy skrypt do uruchomienia w Node.js
const params = {
  monthlyIncome: 5000,
  yearWorkStart: 2020,
  yearRetirement: 2060,
  gender: 'male' as const
};

// 1. Oblicz emeryturę podstawową
const basicPension = calculateRealPension(params);

// 2. Oblicz emeryturę z chorobami
const sickPension = calculateSickDaysImpact(params, 34);

// 3. Oblicz emeryturę z opóźnieniem +5 lat
const delayedPension = calculateDelayedRetirementRent(params, 72, false);

// 4. Oblicz miesięczne emerytury
const monthlyBasic = calculateMonthlyPension(basicPension, 67);
const monthlySick = calculateMonthlyPension(sickPension, 67);
const monthlyDelayed = calculateMonthlyPension(delayedPension, 72);

console.log('Emerytura podstawowa:', monthlyBasic, 'zł/mies.');
console.log('Emerytura z chorobami:', monthlySick, 'zł/mies.');
console.log('Emerytura opóźniona:', monthlyDelayed, 'zł/mies.');
```

## Widok w Dashboard

Dashboard automatycznie:
1. Wczytuje dane z `balance.json`
2. Sumuje narastająco saldo i subsaldo
3. Wyświetla wykres słupkowy z możliwością przełączania między:
   - Podwójnymi słupkami (osobno saldo i subsaldo)
   - Pojedynczym słupkiem (suma)

Dane są wyświetlane w trzech kartach:
- Konto ZUS (saldo główne)
- Subkonto ZUS
- Łączny Kapitał
