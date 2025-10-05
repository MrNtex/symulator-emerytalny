# Symulator emerytalny

Ten repozytorium zawiera aplikację Next.js służącą do symulacji emerytur. Poniżej znajdziesz kroki do uruchomienia projektu lokalnie, konfigurację bazy danych oraz przydatne polecenia.

## Wymagania

- Node.js (zalecane: 18 lub nowsze)
- npm (wersja dołączona do Node)
- Konto MongoDB Atlas lub lokalna instancja MongoDB (opcjonalnie — aplikacja ma domyślny lokalny URI, ale rekomendowane jest ustawienie `MONGODB_URI`)

## Szybkie uruchomienie (PowerShell)

1. Sklonuj repozytorium i przejdź do katalogu projektu:

```powershell
git clone <repo-url> symulator-emerytalny
cd symulator-emerytalny
```

2. Zainstaluj zależności:

```powershell
npm install
```

3. Utwórz plik `.env.local` w głównym katalogu (jeśli będziesz używać MongoDB Atlas):

```powershell
# utwórz plik .env.local i wklej linię poniżej (zastąp wartości)
echo "MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/zus_simulator?retryWrites=true&w=majority" > .env.local
```

Przykład zawartości `.env.local`:

```env
MONGODB_URI=mongodb+srv://admin:password123@cluster0.abc123.mongodb.net/zus_simulator?retryWrites=true&w=majority
```

4. Uruchom tryb deweloperski:

```powershell
npm run dev
```

Po uruchomieniu aplikacja będzie dostępna pod adresem http://localhost:3000.

## Skrypty npm

- `npm run dev` — uruchamia serwer deweloperski (Next.js z Turbopack)
- `npm run build` — buduje wersję produkcyjną
- `npm run start` — uruchamia zbudowaną wersję produkcyjną
- `npm run lint` — uruchamia ESLint
- `npm run test` — uruchamia testy (w repo: `npx tsx test-functions.test.ts`)

## Konfiguracja MongoDB

- Aplikacja korzysta z wartości `MONGODB_URI` z pliku `.env.local` (lub `process.env.MONGODB_URI`).
- Jeśli `MONGODB_URI` nie jest ustawione i aplikacja działa w środowisku innym niż produkcyjne, w `lib/mongodb.ts` używany jest domyślny URI: `mongodb://localhost:27017/emerytura` (aplikacja wyświetli ostrzeżenie w konsoli jeśli brak `MONGODB_URI`).
- Rekomendacja: skonfiguruj MongoDB Atlas i ustaw `MONGODB_URI` w `.env.local`.

Struktura bazy danych (opis w `MONGODB_SETUP.md`): baza `zus_simulator`, kolekcja `usage_reports`.

## Budowa i uruchomienie produkcyjne

1. Zbuduj aplikację:

```powershell
npm run build
```

2. Uruchom zbudowaną aplikację:

```powershell
npm run start
```

Domyślnie Next.js nasłuchuje na porcie 3000. W środowisku produkcyjnym możesz skonfigurować zmienną `PORT` jeśli chcesz użyć innego portu.

## Testy i lint

- Uruchom testy jednostkowe:

```powershell
npm run test
```

- Uruchom linter:

```powershell
npm run lint
```

## Częste problemy i wskazówki

- Jeśli po starcie widzisz komunikat o braku `MONGODB_URI`, sprawdź, czy plik `.env.local` istnieje i zawiera poprawny connection string.
- Przy problemach z zależnościami usuń `node_modules` i ponownie zainstaluj zależności:

```powershell
rm -r node_modules; npm install
```

- Jeśli aplikacja nie uruchamia się na porcie 3000, sprawdź czy inny proces nie używa tego portu lub ustaw zmienną `PORT` przed uruchomieniem:

```powershell
$env:PORT=4000; npm run dev
```

## Deploy

- Najprostszą opcją jest deploy na Vercel — projekt jest aplikacją Next.js i działa bez dodatkowej konfiguracji.
- Jeśli używasz Vercel, dodaj zmienną środowiskową `MONGODB_URI` w ustawieniach projektu na Vercel.

## Dodatkowe informacje

- Główne pliki źródłowe znajdują się w katalogu `app/` (Next.js App Router).
- Połączenie do MongoDB jest realizowane przez `lib/mongodb.ts`.

## Kontakt / Autor

Jeśli potrzebujesz pomocy lub chcesz zgłosić błąd, otwórz issue w repozytorium.

---

Plik README zaktualizowany — jeśli chcesz, mogę dodać sekcję z instrukcją tworzenia konta i clustra w MongoDB Atlas krok po kroku, albo krótką sekcję „Jak debugować” z typowymi miejscami w kodzie.
