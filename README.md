# MTM – Motoren Technik Mayer · Website

Onepager für den Audi-Tuner MTM (Wettstetten bei Ingolstadt). Statisches HTML/CSS/JS
ohne Build, GSAP-Scrollchoreografie, Deploy auf Vercel – nach dem Muster aus dem
`neue-webseite`-Skill. Look seit dem Redesign: cinematisch-dunkel mit weißen Blöcken,
breite Archivo-Versalien, Radius 0 – Orientierung lamborghini.com (siehe `DESIGN.md`).

## Struktur

```
index.html          Onepager: Hero-Slider · Angebot (12 Kacheln) · Intro · Stage 1 · Technik (M-Cantronic) · Ablauf · Fahrzeuge (Galerie) · Über MTM · Marken · FAQ · Kontakt
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
- [x] Kontaktdaten (Adresse, Telefon, E-Mail, Öffnungszeiten) von mtm-online.de/kontakt übernommen – in `index.html`, `main.js`, Impressum, Datenschutz. Bitte gegenprüfen.
- [ ] Fakten im Text prüfen: Gründung 1990 durch Roland Mayer, PLZ 85139, Markenliste (nur Audi, Volkswagen, Porsche – laut mtm-online.de/tuning/?id=26; Bentley/Lamborghini bewusst entfernt), Stage-1-Umfang (Software/LLK/Turbolader), M-Cantronic-Aussagen (Echtzeit-Signaloptimierung, Rückrüstung, Plug-&-Play), Zähler „35+ Jahre / 5 Marken“.
- [ ] Neue Sektionen inhaltlich freigeben: **Ablauf** (4 Schritte – stimmt der Prozess so?), **Marken** (Modellreihen pro Marke sind Beispiele, bitte anpassen), **FAQ** (Aussagen zu Eintragung, Garantie/Gewährleistung, Dauer, Rückrüstung, Partnerbetriebe sind Entwürfe und müssen von MTM bestätigt werden).
- [ ] Stage 1 RS5 (B10): finale Werte für „8xx PS / 1xxx Nm“ eintragen (Spec-Tiles in `#stage1`), Banner-Grafik ggf. ohne eingebrannten Text als reines Foto liefern lassen.
- [ ] **Hero 1–3 und Über MTM zeigen echte MTM-Fahrzeuge** (RS3 653 PS, RS6 1001 PS, R8 GT Supercharged 822 PS, roter RS6 Avant) – Originale von media.mtm-online.de (News-Bereich), in 1200/2000/2800 px unter `assets/img/hero-*`, `feature-rs6-mtm-*`. Nutzungsrecht beim Kunden bestätigen, PS-Angaben aus den News-Titeln prüfen. **Stage 1** zeigt den MTM RS6 Final Edition (Autozeitung-Strecke), weil das RS5-Banner nur 1500×438 px hat – RS5-Foto in hoher Auflösung anfragen.
- [ ] **Pressefotos** (Autozeitung, Motorsport-Total, Evocars – aus den gespeicherten Artikeln in `Kunden/MTM`, Originale in `Kunden/MTM/bilder-presse`) werden in Galerie (`assets/img/gallery`), Technik (`technik-*.jpg`) und Stage 1 (`feature-rs6-final-*`) verwendet. Bildrechte liegen ggf. bei Fotografen/Redaktionen – vor Livegang mit MTM klären, ob es MTM-Pressematerial ist, sonst durch eigene Fotos ersetzen.
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
