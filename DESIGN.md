# DESIGN.md — MTM Motoren Technik Mayer

Designsystem der MTM-Website. `style.css` ist die Wahrheit, diese Datei die
Beschreibung davon – wer Tokens im CSS ändert, zieht hier nach.

## 1. Visual Theme & Atmosphere

Cinematisch und zurückhaltend, orientiert an Hersteller-Auftritten wie
lamborghini.com: Vollbild-Fotos mit dunklen Verläufen, dazwischen ruhige weiße
Blöcke wie Katalogseiten. Die Typografie trägt die Marke – breite Grotesk-Versalien
in mittlerem Gewicht, nicht fett. Kleine Labels mit weitem Buchstabenabstand
ordnen ein. Die Palette ist komplett monochrom – Schwarz, Papierweiß, Chrom. Kein Rot,
kein Orange (Hausregel: wirkt wie Fremd-Branding).
Keine Rundungen, keine Schatten, keine Pillen, keine Verläufe auf Flächen –
nur auf Fotos, um Text lesbar zu machen und die niedrige Bildauflösung zu kaschieren.

## 2. Color Palette & Roles

| Token | Wert | Rolle |
|---|---|---|
| `--bg` | `#0B0B0C` | Dunkle Sektionen, Hero, Menü |
| `--bg-2` | `#141416` | Reserve für Kontrastflächen |
| `--paper` | `#F4F3F0` | Helle Sektionen (Leistungen, Technik, Ablauf, FAQ) |
| `--paper-2` | `#FFFFFF` | Kacheln, Produktpanels |
| `--ink` / `--ink-2` / `--ink-3` | `#F2F1EE` / 68 % / 42 % | Text auf Dunkel: Headline / Fließtext / Labels |
| `--dark` / `--dark-2` / `--dark-3` | `#0B0B0C` / 66 % / 42 % | Text auf Hell in derselben Staffelung |
| `--line` / `--line-dark` | weiß 14 % / schwarz 14 % | Hairlines auf Dunkel / Hell |
| `--accent` | `#C9CBCF` | Chrom – Hover des ausgefüllten Buttons, metallische Details |
| `--warn` | `#D8B24A` | Bernstein für Formularfehler und Platzhalter in Rechtstexten |

Regel: Sektionen wechseln dunkel/hell in Blöcken. Innerhalb eines Blocks keine
weitere Farbfläche. Rot ist auf der gesamten Seite tabu – auch nicht für Fokus,
Selektion oder Fehler (Fokus = `currentColor`, Fehler = `--warn`). Das Rot im
MTM-Wappen ist Kundenlogo und bleibt.

## 3. Typography Rules

- Eine Familie: `Archivo` (variabel, `wdth` 100–125, `wght` 300–700).
- Headlines: Versalien, Gewicht 500, `font-variation-settings:'wdth' 118`, `line-height` 0.96–1.04.
  H1 `clamp(44px,7.2vw,118px)` · H2 `clamp(30px,3.6vw,54px)` · H3 19 px `'wdth' 112`.
- Zahlen (Intro, Specs, Steps): Gewicht 300–400, `'wdth' 112`, groß und leicht.
- Labels `.label`: 11.5 px, `letter-spacing:.24em`, Versalien, 42 % Deckkraft.
- Links `.link` und Buttons: 12.5 px, `letter-spacing:.22em`, Versalien.
- Body: 16 px, Gewicht 400, `line-height` 1.65. Fließtext auf Dunkel `--ink-2`, auf Hell `--dark-2`.

## 4. Component Stylings

- **Nav**: fixiert, dreispaltig (Menü-Button · Wappen zentriert · „Anfrage“). Über Fotos nur ein Verlauf oben; ab 40 px Scroll `rgba(11,11,12,.72)` + `blur(16px)` + Hairline.
- **Menü**: vollflächig schwarz, Links in H1-Größe mit Nummer, gestaffelt 50 ms eingeblendet; rechts unten Adresse. CSS-Transitions, dadurch jederzeit unterbrechbar.
- **Hero-Slider**: 3 Slides, Crossfade 1.1 s `ease-in-out`, Bild fährt 8 s linear von `scale(1.08)` auf 1 (Ken Burns). Fortschrittsbalken 56×1.5 px pro Slide, 7 s, pausiert bei Hover. Wischen auf Touch, Pfeiltasten.
- **Link** `.link`: Versalien, 1 px Unterstrich 40 % → 100 % bei Hover, Pfeil aus Strich + gedrehtem Winkel, rutscht 6 px.
- **Button** `.btn`: 54 px, 1 px Rahmen in Textfarbe, Radius 0, Hover invertiert. `.btn--solid` ausgefüllt in Textfarbe (weiß auf Dunkel, schwarz auf Hell), Hover Chrom. `:active` `scale(.98)` 120 ms.
- **Angebots-Kacheln** `.ptile` (12 Stück direkt unter dem Hero): Papierflächen in einem Raster mit 1 px Hairline-Fugen, Index oben links, Bildfeld 4:3 (`contain` für Produktfotos, `cover` mit Papier-Verlauf für Szenenfotos), Textfuß mit Hairline, Titel 13 px Versalien `'wdth' 112`, Untertitel 11.5 px, Pfeil rechts unten (35 % → 100 %, rutscht 4 px). Hover hellt auf Weiß, Bild `scale(1.05)`. Ohne Reveal, damit das Angebot sofort da ist. 6 → 4 → 2 Spalten.
- **Feature** (Vollbild): `min-height:92svh`, Foto mit Parallax ±8 %, Verlauf von der Textseite her, Inhalt max. 620 px. Variante `--right` spiegelt Verlauf und Textspalte.
- **Specs / Intro-Fakten / Steps**: Hairlines oben und unten, Spalten durch Hairlines getrennt, Zahl groß und leicht, Label klein.
- **Marken-Liste**: eine Zeile pro Marke in H1-Größe, Modellreihen rechts klein; Hover rückt 24 px ein.
- **FAQ**: `<details>` mit Hairlines, Plus-Icon aus zwei 1-px-Strichen, Höhe + Deckkraft 260 ms `cubic-bezier(.23,1,.32,1)` per WAAPI.
- **Formular**: nur Unterlinien, Labels als `.label`, Fokus hebt die Linie auf `--ink`.

## 5. Layout Principles

- Container `min(100% - 2*gutter, 1520px)`, Gutter `clamp(20px,4vw,64px)`.
- Sektionsabstand `clamp(88px,10vw,160px)`, Sektionskopf max. 900 px.
- Zweispaltig `.grid-2` mit `clamp(40px,7vw,120px)` Lücke.
- Der Scroller läuft randlos, die Kacheln beginnen aber auf der Container-Kante (`padding-inline:max(gutter,(100% - max)/2)`).

## 6. Depth & Elevation

Keine Schatten. Tiefe entsteht nur durch Fotos mit Verlauf und den Wechsel
dunkel/hell. Hairlines statt Kanten. Blur ausschließlich in der gescrollten Nav.

## 7. Do's and Don'ts

- Do: Fotos vollflächig nur ab ~2000 px Breite (aktuell Unsplash-Platzhalter in `assets/img/hero-*`, `feature-*`), immer mit Verlauf von der Textseite; Sättigung 85 %, Kontrast 105 %.
- Do: Produktfotos auf Weiß nur in hellen Sektionen oder weißen Kacheln.
- Do: Ein Gedanke pro Sektion, viel Luft, wenige Elemente.
- Don't: Radien, Schatten, fette Headlines, Rot oder Orange in jeder Form, mehr als ein Button pro Sektion.
- Don't: Text in Bilder brennen (Stage-1-Banner wird deshalb rechts angeschnitten, `object-position:100%`).
- Don't: Kritische Inhalte hinter Reveals verstecken, die ohne JS unsichtbar bleiben.

## 8. Responsive Behavior

- Breakpoints: 1100 (Steps 2-spaltig), 900 (Menü-Label weg, einspaltig, Feature-Verlauf von unten), 640 (Fakten/Specs/Steps gestapelt, Marken-Zeilen umbrechen, Kacheln 78 vw).
- Hero `100svh`, min. 600 px (560 mobil). Touch-Ziele ≥ 44 px. Hover nur unter `(hover:hover) and (pointer:fine)`.
- Parallax und Ken Burns entfallen bei `prefers-reduced-motion`; Slider läuft dann nicht automatisch.

## 9. Agent Prompt Guide

- „Neue **Galerie-Sektion** nach *Über MTM*: Vollbild-Scroller mit 5 Szenenfotos, jedes mit Label unten links, Snap, Pfeile wie im Leistungs-Scroller.“
- „**Produktseite Stage 1** (`stage-1.html`): Hero-Slide als Standbild, Specs-Zeile, Tabelle Serie vs. MTM in Hairlines, Ablauf-Steps, Button ‚Vormerken lassen‘.“
- „**News-Block** wie lamborghini.com: helle Sektion, 3 Spalten, Datum als Label, Titel als H3, Link ‚Mehr lesen‘.“
- „**Modell-Chooser**: Marken-Liste als Vollbild-Slides – Klick auf eine Marke blendet ihr Foto als Hintergrund ein.“
