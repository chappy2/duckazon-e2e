# Duckazon: zehn Minuten Roundtable

Neun deutsche Folien mit Sprechernotizen, drei Minuten Live-Demo und 90 Sekunden Austausch. Der rote Faden ist persönlich: E2E-Tests zu schreiben war meine Hürde, vollständig in Dev Containers zu arbeiten. noVNC macht den Testbrowser im Container sichtbar; VS Code ermöglicht Breakpoints im Test.

## Starten und präsentieren

Im Repository-Verzeichnis:

```bash
bun run slides
```

Der Befehl nutzt Vite über Bun. Falls nötig, vorher `bun install` ausführen. Im Dev Container Port 8000 über die Ports-Ansicht von VS Code weiterleiten; automatisch konfiguriert sind nur 5173 und 6080.

http://localhost:8000 öffnen. Pfeiltasten oder Leertaste: nächste Folie. Esc: Übersicht. F: Vollbild. S: Referentenansicht mit Notizen und Timer; das Popup zulassen. Die Folien über HTTP öffnen, damit die Referentenansicht funktioniert.

## Ablauf

| Folie | Zeit       | Inhalt                                                                      |
| ----- | ---------- | --------------------------------------------------------------------------- |
| 1     | 0:00–0:20  | Mein Ziel: vollständig im Container arbeiten                                |
| 2     | 0:20–1:20  | Dev Container erklären: Historie, IntelliJ, Codespaces, CodeSandbox und Ona |
| 3     | 1:20–1:50  | Mein Blocker: E2E-Tests schreiben                                           |
| 4     | 1:50–2:40  | VNC-Bildweg erklären und Container-Desktop live zeigen                      |
| 5     | 2:40–3:30  | Einen echten Rabatt-Test lesen                                              |
| 6     | 3:30–6:30  | Browser beobachten, Breakpoint setzen, debuggen                             |
| 7     | 6:30–7:30  | Vorbereiteten CI-Report zeigen                                              |
| 8     | 7:30–8:30  | Sichtbares Feedback als fehlendes Stück                                     |
| 9     | 8:30–10:00 | Erfahrungen aus der Runde                                                   |

## Dev-Container-Einstieg: eine Minute

Die Umgebung wird als Code beschrieben: `devcontainer.json` konfiguriert Container, Werkzeuge und Editor-Anbindung. Die Zeitleiste zeigt die Entwicklung dieses Ökosystems, nicht den Ursprung von Containern insgesamt:

- **2019:** [VS Code Remote Development als Preview](https://code.visualstudio.com/blogs/2019/05/02/remote-development), einschließlich Entwicklung in Containern.
- **2021:** [Codespaces allgemein verfügbar für Team und Enterprise](https://github.blog/changelog/2021-08-11-codespaces-is-generally-available-for-team-and-enterprise/).
- **2022:** [Offene Dev-Container-Spezifikation und CLI](https://code.visualstudio.com/blogs/2022/05/18/dev-container-cli).
- **Heute:** Lokales VS Code, [GitHub Codespaces](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/introduction-to-dev-containers) und [Ona-Agenten](https://ona.com/docs/ona/agents/overview) nutzen Dev-Container-Konfigurationen. Das belegt die Unterstützung durch mehrere Werkzeuge und Anbieter; eine Marktquote wird nicht behauptet.

Weitere Unterstützung gibt es bei [IntelliJ IDEA](https://www.jetbrains.com/help/idea/connect-to-devcontainer.html) und [CodeSandbox, angekündigt am 12. Oktober 2023](https://codesandbox.stream/blog/introducing-dev-container-support-in-codesandbox). Die Einstiegsfolie nennt beide neben VS Code, GitHub Codespaces und Ona als Beispiele für die Breite des Ökosystems. Der Umfang unterstützter Eigenschaften kann je nach Werkzeug variieren.

Der erinnerte Ordner passt zu **CodeSandbox**: Dort liegt beispielsweise [`.codesandbox/tasks.json`](https://codesandbox.stream/docs/learn/vm-sandboxes/task) für Setup- und Startbefehle. Diese anbieterspezifische Konfiguration ist von `.devcontainer/devcontainer.json` zu unterscheiden, die die Dev-Container-Umgebung beschreibt. Codespaces betreibt Dev Container auf einer VM; Ona nutzt Dev-Container-Konfigurationen auch für Agenten.

## Vorher vorbereiten

- Dev Container starten; Abhängigkeiten und Chromium vorab installieren.
- Shop mit `bun run dev` starten und auf Port 5173 öffnen (bei Testläufen startet Playwright Vite bei Bedarf selbst). noVNC unter http://localhost:6080/vnc.html verbinden; Passwort laut Container-Konfiguration: `vscode`. Beide Ports lokal halten.
- noVNC-Tab und VS Code nebeneinander anordnen. Der Desktop sollte während des Tests gut sichtbar sein.
- `tests/03-debugging.spec.ts` und `src/App.tsx` öffnen.
- In den Umgebungseinstellungen der Playwright-Erweiterung `DEMO_BUG=1` setzen und Tests aktualisieren. Den Breakpoint einmal proben, danach entfernen: Er wird während des Vortrags live gesetzt.
- Einen abgeschlossenen GitHub-Actions-Lauf samt Report bereithalten. Falls keiner vorliegt, den Workflow als Konfiguration zeigen, nicht als Beleg für einen erfolgreichen Lauf.
- Einmal mit Timer proben. Um 6:30 zurück zu den Folien wechseln.

## noVNC als Aha-Moment

Auf Folie 4 kurz in den verbundenen noVNC-Tab wechseln und auf dem Desktop interagieren. Erklären: „Dieser Desktop läuft im Dev Container. Ich sehe und bediene ihn einfach in meinem Browser.“ Die Darstellung auf der Folie ist ein Schema, kein Screenshot.

Die Übersicht auf Folie 4 zeigt den Bildweg:

1. Playwright startet Chromium mit `--headed` im Container. `DISPLAY=:1` verbindet ihn in diesem Setup mit der virtuellen X-Anzeige; Fluxbox verwaltet die Fenster.
2. TigerVNC stellt Bildänderungen dieses Desktops über VNC bereit (interner Standardport 5901).
3. `websockify` überbrückt VNC über TCP zum WebSocket des Browsers. VS Code leitet den Web-Zugang auf Port 6080 lokal weiter.
4. noVNC läuft als Webanwendung im lokalen Browser und zeichnet die Desktop-Bildänderungen. Maus und Tastatur gehen über denselben Verbindungsweg zurück zum Desktop.

Die Lockdatei bindet `desktop-lite` an Version **1.2.10**. Das installierte `/usr/local/share/desktop-init.sh` startet TigerVNC auf `:1` mit Port 5901 (nur containerlokal) und `novnc_proxy --listen 6080 --vnc localhost:5901`; dieser nutzt `websockify`. `desktop-lite` richtet diese Infrastruktur ein und startet sie automatisch. Playwright steuert Chromium direkt; die Automatisierung läuft nicht über VNC. Auch VS Codes Verbindung zum Test-Debugger ist davon unabhängig.

Quellen: [desktop-lite](https://github.com/devcontainers/features/tree/main/src/desktop-lite), [noVNC](https://novnc.com/info.html).

Chromium und Playwright Inspector laufen auf diesem Desktop. Auf Port 5173 liegt der Shop; Port 6080 zeigt den Desktop. Beim folgenden Testlauf zuschauen, wie Chromium Produkte auswählt und den Rabatt einlöst.

## Live-Debugging: drei Minuten

1. **3:30–4:00 — Erst grün.** `bun run test:headed tests/02-discount.spec.ts` ausführen. Im noVNC-Tab den Testbrowser beim Einkauf beobachten.
2. **4:00–4:30 — Breakpoint live setzen.** In `tests/03-debugging.spec.ts` links neben der Zeilennummer von `const total = ...` klicken. Den roten Punkt zeigen. Über das Testmenü oder die Testing-Ansicht **Debug Test** starten.
3. **4:30–5:00 — Pause zeigen.** VS Code hält vor der Zuweisung an. Im noVNC-Tab den Checkout zeigen, dann zur markierten Codezeile zurückkehren. Der Testprozess pausiert; die Seite selbst kann weiterlaufen. `total` ist noch nicht zugewiesen.
4. **5:00–5:30 — Weitergehen und inspizieren.** **Step Over / F10** drücken. `total` per Hover oder in **Watch** betrachten: `17,99 €`. Mit den erwarteten `15,00 €` vergleichen. Mit **Continue / F5** zur fehlgeschlagenen Assertion weiterlaufen. Falls die Funktionstasten vom System abgefangen werden, die Debugger-Symbolleiste verwenden.
5. **5:30–6:30 — Fix und erneuter Lauf.** In `src/App.tsx` den Ausdruck `bug ? 0.6 : 0.5` zu `bug ? 0.5 : 0.5` ändern. Breakpoint entfernen und Demo-Test erneut ausführen: grün. Bei Zeitdruck den Fix nur erklären; Breakpoint und Inspektion haben Vorrang.

Der Breakpoint liegt im **Playwright-Test**. **Debug Test** verbindet den VS-Code-Debugger mit dem Testprozess und erlaubt das Prüfen seiner Variablen. Ein Frontend-Quelldebugger für `App.tsx` wird dadurch nicht verbunden. Die CLI-Option `--debug` öffnet stattdessen den Playwright Inspector.

Ein separater sichtbarer Fehlerlauf ohne VS-Code-Debugger:

```bash
DEMO_BUG=1 bun run test:headed tests/03-debugging.spec.ts
```

`DEMO_BUG=1` nimmt die sonst ausgeschlossene Demo-Testdatei auf; `?bug=discount` im Test aktiviert den App-Bug. 29,99 € mit 50 Prozent Rabatt ergeben gerundet 15,00 €. Der fehlerhafte Faktor 0,6 liefert 17,99 €. Nach dem Vortrag den absichtlichen Bug manuell wiederherstellen und die Umgebungsvariable aus der Erweiterung entfernen.

Falls der Desktop ausfällt, auf Folie 6 die beiden Beträge, die Testzeile und die Berechnung erklären. Während des Vortrags keine Infrastruktur reparieren.

## Gestaltung und externe Assets

Die Gestaltung orientiert sich an der [bridgingIT-Website](https://www.bridging-it.de/index.html): Weißraum, Raleway, Rot `#e10033` und Blau `#3379bb`. Sie ist eine Umsetzung für diesen Vortrag, keine geprüfte PowerPoint-Unternehmensvorlage.

Die Folien zeigen kein Unternehmenslogo. Raleway wird von der Unternehmenswebsite geladen und hat einen lokalen Systemschrift-Fallback. reveal.js 5.2.1 wird von jsDelivr geladen; die Folien benötigen dafür Internet.

Für einen Offline-Vortrag reveal.js vorab herunterladen, `dist` und `plugin` unter `docs/vendor/reveal/` ablegen und die vier CDN-URLs in `index.html` durch relative Pfade ersetzen. Die Schrift ebenfalls vorab lokal bereitstellen und die URL in `slides.css` anpassen oder die Systemschrift verwenden. Anschließend offline proben.

PDF-Backup: http://localhost:8000/?print-pdf in Chromium öffnen und als PDF drucken, mit Querformat und Hintergrundgrafiken.

## Auf GitHub Pages veröffentlichen

Die Folien sind statisch und benötigen keinen Build-Schritt.

1. `docs/` und die Änderung an `package.json` committen und zu GitHub pushen.
2. **Settings → Pages → Build and deployment → Deploy from a branch** öffnen.
3. Den Branch mit den Folien sowie **/docs** wählen und speichern.
4. Die Bereitstellung abwarten und die von GitHub angezeigte URL öffnen, üblicherweise `https://<owner>.github.io/<repository>/`.

Verfügbarkeit hängt auch von Repository-Sichtbarkeit und GitHub-Tarif ab. Falls Pages bereits eine Website veröffentlicht, die Folien in deren Veröffentlichungsquelle integrieren. Diese Dateien aktivieren Pages nicht automatisch.

Pages hostet die Folien. Desktop und noVNC laufen im Dev Container; GitHub Actions führt Playwright headless ohne diese Desktop-Infrastruktur aus.

Referenzen: [reveal.js](https://revealjs.com/), [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
