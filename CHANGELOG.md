# Changelog

## v1.11.0 – 2026-04-27

### Neu
- **Export-Hinweis-Block im Katalog-Drawer**: Sobald der Katalog lokal geändert wurde und ein Ordner verknüpft ist, erscheint der Block „Lokale Änderungen vorhanden" mit Button „Jetzt exportieren" – Pendant zum Import-Hinweis.

### Geändert
- Persistenter **„Exportieren"-Button** öffnet jetzt einen **„Speichern unter…"-Dialog** (`showSaveFilePicker`) mit freier Pfad- und Namenswahl – ideal für Backups oder ad-hoc Sicherungen.
- Persistenter Button optisch dezent (gestrichelter Rahmen, sekundärer Stil), damit der Block-Hinweis die primäre Aktion bleibt.
- Nach erfolgreichem Export wird `katalogMeta.manuellGeändert` zurückgesetzt.

## v1.10.0 – 2026-04-27

### Geändert
- **Katalog-Export folgt dem verknüpften Ordner**: Ist ein Katalog-Ordner verknüpft, wird der Export direkt dort abgelegt statt im Download-Verzeichnis. Ohne Verknüpfung bleibt der klassische Download.
- **Ordner-Verknüpfung verlangt jetzt Schreibrechte** (`readwrite`) – damit der Export in den Ordner schreiben kann. Bestehende Verknüpfungen werden beim ersten Export einmalig hochgestuft.
- **Kein stiller Auto-Import mehr**: Findet die App beim „Prüfen" (↻) eine neuere Katalog-Version im verknüpften Ordner, erscheint ein deutlicher Hinweis-Block „Neue Version verfügbar" mit Button „Jetzt importieren". Erst der Klick darauf übernimmt die Datei.

## v1.9.0 – 2026-04-23

### Neu
- **Checkbox-Spalte in der Vollbild-Tabellenansicht**: Zustände direkt abhaken (z.B. zur Übergabe-Kontrolle)
- **Kopf-Checkbox** mit Sammel-Aktion „Alle auswählen/abwählen" inkl. Indeterminate-Status
- **Neue Exportspalte „Erledigt"** – im Modal „Exportspalten konfigurieren" aktivierbar (Excel & PDF)

### Geändert
- Abgehakte Zeilen werden grün hinterlegt, der Code-Eintrag durchgestrichen dargestellt
- Abhak-Status wird pro Zustand gespeichert und bleibt nach Neuladen/Projektwechsel erhalten
- Im Export erscheint für abgehakte Zeilen ein „X", für offene Zeilen bleibt die Zelle leer

## v1.8.0 – 2026-04-09

### Geändert
- **Kürzelcode-Trennzeichen**: Bindestriche (`-`) durch Unterstriche (`_`) ersetzt – gilt in der Baumansicht, im Detail-Panel, in der Tabellenansicht und im Excel-/PDF-Export
- **Zustand im Code**: Der Zustand-Name wird in Volltextform als letztes Segment an den Kürzelcode angehängt (z. B. `STA_BR_FD_FKT_Zustand offen`)
  - Baumansicht: Zustand-Knoten erhalten jetzt ebenfalls ein `[...]`-Badge
  - Detail-Panel: `bmkCode` zeigt den vollständigen Code inkl. Zustand
  - BMK-Exportspalte: enthält den kompletten Code bis zum Zustand

### Neu
- **Code-Spalte in der Tabellenansicht**: Als erste Spalte wird nun der vollständige Code jeder Zeile in Monospace-Schrift angezeigt

---

## v1.7.0 – Automatische Katalog-Aktualisierung via OneDrive-Sync

## v1.6.0 – Exportspalten konfigurierbar (Excel & PDF) · Kürzel/Benennung-Eingabelogik überarbeitet

## v1.5.0 – Kürzel-Fix Stellglied, breiteres Kürzelfeld & index.html Konsolidierung

## v1.2.0 – Speichern/Speichern unter, Undo, Hold-to-Delete, Resize & Drag-and-Drop

## v1.1.0 – PDF und Excel Export Redesign
