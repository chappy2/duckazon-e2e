# 🦆 Duckazon – E2E Testing in a Box

[![E2E (headless)](https://github.com/chappy2/duckazon-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/chappy2/duckazon-e2e/actions/workflows/playwright.yml)

Demo-Shop für Playwright-Tests im Dev Container – mit noVNC, VS-Code-Debugging und GitHub Actions.

**[Präsentation öffnen →](https://chappy2.github.io/duckazon-e2e)**

## Voraussetzungen

- [Git](https://git-scm.com/downloads), [VS Code](https://code.visualstudio.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) oder unter Linux [Docker Engine](https://docs.docker.com/engine/install/), gestartet
- VS-Code-Erweiterung **Dev Containers** (`ms-vscode-remote.remote-containers`)

Bun und Chromium werden im Container installiert.

## Im Dev Container öffnen

```bash
git clone https://github.com/chappy2/duckazon-e2e.git
cd duckazon-e2e
code .
```

1. Befehlspalette öffnen: `Ctrl+Shift+P` / macOS `Cmd+Shift+P`.
2. **Dev Containers: Reopen in Container** wählen.
3. Einrichtung abwarten. Abhängigkeiten und Chromium werden automatisch installiert.

## Shop ohne Tests starten

Im Container-Terminal:

```bash
bun run dev
```

[Shop öffnen](http://localhost:5173), manuell ausprobieren. Mit `Ctrl+C` beenden.
Falls Abhängigkeiten fehlen: `bun install`.

## Testbrowser in noVNC sehen

1. [noVNC öffnen](http://localhost:6080/vnc.html).
2. **Connect** wählen, Passwort: `vscode`.
3. `bun run test:headed` starten. Chromium erscheint auf dem Container-Desktop.

| Port | Inhalt        |
| ---- | ------------- |
| 5173 | Shop          |
| 6080 | noVNC-Desktop |

Die Ports werden über VS Code weitergeleitet; bei Bedarf in der **Ports**-Ansicht öffnen. Freigaben lokal halten.

## Tests ausführen

```bash
bun run test:e2e         # headless
bun run test:headed      # sichtbar in noVNC
bun run test:debug       # Playwright Inspector
bunx playwright show-report
```

Playwright startet den Shop bei Bedarf selbst.

## Rabatt-Bug debuggen

`QUACK50` soll 29,99 € auf **15,00 €** reduzieren. Die Demo mit `?bug=discount` liefert absichtlich **17,99 €**.

### Mit VS-Code-Breakpoint

1. noVNC verbinden.
2. In den Playwright-Einstellungen der **Testing**-Ansicht `DEMO_BUG=1` setzen und Tests aktualisieren.
3. In `tests/03-debugging.spec.ts` bei `const total = …` einen Breakpoint setzen.
4. **Debug Test** wählen, mit `F10` weitergehen und `total` prüfen.
5. In `src/App.tsx` bei `bug ? 0.6 : 0.5` den Faktor `0.6` auf `0.5` ändern und erneut testen.

Danach Demo-Bug wiederherstellen und `DEMO_BUG` entfernen. Der Debugger hält den Testprozess an; die Webseite kann weiterlaufen.

### Mit Playwright Inspector

```bash
DEMO_BUG=1 bunx playwright test tests/03-debugging.spec.ts --headed --workers=1 --debug
```

`--debug` öffnet den Inspector. Für VS-Code-Breakpoints **Debug Test** verwenden.

## Aufbau

- **App:** React + Vite, Bun als Paketmanager und Skript-Runner.
- **Container:** Debian Bookworm, Node.js, Bun und Chromium.
- **Desktop:** `desktop-lite` mit Fluxbox, TigerVNC und noVNC; Start automatisch.
- **CI:** headless Playwright in `node:22-bookworm`, ohne Desktop. Eigenes Image, derselbe Testcode.

## Werkzeuge und Prüfungen

Der Container installiert Playwright, Prettier, ESLint, Codex sowie Erweiterungen für SQL, Shell, Tailwind und Container. Konfiguration: [devcontainer.json](.devcontainer/devcontainer.json).

```bash
bun run format          # formatieren
bun run format:check    # Format prüfen
bun run lint
bun run typecheck
```

## GitHub Actions

[Workflow](.github/workflows/playwright.yml): läuft bei Push, Pull Request und manuell.

- Installiert Abhängigkeiten und Chromium.
- Prüft Format, Linting und Typen; führt E2E-Tests aus.
- Speichert Reports und Testergebnisse sieben Tage; Traces und Screenshots bei Testfehlern.
- Überspringt den absichtlichen Bug-Test ohne `DEMO_BUG=1`.

## Fehlerbehebung

| Problem                    | Lösung                                                                 |
| -------------------------- | ---------------------------------------------------------------------- |
| Docker nicht erreichbar    | Docker starten.                                                        |
| noVNC ohne Browser         | `bun run test:headed` starten.                                         |
| Desktop fehlt              | `echo $DISPLAY` prüfen; Container neu bauen und neues Terminal öffnen. |
| Chromium fehlt             | `bunx playwright install chromium`                                     |
| Port nicht erreichbar      | VS Code → **Ports** → 5173 bzw. 6080 weiterleiten.                     |
| Breakpoint greift nicht    | **Debug Test** verwenden, `DEMO_BUG=1` setzen.                         |
| Formatprüfung schlägt fehl | `bun run format`                                                       |

## Quellen

Dieses Projekt und die Präsentation habe ich mit Unterstützung von ChatGPT (Codex) erstellt.

- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/tutorial)
- [Dev Containers desktop-lite](https://github.com/devcontainers/features/tree/main/src/desktop-lite)
- [Playwright Docker](https://playwright.dev/docs/docker) · [Playwright CI](https://playwright.dev/docs/ci)
- [Bun](https://bun.sh/docs)
