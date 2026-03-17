# UK Census & Demographic Data: Programmatic Access Guide

Research date: 2026-03-16

## Executive Summary

All core UK demographic data is available **free, without authentication** through multiple APIs. The practical approach for "given a place name, return demographics" is:

1. **Postcodes.io** - resolve postcode/place to ward code, LSOA code (free, no auth)
2. **Nomis API** - pull Census 2021 data by ward/LSOA (free, optional key for higher limits)
3. **ONS Beta API** - alternative Census 2021 access (free, no auth, JSON)
4. **IMD 2025** - deprivation data downloadable as CSV (free bulk download)
5. **ONS Open Geography Portal** - boundary polygons, area lookups (free, no auth)

---

## 1. Postcodes.io - Geographic Resolution

**Purpose**: Convert postcode to ward code, LSOA, MSOA, local authority, constituency.
**Auth**: None required. **Rate limits**: Reasonable use, no published hard limit. **Cost**: Free, open source.

### Endpoints

```
Base: https://api.postcodes.io
```

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/postcodes/{postcode}` | GET | Lookup single postcode |
| `/postcodes` | POST | Bulk lookup (up to 100) |
| `/postcodes/{postcode}/nearest` | GET | Nearest postcodes |
| `/postcodes?lon={lng}&lat={lat}` | GET | Reverse geocode |
| `/places?q={name}` | GET | Search places by name |

### Example: Resolve "Shadwell, London"

```bash
curl "https://api.postcodes.io/postcodes/E1W3TJ"
```

**Key response fields:**
```json
{
  "admin_ward": "St Katharine's & Wapping",
  "codes": {
    "admin_ward": "E05009330",
    "admin_district": "E09000030",
    "lsoa": "E01004297",
    "msoa": "E02000890",
    "parliamentary_constituency": "E14001430"
  },
  "lsoa": "Tower Hamlets 027C",
  "msoa": "Tower Hamlets 027",
  "admin_district": "Tower Hamlets"
}
```

### Bulk Lookup

```bash
curl -X POST "https://api.postcodes.io/postcodes" \
  -H "Content-Type: application/json" \
  -d '{"postcodes": ["E1W3TJ", "E1 0BL", "SW1A 1AA"]}'
```

### Self-hostable

Postcodes.io is open source: https://github.com/ideal-postcodes/postcodes.io
Can be run locally with a PostgreSQL database loaded from ONS Postcode Directory.

---

## 2. Nomis API - Census 2021 Data (Primary Source)

**Purpose**: Full Census 2021 data at ward, LSOA, MSOA, OA level.
**Auth**: Optional. Anonymous = 25,000 cell limit per query. Free account = 1,000,000 cells.
**Rate limits**: Concurrent request limit (unspecified number). Register at nomisweb.co.uk for API key.
**Cost**: Free.

### Base URL

```
https://www.nomisweb.co.uk/api/v01/
```

### Key Census 2021 Dataset IDs

| NM ID | TS Code | Topic | Categories |
|-------|---------|-------|------------|
| NM_2021_1 | TS001 | Population (households/communal) | 3 |
| NM_2023_1 | TS003 | Household composition | - |
| NM_2026_1 | TS006 | Population density | - |
| NM_2018_1 | TS007B | Age by broad bands | 12 |
| NM_2020_1 | TS007A | Age by 5-year bands | - |
| NM_2027_1 | TS007 | Age by single year | - |
| NM_2028_1 | TS008 | Sex | - |
| NM_2041_1 | TS021 | Ethnic group | 25 |
| NM_2095_1 | TS022 | Ethnic group (detailed) | - |
| NM_2049_1 | TS030 | Religion | 10 |
| NM_2096_1 | TS031 | Religion (detailed) | - |
| NM_2055_1 | TS037 | General health | - |
| NM_2056_1 | TS038 | Disability | - |
| NM_2062_1 | TS044 | Accommodation type | - |
| NM_2072_1 | TS054 | Tenure | - |
| NM_2077_1 | TS060 | Industry | - |
| NM_2083_1 | TS066 | Economic activity | - |
| NM_2084_1 | TS067 | Highest qualification | - |

### Geography TYPE Codes

| TYPE | Geography Level | Count |
|------|----------------|-------|
| TYPE150 | 2021 Output Areas | ~180,000 |
| TYPE151 | 2021 LSOAs (lower layer) | ~35,600 |
| TYPE152 | 2021 MSOAs (middle layer) | ~7,200 |
| TYPE153 | 2022 Wards | ~7,600 |
| TYPE154 | 2022 Local Authority Districts | - |
| TYPE155 | 2022 Local Authority Counties | - |
| TYPE172 | Westminster Constituencies (Jul 2024) | - |
| TYPE480 | Regions | - |
| TYPE499 | Countries | - |

### Step 1: Find a Ward's Nomis Internal ID

Search wards by name:
```bash
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2041_1/geography/TYPE153.def.sdmx.json?search=*Shadwell*"
```

Response contains:
```
Nomis ID: 641730994, Name: Shadwell, GSS Code: E05009332
```

### Step 2: Query Census Data for That Ward

**Ethnicity breakdown for Shadwell ward:**
```bash
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2041_1.data.csv?geography=641730994&select=geography_name,c2021_eth_20_name,obs_value&measures=20100"
```

**Returns:**
```csv
"GEOGRAPHY_NAME","C2021_ETH_20_NAME","OBS_VALUE"
"Shadwell","Total: All usual residents",13274
"Shadwell","Asian, Asian British or Asian Welsh",7973
"Shadwell","Asian, Asian British or Asian Welsh: Bangladeshi",7070
"Shadwell","Asian, Asian British or Asian Welsh: Chinese",200
"Shadwell","Asian, Asian British or Asian Welsh: Indian",324
"Shadwell","White",3311
"Shadwell","White: English, Welsh, Scottish, Northern Irish or British",1944
"Shadwell","Black, Black British, Black Welsh, Caribbean or African",922
"Shadwell","Mixed or Multiple ethnic groups",504
"Shadwell","Other ethnic group",564
...
```

**Religion breakdown for Shadwell ward:**
```bash
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2049_1.data.csv?geography=641730994&select=geography_name,c2021_religion_10_name,obs_value&measures=20100"
```

**Returns:**
```csv
"GEOGRAPHY_NAME","C2021_RELIGION_10_NAME","OBS_VALUE"
"Shadwell","Total: All usual residents",13277
"Shadwell","Muslim",7912
"Shadwell","Christian",2239
"Shadwell","No religion",1977
"Shadwell","Not answered",810
"Shadwell","Hindu",120
"Shadwell","Buddhist",86
"Shadwell","Jewish",62
"Shadwell","Other religion",60
"Shadwell","Sikh",11
```

**Age breakdown for Shadwell ward:**
```bash
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2018_1.data.csv?geography=641730994&select=geography_name,c2021_age_12a_name,obs_value&measures=20100"
```

### Query for ALL Wards in a Local Authority

Get all wards within Tower Hamlets (use parent geography code with TYPE):
```bash
# First find Tower Hamlets LA code
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2041_1/geography/TYPE154.def.sdmx.json?search=*Tower*Hamlets*"
# Returns Nomis ID for Tower Hamlets LA

# Then get all wards within it
curl "https://www.nomisweb.co.uk/api/v01/dataset/NM_2041_1.data.csv?geography={LA_NOMIS_ID}TYPE153&select=geography_name,c2021_eth_20_name,obs_value&measures=20100"
```

### Output Formats

Append to dataset ID:
- `.data.csv` - CSV
- `.data.tsv` - Tab-separated
- `.data.xlsx` - Excel
- `.jsonstat.json` - JSON-stat

### Key Query Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| `geography=` | Area selection (Nomis ID or TYPE) | `641730994` or `TYPE153` |
| `select=` | Choose output columns | `geography_name,obs_value` |
| `measures=` | Value type | `20100` (count), `20301` (percent) |
| `RecordLimit=` | Max rows | `100` |
| `RecordOffset=` | Pagination start | `0` |

---

## 3. ONS Beta API - Census 2021 (Alternative)

**Purpose**: Alternative Census 2021 access with cleaner JSON responses.
**Auth**: None required. **Rate limits**: Published but unspecified. **Cost**: Free.

### Base URL

```
https://api.beta.ons.gov.uk/v1
```

### Available Area Types for Census

| ID | Name | Count |
|----|------|-------|
| `wd` | Electoral wards | 7,638 |
| `lsoa` | Lower Super Output Areas | 35,672 |
| `msoa` | Middle Super Output Areas | 7,264 |
| `ltla` | Lower-tier local authorities | - |
| `rgn` | Regions | - |
| `ctry` | Countries | - |

### Key Dimension IDs

| Dimension ID | Description | Categories |
|-------------|-------------|------------|
| `ethnic_group_tb_20b` | Ethnic group | 20 |
| `religion_tb` | Religion | 10 |
| `health_in_general` | Self-assessed health | 6 |
| `disability` | Day-to-day limitations | 5 |
| `highest_qualification` | Educational attainment | 8 |
| `economic_activity_status_12a` | Labour market status | 12 |
| `legal_partnership_status` | Marital status | 12 |
| `country_of_birth_190a` | Country of birth | 190 |
| `main_language_23a` | Main language | 23 |
| `occupation_current_105a` | Occupation | 105 |
| `industry_current_88a` | Industry sector | 88 |
| `national_identity_all` | National identity | 17 |
| `english_proficiency` | English proficiency | 6 |
| `migrant_ind` | Migration indicator | 5 |

### Search for a Ward

```bash
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/area-types/wd/areas?q=Shadwell"
```

**Response:**
```json
{
  "items": [
    {"id": "E05009332", "label": "Shadwell", "area_type": "wd"}
  ]
}
```

### Get Census Observations

**Ethnicity for Shadwell ward:**
```bash
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/census-observations?area-type=wd,E05009332&dimensions=ethnic_group_tb_20b"
```

**Response:**
```json
{
  "total_observations": 20,
  "observations": [
    {
      "dimensions": [
        {"dimension_id": "ethnic_group_tb_20b", "option": "Asian, Asian British or Asian Welsh: Bangladeshi"}
      ],
      "observation": 7070
    },
    ...
  ]
}
```

**Multiple dimensions at once:**
```bash
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/census-observations?area-type=wd,E05009332&dimensions=religion_tb,health_in_general"
```

### Discovery Endpoints

```bash
# List all population types
curl "https://api.beta.ons.gov.uk/v1/population-types"

# List area types for a population
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/area-types"

# List all dimensions
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/dimensions"

# Search areas by name
curl "https://api.beta.ons.gov.uk/v1/population-types/UR/area-types/wd/areas?q=Shadwell"
```

### Pre-built Datasets (Alternative to census-observations)

```bash
# Get TS008 (Sex) for a specific ward
curl "https://api.beta.ons.gov.uk/v1/datasets/TS008/editions/2021/versions/1/json?area-type=wd,E05009332"
```

---

## 4. ONS Open Geography Portal - Boundaries & Area Lookups

**Purpose**: GeoJSON/Shapefile boundaries, postcode-to-area lookups, area name resolution.
**Auth**: None. **Rate limits**: 2,000 features per request (paginate with resultOffset). **Cost**: Free.

### Base URL

```
https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/
```

### Ward Boundary Lookup

```bash
curl "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_December_2022_Boundaries_UK_BFC/FeatureServer/0/query?where=WD22CD%3D%27E05009332%27&outFields=WD22CD,WD22NM,LAD22NM&f=json&returnGeometry=false"
```

**Response:**
```json
{
  "features": [
    {"attributes": {"WD22CD": "E05009332", "WD22NM": "Shadwell", "LAD22NM": "Tower Hamlets"}}
  ]
}
```

**With GeoJSON boundary polygon:**
```bash
curl "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_December_2022_Boundaries_UK_BFC/FeatureServer/0/query?where=WD22CD%3D%27E05009332%27&outFields=*&f=geojson&outSR=4326"
```

### Key Service Names

| Service | Purpose |
|---------|---------|
| `Wards_December_2022_Boundaries_UK_BFC` | Ward boundaries |
| `Lower_layer_Super_Output_Areas_December_2021_Boundaries_EW_BFC_V10` | LSOA boundaries |
| `Middle_layer_Super_Output_Areas_2021_EW_BFC_V7` | MSOA boundaries |

### Search Ward by Name

```bash
curl "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_December_2022_Boundaries_UK_BFC/FeatureServer/0/query?where=WD22NM+LIKE+%27Shadwell%25%27&outFields=WD22CD,WD22NM,LAD22NM&f=json&returnGeometry=false"
```

### Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `where` | SQL WHERE clause | `WD22NM LIKE 'Shadwell%'` |
| `outFields` | Fields to return | `WD22CD,WD22NM,LAD22NM` |
| `f` | Response format | `json`, `geojson`, `pjson` |
| `outSR` | Spatial reference | `4326` (WGS84) |
| `returnGeometry` | Include geometry? | `true`/`false` |
| `resultOffset` | Pagination | `0`, `2000`, `4000` |
| `returnCountOnly` | Just get count | `true` |

---

## 5. Index of Multiple Deprivation (IMD) 2025

**Purpose**: Deprivation scores, ranks, and deciles at LSOA level across 7 domains.
**Auth**: None (bulk download). **Cost**: Free.

### What IMD Covers (7 Domains)

1. Income deprivation
2. Employment deprivation
3. Education, skills and training
4. Health deprivation and disability
5. Crime
6. Barriers to housing and services
7. Living environment

Plus: overall IMD rank, IMD score, IMD decile, and sub-domain breakdowns.

### Bulk Download

**CSV file with all ranks, scores, deciles, and population denominators (LSOA level, 9.44 MB):**
```
https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv
```

**Source page:**
https://www.gov.uk/government/statistics/english-indices-of-deprivation-2025

### IMD Files Available

| File | Contents |
|------|----------|
| File 1 | IMD ranks and deciles (1.4 MB, Excel) |
| File 2 | Seven domain ranks and deciles (4.14 MB) |
| File 3 | Child and elderly income deprivation (2.18 MB) |
| File 4 | Sub-domain measures (4.55 MB) |
| File 5 | Scores across all indices (5.39 MB) |
| File 6 | Population denominators (2.04 MB) |
| File 7 | ALL data combined (9.44 MB, CSV) |
| File 8 | Underlying indicator values (13.8 MB) |
| File 9 | Transformed domain scores (3.1 MB) |

### IMD by Postcode Lookup

**Interactive tool**: https://imd-by-postcode.opendatacommunities.org/

### IMD Geography Note

IMD is published at **LSOA level**, not ward level. To get ward-level deprivation, you need to:
1. Download IMD at LSOA level
2. Use LSOA-to-ward lookup to map LSOAs to wards
3. Calculate population-weighted ward averages

The LSOA-to-ward lookup is available from the ONS Open Geography Portal.

---

## 6. Mid-Year Population Estimates

**Purpose**: Annual population estimates (more current than census).
**Available via**: Nomis API.

Ward-level mid-year estimates are available on Nomis. Search for datasets:
```bash
curl "https://www.nomisweb.co.uk/api/v01/dataset/def.sdmx.json?search=*mid-year*population*ward*"
```

The ONS publishes ward-level mid-year population estimates as "official statistics in development" at:
https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/datasets/wardlevelmidyearpopulationestimatesexperimental

These are also queryable via Nomis once you find the dataset ID.

---

## 7. Electoral Data

### Open Council Data UK

**URL**: https://opencouncildata.co.uk
**Cost**: Free CSVs of all UK councillors (name, ward, party). Updated annually after May elections.
**Fields in free CSV**: Name, ward, party
**Premium**: Adds email, ONS ward code, next election date, roles/portfolios, monthly updates + API

### Democracy Club API

**URL**: https://developers.democracyclub.org.uk/api/v1
**Auth**: API key required (request during beta)
**Covers**: Upcoming elections, candidates, polling stations, ballot papers
**Does NOT cover**: Historical results or winners

**Endpoints:**
- `/postcode/{postcode}` - Elections/candidates by postcode
- `/elections/` - List all elections
- `/elections/{id}` - Single election details

### Electoral Commission API

**URL**: https://api.electoralcommission.org.uk
**Purpose**: Election information and polling station finder

### Local Election Results

No single comprehensive API exists for historical ward-level election results. Best sources:
- **Open Council Data** CSV downloads (councillor snapshots)
- **London Datastore** (https://data.london.gov.uk) for London elections
- **Local authority websites** publish their own results
- **Electoral Calculus** (https://www.electoralcalculus.co.uk) has commercial data

---

## 8. Complete Pipeline: "Given 'Shadwell, London', Return Everything"

### Step 1: Resolve to Codes (Postcodes.io)

```python
import requests

# Use a postcode in the area, or use places search
resp = requests.get("https://api.postcodes.io/postcodes/E1 0BL")
data = resp.json()["result"]

ward_code = data["codes"]["admin_ward"]     # E05009332
ward_name = data["admin_ward"]              # Shadwell
lsoa_code = data["codes"]["lsoa"]           # E01004297
la_code = data["codes"]["admin_district"]   # E09000030
```

### Step 2: Find Nomis Ward ID

```python
# Search for ward in Nomis
resp = requests.get(
    f"https://www.nomisweb.co.uk/api/v01/dataset/NM_2041_1/geography/TYPE153.def.sdmx.json",
    params={"search": f"*{ward_name}*"}
)
data = resp.json()
codes = data["structure"]["codelists"]["codelist"][0]["code"]
if not isinstance(codes, list):
    codes = [codes]

# Find matching ward by GSS code
nomis_id = None
for code in codes:
    anns = {a["annotationtitle"]: a["annotationtext"] for a in code["annotations"]["annotation"]}
    if anns.get("GeogCode") == ward_code:
        nomis_id = code["value"]
        break
# nomis_id = 641730994
```

### Step 3: Pull Census Data (Nomis API)

```python
def get_census_data(dataset_id, nomis_geography_id, dimension_name):
    """Fetch census data for a ward from Nomis."""
    url = f"https://www.nomisweb.co.uk/api/v01/dataset/{dataset_id}.data.csv"
    resp = requests.get(url, params={
        "geography": nomis_geography_id,
        "measures": "20100",
        "select": f"geography_name,{dimension_name},obs_value"
    })
    return resp.text

# Ethnicity
ethnicity = get_census_data("NM_2041_1", nomis_id, "c2021_eth_20_name")

# Religion
religion = get_census_data("NM_2049_1", nomis_id, "c2021_religion_10_name")

# Age bands
age = get_census_data("NM_2018_1", nomis_id, "c2021_age_12a_name")

# Population total
population = get_census_data("NM_2021_1", nomis_id, "c2021_restype_3_name")

# Health
health = get_census_data("NM_2055_1", nomis_id, "c2021_health_6_name")

# Qualifications
qualifications = get_census_data("NM_2084_1", nomis_id, "c2021_hiqual_8_name")
```

### Alternative Step 3: ONS Beta API (simpler, no Nomis ID needed)

```python
def get_census_ons(ward_gss_code, dimensions):
    """Fetch census data using ONS beta API. Uses GSS code directly."""
    url = "https://api.beta.ons.gov.uk/v1/population-types/UR/census-observations"
    resp = requests.get(url, params={
        "area-type": f"wd,{ward_gss_code}",
        "dimensions": dimensions
    })
    return resp.json()

# Ethnicity
ethnicity = get_census_ons("E05009332", "ethnic_group_tb_20b")

# Religion
religion = get_census_ons("E05009332", "religion_tb")

# Health
health = get_census_ons("E05009332", "health_in_general")
```

### Step 4: Get Deprivation Data

```python
import csv
import io

# Download IMD CSV (do this once, cache locally)
imd_url = "https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv"
resp = requests.get(imd_url)
reader = csv.DictReader(io.StringIO(resp.text))

# Filter for LSOAs in our ward (need LSOA-to-ward mapping)
# Or just look up our specific LSOA
for row in reader:
    if row.get("LSOA code (2021)") == lsoa_code:
        print(f"IMD Rank: {row.get('Index of Multiple Deprivation (IMD) Rank')}")
        print(f"IMD Decile: {row.get('Index of Multiple Deprivation (IMD) Decile')}")
        break
```

### Step 5: Get Ward Boundary

```python
# GeoJSON boundary for mapping
boundary_url = (
    "https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/"
    "Wards_December_2022_Boundaries_UK_BFC/FeatureServer/0/query"
)
resp = requests.get(boundary_url, params={
    "where": f"WD22CD='{ward_code}'",
    "outFields": "*",
    "f": "geojson",
    "outSR": 4326
})
geojson = resp.json()
```

---

## 9. Bulk Download & Local Serving Options

### Datasets to Download Once and Serve Locally

| Dataset | Size | URL / Source |
|---------|------|-------------|
| IMD 2025 (all LSOA data) | 9.44 MB | [GOV.UK direct download](https://assets.publishing.service.gov.uk/media/691ded56d140bbbaa59a2a7d/File_7_IoD2025_All_Ranks_Scores_Deciles_Population_Denominators.csv) |
| Census 2021 Bulk (all topics) | ~2 GB total | [Nomis Census 2021 Bulk](https://www.nomisweb.co.uk/sources/census_2021_bulk) - ZIP files per topic, each containing CSV per geography |
| ONS Postcode Directory | ~1 GB | [ONS Open Geography Portal](https://geoportal.statistics.gov.uk) - maps every UK postcode to all geographies |
| Ward boundaries (GeoJSON) | ~50 MB | ONS Open Geography Portal ArcGIS query with `f=geojson` |
| Open Council Data | ~1 MB | [opencouncildata.co.uk](https://opencouncildata.co.uk) - annual councillor CSV |
| LSOA-to-ward lookup | ~5 MB | [ONS Geography Portal lookups](https://geoportal.statistics.gov.uk) |

### Postcodes.io Self-Hosting

```bash
# Clone and run locally (Docker)
git clone https://github.com/ideal-postcodes/postcodes.io.git
cd postcodes.io
docker-compose up
# Serves on localhost:8000 with full API
```

### Census Bulk Download Structure

Each ZIP from Nomis contains CSVs per geography type:
```
census2021-ts021.zip
  census2021-ts021-oa.csv          # Output Areas
  census2021-ts021-lsoa.csv        # LSOAs
  census2021-ts021-msoa.csv        # MSOAs
  census2021-ts021-ltla.csv        # Local authorities
  census2021-ts021-wd.csv          # Wards (added Jan 2023)
```

---

## 10. Summary: What's Free Without Authentication

| Source | Auth Required? | Data Available |
|--------|---------------|----------------|
| Postcodes.io | No | Postcode to ward/LSOA/MSOA/LA mapping |
| ONS Beta API | No | Full Census 2021 at ward/LSOA level |
| Nomis API | No (25k cell limit) | Full Census 2021 + labour market data |
| Nomis API (registered) | Free account | Same, 1M cell limit |
| ONS Open Geography Portal | No | Boundary polygons, area lookups |
| IMD 2025 CSV | No | Full deprivation data (bulk download) |
| Census Bulk CSVs | No | All Census 2021 topics (bulk download) |
| Open Council Data | No | Councillor name/ward/party CSVs |
| Democracy Club | API key (free) | Upcoming elections, candidates |

---

## 11. Dimension Name Reference for Nomis Queries

When using Nomis `select=` parameter, the dimension column names follow the pattern `c2021_{topic}_{count}_name`. Here are the ones confirmed working:

| Dataset | Dimension column for `select` |
|---------|-------------------------------|
| NM_2041_1 (Ethnicity) | `c2021_eth_20_name` |
| NM_2049_1 (Religion) | `c2021_religion_10_name` |
| NM_2018_1 (Age bands) | `c2021_age_12a_name` |
| NM_2021_1 (Population) | `c2021_restype_3_name` |
| NM_2028_1 (Sex) | Query without select to discover column names |

To discover column names for any dataset, query with `RecordLimit=1` and no `select` parameter - all columns will be shown in the CSV header.

---

## 12. Rate Limits & Practical Considerations

- **Postcodes.io**: No published limit, but be reasonable. Bulk endpoint handles 100 at a time.
- **Nomis API**: Concurrent request limit. With free account, 1M cells per query. Register at nomisweb.co.uk.
- **ONS Beta API**: In beta, may have breaking changes. No auth needed.
- **ONS Geography Portal**: ArcGIS standard - 2,000 features per page, paginate with `resultOffset`.
- **IMD**: Static file download, no rate limit concern.

For a production system, download bulk CSVs and IMD data locally rather than hitting APIs per-request. Use APIs only for: resolving postcodes to area codes, and getting boundary geometries.
