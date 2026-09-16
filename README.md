# MTM – Motoren Technik Mayer · Website

Onepager für den Audi-Tuner MTM (Wettstetten bei Ingolstadt). Statisches HTML/CSS/JS
ohne Build, GSAP-Scrollchoreografie, Deploy auf Vercel – nach dem Muster aus dem
`neue-webseite`-Skill. Look seit dem Redesign: cinematisch-dunkel mit weißen Blöcken,
breite Archivo-Versalien, Radius 0 – Orientierung lamborghini.com (siehe `DESIGN.md`).

## Struktur

```
index.html          Onepager: Hero-Slider · Intro · Leistungen (Scroller) · Stage 1 · Technik · Ablauf · Über MTM · Marken · FAQ · Kontakt
style.css           alle Styles, Tokens in :root ganz oben
main.js             Nav, Vollbild-Menü, Hero-Slider, Drag-Scroller, Formular (mailto), FAQ (WAAPI), GSAP-Reveals/Zähler/Parallax
impressum.html      eigenständig, ohne JS
datenschutz.html    eigenständig, ohne JS
assets/img          Fotos (aus Kunden/MTM, umbenannt, JPEG q88)
assets/logos        mtm-wappen.png
DESIGN.md           Designsystem für Design-Agenten (Claude Design)
robots.txt  sitemap.xml  vercel.json  .gitignore  .vercelignore
```

## Lokal starten

```bash
python -m http.server 5190
```

→ http://localhost:5190

## Deploy

```bash
vercel --prod
```

Vor dem ersten Deploy `https://DOMAIN/` in `index.html`, `impressum.html`,
`datenschutz.html`, `robots.txt` und `sitemap.xml` durch die echte Domain ersetzen.

## Offene Punkte vor Livegang

**Vom Kunden bestätigen / liefern**
- [ ] Impressum & Datenschutz: alle `[Platzhalter]` (rot markiert) füllen, Rechtsform, Register, USt-ID, Verantwortlicher. Rechtstexte sind ein Entwurf – juristisch prüfen lassen.
- [ ] Kontaktdaten in `index.html` (`#kontakt`): Adresse, Telefon, E-Mail, Öffnungszeiten. E-Mail-Adresse zusätzlich in `main.js` (`mailto:info@example.de`).
- [ ] Fakten im Text prüfen: Gründung 1990 durch Roland Mayer, PLZ 85139, „Audi, VW, Porsche, Bentley, Lamborghini“, Stage-1-Umfang (Software/LLK/Turbolader), M-Cantronic-Aussagen (Echtzeit-Signaloptimierung, Rückrüstung, Plug-&-Play), Zähler „35+ Jahre / 5 Marken“.
- [ ] Neue Sektionen inhaltlich freigeben: **Ablauf** (4 Schritte – stimmt der Prozess so?), **Marken** (Modellreihen pro Marke sind Beispiele, bitte anpassen), **FAQ** (Aussagen zu Eintragung, Garantie/Gewährleistung, Dauer, Rückrüstung, Partnerbetriebe sind Entwürfe und müssen von MTM bestätigt werden).
- [ ] Stage 1 RS5 (B10): finale Werte für „8xx PS / 1xxx Nm“ eintragen (Spec-Tiles in `#stage1`), Banner-Grafik ggf. ohne eingebrannten Text als reines Foto liefern lassen.
- [ ] Bildmaterial in höherer Auflösung: alle Fotos liegen nur mit 500 px Höhe vor. Für Hero (`motor-rs.jpg`) und Panels mindestens 1600 px Breite anfragen. Erst dann `medien-assets` (WebP/AVIF, srcset) durchlaufen.
- [ ] Optional: Galerie-Sektion, sobald weitere Fotos (Fahrzeuge, Werkstatt, Prüfstand) vorliegen.

**Technisch**
- [ ] Formular: aktuell `mailto:`-Fallback in `main.js`. Vor Livegang durch einen Endpunkt ersetzen (Vercel Function, Formspree o. ä.) und Datenschutz Abschnitt 4 anpassen.
- [ ] Schriften (Google Fonts) und GSAP (cdnjs) lokal einbinden – DSGVO (IP-Übermittlung an Google/Cloudflare). Danach Abschnitt 5 der Datenschutzerklärung entfernen.
- [ ] `og.jpg` (1200×630) erstellen und in `index.html` eintragen (aktuell zeigt `og:image` auf das Stage-1-Banner).
- [ ] Prüfskripte aus `qa-deploy/scripts/` kopieren und laufen lassen.

## Hinweise zur Umsetzung

- Reveal-Zustände (`opacity:0`) greifen nur mit `html.js`; ohne JS oder wenn GSAP nicht lädt, ist alles sichtbar (`main.js` entfernt die Klasse).
- Produktfotos mit weißem Hintergrund liegen in weißen Panels (`.card__media`, `.panel--light`, `object-fit:contain`), Szenenfotos in dunklen (`.card__media--photo`, `.panel`).
- `prefers-reduced-motion`: keine Animationen, Zähler zeigen sofort den Endwert.
- Menü ist immer ein Vollbild-Overlay (auch Desktop), Kacheln laufen im horizontalen Scroller.
- Alle Fotos liegen nur mit 500 px Höhe vor – Vollbild-Sektionen kaschieren das mit Verläufen und `saturate(.85)`. Höher aufgelöste Fotos bringen hier am meisten.
