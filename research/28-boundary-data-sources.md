# Official Administrative/Political Boundary GeoJSON Sources by Country

*Research for Frank/Beat — automatic boundary display for any searched location*
*Last updated: 2026-03-17*

---

## Architecture Goal

When a user searches for a location, Frank should:
1. Identify the administrative area (ward, constituency, municipality, etc.)
2. Fetch and display that area's boundary polygon
3. Show all sub-divisions within it (e.g. searching for a local authority shows all its wards)

This requires knowing, for each country, where to get boundary polygons at every administrative level, ideally via a REST API returning GeoJSON.

---

## 1. United Kingdom — ONS Open Geography Portal

**Portal**: https://geoportal.statistics.gov.uk/
**API base**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/`
**License**: Open Government Licence v3.0 (free, including commercial use, with attribution)
**Update frequency**: Annual (December for most boundaries; July for parliamentary constituencies after boundary reviews)
**Format**: ArcGIS FeatureServer — query with `f=geojson` for GeoJSON output

### Query Pattern

All ONS boundary layers follow the same ArcGIS REST API pattern:

```
https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/{SERVICE_NAME}/FeatureServer/0/query?
  where=1%3D1
  &outFields=*
  &returnGeometry=true
  &f=geojson
  &resultRecordCount=2000
```

**Query by name** (e.g. find a specific ward):
```
where=WD24NM='Beckton'
```

**Query by code**:
```
where=WD24CD='E05015029'
```

**Query by bounding box** (find all wards within a map extent):
```
geometry={"xmin":-0.1,"ymin":51.4,"xmax":0.1,"ymax":51.6}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects
```

**Query by point** (find the ward containing a lat/lng):
```
geometry={"x":0.065,"y":51.52}&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects
```

### Boundary Resolution Suffixes

ONS publishes each boundary set in multiple resolutions:
- **BFC** — Full resolution, clipped to coastline (Mean High Water). Best for detailed display.
- **BFE** — Full resolution, extent of the realm (includes offshore). Use for analysis.
- **BGC** — Generalised (simplified), clipped. Good for fast web display.
- **BSC** — Super-generalised, clipped. Fastest loading, coarsest detail.
- **BUC** — Ultra-generalised, clipped. Overview maps only.

**Recommendation**: Use **BGC** for web map display (good balance of detail vs file size) and **BFC** for precise analysis.

### Key Layers

#### Wards (WD24 — December 2024)
- **Service**: `Wards_December_2024_Boundaries_UK_BGC`
- **URL**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_December_2024_Boundaries_UK_BGC/FeatureServer/0/query`
- **Fields**: `WD24CD` (code), `WD24NM` (name), `LAD24CD` (parent local authority code)
- **Count**: ~8,500 wards in England & Wales

#### Parliamentary Constituencies (PCON24 — July 2024)
- **Service**: `Westminster_Parliamentary_Constituencies_July_2024_Boundaries_UK_BFC`
- **URL**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Westminster_Parliamentary_Constituencies_July_2024_Boundaries_UK_BFC/FeatureServer/0/query`
- **Fields**: `PCON24CD` (code), `PCON24NM` (name)
- **Count**: 650 constituencies

#### Local Authority Districts (LAD24 — May 2024)
- **Service**: `Local_Authority_Districts_May_2024_Boundaries_UK_BGC`
- **URL**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_May_2024_Boundaries_UK_BGC/FeatureServer/0/query`
- **Fields**: `LAD24CD` (code), `LAD24NM` (name)
- **Count**: ~361 districts

#### LSOA Boundaries (LSOA21 — December 2021)
- **Service**: `Lower_layer_Super_Output_Areas_December_2021_Boundaries_EW_BFC_V10`
- **URL**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Lower_layer_Super_Output_Areas_December_2021_Boundaries_EW_BFC_V10/FeatureServer/0/query`
- **Fields**: `LSOA21CD` (code), `LSOA21NM` (name)
- **Count**: 33,755 LSOAs in England & Wales
- **Note**: Large dataset. Use `resultRecordCount` and `resultOffset` for pagination, or query by spatial intersection with a ward/LAD polygon.

#### Counties and Unitary Authorities (December 2024)
- **Service**: `Counties_and_Unitary_Authorities_December_2024_Boundaries_UK_BUC`
- **URL**: `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Counties_and_Unitary_Authorities_December_2024_Boundaries_UK_BUC/FeatureServer/0/query`

### UK Hierarchy (top to bottom)
```
Country → Region → County/Unitary Authority → Local Authority District → Ward → LSOA → Output Area
                                                                        → Parish
Parliamentary Constituency (overlapping, not hierarchical with wards)
```

### Finding Service Names

ONS service names follow the pattern: `{Geography}_{Month}_{Year}_Boundaries_{Coverage}_{Resolution}`

To discover services, search the portal: https://geoportal.statistics.gov.uk/search?q=BDY_WD%202024

Or browse the ArcGIS REST services directory: https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/

---

## 2. United States — Census Bureau TIGERweb

**Portal**: https://tigerweb.geo.census.gov/
**API base**: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/`
**License**: Public domain (US Government works)
**Update frequency**: Annual (reflects Boundary and Annexation Survey results)
**Format**: ArcGIS MapServer — supports `f=geojson` on query endpoints

### Service Architecture

TIGERweb provides several MapServer services. The main one for current boundaries:

**Current boundaries**: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer`

### Key Layers (by Layer ID)

| Layer ID | Name | Count |
|----------|------|-------|
| 54 | 119th Congressional Districts | 435 |
| 56 | 2024 State Legislative Districts — Upper | ~1,900 |
| 58 | 2024 State Legislative Districts — Lower | ~5,500 |
| 80 | States | 56 (inc. territories) |
| 82 | Counties | ~3,200 |
| 8 | Census Tracts | ~85,000 |
| 10 | Census Block Groups | ~240,000 |
| 28 | Incorporated Places (cities/towns) | ~19,500 |
| 30 | Census Designated Places | ~9,600 |
| 22 | County Subdivisions | ~36,000 |
| 0 | Public Use Microdata Areas | ~2,400 |
| 2 | ZIP Code Tabulation Areas | ~33,000 |

Even-numbered IDs are polygon layers; odd-numbered IDs are label layers.

### Query Pattern

```
https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/tigerWMS_Current/MapServer/{LAYER_ID}/query?
  where=NAME='Manhattan'
  &outFields=*
  &returnGeometry=true
  &f=geojson
```

**Query by name**:
```
where=NAME='Los Angeles'     (for places, layer 28)
where=BASENAME='Cook'        (for counties, layer 82)
where=NAMELSAD='Congressional District 7'  (for congressional districts, layer 54)
```

**Query by FIPS/GEOID**:
```
where=GEOID='0644000'        (FIPS code for Los Angeles)
where=STATE='06' AND CD119='07'  (California CD-7)
```

**Query by lat/lng** (find all boundaries containing a point):
```
geometry=-118.24,34.05&geometryType=esriGeometryPoint&spatialRel=esriSpatialRelIntersects
```

**Query by state** (all counties in California):
```
where=STATE='06'
```

### Simpler Alternatives

**Census Geocoder** (address to FIPS): `https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?address=123+Main+St&benchmark=Public_AR_Current&vintage=Current_Current&format=json`
- Returns: state, county, tract, block FIPS codes for any address
- Use the FIPS codes to then query TIGERweb for boundaries

**Pre-built GeoJSON files** (by Eric Celeste): https://eric.clst.org/tech/usgeojson/
- States, counties, and congressional districts as static GeoJSON files
- Useful for bulk download, not for per-query use

### US Hierarchy (top to bottom)
```
Nation → State → County → Census Tract → Block Group → Census Block
                        → County Subdivision → Place (city/town)
Congressional District (overlapping, redrawn every 10 years)
State Legislative District (upper/lower chambers)
```

### TIGER/Line Shapefiles (Bulk Download)

For bulk pre-processing: https://www.census.gov/cgi-bin/geo/shapefiles/index.php
- 2025 vintage available
- Shapefile format (convert to GeoJSON with ogr2ogr or mapshaper)
- All layers available for download

---

## 3. Brazil — IBGE (Instituto Brasileiro de Geografia e Estatistica)

**Portal**: https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/15774-malhas.html
**API base**: `https://servicodados.ibge.gov.br/api/v3/malhas/`
**License**: Open data (free use with attribution)
**Update frequency**: Annual (reflects Political-Administrative Division changes)
**Format**: Native GeoJSON via API (`formato=application/vnd.geo+json`)

### API Endpoints

The IBGE Malhas (Mesh) API v3 returns boundary polygons at multiple levels:

**Country outline**:
```
https://servicodados.ibge.gov.br/api/v3/malhas/paises/BR?formato=application/vnd.geo+json
```

**States (Unidades Federativas)**:
```
https://servicodados.ibge.gov.br/api/v3/malhas/estados/{UF_CODE}?formato=application/vnd.geo+json
```
Example: `estados/33` (Rio de Janeiro), `estados/35` (Sao Paulo)

**All states subdivided**:
```
https://servicodados.ibge.gov.br/api/v3/malhas/estados?formato=application/vnd.geo+json
```

**Municipalities within a state**:
```
https://servicodados.ibge.gov.br/api/v3/malhas/estados/{UF_CODE}?intrarregiao=municipio&formato=application/vnd.geo+json
```

**Single municipality**:
```
https://servicodados.ibge.gov.br/api/v3/malhas/municipios/{MUN_CODE}?formato=application/vnd.geo+json
```
Example: `municipios/3304557` (Rio de Janeiro city)

**Available formats**:
- `application/vnd.geo+json` — GeoJSON
- `application/json` — TopoJSON
- `image/svg+xml` — SVG

### Municipality Code Lookup

Use the IBGE Localidades API to find municipality codes by name:
```
https://servicodados.ibge.gov.br/api/v1/localidades/municipios?orderBy=nome
```

Search by name:
```
https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=Sao+Paulo
```

### Administrative Levels Available
```
Country → Macro-regions (5) → States (27) → Intermediate Geographic Regions →
  Immediate Geographic Regions → Municipalities (~5,570) → Districts → Sub-districts
```

### Electoral Zones (TSE)

The Tribunal Superior Eleitoral (TSE) provides electoral data through its Open Data Portal: https://dadosabertos.tse.jus.br/

**Important limitation**: TSE does **not** publish electoral zone boundary shapefiles or GeoJSON. Electoral zones are defined by lists of municipalities/sections, not by geographic polygons. Community projects (e.g. https://github.com/mapaslivres/zonas-eleitorais) have attempted geocoding but this remains incomplete.

For electoral geography, use IBGE municipal boundaries and join with TSE municipality-to-electoral-zone lookup tables.

### Bairro (Neighbourhood) Boundaries

IBGE does not provide official bairro boundaries via their API. Bairro boundaries are sometimes available from:
- Municipal prefeituras (city governments) — varies by city
- IBGE Census Sectors (setores censitarios) — available as bulk shapefile downloads, much finer than bairros
- OpenStreetMap (admin_level=9 in Brazil = bairro)

---

## 4. France — geo.api.gouv.fr + IGN Admin Express

**API**: https://geo.api.gouv.fr/
**IGN source**: https://geoservices.ign.fr/adminexpress
**License**: Licence Ouverte / Open Licence 2.0 (free, including commercial)
**Update frequency**: Monthly (Admin Express); API reflects latest
**Format**: Native GeoJSON via API

### API Endpoints

The API Decoupage Administratif is the simplest way to get French administrative boundaries as GeoJSON.

**Communes (municipalities)**:
```
GET https://geo.api.gouv.fr/communes?nom=Paris&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/communes?codePostal=75001&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/communes?lat=48.8566&lon=2.3522&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/communes/{INSEE_CODE}?format=geojson&geometry=contour
```

**Departements**:
```
GET https://geo.api.gouv.fr/departements?nom=Paris&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/departements/{CODE}?format=geojson&geometry=contour
GET https://geo.api.gouv.fr/departements/{CODE}/communes?format=geojson&geometry=contour
```

**Regions**:
```
GET https://geo.api.gouv.fr/regions?nom=Ile-de-France&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/regions/{CODE}/departements?format=geojson&geometry=contour
```

**EPCI (intercommunal groupings)**:
```
GET https://geo.api.gouv.fr/epcis?nom=Metropole&format=geojson&geometry=contour
GET https://geo.api.gouv.fr/epcis/{CODE}/communes?format=geojson&geometry=contour
```

### Query Parameters

| Parameter | Description |
|-----------|-------------|
| `format` | `json` (default) or `geojson` |
| `geometry` | `centre` (point), `contour` (boundary polygon), `mairie` (town hall point), `bbox` |
| `nom` | Search by name (accent-insensitive) |
| `codePostal` | Search by postal code |
| `lat` + `lon` | Search by coordinates |
| `fields` | Comma-separated list of fields to return |
| `boost` | `population` — sort by population |

### Geometry Options
- `geometry=contour` — returns the full boundary polygon (this is what we need)
- `geometry=centre` — returns a point at the centroid
- `geometry=bbox` — returns the bounding box

### Static Downloads

For bulk data, download Admin Express from IGN: https://geoservices.ign.fr/adminexpress
- Available in SHP, GeoJSON, GeoPackage
- Includes: communes, cantons, arrondissements, departements, regions, EPCI
- Updated monthly

Community-maintained GeoJSON: https://github.com/gregoiredavid/france-geojson
- All levels pre-converted to GeoJSON, organized by region/departement

### France Hierarchy
```
Country → Regions (18) → Departements (101) → Arrondissements (~330) → Cantons (~2,000) → Communes (~35,000)
                                                                                        → EPCI (intercommunal, ~1,250)
Circonscriptions legislatives (577 legislative constituencies — separate hierarchy)
```

### Electoral Boundaries

Legislative constituency (circonscription) boundaries are published by the Ministry of the Interior and available via data.gouv.fr as shapefiles. The geo.api.gouv.fr API does not include them directly.

---

## 5. Germany — BKG + Bundeswahlleiterin

**BKG Portal**: https://gdz.bkg.bund.de/index.php/default/digitale-geodaten/verwaltungsgebiete.html
**License**: Datenlizenz Deutschland — Namensnennung 2.0 (free with attribution, including commercial)
**Update frequency**: Annual (VG250 product)
**Format**: Shapefile primary; community GeoJSON conversions available

### Official Source: VG250 (Verwaltungsgebiete 1:250,000)

The BKG VG250 product contains all German administrative boundaries:

**Download**: https://daten.gdz.bkg.bund.de/produkte/vg/
- Format: ESRI Shapefile (SHP), GeoPackage
- CRS: ETRS89/UTM32 and WGS84 variants available
- Historical versions back to 1997

**Levels in VG250**:
```
Country (Staat) → States (Bundesland, 16) → Government Districts (Regierungsbezirk, ~19) →
  Counties (Landkreis/Kreisfreie Stadt, ~400) → Municipal Associations (Verwaltungsgemeinschaft) →
  Municipalities (Gemeinde, ~10,800)
```

### Electoral Districts (Wahlkreise)

**Source**: Bundeswahlleiterin (Federal Returning Officer)
**Download**: https://www.bundeswahlleiterin.de/en/bundestagswahlen/2025/wahlkreiseinteilung/downloads.html
- Format: Shapefile (SHP), KML, SVG, WMS/WFS — **no native GeoJSON**
- CRS: ETRS89/UTM32 and WGS84
- Data basis: BKG VG250
- Count: 299 Wahlkreise for the Bundestag

### Community GeoJSON Conversions

Since BKG does not serve GeoJSON natively via API:

- **deutschlandGeoJSON** (GitHub): https://github.com/isellsoap/deutschlandGeoJSON
  - All admin levels in GeoJSON, multiple quality levels
  - Pre-converted from BKG VG250 data

- **geoGermany** (GitHub): https://github.com/Praesklepios/geoGermany
  - GeoJSON files for Lander, Kreise, Gemeinden

### WFS Service

BKG provides a WFS (Web Feature Service) for programmatic access:
```
https://sgx.geodatenzentrum.de/wfs_vg250?service=WFS&request=GetCapabilities
```
- Returns GML; can be converted to GeoJSON
- Supports spatial and attribute queries

### Germany Hierarchy
```
Staat → Bundesland (16) → Regierungsbezirk (~19) → Landkreis/Kreisfreie Stadt (~400) →
  Verwaltungsgemeinschaft → Gemeinde (~10,800)
Wahlkreise (299 federal electoral districts — separate, overlapping hierarchy)
```

---

## 6. Italy — ISTAT

**Portal**: https://www.istat.it/it/archivio/222527
**License**: CC BY 3.0 IT (free with attribution, including commercial)
**Update frequency**: Annual (as of January 1 each year)
**Format**: ESRI Shapefile (SHP) — no native API or GeoJSON endpoint

### Official ISTAT Data

ISTAT publishes administrative boundaries annually as zip archives of shapefiles:

**Download page**: https://www.istat.it/it/archivio/222527
- Available: January 2024 boundaries (latest as of writing)
- CRS: WGS84
- Two versions: generalised (simplified) and non-generalised (detailed)

**Levels available**:
```
Country → Geographic Divisions (5) → Regions (Regioni, 20) → Provinces (Province, ~107) →
  Municipalities (Comuni, ~7,900)
```

### Community GeoJSON Resources

**openpolis/geojson-italy** (GitHub): https://github.com/openpolis/geojson-italy
- All municipalities as GeoJSON, organized by region and province
- Uses ISTAT numerical codes
- Periodically updated from ISTAT source data

**Opendatasoft**: https://public.opendatasoft.com/explore/dataset/georef-italy-comune/export/
- Comuni boundaries with export in GeoJSON, CSV, Shapefile

### Electoral Boundaries

Italian electoral constituency boundaries are defined by law but not routinely published as GIS files by the government. The Camera dei Deputati (Chamber of Deputies) uses ISTAT geographic codes to map constituencies to municipalities.

### Italy Hierarchy
```
Stato → Divisioni Geografiche (5) → Regioni (20) → Province (107) → Comuni (~7,900)
Collegi elettorali (electoral constituencies — mapped to groups of comuni)
```

---

## 7. Canada — Statistics Canada + Represent API

### Statistics Canada (Bulk Downloads)

**Portal**: https://www12.statcan.gc.ca/census-recensement/2021/geo/sip-pis/boundary-limites/index2021-eng.cfm
**License**: Open Government Licence — Canada (free, including commercial)
**Update frequency**: Decennial (census years) + electoral redistribution
**Format**: Shapefile, KMZ — no native GeoJSON API

**Available boundary files**:
```
Country → Provinces/Territories (13) → Census Divisions (~293) → Census Subdivisions (~5,100) →
  Census Tracts → Dissemination Areas → Dissemination Blocks
Federal Electoral Districts (343 — 2023 Representation Order)
```

**2025 Electoral Boundaries**: https://open.canada.ca/data/en/dataset/97a2a33c-54cc-4f2e-82c1-047ad8212f05
- 343 federal electoral districts (45th General Election)
- Shapefile format

### Represent API (OpenNorth) — RECOMMENDED FOR REAL-TIME USE

**API base**: https://represent.opennorth.ca/
**License**: Free, open source
**Rate limit**: 60 requests/minute
**Format**: GeoJSON (default), KML, WKT

This is the best option for Canada — it wraps Statistics Canada and Elections Canada data in a proper REST API with GeoJSON output.

**Find boundaries containing a point**:
```
GET https://represent.opennorth.ca/boundaries/?contains=45.524,-73.596
```
Returns all boundaries (federal, provincial, municipal) that contain the given lat/lng.

**Find boundaries by postal code**:
```
GET https://represent.opennorth.ca/postcodes/K1A0A6/
```
Returns boundaries and representatives for a postal code.

**Get a specific boundary set**:
```
GET https://represent.opennorth.ca/boundaries/federal-electoral-districts/
GET https://represent.opennorth.ca/boundaries/federal-electoral-districts/35008/   (specific district)
GET https://represent.opennorth.ca/boundaries/federal-electoral-districts/35008/shape   (GeoJSON polygon)
GET https://represent.opennorth.ca/boundaries/federal-electoral-districts/35008/simple_shape   (simplified)
```

**Available boundary sets** (partial list):
- `federal-electoral-districts` — 343 FEDs
- Provincial electoral districts (per province)
- Municipal wards (for major cities)
- Census divisions, subdivisions

**Find representatives for a boundary**:
```
GET https://represent.opennorth.ca/boundaries/federal-electoral-districts/35008/representatives/
```

**Search boundaries by name**:
```
GET https://represent.opennorth.ca/boundaries/?name=Toronto
GET https://represent.opennorth.ca/boundaries/?name__icontains=toronto
```

### Canada Hierarchy
```
Country → Province/Territory (13) → Census Division (~293) → Census Subdivision (~5,100) →
  Dissemination Area → Dissemination Block
Federal Electoral District (343 — separate, overlapping)
Provincial Electoral District (varies by province)
Municipal Ward (varies by city)
```

---

## 8. Global Fallbacks

### 8.1 geoBoundaries (William & Mary geoLab) — RECOMMENDED GLOBAL FALLBACK

**API**: https://www.geoboundaries.org/api/current/gbOpen/{ISO3}/{ADM_LEVEL}/
**License**: CC BY 4.0 (free, including commercial, with attribution)
**Coverage**: Every country in the world, up to ADM5 (varies by country)
**Format**: GeoJSON (download URL returned in API response)

**How it works**: The API returns metadata including a `gjDownloadURL` field pointing to a GeoJSON file.

**Example — Get Brazil's state boundaries**:
```
GET https://www.geoboundaries.org/api/current/gbOpen/BRA/ADM1/
→ Response includes gjDownloadURL pointing to a GeoJSON file
```

**Example — Get Italy's municipality boundaries**:
```
GET https://www.geoboundaries.org/api/current/gbOpen/ITA/ADM3/
```

**Available levels**:
| Level | Typical meaning |
|-------|----------------|
| ADM0 | Country boundary |
| ADM1 | States / provinces / regions |
| ADM2 | Counties / districts / departments |
| ADM3 | Municipalities / communes |
| ADM4 | Sub-municipal divisions |
| ADM5 | Neighbourhoods / smallest admin units |

**Coverage depth varies**: Major democracies typically have ADM0-ADM3. Some countries have ADM4-ADM5.

**Release types**:
- `gbOpen` — CC BY 4.0 (recommended)
- `gbHumanitarian` — UN OCHA mirror (may have restrictions)
- `gbAuthoritative` — UN SALB mirror (no commercial use)

**Global download** (all countries, one level): https://www.geoboundaries.org/globalDownloads.html

**Key advantage**: Single API, consistent format, every country. Use this as the fallback when a country-specific API is not available.

### 8.2 OpenStreetMap / Overpass API

**API**: https://overpass-api.de/api/interpreter
**License**: ODbL (free, including commercial, share-alike for derivative databases)
**Coverage**: Global, community-maintained, variable quality
**Format**: Returns XML/JSON; needs conversion to GeoJSON

**Admin level mappings** (key countries):

| admin_level | UK | US | Brazil | France | Germany | Italy | Canada |
|-------------|----|----|--------|--------|---------|-------|--------|
| 2 | Country | Country | Country | Country | Country | Country | Country |
| 3 | — | — | Macro-regions | Overseas | — | — | — |
| 4 | Country (E/S/W/NI) | State | State | Region | Bundesland | Region | Province |
| 5 | — | — | Intermediate region | Departement | Regierungsbezirk | — | — |
| 6 | Borough/Council | County | Metropolitan area | Arrondissement | Landkreis | Province | Regional municipality |
| 7 | Electoral division | — | Municipality | Commune | Verwaltungsgem. | Comunita montana | Borough |
| 8 | Townland | — | District | Quartier | Gemeinde | Comune | Lower-tier municipality |
| 9 | — | — | Bairro | — | Stadtteil | Circoscrizione | Ward |
| 10 | — | — | — | — | — | Localita | Neighbourhood |

**Example Overpass query** (all wards in London Borough of Newham):
```
[out:json];
area["name"="London Borough of Newham"]->.searchArea;
relation["boundary"="administrative"]["admin_level"="9"](area.searchArea);
out geom;
```

**Convenience wrappers**:
- **OSM-Boundaries**: https://osm-boundaries.com/ — point-and-click GeoJSON download for any admin boundary
- **Nominatim**: `https://nominatim.openstreetmap.org/search?q=Newham&polygon_geojson=1&format=json` — returns boundary polygons with search results

**Limitations**:
- Quality varies enormously by region (excellent in Europe, patchy in Africa/Asia)
- Admin level meanings differ per country (see table above)
- Large queries can time out on public Overpass servers
- Boundaries may not match official government definitions

### 8.3 GADM (Global Administrative Areas)

**Website**: https://gadm.org/
**License**: Free for academic/non-commercial use only. **Commercial use requires a license.**
**Coverage**: Every country, typically ADM0–ADM4
**Format**: Shapefile, GeoPackage, GeoJSON, KMZ, R data

**Do NOT use GADM for Frank** — the license prohibits commercial use without permission. Use geoBoundaries (CC BY 4.0) instead.

### 8.4 Natural Earth

**Website**: https://www.naturalearthdata.com/
**License**: Public domain
**Scales**: 1:10m, 1:50m, 1:110m
**Format**: Shapefile (convert to GeoJSON)

**Available levels**:
- ADM0 — Country boundaries (all countries)
- ADM1 — States/provinces (all countries, ~4,600 units)
- ADM2 — Counties (US only!)

**Verdict**: Too coarse for Frank's needs. Only goes to state/province level globally. Useful as a base layer or for country outlines, not for local boundaries like wards or municipalities.

---

## 9. Implementation Strategy for Frank

### Priority Order

1. **Check if country has a native GeoJSON API** (UK, France, Brazil, Canada via Represent)
   - Query directly, get instant GeoJSON response
   - Best UX, lowest latency

2. **Check geoBoundaries** for the country + admin level
   - Download GeoJSON file from the returned URL
   - Cache locally (files don't change frequently)
   - Good for any country worldwide

3. **Fall back to OpenStreetMap/Nominatim**
   - Use Nominatim search with `polygon_geojson=1` for quick boundary lookup
   - Use Overpass for more complex queries (all sub-divisions within an area)

4. **Bulk download + pre-process** (for countries without APIs: Germany, Italy)
   - Download shapefiles from BKG/ISTAT
   - Convert to GeoJSON with ogr2ogr or mapshaper
   - Serve from our own backend

### Data Flow

```
User searches "Beckton, London"
  → Geocode to lat/lng (Google/Nominatim)
  → Detect country (UK)
  → Query ONS FeatureServer: point-in-polygon → returns Ward boundary
  → Query ONS for all LSOAs within that ward (spatial intersection)
  → Query ONS for parent LAD boundary
  → Query ONS for parliamentary constituency (spatial intersection with point)
  → Display: Ward boundary (bold) + LSOA subdivisions (thin) + constituency boundary (dashed)
```

```
User searches "Sao Paulo, Brazil"
  → Geocode to lat/lng
  → Detect country (Brazil)
  → IBGE API: municipios/3550308 → returns Sao Paulo municipality boundary
  → IBGE API: estados/35?intrarregiao=municipio → returns all municipalities in SP state
  → Display: SP municipality boundary (bold) + neighbouring municipalities (thin)
```

### Caching Strategy

- **Country-level** (ADM0): Cache indefinitely
- **State/Region** (ADM1): Cache 1 year
- **District/County** (ADM2): Cache 6 months
- **Ward/Municipality** (ADM3+): Cache 3 months
- **Electoral boundaries**: Cache until next election cycle, then refresh

### Country-Source Matrix

| Country | API Source | Format | Query by name? | Query by lat/lng? | Electoral boundaries? |
|---------|-----------|--------|---------------|-------------------|----------------------|
| UK | ONS FeatureServer | GeoJSON | Yes | Yes | Yes (PCON) |
| US | TIGERweb MapServer | GeoJSON | Yes | Yes | Yes (CD, SLD) |
| Brazil | IBGE Malhas API | GeoJSON | By code (lookup name first) | No (use geocoder) | No (use IBGE + TSE lookup) |
| France | geo.api.gouv.fr | GeoJSON | Yes | Yes | Partial (separate source) |
| Germany | BKG (bulk download) | Shapefile→GeoJSON | No API | No API | Shapefile from Bundeswahlleiterin |
| Italy | ISTAT (bulk download) | Shapefile→GeoJSON | No API | No API | No official GIS data |
| Canada | Represent (OpenNorth) | GeoJSON | Yes | Yes | Yes (FED) |
| Any other | geoBoundaries | GeoJSON (download) | No | No | Usually no |
| Any other | OSM/Nominatim | GeoJSON | Yes | Yes | Sometimes |
