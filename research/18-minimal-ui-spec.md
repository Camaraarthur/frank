# Frank — Barebone UI Design Specification

**Date:** 2026-03-17
**Principle:** Visibly minimal. Rawness through absence of design.

---

## 1. Design Philosophy

Frank is a civic intelligence platform. It should look like it was built by people who care about democracy, not about design awards. The aesthetic is closer to a government document than a SaaS product — closer to Hacker News than Notion.

### The "honest" test

A UI feels honest when:
- You can tell the builders spent time on the *data*, not the *wrapping*
- There is no decoration that doesn't carry information
- The spacing feels considered but not "designed"
- It loads instantly (system fonts, no heavy assets)
- It looks like a tool, not a product

A UI feels dishonest when:
- It uses gradients, shadows, or animations to mask shallow content
- Typography is "branded" but the content is generic
- Cards have rounded corners, subtle shadows, and pastel backgrounds for no functional reason
- There are loading spinners with personality

### Reference sites that achieve this

| Site | What they get right |
|---|---|
| **Hacker News** | Pure content. Verdana, cream background (#f6f6ef), zero decoration. Proves you need nothing. |
| **Craigslist** | Functional to the point of being confrontational. No images, no colours, no logo. Just lists. |
| **GOV.UK** | Maximum utility. "Do the hard work to make it simple." GDS Transport font, black text, white background, blue links. Nothing else. |
| **The Marshall Project** | GT Pressura Mono for headlines (monospace = typewriter = investigative). Miller Display for body. Restrained black/white palette with sparse teal. Proves monospace signals seriousness. |
| **Bellingcat** | Newsroom minimalism. Black (#1a1918), white, and cream (#fff1ce) callout blocks. Georgia for pull quotes. Design trusts the reader. |
| **Are.na** | Creative minimalism. Neutral grays, single blue accent for interaction. 5px spacing increments. Content *is* the interface. |
| **Linear** | Modern minimal SaaS done right. Semantic color hierarchy (primary/secondary/tertiary/quaternary text). Monospace for code. Purposeful motion only. |
| **Cal.com** | Open-source honesty. System fonts for performance. Desaturated palette. No unnecessary decorative elements. |

---

## 2. Color Palette

Strip everything to near-monochrome. One accent colour used only for things that *demand* attention.

### Primary palette

```
--frank-white:       #FFFFFF    ← page background (not cream, not warm — just white)
--frank-black:       #1A1A1A    ← primary text
--frank-gray-700:    #404040    ← secondary text
--frank-gray-500:    #6B6B6B    ← tertiary/muted text
--frank-gray-300:    #B3B3B3    ← disabled text, subtle borders
--frank-gray-100:    #F0F0F0    ← section backgrounds (used sparingly)
--frank-border:      #E0E0E0    ← hairline borders only
```

### Single accent

```
--frank-red:         #C41E1E    ← links, severity markers, the Frank logo. That's it.
--frank-red-subtle:  #C41E1E12  ← very faint background for high-severity items only
```

### Why this palette

- **White, not cream (#FAF9F6).** The current warm off-white feels "designed." Pure white feels like a document, a report, a government form. It says: "we didn't choose a colour, we have nothing to hide."
- **True grays, not warm grays.** The current palette (#2C1D12, #5C4D3C, #8A7E72) has brown undertones that signal "craft." Neutral grays signal "utility."
- **Red accent only.** The current UI uses red, navy (#464C72), gold (#C48A0A), and green (#1B7A4A). Kill the navy, gold, and green. Red is urgency. Red is truth. One colour means every time you see it, it *means something*.
- **No green for "good."** Civic data is not a dashboard. There is no "good" or "bad" — there are facts. Use red for things that need attention, gray for everything else.

---

## 3. Typography

### Font stack

```css
/* Body and UI */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

/* Data, citations, source labels, monospace emphasis */
font-family: "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace;
```

**Remove:** Space Grotesk and Space Mono (Google Fonts). System fonts load in 0ms. They feel native, fast, and honest. Custom fonts feel like branding — Frank should not have "branding."

If monospace identity is essential for the Frank logo/wordmark, use system monospace. Otherwise, use the sans stack for everything.

### Type scale (4px baseline grid)

```
--text-xs:    12px / 16px    ← source labels, metadata, timestamps
--text-sm:    14px / 20px    ← secondary content, descriptions, card body
--text-base:  16px / 24px    ← primary body text
--text-lg:    18px / 28px    ← card titles, section headers
--text-xl:    24px / 32px    ← page titles
--text-2xl:   32px / 40px    ← hero only (the word "FRANK" on landing page)
```

### Weights

```
400 (regular)  ← body text, descriptions
500 (medium)   ← card titles, interactive labels
600 (semibold) ← section headers, the word "FRANK"
700 (bold)     ← never used in body; reserved for data emphasis only
```

### Rules

- **No uppercase tracking-widest section labels.** The current `text-xs font-bold uppercase tracking-widest` pattern (e.g., "YOUR REPRESENTATIVES") is a design affectation. Use sentence case with medium weight instead.
- **Monospace for data only.** Numbers, percentages, ranks, source citations. Not for headings.
- **Line-height always a multiple of 4px.** This creates vertical rhythm without effort.
- **Letter-spacing: 0.** Never add letter-spacing. It is the most reliable marker of "someone designed this."

---

## 4. Spacing Scale

Based on a 4px base unit. Every margin, padding, and gap is a multiple.

```
--space-1:    4px     ← micro: between inline elements
--space-2:    8px     ← tight: inside compact components
--space-3:    12px    ← default: most component padding
--space-4:    16px    ← standard: section padding, card padding
--space-5:    20px    ← comfortable: gap between cards
--space-6:    24px    ← generous: gap between sections
--space-8:    32px    ← large: page section spacing
--space-10:   40px    ← hero: top-level page padding
--space-16:   64px    ← full section breaks
```

### Rules

- **Card internal padding: 16px (--space-4).** Not 20px, not 24px. Tighter = more content-focused.
- **Gap between cards: 8px (--space-2).** Not 16px. Tight stacking says "this is a list of data, not a gallery."
- **Section spacing: 32px (--space-8).** Between major sections on a page.
- **Page max-width: 640px.** Like Hacker News. Narrow columns force focus.
- **No container max-width above 768px** unless it is a data table or map.

---

## 5. Component Patterns

### Issue Card

```
┌─────────────────────────────────────────────┐
│ Housing overcrowding in temporary lets       │
│                                              │
│ Residents report 3-4 families sharing        │
│ two-bedroom flats originally designed for    │
│ single occupancy. Sources: ONS, Newham       │
│ Council Housing Report 2024                  │
│                                              │
│ HIGH PRIORITY                    3 sources → │
└─────────────────────────────────────────────┘
```

**Implementation:**

```css
/* Issue card */
border: none;
border-left: 2px solid var(--frank-red);      /* severity indicator — only element with colour */
padding: 16px;
background: var(--frank-white);                /* same as page — card does NOT have its own bg */
margin-bottom: 8px;
```

- **No card background colour.** The current `#F0EFEC` card background creates visual "weight." Cards should be borderless against white, distinguished only by the left border.
- **No rounded corners.** `border-radius: 0`.
- **Severity as left-border colour only:** red for high, `--frank-gray-300` for medium, none for low.
- **No coloured badges.** The current `px-2 py-0.5` severity pills with coloured backgrounds are decoration. Instead: plain text at end of card, e.g., `HIGH PRIORITY` in red `--text-xs` monospace.

### Policy Card

```
┌─────────────────────────────────────────────┐
│ Enforce HMO licensing in Beckton ward        │
│                                              │
│ Require all multi-occupancy properties to    │
│ register. Cost: £40-80k/year. Time: 6-12    │
│ months. Feasibility: High.                   │
│                                              │
│ Addresses: Housing overcrowding, Unsafe      │
│ living conditions                            │
│                                              │
│ [▸ Details]                                  │
└─────────────────────────────────────────────┘
```

**Implementation:**

```css
border: 1px solid var(--frank-border);
padding: 16px;
background: var(--frank-white);
border-radius: 0;
```

- **Metadata inline, not in coloured badges.** Cost, time, and feasibility are plain text with monospace values: `Cost: £40-80k/year` rather than separate coloured pill components.
- **Expand/collapse is a plain text link**, not a chevron icon. `[▸ Details]` or `[▾ Hide]`.
- **Issues addressed are plain text**, not red-backgrounded tags. Just: `Addresses: Housing overcrowding, Unsafe conditions`.
- **Remove "Support this proposal" and "Comment" buttons** from the card. These are participatory features that belong on a dedicated page, not inline. Cards are for reading.

### Data Panel (Census, Deprivation, Representatives)

```
Your representatives
────────────────────────────────────────────
Lyn Brown  (Labour)  West Ham           src
Stephen Timms  (Labour)  East Ham       src

Deprivation index
────────────────────────────────────────────
2/10 — Most deprived 20% in England
Rank 4,231 of 33,755

Income        Worst 10%
Employment    Worst 20%
Education     Top 60%
Health        Worst 20%
src: English Indices of Deprivation, GOV.UK
```

**Implementation:**

- **No cards around data sections.** Just a heading, a hairline rule (`1px solid --frank-border`), and the data.
- **Data in a plain table or definition list**, not in bordered cards with background colours.
- **Source links are inline monospace text** at the end, not floating pill components.
- **Deprivation bar charts: remove them.** The current 3px-high colour bars are a visual affordance that adds nothing over the text "Worst 10%". Let the numbers speak.
- **Representative photos: remove them.** A 40x40 circle image is decoration. Name, party, constituency, source link. That is sufficient.

### Search / Input

```css
border: 1px solid var(--frank-border);
border-radius: 0;
padding: 12px 16px;
background: var(--frank-white);
font-size: 16px;
```

- **No 2px border.** The current `border: 2px solid #D4D0CA` is a style choice. 1px is structural.
- **No special background colour on input.** The current `#F0EFEC` input background makes it look "designed." White-on-white with a single-pixel border is a form field.

### Buttons

```css
/* Primary action */
background: var(--frank-black);
color: var(--frank-white);
border: none;
border-radius: 0;
padding: 12px 24px;
font-size: 14px;
font-weight: 500;
cursor: pointer;

/* Secondary/ghost */
background: transparent;
color: var(--frank-black);
border: 1px solid var(--frank-border);
border-radius: 0;
padding: 12px 24px;
```

- **Black, not navy (#464C72).** The current navy button colour is branding. Black is absence of choice.
- **No red buttons.** Red is for data, not for actions.
- **No disabled state colours.** Disabled = `opacity: 0.4; cursor: not-allowed`. That is sufficient.

### Loading State

```
Loading civic data...
```

Plain text. No animated dots. No pulsing circles. No coloured bouncing spheres.

If you must indicate progress, use an indeterminate progress element:
```html
<progress />  /* browser-native, unstyled */
```

---

## 6. What to REMOVE from the Current Frank UI

### Colours to kill
- `--navy: #464C72` and `--navy-light` — branding colour with no civic function
- `--gold: #C48A0A` — decorative
- `--green: #1B7A4A` — implies value judgments on neutral data
- `--bg: #FAF9F6` (warm cream) — replace with `#FFFFFF`
- `--bg-card: #F0EFEC` — remove card backgrounds entirely
- `--bg-hover: #E8E6E2` — replace with `#F0F0F0`
- All warm brown grays (`#2C1D12`, `#5C4D3C`, `#8A7E72`) — replace with neutral grays

### Fonts to kill
- Google Fonts import (`Space Grotesk`, `Space Mono`) — replace with system font stack
- `font-family: "Space Grotesk"` everywhere — remove
- `<link rel="preconnect" href="https://fonts.googleapis.com" />` — remove from layout.tsx

### Patterns to kill
- **Uppercase tracking-widest section headers** (`text-xs font-bold uppercase tracking-widest`) — replace with sentence case, medium weight
- **Coloured severity badges** (`px-2 py-0.5` with `backgroundColor: color + "18"`) — replace with plain text
- **Card background colours** (every `backgroundColor: "#F0EFEC"`) — set to white or remove
- **Animated loading dots** (bouncing red circles) — replace with plain text "Loading..."
- **Representative photos** (circular thumbnails) — remove
- **Progress bar charts** in census data — remove; use text
- **Decorative border-radius** — set all to 0
- **Letter-spacing on headings** (`letterSpacing: "0.1em"`) — remove
- **Fade-in-up animation** — remove; content should simply appear
- **Pulse animations** — remove
- **Custom scrollbar styles** — remove; use browser default
- **`::selection` colour** — remove; use browser default
- **Box shadows** anywhere — remove
- **SVG chevron icons** for expand/collapse — replace with text characters `▸` / `▾`
- **The FrankLogo SVG hexagon** — consider replacing with just the word "FRANK" in system monospace, or keep but simplify to a single-weight stroke

### Structural changes
- **Remove `antialiased` class from body** — let the browser render fonts natively
- **Remove `@tailwindcss/typography` plugin** — if prose styling is needed, write the 5 rules by hand
- **Max-width 640px** for all content columns (currently unconstrained in some views)

---

## 7. The Resulting Aesthetic

After these changes, Frank should look like:

1. **A government report that happens to be interactive.** Not a startup. Not a dashboard. A public document.
2. **Something you would print.** If you printed the page, it would look the same. No colour-dependent information. No hover states carrying meaning.
3. **Something that loads before you notice.** System fonts, no images, no animations. Sub-100ms paint.
4. **Something with one colour.** When you see red, it means something. Everything else is black, white, and gray.
5. **Something where every pixel of space is content or breathing room.** No decoration. No badges. No pills. No cards-within-cards.

The goal is not "minimal design." The goal is **no design** — where what remains is pure structure, and the structure is so clear it doesn't need styling to be understood.

---

## 8. Implementation Priority

1. **Kill the warm palette.** Replace all colour variables with the neutral set above. Instant transformation.
2. **Switch to system fonts.** Remove Google Fonts import and all `Space Grotesk`/`Space Mono` references.
3. **Remove card backgrounds.** Set all card backgrounds to white. Remove borders except functional left-borders on issue cards.
4. **Simplify typography.** Remove uppercase tracking, letter-spacing, and reduce to the 6-step type scale.
5. **Strip animations.** Remove all keyframe animations and transition effects.
6. **Tighten spacing.** Reduce card gaps, adopt the 4px grid consistently.

Each step makes Frank more honest. None of them require new code — only deletion.
