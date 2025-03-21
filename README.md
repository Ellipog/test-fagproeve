# Test Fagprøve Mars 2025 - Elliot Strand Aaen
En mock applikasjon for å vise hvordan opplasting av dokumenter kan fungere

## Funksjonalitet

- **Dokumentopplasting:** Dra og slipp filer, eller velg filer fra filutforskeren
- **Kategorisering:** Automatisk kategorisering av dokumenter basert på type
- **Tagging:** Automatisk tagging basert på dokumenttype, med mulighet for å redigere
- **Søk:** Søk etter dokumenter basert på tagger
- **Filtrering:** Filtrer dokumenter etter kategori og tagger
- **Visninger:** Velg mellom kort- og listevisning for dokumenter
- **Responsivt design:** Fungerer på både desktop og mobile enheter

## Komme i gang

### Installasjon

1. Klon repoet:
   ```bash
   git clone https://github.com/ditt-brukernavn/folkeregisteret-dokumentportal.git
   cd folkeregisteret-dokumentportal
   ```

2. Installer avhengigheter:
   ```bash
   npm install
   # eller
   yarn install
   ```

3. Start utviklingsserveren:
   ```bash
   npm run dev
   # eller
   yarn dev
   ```

4. Åpne [http://localhost:3000](http://localhost:3000) i nettleseren

## Bygg for produksjon

```bash
npm run build
npm start
# eller
yarn build
yarn start
```

## Prosjektstruktur

```
├── app/
│   ├── components/
│   │   ├── FileList.tsx        # Komponent for å vise og filtrere dokumenter
│   │   ├── FileUploader.tsx    # Komponent for opplasting av dokumenter
│   ├── types/
│   │   ├── index.ts            # TypeScript-definisjoner for applikasjonen
│   ├── page.tsx                # Hovedsiden som kombinerer komponenter
├── public/
│   ├── ...                     # Statiske filer
├── styles/
│   ├── ...                     # CSS-stiler
├── tailwind.config.ts          # Tilpassede Tailwind-innstillinger
└── package.json                # Prosjektavhengigheter og skript
```
