IDLE FRIENDS 2 — NETLIFY UPDATE

Enthalten:
- index.html
- netlify.toml
- package.json
- netlify/functions/leaderboard.mjs
- netlify/functions/presence.mjs
- netlify/functions/world-event.mjs
- netlify/functions/world-spawn.mjs
- netlify/functions/_store.mjs

WICHTIG: Nicht nur index.html deployen. Alle Dateien und Ordner hochladen.
Netlify muss das Repository neu deployen. Die APIs brauchen Netlify Functions und @netlify/blobs.

Geprüft: JavaScript-Syntax der Frontend-Datei und der Functions.
Nicht live geprüft: Die veröffentlichten Netlify-Endpunkte und das Verhalten mit mehreren echten Geräten.

Hinweis: Diese Version teilt Rangliste, Präsenz, globale Events und Spawn-Befehle über Netlify Blobs. Lokale Spielstände werden weiterhin nicht zwischen Geräten synchronisiert. Der Admin-Schutz basiert aktuell auf dem Namen test123 und ist ohne echte serverseitige Anmeldung nicht manipulationssicher.
