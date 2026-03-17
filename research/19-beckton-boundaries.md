# Beckton Ward Boundaries Research

**Date**: 2026-03-17

## Summary

Retrieved precise boundary polygons for Beckton ward and surrounding geographies from official ONS sources. All boundaries are May 2024 / July 2024 vintage (latest available).

## GSS Codes

| Geography | GSS Code | Name |
|-----------|----------|------|
| Ward | **E05013904** | Beckton |
| Parliamentary Constituency | **E14001576** | West Ham and Beckton |
| Local Authority District | **E09000025** | Newham |
| Old ward code (inactive) | E05000475 | Beckton (pre-2024) |

## Boundary Files Saved

All files in `/home/arthur/beat/web/public/boundaries/`:

| File | Geometry Type | Points | Source |
|------|---------------|--------|--------|
| `beckton-ward.geojson` | Polygon | 54 vertices, closed ring | ONS ArcGIS Wards_May_2024_BGC |
| `west-ham-and-beckton-constituency.geojson` | MultiPolygon (2 parts) | 142 points | ONS ArcGIS PCON_July_2024_BGC |
| `newham-borough.geojson` | MultiPolygon (2 parts) | 224 points | ONS ArcGIS LAD_May_2024_BGC |
| `beckton-lsoas.geojson` | 10 MultiPolygon features | 374 points total | findthatpostcode.uk (ONS data) |

## LSOAs within Beckton Ward

10 Lower Layer Super Output Areas (2021 Census boundaries, best-fit to 2024 wards):

| LSOA21CD | LSOA21NM |
|----------|----------|
| E01003479 | Newham 035A |
| E01003480 | Newham 033A |
| E01003481 | Newham 035B |
| E01003483 | Newham 032A |
| E01003484 | Newham 032B |
| E01003485 | Newham 035C |
| E01003486 | Newham 033C |
| E01003487 | Newham 033D |
| E01003513 | Newham 035D |
| E01034205 | Newham 033E |

## Data Sources

- **Ward boundary**: ONS Open Geography Portal ArcGIS REST API
  - `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Wards_May_2024_Boundaries_UK_BGC/FeatureServer/0/query?where=WD24NM='Beckton'&outFields=*&f=geojson`
- **Constituency boundary**: ONS Open Geography Portal
  - `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Westminster_Parliamentary_Constituencies_July_2024_Boundaries_UK_BGC/FeatureServer/0/query?where=PCON24NM='West Ham and Beckton'&outFields=*&f=geojson`
- **Borough boundary**: ONS Open Geography Portal
  - `https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/Local_Authority_Districts_May_2024_Boundaries_UK_BGC/FeatureServer/0/query?where=LAD24NM='Newham'&outFields=*&f=geojson`
- **LSOA lookup**: ONS ArcGIS LSOA21_WD24_LAD24_EW_LU lookup table
- **LSOA boundaries**: findthatpostcode.uk (wraps ONS boundary data)
- **Ward code confirmation**: postcodes.io (postcode E6 5XT)

## Boundary Details

### Beckton Ward
- **Area**: ~5.32 km² (Shape__Area from ONS)
- **Perimeter**: ~10.9 km
- **Centroid**: 0.068424 E, 51.51748 N
- **Geometry**: Simple Polygon (not multi), 54 vertices, properly closed
- **BGC variant** (Boundaries Generalised Clipped) - suitable for web display, slightly simplified vs full resolution

### Key Notes
- The ward boundary is the **May 2024** revision, which is current
- The constituency (West Ham and Beckton) was newly created for the 2024 general election
- Newham borough boundary is a MultiPolygon with 2 parts (main borough + small island near Royal Docks)
- LSOA boundaries are 2021 Census vintage; the ward-to-LSOA mapping uses ONS "best fit" methodology
- All coordinates are in WGS84 (EPSG:4326), which is what Leaflet/Mapbox expect

## Usage in the App

Load the ward boundary in the map component:
```js
const response = await fetch('/boundaries/beckton-ward.geojson');
const wardBoundary = await response.json();
// Add to Leaflet/Mapbox as a GeoJSON layer
```

Available at these URLs when served:
- `https://beat-call.partners/boundaries/beckton-ward.geojson`
- `https://beat-call.partners/boundaries/west-ham-and-beckton-constituency.geojson`
- `https://beat-call.partners/boundaries/newham-borough.geojson`
- `https://beat-call.partners/boundaries/beckton-lsoas.geojson`
