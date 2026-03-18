# SEO Strategy for Frank (frank.community)

Research date: 2026-03-18

---

## Part 1: How Google Ranking Actually Works

### The Five Things That Determine Your Position

**1. Content quality and relevance (most important, ~25% of the algorithm)**

Google uses E-E-A-T: Experience, Expertise, Authoritativeness, Trustworthiness. In practice this means:
- Does the page answer the question the person searched for?
- Is the content original (not scraped/rewritten from elsewhere)?
- Does the author/site have demonstrated knowledge of the topic?
- Is the information accurate and up-to-date?

Frank's advantage: Real interview data, real deprivation statistics, real councillor information. This is original, experience-based content that nobody else has.

**2. Backlinks (~13% and declining)**

A backlink is when another website links to yours. Google treats each link as a "vote of confidence." Links from trusted, relevant sites (The Guardian, GOV.UK, university sites) count far more than links from random blogs.

Why backlinks matter less than they used to: Google's algorithm has gotten better at judging content quality directly. Backlinks dropped from ~30% to ~13% of the ranking algorithm as of Q1 2025.

**3. Technical SEO (~15%)**

- Page loads fast (under 2.5 seconds for Largest Contentful Paint)
- Works on mobile
- Has proper meta tags, headings, structured data
- Is crawlable (sitemap, no broken links, proper robots.txt)
- HTTPS (already done via Cloudflare)

**4. User experience signals (~10%)**

- Do people click your result in search? (click-through rate)
- Do they stay on the page or bounce back immediately?
- Can they navigate the site easily?

**5. Freshness (~6%)**

Pages updated at least once per year gain an average of 4.6 positions vs stale pages. This is where Frank's auto-generated content strategy is powerful: data refreshes = fresh content.

### Search Intent Types

Every search has an intent. Google matches pages to intent:

| Intent | Example | What Ranks |
|--------|---------|-----------|
| Informational | "what is the deprivation index" | Explainer articles, guides |
| Navigational | "newham council website" | The actual council site |
| Transactional | "hire community organiser" | Service pages |
| Local | "council meeting near me" | Local listings, maps |

Frank should target **informational** and **local** intent. People searching civic questions want answers, not products.

---

## Part 2: Backlinks — What's Real vs What's a Scam

### What "babylovegrowth" and similar services actually do

Services that cold-email offering "SEO backlinks" typically use one or more of these tactics:

1. **Private Blog Networks (PBNs):** Networks of low-quality sites that exist solely to sell links. Google detects and penalises these. Sites caught using PBNs lost 40-70% of referring domains after Google's 2025 spam update.

2. **Link farms:** Hundreds of sites that all link to each other. Zero value. Google ignores or penalises these.

3. **Expired domain abuse:** Buying old domains with existing authority and redirecting them. Google caught on; this no longer works.

4. **Guest post mills:** Paying sites $50-200 to "publish your article" with a link back. The sites are obviously pay-for-play and Google knows it.

### Red flags — never pay for:
- "Get 10,000 backlinks for $99"
- Guaranteed DA/DR scores
- Any service that won't tell you exactly which sites will link to you
- Bulk link packages
- Any link acquired in under a week with no editorial process

### What actually works for backlinks (free)

1. **Create linkable content.** Original data that journalists and researchers cite. Frank has this: interview analysis, deprivation comparisons, civic data compilations.

2. **Digital PR.** Write a compelling finding from Frank's data ("Beckton residents say housing is their #1 concern — here's the data") and pitch it to local journalists. They link to your source.

3. **Get listed on relevant directories.** MySociety, civic tech lists, open data directories, UK democracy resources.

4. **Academic/NGO citations.** If researchers use Frank's data, they cite it. Each citation = a high-quality backlink.

5. **Council/government links.** If a council links to Frank as a resource, that's an extremely high-value backlink from a .gov.uk domain.

**Bottom line: Do not pay anyone for backlinks. The free methods above are the only ones that work long-term.**

---

## Part 3: What to Do Right Now (Free)

### Already done:
- [x] robots.txt (at `/public/robots.txt`)
- [x] Open Graph meta tags (in `layout.tsx`)
- [x] Twitter card meta tags
- [x] HTTPS via Cloudflare
- [x] Mobile viewport configuration

### Must do immediately:

#### 1. Google Search Console (30 minutes)

Go to https://search.google.com/search-console/about

- Click "Start now," sign in with a Google account
- Add property: `https://frank.community`
- Verify via DNS TXT record (Cloudflare DNS dashboard > add TXT record with the verification string Google gives you)
- Once verified, submit your sitemap URL

This gives you: which queries people use to find Frank, which pages are indexed, any crawl errors, Core Web Vitals scores. It is the single most important free SEO tool.

#### 2. Create sitemap.xml (20 minutes)

Frank runs Next.js 14. Create a dynamic sitemap:

```typescript
// web/app/sitemap.ts
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://frank.community'

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/guide`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/beckton`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
  ]

  // TODO: Dynamically generate entries for each area page
  // const areas = await fetchAllAreas()
  // const areaPages = areas.map(area => ({
  //   url: `${baseUrl}/${area.slug}`,
  //   lastModified: area.updatedAt,
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }))

  return [...staticPages]
}
```

Next.js will automatically serve this at `frank.community/sitemap.xml`.

#### 3. Update robots.txt to include sitemap

```
User-agent: *
Allow: /

Sitemap: https://frank.community/sitemap.xml
```

#### 4. Add structured data / JSON-LD (1 hour)

No structured data exists yet. Add it to key pages:

```typescript
// Component for any page
function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// For the homepage
const homepageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Frank",
  "url": "https://frank.community",
  "description": "Civic intelligence powered by real conversations",
  "applicationCategory": "GovernmentApplication",
  "operatingSystem": "Web",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" }
}

// For area pages (e.g., /beckton)
const areaSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Beckton Community Intelligence Report",
  "author": { "@type": "Organization", "name": "Frank" },
  "publisher": { "@type": "Organization", "name": "Frank", "url": "https://frank.community" },
  "datePublished": "2026-03-01",
  "dateModified": "2026-03-18",
  "about": {
    "@type": "Place",
    "name": "Beckton",
    "containedInPlace": { "@type": "AdministrativeArea", "name": "Newham" }
  }
}

// For councillor/official pages
const personSchema = {
  "@context": "https://schema.org",
  "@type": "GovernmentOrganization",
  "member": {
    "@type": "Person",
    "name": "Councillor Name",
    "jobTitle": "Councillor",
    "worksFor": { "@type": "GovernmentOrganization", "name": "Newham Council" }
  }
}
```

Sites with rich results (from structured data) see 20-30% higher click-through rates.

#### 5. Per-page metadata (1 hour)

Each route should have its own metadata, not just inherit from layout.tsx. Example:

```typescript
// web/app/about/page.tsx
export const metadata: Metadata = {
  title: "About Frank — Free Civic Intelligence Platform",
  description: "Frank helps communities research their area, interview residents, and generate evidence-based policy proposals. Free and open source.",
}

// web/app/beckton/page.tsx
export const metadata: Metadata = {
  title: "Beckton Community Report — Frank",
  description: "What residents of Beckton actually say about housing, safety, and services. Based on real interviews and public data.",
}
```

#### 6. Cloudflare caching optimisation (30 minutes)

In Cloudflare dashboard for frank.community:
- **Caching > Cache Rules:** Cache static assets (JS, CSS, images) with Edge TTL of 1 month
- **Speed > Optimization:** Enable Auto Minify (JS, CSS, HTML), Brotli compression
- **Speed > Optimization:** Enable Early Hints, Rocket Loader
- **Caching > Tiered Cache:** Enable (uses Cloudflare's network more efficiently)

---

## Part 4: Content Strategy — What Articles to Publish

### Target Keywords and Estimated Volumes

Based on UK search data patterns, here are the terms worth targeting. Search volumes are estimates based on comparable keyword data and GOV.UK traffic patterns.

| Search Term | Est. Monthly Volume (UK) | Competition | Frank's Article |
|-------------|-------------------------|-------------|-----------------|
| "how to complain to my council" | 5,000-12,000 | **High** (GOV.UK, Citizens Advice rank #1-2) | "How to complain to your council: step-by-step guide with template letters" |
| "who is my local councillor" | 8,000-15,000 | **High** (council sites, WriteToThem) | "Find your local councillor — plus what they actually do and how to contact them" |
| "how to attend a council meeting" | 1,000-3,000 | **Medium** | "How to attend a council meeting: what to expect and how to speak" |
| "how to start a community campaign" | 500-1,500 | **Low** | "How to start a community campaign: from first steps to council action" |
| "deprivation index my area" / "IMD postcode" | 3,000-8,000 | **Medium** (GOV.UK tool exists but UX is terrible) | "Check deprivation in your area — and what it actually means" |
| "crime statistics my postcode" | 10,000-20,000 | **High** (police.uk dominates) | "Crime in [area]: statistics, trends, and what residents say" |
| "council housing complaints" | 3,000-6,000 | **Medium** | "Council housing problems? Here's how to get action" |
| "what does my council tax pay for" | 2,000-5,000 | **Medium** | "Where your council tax goes: a breakdown for [borough]" |
| "how to become a councillor" | 1,000-3,000 | **Medium** | "How to become a councillor: the honest guide" |
| "community consultation" | 1,000-2,000 | **Low** | "What is community consultation and does it actually work?" |

### Strategy: Go After Medium and Low Competition First

Do NOT try to outrank GOV.UK for "how to complain to my council." You won't. Instead:

**Tier 1 — Quick wins (low competition, genuine value):**
- "how to start a community campaign"
- "what is community consultation"
- "how to speak at a council meeting"
- "how to become a councillor UK"

**Tier 2 — Differentiated content (medium competition, Frank adds unique data):**
- "deprivation index [specific area]" — Frank can show this with better UX than GOV.UK
- "crime statistics [specific area]" — Frank adds resident voice to raw stats
- "[area] vs [area] comparison" — nobody else does this

**Tier 3 — Long-tail local (very low competition, hyperlocal):**
- "housing problems in Beckton"
- "what is Beckton like to live in"
- "Newham council performance"
- "elected officials Newham"

**Tier 3 is where Frank wins.** Almost nobody is creating quality content about specific neighbourhoods. The competition is Reddit threads, old forum posts, and council PDFs.

### Article Template

Every article should follow this structure:

1. **Answer the question immediately** (first paragraph, no preamble)
2. **Practical steps or data** (the actual useful content)
3. **Frank's unique angle** (what residents say, data comparison, interactive tool)
4. **Call to action** ("Explore Beckton on Frank" / "Run your own community research")

Each article needs:
- Unique `<title>` and `<meta description>`
- Proper heading hierarchy (one H1, then H2s/H3s)
- Internal links to other Frank pages
- Structured data (Article schema)
- At least 800-1,500 words (Google favours comprehensive content)
- Updated date visible on the page

---

## Part 5: The "Local Newspaper" Strategy — Auto-Generated Civic Content

### How Hyperlocal News Sites Rank

Patch.com grew to 20 million monthly visitors by focusing on strictly local content. Their formula:
- Location name in title and URL
- Specific local issue (not generic advice)
- Freshness (regular updates)
- Community engagement (comments, submissions)

### What Makes Auto-Generated Content Rank (vs Get Penalised)

Google does NOT ban auto-generated content. Google bans **low-quality** auto-generated content. The distinction:

**Will get penalised:**
- 10,000 pages that each say "Crime in [city]: [city] has [number] crimes" with no real analysis
- Templated pages with swapped-out location names but identical structure
- Pages with no original data or insight

**Will rank well:**
- Pages generated from **genuinely unique data** (Frank's interview transcripts, analysis)
- Pages with **real statistical comparisons** (not just restating ONS data but contextualising it)
- Pages that are **individually useful** (someone searching "housing in Beckton" gets something they can't find elsewhere)

Google's December 2025 Core Update specifically targeted scaled AI content lacking original insights. Sites relying on mass-produced AI content saw traffic declines averaging 34%. But sites with programmatic content built from **unique databases** continued to rank.

### Frank's Auto-Generated Article Types

**Type 1: Community Voice Reports**
- Title: "What residents of Beckton actually say about housing"
- Source: Interview transcripts, analysed and themed
- Why it ranks: Original primary research. Nobody else has this data.
- Update frequency: After each new batch of interviews

**Type 2: Data Comparison Pages**
- Title: "Beckton vs Newham average: deprivation, crime, and services compared"
- Source: IMD data, police data, council data
- Why it ranks: Specific comparison nobody else makes. Better UX than GOV.UK tools.
- Update frequency: When underlying data updates (annually for IMD, monthly for crime)

**Type 3: Elected Officials Directory**
- Title: "Every elected official in Beckton: who they are and what they do"
- Source: Council API data, TheyWorkForYou, official records
- Why it ranks: Centralised information currently scattered across council sites
- Update frequency: After elections or role changes

**Type 4: Policy Proposals**
- Title: "5 evidence-based policy proposals for Beckton from resident interviews"
- Source: Frank's AI analysis of interview themes
- Why it ranks: Genuinely original content. Shows E-E-A-T (experience + expertise)
- Update frequency: Quarterly or after significant new data

**Type 5: Area Overview Pages**
- Title: "Beckton: everything you need to know about this Newham neighbourhood"
- Source: Aggregation of all Frank data for the area
- Why it ranks: Comprehensive, regularly updated, combines data no other single source has
- Update frequency: Continuous as data changes

### URL Structure for Auto-Generated Pages

```
frank.community/beckton                          → Area overview
frank.community/beckton/housing                   → Topic deep-dive
frank.community/beckton/officials                 → Elected officials
frank.community/beckton/deprivation               → Data comparison
frank.community/beckton/voices                    → What residents say
frank.community/beckton/proposals                 → Policy proposals
frank.community/guides/complain-to-council        → Evergreen guide
frank.community/guides/attend-council-meeting     → Evergreen guide
frank.community/compare/beckton-vs-stratford      → Comparison page
```

Clean, descriptive URLs with the area name are critical for local SEO.

---

## Part 6: Technical SEO for Next.js 14

### Complete checklist for frank.community:

#### Already done:
- [x] Open Graph tags in layout.tsx
- [x] Twitter card tags
- [x] robots.txt
- [x] Viewport meta tag
- [x] HTTPS
- [x] `lang="en"` on `<html>` tag

#### To implement:

**Priority 1 (do this week):**

| Task | File | Effort |
|------|------|--------|
| Create `sitemap.ts` | `web/app/sitemap.ts` | 20 min |
| Add Sitemap reference to robots.txt | `web/public/robots.txt` | 1 min |
| Google Search Console setup | Cloudflare DNS + GSC | 30 min |
| Per-page metadata for /about, /beckton, /guide | Each page.tsx | 30 min |
| JSON-LD structured data component | New component + add to pages | 1 hour |

**Priority 2 (this month):**

| Task | File | Effort |
|------|------|--------|
| Dynamic metadata for `[area]` pages | `web/app/[area]/page.tsx` | 30 min |
| Canonical URLs on all pages | layout.tsx or per-page | 20 min |
| Image alt text audit | All components with images | 30 min |
| Internal linking between pages | Content components | 1 hour |
| 404 page with helpful navigation | `web/app/not-found.tsx` | 30 min |

**Priority 3 (ongoing):**

| Task | Notes |
|------|-------|
| Publish first 3 guide articles | See content strategy above |
| Generate area pages programmatically | For each area Frank has data on |
| Monitor Search Console weekly | Track impressions, clicks, errors |
| Core Web Vitals optimisation | Based on Search Console data |

### Dynamic Metadata for Area Pages

```typescript
// web/app/[area]/page.tsx
import { Metadata } from 'next'

type Props = { params: { area: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const areaName = params.area.charAt(0).toUpperCase() + params.area.slice(1)

  return {
    title: `${areaName} — Community Intelligence Report | Frank`,
    description: `What residents of ${areaName} actually say about their area. Deprivation data, elected officials, and evidence-based policy proposals.`,
    openGraph: {
      title: `${areaName} Community Report — Frank`,
      description: `Civic intelligence for ${areaName}: resident voices, public data, and policy proposals.`,
      url: `https://frank.community/${params.area}`,
    },
  }
}
```

### Canonical URL Setup

Add to layout.tsx or individual pages:

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://frank.community'),
  alternates: {
    canonical: '/',
  },
}
```

---

## Part 7: What NOT to Pay For

### Services to avoid completely:

1. **Link-building packages** ($50-500): These use PBNs, link farms, or expired domains. Google penalises sites that use them. After Google's 2025 spam update, affected sites lost 40-70% of their backlinks within weeks.

2. **"SEO audits" from cold emailers**: Anyone who emails you unsolicited offering an "SEO audit" is selling a template report. Google Search Console gives you better data for free.

3. **Directory submission services**: Submitting to 500 directories is a 2008 tactic. It does nothing and can hurt you.

4. **Content spinning services**: Taking existing articles and rewriting them with synonyms. Google detects this trivially.

5. **Guaranteed rankings**: Nobody can guarantee a #1 ranking. Google's algorithm has hundreds of factors and changes constantly.

6. **Social media "SEO packages"**: Social signals are a minor ranking factor. Paying someone to post on social media won't meaningfully affect your search rankings.

### What damages your ranking:

- **Buying links**: Google's algorithms detect purchased links. Penalty = months of recovery.
- **Duplicate content**: If the same text appears on multiple Frank pages with just the area name swapped, Google will ignore most of them.
- **Keyword stuffing**: Repeating "civic intelligence Beckton community Beckton civic" unnaturally. Google penalises this.
- **Cloaking**: Showing different content to Google vs users. Never do this.
- **Thin content**: Pages with less than 200 words of useful content.

### The honest difference between legitimate SEO consulting and scams:

| Legitimate | Scam |
|-----------|------|
| Audits your specific site | Sends generic report |
| Recommends content strategy | Promises link packages |
| Timeline: 3-12 months | Promises results in days/weeks |
| Costs $1,000-5,000/month | Costs $50-200 one-time |
| Shows you exactly what they do | Vague about methods |
| Focuses on content + technical fixes | Focuses on "backlinks" |

**Frank does not need to pay for SEO consulting.** Everything a consultant would recommend is in this document. The work is: create good content, get the technical basics right, be patient.

---

## Part 8: Realistic Timeline

Based on 2025-2026 data from Ahrefs and industry studies:

| Timeframe | What to Expect |
|-----------|---------------|
| Week 1-2 | Set up Search Console, sitemap, structured data. Google indexes the site. |
| Month 1-2 | Google discovers and crawls new pages. No meaningful traffic yet. |
| Month 3-4 | Low-competition long-tail keywords start showing impressions (e.g., "housing problems Beckton"). |
| Month 4-6 | First organic clicks trickle in. Area-specific pages start ranking for "[area] + [topic]" queries. |
| Month 6-9 | If guide articles are published and quality, they start ranking for medium-competition terms. |
| Month 9-12 | Steady growth. Domain authority builds. Backlinks from press coverage / academic citations accumulate. |
| Year 2+ | Compounding effect. More content = more ranking = more backlinks = higher authority = better ranking for harder terms. |

Key statistic: Only 1.74% of newly published pages reach the top 10 within one year (Ahrefs, May 2025). The average page ranking #1 on Google is 5 years old. SEO is a long game.

**But**: hyperlocal content about specific UK neighbourhoods has almost zero competition. Frank could rank on page 1 for "Beckton deprivation data" or "what is Beckton like to live in" within 2-3 months of publishing quality content.

---

## Part 9: Action Plan (Ordered by Impact)

### This week:
1. Set up Google Search Console and verify frank.community
2. Create `web/app/sitemap.ts`
3. Add `Sitemap: https://frank.community/sitemap.xml` to robots.txt
4. Add JSON-LD structured data to homepage and /beckton

### This month:
5. Add unique metadata to every existing page (/about, /guide, /beckton, /record, /video)
6. Publish first guide article: "How to attend a council meeting in the UK"
7. Publish second guide article: "Check deprivation in your area and what it means"
8. Create dynamic metadata for [area] pages

### Next 3 months:
9. Publish area pages for every area Frank has data on (programmatic)
10. Publish 2-3 more guide articles (community campaigns, councillor contact, council complaints)
11. Pitch Frank's data findings to local journalists for backlinks
12. Submit Frank to civic tech directories (MySociety, Open Data Institute, etc.)

### Ongoing:
13. Monitor Search Console weekly — track which queries bring impressions
14. Update area pages when new data arrives (freshness signal)
15. Respond to what Search Console shows: if a query gets impressions but low clicks, improve the page title/description for that query

---

## Sources

- [Backlinko: Google's 200 Ranking Factors (2026)](https://backlinko.com/google-ranking-factors)
- [First Page Sage: Google Algorithm Ranking Factors 2025](https://firstpagesage.com/seo-blog/the-google-algorithm-ranking-factors/)
- [WordStream: 7 Most Important SEO Ranking Factors 2025](https://www.wordstream.com/blog/seo-ranking-factors-2025)
- [Outreach Monks: Link Building Scams 2025](https://outreachmonks.com/link-building-scams/)
- [Blue Tree Digital: Link Building Scams How to Spot and Avoid](https://bluetree.digital/link-building-scams/)
- [Programmatic SEO in 2026: Scaling Traffic](https://zumeirah.com/programmatic-seo-in-2026/)
- [Google's Position on AI Content 2025](https://seo.ai/blog/googles-position-policy-ai-text-content)
- [AI-Generated Content in 2026: Rank Safely](https://www.iconier.com/ai-generated-content-seo-2026-best-practices)
- [Search Engine Land: Hyperlocal News on Patch](https://searchengineland.com/hyperlocal-social-news-on-patch-161665)
- [Next.js SEO Best Practices 2025](https://www.slatebytes.com/articles/next-js-seo-in-2025-best-practices-meta-tags-and-performance-optimization-for-high-google-rankings)
- [Next.js SEO Optimization Guide 2026](https://www.djamware.com/post/nextjs-seo-optimization-guide-2026-edition)
- [How Long Does SEO Take: Realistic Timeline 2025](https://digi-solutions.com/how-long-does-it-really-take-to-get-seo-results-a-realistic-timeline-for-success-in-2025/)
- [Search Engine Land: How Long SEO Takes](https://searchengineland.com/guide/how-long-does-seo-take-to-work)
- [Google Search Console Guide](https://searchengineland.com/google-search-console-seo-guide-443942)
- [Cloudflare CDN Caching Best Practices](https://www.debugbear.com/docs/cloudflare-caching)
- [GOV.UK: Complain About Your Council](https://www.gov.uk/complain-about-your-council)
- [GOV.UK: English Indices of Deprivation 2025](https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025/english-indices-of-deprivation-2025-statistical-release)
