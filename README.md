# RE Academy · MVP v0.1

Responsive, deutschsprachige Lernanwendung für Requirement Engineers und IT Consultants. React, TypeScript, Vite, Tailwind CSS und React Router. Ohne Backend oder Datenbank.

## Installation und Entwicklung

Voraussetzung: Node.js ab 22.12 und npm.

```sh
npm ci
npm run dev
```

Vite stellt die Anwendung unter http://localhost:5173 bereit.

```sh
npm run lint
npm run build
npm run preview
```

Der Produktionsbuild liegt in `dist/`.

## Struktur

- `src/components/`: Layout, Kategorie-Icons, Lektionskarten und wiederverwendbares Quiz
- `src/pages/`: Dashboard, Kategorieübersicht, Lektion, Quiz und Fehlerseite
- `src/content/categories.json`: Kategorien mit stabilen IDs und Darstellungsmetadaten
- `src/content/lessons.json`: Lektionen, Abschnitte, Praxisbeispiele und Quizfragen
- `src/content/types.ts`: diskriminiertes Datenmodell für verfügbare und geplante Lektionen
- `src/styles.css`: Tailwind-Einbindung und responsive Gestaltung
- `tests/`: Browser- und Inhaltsprüfungen

Verfügbare Lektionen haben `status: "available"`, Abschnitte, Beispiel, Merksatz und Quiz. Geplante Lektionen verwenden `status: "planned"` und sind nicht spielbar. Kategorien, Lektionen, Abschnitte, Fragen und Antwortoptionen besitzen stabile IDs. `correctAnswerId` verweist auf genau eine Antwortoption. Zum Ergänzen einer Lektion einen neuen JSON-Eintrag mit eindeutiger ID und bestehender `categoryId` hinzufügen. Verfügbare Lektionen enthalten 3–5 Fragen. Inhalte bleiben von der Oberfläche getrennt.

## Funktionsumfang

Vier Lernbereiche; zwei vollständige Lektionen („Was ist Requirements Engineering?“ und „Was ist eine API?“) mit je fünf Fragen. Unmittelbare Rückmeldung mit Erklärung, Fortschrittsanzeige, Ergebnisübersicht und Quizwiederholung. Unbekannte URLs und fehlende Inhalte führen zu einer deutschen Hinweisseite. Geplante Inhalte sind deutlich gekennzeichnet.

Native Buttons und Links, sichtbare Tastaturfokusse, Sprunglink, Live-Feedback und semantische Überschriften unterstützen die zugängliche Bedienung. Keine Anmeldung, XP, Ranglisten oder Administration. Quizantworten liegen nur im React-State: Ein Neuladen oder Verlassen des Quiz setzt den Versuch zurück. Es gibt keine dauerhafte Lernfortschrittsspeicherung.

## Browserprüfungen

```sh
npx playwright install chromium
npm test
```

Playwright startet automatisch einen lokalen Vite-Server. Die Tests laufen mit Desktop- und mobilem Viewport und prüfen Navigation, JSON-Invarianten, beide vollständigen Quizabläufe, Wiederholung, Fehlerseiten und horizontales Layout. Browser-Testberichte entstehen in `test-results/`.

## Deployment auf Vercel

1. Repository in Vercel importieren.
2. Framework-Preset **Vite** und Node.js **22.x** oder neuer wählen.
3. Installationsbefehl: `npm ci`, Build: `npm run build`, Ausgabeverzeichnis: `dist`.
4. Deploy ausführen. Es werden keine Umgebungsvariablen benötigt.

`vercel.json` leitet Client-Routen auf `index.html` um. Dadurch funktionieren auch direkte Aufrufe und Neuladen unter `/kategorien/...` und `/lektionen/.../quiz`. Vite liefert gehashte Assets unter `/assets/` aus.
