# About Page Design: Show, Don't Tell

> Research into best-in-class civic tech and data platform landing pages, with concrete implementation recommendations for Frank's about page. Designed to be buildable in a few hours.

---

## 1. What the Best Civic/Data Platforms Do

### The Pattern That Works: Input Box First, Explanation Never

The single most effective pattern across civic tech is **WriteToThem / TheyWorkForYou**: put a postcode/address box front and center with zero explanation. The product IS the input box. When someone types and sees results, they understand instantly what would take 500 words to describe.

Frank's homepage already does this well. The about page should do it too.

### Reference Analysis

**Our World in Data** — the gold standard for data platforms:
- Embeds actual charts directly on the homepage (six major visualizations)
- Leads with counters: "13,909 Charts / 126 Topic Pages / 32 Data Explorers"
- Every chart has an "Explore the data" button next to it
- The page IS the product — not a description of the product

**USAFacts** — making numbers tangible:
- Rotating "Fast Facts" carousel with specific numbers ("$112,700 per person in total US debt")
- Each fact has a "See the data" CTA that goes deeper
- Real data on the homepage, not screenshots of real data

**Democracy Club** — proving impact with numbers:
- "14m people used our services in the 2024 general election"
- "100% of councils across the UK work with us"
- Partner logos (Electoral Commission, BBC, Parliament) — institutions that rely on their data

**Gapminder** — engagement through interaction:
- Opens with a quiz ("Worldview Upgrader") — you discover your own ignorance
- The visitor does something before reading anything
- 20+ organization logos as social proof

**mySociety** — action-oriented cards:
- Each tool presented as what you DO, not what it IS
- "Request information from public bodies" not "A freedom of information platform"
- Illustrations for each tool, not screenshots

**TheyWorkForYou** — live data as proof:
- Shows today's actual parliamentary debates on the landing page
- Search bar prominent at top
- "Get an email every time an issue you care about is mentioned" — converts visitors into users

**Represent (Open North, Canada)** — API/data credibility:
- Quantified database: "Over 7,000 mayors and councillors / 8,000+ municipal wards"
- Client logos of 25+ organizations using the API
- User testimonials with specific outcomes ("resulted in the passage of the most definitive resolution")

**Go Vocal (formerly CitizenLab)** — SaaS conversion patterns:
- Problem-solution illustrations (not abstract, specific pain points)
- "600+ governments" as a trust counter
- Client quotes with measurable outcomes ("reduced project setup time by two-thirds")
- Multiple conversion paths: demo, tour, newsletter

### What Makes You Immediately Understand a Product

Ranked by effectiveness:

1. **An input box you can type into right now** (WriteToThem, TheyWorkForYou, Frank's homepage)
2. **Real data from the product embedded in the page** (OWID, USAFacts)
3. **Specific numbers that feel tangible** (Democracy Club's "14m people", OWID's "13,909 charts")
4. **Showing the output, not describing the process** (Beckton case study)
5. **Partner/user logos** (Gapminder, Democracy Club, Represent)

What does NOT work:
- Paragraphs explaining what the tool does (Frank's current about page)
- Abstract mission statements without grounding
- Feature lists without context
- Screenshots that are too small to read

---

## 2. What Frank's Current About Page Gets Wrong

The current about page at `/about` is ~167 lines of text. It reads like a grant application, not a product page. Specific problems:

1. **Wall of text.** Five dense paragraphs before any visual break. A visitor scanning for 5 seconds sees gray text, not a product.
2. **Describes the process instead of showing the output.** "Frank pulls real data from official sources" — why not show the real data?
3. **No embedded demo.** The CTA to "Try Frank" is at the very bottom. The search box should be near the top.
4. **Data sources are a text list.** 16 items in a monospace grid. Should be recognizable logos/badges.
5. **No visual proof.** No map, no chart, no screenshot of a real briefing. A visitor cannot see what Frank produces without leaving the page.
6. **The Beckton case study is invisible.** Frank has a real, complete example with real interviews, real data, real policy proposals. It is not shown on the about page at all.
7. **No counters/stats above the fold.** The numbers (190+ countries, 663K politicians, 16 sources) exist on the homepage but not on the about page.

---

## 3. Recommended About Page Structure

The new about page should be a single scrollable page with these sections in order. Total build time estimate: 4-6 hours.

### Section 1: Hero with Embedded Search (above the fold)

**What it looks like:**
- Frank logo + one-line tagline: "Civic intelligence for any place on earth."
- Immediately below: the same search input from the homepage. Label: "Type any address, city, or postcode"
- Below the search box: three stat counters in a row — `190+ countries` / `663K+ politicians` / `16 official sources`
- Below counters: a single line — "Free. Open source. Works worldwide."

**Why:** WriteToThem and TheyWorkForYou prove that the input box IS the explanation. If someone types "Beckton" and sees representatives, deprivation data, and air quality appear, they understand Frank in 10 seconds. No paragraph can compete with that.

**Implementation:** Extract the search component from `page.tsx` into a shared `<FrankSearch />` component. Reuse it on both pages.

```
+----------------------------------------------+
|              "frank                           |
|  Civic intelligence for any place on earth.   |
|                                               |
|  [Enter any area, city, or postcode] [Research]|
|  Try: Beckton, San Francisco, Berlin          |
|                                               |
|     190+        663K+         16              |
|   countries   politicians  data sources       |
|                                               |
|  Free. Open source. Works worldwide.          |
+----------------------------------------------+
```

---

### Section 2: The Beckton Case Study (show the output)

**What it looks like:**
A bordered card or light-gray panel showing a condensed version of the Beckton briefing page. Not a screenshot — actual rendered content, abbreviated. Three columns or stacked cards:

**Card A — "What the data shows"**
- 2-3 real data points from the Beckton briefing: IMD rank, air quality score, population
- Each with the source name and a link
- Caption: "Real data, from official sources, cited."

**Card B — "What residents said"**
- 2-3 real anonymized quotes from the Beckton interviews
- The issue they map to and its severity score
- Caption: "8 interviews. 47 issues identified. Ranked by severity."

**Card C — "What could change"**
- One real policy proposal from the Beckton analysis (e.g., the GP access proposal)
- Cost estimate, responsible body, evidence source
- Caption: "Evidence-based proposals linked to what local government can actually do."

Below the three cards: a button — `See the full Beckton briefing` linking to `/beckton`

**Why:** This is the "Our World in Data" pattern — embed real output from the product directly in the page. The visitor sees Frank's actual output before reading a single sentence about how it works. OWID puts six charts on their homepage. Frank should put one real case study on the about page.

**Implementation:** Import a few constants from `becktonData.ts`. Render three compact cards. No new API calls needed — it is static data already in the codebase.

```
+----------------------------------------------+
|  BECKTON, LONDON E6 — A real example          |
|                                               |
|  +------------+ +------------+ +------------+ |
|  | IMD: top   | | "The GP   | | Proposal:  | |
|  | 10% most   | | wait is   | | Extend GP  | |
|  | deprived   | | 3 weeks.  | | hours with | |
|  | Source: ONS| | I go to   | | NHS England| |
|  |            | | A&E."     | | funding    | |
|  | AQI: 62    | |           | | Cost: £2.1M| |
|  | (Moderate) | | Severity: | | Evidence:  | |
|  | Source:    | | 9.2/10    | | What Works | |
|  | Google AQI | |           | |            | |
|  +------------+ +------------+ +------------+ |
|                                               |
|        [ See the full Beckton briefing ]       |
+----------------------------------------------+
```

---

### Section 3: How It Works (visual pipeline, not text)

**What it looks like:**
A horizontal (desktop) or vertical (mobile) pipeline diagram with 5 nodes. Each node is an icon + 2-word label + one sentence. NOT the current numbered list with paragraphs.

```
[Search] -----> [Prepare] -----> [Listen] -----> [Analyse] -----> [Act]
 any area      interview guide   record locally   AI synthesis   policy proposals
```

Each node, when hovered/tapped, shows a single short sentence. Keep it to one line each:

1. **Search** — "Official data from 16 sources, cited with links."
2. **Prepare** — "AI interview guide adapted to the area's known issues."
3. **Listen** — "Record on your phone. Transcription stays on-device."
4. **Analyse** — "Issues ranked by severity, frequency, and fixability."
5. **Act** — "Policy proposals with costs, evidence, and who to contact."

**Why:** mySociety's action-oriented cards and Gapminder's step-by-step methodology walkthrough both prove that a visual pipeline beats paragraphs. The current about page has five detailed paragraphs for this. It should be five icons connected by a line.

**Implementation:** A flex/grid row of five small components. Use CSS borders or SVG for the connecting line. Each node is a div with an emoji or simple SVG icon, a bold label, and one sentence. No images needed — use Unicode or inline SVG.

---

### Section 4: Data Source Badges

**What it looks like:**
A grid of recognizable logos/badges, not a text list. Two rows:

Row 1 (UK deep data): Parliament UK, ONS, GOV.UK (IMD), LG Inform
Row 2 (Global): US Census, Google Civic, Wikidata, World Bank, Eurostat, OpenStreetMap

Each badge is a small grayscale logo (~40px tall) with the source name below it. Hover state adds color.

Below the grid: "Every number on Frank links to its original source. If something is wrong, you can verify it immediately."

**Why:** Represent API and Democracy Club both use partner/source logos to establish credibility at a glance. A grid of recognized institutional logos communicates more trust in 1 second than 200 words of description. USAFacts does this with "70+ Sources" and media logos.

**Implementation:** Collect SVG or small PNG logos for each source. Put them in `/public/logos/`. Render as a CSS grid. If logo collection takes too long, use a styled text-badge approach (rounded gray boxes with the source name in monospace) as a fast v1 — still better than the current plain text list.

```
+----------------------------------------------+
|  Built on official, open data                 |
|                                               |
|  [Parliament UK] [ONS] [GOV.UK] [LG Inform]  |
|  [US Census] [Wikidata] [World Bank] [Google] |
|  [Eurostat] [OpenStreetMap] [Brave Search]    |
|                                               |
|  Every number links to its original source.   |
+----------------------------------------------+
```

---

### Section 5: Coverage Map

**What it looks like:**
A simple world map (use the existing `AreaMap` component or a lightweight SVG world map) with three tiers of shading:

- **Dark/highlighted**: UK, US, Canada — "Deep data: representatives, deprivation, census, air quality"
- **Medium**: EU countries — "Eurostat + Wikidata coverage"
- **Light**: All other countries — "Wikidata + World Bank baseline"

Below the map: "Frank works for any address on earth. Coverage depth varies by country."

**Why:** Our World in Data uses maps as primary navigation. A coverage map communicates "190+ countries" more powerfully than the number alone. It answers the immediate question: "Does this work where I live?"

**Implementation:** Two options ranked by speed:
1. **Fast (1 hour):** Static SVG world map with three CSS classes for the three tiers. No interactivity. Use a public-domain SVG map and color the paths.
2. **Better (2 hours):** Use the existing Leaflet-based `AreaMap` component with a zoomed-out world view and colored overlays for the three tiers. Clicking a country goes to a search for its capital.

Recommend option 1 for initial launch, upgrade to option 2 later.

---

### Section 6: Open Source + Methodology (brief)

**What it looks like:**
Two columns side by side:

Left column:
- "Open source under AGPL v3"
- GitHub link with icon
- "Every AI prompt is version-controlled and auditable."

Right column:
- "Methodology: CC BY-SA 4.0"
- "Grounded in Freire's dialogical approach"
- "Published interview methodology"

**Why:** Keep this short. The current page spends too many words on this. A two-column layout with key facts is enough. The people who care about AGPL will click the GitHub link; the people who care about methodology will read the published methodology. Do not explain either at length on the about page.

**Implementation:** A two-column CSS grid. Four lines of text each side. Two links.

---

### Section 7: Team (keep it, compress it)

**What it looks like:**
Keep the current team section but cut each bio to 2 sentences max. The current bios are 60+ words each. Target: 25 words each.

- Arthur: "Built Frank. AI Lead at Carlo Ratti Associati. Published researcher in agent-based conversation analysis (AHFE 2024). UCL Bartlett graduate."
- Mikhail: "Leads Frank's policy methodology. Former contributor to UN Office of Counter-Terrorism programmes. UCL Politics and International Relations."

**Why:** ProPublica and Democracy Club mention team size and credentials briefly. Nobody reads 60-word bios on an about page. The bios should establish credibility in one glance.

---

### Section 8: CTA — Search Again (bottom of page)

**What it looks like:**
The same search box from Section 1, repeated at the bottom. Label: "See what Frank knows about your area."

Below it: three suggestion buttons — `Beckton` / `San Francisco` / `Berlin` — that auto-fill and search.

**Why:** Every landing page optimization study shows that repeating the primary CTA at the bottom of the page captures visitors who scrolled all the way down. TheyWorkForYou does this. USAFacts does this. The about page currently has a "Try Frank" button at the bottom, but it navigates to a different page. The search box should be HERE, not elsewhere.

---

## 4. What Converts "Interesting" to "I Want to Use This"

From the reference analysis, the conversion triggers are:

### Trigger 1: Instant Gratification
The visitor types their own address and sees real data about their own area within seconds. This is more persuasive than any copy. WriteToThem, TheyWorkForYou, and Frank's homepage already use this pattern. The about page must also use it.

### Trigger 2: The "I Didn't Know That" Moment
Gapminder's quiz creates surprise. Frank's equivalent: showing a visitor their area's deprivation rank, air quality, or a representative they did not know existed. The Beckton case study should highlight a surprising finding ("Beckton is in the top 10% most deprived areas in England") to create this moment.

### Trigger 3: Specificity Over Abstraction
"663K+ politicians in our database" is better than "comprehensive political data." "$2.1M estimated cost" for a GP proposal is better than "costed policy proposals." USAFacts and Democracy Club both lead with specific numbers, not adjectives.

### Trigger 4: Social Proof from Recognized Institutions
Democracy Club shows the BBC and Electoral Commission rely on their data. Represent shows 25+ NGO logos. Frank does not yet have institutional users, but it can show the institutional data sources it builds on (Parliament UK, ONS, World Bank). Source logos serve as proxy social proof.

### Trigger 5: Low Friction, No Account Required
"Free. No account needed. Type any address." WriteToThem and TheyWorkForYou succeed because they ask for nothing before delivering value. Frank already does this. The about page should make it explicit: no signup, no login, no payment.

### CTAs That Work for Civic Tools
- **Primary:** The search box itself (not a button that says "Try it" — the actual input field)
- **Secondary:** "See the full Beckton briefing" (proof before commitment)
- **Tertiary:** "Get notified when Frank adds [your country]" (email capture for areas with less data)
- **Avoid:** "Sign up", "Request a demo", "Learn more" — these are SaaS patterns that feel wrong for an open civic tool

---

## 5. Implementation Priority

If you have 4 hours, build in this order:

| Priority | Section | Time | Impact |
|---|---|---|---|
| 1 | Hero with embedded search box | 30 min | Highest — makes the page functional, not just informational |
| 2 | Beckton case study cards | 60 min | Shows the product's actual output |
| 3 | Visual pipeline (5 steps) | 45 min | Replaces 5 paragraphs of text |
| 4 | Stat counters (190+ / 663K / 16) | 15 min | Already exist on homepage, copy them |
| 5 | Data source badges | 45 min | Replaces text list with visual credibility |
| 6 | Team bios (compress) | 15 min | Quick edit to existing content |
| 7 | Bottom CTA search box | 15 min | Reuses the shared search component |
| 8 | Coverage map | 60 min | Nice to have, do last or skip for v1 |

### What to Delete from the Current Page

- The five-paragraph "What it is" section (replaced by the pipeline and case study)
- The "Why Frank exists" section (move the best line to a pull quote, cut the rest)
- The detailed numbered "What Frank does" list (replaced by the 5-step pipeline)
- The monospace text list of data sources (replaced by logo badges)
- The 60-word team bios (compressed to 25 words each)

### What to Keep

- The "Open source" section (compressed to two columns)
- The team section (with shorter bios)
- The GitHub link
- The contact email

### One Line to Keep from "Why Frank Exists"

> "Frank doesn't ask people to participate more. It goes to where they already are and makes what they're already saying visible to the people with power to act."

This is the single best sentence on the current page. Make it a pull quote, styled large, between the case study and the pipeline. It is the equivalent of ProPublica's mission statement — a declaration that sticks.

---

## 6. Design Notes (Consistent with Visual Identity v2)

Per research doc 16, Frank follows "Model 1: The Evidence" — near-zero decoration, black/white/red accent, content IS the brand.

- Background: #FFFFFF
- Text: #1A1A1A (primary), #404040 (secondary), #6B6B6B (tertiary)
- Accent: #C41E1E (the Frank red, used sparingly)
- Monospace for data values and source names
- No illustrations, no stock photos, no gradients
- The Beckton case study cards should use a light gray background (#F8F8F8) to visually separate them from the page
- The pipeline steps should use the red accent for the connecting line
- The coverage map should use three shades of a single color (not the red — use a neutral blue-gray: #1A1A1A at 100%/40%/15% opacity)
