import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { geoIdentity, geoPath } from 'd3-geo';
import { feature } from 'topojson-client';
import { presimplify, quantile, simplify } from 'topojson-simplify';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourceTopology = JSON.parse(readFileSync(resolve(root, 'node_modules/world-atlas/countries-50m.json'), 'utf8'));

const selected = [
  { id: 'japan', name: 'Japan', capital: 'Tokyo', coordinates: [139.6917, 35.6895] },
  { id: 'philippines', name: 'Philippines', capital: 'Manila', coordinates: [120.9842, 14.5995] },
  { id: 'italy', name: 'Italy', capital: 'Rome', coordinates: [12.4964, 41.9028] },
  { id: 'iceland', name: 'Iceland', capital: 'Reykjavík', coordinates: [-21.9426, 64.1466] },
  { id: 'chile', name: 'Chile', capital: 'Santiago', coordinates: [-70.6693, -33.4489] },
  { id: 'india', name: 'India', capital: 'New Delhi', coordinates: [77.209, 28.6139] },
  { id: 'australia', name: 'Australia', capital: 'Canberra', coordinates: [149.13, -35.2809] },
  { id: 'brazil', name: 'Brazil', capital: 'Brasília', coordinates: [-47.8825, -15.7942] },
];

const selectedNames = new Set(selected.map((country) => country.name));
const selectedTopology = {
  ...sourceTopology,
  objects: {
    countries: {
      ...sourceTopology.objects.countries,
      geometries: sourceTopology.objects.countries.geometries.filter((geometry) =>
        selectedNames.has(geometry.properties?.name),
      ),
    },
  },
};
const weightedTopology = presimplify(selectedTopology);
const topology = simplify(weightedTopology, quantile(weightedTopology, 0.58));
const collection = feature(topology, topology.objects.countries);

const records = selected.map((country) => {
  const geometry = collection.features.find((candidate) => candidate.properties?.name === country.name);
  if (!geometry) throw new Error('Missing Natural Earth geometry for ' + country.name);
  const projection = geoIdentity()
    .reflectY(true)
    .fitExtent(
      [
        [44, 66],
        [256, 284],
      ],
      geometry,
    );
  const path = geoPath(projection).digits(1);
  const capital = projection(country.coordinates);
  const centroid = path.centroid(geometry);
  return {
    id: country.id,
    label: country.name,
    capital: country.capital,
    coordinates: country.coordinates,
    d: path(geometry),
    capitalPoint: capital.map((value) => Number(value.toFixed(2))),
    centroid: centroid.map((value) => Number(value.toFixed(2))),
  };
});

const output = `// Generated from Natural Earth public-domain Admin 0 boundaries via world-atlas.
// Run: node scripts/generate-atlas-data.mjs

export const atlasCountries = ${JSON.stringify(records, null, 2)} as const;

export type AtlasCountryId = (typeof atlasCountries)[number]['id'];
`;

const target = resolve(root, 'packages/motus-ui/src/maps/atlasData.ts');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, output);
console.log('Generated ' + records.length + ' country paths at ' + target);
