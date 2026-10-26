# Dashboard design rules

The owner's rules for the team dashboard (`/review`, `src/review.ts`) and any
other admin screen, supplied on 2026-10-26. They are the source of truth for
these screens; the public pitch page follows the site's `DESIGN.md` instead.
`npm run check` enforces what a build can check (`scripts/design-lint.mjs`:
colours only as tokens in `:root`, no inline `style` attributes).

## How they are applied here

- Tokens: `CSS` in `src/review.ts`, `:root` block, exactly as §1. One extra
  token each for the placeholder colour (#b3b3b3, §4), the dialog backdrop and
  the field focus ring (§4), button heights, toast duration and page width.
- Single light theme (the rules define no dark values).
- One screen, so no sidebar (§4 Zijbalk applies once there are more screens).
- Order (§5): title + intro with live counts → banner (email not connected)
  → slots card → toolbar (search, status filter; Export CSV right) → table.
- Table: sortable headers (Time, Company, Received, Status), filters instant
  (300 ms, in the URL, back button works), status pills: Waiting = warning,
  Approved = ok, Denied = error, Cancelled/Expired = neutral. Under 50 rows per
  event, so no pagination yet; add server pagination when that changes.
- Buttons: Approve = white 32px row action; Deny = destructive (orange) with
  the confirm dialog (Cancel + "Yes, deny", red). Busy text on every submit.
- Toasts: black, top right, success 4.5 s, errors stay until closed.
- Language: the interface is English, so §6 applies in spirit: no em dashes,
  no exclamation marks, one word per concept ("request", "slot", "reviewer").
- Preview: `npm run preview` builds `public/the-pitch/review-preview/` from
  this same code with sample data.

## The rules (owner, 2026-10-26, as supplied)

### 1. Tokens (CSS-variabelen op de root van de app)

Kleuren
- Achtergrond pagina `--bg: #f9f9fa` · kaarten/vlakken `--bg-elev: #ffffff`
- Randen `--border: #eaeaea` · sterkere rand `--border-strong: #d4d4d4`
- Tekst `--fg: #000000` · gedempt `--fg-muted: #666666` · zwak `--fg-faint: #8f8f8f`
- Accent = zwart (`--accent: #000`, tekst erop `#fff`). Er is GEEN merkkleur.
- Focusring `--geist-blue: #0070f3`
- Betekenis, elk met -bg / -border / -fg:
  - ok (groen): #ecfdf5 / #a7f3d0 / #047857
  - fout (rood): #fef2f2 / #fecaca / #b91c1c
  - waarschuwing (oranje): #fff7ed / #fed7aa / #c2410c
  - neutraal (grijs): #f5f5f5 / #e5e5e5 / #666666

Vorm
- `--radius: 10px` (kaarten, tabellen, dialogen) · `--radius-sm: 6px` (velden, meldingen)
- Schaduw spaarzaam: `--shadow-sm: 0 1px 2px rgba(0,0,0,.05)`,
  `--shadow-md: 0 4px 14px rgba(0,0,0,.08)` (alleen voor zwevende lagen)
- Hover op een rij of kaart: de rand wordt donkerder. Er beweegt niets omhoog.

Lettertype
- Geist Sans voor alles, Geist Mono voor id's, codes en metadata.
- Body letter-spacing -0.011em, antialiased.

### 2. Typografie: vijf niveaus, altijd via een klasse, nooit inline

1. Paginatitel: 26px / 700, line-height 1.2
2. Intro onder de titel: 14.5px, gedempt, line-height 1.55
3. Sectiekop (kaarttitel): 15px / 600, zwart
4. Veldlabel: 13px / 500, gedempt, 7px boven het veld
5. Eyebrow: 11px / 600, HOOFDLETTERS, letter-spacing .045em, zwak

Hulptekst onder een veld: 12.5px, zwak. Tabeltekst 13.5px, tabelkop 12px / 600 gedempt.

### 3. Knoppen

- Precies twee maten: **40px** (formulieracties) en **32px** (rij-acties en
  werkbalk). Geen derde maat.
- **Zwart = afronden:** opslaan, aanmaken, versturen, en de "+ … toevoegen"-knop
  boven een lijst. **Wit met rand = al het andere:** annuleren, test sturen,
  rij-acties, terugdraaien.
- Hoogstens één zwarte knop per blok.
- Destructief: oranje tekst en rand (`--warn-*`), altijd met een bevestigingsdialoog.
  De bevestigknop in die dialoog is rood gevuld.
- Elke verzendknop toont een bezig-stand: uitgeschakeld en een andere tekst
  ("Opslaan…"). Zo kan niemand dubbel klikken.
- Links en knoppen die hetzelfde doen, zien er hetzelfde uit.

### 4. Onderdelen

- **Velden:** wit, rand 1px `--border`, radius 6px, padding 9px 11px, 14px.
  Bij focus een zwarte rand plus een ring van `0 0 0 3px rgba(0,0,0,.1)`.
  Placeholder #b3b3b3. Selects met een eigen chevron rechts.
- **Kaart:** wit, rand 1px, radius 10px, padding 20px. Kaarten zijn voor
  dashboards en details, NOOIT voor lijsten.
- **Lijst van records = een echte tabel,** in een omhulsel met rand en radius 10px.
  Kopcellen padding 9px 14px op `--bg`, cellen 11px 14px, scheidingslijn
  1px. Getallen rechts uitgelijnd met tabulaire cijfers. Sorteren via de
  kolomkop. De hele rij is klikbaar als er een detailpagina is. 50 per pagina,
  met paginering op de server.
- **Filters werken direct** (300ms vertraging, stand in de URL, de terugknop
  werkt). Nooit een knop "Toepassen".
- **Twee soorten feedback, nooit door elkaar:**
  - Melding (banner in de pagina, radius 6px, 13.5px, in de betekeniskleuren):
    zegt iets over de STAND van de pagina, bijv. "instelling ontbreekt".
  - Toast (zwart, rechtsboven, radius 10px): zegt wat een ACTIE net deed.
    Bij succes verdwijnt hij na 4,5s, een fout blijft staan tot je hem sluit.
- **Lege staat:** gestippelde rand, gecentreerd, met de volgende actie erin.
- **Statuslabels:** kleine pillen in de betekeniskleuren (ok/fout/waarschuwing/neutraal).
- **Bevestigingsdialoog:** de enige manier om iets te laten bevestigen (nooit
  `window.confirm`). Donkere achtergrond, Escape sluit, de focus staat op
  annuleren, knoppen "Annuleren" + "Ja, [werkwoord]".
- **Grafieken:** alleen eenvoudige CSS-balken, geen grafiekbibliotheek. Elk getal
  uit een grafiek staat ook in een tabel eronder.
- **Zijbalk:** platte lijst met vaste kopjes in hoofdletters, geen uitklapgroepen.
  Alleen de lijst scrolt; het logo, een zoekveld (⌘K) en je naam onderin staan vast.
  Eén bron voor de menu-items, die ook de ⌘K-zoeker voedt.
- **Focus:** haal de `:focus-visible`-ring nooit weg.

### 5. Opbouw van elk scherm, altijd in deze volgorde

1. Titel + intro (met actuele aantallen waar dat helpt)
2. Feedback (melding of toast, zie hierboven)
3. Werkbalk: zoeken en filters links; exporteren, importeren en "+ … toevoegen" rechts
4. De inhoud: een tabel voor lijsten, kaarten voor details
5. Formulieren: lange formulieren krijgen een plakkende opslaanbalk onderin,
   en een waarschuwing bij het weggaan zonder opslaan

### 6. Taal en toon (als de interface Nederlands is)

- Kort, zakelijk, vriendelijk. Zeg wat er gebeurde en wat je nu kunt doen.
- Knoppen: nieuw = "+ X toevoegen", opslaan = "Opslaan", in dialogen
  "Annuleren" + "Ja, …".
- Houd één woord per begrip aan, en de menunaam en de paginatitel zijn
  altijd hetzelfde woord. Maak een woordenlijst en houd je eraan.
- Geen gedachtestreepjes (—), gebruik de typografische aanhalingstekens en apostrof
  (‘ ’ “ ”), en geen uitroeptekens in tekst voor gebruikers.

### 7. Consistentie (het belangrijkste)

- Zoek vóór je iets bouwt het bestaande patroon op en gebruik het onveranderd.
- Wil je het anders? Pas dan het PATROON aan (component + CSS), alle plekken die
  het gebruiken, en dit document, in één keer. Een lokale variant van
  een bestaand patroon is een fout, ook als hij er goed uitziet.
- Waarden die niet uit een token komen (kleur, maat, radius, duur) zijn fouten.
- Leg de regels vast in een DESIGN.md in het project, en laat de build waar
  het kan controleren dat ze gevolgd worden.
