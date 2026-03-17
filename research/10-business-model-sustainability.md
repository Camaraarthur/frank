# Business Model & Sustainability Research

Deep research for Beat -- AI-powered civic field research tool.

Last updated: 2026-03-16

---

## 1. Civic Tech Business Models That Worked

### Pol.is
- **Model**: Fully open-source, no direct revenue model
- **Sustainability**: Grant-funded and supported by institutional partnerships. Co-founder Colin Megill advised OpenAI on deliberation at scale. In 2023, OpenAI's "Democratic Input to AI" initiative awarded $100K grants to 10 teams, including vTaiwan (which uses Pol.is). The project relies on volunteer labour and institutional adoption (Taiwan's government via Audrey Tang) rather than commercial revenue
- **Lesson**: Pure open-source civic tools struggle to sustain themselves without institutional champions or adjacent commercial work

### CitizenLab (now Go Vocal)
- **Model**: SaaS platform sold to local governments. Tiered pricing based on city population size
- **Tiers for small-medium cities (<100K)**:
  - Essential: 1 active project, 1 admin seat, basic onboarding
  - Standard: Unlimited projects, 4 admin seats, dashboards, report builder
  - Premium: Unlimited projects, 8 admin seats, auto-insights, auto-translation (3 languages)
- **Tiers for large cities (>100K)**:
  - Department: Everything in Premium, dedicated success manager
  - Enterprise: Unlimited seats, ArcGIS integration, SSO, Power BI connector, custom SLA
- **Estimated pricing**: ~EUR 20-50K/yr for mid-size municipalities (not publicly disclosed)
- **Lesson**: Government SaaS with tiered pricing by population size is the most proven civic tech revenue model. They rebranded from "CitizenLab" to "Go Vocal" -- signalling a shift toward broader engagement market positioning

### Decidim
- **Model**: Open-source platform governed by the Decidim Free Software Association (Barcelona, est. 2019)
- **Sustainability crisis**: Nearly collapsed in 2022 when Barcelona City Council (its primary funder) reduced support. Developed a diversified Sustainability Plan
- **Current funding model**:
  - Public Institutions Committee: governments that use Decidim contribute financially on a scaled basis
  - Partner contributions: companies offering Decidim services include a clause in contracts allocating 3% to core maintenance (1.5% for nonprofits)
  - Multi-stakeholder governance: 80+ local and supra-local governments collaborate
- **Lesson**: Open-source civic tech needs diversified institutional funding, not dependence on a single patron. The "percentage of service contracts" model is clever and applicable to Beat

### FixMyStreet / mySociety
- **Model**: Charity (mySociety, registered 1076346) with commercial subsidiary (SocietyWorks)
- **Revenue**:
  - FixMyStreet Pro: customisable reporting tool for councils, annual subscriptions of GBP 15,000-62,000 depending on council size
  - 31 authorities currently use FixMyStreet Pro as primary reporting software
  - Commercial subsidiary accounts for 10-20% of total revenue
  - Remainder from grants and donations
- **Strategy**: Growing unrestricted reserves through commercial profit as grant landscape becomes uncertain
- **Lesson**: The charity-with-commercial-subsidiary model is highly relevant for Beat. Free citizen-facing tool, paid council-facing version. mySociety is the closest structural analogue

### Key Takeaway for Beat
The most sustainable civic tech organisations sell to government (SaaS or annual licence), keep the citizen-facing product free, and supplement with grants during early stages. Pure open-source and grant-only models are fragile.

---

## 2. Government Procurement in the UK

### G-Cloud Framework
- **Current status**: G-Cloud 14 is live. G-Cloud 15 ITT opened October 2025, applications closed January 2026, expected go-live September 2026
- **Scale**: Estimated framework value for G-Cloud 15 is GBP 14 billion over 4 years (to September 2030). Spending on G-Cloud reached GBP 3.1 billion in 2023/24
- **SME-friendly**: 90% of 5,200+ G-Cloud suppliers are SMEs. 38% of sales across all iterations made by SMEs
- **Application**: Suppliers apply during a 35-day window, provide pricing documents, terms and conditions. Low barriers to entry via catalogue format
- **How councils buy**: County councils and boroughs can source technology services through G-Cloud. Buying through frameworks is faster and cheaper than individual procurement

### Digital Marketplace
- The online portal where public sector buyers browse and purchase G-Cloud services
- Councils can search by category, compare services, and call off contracts with or without competition
- CitizenLab/Go Vocal is already listed on the Digital Marketplace

### Procurement Thresholds (Key for Beat)
- **Under GBP 10,000**: Many councils can purchase with minimal process (single quote)
- **GBP 10,000-25,000**: Typically requires 3 quotes
- **GBP 25,000-GBP 139,688** (current Public Contracts Regulations threshold): Councils have own standing orders but must demonstrate value for money
- **Above threshold**: Full OJEU/Find a Tender process required
- **Implication for Beat**: Pricing below GBP 25K/yr allows simpler procurement. Below GBP 10K is even easier -- a department head can often approve without formal tendering

### Procurement Cycles
- Council budgets set annually (April-March financial year)
- Budget planning typically happens October-February
- Best time to approach councils: autumn, when budgets are being drafted
- Multi-year contracts (2-3 years) are common for software, providing revenue predictability

### Typical Budgets for Engagement Tools
- Councils spend varying amounts depending on size. A London borough's total annual budget can be GBP 1-2 billion; a district council's might be GBP 10-50 million
- Engagement/consultation tool budgets are typically within communications, policy, or planning departments
- Typical digital engagement platform spend: GBP 15,000-60,000/yr for a mid-size council

---

## 3. Freemium for Civic Tech

### Recommended Free Tier (for individual researchers, small NGOs, candidates)
- **Core field research tool**: Walk an area, record observations, AI synthesis
- **Limited sessions**: e.g., 5 research sessions per month
- **Basic AI analysis**: Summary and key themes from a single session
- **On-device transcription only** (no cloud API cost)
- **Export**: Basic PDF report
- **Data**: User owns their data, stored locally on device
- **No historical data / trend analysis**

### Recommended Paid Tiers

**Professional (GBP 50-150/month) -- for consultancies, larger NGOs, political campaigns**
- Unlimited research sessions
- Cloud-enhanced AI analysis (Gemini API)
- Cross-session analysis and pattern detection
- Team sharing (up to 5 seats)
- Branded PDF/Word reports
- Priority support

**Council / Enterprise (GBP 10,000-30,000/year) -- for local government deployment**
- Unlimited seats across departments
- Council-wide dashboard showing all areas researched
- Integration with existing council systems (CRM, case management)
- Historical trend analysis (changes over time in an area)
- Comparative analysis across wards/neighbourhoods
- Aggregated anonymised insights
- Dedicated onboarding and training
- Custom branding
- Data residency guarantees (UK hosting)
- SLA with guaranteed response times
- API access for data integration

### Rationale for This Structure
- Free tier creates adoption flywheel and demonstrates value. Researchers and candidates create content that makes the paid version more compelling
- Professional tier covers API costs with margin and serves the "long tail" of users
- Council tier is where real revenue lives, benchmarked against competitors (see Section 10)
- On-device transcription on free tier means zero marginal cost for basic usage -- critical for sustainability

### Lessons from Civic Tech Freemium (Knight Foundation Research)
- The biggest civic tech SaaS customer segment is government clients seeking citizen engagement and open data tools
- "We close deals by conveying the value proposition to working-level government employees who will use this and can do smaller contracts" -- Josh Goldstein, DOBT
- Pricing below complex procurement thresholds (GBP 25K) is a strategic advantage for early-stage civic tech
- Going SaaS "allowed us to lower our price and avoid that threshold that required complex procurement and RFP processes" -- Eddie Tejeda, Civic Insight

---

## 4. Mozilla's View on Sustainability

### Mozilla Foundation Incubator Philosophy
- Mozilla explicitly wants grantees to become self-sustaining. Their 2025 strategy described a "critical gap" in the funding landscape: money flows to prototypes and early-stage companies, but little supports maturing community-driven technologies that haven't figured out their sustainability plan
- The Incubator bridges this gap by focusing on "product/community fit" -- connecting promising technologies to users, contributors, and sustainable funding sources

### What Mozilla Evaluates for Sustainability
From the Democracy x AI Cohort 2026 criteria:
1. **Sustainability potential**: "Has the team started thinking about long-term viability? Is there a plausible path to sustainability that aligns with their values -- whether through revenue, community support, institutional partnerships, or something else?"
2. **Values alignment**: Technology must enable transparency and agency. Open code, shared learnings, open datasets, transparent practices
3. **Impact potential**: Clear potential for charitable/public benefit
4. **Theme fit**: Measurable improvements in civic participation, institutional transparency, information quality, or collective decision-making

### Acceptable Business Models (from Mozilla's perspective)
Mozilla is model-agnostic but values-aligned. Acceptable paths include:
- Revenue from government/institutional customers
- Community support and membership models
- Institutional partnerships
- Open-source with commercial services layer (the "open core" model)
- What they do NOT want: data monetisation that compromises user privacy, advertising-driven models, or VC-driven growth that prioritises scale over values

### Democracy x AI Cohort 2026 Details
- Up to $50,000 per project
- Total programme: $1M committed
- Requires: working AI-driven tool already in use, committed team, demonstrated commitment to openness
- Applications closed 16 March 2026
- Mozilla is "making bold bets on open source technologies and data infrastructure with potential for transformative impact, then seeing these projects through from prototypes to sustainability"

### Implication for Beat
Mozilla wants to see a credible sustainability plan but is flexible on the specific model. A CIC structure with government SaaS revenue, open-source core, and on-device-first architecture (privacy by design) aligns very well with their values. The key is articulating that the freemium model serves public benefit (free tier) while the government tier generates sustainable revenue.

---

## 5. API Cost Modelling

### Current Gemini Pricing (March 2026)

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Audio Input (per 1M tokens) |
|-------|----------------------|----------------------|---------------------------|
| Gemini 2.5 Flash | $0.30 | $2.50 | $1.00 |
| Gemini 2.5 Flash-Lite | $0.10 | $0.40 | $0.30 |
| Gemini 2.0 Flash | $0.10 | $0.40 | N/A |
| Gemini 3 Flash Preview | $0.50 | $3.00 | $1.00 |

### Free Tier Available
- Google offers a genuinely free tier: 5-15 requests/minute, up to 1,000 daily requests, no credit card required, across 6 models
- This could cover the free tier of Beat entirely during early growth

### Cost Per Research Session (Estimated)

Assumptions for a typical 2-hour field research session:
- 6-8 observation notes (voice or text), ~200 words each = ~1,600 words total input
- AI synthesis prompt + context: ~500 words
- Total input: ~2,100 words = ~2,800 tokens
- Output (analysis, themes, recommendations): ~1,500 words = ~2,000 tokens

**Using Gemini 2.5 Flash-Lite:**
- Input cost: 2,800 tokens x $0.10/1M = $0.00028
- Output cost: 2,000 tokens x $0.40/1M = $0.0008
- **Total per session: ~$0.001 (less than a tenth of a penny)**

### Cost Per Area Researched (More Complex Analysis)

Assumptions for a full area analysis (aggregating 5-10 sessions):
- Input: ~30,000 tokens (all observations + prompts + area context)
- Output: ~5,000 tokens (detailed report with themes, comparisons, recommendations)

**Using Gemini 2.5 Flash-Lite:**
- Input: $0.003
- Output: $0.002
- **Total per area: ~$0.005 (half a penny)**

### Cost Per Interview Synthesised

Assumptions for a 30-minute interview transcript:
- Transcript: ~5,000 words = ~6,700 tokens
- Synthesis prompt + context: ~500 tokens
- Total input: ~7,200 tokens
- Output (summary, themes, quotes): ~2,000 tokens

**Using Gemini 2.5 Flash-Lite:**
- Input: $0.00072
- Output: $0.0008
- **Total per interview: ~$0.0015**

### Audio Processing via Gemini API (Alternative to On-Device)

If sending raw audio to Gemini instead of transcribing locally:
- Audio tokens: ~25 tokens per second
- 30-minute interview: 1,800 seconds x 25 = 45,000 tokens
- Cost at Flash-Lite audio rate ($0.30/1M): $0.0135

**This is still very cheap, but 9x more expensive than transcribing locally and sending text.**

### Monthly Cost Projections

| Usage Level | Sessions/month | API Cost/month | Notes |
|-------------|---------------|---------------|-------|
| Free user (light) | 5 | $0.005 | Covered by Gemini free tier |
| Free user (active) | 20 | $0.02 | Still negligible |
| Professional user | 50 | $0.05 | Covered many times over by subscription |
| Council (10 users) | 200 | $0.20 | Trivial relative to GBP 10K+ contract |
| Council (50 users) | 1,000 | $1.00 | Still under $1/month in API costs |

### Key Insight
**Gemini API costs are so low that they are essentially irrelevant to the business model.** Even at massive scale (100 councils, 50 users each, 1,000 sessions/month each = 5 million sessions/month), total API cost would be ~$5,000/month. Revenue from 100 councils at GBP 15K/yr each = GBP 125K/month. API costs are <0.5% of revenue.

The real costs are: development, sales, support, hosting, and team salaries -- not AI inference.

### Cost Optimisation Options
- **Context caching**: Reduces costs by up to 75% for repeated prompts (cache reads at 10% of base price)
- **Batch processing**: 50% discount for non-urgent workloads
- **Free tier**: 1,000 requests/day covers early-stage growth entirely

---

## 6. On-Device Transcription Comparison

### Option A: Whisper.cpp (On-Device)

| Factor | Details |
|--------|---------|
| **Cost** | Zero marginal cost (runs on user's phone) |
| **Quality** | 90-98% accuracy for clear audio in major languages |
| **Speed** | ~2 seconds for 30-second clip on Pixel 7; 1 hour audio in 6-8 minutes on iPhone 15 Pro |
| **Model sizes** | Tiny: ~40MB, Base: ~150MB, Small: ~500MB |
| **Privacy** | Complete -- audio never leaves the device |
| **Languages** | 99 languages (Whisper's training set) |
| **Offline** | Fully offline capable |
| **Limitations** | No native streaming; quality degrades in noisy environments with smaller models; battery/CPU impact on older devices |

### Option B: Gemini Audio API (Cloud)

| Factor | Details |
|--------|---------|
| **Cost** | $0.30-1.00 per 1M audio tokens (~$0.014-0.045 per 30 min) |
| **Quality** | Transcription + semantic analysis + diarisation in one call |
| **Speed** | Near real-time with streaming |
| **Privacy** | Audio sent to Google servers |
| **Languages** | Broad multilingual support |
| **Extras** | Can do transcription + analysis simultaneously, reducing total API calls |
| **Limitations** | Requires internet; data leaves device |

### Option C: Deepgram (Cloud)

| Factor | Details |
|--------|---------|
| **Cost** | $0.0048-0.0077/minute ($0.14-0.23 per 30 min) |
| **Quality** | 90%+ accuracy, optimised for real-time; 300ms latency |
| **Speed** | Native streaming, fastest option |
| **Privacy** | Audio processed on Deepgram servers (not sent to OpenAI) |
| **Languages** | 36+ languages with deep optimisation |
| **Limitations** | Requires internet; significantly more expensive than Gemini |

### Option D: OpenAI Whisper API (Cloud)

| Factor | Details |
|--------|---------|
| **Cost** | $0.006/minute ($0.18 per 30 min) |
| **Quality** | High accuracy, consistent |
| **Speed** | Not real-time |
| **Privacy** | Audio sent to OpenAI servers |
| **Limitations** | No volume discounts, no streaming |

### Recommendation for Beat

**Primary: Whisper.cpp on-device (Small model, ~500MB)**
- Zero marginal cost aligns with freemium model
- Privacy-first approach aligns with Mozilla values and government data requirements
- Works offline (critical for field research in areas with poor connectivity)
- 90-98% accuracy is sufficient for field notes

**Secondary (paid tier enhancement): Gemini Audio API**
- For paid users who want higher-quality transcription or simultaneous analysis
- Cost is negligible ($0.014 per 30-min interview)
- Combined transcription + analysis saves a round-trip

**Avoid**: Deepgram and OpenAI Whisper API -- 10-15x more expensive than Gemini for similar quality, and Beat doesn't need real-time streaming for field research interviews.

### Privacy Architecture
This combination is powerful for the government sales pitch:
- **Default**: All transcription on-device, audio never leaves the phone
- **Optional**: Cloud processing only when user explicitly opts in
- **Result**: Councils can deploy with confidence about GDPR / data protection compliance

---

## 7. Revenue from Data Insights

### What Could Be Valuable
Aggregated, anonymised data across many areas could reveal:
- **Neighbourhood-level trend data**: How does resident sentiment about green spaces, safety, cleanliness, or infrastructure change over time and across areas?
- **Comparative benchmarks**: How does Ward X compare to similar wards in other councils on specific metrics?
- **Planning intelligence**: Which types of areas are experiencing rapid change? What issues emerge before formal complaints?
- **Policy impact measurement**: Did a council intervention (new park, traffic calming) measurably change field observations?

### Potential Buyers
- **Central government** (DLUHC, MHCLG): National-level insight into local conditions
- **Think tanks and researchers**: University departments, NESTA, Joseph Rowntree Foundation
- **Urban planning consultancies**: Arup, WSP, AECOM
- **Housing associations**: Understanding neighbourhood conditions
- **Commercial property developers**: Area intelligence (ethical concerns here)

### Ethical Framework

**Acceptable uses:**
- Aggregated trend reports (no individual areas identifiable below ward level)
- Academic research partnerships with ethics board oversight
- Government policy analysis at aggregate level
- Open data publications (fully anonymised)

**Unacceptable uses:**
- Selling to property developers for gentrification intelligence
- Selling to political campaigns for targeting
- Any use that could identify individual researchers or interviewees
- Any use that could lead to discriminatory outcomes for communities

### Risks
- **Trust destruction**: If users discover their field research is being monetised, trust collapses. Community researchers and NGOs especially would feel betrayed
- **GDPR implications**: Even "anonymised" data can be re-identified if areas are small enough
- **Mission drift**: Revenue from data creates incentive to collect more data, not to serve users better
- **Government customer concerns**: Councils may require contractual guarantees that their data isn't resold

### Recommendation for Beat
**Do not pursue data monetisation as a primary revenue stream.** The risks to trust, mission, and government sales far outweigh the potential revenue. Instead:
- Make aggregated insights a feature of the paid tier (councils see trends in their own data)
- Consider publishing open aggregate data as a public good (builds credibility, not revenue)
- If data products are ever explored, do so transparently with an explicit opt-in and ethics board oversight
- The CIC structure (see Section 9) provides a natural governance safeguard against data exploitation

---

## 8. Grant Funding Landscape

### Active and Relevant Funders

| Funder | Focus | Grant Size | Notes |
|--------|-------|-----------|-------|
| **Mozilla Foundation** | Democracy x AI, trustworthy tech | Up to $50K per project ($1M total cohort) | Requires working tool, open-source commitment. 2026 cohort applications closed 16 March |
| **Knight Foundation** | Civic engagement, informed communities | $5K-$500K+ | US-focused but funds global research. Invested $50M in tech/democracy research |
| **Luminate** (Omidyar Group) | Civic empowerment, data rights, transparency | Varies widely | Invested $126M globally in civic tech. Focus on sustainability/scale |
| **NESTA** | Innovation for social good, government innovation | Up to GBP 30K (Collective Intelligence); GBP 10K (Democracy Pioneers) | UK-focused. Democracy Pioneers: GBP 100K award for up to 10 innovations |
| **Wellcome Trust** | Health + collective intelligence | Up to GBP 30K (with NESTA) | Joint grants with NESTA for health-related collective intelligence |
| **Omidyar Network** | Civic tech, governance | $100K-$1M+ | Now operates through Luminate for civic tech |
| **Civic Innovation Fund** | Civic innovation globally | Applications open 2025-2026 | Newer fund, growing |
| **Joseph Rowntree Foundation** | Poverty, inequality, communities | Varies | UK-focused, funds research on community conditions |
| **Paul Hamlyn Foundation** | Social justice, arts, migration | GBP 10K-150K | UK-focused, interested in voice/participation |
| **Esmee Fairbairn Foundation** | Social change, environment, arts | GBP 30K-300K | One of UK's largest independent funders |
| **National Lottery Community Fund** | Community projects across UK | GBP 10K-500K+ | "Reaching Communities" programme relevant |

### Less Obvious But Relevant
- **Innovate UK** (UKRI): Smart Grants for innovative technology, up to GBP 500K. Beat's AI + civic application could qualify
- **Arts Council England**: If Beat is positioned as a creative/cultural tool for community storytelling
- **British Academy**: Small grants for social science research tools
- **Open Society Foundations**: Civic participation, democratic governance
- **Bloomberg Philanthropies**: City innovation programmes

### Grant Strategy for Beat
1. **Now (2026)**: Apply to NESTA Democracy Pioneers (GBP 10K, low effort), NESTA Collective Intelligence Grants (GBP 30K)
2. **Next Mozilla cohort**: Apply when next cohort opens (likely late 2026)
3. **Medium-term**: Luminate for scale funding once product-market fit demonstrated
4. **Ongoing**: Innovate UK Smart Grants for the AI/technology angle
5. **Use grants for R&D and community building, not operating costs**: Build toward government revenue being the sustainable base

### Critical Insight from Knight Foundation Research
"Few civic tech startups have developed repeatable and reliable revenue to cover their costs and grow their operations -- indeed, many startups in the field launch without an anticipated business model." Grants should bridge to revenue, not become the permanent model.

---

## 9. Social Enterprise Models

### Community Interest Company (CIC) -- Recommended for Beat

**What it is:**
- A UK company form introduced in 2005 specifically for social enterprises
- Can be limited by guarantee (no shares) or limited by shares
- Must satisfy the "community interest test" -- activities benefit the community
- Regulated by the CIC Regulator (part of Companies House)

**Key features:**
- **Asset lock**: Legally prevents assets (including profits) from being extracted for private benefit. This is compulsory and cannot be removed
- **Dividend cap**: If shares are issued, dividends are capped (currently 35% of distributable profits)
- **Community interest statement**: Must declare purpose at formation
- **Annual CIC Report**: Additional filing obligation (form CIC34) demonstrating ongoing community benefit

**Why CIC suits Beat:**
- Asset lock reassures government customers and grant funders that the tool won't be acquired and shut down or pivoted to purely commercial purposes
- Community interest test aligns with civic tech mission
- Can still generate revenue, pay competitive salaries, and retain profits for reinvestment
- Simpler than charity registration; more commercially flexible
- Growing rapidly: 31,500+ CICs registered in UK as of 2025, growing faster than other business forms
- Can receive grants, win contracts, issue shares to investors (with dividend cap)

**CIC Limited by Guarantee vs Shares:**
- **By guarantee** (no shareholders): Simpler, suited to grant-funded organisations. Members guarantee a small amount (e.g., GBP 1) if wound up. No equity investment possible
- **By shares**: Can raise equity investment. Investors accept the dividend cap and asset lock. Better if external investment is needed later

**Recommendation**: Start as CIC limited by guarantee. If equity investment is ever needed, convert to CIC limited by shares (this is possible)

### B Corp Certification

**What it is:**
- A certification (not a legal structure) from B Lab
- Assesses social and environmental performance
- Compatible with any UK company form (Ltd, CIC, etc.)

**Comparison with CIC:**
- B Corp is aspirational -- it raises standards but cannot override fiduciary duty to shareholders
- CIC is structural -- the asset lock is legally binding
- "Many B Corps are excellent businesses, but structurally they remain oriented toward private gain, not public benefit"
- A CIC can also become B Corp certified for additional credibility

**Recommendation**: CIC provides stronger structural protection. Consider B Corp certification later as a marketing/credibility tool, but it is not a substitute for the CIC structure

### Other Options

| Structure | Pros | Cons |
|-----------|------|------|
| **Charity** | Tax benefits, grant access | Very limited commercial activity, complex governance |
| **CIO** (Charitable Incorporated Organisation) | Charity benefits, limited liability | Same commercial restrictions as charity |
| **Co-operative** | Democratic governance, member ownership | Complex governance, may not suit software product |
| **Standard Ltd** | Maximum flexibility, easy investor access | No structural mission protection, less attractive to grant funders |

### The mySociety Model (Worth Emulating)
- mySociety is a registered charity that owns SocietyWorks, a commercial trading subsidiary
- The charity holds the mission; the subsidiary generates commercial revenue
- This is more complex but provides maximum grant access (charity) with full commercial flexibility (subsidiary)
- **Could be Beat's long-term structure**: CIC now, potentially evolving to charity + commercial subsidiary if scale demands it

---

## 10. Pricing Benchmarks

### What Councils Currently Pay for Engagement Platforms

| Platform | Estimated Annual Cost | What's Included |
|----------|----------------------|-----------------|
| **Go Vocal (CitizenLab)** | GBP 20,000-50,000 | Full engagement platform, surveys, idea boards, budgeting tools, dashboards, AI analysis |
| **Granicus EngagementHQ** (was Bang the Table) | GBP 15,000-40,000 | Community engagement hub, surveys, forums, mapping, Q&A. "High pricing may deter smaller municipalities" |
| **Citizen Space** (Delib) | GBP 8,000-25,000 | Consultation management, surveys, stakeholder management. Used by many UK councils and Scottish Government |
| **Commonplace** | GBP 10,000-30,000 | Place-based engagement, mapping, planning consultations |
| **FixMyStreet Pro** | GBP 15,000-62,000 | Issue reporting, council workflow integration. 31 UK authorities |
| **Consul** | Free (open source) | Participatory budgeting, debates, proposals. Self-hosted, requires technical capacity |

### Beat's Competitive Position

Beat is NOT a direct competitor to these platforms. They are primarily online engagement tools (surveys, idea boards, consultations). Beat is a field research tool. This means:

1. **Complementary, not competing**: Beat could be positioned alongside existing engagement platforms, not replacing them
2. **Different budget line**: Beat might sit in research/evidence/planning budgets rather than communications/engagement budgets
3. **Lower price point possible**: Since Beat doesn't require the infrastructure of a full engagement platform, pricing can be lower
4. **Novel category**: "AI-powered field research" doesn't have established pricing benchmarks, giving flexibility

### Recommended Pricing for Beat

| Tier | Target | Price | Justification |
|------|--------|-------|---------------|
| **Free** | Individuals, researchers, small NGOs, candidates | GBP 0 | Below procurement threshold. Builds adoption. Covered by Gemini free tier |
| **Professional** | Consultancies, larger NGOs, political parties | GBP 50-99/month (GBP 600-1,188/yr) | Below single-quote threshold. Credit card purchase, no procurement needed |
| **Team** | Council departments, housing associations | GBP 5,000-10,000/yr | Below most 3-quote thresholds. Department-level budget approval |
| **Council** | Full council deployment | GBP 15,000-25,000/yr | Below GBP 25K simplified procurement threshold for most councils |
| **Enterprise** | Multi-authority, combined authorities | GBP 30,000-50,000/yr | Full procurement but justified by scale |

### Pricing Strategy Notes
- **Stay below GBP 25K initially**: This avoids formal tendering in most councils and allows faster adoption
- **Land and expand**: Start with one department (planning, housing, neighbourhoods), then expand council-wide
- **Annual contracts with auto-renewal**: Standard in government SaaS
- **Include training and onboarding**: Government buyers expect this; it also builds stickiness
- **Volume discounts for multi-authority deals**: Combined authorities, county + district bundles

---

## Summary: Recommended Business Model for Beat

### Structure
**Community Interest Company (CIC)** limited by guarantee, with potential to convert to CIC limited by shares if investment is needed.

### Revenue Model
1. **Primary (70%+ at maturity)**: Government SaaS contracts (GBP 5K-25K/year per council)
2. **Secondary (15-20%)**: Professional subscriptions (GBP 50-99/month)
3. **Tertiary (10-15%)**: Grants for R&D, community building, and expansion into new areas

### Cost Structure
- **AI inference**: Negligible (<1% of revenue at any scale)
- **On-device transcription**: Zero marginal cost
- **Main costs**: Team salaries, hosting infrastructure, sales/marketing, support

### Sustainability Path
1. **Year 1**: Grant-funded development + free users building evidence of demand
2. **Year 2**: 5-10 paying councils (GBP 50K-150K revenue) + professional subscribers
3. **Year 3**: 20-30 councils (GBP 200K-500K revenue) + self-sustaining without grants
4. **Year 4+**: Expansion to other UK public bodies, potential international (English-speaking markets)

### Key Differentiators for Sustainability
- **On-device first**: Zero marginal cost for basic usage, strong privacy story
- **AI costs are trivially low**: Unlike other SaaS tools, scaling users doesn't significantly increase infrastructure costs
- **Complementary positioning**: Not competing with established engagement platforms
- **Below-threshold pricing**: Optimised for fast government procurement
- **CIC structure**: Mission-locked, attractive to grant funders and government buyers alike

---

## Sources

### Civic Tech Business Models
- [Knight Foundation: Scaling Civic Tech](https://knightfoundation.org/features/civictechbiz/)
- [Knight Foundation: Civic Tech Companies Struggle with Sustainable Business Models](https://knightfoundation.org/press/releases/new-report-civic-tech-companies-make-gains-struggle-with-sustainable-business-models/)
- [Luminate: Sustainability Opportunities for Civic Tech](https://luminategroup.com/posts/news/sustainability-the-opportunities-for-civic-tech)
- [mySociety Impact Report](https://research.mysociety.org/html/impact-report-2025/)
- [Decidim FOSDEM 2025: Building Sustainability](https://fosdem.org/2025/schedule/event/fosdem-2025-5552-building-sustainability-a-case-study-in-funding-diversification-for-decidim/)
- [Pol.is - Wikipedia](https://en.wikipedia.org/wiki/Pol.is)
- [Go Vocal Pricing Plans](https://www.govocal.com/plans)
- [Go Vocal: How Much Does a Citizen Platform Cost?](https://www.govocal.com/blog/how-much-does-a-citizen-platform-cost)

### UK Government Procurement
- [G-Cloud 15: Everything You Need to Know (Computer Weekly)](https://www.computerweekly.com/feature/UK-governments-G-Cloud-15-framework-Everything-you-need-to-know)
- [G-Cloud Buyers' Guide - GOV.UK](https://www.gov.uk/guidance/g-cloud-buyers-guide)
- [Hot Topics in 2026 for UK Public Sector Cloud Contracts](https://www.burges-salmon.com/articles/102lzhr/hot-topics-in-2026-for-uk-public-sector-cloud-contracts/)
- [LGA Councillor's Guide to Procurement 2025](https://www.local.gov.uk/publications/councillors-guide-procurement-2025-edition)
- [Using Community Engagement Platforms in Planning - GOV.UK](https://www.gov.uk/guidance/using-community-engagement-platforms-in-planning-consultations)

### Mozilla Foundation
- [Mozilla Foundation Incubator](https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/)
- [Democracy x AI Cohort 2026](https://www.mozillafoundation.org/en/what-we-do/grantmaking/incubator/democracy-ai-cohort/)
- [Mozilla: Funding the Future of Trustworthy Tech](https://www.mozillafoundation.org/en/blog/funding-the-future-of-trustworthy-tech/)
- [Mozilla: Financing an Open Internet](https://www.mozilla.org/en-US/foundation/annualreport/2024/article/financing-an-open-internet-mozillas-path-forward/)

### API Pricing and Transcription
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API Pricing Guide 2026 (MetaCTO)](https://www.metacto.com/blogs/the-true-cost-of-google-gemini-a-guide-to-api-pricing-and-integration)
- [Cheapest AI Transcription: Gemini Flash vs Whisper](https://www.arsturn.com/blog/cheapest-ai-transcription-models-is-gemini-flash-the-best)
- [Whisper vs Deepgram (Deepgram)](https://deepgram.com/learn/whisper-vs-deepgram)
- [Speech-to-Text API Pricing Breakdown 2025 (Deepgram)](https://deepgram.com/learn/speech-to-text-api-pricing-breakdown-2025)
- [Running Transcription Models on the Edge](https://www.ionio.ai/blog/running-transcription-models-on-the-edge-a-practical-guide-for-devices)
- [Whisper API Pricing: Self-Hosted vs Managed](https://brasstranscripts.com/blog/openai-whisper-api-pricing-2025-self-hosted-vs-managed)

### Grant Funding
- [Knight Emerging City Champions 2025](https://knightfoundation.org/press/releases/the-knight-emerging-city-champions-program-is-back-and-now-accepting-applications-for-2025/)
- [NESTA Democracy Pioneers](https://www.nesta.org.uk/project/democracy-pioneers/)
- [NESTA Collective Intelligence Grants](https://www.nesta.org.uk/project/collective-intelligence-grants/)
- [Civic Innovation Fund 2025-2026](https://www2.fundsforngos.org/democracy-good-governance/request-for-applications-civic-innovation-fund-2025-2026/)
- [Knight Foundation: $430M Invested in Civic Tech](https://knightfoundation.org/press/releases/report-more-430-million-invested-tech-organization/)

### Social Enterprise Structures
- [Community Interest Companies Guidance - GOV.UK](https://www.gov.uk/government/publications/community-interest-companies-how-to-form-a-cic/community-interest-companies-guidance-chapters)
- [Setting Up a Social Enterprise - GOV.UK](https://www.gov.uk/set-up-a-social-enterprise)
- [CIC Registration Growing (Social Enterprise UK)](https://www.socialenterprise.org.uk/news/community-interest-company-registration-growing-more-than-other-business-forms-latest-research-shows/)
- [Social Enterprises, Benefit Corporations and CICs: The UK Landscape (Springer)](https://link.springer.com/chapter/10.1007/978-3-031-14216-1_42)

### Data Ethics
- [Anonymizing Mobility Data for Civic Use Cases](https://blog.citydata.ai/mobility-data-anonymization-and-aggregation/)
- [Harvard Data-Smart City Solutions: Civic Data Use Cases](https://datasmart.hks.harvard.edu/how-can-data-and-analytics-be-used-to-enhance-city-operations-723)
