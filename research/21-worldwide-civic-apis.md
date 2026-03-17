# Worldwide Civic Data APIs Research

*Deep research for Frank/Beat - "Who governs you" for any location on Earth*
*Last updated: 2026-03-17*

---

## Coverage Summary Table

| Country/Region | Representatives | Demographics | Boundaries | Policies | Free? |
|---|---|---|---|---|---|
| **UK** | Parliament API, TWFY | ONS Census, IMD | postcodes.io, MapIt | TheyWorkForYou | Mostly (TWFY paid) |
| **US** | Google Civic Info API | Census ACS 5yr | Census TIGER, FCC FIPS | Congress.gov | Yes (API key) |
| **Canada** | Represent API (OpenNorth) | StatCan Census | Represent boundaries | OpenParliament.ca | Yes |
| **Australia** | OpenAustralia API | ABS Census APIs | ABS geo | OpenAustralia | Yes (API key) |
| **France** | data.assemblee-nationale.fr | INSEE | IGN admin | Nosdeputes.fr | Yes |
| **Germany** | abgeordnetenwatch.de API | Destatis | BKG boundaries | abgeordnetenwatch | Yes (CC0) |
| **Italy** | dati.camera.it (SPARQL) | ISTAT | ISTAT geo | Camera SPARQL | Yes (CC BY-SA) |
| **Ireland** | Oireachtas API | CSO Census | OSi boundaries | Oireachtas API | Yes |
| **Netherlands** | Tweede Kamer OData | CBS StatLine | PDOK boundaries | Tweede Kamer OData | Yes |
| **Sweden** | Riksdag Open Data | SCB | Lantmateriet | Riksdag API | Yes |
| **Spain** | congreso.es (limited) | INE | IGN CartoCiudad | Limited | Partial |
| **Brazil** | Camara API (REST) | IBGE Census | IBGE geo | Camara API | Yes |
| **India** | No official API | Census India (downloads) | Survey of India | ECI (scraping) | Partial |
| **Japan** | Diet Library API | e-Stat API | GSI boundaries | Diet Library | Yes |
| **South Korea** | data.go.kr APIs | KOSIS | NGII | Assembly API | Yes (key) |
| **New Zealand** | parliament.nz (no API) | Stats NZ | LINZ | Limited | Partial |
| **Israel** | Knesset OData API | CBS Israel | Survey of Israel | Knesset API | Yes |
| **Taiwan** | ly.govapi.tw | DGBAS | NLSC | Legislative Yuan | Yes |
| **South Africa** | No official API | Stats SA | Municipal Demarcation | Limited | Partial |
| **EU (supranational)** | EP Open Data Portal | Eurostat (NUTS) | NUTS boundaries | EUR-Lex | Yes |
| **Global (Wikidata)** | SPARQL for all countries | Limited | Via linked data | Limited | Yes |
| **Global (World Bank)** | No | 16,000 indicators | No | WGI governance | Yes |
| **Global (UN Data)** | No | Demographics | No | SDG indicators | Yes |
| **Global (OSM/Nominatim)** | No | No | Admin boundaries worldwide | No | Yes |
| **Global (GeoNames)** | No | No | Admin divisions | No | Yes (key) |
| **Global (GADM)** | No | No | All countries, all levels | No | Academic only |

---

## 1. Global / Multi-Country APIs

### 1.1 Wikidata SPARQL Query Service (CRITICAL - Primary global representatives source)

- **URL**: `https://query.wikidata.org/sparql`
- **What**: Structured data on every notable politician worldwide. Contains elected officials with their constituencies, parties, positions held, start/end dates.
- **Coverage**: 259+ countries, 663K+ politicians (via EveryPolitician contributions)
- **Key Properties**:
  - `P39` = position held (e.g., member of parliament)
  - `P768` = electoral district / constituency
  - `P102` = party membership
  - `P580/P582` = start/end dates
  - `P17` = country
  - `P18` = image
- **Free**: Yes, completely free, no key needed
- **Rate Limit**: ~1 request/second for bots, generous for interactive use
- **Format**: JSON, XML, CSV, TSV
- **Example SPARQL - Get all current UK MPs**:
```sparql
SELECT ?person ?personLabel ?partyLabel ?districtLabel WHERE {
  ?person p:P39 ?statement.
  ?statement ps:P39 wd:Q16707842.  # member of UK Parliament
  ?statement pq:P580 ?start.
  FILTER NOT EXISTS { ?statement pq:P582 ?end }
  OPTIONAL { ?person wdt:P102 ?party }
  OPTIONAL { ?statement pq:P768 ?district }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```
- **Example - Get all current legislators for any country** (substitute Q country code):
```sparql
SELECT ?person ?personLabel ?positionLabel ?districtLabel WHERE {
  ?person p:P39 ?stmt.
  ?stmt ps:P39 ?position.
  ?position wdt:P279* wd:Q4175034.  # subclass of "legislator"
  ?stmt pq:P580 ?start.
  FILTER NOT EXISTS { ?stmt pq:P582 ?end }
  ?person wdt:P27 wd:Q145.  # country = UK (change as needed)
  OPTIONAL { ?stmt pq:P768 ?district }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
}
```
- **Reliability**: Excellent. Community-maintained, very active. Some gaps in local/municipal officials for smaller countries.
- **FRANK STRATEGY**: This is the universal fallback. For ANY country, Wikidata can return national legislators. Quality varies by country but is excellent for democracies.

### 1.2 EveryPolitician (Wikidata-linked)

- **URL**: `https://everypolitician.org/`
- **What**: Global database of political office-holders: 663,370 politicians across 259 countries/territories, 174,974 positions
- **Maintained by**: Community volunteers, linked to Wikidata
- **Data**: Rulers, lawmakers, judges - biographical data, party, constituency
- **Format**: Popolo JSON standard, downloadable
- **Free**: Yes
- **Note**: Data flows bidirectionally with Wikidata. Use Wikidata SPARQL as the primary query interface; EveryPolitician as a validation/enrichment source.
- **Reliability**: Active community project. Coverage best for national legislatures.

### 1.3 World Bank Indicators API (Primary global demographics)

- **URL**: `https://api.worldbank.org/v2/`
- **What**: ~16,000 time series indicators across 45+ databases, 50+ years of data
- **Coverage**: All World Bank member countries (189+)
- **Free**: Yes, no API key needed (authentication retired)
- **Format**: JSON, XML, JSON-stat, CSV, Excel
- **Key Indicators for Frank**:
  - `SP.POP.TOTL` - Total population
  - `SP.URB.TOTL.IN.ZS` - Urban population %
  - `NY.GDP.PCAP.CD` - GDP per capita
  - `SE.ADT.LITR.ZS` - Literacy rate
  - `SH.STA.MMRT` - Maternal mortality
  - `CC.EST` - Control of Corruption (WGI)
  - `VA.EST` - Voice and Accountability (WGI)
  - `GE.EST` - Government Effectiveness (WGI)
- **Example Calls**:
  - Population for Brazil: `https://api.worldbank.org/v2/country/br/indicator/SP.POP.TOTL?format=json&date=2023`
  - GDP per capita, multiple countries: `https://api.worldbank.org/v2/country/gbr;fra;deu/indicator/NY.GDP.PCAP.CD?format=json&mrv=1`
  - Governance indicator: `https://api.worldbank.org/v2/country/all/indicator/VA.EST?format=json&mrv=1`
- **Geographic granularity**: Country-level only (no subnational)
- **Reliability**: Excellent. Gold standard for international development data. Updated regularly.
- **FRANK STRATEGY**: Universal demographics + governance quality indicators for every country. Combine with national census APIs for subnational granularity.

### 1.4 UN Data API

- **URL**: `https://data.un.org/ws/rest/`
- **What**: REST and SOAP access to UN statistical databases via SDMX protocol
- **Coverage**: Global, all UN member states
- **Free**: Yes (Terms of Use apply)
- **Format**: XML, JSON, CSV
- **Example**: `http://data.un.org/ws/rest/dataflow/` (list all available dataflows)
- **Granularity**: Country-level, some subnational
- **Reliability**: Good but complex SDMX interface. Not all datamarts have API access.

### 1.5 GeoNames API (Global admin divisions)

- **URL**: `https://api.geonames.org/`
- **What**: Geographic database with 12M+ place names, admin hierarchies, postal codes
- **Coverage**: Worldwide
- **Free**: Yes (requires free username registration)
- **Rate Limit**: Free tier has limits (30km radius, 500 maxRows); premium available
- **Key Endpoints for Frank**:
  - `countrySubdivision` - Get admin region from lat/lng: `api.geonames.org/countrySubdivision?lat=47.03&lng=10.2&username=YOUR_USER`
  - `hierarchy` - Get full admin hierarchy for a place
  - `children` - Get sub-divisions of an area
  - `extendedFindNearby` - Combined reverse geocode with hierarchy
  - `countryInfo` - Capital, population, area, bbox for all countries
- **Reliability**: Very good. Long-established service. Some postal code data limited (Canada, Ireland).
- **FRANK STRATEGY**: Use for admin division identification from coordinates. Maps lat/lng -> country -> region -> municipality hierarchy. Combine with Nominatim for more detail.

### 1.6 OpenStreetMap Nominatim (Global reverse geocoding + admin boundaries)

- **URL**: `https://nominatim.openstreetmap.org/`
- **What**: Reverse geocoding with full admin boundary hierarchy
- **Coverage**: Worldwide
- **Free**: Yes (strict usage policy: max 1 req/sec, no bulk, must attribute)
- **Self-hosting**: Recommended for production use (open source)
- **Key Endpoints**:
  - `/reverse?format=jsonv2&lat=51.5074&lon=-0.1278&zoom=10&addressdetails=1`
  - `/search?q=Berlin&format=json&addressdetails=1`
  - `/lookup?osm_ids=R62422&format=json` (by OSM relation ID)
- **Admin Levels** (standardized across countries):
  - Level 2: Country
  - Level 4: State/Region (US states, French regions, German Lander)
  - Level 6: County/Department
  - Level 8: Municipality/Commune
  - Level 9-10: Sub-municipal (wards, arrondissements)
- **Reliability**: Excellent for boundaries. Community-maintained, very comprehensive.
- **FRANK STRATEGY**: Primary boundary identification. Given lat/lng, get full admin hierarchy. Then use country-specific APIs to look up representatives for those admin areas.

### 1.7 OpenStreetMap Overpass API (Admin boundary geometries)

- **URL**: `https://overpass-api.de/api/interpreter`
- **What**: Query OSM data including admin boundary polygons
- **Free**: Yes, no key needed
- **Rate Limit**: Fair use (don't hammer it)
- **Example** - Get admin boundaries containing a point:
```
[out:json];
is_in(51.5074,-0.1278)->.a;
area.a["boundary"="administrative"];
out tags;
```
- **FRANK STRATEGY**: Use to fetch actual boundary GeoJSON for map display. Overpass can return all admin areas containing a lat/lng point.

### 1.8 GADM (Global Administrative Areas Database)

- **URL**: `https://gadm.org/`
- **What**: Boundary GeoJSON/Shapefile for every country, multiple admin levels (400,276 areas)
- **Coverage**: All countries worldwide
- **Format**: GeoJSON, Shapefile, GeoPackage, KMZ, R data
- **Free**: Academic/non-commercial only. **Commercial use requires permission.**
- **Granularity**: Up to 5 admin levels depending on country
- **No API**: Download only (by country or worldwide)
- **FRANK STRATEGY**: Useful as a static boundary dataset for offline use or as a fallback. License is restrictive for commercial use - prefer OSM/Overpass for production.

### 1.9 Humanitarian Data Exchange (HDX) HAPI

- **URL**: `https://hapi.humdata.org/`
- **What**: UN OCHA humanitarian data catalog - 20,510 datasets across 254 locations
- **Coverage**: Global, emphasis on crisis/developing regions
- **Free**: Yes (CC BY 4.0)
- **Data**: Admin boundaries, population, demographics, crisis data
- **FRANK STRATEGY**: Good supplementary source for developing countries where official census APIs are weak.

---

## 2. United Kingdom (DEEP - already implemented)

### Already integrated:
- **postcodes.io** - Postcode lookup, constituency mapping (free, no key)
- **Parliament UK API** - MPs, Lords, constituencies, votes (free, no key)
- **ONS Census** - Demographics by ward/LSOA (free, no key)
- **IMD Deprivation** - Index of Multiple Deprivation (free, no key)

### Additional UK sources:
- **TheyWorkForYou API** (`theyworkforyou.com/api`) - MP lookup by postcode, voting records, speeches. Covers UK Parliament, Scottish Parliament, Welsh Senedd, NI Assembly. Paid plans from GBP 20/month, free for non-profits.
- **MapIt UK** (`mapit.mysociety.org`) - Admin boundaries by postcode/lat-lng. GBP 23/month, free for non-profit low-volume.
- **WriteToThem** (mySociety) - Representative contact by postcode.

---

## 3. United States (GOOD - partially implemented)

### Already integrated:
- **Google Civic Information API** - Representatives by address (free, API key)
- **US Census Bureau ACS** - Demographics (free, API key recommended)
- **FCC FIPS geocoding**

### Key API Details:

**Google Civic Information API**:
- Endpoint: `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=ADDRESS&key=KEY`
- Returns: All levels of government - federal, state, county, city officials
- Coverage: **US only** (despite being "Google")
- Also: `voterinfo` endpoint for election/polling data
- Free quota: 25,000 requests/day default

**US Census ACS 5-Year API**:
- Endpoint: `https://api.census.gov/data/2022/acs/acs5`
- Example: `?get=B01001_001E,NAME&for=county:*&in=state:06` (population by county in California)
- Granularity: State, county, tract, block group
- Variables: Thousands (population, income, education, housing, ethnicity, etc.)
- Free: Yes, API key recommended but not required for low volume

### Additional US sources:
- **Congress.gov API** - Bills, members, committees (free, API key)
- **ProPublica Congress API** - Enhanced congressional data (free, API key)
- **OpenSecrets API** - Campaign finance data (free, API key)

---

## 4. Canada (EXCELLENT - OpenNorth Represent is a gem)

### 4.1 Open North Represent API (CRITICAL)

- **URL**: `https://represent.opennorth.ca`
- **What**: Elected officials AND electoral boundaries for ALL levels of Canadian government
- **Coverage**: Federal, provincial, AND municipal - House of Commons, provincial legislatures, city councils
- **Free**: Yes, 60 requests/minute (86,400/day)
- **Key Endpoints**:
  - Representatives by lat/lng: `GET /representatives/?point=45.524,-73.596`
  - Representatives by postal code: `GET /postcodes/L5G4L3/`
  - By chamber: `GET /representatives/house-of-commons/`
  - Filter by name: `GET /representatives/?last_name=Trudeau`
  - Boundary shapes: `GET /boundaries/toronto-wards-2018/simple_shape`
- **Returns**: Name, party, email, URL, photo, boundary set, district info
- **Note**: Postal codes can match multiple boundaries; lat/lng recommended for accuracy
- **Reliability**: Well-maintained, active project
- **FRANK STRATEGY**: Single API for all Canadian representatives at all levels. Better than anything available for most countries.

### 4.2 OpenParliament.ca API

- **URL**: `https://api.openparliament.ca/`
- **What**: Federal parliamentary data - bills, votes, MPs, debates, committees
- **Free**: Yes (no copyright claimed, attribution appreciated)
- **Format**: JSON
- **Example**: `api.openparliament.ca/votes/?date__lte=2011-01-01`
- **Rate Limit**: HTTP 429 if too many concurrent requests
- **FRANK STRATEGY**: Use for deep parliamentary activity data (debates, votes) once you've identified the MP via Represent API.

### 4.3 Statistics Canada Census API

- **URL**: Various endpoints at `statcan.gc.ca`
- **What**: Census data via SDMX API, demographics by geography
- **Services**: Web Data Service (WDS), 2021 Census Profile WDS, Delta Files, CSV Downloads
- **Format**: CSV, JSON, XML
- **Free**: Yes
- **FRANK STRATEGY**: Demographics by census division/subdivision. Combine with Represent API for full picture.

---

## 5. Australia

### 5.1 OpenAustralia API

- **URL**: `https://www.openaustralia.org.au/api/`
- **What**: Federal parliament - MPs, senators, debates, divisions, hansard
- **Free**: Low-volume non-commercial use is free. API key required.
- **Endpoints**:
  - `getRepresentatives` - House members
  - `getSenators` - Senate members
  - `getDivisions` - Electoral divisions
  - `getDebates` - Parliamentary debates
  - `getHansard` - Combined parliamentary data
- **Format**: XML, JavaScript, PHP, RABX
- **Example**: `openaustralia.org/api/getRepresentatives?key=KEY&output=js`
- **Reliability**: Active project, well-maintained

### 5.2 Australian Bureau of Statistics (ABS) APIs

- **URL**: `abs.gov.au/about/data-services/application-programming-interfaces-apis`
- **What**: Three APIs - Data API (statistics), Indicator API (headlines), Time Series Directory
- **Free**: Yes (some premium data services may have costs)
- **Coverage**: National, state, SA2/SA3/SA4 statistical areas
- **FRANK STRATEGY**: Demographics by statistical area. Combine with OpenAustralia for representatives.

---

## 6. European Union (Supranational)

### 6.1 European Parliament Open Data Portal

- **URL**: `https://data.europarl.europa.eu/`
- **What**: MEP data, committees, voting records, legislative activity
- **Format**: XML download for full MEP list; Open Data Portal for structured access
- **Free**: Yes
- **Individual MEP access**: `/meps/en/[ID_NUMBER]`
- **FRANK STRATEGY**: For EU-level representation. Every EU citizen has MEPs.

### 6.2 Eurostat API (EU Demographics)

- **URL**: `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/`
- **What**: Demographics, economics, social statistics for all EU/EEA countries
- **Coverage**: By NUTS regions (NUTS0=country, NUTS1=major regions, NUTS2=basic regions, NUTS3=small regions)
- **Free**: Yes, no key needed
- **Format**: JSON, SDMX-XML
- **Key datasets**:
  - `demo_r_pjangrp3` - Population by age/sex by NUTS3 region
  - `demo_r_d2jan` - Population density by NUTS3
  - `nama_10r_2gdp` - GDP by NUTS3
  - `lfst_r_lfu3rt` - Unemployment by NUTS2
- **Example**: `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/demo_r_pjangrp3?format=JSON`
- **Updated**: Twice daily at 11:00 and 23:00 CET
- **Reliability**: Excellent. Official EU statistics office.
- **FRANK STRATEGY**: Universal demographics for all EU/EEA countries at regional level. Maps to NUTS codes which correspond to admin boundaries available via OSM.

### 6.3 EUR-Lex (EU Legislation)

- **URL**: `https://eur-lex.europa.eu/`
- **What**: EU legislation, treaties, case law
- **API**: SPARQL endpoint available
- **Free**: Yes
- **FRANK STRATEGY**: EU-level policy data.

---

## 7. Individual European Countries

### 7.1 France

- **Representatives**: `data.assemblee-nationale.fr` (National Assembly open data), also `nosdeputes.fr` (community API - deputies by constituency)
- **Demographics**: INSEE (Institut national de la statistique) - API available at `api.insee.fr` (free, key required)
- **Boundaries**: IGN (Institut geographique national) - `geoservices.ign.fr` admin boundaries
- **Open Data Portal**: `data.gouv.fr` (CKAN-based, thousands of datasets)
- **Free**: Yes
- **Granularity**: Commune level (36,000+ communes)

### 7.2 Germany

- **Representatives**: `abgeordnetenwatch.de/api/v2/` - Bundestag + state parliaments + European Parliament
  - Endpoints: `/politicians`, `/candidacies-mandates`, `/parliaments`, `/parliament-periods`
  - Free: Yes (CC0 license)
  - Pagination up to 1,000 results per request
  - Electoral districts, voting records, secondary employment data
- **Demographics**: Destatis (Federal Statistical Office) - GENESIS API
- **Boundaries**: BKG (Federal Agency for Cartography and Geodesy) - WFS/WMS services
- **Open Data Portal**: `govdata.de`
- **FRANK STRATEGY**: abgeordnetenwatch is excellent - covers federal AND state level, CC0 licensed.

### 7.3 Italy

- **Representatives**: `dati.camera.it` - Camera dei Deputati Linked Open Data
  - SPARQL endpoint: `https://dati.camera.it/sparql`
  - 725M+ RDF triples, 128 classes
  - Biographical data, parliamentary acts, voting records
  - License: CC BY-SA 4.0
- **Demographics**: ISTAT (national statistics) - API available
- **Boundaries**: ISTAT geographic data
- **Free**: Yes

### 7.4 Ireland

- **Representatives**: Oireachtas API at `https://api.oireachtas.ie/`
  - Debates, divisions (votes), parliamentary questions
  - TDs by constituency, party
  - Free, Oireachtas Open Data PSI Licence
- **Demographics**: CSO (Central Statistics Office) - PxStat API
- **Boundaries**: OSi (Ordnance Survey Ireland)

### 7.5 Netherlands

- **Representatives**: Tweede Kamer Open Data Portal (`opendata.tweedekamer.nl`)
  - OData API (JSON) and SyncFeed API (Atom XML)
  - Parliament members, attendance, votes
  - Free
- **Demographics**: CBS StatLine API
- **Boundaries**: PDOK (Publieke Dienstverlening Op de Kaart) - free WFS/WMS

### 7.6 Sweden

- **Representatives**: Riksdag Open Data (`riksdagen.se/sv/dokument-och-lagar/riksdagens-oppna-data/`)
  - Members from ~1990 onward, documents, voting records (from 1993/94), speeches
  - Free, must cite "Sveriges riksdag"
- **Demographics**: SCB (Statistics Sweden) API
- **Boundaries**: Lantmateriet

### 7.7 Spain

- **Representatives**: `congreso.es` has some open data but limited API
- **Demographics**: INE (Instituto Nacional de Estadistica) - API available
- **Boundaries**: IGN CartoCiudad
- **Note**: Less developed API ecosystem than northern European countries

### 7.8 Denmark

- **Representatives**: `oda.ft.dk` (Folketinget Open Data) - OData API
- **Demographics**: Statistics Denmark - StatBank API (`statbank.dk/statbank5a/`)
- **Free**: Yes

### 7.9 Norway

- **Representatives**: Stortinget Open Data (`data.stortinget.no`) - REST API
- **Demographics**: SSB (Statistics Norway) API
- **Free**: Yes

### 7.10 Finland

- **Representatives**: Eduskunta Open Data (`avoindata.eduskunta.fi`)
- **Demographics**: Statistics Finland - PxWeb API
- **Boundaries**: National Land Survey via GeoServer
- **Free**: Yes

### 7.11 Portugal

- **Representatives**: `parlamento.pt/en/Pages/default.aspx` - some open data
- **Demographics**: INE Portugal
- **Note**: Limited API access

### 7.12 Poland

- **Representatives**: Sejm API (`api.sejm.gov.pl`) - REST API for MPs, votes, proceedings
- **Demographics**: GUS (Central Statistical Office)
- **Free**: Yes

---

## 8. Brazil

### 8.1 Camara dos Deputados API (Chamber of Deputies)

- **URL**: `https://dadosabertos.camara.leg.br/api/v2/`
- **What**: RESTful API for all legislative data
- **Endpoints**: Deputies, propositions, votes, events, legislative bodies
- **Format**: JSON, CSV, XML, XLSX, ODS
- **Free**: Yes (open data)
- **Updated**: Daily
- **Example**: `https://dadosabertos.camara.leg.br/api/v2/deputados` (all deputies)
- **Reliability**: Well-maintained, daily updates, Swagger documentation

### 8.2 Brazilian Senate

- **URL**: `https://legis.senado.leg.br/dadosabertos/`
- **What**: Similar open data for the Senate
- **Free**: Yes

### 8.3 IBGE (Demographics + Boundaries)

- **URL**: `https://servicodados.ibge.gov.br/api/`
- **What**: Brazilian Institute of Geography and Statistics - demographics, geographic boundaries
- **Coverage**: National down to municipality level (5,570 municipalities)
- **Free**: Yes

---

## 9. India

### 9.1 Representatives

- **No official API** from Parliament or Election Commission
- **Workaround**: Wikidata has good coverage of Lok Sabha (lower house) and Rajya Sabha (upper house) members
- **data.gov.in**: Government open data portal exists but has limited structured API access; many datasets are CSV downloads
- **Election Commission of India** (`eci.gov.in`): No API, but constituency/candidate data available on website (scraping required)

### 9.2 Demographics

- **Census India** (`censusindia.gov.in`): 2011 Census data available as downloads (tables, not API). 2021 Census was delayed.
- **data.gov.in**: Some demographic datasets available via CKAN API

### 9.3 Boundaries

- **Survey of India**: Official boundaries (restricted access for detailed levels)
- **OSM/Overpass**: Good coverage of Indian admin boundaries (states, districts, talukas)

### 9.4 FRANK STRATEGY for India

Use Wikidata for national representatives (Lok Sabha/Rajya Sabha). Use OSM for state/district identification from coordinates. Demographics from World Bank at country level, data.gov.in datasets for state-level. This is a gap area - India has 1.4B people but poor official API access.

---

## 10. Japan

### 10.1 National Diet Library API

- **URL**: `https://kokkai.ndl.go.jp/api/`
- **What**: Parliamentary proceedings - meetings, speeches, debates
- **Endpoints**:
  - `/meeting_list` - Meeting metadata (up to 100/request)
  - `/meeting` - Full meeting data with speeches (up to 10/request)
  - `/speech` - Individual speeches (up to 100/request)
- **Format**: XML or JSON
- **Free**: Yes, no registration required
- **Rate Limit**: Avoid rapid automated access, wait seconds between requests
- **Searchable by**: Date, meeting name, speaker name, keywords, session number
- **Note**: Primarily proceedings data, not a representative lookup. Use Wikidata for member lists.

### 10.2 e-Stat API (Demographics)

- **URL**: `https://api.e-stat.go.jp/`
- **What**: Japanese government statistics portal API
- **Free**: Yes (registration required)
- **Coverage**: Census, economic, social statistics by prefecture and municipality

---

## 11. South Korea

- **Representatives**: National Assembly data available via `data.go.kr` (Korea Open Data Portal) - requires Korean API key registration
- **Demographics**: KOSIS (Korean Statistical Information Service) API
- **Boundaries**: NGII (National Geographic Information Institute)
- **Note**: APIs exist but documentation is primarily in Korean. Wikidata has good coverage of National Assembly members.

---

## 12. New Zealand

- **Representatives**: `parliament.nz` has member data but no structured API. Wikidata coverage is good.
- **Demographics**: Stats NZ (`stats.govt.nz`) - API available
- **Open Data**: `data.govt.nz` portal
- **Note**: Small country, Wikidata + Stats NZ covers needs well.

---

## 13. Israel

- **Representatives**: Knesset provides OData API at `knesset.gov.il`
  - Members, committees, legislation, votes
  - Free
- **Demographics**: CBS Israel (Central Bureau of Statistics)
- **Boundaries**: Survey of Israel

---

## 14. Taiwan

- **Representatives**: Legislative Yuan API at `ly.govapi.tw`
  - Swagger documentation available
  - Legislator data, bills, votes
  - Free
- **Demographics**: DGBAS (Directorate-General of Budget, Accounting and Statistics)
- **Open Data**: `data.gov.tw` - large government open data portal
- **Free**: Yes

---

## 15. South Africa

- **Representatives**: No official API from Parliament. Member data on `parliament.gov.za` (web only).
  - Wikidata has good coverage of National Assembly and NCOP members
  - People's Assembly project (`pa.parliament.gov.za`) attempted but may be down
- **Demographics**: Stats SA (`statssa.gov.za`) - Census data downloadable
- **Open Data**: `openAFRICA` (Code for Africa) - CKAN-based portal with African datasets
- **FRANK STRATEGY**: Wikidata for representatives, World Bank for demographics, OSM for boundaries.

---

## 16. Other Notable Countries

### 16.1 Mexico
- **Representatives**: `datos.gob.mx` open data portal, Chamber of Deputies open data
- **Demographics**: INEGI (census API available)

### 16.2 Argentina
- **Representatives**: `datos.hcdn.gob.ar` (Chamber of Deputies open data)
- **Demographics**: INDEC

### 16.3 Chile
- **Representatives**: `opendata.camara.cl`
- **Demographics**: INE Chile

### 16.4 Colombia
- **Representatives**: `datos.gov.co` open data portal
- **Demographics**: DANE

### 16.5 Kenya
- **Representatives**: Via openAFRICA / Wikidata
- **Demographics**: KNBS

### 16.6 Nigeria
- **Representatives**: Via Wikidata (limited)
- **Demographics**: NBS / World Bank

---

## 17. Implementation Strategy for Frank

### Tier 1 - Deep Integration (ward/constituency level)
- **UK**: Already done. postcodes.io + Parliament API + ONS Census + IMD
- **US**: Already done. Google Civic + Census ACS + FCC FIPS

### Tier 2 - Good Integration (constituency level representatives + regional demographics)
- **Canada**: Represent API (all levels!) + StatCan Census
- **Australia**: OpenAustralia + ABS
- **Germany**: abgeordnetenwatch (CC0!) + Destatis
- **France**: Assemblee Nationale + INSEE
- **Ireland**: Oireachtas API + CSO
- **Brazil**: Camara API + IBGE
- **EU-wide**: Eurostat for demographics by NUTS region

### Tier 3 - Moderate Integration (national representatives + country demographics)
- **Italy, Netherlands, Sweden, Denmark, Norway, Finland, Poland**: Parliament APIs + national stats
- **Japan**: Diet Library + e-Stat
- **Israel**: Knesset OData + CBS
- **Taiwan**: Legislative Yuan API + DGBAS

### Tier 4 - Universal Fallback (every other country)
1. **Nominatim/GeoNames**: lat/lng -> admin hierarchy (country, region, municipality)
2. **Wikidata SPARQL**: Query national legislators for that country
3. **World Bank API**: Country-level demographics and governance indicators
4. **OSM Overpass**: Admin boundary polygons for map display
5. **HDX HAPI**: Supplementary data for developing countries

### Architecture Recommendation

```
User provides lat/lng
        |
        v
  Nominatim reverse geocode
  -> country, region, municipality, admin codes
        |
        v
  Country router (switch on country code)
        |
  +-----+------+------+------+
  |     |      |      |      |
  UK    US     CA    DE    ... (Tier 1-3 specific APIs)
  |     |      |      |
  v     v      v      v
  [country-specific representative + demographic APIs]
        |
        +-- Fallback: Wikidata SPARQL for representatives
        +-- Fallback: World Bank for demographics
        +-- Always: OSM for boundary display
```

### Critical First Steps
1. **Build Wikidata SPARQL integration** - this alone gives "who governs you" for 259 countries
2. **Build World Bank integration** - country-level demographics for all countries
3. **Build Nominatim integration** - lat/lng to admin hierarchy for routing
4. **Add Canada (Represent API)** - excellent single-API solution, good template for other countries
5. **Add EU countries progressively** - Eurostat for demographics, individual parliament APIs for representatives

### Data Freshness Considerations
- Wikidata: Community-updated, usually within days of elections
- World Bank: Annual updates, 1-2 year lag on some indicators
- Parliament APIs: Usually real-time or near-real-time
- Census APIs: Updated on census cycle (5-10 years), with annual estimates
- OSM/Nominatim: Continuously updated by community

---

## Appendix: Quick Reference - API Endpoints

| Source | Endpoint | Auth |
|--------|----------|------|
| Wikidata SPARQL | `https://query.wikidata.org/sparql?query=SPARQL` | None |
| World Bank | `https://api.worldbank.org/v2/country/{code}/indicator/{indicator}?format=json` | None |
| GeoNames | `https://api.geonames.org/{service}?lat=X&lng=Y&username=USER` | Free username |
| Nominatim | `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=X&lon=Y` | None (1req/s) |
| Overpass | `https://overpass-api.de/api/interpreter?data=QUERY` | None |
| Represent (CA) | `https://represent.opennorth.ca/representatives/?point=LAT,LNG` | None |
| OpenAustralia | `https://www.openaustralia.org.au/api/getRepresentatives?key=KEY` | Free API key |
| abgeordnetenwatch (DE) | `https://www.abgeordnetenwatch.de/api/v2/politicians` | None |
| Camara (BR) | `https://dadosabertos.camara.leg.br/api/v2/deputados` | None |
| Oireachtas (IE) | `https://api.oireachtas.ie/` | None |
| OpenParliament (CA) | `https://api.openparliament.ca/` | None |
| Diet Library (JP) | `https://kokkai.ndl.go.jp/api/meeting_list` | None |
| Eurostat | `https://ec.europa.eu/eurostat/api/dissemination/sdmx/2.1/data/{dataset}?format=JSON` | None |
| UN Data | `https://data.un.org/ws/rest/dataflow/` | None |
| US Census ACS | `https://api.census.gov/data/2022/acs/acs5?get=VARS&for=GEO` | Free API key |
| Google Civic (US) | `https://civicinfo.googleapis.com/civicinfo/v2/representatives?address=ADDR&key=KEY` | API key |
| Parliament UK | `https://members-api.parliament.uk/api/Members/Search` | None |
| postcodes.io (UK) | `https://api.postcodes.io/postcodes/{postcode}` | None |
