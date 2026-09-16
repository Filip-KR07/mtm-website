# DESIGN.md — MTM Motoren Technik Mayer

Designsystem der MTM-Website. `style.css` ist die Wahrheit, diese Datei die
Beschreibung davon – wer Tokens im CSS ändert, zieht hier nach.

## 1. Visual Theme & Atmosphere

Dunkel, technisch, laut in der Typografie, ruhig in der Fläche. Die Seite fühlt
sich an wie eine Werkstatt bei Nacht: schwarze Flächen, ein einziges Rot, Chrom
nur als Akzent. Große kondensierte Versalien tragen die Aussage, der Fließtext
bleibt sachlich. Produktfotos liegen wie Katalogseiten in weißen Panels – der
Kontrast zum Schwarz ist gewollt und macht Teile lesbar wie ein Datenblatt.
Keine Verläufe außer dem roten Glow im Hero und hinter Stage 1, keine Pills,
keine Schatten auf Text.

## 2. Color Palette & Roles

| Token | Wert | Rolle |
|---|---|---|
| `--bg` | `#0A0A0B` | Seitenhintergrund |
| `--bg-2` | `#111113` | Sektionen mit Kontrast (Ticker, Stage 1, Kontakt), Karten |
| `--bg-3` | `#18181B` | Inputs, Fotopanels |
| `--ink` | `#F4F4F2` | Headlines, Primärtext |
| `--ink-2` | `#A6A6AC` | Fließtext, Nav-Links |
| `--ink-3` | `#6E6E75` | Labels, Fußnoten |
| `--line` / `--line-2` | `rgba(255,255,255,.08 / .16)` | Trennlinien, Rahmen |
| `--accent` | `#E4001B` | MTM-Rot: Primärbutton, Punkt in der Headline, Ticker-Rauten |
| `--accent-2` | `#FF2A42` | Hover des Primärbuttons |
| `--accent-text` | `#FF4D61` | Rot auf Schwarz für Text (Eyebrows, Indizes, Spec-Labels) – heller wegen Kontrast |
| `--chrome` | `#C9CBCF` | Chips, metallische Details |
| `--paper` | `#FFFFFF` | Weiße Produktpanels |

Regel: Rot ist ein Signal, keine Fläche. Pro Viewport höchstens ein roter Button.

## 3. Typography Rules

- Display: `Barlow Condensed` 700/800, Versalien, `letter-spacing:-.01em`, `line-height:.88–.92`.
- Body: `Barlow` 400/500/600, 17 px (16 px mobil), `line-height:1.6`.
- Skala: H1 `clamp(64px,10.5vw,164px)` · H2 `clamp(38px,5.2vw,74px)` · H3 28 px · Eyebrow 14 px, `letter-spacing:.18em`, rot, mit 22 px Strich davor · Spec-Zahlen `clamp(40px,4.5vw,64px)`.
- Fallbacks: `Impact, 'Arial Narrow'` für Display; `system-ui` für Body.
- `text-wrap:balance` auf allen Headlines.

## 4. Component Stylings

- **Buttons** `.btn`: 52 px hoch, Radius 6 px, Display-Font 18 px Versalien `.06em`. Primär rot/weiß → Hover `--accent-2`. Ghost mit `--line-2`-Rahmen → Hover weißer Rahmen. `:active` `scale(.98)`. Pfeil im Ghost-Button rutscht 4 px nach rechts.
- **Karten** `.card`: `--bg-2`, 1 px `--line`, Radius 10 px, Bildpanel 3:2. Hover: `translateY(-4px)`, Bild `scale(1.04)`, Rahmen `--line-2`. Index (01–08) rot in Display-Font.
- **Panels** `.panel`: Rahmen `--line-2`, Schatten `0 20px 60px rgba(0,0,0,.45)`. `.panel--light` weiß mit `object-fit:contain` und 6 % Innenabstand. `.panel--offset` 72 % breit, nach rechts und −14 % nach oben versetzt.
- **Spec-Tiles** `.specs li`: `--bg`, Zahl groß, Label rot `.16em`.
- **Inputs**: `--bg-3`, Rahmen `--line-2`, 50 px hoch, 16 px Schrift (kein iOS-Zoom). Fokus: roter Rahmen + `0 0 0 3px rgba(228,0,27,.2)`.
- **Nav**: fixiert, transparent; ab 24 px Scroll `rgba(10,10,11,.82)` + `blur(14px)` + Linie. Aktiver Abschnitt weiß (`aria-current`). Mobil Burger, Panel unter der Nav.
- **Chip**: dunkel-transparent mit Blur, Chrom-Text, 14 px Display.
- **Ticker**: 38 s lineare Schleife, Rauten in Rot als Trenner, an den Rändern maskiert.

## 5. Layout Principles

- Container `min(100% - 2*gutter, 1400px)`, Gutter `clamp(20px,4vw,56px)`.
- Sektionsabstand `clamp(80px,10vw,150px)`; Sektionskopf max. 900 px.
- Zweispaltige Sektionen `.grid-2` mit `clamp(40px,6vw,96px)` Lücke; Bild und Text wechseln die Seite (Technik: Bild links, Über MTM: Bild rechts).
- Karten 4 Spalten → 2 (≤ 1100 px) → 1 (≤ 640 px), 18 px Lücke.

## 6. Depth & Elevation

Drei Ebenen: Seite (`--bg`) → Sektion/Karte (`--bg-2`, 1 px Linie) → Panel/Input (`--bg-3` oder weiß). Schatten nur auf Bildpanels und Hero-Bild. Kein Schatten auf Buttons oder Text. Glow: radial rot mit 22 % (Hero) bzw. 16 % (Stage 1) Deckkraft.

## 7. Do's and Don'ts

- Do: Zahlen und Fakten groß in Display-Font, Labels klein und rot.
- Do: Produktfotos auf Weiß, Szenenfotos auf Dunkel – nie mischen innerhalb eines Panels.
- Do: Rot sparsam; der Punkt hinter „MTM.“ ist der lauteste Einsatz.
- Don't: Rundungen über 10 px, Pills, Verläufe auf Buttons, Glas-Effekte außerhalb von Nav und Chip.
- Don't: Text in Bilder brennen (Stage-1-Banner ist eine Ausnahme aus Kundenmaterial).
- Don't: Kritische Inhalte (Kontakt, Preise) hinter Reveals verstecken, die ohne JS unsichtbar bleiben.

## 8. Responsive Behavior

- Breakpoints: 1100 (Karten 2-spaltig, H1 kleiner), 900 (Burger, einspaltig, Hero ohne 100svh), 640 (Karten 1-spaltig, Specs/Stats 2 + 1, Formular 1-spaltig).
- Touch-Ziele ≥ 44 px, Burger 48 px. Hover-Effekte nur unter `(hover:hover)`.
- Parallax nur ohne Touch; `prefers-reduced-motion` schaltet alle Animationen ab.
- `viewport-fit=cover`, Safe-Area-Insets in Nav und Footer.

## 9. Agent Prompt Guide

- „Neue Sektion **Galerie** nach *Über MTM*: horizontales Scroll-Band mit 6 Szenenfotos in `.panel`, Snap, Eyebrow ‚Einblicke‘, H2 ‚Details, die den Unterschied machen.‘“
- „Eine **Produktseite Stage 1** (`stage-1.html`) im selben System: Hero mit Spec-Tiles, Tabelle Serie vs. MTM, CTA ‚Vormerken lassen‘.“
- „**Light-Variante** für Print/Angebote: `--bg` → `#F5F4EF`, `--ink` → `#0B0B0C`, Rot bleibt, weiße Panels werden `#FFFFFF` mit 1 px `rgba(0,0,0,.08)`.“
- „**Sektion Werkstatt** mit Prüfstand-Foto: Panel links, drei Zähler rechts (kW, Nm, Läufe/Jahr), Eyebrow ‚Prüfstand‘.“
