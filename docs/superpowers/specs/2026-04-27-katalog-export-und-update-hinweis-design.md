# Katalog-Export in verknüpften Ordner & Update-Hinweis bei „Prüfen"

**Datum:** 2026-04-27
**Status:** Approved — bereit für Implementierungsplan

## Ausgangslage

Die App ([index.html](../../../index.html)) verfügt unter „Katalog" über eine Funktion zum Verknüpfen eines lokalen Ordners (typischerweise OneDrive-Sync-Ordner) sowie über einen Katalog-Export als XLSX. Aktuell gilt:

- `verknuepfeKatalogOrdner()` ([index.html:4847](../../../index.html)) öffnet den Ordner mit `mode: 'read'`.
- `exportKatalog()` ([index.html:5066](../../../index.html)) erzeugt ein XLSX-Blob und löst stets einen klassischen Download via `_dl()` aus — der verknüpfte Ordner wird ignoriert.
- `autoCheckKatalog()` ([index.html:4879](../../../index.html)) **importiert automatisch**, sobald eine neuere Version im Ordner gefunden wird.

## Ziele

1. **Export folgt dem verknüpften Ordner.** Wenn ein Ordner verknüpft ist, soll der Katalog-Export direkt dort abgelegt werden statt im Download-Ordner.
2. **Kein stiller Auto-Import.** Beim manuellen „Prüfen" soll bei einer neueren Version ein ausdrücklicher Hinweis erscheinen, der den Nutzer zum Import auffordert.

## Out of Scope

- Andere Exporte (`exportExcel`, `exportPDF`, `exportJSON`) bleiben unverändert.
- Manueller Datei-Import (`importKatalog`) bleibt unverändert.
- `_importKatalogFromFile()` selbst wird nicht angefasst — nur die aufrufenden Stellen.

## Änderungen im Detail

### A — Schreibrechte für den verknüpften Ordner

- `verknuepfeKatalogOrdner()`: `showDirectoryPicker({ mode: 'readwrite' })`.
- Permission-Queries in `autoCheckKatalog()` und `requestSyncPermission()` auf `mode: 'readwrite'` umstellen.
- Bestehende Handles (mit `read`-Recht) werden beim ersten Export-Versuch über `requestPermission({mode:'readwrite'})` einmalig aufgerüstet. Verweigert der Nutzer → Fallback auf Download.

### B — Export-Pfad-Logik

`exportKatalog()` wird umgebaut:

1. XLSX-Blob wie bisher erzeugen.
2. Ordner-Handle aus IDB laden.
3. Wenn Handle vorhanden **und** `readwrite` gewährt (ggf. nach `requestPermission`):
   - `dirHandle.getFileHandle(name, { create: true })` → `createWritable()` → `write(blob)` → `close()`.
   - Status-Meldung: „✓ Exportiert in Ordner \<name\>".
4. Sonst (kein Ordner / keine Berechtigung / Fehler beim Schreiben):
   - Bestehender Download-Pfad via `_dl()`.
   - Im Fehlerfall zusätzlich Hinweismeldung.

`katalogMeta.version` und `versionNr` werden weiterhin im Erfolgsfall aktualisiert.

### C — Update-Hinweis statt Auto-Import

- Neue State-Variable `katalogUpdate: { handle, name, version } | null`.
- Neuer Status-Wert `'update'` für `katalogSyncStatus`.
- In `autoCheckKatalog()` bei neuerer Version:
  - **Nicht** mehr `_importKatalogFromFile()` aufrufen.
  - Stattdessen `katalogUpdate` setzen, Status `'update'`, Meldung „Neue Version verfügbar: \<Version\>".
- Neuer UI-Block im Settings-Drawer (sichtbar wenn `katalogSyncStatus === 'update'`):
  - Hinweistext + Button „Jetzt importieren".
  - Klick → `_importKatalogFromFile(file)` auf dem gespeicherten Handle → Status `'aktuell'`, `katalogUpdate = null`.

## Edge Cases

- **Permission verweigert beim Export:** Fallback auf `_dl()`, Statusmeldung erklärt das.
- **Datei mit gleichem Namen existiert im Ordner:** Wird überschrieben (gewünscht, da Versions-Suffix im Dateinamen die Versionen unterscheidet).
- **Ordner-Handle in IDB, aber Ordner nicht mehr erreichbar:** `getFileHandle` wirft → Fallback auf Download.
- **Initialer `autoCheckKatalog()` beim Start:** Findet er eine neuere Version, erscheint der Hinweis sofort im Drawer — kein Auto-Import mehr.

## Erfolgskriterien

- Mit verknüpftem Ordner landet ein Katalog-Export als `BMK-Katalog_YYYYMMDD_NNNN.xlsx` direkt im Ordner.
- Ohne verknüpften Ordner verhält sich der Export wie bisher (Download).
- Klick auf „Prüfen" (↻) bei vorhandener neuerer Version löst **keinen** Import aus, sondern zeigt einen Hinweis mit Import-Button.
