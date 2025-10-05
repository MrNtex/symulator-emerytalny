# Konfiguracja MongoDB

## 1. Utwórz plik `.env.local` w głównym katalogu projektu:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/zus_simulator?retryWrites=true&w=majority
```

## 2. Przykład konfiguracji:

```env
MONGODB_URI=mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/zus_simulator?retryWrites=true&w=majority
```

## 3. Struktura bazy danych:

- **Baza danych:** `zus_simulator`
- **Kolekcja:** `usage_reports`
- **Dokumenty:** Zgodne z interfejsem `UsageReport`

## 4. Pola w dokumencie:

```typescript
{
  date: string,                    // Data użycia (YYYY-MM-DD)
  time: string,                    // Godzina użycia (HH:MM:SS)
  expectedPension: number,         // Emerytura oczekiwana
  age: number,                     // Wiek użytkownika
  gender: 'Kobieta' | 'Mężczyzna', // Płeć
  salary: number,                  // Wysokość wynagrodzenia
  includedSickPeriods: boolean,    // Czy uwzględniono okresy choroby
  accountFunds: number,            // Środki zgromadzone na koncie i subkoncie
  realPension: number,             // Emerytura rzeczywista
  adjustedPension: number,         // Emerytura urealniona
  postalCode: string               // Kod pocztowy (opcjonalny)
}
```

## 5. Instalacja MongoDB Atlas (zalecane):

1. Przejdź na [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Utwórz darmowe konto
3. Utwórz nowy cluster
4. Skonfiguruj dostęp (whitelist IP)
5. Utwórz użytkownika bazy danych
6. Skopiuj connection string do `.env.local`

## 6. Testowanie połączenia:

Dane są automatycznie wysyłane do bazy po każdym obliczeniu emerytury w komponencie `UserResult`.
