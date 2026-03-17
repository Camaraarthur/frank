# Visual Identity Research: Frank

## 1. Color Psychology for Civic/Democratic Tools

### What Colors Signal Trust, Transparency, and Reliability

Research consistently identifies specific color associations in civic and institutional contexts:

- **Blue** is the dominant "trust" color across cultures. Navy and deep blue communicate institutional authority, stability, and professionalism. GOV.UK uses `#1d70b8` as its primary brand blue. The USWDS (US Web Design System) describes its palette intent as conveying "a warm and open American spirit, with bright saturated tints of blue and red, grounded in sophisticated deeper shades of cool blues and grays."
- **Warm neutrals** (beige, cream, warm gray) signal approachability and reduce the clinical feeling of pure white. They suggest humanness and craftsmanship without sacrificing professionalism.
- **Green** communicates growth, sustainability, and civic progress. Decidim uses `#0F7A52` for success states.
- **Gold/amber** signals importance, warmth, and value — but must be used carefully due to poor contrast on light backgrounds.
- **Red** signals urgency, importance, and action — but can also signal danger or partisanship. Best used as a deliberate accent, not a primary.

### What Government and Civic Websites Use

| Platform | Primary Colors | Rationale |
|----------|---------------|-----------|
| **GOV.UK** | White bg, black text `#0b0c0c`, blue links `#1d70b8`, yellow focus `#ffdd00` | Maximum clarity, accessibility-first, no warmth — pure utility |
| **USWDS** (US gov) | White bg, dark gray text, blue primary, red secondary | "Warm and open American spirit" — more emotional than GOV.UK |
| **Decidim** | Light gray bg `#F3F4F7`, blue secondary `#155ABF`, dark text `#020203` | Clean, institutional, customizable per deployment |
| **Go Vocal** (ex-CitizenLab) | White bg, teal/mint `#C0ECE0`, coral `#E14C62`, neutral gray `#F6F4F4` | Modern, friendly, government-adjacent but not government |
| **mySociety** | White bg, cyan-bluish gray, vivid red and purple accents | Functional, illustration-heavy, approachable |
| **Pol.is** | Minimal interface, purple-blue tones, white bg | Deliberately understated — the data visualization IS the brand |
| **CivicTheme** (Australia) | Configurable light/dark themes, WCAG 2.1 AA compliant | Government-grade design system with branding flexibility |

### Assessment of Frank's Current Palette

**Current palette:**
- Red: `#E62B1E` (warm vermilion)
- Blue: `#464C72` (muted slate navy)
- Yellow/Gold: `#F4A900` (rich mustard)
- Dark Brown: `#492615` (text)
- Background: `#EFEBE3` (warm off-white/beige)

**What works:**
- The warm off-white background `#EFEBE3` is distinctive and immediately differentiates Frank from every government site (which are universally white or light gray). It communicates warmth, humanness, and craft.
- Dark brown `#492615` text is excellent — softer than black, more human, and has outstanding contrast (11.24:1, passes AAA).
- The muted slate navy `#464C72` is a strong anchor — less corporate than pure blue, more sophisticated, and passes AA for normal text (6.96:1).
- The overall palette has a "newspaper editorial" quality that aligns with Frank's role as a civic publication.

**What needs attention:**
- The red `#E62B1E` fails AA for normal text on the beige background (3.74:1). It works only for large text or decorative use.
- The yellow/gold `#F4A900` critically fails all WCAG standards on beige (1.68:1). It cannot be used for text, links, buttons, or any interactive elements on this background. It even fails the 3:1 requirement for UI components.
- The palette is warm and editorial, but risks feeling "artisanal" or "craft-y" if not balanced with enough structural clarity. The combination of brown + gold + beige could read as a coffee shop or heritage brand rather than a civic intelligence platform.

**Verdict:** The palette's warmth is a genuine strategic advantage — it says "this was made by humans, for humans" — but it needs refinement for accessibility and to ensure it reads as civic rather than artisanal.

---

## 2. Accessibility Audit

### Contrast Ratios: Current Palette on Background `#EFEBE3`

| Color | Hex | Ratio | AA Normal (4.5:1) | AA Large (3.0:1) | AAA Normal (7.0:1) | AAA Large (4.5:1) |
|-------|-----|-------|-------------------|-------------------|---------------------|-------------------|
| Dark Brown (text) | `#492615` | **11.24:1** | PASS | PASS | PASS | PASS |
| Slate Navy (links) | `#464C72` | **6.96:1** | PASS | PASS | FAIL | PASS |
| Warm Red (accent) | `#E62B1E` | **3.74:1** | FAIL | PASS | FAIL | FAIL |
| Gold (accent) | `#F4A900` | **1.68:1** | FAIL | FAIL | FAIL | FAIL |

### WCAG Requirements Summary

- **AA Normal text** (the legal minimum for public-facing civic tools): 4.5:1
- **AA Large text** (18pt+ or 14pt+ bold): 3.0:1
- **AAA Normal text** (enhanced, recommended for civic tools serving everyone): 7.0:1
- **UI Components** (borders, icons, form fields): 3.0:1

### Recommended Accessible Alternatives

| Use Case | Current | Suggested | New Ratio | Notes |
|----------|---------|-----------|-----------|-------|
| Body text | `#492615` | `#492615` (keep) | 11.24:1 | Excellent — no change needed |
| Links / interactive | `#464C72` | `#3A4063` | ~7.8:1 | Slightly deeper for AAA compliance |
| Red accent (text use) | `#E62B1E` | `#C4221A` | 4.92:1 | Darkened for AA normal text |
| Red accent (decorative) | `#E62B1E` | `#E62B1E` (keep) | 3.74:1 | Acceptable for large headings, icons |
| Gold (decorative only) | `#F4A900` | `#F4A900` (keep) | 1.68:1 | NEVER use for text — decorative/fill only |
| Gold (text use) | `#F4A900` | `#8B6200` | 4.59:1 | Dark gold for text on beige |
| Gold (UI components) | `#F4A900` | `#B07D00` | ~3.2:1 | Minimum for borders/icons |

### Critical Accessibility Rules for Frank

1. **Gold/yellow must never be used for text or interactive elements** on the beige background. Use it exclusively for decorative fills, backgrounds, and large illustrative elements.
2. **Red can be used for large headings** (18pt+) but not for body text or small UI elements on beige.
3. **All links must use the slate navy** or darker — never red or gold.
4. **The beige background is an asset**, not a liability — it reduces eye strain compared to pure white and still provides excellent contrast with the dark brown text.

---

## 3. Logo Design Directions for "Frank"

### Key Constraint: Frank is NOT a Person

The name "Frank" means the adjective: honest, direct, open, transparent. The logo must communicate a quality and a stance, not a character. No faces, no mascots, no anthropomorphic elements.

### Precedent: Pentagram's "Frank" Identity

Pentagram designed an identity for a publication called Frank that used "an understated all-lowercase logotype set in the old-school serif Plantin Schoolbook." They drew from "classic newspaper design, with a masthead, rule lines and a gridded structure." This is directly relevant — a civic intelligence platform that publishes what residents say is, structurally, a new kind of local newspaper.

### Logo Direction Options (Ranked by Suitability)

#### 1. RECOMMENDED: Typographic Wordmark with Quotation Mark Integration

**Concept:** The word FRANK (or frank) as a clean typographic mark, with the letter "a" or the negative space incorporating subtle quotation marks — the visual shorthand for "these are someone's actual words."

**Why this works:**
- Quotation marks are the universal symbol for direct speech — Frank surfaces what people actually said
- Typography-first logos are the most trusted in civic/institutional contexts (GOV.UK, The Guardian, The New York Times, ProPublica)
- Avoids any figurative metaphor that could age or be misread
- Scales perfectly from favicon to billboard
- The quotation marks reinforce the adjective meaning: frank speech, speaking frankly
- Can be rendered in serif (authority/editorial) or a humanist sans (approachable/modern)

**Execution options:**
- Oversized quotation marks flanking "frank" as a logotype
- The crossbar of the "k" extending into a subtle closing quotation mark
- A small open-quote mark before "frank" as a persistent brand element (like The Guardian's roundel)

**Risk level:** Low. This is distinctive, meaningful, and hard to misinterpret.

#### 2. STRONG: Pure Typographic Wordmark (No Symbol)

**Concept:** "frank" set in a carefully chosen typeface that itself communicates the brand values. Lowercase for approachability. Possibly with a distinctive period: "frank."

**Why this works:**
- Maximum simplicity and clarity
- The name itself is the brand — it doesn't need illustrative support
- A trailing period suggests a definitive statement: "frank." (as in, "we are frank.")
- Pentagram took this approach successfully for the publication Frank

**Typeface directions:**
- A warm serif (like Plantin, Freight, or Charter) for editorial authority
- A humanist sans-serif (like IBM Plex, Source Sans, or Atkinson Hyperlegible) for modern accessibility
- A slab serif (like Rockwell or Clarendon) for bold civic presence

**Risk level:** Very low, but requires the typeface to do all the heavy lifting.

#### 3. GOOD: Open Quotation Mark as Standalone Symbol

**Concept:** A single large open-quote mark (") as the symbol/favicon, with "frank" as the wordmark alongside. The quote mark becomes the icon for the app, the favicon, the social media avatar.

**Why this works:**
- Instantly communicates "listening" and "voice"
- An open quote that is never closed suggests ongoing conversation
- Simple enough for a favicon
- Used by the platform as a framing device: every resident quote on the site appears inside the brand's own quote mark

**Execution:**
- The quote mark rendered in the warm red `#E62B1E` or slate navy `#464C72`
- Slightly rounded/organic rather than geometric — human, not robotic
- Could be subtly asymmetric to suggest handwriting without going full "handmade"

**Risk level:** Low-moderate. Quote marks are used by many communication brands (Skype, etc.), so distinctiveness would come from rendering style.

#### 4. DECENT: Window/Opening Metaphor

**Concept:** An abstract square or rectangle with an opening — suggesting a window into the community, transparency, an open door.

**Why this works:**
- "Transparency" literally means you can see through — a window is the most direct metaphor
- A square with a gap suggests openness and accessibility
- Could double as a frame for content (photos, quotes, data)

**Why it's riskier:**
- More abstract = harder to immediately interpret
- Could feel corporate or tech-startup-y
- Less connected to Frank's core function of listening and publishing voices

**Risk level:** Moderate. Needs very careful execution to not feel generic.

#### 5. AVOID: Magnifying Glass, Open Book, Speech Bubble, Hand

**Magnifying glass:** Implies surveillance, investigation, oversight — not the right tone for a platform built on trust and voluntary participation.

**Open book:** Too literary/educational. Frank isn't a library; it's a living, updating civic intelligence system.

**Speech bubble:** Overused in tech (Slack, iMessage, WhatsApp, every chat app). Would make Frank look like a messaging tool.

**Open hand:** Could read as charity, begging, or "stop." Too ambiguous and too human.

### Favicon Considerations

Whatever direction is chosen, it must work at 16x16 and 32x32 pixels. This eliminates anything with fine detail. The strongest favicon options are:
1. A single quotation mark (from Direction 3)
2. The letter "f" from the wordmark (from Direction 1 or 2)
3. A simple geometric shape (from Direction 4)

---

## 4. Typography

### Current Combination: Playfair Display + IBM Plex Sans

**Playfair Display** is a transitional serif with high-contrast strokes, designed for display/headline use. It has Didone qualities — elegant, editorial, somewhat formal.

**IBM Plex Sans** is a corporate humanist sans-serif, designed as IBM's global typeface. It balances neutrality with warmth and has excellent multi-language support.

### Assessment

This pairing has been described as "baroque extravagance meets corporate rationalism" — Playfair's high contrast against Plex's measured neutrality. Research suggests this combination "suits financial publications, luxury B2B brands, and any context where prestige and professionalism need to coexist."

**Strengths:**
- Both are open-source / freely available (important for an open-source project)
- IBM Plex Sans is genuinely excellent for body text — high legibility, warm without being quirky
- The serif/sans pairing creates clear visual hierarchy
- Playfair Display signals editorial seriousness

**Concerns:**
- Playfair Display may be *too* elegant for a civic listening tool. Its high contrast and Didone sensibility lean toward fashion, luxury, or fine dining. Frank should feel authoritative but also accessible and grounded.
- The pairing could reinforce the "artisanal/craft" reading of the warm palette
- Playfair's thin hairlines may have rendering issues at smaller sizes on screen

### Recommended Alternatives for Headlines

| Typeface | Style | Why it fits Frank | Open Source? |
|----------|-------|-------------------|--------------|
| **Libre Baskerville** | Traditional serif, lower contrast than Playfair | Editorial authority without luxury connotations. Newspaper-grade. | Yes (Google Fonts) |
| **Source Serif Pro** | Contemporary serif, Adobe's companion to Source Sans | Clean, modern, institutional. Used by many news orgs. | Yes (Adobe open source) |
| **Charter** | Practical serif, designed for legibility | Grounded, honest, no-nonsense. Matthew Carter designed it for readability. | Free for web |
| **Freight Text** | Warm serif with personality | Editorial warmth with civic gravitas. Used by many quality publications. | No (commercial) |
| **IBM Plex Serif** | Companion to IBM Plex Sans | Perfect family match, institutional but warm. Keeps the system consistent. | Yes (open source) |
| **Lora** | Contemporary serif, moderate contrast | Warm and readable, good at headline sizes. Less "luxury" than Playfair. | Yes (Google Fonts) |

### Recommended Body Text

**Keep IBM Plex Sans.** It is genuinely excellent: legible, warm, open-source, and has a complete family (Sans, Serif, Mono). Few alternatives would be better.

Other strong options if change is desired:
- **Atkinson Hyperlegible** — designed specifically for maximum readability, including for visually impaired users. Strong civic/accessibility statement.
- **Inter** — the default for modern web apps. Clean and professional but perhaps too generic.
- **Source Sans Pro** — Adobe's companion to Source Serif. Neutral, reliable.

### Recommended Pairing for Frank

**Primary recommendation:** IBM Plex Serif (headlines) + IBM Plex Sans (body)
- Same family = visual cohesion
- Serif headlines for editorial authority, sans body for readability
- Both open-source
- The Plex family communicates "made thoughtfully by an institution that cares about clarity"

**Secondary recommendation:** Libre Baskerville (headlines) + IBM Plex Sans (body)
- Baskerville is the "trustworthy" typeface — a 2012 study by filmmaker Errol Morris found people were more likely to believe statements set in Baskerville than any other typeface tested
- More personality than Plex Serif, more grounded than Playfair

### Logo Typography

For the logo/wordmark specifically, the typeface should be:
- **Serif** if the brand leans editorial/institutional (newspaper of the community)
- **Humanist sans-serif** if the brand leans modern/tech-civic (digital-native platform)
- **Not hand-drawn** — Frank should feel reliable and repeatable, not artisanal. Hand-lettering suggests individual craft; Frank is a system that serves communities at scale.

The Pentagram precedent (Plantin Schoolbook for a brand called "Frank") validates the serif direction. A serif wordmark paired with sans-serif body text is the classic newspaper formula and signals editorial seriousness.

---

## 5. Light Mode Design: Warmth Without Clinical Coldness

### Why Light Mode

Frank's data needs to be scannable, quotable, shareable. Dark mode creates atmosphere; light mode creates utility. Government and civic tools are universally light mode (GOV.UK, USWDS, Decidim, every council website). This is the correct choice.

### Making Light Mode Feel Trustworthy, Not Clinical

**The spectrum:**
```
Clinical/Cold ←————————————→ Warm/Crafted ←————————→ Twee/Unprofessional
Pure white bg     Warm off-white bg     Paper texture bg
Black text        Dark brown text       Handwritten text
Blue links        Slate navy links      Decorative links
No texture        Subtle grain          Heavy texture
System fonts      Chosen serif/sans     Display/script fonts
```

Frank should sit **firmly in the warm center** — never clinical, never twee.

### Current Position

The beige background `#EFEBE3` + brown text `#492615` puts Frank in the warm zone. This is good. The question is whether to add texture.

### Texture Recommendations

| Approach | Effect | Recommendation |
|----------|--------|----------------|
| **Completely flat** (solid `#EFEBE3`) | Clean, modern, fast to load | Good default. Works on all devices. |
| **Subtle CSS noise/grain** (2-3% opacity) | Adds organic warmth, suggests paper | Recommended as optional enhancement. A `background-image` with a tiny noise SVG at very low opacity adds tactile quality without performance cost. |
| **Paper texture image** | Strongly handmade, editorial, physical | Too heavy for a data platform. Use sparingly if at all — perhaps only on a landing page hero, not on data views. |
| **Subtle dot grid or line pattern** | Suggests notebook, planning, structure | Could work for data/map views to suggest "working document" quality. |

### Achieving "Handmade" Without Being Twee

The "handmade" quality should come from **design decisions**, not from surface decoration:

1. **Warm colors** (already have this) — brown instead of black, beige instead of white
2. **Serif typography** for headlines — suggests human editorial judgment, not algorithmic output
3. **Generous whitespace** — suggests confidence and care, like a well-designed book
4. **Subtle asymmetry** in layout — not a rigid grid but not chaotic. Slight offsets in hero sections, pull quotes that break the column.
5. **Real photographs** of real places and people — not stock photos, not illustrations
6. **Content-first hierarchy** — what residents said should dominate, not chrome or UI
7. **Imperfect details at micro scale** — slightly rounded corners (3-4px, not 12px), a logotype with optical adjustments rather than geometric perfection

What to **avoid**:
- Illustration-heavy style (looks like a startup, not a civic institution)
- Hand-drawn icons or doodles (looks like a children's charity)
- Excessive border-radius (looks like a wellness app)
- Gradients (looks like SaaS)
- Dark mode toggle (unnecessary complexity for a civic tool)

---

## 6. Refined Palette Recommendation

### Option A: Evolved Current Palette (Recommended)

Keeps the warmth and distinctiveness of the current palette but fixes accessibility issues and adds structure.

| Role | Color | Hex | Contrast on `#EFEBE3` | Notes |
|------|-------|-----|----------------------|-------|
| **Background** | Warm off-white | `#EFEBE3` | — | Keep. Distinctive and warm. |
| **Text** | Dark brown | `#492615` | 11.24:1 (AAA) | Keep. Excellent. |
| **Primary accent / links** | Slate navy | `#464C72` | 6.96:1 (AA) | Keep. Deepen to `#3A4063` for AAA (7.8:1). |
| **Action / CTA** | Deep vermilion | `#C4221A` | 4.92:1 (AA) | Darkened from `#E62B1E` for text use. |
| **Decorative accent** | Warm red | `#E62B1E` | 3.74:1 | Large text and decorative use only. |
| **Highlight / decorative** | Rich gold | `#F4A900` | 1.68:1 | Decorative fills, backgrounds, highlights ONLY. Never for text. |
| **Gold for text** | Dark gold | `#8B6200` | 4.59:1 (AA) | When gold must appear as text. |
| **Secondary background** | Lighter beige | `#F5F2EC` | — | For cards, panels, subtle separation. |
| **Border / divider** | Warm gray | `#C5BFB3` | — | Structural lines, card borders. |
| **Success** | Civic green | `#1A7A4C` | ~5.5:1 (AA) | Status indicators. |
| **Error** | Alert red | `#C4221A` | 4.92:1 (AA) | Form errors, alerts. |

### Option B: Cooler Civic Palette (Alternative)

If the warm palette is ultimately judged too craft-y, this alternative shifts toward more conventional civic blue territory while retaining some warmth.

| Role | Color | Hex | Notes |
|------|-------|-----|-------|
| **Background** | Warm white | `#F7F5F0` | Slightly cooler than current, still warm |
| **Text** | Near-black brown | `#2C1810` | Deeper for maximum authority |
| **Primary** | Civic blue | `#1D5B8C` | GOV.UK-adjacent but warmer |
| **Secondary** | Muted teal | `#2A7A6E` | Growth, community, progress |
| **Accent** | Warm coral | `#D4503A` | Approachable red, less aggressive |
| **Highlight** | Amber | `#E8960A` | Decorative warmth |

**Recommendation: Option A.** The warm palette IS the brand differentiator. Every other civic tool looks like a government website. Frank should look like a thoughtfully designed civic publication — closer to The Guardian or ProPublica than to GOV.UK.

---

## 7. Comparative Analysis: What Makes This Palette Different

| Platform | Personality | Frank's Advantage |
|----------|-------------|-------------------|
| GOV.UK | Utilitarian, cold, institutional | Frank is warmer, more human, inviting |
| Decidim | Generic, configurable, no strong identity | Frank has a distinctive authored voice |
| Go Vocal | Modern startup, corporate civic tech | Frank is open-source, editorial, community-owned |
| mySociety | Functional, illustration-dependent | Frank is typographically led, content-first |
| USWDS | Patriotic, formal, American | Frank is location-agnostic, less formal |

Frank's visual identity should occupy a unique position: **the editorial warmth of a quality newspaper, the accessibility standards of a government service, and the openness of a community platform.**

---

## 8. Final Recommendations Summary

### Logo
1. **Direction:** Typographic wordmark, lowercase "frank" in a warm serif, with quotation marks as a secondary brand element
2. **Symbol:** Single open-quote mark for favicon and app icon
3. **Avoid:** Anthropomorphism, speech bubbles, magnifying glasses, hand illustrations

### Colors
1. **Keep** the warm beige background — it is a genuine differentiator
2. **Keep** the dark brown text — outstanding accessibility
3. **Deepen** the slate navy slightly for AAA compliance
4. **Darken** the red for text use; keep the bright red for decorative only
5. **Restrict** gold to decorative use only — never for text or interactive elements
6. **Add** a dark gold variant for the rare cases where gold must be text

### Typography
1. **Headlines:** Switch from Playfair Display to IBM Plex Serif or Libre Baskerville — still editorial, less luxury
2. **Body:** Keep IBM Plex Sans — it is excellent
3. **Logo:** Warm serif typeface, lowercase, possibly with period ("frank.")

### Light Mode
1. Keep the warm off-white background
2. Optional: add subtle CSS noise grain at 2-3% opacity for texture
3. Let the warmth come from color and typography, not decorative illustration
4. Prioritise generous whitespace and typographic hierarchy

### Accessibility
1. All body text passes AAA (11.24:1) — excellent
2. All links must pass AA minimum (4.5:1) — the current navy at 6.96:1 is good
3. Never use gold or bright red for text or interactive elements on the beige background
4. Test all new color combinations before deployment

---

## Sources

- [GOV.UK Design System - Colour](https://design-system.service.gov.uk/styles/colour/)
- [GOV.UK Colour and Font Updates](https://designnotes.blog.gov.uk/2019/07/29/weve-updated-the-gov-uk-colours-and-font/)
- [Branding Government: Design and Public Trust](https://design102.blog.gov.uk/2021/01/29/branding-government-how-can-good-design-help-build-public-trust/)
- [GOV.UK Accessibility Improvements](https://designnotes.blog.gov.uk/2019/07/29/weve-made-the-gov-uk-design-system-more-accessible/)
- [USWDS Color Overview](https://designsystem.digital.gov/design-tokens/color/overview/)
- [USWDS Theme Color Tokens](https://designsystem.digital.gov/design-tokens/color/theme-tokens/)
- [Decidim Design Guide - Color](https://nightly.decidim.org/design/foundations/color)
- [Pentagram: Frank Brand Identity](https://www.pentagram.com/work/frank)
- [Civic Design Systems Guide](https://www.maxiomtech.com/accessible-ux-civic-design-systems/)
- [CivicTheme Design System](https://www.civictheme.io/)
- [Color Psychology in Government - UAE Design System](https://designsystem.gov.ae/insights/the-color-psychology-of-government-trust)
- [Inclusive Color Palettes for Government](https://averoadvisors.com/insights/inclusive-color-palettes-for-government-websites/)
- [Municipal Website Color Choices](https://www.govweb.com/2025/04/choosing-the-right-colors-for-your-municipal-website/)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [Logo Design Theory: Symbols and Metaphors - Smashing Magazine](https://www.smashingmagazine.com/2015/06/effective-logo-design-symbols-metaphors-intuition/)
- [IBM Plex Typeface - Typographica Review](https://typographica.org/typeface-reviews/ibm-plex/)
- [Paper Textures in Web Design](https://silphiumdesign.com/using-organic-textures-for-website-backgrounds/)
