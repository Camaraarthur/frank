# Research: Official Politician Photo Sources

Date: 2026-03-17

Frank needs to show a face next to every representative name. This document maps out where to get official headshots per country, with exact API endpoints and URL patterns.

---

## UK

### Parliament UK Members API (BEST SOURCE - MPs and Lords)

The Members API returns a `thumbnailUrl` field for every member.

**Search endpoint:**
```
GET https://members-api.parliament.uk/api/Members/Search?skip=0&take=20
```

Each result includes:
```json
{
  "value": {
    "id": 4514,
    "nameDisplayAs": "Keir Starmer",
    "thumbnailUrl": "https://members-api.parliament.uk/api/Members/4514/Thumbnail"
    ...
  }
}
```

**Direct photo URL pattern:**
```
https://members-api.parliament.uk/api/Members/{memberId}/Thumbnail
```

- Returns JPEG image directly (verified -- returns image/jpeg)
- No API key required
- Covers both Commons and Lords
- Example: `https://members-api.parliament.uk/api/Members/172/Thumbnail` (Diane Abbott)

**Individual member data:**
```
GET https://members-api.parliament.uk/api/Members/{id}
```
Returns full member data including `thumbnailUrl` in the response.

### Local Councillors (UK)

- ModernGov pages vary by council; no consistent API for photos
- No reliable national source for councillor headshots

---

## United States

### unitedstates/images on GitHub (BEST SOURCE - Congress)

Public domain images scraped from the Government Printing Office.

**URL pattern:**
```
https://unitedstates.github.io/images/congress/{size}/{bioguideId}.jpg
```

**Available sizes:**
- `original` -- typically 675x825px
- `450x550` -- medium
- `225x275` -- thumbnail

**Examples:**
```
https://unitedstates.github.io/images/congress/original/B000444.jpg
https://unitedstates.github.io/images/congress/225x275/B000444.jpg
```

- Verified working (returns JPEG)
- Public domain
- Uses Bioguide ID as the key
- Served via GitHub Pages -- no API key needed

**GitHub repo:** https://github.com/unitedstates/images

### Bioguide (Official Congress Portraits)

Official portraits at bioguide.congress.gov. The site returned 403 on direct API access, but the unitedstates/images repo scrapes from this source. Use the GitHub Pages URLs above instead.

### Congress.gov API

```
GET https://api.congress.gov/v3/member/{bioguideId}?api_key={key}
```

- Does NOT return photo URLs in the response
- Useful for getting bioguide IDs to use with the unitedstates/images URLs above
- Requires API key (free registration)

### GovTrack

**Photo URL pattern:**
```
https://www.govtrack.us/static/legislator-photos/{govtrackId}-200px.jpeg
```

- Uses GovTrack's own numeric ID (not bioguide)
- `-200px` suffix for 200px wide version
- Other sizes likely available (e.g., `-100px`)
- No API key needed, but the GovTrack API itself does NOT return photo URLs in its JSON response

### Google Civic Information API

```
GET https://www.googleapis.com/civicinfo/v2/representatives?address={address}&key={apiKey}
```

- The `representatives` endpoint returns officials with a `photoUrl` field
- Not all officials have photos
- Requires Google API key
- Covers federal, state, and local officials -- useful for broad coverage
- Documentation at: https://developers.google.com/civic-information/docs/v2/representatives

### Open States (US State Legislators)

```
GET https://v3.openstates.org/people?jurisdiction={state}&apikey={key}
```

- Covers all 50 states, DC, Puerto Rico
- API key required (free registration)
- Response likely includes image URLs (could not verify due to auth, but Open States historically includes `image` field)
- API docs: https://docs.openstates.org/api-v3/
- Now operated by Plural Policy (open.pluralpolicy.com)

---

## Global / Fallback: Wikidata + Wikimedia Commons

### Strategy

Most notable politicians worldwide have a Wikidata entity with a P18 (image) property. The image filename from Wikidata can be turned into a direct image URL via Wikimedia Commons.

### Step 1: Get image filename from Wikidata

```
GET https://www.wikidata.org/w/api.php?action=wbgetentities&ids={wikidataId}&props=claims&format=json
```

Navigate the JSON: `entities.{id}.claims.P18[0].mainsnak.datavalue.value` gives the image filename.

### Step 2: Convert filename to image URL

```
https://commons.wikimedia.org/wiki/Special:FilePath/{filename}
```

Example:
```
Filename: "Keir Starmer official portrait.jpg"
URL: https://commons.wikimedia.org/wiki/Special:FilePath/Keir_Starmer_official_portrait.jpg
```

Spaces in filenames become underscores. The `Special:FilePath` URL redirects to the actual image on Wikimedia's CDN.

### Alternative: Wikipedia API for thumbnails

```
GET https://en.wikipedia.org/w/api.php?action=query&titles={articleTitle}&prop=pageimages&format=json&pithumbsize=300
```

Returns a `thumbnail.source` URL at the requested size. Useful when you have the Wikipedia article title but not the Wikidata ID.

### Coverage

Wikidata/Commons is the best fallback for any country. Nearly all national legislators worldwide have entries. The main limitation is that images have varying licenses (check `P6216` for copyright status).

---

## Brazil

### Camara dos Deputados API (BEST SOURCE - Federal Deputies)

**Deputy list:**
```
GET https://dadosabertos.camara.leg.br/api/v2/deputados
```

**Individual deputy:**
```
GET https://dadosabertos.camara.leg.br/api/v2/deputados/{id}
```

Response includes `urlFoto` field:
```json
{
  "dados": {
    "urlFoto": "https://www.camara.leg.br/internet/deputado/bandep/204554.jpg"
    ...
  }
}
```

**Direct photo URL pattern:**
```
https://www.camara.leg.br/internet/deputado/bandep/{deputyId}.jpg
```

- Verified working (returns JPEG, ~30KB)
- No API key required
- The API is well-documented at https://dadosabertos.camara.leg.br/swagger/api.html

### Brazilian Senate

Photo pattern (not API-verified):
```
https://www.senado.leg.br/senadores/img/fotos-oficiais/senador{id}.jpg
```

Needs further verification.

---

## France

### Assemblee Nationale

Official website at assemblee-nationale.fr has deputy photos but returned rate-limit errors (429) during research. Photo URL pattern could not be confirmed.

Likely pattern based on historical data:
```
https://www2.assemblee-nationale.fr/content/download/{photoId}/file/photo_depute_{deputyId}.jpg
```
or
```
https://www.assemblee-nationale.fr/dyn/deputes/{deputyId}/photo
```

Needs further verification.

### NosDeputes.fr

The nosdeputes.fr site was returning 503 errors during research. Historically, it provides:

**Photo URL pattern:**
```
https://www.nosdeputes.fr/depute/photo/{slug}
```
or
```
https://www.nosdeputes.fr/{slug}/photo
```

Where `{slug}` is the deputy's URL-friendly name (e.g., `olivier-faure`).

**API endpoint:**
```
GET https://www.nosdeputes.fr/{slug}/json
```

The JSON historically includes a `photo` or `url_photo` field. Site was unavailable during testing (503). Also covers senators via nossenateurs.fr.

---

## Canada

### Open North Represent API (BEST SOURCE - All Levels)

```
GET https://represent.opennorth.ca/representatives/?point={lat},{lng}
GET https://represent.opennorth.ca/representatives/{set}/
```

Response includes `photo_url` field (not guaranteed for all representatives).

- No API key required
- Covers federal, provincial, and municipal representatives
- `photo_url` is not present in all responses (depends on the data source)
- API docs: https://represent.opennorth.ca/api/

### Our Commons (Federal MPs)

**Photo URL pattern:**
```
https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/{parliament}/{LastNameFirstName}_{PartyAbbr}.jpg
```

Example:
```
https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/43/WilsonRaybouldJody_Ind.jpg
```

- `{parliament}` is the parliament number (e.g., 44 for current)
- Name format is `LastnameFirstname` concatenated
- `{PartyAbbr}` is the party abbreviation (Lib, CPC, NDP, BQ, GP, Ind)
- This pattern is fragile (depends on name formatting and party changes)

---

## Summary: Recommended Photo Sources by Country

| Country | Primary Source | API? | Key Required? | Coverage |
|---------|---------------|------|---------------|----------|
| UK | Parliament Members API `/Thumbnail` | Yes | No | All MPs & Lords |
| US (Federal) | unitedstates.github.io/images | No (static) | No | All Congress members |
| US (State) | Open States API | Yes | Yes (free) | All state legislators |
| US (All levels) | Google Civic Info API | Yes | Yes (free) | Federal + state + local |
| Brazil | Camara API `urlFoto` | Yes | No | Federal deputies |
| France | nosdeputes.fr | Yes | No | National Assembly |
| Canada | Represent API `photo_url` | Yes | No | All levels |
| Any country | Wikidata P18 + Commons | Yes | No | Most notable politicians |

## Implementation Priority for Beat/Frank

1. **Wikidata/Commons** -- implement first as universal fallback. Works for any country.
2. **UK Parliament API** -- simple, reliable, no key needed.
3. **US unitedstates/images** -- static URLs, very reliable.
4. **Brazil Camara API** -- built into the existing API response.
5. **Canada Represent API** -- already provides photo_url when available.
6. **Google Civic Info** -- good for US local officials not covered elsewhere.

## Caching Recommendation

All photo URLs should be cached locally. Politicians' official photos change rarely (typically only after a new election or official portrait session). A cache TTL of 30-90 days is reasonable, with manual refresh capability.
