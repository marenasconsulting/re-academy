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
- `src/content/knowledge.json`: Wissensartikel ohne Quiz
- `src/content/sources.json`: Metadaten der vier bereitgestellten Grundlagen
- `src/content/types.ts`: diskriminiertes Datenmodell für verfügbare und geplante Lektionen
- `src/styles.css`: Tailwind-Einbindung und responsive Gestaltung
- `tests/`: Browser- und Inhaltsprüfungen

Verfügbare Lerninhalte haben `status: "available"`, Abschnitte, Beispiel, Merksatz und Quellenverweise. `format: "lesson"` erfordert 3–5 Quizfragen; `format: "knowledge"` enthält keine Quizdaten. TypeScript bildet diese Unterscheidung als diskriminierte Union ab. Geplante Lektionen verwenden `status: "planned"` und sind nicht spielbar. Kategorien, Lektionen, Abschnitte, Fragen und Antwortoptionen besitzen stabile IDs. `correctAnswerId` verweist auf genau eine Antwortoption. Zum Ergänzen einer Lektion einen neuen JSON-Eintrag mit eindeutiger ID und bestehender `categoryId` hinzufügen. Verfügbare Lektionen enthalten 3–5 Fragen. Inhalte bleiben von der Oberfläche getrennt.

## Funktionsumfang

Vier Lernbereiche mit 16 verfügbaren Lektionen und 19 Wissensartikeln. Die beiden Einstiegslektionen („Was ist Requirements Engineering?“ und „Was ist eine API?“) enthalten weiterhin je fünf Fragen, neue Lektionen je drei. Zwei bisherige Platzhalter (Datenbanken und Software-Lebenszyklus) bleiben geplant. Unmittelbare Rückmeldung mit Erklärung, Fortschrittsanzeige, Ergebnisübersicht und Quizwiederholung. Unbekannte URLs und fehlende Inhalte führen zu einer deutschen Hinweisseite. Geplante Inhalte sind deutlich gekennzeichnet. Unter **RE-Praxiswissen → Tools & Methoden** stehen die Wissensartikel getrennt von den Lektionen. Sie haben keine Quizaufforderung; direkte `/quiz`-Aufrufe führen zum jeweiligen Artikel zurück.

Native Buttons und Links, sichtbare Tastaturfokusse, Sprunglink, Live-Feedback und semantische Überschriften unterstützen die zugängliche Bedienung. Keine Anmeldung, XP, Ranglisten oder Administration. Quizantworten liegen nur im React-State: Ein Neuladen oder Verlassen des Quiz setzt den Versuch zurück. Es gibt keine dauerhafte Lernfortschrittsspeicherung.

## Browserprüfungen

```sh
npx playwright install chromium
npm test
```

Playwright startet automatisch einen lokalen Vite-Server. Die Tests laufen mit Desktop- und mobilem Viewport und prüfen Navigation, JSON-Invarianten, sämtliche vollständigen Quizabläufe sowie alle Wissensartikel einschließlich abgefangener Quizrouten, Wiederholung, Fehlerseiten und horizontales Layout. Browser-Testberichte entstehen in `test-results/`.

## Deployment auf Vercel

1. Repository in Vercel importieren.
2. Framework-Preset **Vite** und Node.js **22.x** oder neuer wählen.
3. Installationsbefehl: `npm ci`, Build: `npm run build`, Ausgabeverzeichnis: `dist`.
4. Deploy ausführen. Es werden keine Umgebungsvariablen benötigt.

`vercel.json` leitet Client-Routen auf `index.html` um. Dadurch funktionieren auch direkte Aufrufe und Neuladen unter `/kategorien/...` und `/lektionen/.../quiz`. Vite liefert gehashte Assets unter `/assets/` aus.

## Herkunft und redaktionelle Aufbereitung

Die Inhalte wurden aus vier vom Nutzer bereitgestellten Unterlagen als kurze deutsche Lerntexte mit ergänzten, ausdrücklich beispielhaften Szenarien aufbereitet. Originaldateien, extrahierte Texte, interne Kommentare und eingebettete Kundenabbildungen werden nicht im Repository veröffentlicht. Jeder verfügbare Inhalt verweist über `sources` auf Dokument und Abschnitt beziehungsweise Folie. Die Quelle wird auch unter dem Lerninhalt angezeigt.

| Grundlage | Umsetzung |
| --- | --- |
| Roadmap Item Entstehungsprozess | Lektion „Vom Roadmap-Item zur Abnahme“, ausdrücklich als Projektbeispiel |
| Technisches Grundwissen für Requirement Engineers | API-Einstieg ergänzt; HTTP-Methoden, Kafka und Kommunikationsmuster, Umgebungen, API-Dokumentation sowie Codeverständnis |
| Cookbook Requirements Engineering & Management | RE-Grundlagen, Anforderungsqualität und -arten, Änderungsmanagement, Prozesseinführung, Initiative/Epic/Story, Scrum, Bedarfsklärung und Akzeptanzkriterien; ergänzende Wissensartikel für Werkzeuglandschaft, Bewertung und Methodenwahl |
| Tools & Methoden REM | Alle 16 Themen als Wissensartikel ohne Quiz: Eisenhower, UML-Anwendungsfälle, UML-Klassen, MoSCoW, Notion, Fit-Gap, Heatmap, Rovo, Story Mapping/Avion, Kano, Impact Mapping, sieben Produktfragen, Event Storming, Gherkin, sechs Denkhüte und 5 Why |

Fachliche Präzisierungen gegenüber den Vorlagen:

- Ein Sprint Backlog ist ein anpassbarer Plan; das Sprintziel wird geschützt. Refinement ist eine laufende Tätigkeit, kein zusätzliches formales Scrum-Event. Review und formale Abnahme sind nicht gleichgesetzt.
- UML verwendet `extend`, nicht `exclude`; eine Klasse wird von einer konkreten Instanz unterschieden.
- Kafka-Consumer-Gruppen werden unterschieden. REST und Kafka werden als typische Kommunikationsmuster eingeordnet, nicht pauschal mit synchron/asynchron gleichgesetzt.
- OpenAPI ist ein Beschreibungsstandard, Swagger eine Werkzeugfamilie. Dokumentationswerkzeuge können auch Aufrufe ausführen.
- Ein Deployment macht eine Funktion nicht unter allen Umständen sichtbar: Konfiguration, Berechtigungen und Feature-Schalter können zusätzlich relevant sein.
- WSJF wird als Verzögerungskosten geteilt durch Arbeitsgröße/-dauer beschrieben, nicht allein als Business Value geteilt durch Größe.
- Produktpreise, Anbieterbewertungen und unbestätigte Erfolgsprozentsätze wurden nicht als Lehrfakten übernommen. Projektspezifische Gremien und Kürzel werden nicht als allgemeiner Pflichtprozess vermittelt.

Die Inhalte sind eine didaktische Zusammenfassung, keine wortgetreue Veröffentlichung der Unterlagen oder ein Ersatz für projektspezifische Vorgaben. Die Quizfragen vertiefen die Lernlektionen; die Themen aus „Tools & Methoden REM“ werden nicht als eigene Quizfragen abgefragt.
