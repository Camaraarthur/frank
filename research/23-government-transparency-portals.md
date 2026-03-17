# Government Transparency Portals: Where Governing Bodies Publish Their Work

Research for Frank's transparency link feature -- linking users directly to official pages where governing bodies publish meeting minutes, decisions, budgets, and voting records.

---

## 1. UK Councils

### 1.1 ModernGov (by Civica) -- The Dominant Platform

ModernGov is used by **350+ UK public sector organisations** including ~195 councils. It publishes:
- Committee meeting agendas and minutes
- Officer reports and decision records
- Councillor profiles and attendance
- Forward plans and calendar of meetings
- Webcasting links (some councils)

#### URL Pattern Variants

There are **three subdomain patterns** in use:

| Pattern | Example | Used by |
|---------|---------|---------|
| `{council}.moderngov.co.uk` | `hackney.moderngov.co.uk` | Most councils |
| `democracy.{council}.gov.uk` | `democracy.towerhamlets.gov.uk` | Many London/large councils |
| `moderngov.{council}.gov.uk` | `moderngov.lambeth.gov.uk` | Some councils |

#### Verified UK Council URLs

**London Boroughs:**

| Council | Democracy URL | Pattern |
|---------|--------------|---------|
| Tower Hamlets | `democracy.towerhamlets.gov.uk` | democracy.{council} |
| Tower Hamlets (alt) | `towerhamlets.moderngov.co.uk` | {council}.moderngov |
| Newham | `mgov.newham.gov.uk` | custom |
| Hackney | `hackney.moderngov.co.uk` | {council}.moderngov |
| Southwark | `moderngov.southwark.gov.uk` | moderngov.{council} |
| Lambeth | `moderngov.lambeth.gov.uk` | moderngov.{council} |
| Islington | `islington.moderngov.co.uk` | {council}.moderngov |
| Camden | `democracy.camden.gov.uk` | democracy.{council} |
| Westminster | `westminster.moderngov.co.uk` | {council}.moderngov |
| Barnet | `barnet.moderngov.co.uk` | {council}.moderngov |
| City of London | `democracy.cityoflondon.gov.uk` | democracy.{council} |

**Major UK Cities:**

| Council | Democracy URL | Pattern |
|---------|--------------|---------|
| Manchester | `democracy.manchester.gov.uk` | democracy.{council} |
| Sheffield | `democracy.sheffield.gov.uk` | democracy.{council} |
| Sheffield (alt) | `sheffieldcc.moderngov.co.uk` | {council}.moderngov |
| Bristol | `democracy.bristol.gov.uk` | democracy.{council} |
| Leeds | `democracy.leeds.gov.uk` | democracy.{council} |
| Edinburgh | `democracy.edinburgh.gov.uk` | democracy.{council} |
| Doncaster | `doncaster.moderngov.co.uk` | {council}.moderngov |
| Buckinghamshire | `buckinghamshire.moderngov.co.uk` | {council}.moderngov |
| Calderdale | `calderdale.moderngov.co.uk` | {council}.moderngov |
| Wolverhampton | `wolverhampton.moderngov.co.uk` | {council}.moderngov |
| Milton Keynes | `milton-keynes.moderngov.co.uk` | {council}.moderngov |
| Hastings | `hastings.moderngov.co.uk` | {council}.moderngov |
| Dorset | `moderngov.dorsetcouncil.gov.uk` | moderngov.{council} |
| West Northants | `westnorthants.moderngov.co.uk` | {council}.moderngov |
| Mid Sussex | `midsussex.moderngov.co.uk` | {council}.moderngov |
| Wokingham | `wokingham.moderngov.co.uk` | {council}.moderngov |
| Northumberland | `northumberland.moderngov.co.uk` | {council}.moderngov |

**Scotland:**

| Council | Democracy URL |
|---------|--------------|
| Edinburgh | `democracy.edinburgh.gov.uk` |
| Midlothian | `midlothian.cmis.uk.com/live` |
| East Dunbartonshire | via `eastdunbarton.gov.uk` |

**Exceptions (non-ModernGov):**

| Council | Platform | URL |
|---------|----------|-----|
| Birmingham | CMIS | `birmingham.cmis.uk.com` or via `birmingham.gov.uk` |
| Liverpool | Custom | `liverpool.gov.uk/council/councillors-and-committees/meetings-agendas-and-minutes/` |
| Midlothian | CMIS | `midlothian.cmis.uk.com/live/meetings.aspx` |

#### Key ModernGov Page Patterns

Once you have the base URL (e.g. `hackney.moderngov.co.uk`), standard pages are:

```
/                                    -- Homepage
/mgListCommittees.aspx               -- All committees
/ieDocHome.aspx                      -- Browse meetings by year
/ieListMeetings.aspx?CommitteeId={id} -- Meetings for a committee
/ieListDocuments.aspx?MId={id}       -- Agenda/minutes for a specific meeting
/mgMemberIndex.aspx                  -- All councillors
/mgCalendarMonthView.aspx            -- Monthly calendar
/ieDocSearch.aspx                    -- Search decisions/documents
/mgFindMember.aspx                   -- Find a councillor
```

### 1.2 CMIS (Committee Management Information System)

An older system, largely replaced by ModernGov but still used by some councils (notably Birmingham, Midlothian). URL pattern: `{council}.cmis.uk.com/live/`

### 1.3 UK Council Budget & Spending Transparency

Under the **Local Government Transparency Code 2015**, all councils must publish:
- All spending transactions over GBP 500
- Government Procurement Card spending
- Contracts over GBP 5,000
- Pay ratios and senior salaries

Typically published at: `{council-website}/transparency` or `{council-website}/open-data`

No standard URL pattern -- each council chooses where to host this data.

### 1.4 FOI Disclosure Logs

Many councils publish FOI disclosure logs, but there is no standard URL. Examples:
- London GLA: `london.gov.uk/who-we-are/governance-and-spending/sharing-our-information/foi-disclosure-log`
- Edinburgh: `edinburgh.gov.uk/homepage/10467/freedom-of-information-foi-disclosure-log`
- Harrow: `harrow.gov.uk/disclosurelog`
- GOV.UK central: `gov.uk/government/collections/disclosure-log`

### 1.5 UK MPs -- Parliament & Accountability

#### Parliament.uk Member Profiles
- **URL pattern**: `https://members.parliament.uk/member/{member_id}/{section}`
- **Sections**: `contact`, `voting`, `career`, `contributions`, `registeredinterests`
- **Find your MP**: `https://members.parliament.uk/FindYourMP`
- **All MPs**: `https://members.parliament.uk/members/commons`
- **Members API**: `https://members-api.parliament.uk/index.html`

#### TheyWorkForYou (mySociety)
- **MP URL**: `https://www.theyworkforyou.com/mp/{slug}/{constituency}`
  - e.g. `/mp/hywel_francis/aberavon`
- **API**: `https://www.theyworkforyou.com/api/` (from GBP 20/month, free for non-commercial)
  - `getMP` -- fetch a particular MP
  - `getMPs` -- search MPs by name
- **API URL format**: `https://www.theyworkforyou.com/api/{function}?key={key}&output={format}`

#### PublicWhip (Voting Records)
- **By constituency**: `https://www.publicwhip.org.uk/mp.php?house=commons&mpc={Constituency+Name}`
- **By ID**: `https://www.publicwhip.org.uk/mp.php?id=uk.org.publicwhip/member/{id}`
- **Vote map**: `https://www.publicwhip.org.uk/mpsee.php`

---

## 2. US Federal, State & Local

### 2.1 US City Councils -- Legistar (Granicus)

Legistar is used by **70% of the largest US cities and counties**. It is owned by Granicus.

#### URL Pattern
- **Website**: `https://{city}.legistar.com/`
- **API**: `https://webapi.legistar.com/v1/{client}/` (OData v3)

#### Verified Cities on Legistar

| City/County | Legistar URL |
|-------------|-------------|
| San Francisco | `sfgov.legistar.com` |
| New York City | `legistar.council.nyc.gov` |
| Chicago | `chicago.legistar.com` |
| Philadelphia | `phila.legistar.com` |
| Long Beach | `longbeach.legistar.com` |
| Oakland | `oakland.legistar.com` |
| San Jose | `sanjose.legistar.com` |
| Baltimore | `baltimore.legistar.com` (typical) |
| Seattle | `seattle.legistar.com` (typical) |

#### Legistar Key Pages
```
/                                    -- Calendar/home
/Legislation.aspx                    -- Legislation search
/MainBody.aspx                       -- Main body info
/Departments.aspx                    -- Committees
/MeetingDetail.aspx?ID={id}          -- Specific meeting
```

#### Legistar Web API
- Base: `https://webapi.legistar.com/v1/{client}/`
- Endpoints: `/bodies`, `/events`, `/matters`, `/persons`, `/votes`
- OData paging: `?$top=10&$skip=0`
- Some clients require API tokens; contact the jurisdiction for token policy.

#### NYC Council API
- NYC released their own Legistar API: `https://council.nyc.gov/legislation/api/`

#### Granicus (Video/Streaming)
Some cities also use Granicus for video archiving:
- `{city}.granicus.com/ViewPublisher.php?view_id={id}`

#### Other US Platforms
- **CivicClerk**: Used by smaller municipalities (e.g., Bristol, CT)
- **CivicEngage**: Used by smaller towns
- **Municode/MunicodeMeetings**: Growing platform for smaller cities

### 2.2 US Federal -- Congress

#### Congress.gov Member Profiles
- **URL pattern**: `https://www.congress.gov/member/{firstname-lastname}/{bioguide_id}`
  - e.g. `congress.gov/member/lauren-underwood/U000040`
- **All members**: `https://www.congress.gov/members`
- **Find your member**: `https://www.congress.gov/members/find-your-member`
- **BioGuide Directory**: `https://bioguide.congress.gov/`

#### ProPublica Congress API
- `https://projects.propublica.org/api-docs/congress-api/`
- Members, votes, bills, statements

#### GovTrack.us
- URL: `https://www.govtrack.us/congress/members/{id}`
- Tracks voting records, bills, cosponsorship

#### VoteSmart
- `https://justfacts.votesmart.org/`
- API: `https://www.votesmart.org/votesmart-api`
- Biographical info, voting records, positions, ratings

### 2.3 US State Legislatures

#### California
- **Bill search**: `https://leginfo.legislature.ca.gov/faces/billSearchClient.xhtml`
- **Find your rep**: `https://findyourrep.legislature.ca.gov/`
- **Main site**: `https://leginfo.legislature.ca.gov/`

#### Open States (All 50 States + DC + Puerto Rico)
- **API root**: `https://v3.openstates.org/`
- **People data**: `https://github.com/openstates/people` (YAML files)
- Requires API key (free tier available)
- Standardised data across all state legislatures
- Now maintained by Plural Policy

#### LegiScan (All 50 States)
- **URL**: `https://legiscan.com/{state_code}`
  - e.g. `legiscan.com/CA` for California
- Tracks bills, votes, sponsors across all states

---

## 3. International Democracies

### 3.1 European Parliament

| Resource | URL |
|----------|-----|
| MEP profiles | `https://www.europarl.europa.eu/meps/en/{id}` |
| All MEPs | `https://www.europarl.europa.eu/meps/en/full-list` |
| Advanced search | `https://www.europarl.europa.eu/meps/en/search/advanced` |
| Legislative Observatory | `https://oeil.secure.europarl.europa.eu/oeil/home/home.do` |
| Plenary minutes | `https://www.europarl.europa.eu/plenary/en/minutes.html` |

MEP profile URL pattern: `https://www.europarl.europa.eu/meps/en/{numeric_id}`

### 3.2 Canada

| Resource | URL |
|----------|-----|
| MP profile | `https://www.ourcommons.ca/members/en/{lastname-firstname}({id})` |
| All MPs | `https://www.ourcommons.ca/members/en/search` |
| Open data | `https://www.ourcommons.ca/en/open-data` |
| Open Parliament (civic) | `https://openparliament.ca/` |
| Ontario Legislature | `https://www.ola.org/` |

MP profile URL pattern: `https://www.ourcommons.ca/members/en/{lastname-firstname}({numeric_id})`
- e.g. `/members/en/ziad-aboultaif(89156)`

### 3.3 Australia

| Resource | URL |
|----------|-----|
| Parliamentarian profile | `https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID={id}` |
| All members | `https://www.aph.gov.au/Senators_and_Members` |
| ParlInfo search | `https://parlinfo.aph.gov.au/` |
| OpenAustralia (civic) | `https://www.openaustralia.org.au/` |

Parliamentarian profile URL pattern: `https://www.aph.gov.au/Senators_and_Members/Parliamentarian?MPID={numeric_id}`

### 3.4 Germany

| Resource | URL |
|----------|-----|
| All MdBs | `https://www.bundestag.de/abgeordnete` |
| MdB biographies | `https://www.bundestag.de/abgeordnete/biografien` |
| MdB profile | `https://www.bundestag.de/abgeordnete/biografien/{Letter}/{lastname}_{firstname}-{id}` |
| Abgeordnetenwatch (civic) | `https://www.abgeordnetenwatch.de/profile/{firstname-lastname}` |
| Open Data | `https://www.bundestag.de/parlament/plenum/abstimmung/` |

MdB profile URL pattern: `https://www.bundestag.de/abgeordnete/biografien/{FirstLetter}/{lastname}_{firstname}-{numeric_id}`
- e.g. `/abgeordnete/biografien/B/buedenbender_benedikt-1043872`

Abgeordnetenwatch (civic watchdog) pattern: `https://www.abgeordnetenwatch.de/profile/{firstname-lastname}`
- e.g. `/profile/thorsten-frei`

### 3.5 France

| Resource | URL |
|----------|-----|
| Deputy profile | `https://www2.assemblee-nationale.fr/deputes/fiche/OMC_PA{id}` |
| All deputies | `https://www2.assemblee-nationale.fr/deputes/liste/alphabetique` |
| New site | `https://www.assemblee-nationale.fr/dyn/vos-deputes` |
| Open data | `https://data.assemblee-nationale.fr/acteurs/deputes-en-exercice` |
| NosDéputes.fr (civic) | `https://www.nosdeputes.fr/{slug}` |

Deputy profile URL pattern: `https://www2.assemblee-nationale.fr/deputes/fiche/OMC_PA{numeric_id}`
- e.g. `/deputes/fiche/OMC_PA267766`

NosDéputes.fr (civic watchdog, open data, ODbL licensed):
- Profile: `https://www.nosdeputes.fr/{prenom-nom}`
- Votes: `https://www.nosdeputes.fr/{prenom-nom}/votes`
- API available in XML, JSON, CSV

### 3.6 Brazil

| Resource | URL |
|----------|-----|
| Deputy profile | `https://www.camara.leg.br/deputados/{id}` |
| Deputy biography | `https://www.camara.leg.br/deputados/{id}/biografia` |
| All deputies | `https://www.camara.leg.br/deputados/quem-sao` |
| Transparency portal | `https://www.camara.leg.br/transparencia/` |
| Open data API | `https://dadosabertos.camara.leg.br/` |
| Senate | `https://www25.senado.leg.br/web/senadores` |

Deputy profile URL pattern: `https://www.camara.leg.br/deputados/{numeric_id}`
- e.g. `/deputados/178933`

### 3.7 Summary Table -- International Parliament Portals

| Country | Parliament | Member Profile URL Pattern | Civic Watchdog |
|---------|-----------|---------------------------|----------------|
| UK | Parliament | `members.parliament.uk/member/{id}/contact` | TheyWorkForYou, PublicWhip |
| US | Congress | `congress.gov/member/{name}/{bioguide}` | GovTrack, ProPublica, VoteSmart |
| EU | European Parliament | `europarl.europa.eu/meps/en/{id}` | VoteWatch.eu |
| Canada | House of Commons | `ourcommons.ca/members/en/{name}({id})` | OpenParliament.ca |
| Australia | Parliament | `aph.gov.au/Senators_and_Members/Parliamentarian?MPID={id}` | OpenAustralia.org.au |
| Germany | Bundestag | `bundestag.de/abgeordnete/biografien/{L}/{name}-{id}` | Abgeordnetenwatch.de |
| France | Assemblee nationale | `www2.assemblee-nationale.fr/deputes/fiche/OMC_PA{id}` | NosDéputes.fr |
| Brazil | Camara | `camara.leg.br/deputados/{id}` | -- |

---

## 4. Recommended Approach for Frank

### 4.1 Strategy: Known Patterns + Fallback Search

Frank should use a **two-tier approach**:

1. **Tier 1: Known URL patterns** -- For recognised governing bodies, construct the URL directly
2. **Tier 2: Brave Search fallback** -- For unknown bodies, run a search query to find the transparency portal

### 4.2 Tier 1: URL Construction Rules

#### UK Councils
Given a council name (e.g. "Hackney"), try these URL patterns in order:
1. `https://{council-slug}.moderngov.co.uk/`
2. `https://democracy.{council-slug}.gov.uk/`
3. `https://moderngov.{council-slug}.gov.uk/`

Where `{council-slug}` is the council name lowercased, spaces removed (e.g. "towerhamlets", "miltonkeynes").

For the committee list specifically: append `/mgListCommittees.aspx`

**Store a lookup table** for the ~30 most common exceptions (Newham = mgov.newham.gov.uk, Birmingham = CMIS, Liverpool = custom, etc.).

#### UK MPs
Given an MP name or constituency:
- Parliament.uk: Use the Members API to get member_id, then `https://members.parliament.uk/member/{id}/contact`
- TheyWorkForYou: `https://www.theyworkforyou.com/mp/{slug}/{constituency}`

#### US City Councils
Given a city name:
- Try `https://{city-slug}.legistar.com/`
- For NYC specifically: `https://legistar.council.nyc.gov/`

#### US Federal
Given a Congress member's name:
- `https://www.congress.gov/member/{firstname-lastname}/{bioguide_id}`
- Use the Congress.gov Members API or ProPublica API for lookup

#### International
Use the patterns from Section 3 above, with numeric ID lookups from the respective APIs.

### 4.3 Tier 2: Brave Search Fallback Query Templates

When the URL pattern is unknown, use these search queries:

```
UK council:       "{council name} council meeting minutes agendas moderngov"
UK council (alt):  "{council name} council democracy committee meetings"
US city council:  "{city name} city council meeting minutes legistar agendas"
US state leg:     "{state name} state legislature bills voting records"
Any parliament:   "{country name} parliament member profile transparency"
Any body:         "{body name} meeting minutes decisions transparency portal"
```

### 4.4 What Frank Should Display Per Governing Body

| Data Point | Source |
|------------|--------|
| Official decisions/minutes page | ModernGov URL / Legistar URL / parliament portal |
| Representative's profile & voting record | TheyWorkForYou / Congress.gov / parliament member page |
| Most recent published meeting date | Scrape from ModernGov `/ieDocHome.aspx` or Legistar calendar |
| Transparency score | Whether body publishes: (1) minutes, (2) voting records, (3) budgets, (4) FOI log |

### 4.5 APIs Available for Programmatic Access

| Source | API | Auth | Coverage |
|--------|-----|------|----------|
| UK Parliament Members API | `members-api.parliament.uk` | Free, no key | All UK MPs/Lords |
| TheyWorkForYou | `theyworkforyou.com/api/` | API key (free for non-commercial) | UK MPs, debates, votes |
| Legistar Web API | `webapi.legistar.com/v1/{client}/` | Some require token | US cities/counties |
| NYC Council API | `council.nyc.gov/legislation/api/` | Free | NYC |
| Congress.gov | `api.congress.gov/` | API key | US federal |
| ProPublica Congress | `api.propublica.org/congress/` | API key (free) | US federal |
| Open States | `v3.openstates.org/` | API key (free tier) | All US state legislatures |
| Brazil Camara | `dadosabertos.camara.leg.br/` | Free | Brazilian deputies |
| France AN Open Data | `data.assemblee-nationale.fr/` | Free | French deputies |
| NosDéputes.fr | `nosdeputes.fr/{slug}/{format}` | Free (ODbL) | French deputies |
| Canada Open Data | `ourcommons.ca/en/open-data` | Free | Canadian MPs |
| EU Parliament | `data.europarl.europa.eu/` | Free | MEPs |

### 4.6 Data Model Suggestion

```typescript
interface TransparencyPortal {
  // The governing body this portal belongs to
  bodyId: string;

  // Primary link to minutes/decisions page
  minutesUrl: string | null;

  // Platform used (for URL pattern inference)
  platform: 'moderngov' | 'cmis' | 'legistar' | 'granicus' | 'custom' | 'national_parliament';

  // Representative profile URL (if applicable)
  representativeProfileUrl: string | null;

  // Voting record URL
  votingRecordUrl: string | null;

  // Transparency score (0-4): minutes + votes + budgets + FOI
  transparencyScore: number;

  // Last verified date
  lastVerified: string; // ISO date

  // How this URL was found
  source: 'known_pattern' | 'search' | 'manual';
}
```

---

## 5. Key Findings & Notes

1. **ModernGov dominates UK local government** (~195 councils). The URL patterns are predictable but have 3 variants. A lookup table of 30-40 exceptions covers edge cases.

2. **Legistar dominates US local government** (~70% of large cities). URL pattern is highly consistent: `{city}.legistar.com`.

3. **National parliaments all have member profile pages** with numeric IDs. The URL patterns are stable and well-documented.

4. **Civic watchdog sites** (TheyWorkForYou, NosDéputes, Abgeordnetenwatch, OpenAustralia) often have better APIs and cleaner data than official sites.

5. **FOI disclosure logs have no standard URL** -- best found via search.

6. **Budget/spending data** is required by law in the UK (Transparency Code 2015) but published at non-standard URLs.

7. **ModernGov's `.aspx` page structure** is consistent across all councils that use it, making scraping/linking predictable once the base URL is known.
