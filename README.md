# 🦆 Duckazon – E2E Testing in a Box

**15-Minuten-Roundtable:** Playwright E2E-Tests im Debian Dev Container, visuelles Debugging mit VS Code und noVNC sowie headless CI mit GitHub Actions. Ein absurder Shop für Entwickler-Enten, kein echter Checkout.

## Zweck und Design

Das Repository ist ein reproduzierbares Schulungsprojekt: ein bewusst kleines React/Vite-Frontend, Bun als Package Manager und Skript-Runner, Playwright als Test-Runner, Chromium als Browser. Der Shop demonstriert Locators, Assertions, Formulare, Test-Fehlschläge, Breakpoints und CI-Traces. Das visuelle Design verwendet eine dunkelblaue Hero-Fläche, gelbe Enten-Akzente, türkisfarbene Aktionen und responsive Produktkarten. Der Rabattcode `QUACK50` reduziert den Warenkorb regulär um 50 %. Ein **absichtlich aktivierbarer Bug** berechnet stattdessen nur 40 % Rabatt (`?bug=discount`).

**Architektur:** Ein Debian-Bookworm-Container enthält Bun, Node.js und Chromium. Das Dev-Container-Feature `desktop-lite` stellt den virtuellen Desktop mit Fluxbox, TigerVNC und noVNC bereit und startet ihn automatisch. Es setzt auch `DISPLAY`, sodass headed Chromium und der Playwright Inspector auf diesem Desktop erscheinen. noVNC zeigt diesen Desktop im Host-Browser. Ein eigenes Desktop-Startskript ist nicht erforderlich. VS Code debuggt den Playwright-Testprozess im Container. Die GitHub Action nutzt ebenfalls Debian Bookworm, Bun und Chromium, aber führt die Tests headless aus. Die CI verwendet aus Gründen der Einfachheit das Debian-Node-Image und installiert Browser-Abhängigkeiten; sie baut **nicht** das DevContainer-Dockerfile. OS-Familie und Testcode stimmen überein, die Images sind nicht identisch.

## Voraussetzungen installieren (Windows / macOS / Linux)

1. **Git** installieren: https://git-scm.com/downloads
2. **VS Code** installieren: https://code.visualstudio.com/download
3. **Docker Desktop** (Windows/macOS) installieren: https://www.docker.com/products/docker-desktop/ ; auf Linux Docker Engine installieren: https://docs.docker.com/engine/install/ . Docker starten. Auf Windows wird WSL 2 empfohlen: https://learn.microsoft.com/windows/wsl/install
4. In VS Code die Erweiterung **Dev Containers** (`ms-vscode-remote.remote-containers`) installieren: Extensions (`Ctrl+Shift+X` bzw. `Cmd+Shift+X`) → `Dev Containers` suchen → Installieren.
5. Installation im Terminal prüfen: `git --version` und `docker version`. Docker muss erreichbar sein. **Bun muss auf dem Host nicht installiert werden.**

## Repository öffnen

```bash
git clone <URL-DEINES-REPOSITORIES>
cd duckazon-e2e
code .
```

Alternativ ZIP entpacken → VS Code → **File > Open Folder** → `duckazon-e2e` auswählen.

1. In VS Code `Ctrl+Shift+P` (macOS `Cmd+Shift+P`) öffnen.
2. **Dev Containers: Reopen in Container** ausführen (oder auf die VS-Code-Einblendung klicken).
3. Den ersten Image-Build abwarten; `postCreateCommand` führt `bun install` und `bunx playwright install --with-deps chromium` aus. Dies kann mehrere Minuten dauern.
4. Das Terminal läuft nun **im Container**. Unten links ist die Container-Verbindung erkennbar.
5. `bun run dev` ausführen und http://localhost:5173 öffnen.
6. http://localhost:6080/vnc.html öffnen, auf **Connect** klicken und das Passwort `vscode` eingeben (in `.devcontainer/devcontainer.json` konfiguriert). Browserfenster erscheinen, sobald ein headed Test gestartet wird.

**Ports:** `5173` Vite-Shop, `6080` noVNC (nur lokal über VS Code Port Forwarding verwenden). Das Desktop-Passwort ist `vscode`; die Portfreigaben lokal halten.

## VS Code Extensions / Plugins

Die `.devcontainer/devcontainer.json` installiert im Container automatisch:

| Extension | Zweck |
|---|---|
| `ms-playwright.playwright` | Tests ausführen, navigieren und debuggen |
| `esbenp.prettier-vscode` | Autoformatierung beim Speichern |
| `dbaeumer.vscode-eslint` | Linting und Fixes |
| `openai.chatgpt` | Codex-Unterstützung |
| `ReneSaarsoo.sql-formatter-vsc` | SQL-Formatierung |
| `lumirelle.shell-format-rev` | Shell-/Dockerfile-Formatierung mit shfmt |
| `bradlc.vscode-tailwindcss` | Tailwind-CSS-Unterstützung |
| `ms-azuretools.vscode-containers` | Container-Werkzeuge |

**Wichtig:** Die lokale Dev-Containers-Erweiterung muss *vor* dem Öffnen installiert sein; die anderen werden automatisch im Container installiert. Prettier ist der Standard-Formatter, `editor.formatOnSave=true` ist konfiguriert; SQL und Shell-/Dockerfile-Dateien verwenden die jeweils angegebenen Formatter. Zusätzlich: `bun run format`, `bun run format:check`, `bun run lint`, `bun run typecheck`.

## Tests und Debugging

```bash
bun run test:e2e         # reguläre Tests headless, Bug-Demo ausgeschlossen
bun run test:headed      # reguläre Tests sichtbar in noVNC
bun run test:debug       # Playwright Inspector auf dem desktop-lite-Desktop
DEMO_BUG=1 bun run test:headed tests/03-debugging.spec.ts  # absichtlich rot
bunx playwright show-report
```

**VS Code Breakpoints:** noVNC unter http://localhost:6080/vnc.html öffnen. Für die absichtlich fehlschlagende Demo muss `DEMO_BUG=1` beim Start des Testprozesses gesetzt sein, da die Datei sonst ausgeschlossen wird. Im Container-Terminal:

```bash
DEMO_BUG=1 bunx playwright test tests/03-debugging.spec.ts --headed --workers=1 --debug
```

Das öffnet den **Playwright Inspector**; dort schrittweise durch den Test gehen und den Browser in noVNC beobachten.

Für **VS-Code-Breakpoints** in der Testdatei stattdessen die Playwright-Erweiterung verwenden: Im Bereich **Testing** unter den Playwright-Einstellungen die Umgebungsvariable `DEMO_BUG` auf `1` setzen, die Tests aktualisieren und beim Demo-Test **Debug Test** wählen. Einen Breakpoint bei `const total = ...` in `tests/03-debugging.spec.ts` setzen. Nach Ausführen der Zeile `total` im Debugger prüfen; mit F10 schrittweise weiterlaufen. VS Code pausiert den Testprozess, die Browserseite selbst kann weiter animieren. Die fehlerhafte Berechnung befindet sich in `src/App.tsx` bei `bug ? 0.6 : 0.5`. Für den Fix `0.6` auf `0.5` ändern; Vite aktualisiert die App. Dann den Test erneut starten. Anschließend die Umgebungsvariable für reguläre Testläufe wieder entfernen.

**Wichtig:** Playwright Inspector (`--debug`) und VS-Code-Breakpoints sind zwei unterschiedliche Debugging-Mechanismen. Ein eigenes F5-Startprofil ist im Repository nicht enthalten.

## 15-Minuten-Drehbuch

| Zeit | Szene | Aktion |
|---|---|---|
| 0–3 min | Works on my machine | DevContainer, Bun, Browser + noVNC zeigen |
| 3–6 min | Happy Duck | `bun run test:headed` ausführen |
| 6–11 min | Broken Duck | Breakpoint im Demo-Test, **Debug Test**, noVNC beobachten, Rabatt-Bug finden und fixen |
| 11–13 min | Cloud Duck | Vorab erfolgreich ausgeführten GitHub-Actions-Lauf und Report zeigen |
| 13–15 min | Takeaways | Reproduzierbarkeit, Auto-Waiting, Debugger, Trace und Q&A |

**Vor dem Vortrag:** Container starten, noVNC verbinden, Browser-Tabs öffnen, CI-Lauf vorbereiten, Test-Breakpoint setzen. Bug-Fix nach der Demo ggf. zurücksetzen (`git restore src/App.tsx`).

## CI: GitHub Actions

Workflow: `.github/workflows/playwright.yml`. Auf Push, Pull Request und manuell. Führt `bun install`, Browserinstallation, Format-, Lint-, Typprüfungen und headless E2E-Tests aus. Bei Fehlern werden HTML-Report und Traces als Artefakte hochgeladen. **Empfohlen: Lockdatei für reproduzierbare Builds erzeugen und committen:**

```bash
bun install
git add bun.lock
git commit -m "Add Bun lockfile"
```

Die absichtlich fehlschlagende Datei `03-debugging.spec.ts` ist im Normalbetrieb ausgeschlossen. Mit `DEMO_BUG=1` wird sie aktiviert.

## Fehlerbehebung

- **Docker nicht erreichbar:** Docker Desktop starten bzw. Linux-Docker-Daemon und Berechtigungen prüfen.
- **noVNC ohne Browserfenster:** Erst `bun run test:headed` im Container starten. Mit `echo $DISPLAY` prüfen, ob das Feature eine Anzeige gesetzt hat; keinen festen Wert wie `:99` überschreiben. Fehlt die Anzeige oder startet der Desktop nicht, **Dev Containers: Rebuild Container** ausführen und ein neues Container-Terminal öffnen.
- **Browser fehlt:** `bunx playwright install chromium` im Container ausführen.
- **Port nicht erreichbar:** VS Code → Ports → `5173` / `6080` weiterleiten.
- **Breakpoint wird nicht getroffen:** In der Playwright-Erweiterung **Debug Test** verwenden; Breakpoint in der `*.spec.ts` setzen. Für den Demo-Test muss dort `DEMO_BUG=1` gesetzt sein.
- **Formatcheck in CI rot:** `bun run format` ausführen und Änderungen committen.

## Quellen

- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/tutorial)
- [Dev Containers desktop-lite](https://github.com/devcontainers/features/tree/main/src/desktop-lite)
- [Playwright Docker](https://playwright.dev/docs/docker)
- [Playwright CI](https://playwright.dev/docs/ci)
- [Bun](https://bun.sh/docs)

## Lizenz / Hinweis

Demo-/Schulungsprojekt ohne Zahlungssystem, Datenbank oder externe APIs. Keine echten Bestellungen. Frei als Ausgangspunkt für eigene Workshops nutzbar.
